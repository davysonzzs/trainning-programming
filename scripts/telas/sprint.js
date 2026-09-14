'use strict';

const fs = require('fs');
const path = require('path');
const { C, INN, LINE, bold, clr, dim, row, stripAnsi } = require('../core/ansi');
const { APP } = require('../core/app');
const { LEVELS, MSGS_AMBIENTE, NPC, PROJECTS_DIR, contarProjetos, getLevel, haAlteracoesNaoSalvas, loadMessages, loadProgress, loadSprint, persistirJogo, pushMessage, saveProgress, saveSprint, tempoAtivoTotal } = require('../core/dados');
const { timerLine } = require('../core/draw-utils');
const { branchEsperadaProjeto, gitBranchAtual } = require('../core/gitflow');
const { rodarLint, rodarTestes } = require('../core/lint');
const { goTo, render } = require('../core/screen');
const { wrapPrefixedColored } = require('../core/texto');
const { precisaRevisao1a1 } = require('./revisao1a1');

// ─────────────────────────────────────────────────────────────────────────
//  MODELO: a sprint agora e um LOTE de PROJETOS (1 a 3), nao mais um unico
//  projeto quebrado em tarefas. O QA te da o lote inteiro de uma vez; voce
//  escolhe a ordem, e pode trabalhar em outro enquanto um espera o QA.
//  Cada projeto e uma unidade so — sem sub-tarefas dentro dele.
//
//  s.projetos            lista de projetos do lote atual + entregues
//  s.projetoAtivoId       id do projeto com o cronometro rodando agora (so 1)
//  s.projetoAtual         espelho do rel do projeto ativo (outras telas leem isso)
//  s.tempoAtivoMs/         cronometro global, mas sempre do projeto ativo — o
//  s.sessaoIniciadaEm      tempo junta no proprio projeto quando ele pausa
//  ("start <id>" troca ativo: salva o tempo no projeto que sai, zera pro que entra)
//
//  Dois relogios independentes, um por projeto e um por lote:
//  - estimativaHoras (por projeto) — cronometro de horas ativas, piso 1h,
//    cresce com a complexidade do README. Estourou -> checkOvertime().
//  - loteAtribuidoEm/lotePrazoDias/loteExtensoesQA (do LOTE inteiro) —
//    prazo em dias corridos: 3/7/15 conforme quantos projetos foram
//    juntados nesse lote (integrador sempre 15). Estourou -> checkPrazoSprint().
// ─────────────────────────────────────────────────────────────────────────

// Texto curto do prazo do lote pro cabecalho do Painel de Sprint — mesma
// ideia do timer de horas (timerLine), so que em dias corridos.
function prazoLoteTexto(s) {
  if (!s.loteAtribuidoEm || !s.lotePrazoDias) return clr(C.gray, 'Prazo: —');
  const prazo     = s.lotePrazoDias;
  const decorrido = Math.floor((Date.now() - new Date(s.loteAtribuidoEm).getTime()) / 86400000);
  const restam    = prazo - decorrido;
  if (restam <= 0) return clr(C.red, `Prazo: ESTOURADO (${prazo}d corridos)`);
  const cor = restam <= Math.max(1, Math.ceil(prazo * 0.2)) ? C.yellow : C.gray;
  return clr(cor, `Prazo: ${restam}d restantes de ${prazo}d corridos`);
}

