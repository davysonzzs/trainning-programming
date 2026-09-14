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
      for (const l of wrapWords(resp, INN - 4)) o += row(`      ${l}`) + '\n';
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

function salvarStandup(respostas, pulado) {
  const p = loadProgress();
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
    pushMessage(NPC.pm, 'Sem problema, standup de hoje fica em branco. Se quiser, dá pra registrar mais tarde.');
  } else if (respostas.bloqueio && respostas.bloqueio.trim()) {
    pushMessage(NPC.lead, `Bloqueio anotado: "${respostas.bloqueio.trim()}". Bora ver isso — chama se travar.`);
    pushMessage(NPC.qa, 'Fico de olho, avisa se precisar de uma revisão mais rápida hoje.');
  } else {
    pushMessage(NPC.pm, 'Boa, sem bloqueios. Bom trabalho hoje!');
  }
}

module.exports = { buildStandup, handleStandupKey, STANDUP_PERGUNTAS, precisaStandupHoje, salvarStandup };
