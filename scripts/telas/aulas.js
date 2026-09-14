'use strict';

const fs = require('fs');
const { C, INN, LINE, bold, cen, clr, dim, row } = require('../core/ansi');
const { APP } = require('../core/app');
const { AULAS_FILE, getLevel, loadProgress } = require('../core/dados');
const { render } = require('../core/screen');

function loadAulas() {
  if (APP.aulaLines.length) return;
  if (!fs.existsSync(AULAS_FILE)) { APP.aulaLines = [clr(C.gray,'aulas.md não encontrado.')]; return; }
  const raw = fs.readFileSync(AULAS_FILE, 'utf8').split('\n');
  const p   = loadProgress();
  const { lv } = getLevel(p.xp);

  for (const ln of raw) {
    if (ln.startsWith('## FASE')) {
      // encontra o número da fase
      const m = ln.match(/FASE (\d+)/);
      const faseNum = m ? parseInt(m[1]) : 0;
      const isCurrent = lv.fase === faseNum;
      const isPast    = lv.fase > faseNum;
      if (isCurrent)    APP.aulaLines.push(clr(C.cyan, bold(`▶ ${ln}`)));
      else if (isPast)  APP.aulaLines.push(clr(C.green, `✓ ${ln}`));
      else              APP.aulaLines.push(clr(C.gray, `  ${ln}`));
    } else if (ln.startsWith('- ')) {
      APP.aulaLines.push(clr(C.gray, `    ${ln}`));
    } else if (ln.startsWith('#')) {
      APP.aulaLines.push(bold(ln));
    } else if (ln === '---') {
      APP.aulaLines.push(clr(C.gray, '  ' + '─'.repeat(INN-2)));
    } else {
      APP.aulaLines.push(ln);
    }
  }
}

function buildAulas() {
  loadAulas();
  const visible = 28;
  const total   = APP.aulaLines.length;
  const scroll  = Math.max(0, Math.min(APP.aulasScroll, total - visible));
  APP.aulasScroll = scroll;

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold('DEVTECH SISTEMAS S.A.  ─  Trilha de Estudos')) + '\n';
  o += row(dim(`  14 fases • Estagiário → Sênior III   [${scroll+1}-${Math.min(scroll+visible,total)} de ${total}]`)) + '\n';
  o += `╠${LINE}╣\n`;

  const slice = APP.aulaLines.slice(scroll, scroll + visible);
  for (const ln of slice) o += row(' ' + ln) + '\n';
  for (let i = slice.length; i < visible; i++) o += row('') + '\n';

  o += `╠${LINE}╣\n`;
  o += row(dim('  ↑↓  rolar   PgUp/PgDn  página   Esc  voltar')) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

function handleAulasKey(key) {
  if (key === '\x1b[A' || key === 'k') APP.aulasScroll = Math.max(0, APP.aulasScroll - 1);
  if (key === '\x1b[B' || key === 'j') APP.aulasScroll++;
  if (key === '\x1b[5~') APP.aulasScroll = Math.max(0, APP.aulasScroll - 10); // PgUp
  if (key === '\x1b[6~') APP.aulasScroll += 10;                                // PgDn
  render();
}

module.exports = { loadAulas, buildAulas, handleAulasKey };