function buildSprint(s) {
  const p        = loadProgress();
  const projetos = s.projetos || [];
  const backlog  = projetos.filter(pr => pr.status==='backlog');
  const doing    = projetos.filter(pr => pr.status==='doing');
  const revisao  = projetos.filter(pr => pr.status==='revisao' || pr.status==='aprovado');
  const done     = projetos.filter(pr => pr.status==='done');
  const rows     = Math.max(backlog.length, doing.length, revisao.length, done.length, 1);
  const pausado  = !s.sessaoIniciadaEm;
  const COL      = 18;   // 4 colunas de 18 + 3 separadores "│" + 1 indent = 76 = INN
  const msgs     = loadMessages().slice(-3);
  // troca a cada 15s de tempo REAL, nao a cada frame — como a tela agora
  // redesenha sozinha (150ms), usar APP.frame direto fazia a mensagem
  // ambiente trocar a cada tick, parecendo um monte de mensagem piscando.
  const aMsg     = MSGS_AMBIENTE[Math.floor(Date.now() / 15000) % MSGS_AMBIENTE.length];

  function cell(pr, col) {
    if (!pr) return ' '.repeat(col);
    const s2 = `[${pr.id}] ${pr.titulo}`;
    return (s2.length > col ? s2.slice(0,col-1)+'…' : s2).padEnd(col);
  }

  function comSufixo(pr, sufixo) {
    if (!pr) return ' '.repeat(COL);
    const s2 = `[${pr.id}] ${pr.titulo}${sufixo}`;
    return (s2.length > COL ? s2.slice(0,COL-1)+'…' : s2).padEnd(COL);
  }

  function doingCell(pr) {
    if (!pr) return ' '.repeat(COL);
    const ativo = pr.id === s.projetoAtivoId;
    const suf   = !ativo ? ' (parado)' : pausado ? ' (pausado)' : ` (${Math.floor(tempoAtivoTotal(s)/60000)}m)`;
    return comSufixo(pr, suf);
  }

  function revisaoCell(pr) {
    if (!pr) return ' '.repeat(COL);
    if (pr.status === 'aprovado') return comSufixo(pr, ' ✔ concluir');
    const min = Math.floor((Date.now()-new Date(pr.enviadoRevisaoEm||Date.now()).getTime())/60000);
    const tempo = min >= 1440 ? Math.floor(min/1440)+'d' : min >= 60 ? Math.floor(min/60)+'h' : min>0 ? min+'m' : '';
    return comSufixo(pr, ` ⏳${tempo}`);
  }

  // pad ANTES de colorir, pra não contar os códigos ANSI como largura
  function padVisible(str, width) {
    return str + ' '.repeat(Math.max(0, width - stripAnsi(str).length));
  }

  function quadroRow(a, b, c, d) { return row(` ${a}│${b}│${c}│${d}`); }

  const sepLine = clr(C.gray, '─'.repeat(COL) + '┼' + '─'.repeat(COL) + '┼' + '─'.repeat(COL) + '┼' + '─'.repeat(COL));

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  const naoSalvo = haAlteracoesNaoSalvas() ? '  ' + clr(C.yellow, '● não salvo') : '  ' + clr(C.gray, '✔ salvo');
  o += row(` ${bold('DEVTECH SISTEMAS S.A.')}  ${' '.repeat(26)}Dev: ${bold(p.name)}  XP: ${clr(C.cyan,String(p.xp))}${naoSalvo}`) + '\n';
  o += row(` Sprint ${clr(C.gray,String(s.sprintNum||1))}${pausado ? '  '+clr(C.yellow,'[PAUSADO]') : ''}  ${prazoLoteTexto(s)}`) + '\n';
  o += row(` ${s.projetoAtual ? clr(C.gray,'ativo: '+s.projetoAtual) : clr(C.gray,'nenhum projeto ativo')}`) + '\n';
  o += row(` ${timerLine(s)}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += quadroRow(
    padVisible(bold(clr(C.cyan,'BACKLOG')), COL),
    padVisible(bold(clr(C.yellow,'ANDAMENTO')), COL),
    padVisible(bold(clr(C.magenta,'EM REVISÃO')), COL),
    bold(clr(C.green,'CONCLUÍDO')),
  ) + '\n';
  o += row(` ${sepLine}`) + '\n';
  for (let i = 0; i < rows; i++) {
    const bd = cell(backlog[i], COL);
    const dd = doingCell(doing[i]);
    const rv = revisaoCell(revisao[i]);
    const dn = cell(done[i], COL);
    o += quadroRow(
      bd,
      doing[i]   ? clr(C.yellow,dd)  : dd,
      revisao[i] ? clr(C.magenta,rv) : rv,
      done[i]    ? clr(C.green,dn)   : dn,
    ) + '\n';
  }
  o += `╠${LINE}╣\n`;
  o += row(bold(' MENSAGENS')) + '\n';
  o += `╠${LINE}╣\n`;
  const linhaMsg = (tag, texto) =>
    wrapPrefixedColored('', `${tag} ${texto}`, INN - 1, 2)
      .map(l => row(` ${clr(C.gray, l)}`)).join('\n');
  if (msgs.length === 0) {
    o += linhaMsg(aMsg[0].tag, aMsg[1]) + '\n';
  } else {
    for (const m of msgs) o += linhaMsg(m.tag, m.texto) + '\n';
    o += linhaMsg(aMsg[0].tag, aMsg[1]) + '\n';
  }
  o += `╠${LINE}╣\n`;
  if (devEstaBloqueado(s)) {
    o += row(clr(C.cyan, '  💡 QA segurando tudo — sem nada pra iniciar agora. Boa hora pra estudar: tecla [5] Trilha de Estudos.')) + '\n';
    o += `╠${LINE}╣\n`;
  }
  if (APP.lastFb) o += row(` ${APP.lastFb}`) + '\n', o += `╠${LINE}╣\n`;
  o += row(dim('  ver/start/revisar <nº>   concluir <nº>   commit <mensagem>')) + '\n';
  o += row(dim('  pausar   retomar')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${clr(C.cyan,'>')} ${APP.inputBuf}${clr(C.gray,'█')}`) + '\n';
  o += `╚${LINE}╝\n`;
  o += dim('  Esc  voltar ao menu\n');
  return o;
}

function pick(arr, ...args) {
  return arr[Math.floor(Math.random() * arr.length)](...args);
}

// hash curto no estilo de commit git (7 chars hex) — so pra dar a
// sensacao de um commit de verdade na aba Pull Requests, sem tocar em
// nenhum repositorio git real.
function hashCommitFalso() {
  return Math.random().toString(16).slice(2, 9);
}

