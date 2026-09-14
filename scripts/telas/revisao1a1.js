'use strict';

// Tela de "1:1 com o Tech Lead" — nao e um item do menu, e um interstício
// disparado pelo sprint.js a cada N projetos entregues (ver CADENCIA_1A1),
// igual o Daily Standup. Junta metricas que ja existem espalhadas (XP,
// avisos, atrasos, streak) num resumo so, com uma leitura qualitativa do
// Lead — e o analogo de uma review de performance de verdade.

const { C, INN, LINE, bold, cen, clr, dim, row } = require('../core/ansi');
const { LEVELS, contarProjetos, getLevel, loadProgress } = require('../core/dados');
const { xpBar } = require('../core/draw-utils');
const { goTo, render } = require('../core/screen');

const CADENCIA_1A1 = 3; // a cada 3 projetos entregues

function precisaRevisao1a1(concluidosGlobal) {
  return concluidosGlobal > 0 && concluidosGlobal % CADENCIA_1A1 === 0;
}

// A leitura do Lead nao e so "bom" ou "ruim" — combina avisos (estouro de
// tempo/prazo) com faltas (sumiu sem avisar), que pesam de formas
// diferentes: avisos sao sobre estimativa, faltas sao sobre rotina.
function leituraDoLead(p) {
  const avisos = p.avisos || 0;
  const faltados = p.diasFaltados || 0;
  const frases = [];

  if (avisos === 0 && faltados === 0) {
    frases.push('Zero avisos, zero falta. Ritmo exatamente onde eu queria — continua assim.');
  } else {
    if (avisos === 0) frases.push('Nenhum aviso de estouro de prazo. Suas estimativas estão calibradas.');
    else if (avisos <= 2) frases.push(`${avisos} aviso(s) de estouro até agora — normal no começo, presta atenção em estimar um pouco mais de folga.`);
    else frases.push(`${avisos} avisos acumulados é mais do que eu gostaria. Vamos conversar sobre o que tá estourando: tarefa mal estimada ou distração no meio do caminho?`);

    if (faltados > 0) frases.push(`${faltados} dia(s) sem aparecer no total. Constância importa mais que correr atrás depois.`);
  }

  if ((p.diasSeguidos || 0) >= 5) frases.push(`${p.diasSeguidos} dias seguidos de prática, aliás — isso sim é hábito.`);

  return frases.join(' ');
}

function buildRevisao1a1() {
  const p = loadProgress();
  const { lv, idx } = getLevel(p.xp);
  const proj = contarProjetos();
  const next = lv.xpMax !== null ? LEVELS[idx + 1] : null;

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold('DEVTECH SISTEMAS S.A.  ─  1:1 com o Tech Lead')) + '\n';
  o += row(dim(`  Check-in a cada ${CADENCIA_1A1} projetos entregues — ${proj.concluidos}º projeto bateu a marca.`)) + '\n';
  o += `╠${LINE}╣\n`;
  o += row('') + '\n';
  o += row(`  ${clr(C.gray,'Nível atual        ')}  ${bold(clr(C.yellow,lv.name))}`) + '\n';
  o += row(`  ${clr(C.gray,'XP total           ')}  ${clr(C.cyan,String(p.xp))} XP`) + '\n';
  o += row(`  ${clr(C.gray,'Projetos entregues ')}  ${clr(C.green,String(proj.concluidos))}/${proj.total}`) + '\n';
  o += row(`  ${clr(C.gray,'Avisos de desempenho')} ${p.avisos > 0 ? clr(C.yellow,String(p.avisos)) : clr(C.green,'0')}`) + '\n';
  o += row(`  ${clr(C.gray,'Sprints atrasadas  ')}  ${p.atrasadas > 0 ? clr(C.yellow,String(p.atrasadas)) : clr(C.green,'0')}`) + '\n';
  o += row(`  ${clr(C.gray,'Prática diária     ')}  ${clr(C.cyan,String(p.diasSeguidos||0))} dia(s) seguido(s)${p.diasFaltados>0 ? clr(C.gray,`  (${p.diasFaltados} perdido(s) ao todo)`) : ''}`) + '\n';
  o += row('') + '\n';
  o += `╠${LINE}╣\n`;
  o += row(`  ${xpBar(p.xp, lv, 40)}`) + '\n';
  if (next) o += row(`  ${clr(C.gray,'→')} ${clr(C.yellow,next.name)} em ${clr(C.cyan,String(lv.xpMax+1-p.xp)+' XP')}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(bold(' RAFAEL (TECH LEAD)')) + '\n';
  o += `╠${LINE}╣\n`;
  for (const l of wrapDentro(leituraDoLead(p), INN - 4)) o += row(`  ${l}`) + '\n';
  o += row('') + '\n';
  o += `╠${LINE}╣\n`;
  o += row(dim('  Enter ou Esc — voltar ao menu')) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

// wrap simples só pra esse texto corrido (sem markdown/cor) — evitar puxar
// texto.js só por isso.
function wrapDentro(text, width) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = [], curLen = 0;
  for (const w of words) {
    const add = curLen === 0 ? w.length : curLen + 1 + w.length;
    if (add > width && curLen > 0) { lines.push(cur.join(' ')); cur = [w]; curLen = w.length; }
    else { cur.push(w); curLen = add; }
  }
  if (cur.length) lines.push(cur.join(' '));
  return lines.length ? lines : [''];
}

function handleRevisao1a1Key(key) {
  // Esc já é tratado globalmente (volta pro menu) antes de chegar aqui —
  // só falta o Enter, que tem o mesmo efeito nessa tela somente-leitura.
  if (key === '\r') { goTo('menu'); render(); return; }
}

module.exports = { CADENCIA_1A1, precisaRevisao1a1, buildRevisao1a1, handleRevisao1a1Key };
