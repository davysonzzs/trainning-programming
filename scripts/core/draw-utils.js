'use strict';

const { C, SPARK_CH, clr } = require('./ansi');
const { APP } = require('./app');
const { fmtMs, horaAtual, tempoAtivoTotal } = require('./dados');

function xpBar(xp, lv, w=26) {
  if (lv.xpMax === null) return clr(C.cyan, '█'.repeat(w)) + ' MAX';
  const pct = (xp - lv.xpMin) / (lv.xpMax - lv.xpMin + 1);
  const filled = Math.round(pct * w);
  return clr(C.cyan, '█'.repeat(filled)) + clr(C.gray, '░'.repeat(w-filled));
}

function metBar(v, w=10) {
  const filled = Math.round((Math.min(100, Math.max(0,v))/100)*w);
  const c = v > 80 ? C.red : v > 60 ? C.yellow : C.green;
  return `${c}${'█'.repeat(filled)}${C.gray}${'░'.repeat(w-filled)}${C.reset} ${String(v).padStart(3)}%`;
}

function sparkline() {
  return APP.spark.map(v => {
    const i = Math.min(7, Math.max(0, Math.round((v/10)*7)));
    return `${v > 7 ? C.yellow : C.cyan}${SPARK_CH[i]}${C.reset}`;
  }).join('');
}

function timerLine(s) {
  const hora   = horaAtual();
  const tarefa = s.tarefaAtivaId ? s.tasks.find(t => t.id === s.tarefaAtivaId) : null;

  // o cronometro e por tarefa (o QA passa uma coisa de cada vez) — sem
  // tarefa ativa, nao tem o que medir.
  if (!tarefa)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.gray,'—')} nenhuma tarefa em andamento — "start <nº>" pra começar`;

  const ativo   = tempoAtivoTotal(s);
  const est     = tarefa.estimativaHoras || s.estimativaHoras;
  const estMs   = est * 3600000;
  const pausado = !s.sessaoIniciadaEm;
  const pct     = ativo / estMs;
  const rot     = `#${tarefa.id}: `;

  if (pausado)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.yellow,'⏸ PAUSADO')} — ${rot}${fmtMs(ativo)} / ${est}h`;

  if (pct >= 2.0)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.red,'⚠ CRÍTICO')}: ${rot}${fmtMs(ativo)} / ${est}h  (+${fmtMs(ativo-estMs)})`;

  if (pct >= 1.0)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.red,'⚠ ESTOURADO')}: ${rot}${fmtMs(ativo)} / ${est}h  (+${fmtMs(ativo-estMs)})`;

  if (pct >= 0.8)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.yellow,'⚡')} ${rot}${fmtMs(ativo)} / ${est}h  (faltam ${fmtMs(estMs-ativo)})`;

  return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.green,'▶')} ${rot}${fmtMs(ativo)} / ${est}h  (faltam ${clr(C.cyan,fmtMs(estMs-ativo))})`;
}

module.exports = { xpBar, metBar, sparkline, timerLine };