// O dev não escolhe o projeto — recebe o que tá na fila do próprio nível.
// Acha o primeiro projeto ainda não entregue dentro da pasta do nível atual,
// pulando os que ja estao em s.projetos (backlog, em andamento ou ja entregues).
function proximoProjetoNivel(excluir) {
  const p  = loadProgress();
  const lv = getLevel(p.xp).lv;
  const nivelDir = path.join(PROJECTS_DIR, lv.folder);
  if (!fs.existsSync(nivelDir)) return null;
  const projetos = fs.readdirSync(nivelDir)
    .filter(pj => fs.statSync(path.join(nivelDir, pj)).isDirectory())
    .sort();
  for (const pj of projetos) {
    const rel = `${lv.folder}/${pj}`;
    if (excluir && excluir.includes(rel)) continue;
    if (!fs.existsSync(path.join(nivelDir, pj, '.concluido')))
      return { nivel: lv.folder, pj, rel };
  }
  return null; // tudo entregue neste nivel
}

// Solta um lote novo (1 a 3 projetos, na ordem da trilha) quando o lote
// atual acabou (tudo 'done' ou nao tem nenhum ainda) — so acontece quando
// o jogador termina a sprint (concluir todos), nunca no meio dela.
function projetosDisponiveisNoNivel(nivelFolder, jaNoJogo) {
  const nivelDir = path.join(PROJECTS_DIR, nivelFolder);
  if (!fs.existsSync(nivelDir)) return [];
  return fs.readdirSync(nivelDir)
    .filter(pj => fs.statSync(path.join(nivelDir, pj)).isDirectory())
    .sort()
    .map(pj => ({ nivel: nivelFolder, pj, rel: `${nivelFolder}/${pj}` }))
    .filter(pr => !jaNoJogo.has(pr.rel) && !fs.existsSync(path.join(PROJECTS_DIR, pr.rel, '.concluido')));
}

function distribuirNovoLote(s) {
  const p  = loadProgress();
  const { lv, idx } = getLevel(p.xp);
  const jaNoJogo = new Set((s.projetos||[]).map(pr => pr.rel));

  // O XP pode passar da nota de corte do proximo nivel antes dele ter
  // projeto de verdade pronto (so Estagiario tem os 30 completos por
  // enquanto — os outros niveis sao so um README "aguardando novo
  // cliente", ver docs/plan.md). Em vez de travar o jogador sem backlog,
  // desce pelos niveis anteriores ate achar um que ainda tenha projeto —
  // ele continua produtivo no nivel que EXISTE, nao no que o XP diz.
  let nivelEscolhido = lv.folder, disponiveis = projetosDisponiveisNoNivel(lv.folder, jaNoJogo);
  for (let i = idx; disponiveis.length === 0 && i >= 0; i--) {
    nivelEscolhido = LEVELS[i].folder;
    disponiveis = projetosDisponiveisNoNivel(nivelEscolhido, jaNoJogo);
  }
  if (!disponiveis.length) return 0;

  const qtd = Math.min(disponiveis.length, 1 + Math.floor(Math.random()*3)); // 1 a 3
  const escolhidos = disponiveis.slice(0, qtd);
  s.sprintNum = (s.sprintNum||0) + 1;
  s.projetos = s.projetos || [];
  s.nextId = s.nextId || 1;
  for (const prox of escolhidos) {
    const meta = metaDoProjeto(prox.nivel, prox.pj);
    s.projetos.push({
      id: s.nextId++, nivel: prox.nivel, pj: prox.pj, rel: prox.rel,
      titulo: prox.pj.replace(/^\d+-/, '').replace(/-/g, ' '),
      sprintLabel: meta.sprint || `Sprint ${s.sprintNum}`,
      // piso de 1h — nenhum projeto (nem o mais curtinho) conta menos que
      // isso pro cronometro; o README pode pedir mais, nunca menos.
      estimativaHoras: Math.max(1, meta.estimativaHoras || 2),
      status: 'backlog',
      tempoAtivoMs: 0, extensoesQA: 0,
    });
  }
  // Prazo agora e do LOTE inteiro (nao mais por projeto) — reflete o que
  // acabou de entrar no backlog como um bloco so.
  s.loteAtribuidoEm = new Date().toISOString();
  s.lotePrazoDias   = prazoLotePara(escolhidos);
  s.loteExtensoesQA = 0;
  pushMessage(NPC.qa, `Sprint ${s.sprintNum}: coloquei ${escolhidos.length} projeto(s) no seu backlog — ${escolhidos.map(e=>e.pj).join(', ')}. Prazo: ${s.lotePrazoDias} dias corridos.`);
  return escolhidos.length;
}

// Garante que sempre tem algo pra fazer: so busca lote novo quando o
// anterior foi inteiramente entregue (nunca no meio, mesmo que o dev
// termine um projeto e outros do lote ainda estejam abertos).
function garantirLote(s) {
  const abertos = (s.projetos||[]).some(pr => pr.status !== 'done');
  if (abertos) return false;
  return distribuirNovoLote(s) > 0;
}

// Bloqueado de verdade: nenhum projeto pra iniciar/continuar/concluir —
// so resta esperar o QA responder alguma revisão. Bom momento pra estudar.
function devEstaBloqueado(s) {
  return !(s.projetos||[]).some(pr => ['backlog','doing','aprovado'].includes(pr.status));
}

