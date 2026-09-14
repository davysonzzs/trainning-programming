'use strict';

const fs = require('fs');
const path = require('path');
const { C, LINE, bold, cen, clr, dim, row } = require('../core/ansi');
const { APP } = require('../core/app');
const { LEVELS, PROJECTS_DIR, contarProjetos, loadSprint } = require('../core/dados');
const { xpBar } = require('../core/draw-utils');
const { render } = require('../core/screen');
const { renderMarkdown } = require('../core/texto');

function getProjectStatus(nivel, proj, atual) {
  const pp = path.join(PROJECTS_DIR, nivel, proj);
  if (fs.existsSync(path.join(pp, '.concluido')))   return { icon: clr(C.green,'✓'), label: 'ENTREGUE',     cor: C.green  };
  if (atual && atual.includes(proj))                return { icon: clr(C.yellow,'⚙'), label: 'EM ANDAMENTO', cor: C.yellow };
  return { icon: clr(C.gray,'○'), label: 'PENDENTE',     cor: C.gray   };
}

function buildProjetos() {
  if (APP.projView === 'readme') return buildProjetoReadme();

  const sprint = loadSprint();
  const atual  = sprint?.projetoAtual || null;
  const proj   = contarProjetos();

  const lines = [];
  const indice = [];   // mapeia numero exibido → { nivel, pj }
  if (!fs.existsSync(PROJECTS_DIR)) {
    lines.push(clr(C.gray,'  Nenhum projeto encontrado.'));
  } else {
    for (const nivel of fs.readdirSync(PROJECTS_DIR).sort()) {
      const np = path.join(PROJECTS_DIR, nivel);
      if (!fs.statSync(np).isDirectory()) continue;
      const lv = LEVELS.find(l => l.folder === nivel);
      lines.push(`  ${bold(clr(C.cyan, (lv ? lv.name : nivel).padEnd(12)))}`);
      for (const pj of fs.readdirSync(np).sort()) {
        const pp = path.join(np, pj);
        if (!fs.statSync(pp).isDirectory()) continue;
        const st = getProjectStatus(nivel, pj, atual);
        indice.push({ nivel, pj });
        const num = String(indice.length).padStart(2,'0');
        lines.push(`  ${clr(C.gray,num)}  ${st.icon}  ${clr(st.cor, pj.padEnd(34))} ${clr(st.cor, st.label)}`);
      }
    }
  }
  APP.projIndice = indice;

  const visible = 18;
  const total   = lines.length;
  const scroll  = Math.max(0, Math.min(APP.projetosScroll, Math.max(0, total - visible)));
  APP.projetosScroll = scroll;

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold('DEVTECH SISTEMAS S.A.  ─  Quadro de Projetos')) + '\n';
  o += row(` ${clr(C.green,String(proj.concluidos))}/${proj.total} projetos entregues  ${xpBar(proj.concluidos, {xpMin:0,xpMax:proj.total-1}, 30)}`) + '\n';
  if (total > visible)
    o += row(dim(`  [${scroll+1}-${Math.min(scroll+visible,total)} de ${total}]`)) + '\n';
  o += `╠${LINE}╣\n`;

  const slice = lines.slice(scroll, scroll + visible);
  for (const ln of slice) o += row(ln) + '\n';
  for (let i = slice.length; i < visible; i++) o += row('') + '\n';

  o += `╠${LINE}╣\n`;
  if (APP.lastFb) { o += row(` ${APP.lastFb}`) + '\n'; o += `╠${LINE}╣\n`; }
  o += row(dim('  ↑↓  rolar   PgUp/PgDn  página   Nº + Enter  ler README   Esc  voltar')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${clr(C.cyan,'>')} ${APP.inputBuf}${clr(C.gray,'█')}`) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

function buildProjetoReadme() {
  const { nivel, pj } = APP.projReadmeAtual || {};
  const lv = LEVELS.find(l => l.folder === nivel);

  const visible = 24;
  const total   = APP.readmeLines.length;
  const scroll  = Math.max(0, Math.min(APP.readmeScroll, Math.max(0, total - visible)));
  APP.readmeScroll = scroll;

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold(`README  ─  ${pj || '?'}`)) + '\n';
  o += row(dim(`  ${lv ? lv.name : nivel}   [${scroll+1}-${Math.min(scroll+visible,total)} de ${total}]`)) + '\n';
  o += `╠${LINE}╣\n`;

  const slice = APP.readmeLines.slice(scroll, scroll + visible);
  for (const ln of slice) o += row(' ' + ln) + '\n';
  for (let i = slice.length; i < visible; i++) o += row('') + '\n';

  o += `╠${LINE}╣\n`;
  o += row(dim('  ↑↓  rolar   PgUp/PgDn  página   Esc  voltar ao quadro')) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

function abrirReadme(num) {
  const entry = APP.projIndice?.[num - 1];
  if (!entry) return `  Projeto nº ${num} não encontrado.`;
  const readmePath = path.join(PROJECTS_DIR, entry.nivel, entry.pj, 'README.md');
  if (!fs.existsSync(readmePath)) {
    APP.readmeLines = [clr(C.gray, 'Este projeto ainda não tem README.md.')];
  } else {
    APP.readmeLines = renderMarkdown(fs.readFileSync(readmePath, 'utf8'));
  }
  APP.projReadmeAtual = entry;
  APP.readmeScroll = 0;
  APP.projView = 'readme';
  return null;
}

function handleProjetosKey(key) {
  if (APP.projView === 'readme') {
    if (key === '\x1b[A') APP.readmeScroll = Math.max(0, APP.readmeScroll - 1);
    if (key === '\x1b[B') APP.readmeScroll++;
    if (key === '\x1b[5~') APP.readmeScroll = Math.max(0, APP.readmeScroll - 10); // PgUp
    if (key === '\x1b[6~') APP.readmeScroll += 10;                                 // PgDn
    render();
    return;
  }

  if (key === '\x1b[A') APP.projetosScroll = Math.max(0, APP.projetosScroll - 1);
  if (key === '\x1b[B') APP.projetosScroll++;
  if (key === '\x1b[5~') APP.projetosScroll = Math.max(0, APP.projetosScroll - 10); // PgUp
  if (key === '\x1b[6~') APP.projetosScroll += 10;                                   // PgDn

  if (key === '\r') {
    const num = parseInt(APP.inputBuf.trim(), 10);
    APP.lastFb = isNaN(num) ? null : abrirReadme(num);
    APP.inputBuf = '';
  } else if (key === '\x7f' || key === '\x08') {
    APP.inputBuf = APP.inputBuf.slice(0, -1);
  } else if (key.charCodeAt(0) >= 32) {
    APP.inputBuf += key;
  }
  render();
}

module.exports = { getProjectStatus, buildProjetos, buildProjetoReadme, abrirReadme, handleProjetosKey };
