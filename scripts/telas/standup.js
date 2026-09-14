'use strict';

const { C, INN, LINE, bold, cen, clr, dim, row } = require('../core/ansi');
const { APP } = require('../core/app');
const { NPC, loadProgress, localDateStr, pushMessage, saveProgress } = require('../core/dados');
const { goTo, render } = require('../core/screen');
const { wrapWords } = require('../core/texto');

function buildStandup() {
  const passo = APP.standupPasso;

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold('DEVTECH SISTEMAS S.A.  ─  Daily Standup')) + '\n';
  o += row(dim('  Ritual diário do time — leva 30 segundos, todo mundo faz.')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row('') + '\n';

  for (let i = 0; i < STANDUP_PERGUNTAS.length; i++) {
    const pg = STANDUP_PERGUNTAS[i];
    if (i < passo) {
      const resp = APP.standupRespostas[pg.campo] || clr(C.gray, '(nenhum)');
      o += row(`  ${clr(C.green,'✓')} ${clr(C.gray,pg.texto)}`) + '\n';
      for (const l of wrapWords(resp, INN - 10)) o += row(`      ${l}`) + '\n';
      o += row('') + '\n';
    } else if (i === passo) {
      o += row(`  ${clr(C.cyan,'▶')} ${bold(pg.texto)}`) + '\n';
    }
  }

  o += `╠${LINE}╣\n`;
  o += row(dim('  Enter confirma   Esc pula o standup de hoje')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${clr(C.cyan,'>')} ${APP.inputBuf}${clr(C.gray,'█')}`) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

function handleStandupKey(key) {
  if (key === '\r') {
    const pg = STANDUP_PERGUNTAS[APP.standupPasso];
    APP.standupRespostas[pg.campo] = APP.inputBuf.trim();
    APP.inputBuf = '';
    APP.standupPasso++;
    if (APP.standupPasso >= STANDUP_PERGUNTAS.length) {
      salvarStandup(APP.standupRespostas, false);
      goTo('menu');
    }
  } else if (key === '\x7f' || key === '\x08') {
    APP.inputBuf = APP.inputBuf.slice(0, -1);
  } else if (key.charCodeAt(0) >= 32) {
    APP.inputBuf += key;
  }
  render();
}

const STANDUP_PERGUNTAS = [
  { campo: 'ontem',    texto: 'O que você fez ontem?' },
  { campo: 'hoje',     texto: 'O que pretende fazer hoje?' },
  { campo: 'bloqueio', texto: 'Algum bloqueio? (Enter em branco = nenhum)' },
];

function precisaStandupHoje(p) {
  return p.ultimoStandupEm !== localDateStr(new Date());
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Normaliza um texto livre em um conjunto de "palavras-chave" (minúsculas,
// sem acento/pontuação, sem palavra-de-parada) pra dar pra comparar duas
// respostas sem precisar de NLP de verdade.
const STOPWORDS = new Set(['a','o','os','as','de','da','do','das','dos','e','ou','um','uma',
  'uns','umas','para','pra','com','em','no','na','nos','nas','que','se','já','ja','vou','vai',
  'ia','vamos','ainda','vou','vai','vao','vão','vou','tambem','também','vou']);

function palavrasChave(txt) {
  return new Set(
    (txt || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 3 && !STOPWORDS.has(w))
  );
}

// Compara o que a pessoa disse ontem que ia fazer ("hoje" do standup
// anterior) com o que ela diz que de fato fez ("ontem" do standup atual).
// É so contagem de palavras em comum — não entende o texto, só dá pra ter
// uma reação plausível sem precisar de LLM.
function reagirContinuidade(planoAnterior, feitoAgora) {
  const plano = palavrasChave(planoAnterior);
  if (plano.size === 0) return null;
  const feito = palavrasChave(feitoAgora);
  let comuns = 0;
  for (const w of plano) if (feito.has(w)) comuns++;
  const ratio = comuns / plano.size;

  if (ratio >= 0.4) {
    return { npc: NPC.pm, linha: pick([
      'Boa, entregou o que tinha planejado ontem.',
      'Show, bateu com o que você falou que ia fazer.',
      'Isso, cumpriu o combinado de ontem.',
    ])};
  }
  if (ratio === 0) {
    return { npc: NPC.lead, linha: pick([
      `Ontem você falou que ia "${planoAnterior.trim()}" — mudou de prioridade?`,
      'O plano de ontem não bateu com o que rolou. Trocou de prioridade no meio do caminho?',
    ])};
  }
  return null; // parcial — melhor não comentar do que arriscar um falso positivo
}

// Reage ao que a pessoa disse que PRETENDE fazer hoje, por palavra-chave.
// Só a primeira categoria que bater fala, pra não virar spam de mensagem.
const REACOES_HOJE = [
  { re: /\bbugs?\b|corrig|conserta/i, npc: () => NPC.qa, linhas: [
      'Bug na mira. Manda pra revisão assim que sair, eu priorizo.',
      'Anotado. Se travar em alguma reprodução, me chama.',
    ]},
  { re: /deploy|publica|subir|produ[cç][aã]o/i, npc: () => NPC.lead, linhas: [
      'Deploy no radar hoje. Passa pelo checklist de revisão antes de subir.',
      'Beleza, deploy hoje — me avisa quando for subir pra eu acompanhar.',
    ]},
  { re: /refator/i, npc: () => NPC.lead, linhas: [
      'Refatoração é sempre bem-vinda. Só não esquece dos testes existentes.',
    ]},
  { re: /teste|test\b/i, npc: () => NPC.qa, linhas: [
      'Ótimo, cobertura de teste sempre ajuda. Me chama quando for revisar.',
    ]},
  { re: /estud|aula|curso|trilha/i, npc: () => NPC.pm, linhas: [
      'Boa, investindo em estudo — conta pro seu desenvolvimento.',
    ]},
  { re: /reuni|1:1|1a1/i, npc: () => NPC.pm, linhas: [
      'Beleza, te vejo lá.',
    ]},
];

function reagirAoHoje(texto) {
  if (!texto) return null;
  for (const r of REACOES_HOJE) {
    if (r.re.test(texto)) return { npc: r.npc(), linha: pick(r.linhas) };
  }
  return null;
}

function salvarStandup(respostas, pulado) {
  const p = loadProgress();
  const anterior = (p.standups || []).slice(-1)[0];
  p.ultimoStandupEm = localDateStr(new Date());
  p.standups = p.standups || [];
  p.standups.push({
    data: p.ultimoStandupEm,
    ontem: respostas.ontem || '',
    hoje: respostas.hoje || '',
    bloqueio: respostas.bloqueio || '',
    pulado: !!pulado,
  });
  if (p.standups.length > 30) p.standups = p.standups.slice(-30);
  saveProgress(p);

  if (pulado) {
    pushMessage(NPC.pm, pick([
      'Sem problema, standup de hoje fica em branco. Se quiser, dá pra registrar mais tarde.',
      'Tudo bem pular hoje. Só não deixa virar hábito, ajuda a gente a acompanhar.',
    ]));
    return;
  }

  let falouAlgo = false;

  if (anterior && !anterior.pulado) {
    const cont = reagirContinuidade(anterior.hoje, respostas.ontem);
    if (cont) { pushMessage(cont.npc, cont.linha); falouAlgo = true; }
  }

  const reacaoHoje = reagirAoHoje(respostas.hoje);
  if (reacaoHoje) { pushMessage(reacaoHoje.npc, reacaoHoje.linha); falouAlgo = true; }

  if (respostas.bloqueio && respostas.bloqueio.trim()) {
    pushMessage(NPC.lead, `Bloqueio anotado: "${respostas.bloqueio.trim()}". ${pick([
      'Bora ver isso — chama se travar.',
      'Vou dar uma olhada. Se travar de novo, me chama direto.',
    ])}`);
    pushMessage(NPC.qa, 'Fico de olho, avisa se precisar de uma revisão mais rápida hoje.');
  } else if (!falouAlgo) {
    pushMessage(NPC.pm, pick([
      'Boa, sem bloqueios. Bom trabalho hoje!',
      'Sem bloqueio, então? Segue o jogo.',
      'Show, bora pra cima.',
    ]));
  }
}

module.exports = { buildStandup, handleStandupKey, STANDUP_PERGUNTAS, precisaStandupHoje, salvarStandup };
