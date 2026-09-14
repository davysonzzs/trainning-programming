'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { C, INN, LINE, bold, clr, dim, row, stripAnsi } = require('../core/ansi');
const { APP } = require('../core/app');
const { LEVELS, MSGS_AMBIENTE, NPC, PROJECTS_DIR, contarProjetos, fmtMs, getLevel, loadMessages, loadProgress, loadSprint, pushMessage, saveProgress, saveSprint, tempoAtivoTotal } = require('../core/dados');
const { timerLine } = require('../core/draw-utils');
const { branchEsperadaProjeto, gitBranchAtual } = require('../core/gitflow');
const { rodarLint } = require('../core/lint');
const { goTo, render } = require('../core/screen');
const { wrapPrefixedColored } = require('../core/texto');
const { precisaRevisao1a1 } = require('./revisao1a1');

function buildSprint(s) {
  const p        = loadProgress();
  const backlog  = s.tasks.filter(t => t.status==='backlog');
  const doing    = s.tasks.filter(t => t.status==='doing');
  // "aprovado" (QA ok, esperando o commit real) e "aceite" (commitado,
  // esperando a PR ser aceita) continuam visualmente em EM REVISÃO — a
  // tarefa so sai dali quando a PR de fato mergeia (done).
  const revisao  = s.tasks.filter(t => t.status==='revisao' || t.status==='aprovado' || t.status==='aceite');
  const done     = s.tasks.filter(t => t.status==='done');
  const rows     = Math.max(backlog.length, doing.length, revisao.length, done.length, 1);
  const pausado  = !s.sessaoIniciadaEm;
  const COL      = 18;   // 4 colunas de 18 + 3 separadores "│" + 1 indent = 76 = INN
  const msgs     = loadMessages().slice(-3);
  // troca a cada 15s de tempo REAL, nao a cada frame — como a tela agora
  // redesenha sozinha (150ms), usar APP.frame direto fazia a mensagem
  // ambiente trocar a cada tick, parecendo um monte de mensagem piscando.
  const aMsg     = MSGS_AMBIENTE[Math.floor(Date.now() / 15000) % MSGS_AMBIENTE.length];

  // sprint de verdade: prazo em dias corridos, roda mesmo com o app fechado
  const diasRestantes = s.sprintIniciadaEm
    ? Math.max(0, (s.prazoDias||15) - Math.floor((Date.now()-new Date(s.sprintIniciadaEm).getTime())/86400000))
    : null;

  function cell(task, col) {
    if (!task) return ' '.repeat(col);
    const s2 = `[${task.id}] ${task.title}`;
    return (s2.length > col ? s2.slice(0,col-1)+'…' : s2).padEnd(col);
  }

  function comSufixo(task, sufixo) {
    if (!task) return ' '.repeat(COL);
    const s2 = `[${task.id}] ${task.title}${sufixo}`;
    return (s2.length > COL ? s2.slice(0,COL-1)+'…' : s2).padEnd(COL);
  }

  function doingCell(task) {
    if (!task) return ' '.repeat(COL);
    const suf = pausado ? ' (pausado)' : ` (${Math.floor((Date.now()-new Date(task.startedAt||Date.now()).getTime())/60000)}m)`;
    return comSufixo(task, suf);
  }

  function revisaoCell(task) {
    if (!task) return ' '.repeat(COL);
    if (task.status === 'aprovado') return comSufixo(task, ' ✔ commit');
    if (task.status === 'aceite')   return comSufixo(task, ' ⏳ PR');
    const min = Math.floor((Date.now()-new Date(task.enviadoRevisaoEm||Date.now()).getTime())/60000);
    return comSufixo(task, ` ⏳${min>0?min+'m':''}`);
  }

  // pad ANTES de colorir, pra não contar os códigos ANSI como largura
  function padVisible(str, width) {
    return str + ' '.repeat(Math.max(0, width - stripAnsi(str).length));
  }

  function quadroRow(a, b, c, d) { return row(` ${a}│${b}│${c}│${d}`); }

  const sepLine = clr(C.gray, '─'.repeat(COL) + '┼' + '─'.repeat(COL) + '┼' + '─'.repeat(COL) + '┼' + '─'.repeat(COL));

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += row(` ${bold('DEVTECH SISTEMAS S.A.')}  ${' '.repeat(26)}Dev: ${bold(p.name)}  XP: ${clr(C.cyan,String(p.xp))}`) + '\n';
  const espera = s.projetoEmEspera ? clr(C.yellow, `  ⏳ esperando: ${s.projetoEmEspera.projetoAtual}`) : '';
  o += row(` Sprint: ${bold(s.sprint)}${pausado ? '  '+clr(C.yellow,'[PAUSADO]') : ''}  ${s.projetoAtual ? clr(C.gray,'  proj: '+s.projetoAtual) : ''}${espera}`) + '\n';
  if (diasRestantes !== null) {
    const cor = diasRestantes <= 2 ? C.red : diasRestantes <= 5 ? C.yellow : C.green;
    const ext = s.extensoesQA > 0 ? clr(C.gray, `  (${s.extensoesQA} reestimativa(s))`) : '';
    o += row(` ${clr(C.gray,'Prazo:')} ${clr(cor, `${diasRestantes} dia${diasRestantes===1?'':'s'} restante${diasRestantes===1?'':'s'}`)} de ${s.prazoDias||15} corridos${ext}`) + '\n';
  }
  o += row(` ${timerLine(s)}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += quadroRow(
    padVisible(bold(clr(C.cyan,'BACKLOG')), COL),
    padVisible(bold(clr(C.yellow,'DESENVOLV.')), COL),
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
  o += row(dim('  projeto  (pega o próximo da sua fila)   outro / voltar  (troca sem perder progresso)')) + '\n';
  o += row(dim('  ver/start/revisar/commit/rm <nº>   pausar   retomar   concluir')) + '\n';
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
// Acha o primeiro projeto ainda não entregue dentro da pasta do nível atual.
// `excluir` (lista de rel paths) deixa de fora projetos ja "em uso" — usado
// pelo comando "outro" pra nao sugerir o mesmo projeto que ja ta parado
// esperando revisao (senao proximoProjetoNivel() sempre devolveria ele de
// volta, por ser o primeiro nao entregue da pasta).
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

// Bloqueado de verdade: nada pra iniciar no projeto em foco (o unico
// "doing" possivel ja foi mandado pra revisao), e nem trocando de projeto
// resolve — o parado (se tiver) tambem ta sem nada pra iniciar, ou nem tem
// projeto parado e a fila do nivel ja acabou. Maximo de 2 projetos "em
// jogo" ao mesmo tempo (o comando "outro" ja barra um 3º) — se os dois
// travarem no QA junto, so resta esperar. Bom momento pra estudar.
function devEstaBloqueado(s) {
  // "aprovado" nao e bloqueio de verdade — o dev tem uma acao pra fazer
  // (commitar). "aceite" ja e so esperar o aceite da PR, igual 'revisao'.
  const focoLivre = s.tasks.some(t => ['backlog','doing','aprovado'].includes(t.status));
  if (focoLivre) return false;
  if (s.projetoEmEspera) {
    const paradoLivre = (s.projetoEmEspera.tasks || []).some(t => ['backlog','doing','aprovado'].includes(t.status));
    return !paradoLivre; // os dois travados no QA
  }
  return !proximoProjetoNivel([s.projetoAtual]);
}

// Prazo da sprint (dias corridos) varia com o nivel — nao faz sentido um
// projeto de Estagiario ter os mesmos 15 dias de um de Senior. O projeto
// "06" de cada nivel e sempre o integrador (mistura tudo que foi visto),
// entao ganha alguns dias a mais mesmo dentro do mesmo nivel.
function prazoSprintPara(nivelFolder, pjNome) {
  const lv = LEVELS.find(l => l.folder === nivelFolder);
  const base = lv?.sprintDias || 7;
  const ehIntegrador = /^06-|integrador/i.test(pjNome);
  return ehIntegrador ? base + 3 : base;
}

// "1h 30m" / "2h" / "2h 30m" → horas decimais (1.5 / 2 / 2.5)
function parseEstimativaTexto(txt) {
  const m = txt.match(/(\d+)\s*h(?:\s*(\d+)\s*m)?/i);
  if (!m) return null;
  const h = parseInt(m[1], 10), min = m[2] ? parseInt(m[2], 10) : 0;
  return +(h + min / 60).toFixed(2);
}

// O nome da sprint e a estimativa não são o dev que inventa — já vêm
// definidos no README do projeto (é o QA/PM que decide isso). Lê de lá.
// A seção de tarefas varia de nome ("Tarefas", "Tarefas para o Sprint",
// "Tarefas sugeridas para o Sprint"...) e de formato: uns já vêm como
// comando (`add texto`), outros como checklist (`- [ ] texto`). Aceita
// os dois e devolve só os títulos, prontos pra virar tarefas no backlog.
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
  start:     [(id)=>[NPC.lead,`#${id} em andamento. Avisa se travar.`], (id)=>[NPC.dev,`Boa sorte na #${id}!`]],
  revisar:   [(id)=>[NPC.qa,`Recebi a #${id}, vou dar uma olhada.`], (id)=>[NPC.dev,`Mandei a #${id} pra revisão. Torcendo.`]],
  aprovado:  [(id)=>[NPC.qa,`Testei #${id}. Passou, aprovado! Pode commitar.`], (id)=>[NPC.lead,`#${id} aprovada no code review. Não esquece o commit no imperativo.`]],
  reprovado: [(id)=>[NPC.qa,`#${id} voltou — achei um problema, dá uma olhada de novo.`], (id)=>[NPC.lead,`#${id} precisa de ajuste antes de fechar.`]],
  commitado: [(id)=>[NPC.lead,`Commit da #${id} recebido. Mandei a PR pra aprovação.`], (id)=>[NPC.dev,`Boa, #${id} commitada. Agora é esperar o aceite.`]],
  aceito:    [(id)=>[NPC.lead,`PR da #${id} aceita e mergeada. Show!`], (id)=>[NPC.pm,`#${id} entregue de vez — mergeada.`]],
  pausar:    [()=>[NPC.dev,`Ate mais!`], ()=>[NPC.lead,`Salva antes de sair.`]],
  retomar:   [()=>[NPC.dev,`Bem-vindo de volta!`], ()=>[NPC.lead,`Bora terminar.`]],
};

// Simula o tempo que o QA leva pra olhar a tarefa (8-20s reais). Ao resolver,
// recarrega o sprint do disco (o dev pode ter mexido em outra coisa nesse
// meio-tempo) e só aplica se a tarefa ainda estiver esperando revisão.
// A resolucao da revisao do QA e por DATA (task.revisaoResolveEm), nao por
// setTimeout em memoria — um setTimeout morre se o simulador for fechado
// antes da hora, deixando a tarefa presa em "EM REVISAO" pra sempre. Assim,
// ela resolve sozinha na proxima vez que o loop rodar, mesmo que isso seja
// so quando o jogador abrir o app de novo, dias depois.
function checkRevisoesQA() {
  const s = loadSprint();
  if (!s) return;
  let mudou = false;

  for (const task of s.tasks) {
    if (task.status === 'revisao') {
      // tarefa presa de uma sessao anterior (fechada antes da hora, ou de
      // uma versao mais antiga do simulador) — resolve agora mesmo.
      if (!task.revisaoResolveEm) {
        task.revisaoResolveEm = new Date().toISOString();
        task.revisaoAprovada  = Math.random() < 0.7;
      }
      if (Date.now() < new Date(task.revisaoResolveEm).getTime()) continue;

      if (task.revisaoAprovada) {
        // QA aprovou, mas so vira "done" (e XP) depois do commit de verdade
        // e do aceite da PR — ver o comando "commit" e o bloco 'aceite' abaixo.
        task.status = 'aprovado'; task.aprovadoEm = new Date().toISOString();
        const [n, t] = pick(RESP.aprovado, task.id); pushMessage(n, t);
        APP._lastRevisaoMsg = clr(C.green, `★ #${task.id} aprovada pelo QA! Faz o commit de verdade e roda "commit ${task.id}".`);
        // acabou de codar — o cronometro fica livre ate a proxima ser iniciada
        s.tarefaAtivaId = null; s.sessaoIniciadaEm = null; s.pausadoEm = new Date().toISOString();
      } else {
        task.status = 'doing';
        const [n, t] = pick(RESP.reprovado, task.id); pushMessage(n, t);
        APP._lastRevisaoMsg = clr(C.yellow, `#${task.id} voltou pra desenvolvimento — o QA pediu ajuste.`);
        // mesma tarefa continua ativa — o relogio dela volta a rodar de onde parou
        s.sessaoIniciadaEm = new Date().toISOString(); s.pausadoEm = null;
      }
      delete task.revisaoResolveEm;
      delete task.revisaoAprovada;
      mudou = true;
      continue;
    }

    if (task.status === 'aceite') {
      // tarefa presa de uma sessao anterior — resolve agora mesmo.
      if (!task.aceiteResolveEm) task.aceiteResolveEm = new Date().toISOString();
      if (Date.now() < new Date(task.aceiteResolveEm).getTime()) continue;

      task.status = 'done'; task.completedAt = new Date().toISOString();
      task.tempoGastoMs = tempoAtivoTotal(s); // registro do tempo real gasto nela
      const p = loadProgress(); p.xp += 25; saveProgress(p);
      const [n, t] = pick(RESP.aceito, task.id); pushMessage(n, t);
      APP._lastRevisaoMsg = clr(C.green, `★ PR da #${task.id} aceita e mergeada! +25 XP`);
      delete task.aceiteResolveEm;
      mudou = true;
    }
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

  // nome da sprint e estimativa nao sao o dev que inventa — ja vem
  // definido no README (quem decide isso e o QA/PM). So atribui o
  // projeto e copia esses dois campos de la.
  // Usada tanto por "projeto" (atribuicao manual/automatica) quanto por
  // "concluir" (que encadeia direto pro proximo projeto da fila) — por
  // isso fica aqui fora, acessivel aos dois cases.
  function atribuir(prox) {
    const jaEstaAtivo = s.projetoAtual === prox.rel;
    const meta = metaDoProjeto(prox.nivel, prox.pj);
    s.projetoAtual = prox.rel;
    if (meta.sprint)          s.sprint = meta.sprint;
    if (meta.estimativaHoras) s.estimativaHoras = meta.estimativaHoras;
    if (!jaEstaAtivo) {
      s.sprintIniciadaEm = new Date().toISOString(); // sprint real, em dias corridos
      s.prazoDias = prazoSprintPara(prox.nivel, prox.pj);
      s.tarefaAtivaId = null; s.sessaoIniciadaEm = null; s.tempoAtivoMs = 0;
      // reinicia a sprint de verdade: cada projeto novo e como um
      // repositorio novo na empresa — o backlog/doing/concluido do
      // projeto anterior nao tem mais o que fazer aqui, entao o board
      // (e o GitHub simulado, que le as mesmas tasks) volta zerado, com
      // issues e PRs numerados a partir do 1. Sem isso o board ficava
      // acumulando tarefas antigas ja entregues e os ids so cresciam
      // ([6], [7], [8]...).
      s.tasks = [];
      s.nextId = 1;
      s.nextPr = 1;
      s.ciRuns = [];
    }
    s.extensoesQA = 0;
    APP.ov80 = false;

    // o "O que fazer" ja diz o que tem que ser feito — poe direto no
    // BACKLOG, o dev nao precisa copiar linha por linha do README.
    // So nao repete se o projeto atribuido e ja estava ativo.
    // A estimativa do README nao e dividida entre as tarefas — cada
    // uma recebe o valor CHEIO. Dividir deixaria tarefas de poucos
    // minutos, o que pressiona demais quem ainda ta aprendendo (1.5h,
    // 2h ou ate 3h por tarefa e razoavel pra quem ta comecando).
    let adicionadas = 0;
    const porTarefa = s.estimativaHoras;
    if (!jaEstaAtivo && meta.tarefas?.length) {
      for (const titulo of meta.tarefas) {
        s.tasks.push({ id: s.nextId++, title: titulo, status: 'backlog', estimativaHoras: porTarefa });
        adicionadas++;
      }
    }
    saveSprint(s);

    const fraseTarefas = adicionadas > 0
      ? ` Já deixei ${adicionadas} tarefa(s) no backlog, ${porTarefa}h cada.`
      : '';
    pushMessage(NPC.qa, `Próximo da fila pra você: "${prox.pj}". Sprint "${s.sprint}", ${s.prazoDias||15} dias corridos.${fraseTarefas}`);
    return `${clr(C.green,'>')} Projeto atribuído: ${prox.rel}  ${clr(C.gray,`(${s.sprint}, ${s.prazoDias||15}d)`)}${fraseTarefas ? clr(C.cyan, fraseTarefas) : ''}`;
  }

  // O estado de UM projeto ativo (backlog, ids, timer, prazo, PRs, Actions...)
  // vive nesses campos do topo do sprint.json. "outro"/"voltar" trocam de
  // projeto SEM perder progresso: tira uma foto do que ta no topo agora,
  // guarda em s.projetoEmEspera, e carrega o outro projeto no lugar. So da
  // pra ter 2 projetos "em jogo" ao mesmo tempo — o em foco (aqui em cima)
  // e o que ficou esperando revisao.
  const SLOT_FIELDS = ['projetoAtual','sprint','estimativaHoras','prazoDias','sprintIniciadaEm',
    'tarefaAtivaId','sessaoIniciadaEm','tempoAtivoMs','pausadoEm','extensoesQA','nextId','nextPr','ciRuns','tasks'];
  function tirarSnapshot(alvo) {
    const slot = {};
    for (const k of SLOT_FIELDS) slot[k] = alvo[k];
    return slot;
  }
  function aplicarSnapshot(alvo, slot) {
    for (const k of SLOT_FIELDS) alvo[k] = slot[k];
  }

  switch (cmd) {
    // as tarefas ja vem do README quando "projeto" atribui — nao tem mais
    // por que o dev cadastrar a mao, entao nao existe mais comando pra isso.
    case 'ver': {
      const id = parseInt(rest), task = s.tasks.find(t=>t.id===id);
      if (!task) return '  Use: ver <nº> (número da tarefa)';
      const statusLabel = {
        backlog: clr(C.gray,'BACKLOG'), doing: clr(C.yellow,'DESENVOLVENDO'),
        revisao: clr(C.magenta,'EM REVISÃO'), done: clr(C.green,'CONCLUÍDO'),
      }[task.status] || task.status;
      return `  #${task.id} [${statusLabel}]  ${task.title}`;
    }
    case 'start': {
      const id = parseInt(rest), task = s.tasks.find(t=>t.id===id);
      if (!task) return `  Tarefa #${id} nao encontrada.`;
      if (task.status==='done')    return `  #${id} ja concluida.`;
      if (task.status==='revisao') return `  #${id} ta em revisao com o QA. Aguarde.`;
      if (task.status==='doing')   return `  #${id} ja esta em andamento.`;

      // uma tarefa de cada vez, na ordem — nao da pra pular pra frente
      // nem ter duas ativas ao mesmo tempo. So avanca quando a anterior
      // for finalizada e aprovada pelo QA (status 'done').
      const outraAtiva = s.tasks.find(t => t.id!==id && ['doing','revisao','aprovado','aceite'].includes(t.status));
      if (outraAtiva)
        return clr(C.yellow, `  [QA] Termina a #${outraAtiva.id} antes de começar outra — uma de cada vez.`);

      const pendenteAntes = s.tasks
        .filter(t => t.id < id && t.status !== 'done')
        .sort((a,b) => a.id - b.id)[0];
      if (pendenteAntes)
        return clr(C.yellow, `  [QA] Segue a ordem do backlog — termina a #${pendenteAntes.id} antes de partir pra #${id}.`);

      task.status = 'doing'; task.startedAt = new Date().toISOString();
      // o cronometro agora e por tarefa: zera aqui e passa a valer contra
      // a estimativa dessa tarefa especifica (nao mais o total do projeto).
      s.tempoAtivoMs = 0; s.sessaoIniciadaEm = new Date().toISOString(); s.pausadoEm = null;
      s.tarefaAtivaId = id;
      saveSprint(s);
      const [n,t] = pick(RESP.start,id); pushMessage(n,t);
      const est = task.estimativaHoras || s.estimativaHoras;

      // gitflow — so verifica a branch atual (leitura), nunca cria/troca nada.
      // O aviso completo vai pro painel de MENSAGENS (que ja suporta varias
      // linhas) — a linha de retorno aqui fica curta, de proposito.
      const esperada = branchEsperadaProjeto(s.projetoAtual);
      const atual    = gitBranchAtual();
      let avisoBranch = '';
      if (esperada && atual && atual !== esperada) {
        pushMessage(NPC.lead, `Branch errada pra codar ("${atual}"). Recomendado: git checkout -b ${esperada}`);
        avisoBranch = clr(C.yellow, '  [branch errada — ver MENSAGENS]');
      }
      return `${clr(C.yellow,'>')} #${id} em andamento.  ${clr(C.gray,`(estimativa: ${est}h)`)}${avisoBranch}`;
    }
    // quem finaliza a tarefa agora e o QA, nao o dev — manda pra revisao
    case 'done': {
      const id = parseInt(rest);
      return `  Isso quem decide é o QA agora — manda pra revisão: revisar ${isNaN(id) ? '<nº>' : id}`;
    }
    case 'revisar': {
      const id = parseInt(rest), task = s.tasks.find(t=>t.id===id);
      if (!task) return `  Tarefa #${id} nao encontrada.`;
      if (task.status==='backlog')  return `  #${id} nem foi iniciada ainda — use: start ${id}`;
      if (task.status==='revisao')  return `  #${id} ja esta em revisao. Aguarde o QA.`;
      if (task.status==='aprovado') return `  #${id} ja foi aprovada pelo QA — falta commitar: commit ${id}`;
      if (task.status==='aceite')   return `  #${id} ja foi commitada, aguardando aceite da PR.`;
      if (task.status==='done')     return `  #${id} ja concluida.`;
      task.status = 'revisao'; task.enviadoRevisaoEm = new Date().toISOString();
      // vira uma PR simulada na primeira vez que sai do backlog pra revisao —
      // se voltar (reprovada) e for de novo, e a mesma PR, so reaberta.
      if (!task.prNumero) { task.prNumero = s.nextPr++; task.prBranch = branchEsperadaProjeto(s.projetoAtual); }
      // resolucao decidida e marcada por DATA (nao setTimeout) — sobrevive
      // a fechar o simulador antes da hora, veja checkRevisoesQA().
      const delayMs = 8000 + Math.random() * 12000;
      task.revisaoResolveEm = new Date(Date.now() + delayMs).toISOString();
      task.revisaoAprovada  = Math.random() < 0.7;
      // o dev para de codar enquanto espera — pausa o relogio da sprint
      if (s.sessaoIniciadaEm) {
        const el = Date.now() - new Date(s.sessaoIniciadaEm).getTime();
        s.tempoAtivoMs = (s.tempoAtivoMs||0) + el;
        s.sessaoIniciadaEm = null; s.pausadoEm = new Date().toISOString();
      }
      saveSprint(s);
      const [n,t] = pick(RESP.revisar,id); pushMessage(n,t);
      return `${clr(C.magenta,'⏳')} #${id} enviada pra revisão do QA. Timer pausado até ele responder.`;
    }
    // igual o resto do GitHub simulado (issues, PRs, Actions sao tudo
    // numero/estado inventado pelo jogo) — o commit tambem e simulado aqui,
    // nao depende de um repositorio git de verdade nem de internet pra
    // funcionar. Commitar de verdade no seu repo continua sendo o certo a
    // fazer, so que o jogo nao fica checando isso.
    case 'commit': {
      const id = parseInt(rest), task = s.tasks.find(t=>t.id===id);
      if (!task) return `  Tarefa #${id} nao encontrada.`;
      if (task.status==='backlog' || task.status==='doing')
        return `  #${id} ainda nao foi pra revisão do QA — use: revisar ${id}`;
      if (task.status==='revisao')
        return `  #${id} ainda esta em revisao com o QA. Aguarde a aprovação antes de commitar.`;
      if (task.status==='aceite')
        return `  #${id} ja foi commitada, aguardando aceite da PR.`;
      if (task.status==='done')
        return `  #${id} ja concluida.`;
      if (task.status!=='aprovado')
        return `  #${id} ainda nao foi aprovada pelo QA.`;

      task.status = 'aceite';
      task.commitHash = hashCommitFalso();
      task.commitadoEm = new Date().toISOString();
      // resolucao por DATA (nao setTimeout) — mesmo padrao da revisao do QA,
      // sobrevive a fechar o simulador antes da hora.
      const delayMs = 5000 + Math.random() * 10000;
      task.aceiteResolveEm = new Date(Date.now() + delayMs).toISOString();
      saveSprint(s);
      const [n,t] = pick(RESP.commitado,id); pushMessage(n,t);
      return `${clr(C.cyan,'⏳')} Commit ${clr(C.yellow,task.commitHash)} registrado — PR da #${id} enviada pra aceite.`;
    }
    case 'rm': {
      const id = parseInt(rest), idx = s.tasks.findIndex(t=>t.id===id);
      if (idx===-1) return `  Tarefa #${id} nao encontrada.`;
      s.tasks.splice(idx,1); saveSprint(s);
      return `  #${id} removida.`;
    }
    case 'pausar': {
      if (!s.sessaoIniciadaEm) return '  Sprint ja pausada.';
      const el = Date.now() - new Date(s.sessaoIniciadaEm).getTime();
      s.tempoAtivoMs = (s.tempoAtivoMs||0) + el;
      s.sessaoIniciadaEm = null; s.pausadoEm = new Date().toISOString();
      saveSprint(s);
      const [n,t] = pick(RESP.pausar); pushMessage(n,t);
      return `${clr(C.yellow,'⏸')} Pausado. Tempo salvo: ${fmtMs(s.tempoAtivoMs)}`;
    }
    case 'retomar': {
      if (s.sessaoIniciadaEm) return '  Sprint ja ativa.';
      s.sessaoIniciadaEm = new Date().toISOString(); s.pausadoEm = null;
      saveSprint(s);
      const [n,t] = pick(RESP.retomar); pushMessage(n,t);
      return `${clr(C.green,'▶')} Sprint retomada.`;
    }
    case 'inicio': {
      if (s.sessaoIniciadaEm) { const el=Date.now()-new Date(s.sessaoIniciadaEm).getTime(); s.tempoAtivoMs=(s.tempoAtivoMs||0)+el; }
      s.sessaoIniciadaEm = new Date().toISOString(); s.pausadoEm = null;
      saveSprint(s); return `${clr(C.green,'▶')} Timer iniciado.`;
    }
    case 'projeto': {
      const p  = loadProgress();
      const lv = getLevel(p.xp).lv;

      // sem argumento: pega o proximo da fila do seu nivel (o normal do dia a dia)
      if (!rest) {
        const prox = proximoProjetoNivel();
        if (!prox) return clr(C.green, `  [QA] Você já entregou tudo do nível ${lv.name}. Aguarde a próxima leva.`);
        return atribuir(prox);
      }

      // com argumento: so aceita se for do seu proprio nivel — o dev nao escolhe
      // livremente entre pastas de outras senioridades.
      const pp = path.join(PROJECTS_DIR, rest);
      if (!fs.existsSync(pp)) return `  Pasta nao encontrada: projects/${rest}`;
      const nivelDoProjeto = rest.split('/')[0];
      if (nivelDoProjeto !== lv.folder)
        return clr(C.yellow, `  [QA] Isso não é da sua sprint — é nível ${nivelDoProjeto}, você tá em ${lv.name}. Digite "projeto" sem nada pra ver o que é seu.`);
      const pjNome = rest.split('/').slice(1).join('/');
      return atribuir({ nivel: nivelDoProjeto, pj: pjNome, rel: rest });
    }
    // enquanto uma tarefa espera o QA, o dev nao fica parado — pega outro
    // projeto da fila pra adiantar, sem perder o progresso do que ficou
    // esperando (max 2 "em jogo": o em foco e o parado em revisao).
    case 'outro': {
      if (!s.projetoAtual) return '  Nenhum projeto ativo.';
      if (s.projetoEmEspera)
        return clr(C.yellow, `  Já tem "${s.projetoEmEspera.projetoAtual}" esperando. Usa "voltar" antes de pegar mais um.`);
      if (!s.tasks.some(t => ['revisao','aprovado','aceite'].includes(t.status)))
        return clr(C.yellow, '  [QA] Nada esperando revisão, commit ou aceite agora — não faz sentido largar o projeto no meio. Manda alguma tarefa pra "revisar" primeiro.');
      if (s.tasks.some(t => t.status === 'doing'))
        return clr(C.yellow, '  Termina ou manda pra revisão a tarefa em andamento antes de trocar de projeto.');
      const prox = proximoProjetoNivel([s.projetoAtual]);
      if (!prox) return clr(C.green, '  [QA] Não tem outro projeto disponível no seu nível agora.');
      const parado = s.projetoAtual;
      s.projetoEmEspera = tirarSnapshot(s);
      const msg = atribuir(prox); // troca o topo pro projeto novo e ja salva
      pushMessage(NPC.pm, `Beleza, foca no "${prox.pj}" enquanto o QA olha o "${parado}". Depois é só "voltar".`);
      return `${clr(C.cyan,'⇄')} "${parado}" fica esperando revisão.  ${msg}`;
    }
    case 'voltar': {
      if (!s.projetoEmEspera) return '  Nenhum projeto esperando pra voltar.';
      const atual = tirarSnapshot(s);
      aplicarSnapshot(s, s.projetoEmEspera);
      s.projetoEmEspera = atual;
      saveSprint(s);
      pushMessage(NPC.qa, `Bom te ver de volta no "${s.projetoAtual}". Vamos que vamos.`);
      return `${clr(C.cyan,'⇄')} De volta ao projeto "${s.projetoAtual}".  ${clr(C.gray,`("${s.projetoEmEspera.projetoAtual}" fica esperando)`)}`;
    }
    case 'concluir': {
      if (!s.projetoAtual) return '  Nenhum projeto ativo.';
      const marker = path.join(PROJECTS_DIR, s.projetoAtual, '.concluido');
      if (fs.existsSync(marker)) return '  Projeto ja entregue.';
      // so entrega o projeto com o backlog inteiro finalizado e aprovado —
      // a "revisao" do projeto todo pressupoe que cada item ja passou pela dele.
      const pendentes = s.tasks.filter(t => t.status !== 'done');
      if (pendentes.length > 0) {
        const exemplo = pendentes[0];
        return clr(C.yellow, `  [QA] Ainda tem ${pendentes.length} tarefa(s) pendente(s) (ex.: #${exemplo.id}). Termina e aprova tudo antes de entregar.`);
      }
      const projPath = path.join(PROJECTS_DIR, s.projetoAtual);
      if (!fs.existsSync(path.join(projPath, 'node_modules')))
        return `  Execute "npm install" na pasta do projeto primeiro.`;

      // pipeline de CI de verdade: lint primeiro (mais rapido, pega bug
      // bobo cedo), testes depois — igual a maioria dos workflows reais.
      const lint = rodarLint(s.projetoAtual);
      const res  = spawnSync('npm', ['test','--','--silent'], { cwd: projPath, encoding:'utf8', stdio:'pipe' });
      const testesOk = res.status === 0;
      const passou   = testesOk && !lint.bloqueado;

      // registra a Action (CI) rodada, passe ou falhe — igual um workflow
      // de verdade que roda a cada tentativa de entrega.
      s.ciRuns = s.ciRuns || [];
      s.ciRuns.push({
        numero: s.ciRuns.length + 1,
        quando: new Date().toISOString(),
        projeto: s.projetoAtual,
        sucesso: passou,
        testesOk, lintErros: lint.erros, lintAvisos: lint.avisos,
      });
      if (s.ciRuns.length > 30) s.ciRuns = s.ciRuns.slice(-30);
      saveSprint(s);

      if (lint.bloqueado) {
        pushMessage(NPC.lead, `Lint encontrou ${lint.erros} erro(s) de verdade (ex.: ${lint.exemplo}). Corrige antes de mandar pra QA.`);
        return clr(C.red, `  [LEAD] Bloqueado: lint com ${lint.erros} erro(s). Rode "npx eslint projects/${s.projetoAtual}" na raiz do repositório.`);
      }
      if (!testesOk) {
        pushMessage(NPC.qa, 'Entrega bloqueada — testes falhando. Corrige antes de entregar.');
        return clr(C.red,'  [QA] Bloqueado: testes nao passaram. Rode "npm test" no projeto.');
      }
      if (lint.avisos > 0) {
        pushMessage(NPC.lead, `Lint passou sem erro, mas achei ${lint.avisos} aviso(s) de estilo. Dá uma olhada quando puder — não travou a entrega.`);
      }
      // As penalidades de atraso ja foram aplicadas ao vivo (checkOvertime,
      // toda vez que o QA precisou reestimar) — aqui so fecha as contas.
      const p2 = loadProgress();
      let penMsg = '';
      if (s.extensoesQA > 0) {
        p2.atrasadas = (p2.atrasadas || 0) + 1;
        penMsg = clr(C.yellow, ` (entregue com ${s.extensoesQA} reestimativa(s) no caminho)`);
        pushMessage(NPC.pm, 'Projeto entregue, mas com reestimativas no meio do caminho. Vamos calibrar melhor a proxima.');
      }
      saveProgress(p2);
      fs.writeFileSync(marker, new Date().toISOString());
      pushMessage(NPC.qa,   'Suite completa passou. Aprovado!');
      pushMessage(NPC.lead, `Entregue! Otimo trabalho, ${p2.name}.`);

      // gitflow — so avisa (leitura), nao mexe em nada. O merge de verdade
      // (feature -> develop) e sempre manual, feito pelo aluno.
      const esperada = branchEsperadaProjeto(s.projetoAtual);
      const atual    = gitBranchAtual();
      if (esperada && atual === esperada) {
        pushMessage(NPC.lead, `Testes ok e entregue — agora faz o merge: git checkout develop && git merge ${esperada}`);
      } else if (esperada && atual && atual !== 'main' && atual !== 'develop') {
        pushMessage(NPC.lead, `Confere se commitou tudo em "${atual}" antes de mergear em develop.`);
      }

      // a sprint nao fica parada esperando o dev pedir "projeto" de novo.
      // Se tinha outro projeto esperando (trocou com "outro" pra nao ficar
      // parado esperando revisao), volta pra ele em vez de puxar um 3º —
      // so busca um novo da fila quando nao tem nenhum em espera.
      let proxMsg;
      if (s.projetoEmEspera) {
        const parado = s.projetoEmEspera.projetoAtual;
        aplicarSnapshot(s, s.projetoEmEspera);
        s.projetoEmEspera = null;
        saveSprint(s);
        pushMessage(NPC.pm, `Entrega registrada! Voltando pro "${parado}" que tava esperando revisão.`);
        proxMsg = clr(C.gray, `  Voltando pro projeto que esperava: ${s.projetoAtual}.`);
      } else {
        const prox = proximoProjetoNivel();
        if (prox) {
          pushMessage(NPC.pm, 'Entrega registrada. Já coloquei o próximo projeto na sua sprint.');
          atribuir(prox); // reinicia backlog/ids/timer e ja preenche o proximo projeto — o "> Projeto atribuido..." vai so pro painel de mensagens, a linha de retorno fica curta
          proxMsg = clr(C.gray, `  Nova sprint iniciada: ${s.sprint}.`);
        } else {
          pushMessage(NPC.pm, 'Entrega registrada. Foi o último projeto do seu nível — aguarde a próxima leva.');
          proxMsg = clr(C.green, `  [QA] Nível concluído! Aguarde novos projetos.`);
        }
      }

      // a cada N projetos entregues, interrompe com um 1:1 de performance
      // do Lead antes do menu — mesmo criterio de interstiço do standup.
      if (precisaRevisao1a1(contarProjetos().concluidos)) goTo('revisao1a1');

      return clr(C.green,'★ ENTREGUE! ') + proxMsg + penMsg;
    }
    case '': case undefined: return null;
    default: return `  Comando desconhecido: "${cmd}"`;
  }
}

// Quando a sprint estoura, o dev nao reestima sozinho — o QA negocia mais
// tempo com o PM. Mas isso nao e de graca: cada reestimativa vira um aviso
// de desempenho registrado na hora (nao só na entrega), com XP cada vez
// maior perdido se acontecer de novo na mesma sprint.
// O tempo estourado agora e por TAREFA (o QA te passa uma coisa de cada
// vez, cada uma com seu prazo) — nao mais o total do projeto. O prazo do
// projeto inteiro (calendario, 15 dias) e outra coisa, ver checkPrazoSprint.
function checkOvertime() {
  const s = loadSprint();
  if (!s || !s.sessaoIniciadaEm || !s.tarefaAtivaId) return;
  const tarefa = s.tasks.find(t => t.id === s.tarefaAtivaId && t.status === 'doing');
  if (!tarefa) return;

  const estimativa = tarefa.estimativaHoras || s.estimativaHoras;
  const ativo = tempoAtivoTotal(s);
  const estMs = estimativa * 3600000;
  const pct   = ativo / estMs;

  if (pct >= 0.8 && !APP.ov80) {
    APP.ov80 = true;
    pushMessage(NPC.pm, `Atencao! Tarefa #${tarefa.id} chegando no limite do tempo. Quanto falta?`);
    if (APP.screen === 'sprint') APP.lastFb = clr(C.yellow,`⚡ #${tarefa.id}: 80% do tempo estimado usado. Foco!`);
  }

  if (pct >= 1.0) {
    const extensao = Math.max(0.25, +(estimativa * 0.5).toFixed(2));
    s.extensoesQA = (s.extensoesQA || 0) + 1;
    tarefa.estimativaHoras = +(estimativa + extensao).toFixed(2);
    saveSprint(s);

    const penalidade = 5 * s.extensoesQA; // -5, -10, -15... escalando por sprint
    const p = loadProgress();
    p.xp     = Math.max(0, p.xp - penalidade);
    p.avisos = (p.avisos || 0) + 1;
    saveProgress(p);

    pushMessage(NPC.qa, `Tarefa #${tarefa.id} estourou o tempo. Consegui +${extensao}h com o PM, mas isso vira aviso no seu histórico.`);
    pushMessage(NPC.lead, s.extensoesQA > 1
      ? `Essa já é a ${s.extensoesQA}ª reestimativa dessa sprint. Precisamos conversar sobre planejamento.`
      : 'Uma tarefa estourou o tempo. Da próxima vez avisa antes de chegar no limite.');
    if (APP.screen === 'sprint')
      APP.lastFb = clr(C.red, `⚠ #${tarefa.id} estourou — QA deu +${extensao}h  (aviso registrado, -${penalidade} XP)`);

    APP.ov80 = false; // reseta pra poder alertar de novo dentro do novo prazo
  }
}

// Simulador vivo: a sprint corre em dias corridos de verdade (15 dias),
// mesmo com o app fechado — nao e so tempo ativo de codigo. Se o prazo
// bater, o QA renegocia com o PM, mas isso soma no mesmo contador de
// avisos/XP que o estouro de horas (as duas coisas pesam junto).
function checkPrazoSprint() {
  const s = loadSprint();
  if (!s || !s.projetoAtual || !s.sprintIniciadaEm) return;

  const prazo    = s.prazoDias || 15;
  const decorrido = Math.floor((Date.now() - new Date(s.sprintIniciadaEm).getTime()) / 86400000);
  if (decorrido < prazo) return;

  const extensaoDias = 7;
  s.prazoDias = prazo + extensaoDias;
  s.extensoesQA = (s.extensoesQA || 0) + 1;
  saveSprint(s);

  const penalidade = 5 * s.extensoesQA;
  const p = loadProgress();
  p.xp     = Math.max(0, p.xp - penalidade);
  p.avisos = (p.avisos || 0) + 1;
  saveProgress(p);

  pushMessage(NPC.pm, `Os ${prazo} dias da sprint bateram. Consegui +${extensaoDias} dias com o cliente, mas isso vira aviso.`);
  pushMessage(NPC.qa, 'Nao da pra esticar prazo pra sempre — precisamos fechar isso logo.');
  if (APP.screen === 'sprint')
    APP.lastFb = clr(C.red, `⚠ Prazo de ${prazo} dias estourou — QA conseguiu +${extensaoDias}d  (aviso registrado, -${penalidade} XP)`);
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

module.exports = { buildSprint, handleSprintKey, pick, RESP, checkRevisoesQA, sprintCommand, checkOvertime, checkPrazoSprint, proximoProjetoNivel, devEstaBloqueado, prazoSprintPara, parseEstimativaTexto, extrairTarefas, metaDoProjeto };