// Prazo da sprint (dias corridos) agora e do LOTE inteiro — depende de
// quantos projetos foram juntados nele, nao do nivel: um lote de 1 projeto
// da pra fechar rapido, um de 3 precisa de mais fôlego de calendario. O
// projeto integrador (mistura tudo que foi praticado na fase inteira)
// sempre pede o prazo mais largo, mesmo vindo sozinho no lote.
function prazoLotePara(escolhidos) {
  const ehIntegrador = escolhidos.some(pr => /integrador/i.test(pr.pj));
  if (ehIntegrador || escolhidos.length >= 3) return 15;
  if (escolhidos.length === 2) return 7;
  return 3;
}

// "1h 30m" / "2h" / "2h 30m" → horas decimais (1.5 / 2 / 2.5)
function parseEstimativaTexto(txt) {
  const m = txt.match(/(\d+)\s*h(?:\s*(\d+)\s*m)?/i);
  if (!m) return null;
  const h = parseInt(m[1], 10), min = m[2] ? parseInt(m[2], 10) : 0;
  return +(h + min / 60).toFixed(2);
}

// O nome da sprint e a estimativa não são o dev que inventa — já vêm
// definidos no README do projeto (é o QA/PM que decide isso).
function extrairTarefas(raw) {
  const linhas = raw.split('\n');
  let dentro = false;
  const tarefas = [];
  for (const ln of linhas) {
    if (/^#+\s*.*tarefas/i.test(ln)) { dentro = true; continue; }
    if (dentro && /^#+\s/.test(ln)) break; // proxima secao do README, para
    if (!dentro) continue;
    const cmd = ln.match(/^add\s+(.+)/i);
    const chk = ln.match(/^-\s*\[[ xX]?\]\s*(.+)/);
    if (cmd) tarefas.push(cmd[1].trim());
    else if (chk) tarefas.push(chk[1].trim().replace(/`/g, ''));
  }
  return tarefas;
}

function metaDoProjeto(nivel, pj) {
  const readmePath = path.join(PROJECTS_DIR, nivel, pj, 'README.md');
  if (!fs.existsSync(readmePath)) return {};
  const raw = fs.readFileSync(readmePath, 'utf8');
  const sprintM = raw.match(/\*\*Sprint:\*\*\s*(.+)/);
  const estM    = raw.match(/\*\*Estimativa:\*\*\s*(.+)/);
  return {
    sprint: sprintM ? sprintM[1].trim() : null,
    estimativaHoras: estM ? parseEstimativaTexto(estM[1]) : null,
    tarefas: extrairTarefas(raw),
  };
}

const RESP = {
  start:     [(id)=>[NPC.lead,`#${id} em andamento. Avisa se travar.`], (id)=>[NPC.dev,`Boa sorte no #${id}!`]],
  revisar:   [(id)=>[NPC.qa,`Recebi o #${id}, vou dar uma olhada. Pode levar um tempo.`], (id)=>[NPC.dev,`Mandei o #${id} pra revisão. Torcendo.`]],
  aprovado:  [(id)=>[NPC.qa,`Testei o #${id}. Passou, aprovado! Pode concluir.`], (id)=>[NPC.lead,`#${id} aprovado no code review.`]],
  pausar:    [()=>[NPC.dev,`Ate mais!`], ()=>[NPC.lead,`Não esquece de commitar antes de sair.`]],
  retomar:   [()=>[NPC.dev,`Bem-vindo de volta!`], ()=>[NPC.lead,`Bora terminar.`]],
};

// Simula o tempo real que o QA leva pra olhar o projeto — de minutos a
// alguns dias (a maioria resolve rapido, mas de vez em quando demora, igual
// review de verdade). A resolucao e por DATA (revisaoResolveEm), nao por
// setTimeout em memoria — sobrevive a fechar o simulador antes da hora,
// resolvendo sozinha na proxima vez que o loop rodar (mesmo que seja so
// quando o jogador abrir o app de novo, dias depois).
function delayRevisaoMs() {
  const min3 = 3 * 60000, dias2 = 2 * 86400000;
  // Math.random()*Math.random() enviesa pro lado curto (a maioria das
  // revisoes resolve rapido), mas ainda deixa escapar ate 2 dias de vez
  // em quando — nem todo PR e revisado na hora, nem no jogo.
  return min3 + Math.random() * Math.random() * dias2;
}

function checkRevisoesQA() {
  const s = loadSprint();
  if (!s) return;
  let mudou = false;

  // sempre tem algo pra fazer — se o lote anterior foi todo entregue,
  // solta o proximo antes de checar revisoes.
  if (garantirLote(s)) mudou = true;

  for (const proj of (s.projetos||[])) {
    if (proj.status !== 'revisao') continue;

    // projeto preso de uma sessao anterior (fechada antes da hora, ou de
    // uma versao mais antiga do simulador) — resolve agora mesmo.
    if (!proj.revisaoResolveEm) {
      proj.revisaoResolveEm = new Date().toISOString();
      proj.revisaoAprovada  = Math.random() < 0.7;
      if (!proj.revisaoAprovada) proj.motivoReprovacao = 'Encontrei um problema durante a revisão.';
    }
    if (Date.now() < new Date(proj.revisaoResolveEm).getTime()) continue;

    // Prioridade continua com o que o dev estiver fazendo agora — resolver
    // uma revisao NUNCA mexe no projeto ativo/cronometro de outro.
    if (proj.revisaoAprovada) {
      proj.status = 'aprovado'; proj.aprovadoEm = new Date().toISOString();
      const [n, t] = pick(RESP.aprovado, proj.id); pushMessage(n, t);
      APP._lastRevisaoMsg = clr(C.green, `★ #${proj.id} "${proj.titulo}" aprovado pelo QA! Roda "concluir ${proj.id}".`);
    } else {
      proj.status = 'doing';
      const motivo = proj.motivoReprovacao || 'Encontrei um problema durante a revisão.';
      pushMessage(NPC.qa, `#${proj.id} voltou — ${motivo}`);
      APP._lastRevisaoMsg = clr(C.yellow, `#${proj.id} "${proj.titulo}" voltou pra desenvolvimento — ${motivo}`);
    }
    delete proj.revisaoResolveEm;
    delete proj.revisaoAprovada;
    delete proj.motivoReprovacao;
    mudou = true;
  }

  if (mudou) {
    saveSprint(s);
    if (APP.screen === 'sprint') APP.lastFb = APP._lastRevisaoMsg;
  }
}

function sprintCommand(input, s) {
  const parts = input.trim().split(/\s+/);
  const cmd   = parts[0]?.toLowerCase();
  // aspas sao opcionais aqui (nao e um shell) — se o jogador envolver o
  // texto em "..." ou '...' por habito, elas sao removidas em vez de
  // virarem parte literal do nome.
  const rest  = parts.slice(1).join(' ').replace(/^(["'])(.*)\1$/, '$2');

  s.projetos = s.projetos || [];

  // troca qual projeto esta com o cronometro ligado: acumula o tempo do
  // que sai (se houver) e liga o do que entra. So um por vez — igual so
  // da pra codar uma coisa de cada vez na vida real tambem.
  function ativar(proj) {
    if (s.projetoAtivoId && s.projetoAtivoId !== proj.id) {
      const outro = s.projetos.find(pr => pr.id === s.projetoAtivoId);
      if (outro && s.sessaoIniciadaEm) {
        const el = Date.now() - new Date(s.sessaoIniciadaEm).getTime();
        outro.tempoAtivoMs = (outro.tempoAtivoMs||0) + el;
      }
    }
    s.projetoAtivoId = proj.id;
    s.projetoAtual    = proj.rel;
    s.tempoAtivoMs     = proj.tempoAtivoMs || 0;
    s.sessaoIniciadaEm  = new Date().toISOString();
    s.pausadoEm          = null;
  }

  // tira o cronometro do projeto ativo (guarda o tempo dele) sem religar
  // em nenhum outro — usado quando o projeto ativo vai pra revisao/pausa.
  function desativar(proj) {
    if (s.sessaoIniciadaEm) {
      const el = Date.now() - new Date(s.sessaoIniciadaEm).getTime();
      proj.tempoAtivoMs = (proj.tempoAtivoMs||0) + el;
    }
    if (s.projetoAtivoId === proj.id) {
      s.projetoAtivoId = null; s.projetoAtual = null;
      s.tempoAtivoMs = 0;
    }
    s.sessaoIniciadaEm = null; s.pausadoEm = new Date().toISOString();
  }

  switch (cmd) {
    case 'ver': {
      const id = parseInt(rest), proj = s.projetos.find(pr=>pr.id===id);
      if (!proj) return '  Use: ver <nº> (número do projeto no board)';
      const statusLabel = {
        backlog: clr(C.gray,'BACKLOG'), doing: clr(C.yellow,'EM ANDAMENTO'),
        revisao: clr(C.magenta,'EM REVISÃO'), aprovado: clr(C.cyan,'APROVADO — falta concluir'),
        done: clr(C.green,'CONCLUÍDO'),
      }[proj.status] || proj.status;
      return `  #${proj.id} [${statusLabel}]  ${proj.titulo}  ${clr(C.gray, proj.rel)}`;
    }
    case 'start': {
      const id = parseInt(rest), proj = s.projetos.find(pr=>pr.id===id);
      if (!proj) return `  Projeto #${id} nao encontrado no seu backlog.`;
      if (proj.status==='done')     return `  #${id} ja concluido.`;
      if (proj.status==='revisao')  return `  #${id} ta em revisao com o QA. Aguarde.`;
      if (proj.status==='aprovado') return `  #${id} ja foi aprovado pelo QA — falta concluir: concluir ${id}`;
      if (proj.status==='doing' && proj.id===s.projetoAtivoId)
        return `  #${id} ja e o projeto ativo agora.`;

      const eraBacklog = proj.status === 'backlog';
      proj.status = 'doing';
      if (eraBacklog) proj.startedAt = new Date().toISOString();
      ativar(proj);
      saveSprint(s);
      const [n,t] = pick(RESP.start,id); pushMessage(n,t);

      // gitflow — so verifica a branch atual (leitura), nunca cria/troca nada.
      const esperada = branchEsperadaProjeto(proj.rel);
      const atual    = gitBranchAtual();
      let avisoBranch = '';
      if (esperada && atual && atual !== esperada) {
        pushMessage(NPC.lead, `Branch errada pra codar ("${atual}"). Recomendado: git checkout -b ${esperada}`);
        avisoBranch = clr(C.yellow, '  [branch errada — ver MENSAGENS]');
      }
      return `${clr(C.yellow,'>')} #${id} "${proj.titulo}" em andamento.  ${clr(C.gray,`(estimativa: ${proj.estimativaHoras}h)`)}${avisoBranch}`;
    }
    case 'revisar': {
      const id = parseInt(rest), proj = s.projetos.find(pr=>pr.id===id);
      if (!proj) return `  Projeto #${id} nao encontrado.`;
      if (proj.status==='backlog')  return `  #${id} nem foi iniciado ainda — use: start ${id}`;
      if (proj.status==='revisao')  return `  #${id} ja esta em revisao. Aguarde o QA.`;
      if (proj.status==='aprovado') return `  #${id} ja foi aprovado pelo QA — falta concluir: concluir ${id}`;
      if (proj.status==='done')     return `  #${id} ja concluido.`;

      // o QA roda o mesmo lint + npm test que "concluir" checa de novo no
      // final — e assim que ele sabe dizer POR QUE reprovou, em vez de sortear.
      const projPath = path.join(PROJECTS_DIR, proj.rel);
      if (!fs.existsSync(path.join(projPath, 'node_modules')))
        return `  Execute "npm install" na pasta do projeto primeiro — o QA precisa disso pra rodar os testes.`;

      const lintRev  = rodarLint(proj.rel);
      const testeRev = rodarTestes(proj.rel);
      const aprovada = !lintRev.bloqueado && testeRev.passou !== false;
      let motivo = null;
      if (!aprovada) {
        if (testeRev.passou === false) motivo = testeRev.motivo || 'Os testes nao passaram.';
        else if (lintRev.bloqueado)    motivo = `Lint: ${lintRev.erros} erro(s) (ex.: ${lintRev.exemplo})`;
      }

      proj.status = 'revisao'; proj.enviadoRevisaoEm = new Date().toISOString();
      // vira uma PR simulada na primeira vez que sai do backlog pra revisao —
      // se voltar (reprovada) e for de novo, e a mesma PR, so reaberta.
      if (!proj.prNumero) { s.nextPr = s.nextPr || 1; proj.prNumero = s.nextPr++; proj.prBranch = branchEsperadaProjeto(proj.rel); }
      // resultado (aprovada/motivo) ja foi decidido de verdade acima — o
      // delay e so o "tempo que o QA leva pra olhar", que agora pode ser
      // bem real (minutos a dias), nao sorteio de segundos.
      proj.revisaoResolveEm = new Date(Date.now() + delayRevisaoMs()).toISOString();
      proj.revisaoAprovada  = aprovada;
      proj.motivoReprovacao = motivo;
      // o projeto sai de "ativo" enquanto espera — o dev fica livre pra
      // dar start em outro do backlog sem perder o progresso deste.
      desativar(proj);
      saveSprint(s);
      const [n,t] = pick(RESP.revisar,id); pushMessage(n,t);
      return `${clr(C.magenta,'⏳')} #${id} "${proj.titulo}" enviado pra revisão do QA — pode levar minutos, horas ou dias. Comece outro do backlog enquanto espera.`;
    }
    // commit agora e so uma coisa: salvar o jogo. Nao depende mais de
    // nenhum projeto estar aprovado nem trava a entrega — e o unico ponto
    // que grava em disco (ver persistirJogo() em core/dados.js). Sem
    // commit, nada do que mudou e salvo; o jogador escolhe a hora.
    case 'commit': {
      const mensagem = rest.trim();
      if (!mensagem) return `  Uso: commit <mensagem>  (ex.: commit terminei a validação de idade)`;
      persistirJogo();
      return `${clr(C.green,'✔')} Jogo salvo.  ${clr(C.gray,'"'+mensagem+'"')}`;
    }
    case 'pausar': {
      if (!s.sessaoIniciadaEm) return '  Nenhum projeto ativo pra pausar.';
      const proj = s.projetos.find(pr => pr.id === s.projetoAtivoId);
      if (proj) desativar(proj); else { s.sessaoIniciadaEm = null; s.pausadoEm = new Date().toISOString(); }
      saveSprint(s);
      const [n,t] = pick(RESP.pausar); pushMessage(n,t);
      return `${clr(C.yellow,'⏸')} Pausado.`;
    }
    case 'retomar': {
      if (s.sessaoIniciadaEm) return '  Sprint ja ativa.';
      const proj = s.projetos.find(pr => pr.id === s.projetoAtivoId);
      if (!proj) return '  Nenhum projeto ativo pra retomar — use "start <nº>".';
      ativar(proj);
      saveSprint(s);
      const [n,t] = pick(RESP.retomar); pushMessage(n,t);
      return `${clr(C.green,'▶')} "${proj.titulo}" retomado.`;
    }
    case 'concluir': {
      const id = parseInt(rest), proj = s.projetos.find(pr=>pr.id===id);
      if (!proj) return `  Uso: concluir <nº>  (o nº aparece em EM REVISÃO depois de aprovado)`;
      if (proj.status==='done')     return '  Projeto ja entregue.';
      if (proj.status!=='aprovado') return clr(C.yellow, `  [QA] #${id} ainda nao foi aprovado. Manda pra revisão primeiro: revisar ${id}`);

      const marker = path.join(PROJECTS_DIR, proj.rel, '.concluido');
      if (fs.existsSync(marker)) { proj.status = 'done'; return '  Projeto ja entregue.'; }

      // ultima confirmacao real (lint + npm test), igual um pipeline de CI
      // rodando antes do merge — a revisao ja aprovou, isso so fecha as contas.
      const lint = rodarLint(proj.rel);
      const teste = rodarTestes(proj.rel);
      const passou = teste.passou !== false && !lint.bloqueado;

      s.ciRuns = s.ciRuns || [];
      s.ciRuns.push({
        numero: s.ciRuns.length + 1, quando: new Date().toISOString(), projeto: proj.rel,
        sucesso: passou, testesOk: teste.passou !== false, lintErros: lint.erros, lintAvisos: lint.avisos,
      });
      if (s.ciRuns.length > 30) s.ciRuns = s.ciRuns.slice(-30);

      if (!passou) {
        saveSprint(s);
        pushMessage(NPC.qa, 'Entrega bloqueada — algo quebrou desde a revisão. Corrige antes de entregar.');
        return clr(C.red, '  [QA] Bloqueado: algo nao passa mais (lint ou teste). Roda "revisar '+id+'" de novo depois de corrigir.');
      }

      proj.status = 'done'; proj.completedAt = new Date().toISOString();
      proj.tempoGastoMs = proj.tempoAtivoMs || 0;
      // XP escala com o tamanho do projeto (numero de tarefas do README) —
      // um projeto maior vale mais do que um mini-projeto de 1 topico.
      const meta = metaDoProjeto(proj.nivel, proj.pj);
      const xpGanho = Math.max(25, (meta.tarefas?.length || 1) * 25);
      const p2 = loadProgress();
      let penMsg = '';
      p2.xp += xpGanho;
      if (proj.extensoesQA > 0) {
        p2.atrasadas = (p2.atrasadas || 0) + 1;
        penMsg = clr(C.yellow, ` (entregue com ${proj.extensoesQA} reestimativa(s) no caminho)`);
        pushMessage(NPC.pm, 'Projeto entregue, mas com reestimativas no meio do caminho. Vamos calibrar melhor a proxima.');
      }
      saveProgress(p2);
      fs.writeFileSync(marker, new Date().toISOString());
      pushMessage(NPC.qa,   `Suite completa passou. Aprovado! +${xpGanho} XP`);
      pushMessage(NPC.lead, `#${id} "${proj.titulo}" entregue! Otimo trabalho, ${p2.name}.`);

      // gitflow — so avisa (leitura), nao mexe em nada. O merge de verdade
      // (feature -> develop) e sempre manual, feito pelo aluno.
      const esperada = branchEsperadaProjeto(proj.rel);
      const atual    = gitBranchAtual();
      if (esperada && atual === esperada) {
        pushMessage(NPC.lead, `Testes ok e entregue — agora faz o merge: git checkout develop && git merge ${esperada}`);
      } else if (esperada && atual && atual !== 'main' && atual !== 'develop') {
        pushMessage(NPC.lead, `Confere se commitou tudo em "${atual}" antes de mergear em develop.`);
      }

      // so busca lote novo quando o ultimo do lote atual foi entregue —
      // se ainda tem outro projeto aberto no board, fica por isso mesmo.
      let proxMsg = '';
      const loteVazio = !s.projetos.some(pr => pr.status !== 'done');
      if (loteVazio) {
        if (garantirLote(s)) {
          proxMsg = clr(C.gray, `  Sprint ${s.sprintNum} liberada com novo(s) projeto(s).`);
        } else {
          pushMessage(NPC.pm, 'Entrega registrada. Foi o último projeto disponível por enquanto — aguarde a próxima leva.');
          proxMsg = clr(C.green, '  [QA] Nada mais liberado no momento. Aguarde novos projetos.');
        }
      }

      saveSprint(s);

      // a cada N projetos entregues, interrompe com um 1:1 de performance
      // do Lead antes do menu — mesmo criterio de interstiço do standup.
      if (precisaRevisao1a1(contarProjetos().concluidos)) goTo('revisao1a1');

      // entrega de projeto e um marco por si so (o .concluido ja foi pro
      // disco acima) — salva o resto do estado junto pra nao ficar
      // inconsistente (projeto marcado como entregue mas XP so em memoria).
      persistirJogo();
      return clr(C.green,`★ ENTREGUE! +${xpGanho} XP`) + proxMsg + penMsg + clr(C.green,'  ✔ jogo salvo');
    }
    case '': case undefined: return null;
    default: return `  Comando desconhecido: "${cmd}"`;
  }
}

// Quando o tempo de um projeto estoura, o dev nao reestima sozinho — o QA
// negocia mais tempo com o PM. Mas isso nao e de graca: cada reestimativa
// vira um aviso de desempenho registrado na hora (nao só na entrega), com
// XP cada vez maior perdido se acontecer de novo. So mede o projeto ATIVO
// (o unico com cronometro rodando).
function checkOvertime() {
  const s = loadSprint();
  if (!s || !s.sessaoIniciadaEm || !s.projetoAtivoId) return;
  const proj = (s.projetos||[]).find(pr => pr.id === s.projetoAtivoId && pr.status === 'doing');
  if (!proj) return;

  const estimativa = proj.estimativaHoras || 2;
  const ativo = tempoAtivoTotal(s);
  const estMs = estimativa * 3600000;
  const pct   = ativo / estMs;

  if (pct >= 0.8 && !APP.ov80) {
    APP.ov80 = true;
    pushMessage(NPC.pm, `Atencao! #${proj.id} chegando no limite do tempo. Quanto falta?`);
    if (APP.screen === 'sprint') APP.lastFb = clr(C.yellow,`⚡ #${proj.id}: 80% do tempo estimado usado. Foco!`);
  }

  if (pct >= 1.0) {
    const extensao = Math.max(0.25, +(estimativa * 0.5).toFixed(2));
    proj.extensoesQA = (proj.extensoesQA || 0) + 1;
    proj.estimativaHoras = +(estimativa + extensao).toFixed(2);
    saveSprint(s);

    const penalidade = 5 * proj.extensoesQA; // -5, -10, -15... escalando por projeto
    const p = loadProgress();
    p.xp     = Math.max(0, p.xp - penalidade);
    p.avisos = (p.avisos || 0) + 1;
    saveProgress(p);

    pushMessage(NPC.qa, `#${proj.id} estourou o tempo. Consegui +${extensao}h com o PM, mas isso vira aviso no seu histórico.`);
    pushMessage(NPC.lead, proj.extensoesQA > 1
      ? `Essa já é a ${proj.extensoesQA}ª reestimativa desse projeto. Precisamos conversar sobre planejamento.`
      : 'Um projeto estourou o tempo. Da próxima vez avisa antes de chegar no limite.');
    if (APP.screen === 'sprint')
      APP.lastFb = clr(C.red, `⚠ #${proj.id} estourou — QA deu +${extensao}h  (aviso registrado, -${penalidade} XP)`);

    APP.ov80 = false; // reseta pra poder alertar de novo dentro do novo prazo
  }
}

// Simulador vivo: o LOTE inteiro corre em dias corridos de verdade (a
// partir de quando entrou no backlog), mesmo com o app fechado. Se o prazo
// bater antes do lote inteiro entregue, o QA renegocia com o PM — mesmo
// contador de avisos/XP que o estouro de horas, agora por sprint em vez de
// por projeto.
function checkPrazoSprint() {
  const s = loadSprint();
  if (!s || !s.loteAtribuidoEm) return;
  const abertos = (s.projetos||[]).some(pr => pr.status !== 'done');
  if (!abertos) return; // lote inteiro entregue, nada pra cobrar

  const prazo     = s.lotePrazoDias || 7;
  const decorrido = Math.floor((Date.now() - new Date(s.loteAtribuidoEm).getTime()) / 86400000);
  if (decorrido < prazo) return;

  // extensao proporcional ao prazo original — +7 fixo nao fazia sentido
  // num lote de 3 dias (mais que dobraria o prazo sozinho).
  const extensaoDias = Math.max(3, Math.round(prazo / 2));
  s.lotePrazoDias   = prazo + extensaoDias;
  s.loteExtensoesQA = (s.loteExtensoesQA || 0) + 1;

  const penalidade = 5 * s.loteExtensoesQA;
  const p = loadProgress();
  p.xp     = Math.max(0, p.xp - penalidade);
  p.avisos = (p.avisos || 0) + 1;
  saveProgress(p);

  pushMessage(NPC.pm, `Os ${prazo} dias da Sprint ${s.sprintNum} bateram. Consegui +${extensaoDias} dias com o cliente, mas isso vira aviso.`);
  pushMessage(NPC.qa, 'Nao da pra esticar prazo pra sempre — precisamos fechar isso logo.');
  if (APP.screen === 'sprint')
    APP.lastFb = clr(C.red, `⚠ Prazo da Sprint ${s.sprintNum} estourou — QA conseguiu +${extensaoDias}d  (aviso registrado, -${penalidade} XP)`);

  saveSprint(s);
}

function handleSprintKey(key) {
  if (key === '\r') {
    const s = loadSprint();
    if (APP.inputBuf.trim()) {
      APP.lastFb = sprintCommand(APP.inputBuf, s);
    }
    APP.inputBuf = '';
  } else if (key === '\x7f' || key === '\x08') {
    APP.inputBuf = APP.inputBuf.slice(0, -1);
  } else if (key.charCodeAt(0) >= 32) {
    APP.inputBuf += key;
  }
  render();
}

module.exports = { buildSprint, handleSprintKey, pick, RESP, checkRevisoesQA, sprintCommand, checkOvertime, checkPrazoSprint, proximoProjetoNivel, devEstaBloqueado, prazoLotePara, prazoLoteTexto, parseEstimativaTexto, extrairTarefas, metaDoProjeto };
