'use strict';

const { C, LINE, bold, cen, clr, dim, row } = require('../core/ansi');
const { APP, MENU_ITEMS } = require('../core/app');
const { LEVELS, contarProjetos, getLevel, horaAtual, loadProgress, loadSprint } = require('../core/dados');
const { xpBar } = require('../core/draw-utils');
const { goTo, render } = require('../core/screen');

// O Painel de Sprint e a tela mais usada — o resto (Corporativo, Ficha,
// Projetos, GitHub) so e visitado quando o jogador lembra. Esses avisinhos
// ao lado do item do menu vem de estado real (nunca inventado so pra
// puxar clique) — cada tela tem algo esperando, o menu so aponta onde.
function badgesDoMenu(p) {
  const b = { empresa: null, sprint: null, dev: null, projetos: null, aulas: null, github: null };
  if (APP.incAtivo) b.empresa = clr(C.red, '● incidente ativo');
  if (p.avisos > 0) b.dev = clr(C.yellow, `⚠ ${p.avisos} aviso(s)`);

  const s = loadSprint();
  if (s) {
    const projetos    = s.projetos || [];
    const pendConcluir = projetos.filter(pr => pr.status==='aprovado').length;
    const emRevisao    = projetos.filter(pr => pr.status==='revisao').length;
    if (pendConcluir > 0) b.sprint = clr(C.green, `★ ${pendConcluir} aprovado(s) — falta concluir`);
    if (emRevisao > 0)    b.github = clr(C.cyan,  `● ${emRevisao} PR em revisão com o QA`);
  }
  return b;
}

function buildMenu() {
  const p    = loadProgress();
  const { lv, idx } = getLevel(p.xp);
  const proj = contarProjetos();
  const next = lv.xpMax !== null ? LEVELS[idx+1] : null;
  const badge = badgesDoMenu(p);
  const badgeKey = ['empresa','sprint','dev','projetos','aulas','github'];

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
    const av = badge[badgeKey[i]];
    if (av) o += row(`         ${av}`) + '\n';
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
