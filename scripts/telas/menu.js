'use strict';

const { C, LINE, bold, cen, clr, dim, row } = require('../core/ansi');
const { APP, MENU_ITEMS } = require('../core/app');
const { LEVELS, contarProjetos, getLevel, horaAtual, loadProgress } = require('../core/dados');
const { xpBar } = require('../core/draw-utils');
const { goTo, render } = require('../core/screen');

function buildMenu() {
  const p    = loadProgress();
  const { lv, idx } = getLevel(p.xp);
  const proj = contarProjetos();
  const next = lv.xpMax !== null ? LEVELS[idx+1] : null;

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += row(bold(clr(C.cyan, '  ██████╗ ███████╗██╗   ██╗████████╗███████╗ ██████╗██╗  ██╗'))) + '\n';
  o += row(clr(C.cyan, '  ██╔══██╗██╔════╝██║   ██║╚══██╔══╝██╔════╝██╔════╝██║  ██║')) + '\n';
  o += row(clr(C.cyan, '  ██║  ██║█████╗  ██║   ██║   ██║   █████╗  ██║     ███████║')) + '\n';
  o += row(clr(C.cyan, '  ██║  ██║██╔══╝  ╚██╗ ██╔╝   ██║   ██╔══╝  ██║     ██╔══██║')) + '\n';
  o += row(clr(C.cyan, '  ██████╔╝███████╗ ╚████╔╝    ██║   ███████╗╚██████╗██║  ██║')) + '\n';
  o += row(clr(C.cyan, '  ╚═════╝ ╚══════╝  ╚═══╝     ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝')) + '\n';
  o += cen(clr(C.gray, 'S I S T E M A S   S . A .   —   Sistema de Treinamento')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${bold(p.name)} ${clr(C.gray,'│')} ${clr(C.yellow,lv.name)} ${clr(C.gray,'│')} XP: ${clr(C.cyan,String(p.xp))}/${lv.xpMax !== null ? lv.xpMax+1 : 'MAX'} ${clr(C.gray,'│')} ${proj.concluidos}/${proj.total} proj ${clr(C.gray,'│')} ${clr(C.cyan,horaAtual())}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += row('') + '\n';

  for (let i = 0; i < MENU_ITEMS.length; i++) {
    const sel = i === APP.menuSel;
    const cursor = sel ? clr(C.cyan, `${C.bold}▶ [${MENU_ITEMS[i].key}]`) : `  [${MENU_ITEMS[i].key}]`;
    const label  = sel ? bold(clr(C.white, MENU_ITEMS[i].label)) : MENU_ITEMS[i].label;
    const desc   = clr(C.gray, MENU_ITEMS[i].desc);
    o += row(`  ${cursor}  ${label.padEnd(sel ? 34+9 : 34)}  ${desc}`) + '\n';
  }

  o += row('') + '\n';
  if (next) {
    const bar = xpBar(p.xp, lv, 20);
    o += row(`  ${clr(C.gray,'Próximo:')} ${clr(C.yellow,next.name)}  ${bar}  ${clr(C.gray,String(lv.xpMax+1-p.xp)+' XP')}`) + '\n';
  }
  if (p.avisos > 0) o += row(`  ${clr(C.yellow,'⚠')}  Avisos de desempenho: ${clr(C.yellow,String(p.avisos))}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(dim(`  ↑↓  mover   Enter  entrar   1-6  atalho   Ctrl+C  sair`)) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

function handleMenuKey(key) {
  if (key === '\x1b[A' || key === 'k') APP.menuSel = (APP.menuSel + MENU_ITEMS.length - 1) % MENU_ITEMS.length;
  if (key === '\x1b[B' || key === 'j') APP.menuSel = (APP.menuSel + 1) % MENU_ITEMS.length;
  if (key === '\r') goTo(['empresa','sprint','dev','projetos','aulas','github'][APP.menuSel]);
  render();
}

module.exports = { buildMenu, handleMenuKey };
