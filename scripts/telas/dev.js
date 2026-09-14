'use strict';

const { C, INN, LINE, bold, cen, clr, dim, row } = require('../core/ansi');
const { APP } = require('../core/app');
const { LEVELS, contarProjetos, getLevel, loadMessages, loadProgress, saveProgress } = require('../core/dados');
const { xpBar } = require('../core/draw-utils');
const { render } = require('../core/screen');
const { wrapPrefixedColored } = require('../core/texto');

function buildDev() {
  const p     = loadProgress();
  const { lv, idx } = getLevel(p.xp);
  const next  = lv.xpMax !== null ? LEVELS[idx+1] : null;
  const proj  = contarProjetos();
  const msgs  = loadMessages().slice(-5);

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold('DEVTECH SISTEMAS S.A.  ─  Ficha do Desenvolvedor')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row('') + '\n';
  o += row(`  ${clr(C.gray,'Desenvolvedor')}   ${bold(p.name)}`) + '\n';
  o += row(`  ${clr(C.gray,'Nível         ')}   ${bold(clr(C.yellow,lv.name))}`) + '\n';
  o += row(`  ${clr(C.gray,'XP            ')}   ${clr(C.cyan,String(p.xp))} XP`) + '\n';
  o += row(`  ${clr(C.gray,'Salário       ')}   ${lv.salary}`) + '\n';
  o += row(`  ${clr(C.gray,'Projetos      ')}   ${clr(C.green,String(proj.concluidos))}/${proj.total} entregues`) + '\n';
  o += row(`  ${clr(C.gray,'Prática diária')}   ${clr(C.cyan,String(p.diasSeguidos||0))} dia(s) seguido(s)${p.diasFaltados>0?clr(C.gray,`  (${p.diasFaltados} perdido(s) ao todo)`):''}`) + '\n';
  if (p.atrasadas > 0) o += row(`  ${clr(C.gray,'Atrasos       ')}   ${clr(C.yellow,String(p.atrasadas))} sprint(s) atrasada(s)`) + '\n';
  if (p.avisos > 0)    o += row(`  ${clr(C.yellow,'⚠ Avisos      ')}   ${clr(C.yellow,String(p.avisos))} aviso(s) de desempenho`) + '\n';
  o += row('') + '\n';
  const ultimoStandup = (p.standups || []).slice(-1)[0];
  if (ultimoStandup && !ultimoStandup.pulado) {
    o += `╠${LINE}╣\n`;
    o += row(bold(` ÚLTIMO STANDUP — ${ultimoStandup.data}`)) + '\n';
    o += `╠${LINE}╣\n`;
    o += row(`  ${clr(C.gray,'Ontem:')}    ${ultimoStandup.ontem || clr(C.gray,'(nada registrado)')}`) + '\n';
    o += row(`  ${clr(C.gray,'Hoje:')}     ${ultimoStandup.hoje || clr(C.gray,'(nada registrado)')}`) + '\n';
    o += row(`  ${clr(C.gray,'Bloqueio:')} ${ultimoStandup.bloqueio ? clr(C.yellow,ultimoStandup.bloqueio) : clr(C.green,'nenhum')}`) + '\n';
  }
  o += `╠${LINE}╣\n`;
  o += row(`  ${xpBar(p.xp, lv, 40)}`) + '\n';
  if (next)
    o += row(`  ${clr(C.gray,'→')} ${clr(C.yellow,next.name)} em ${clr(C.cyan,String(lv.xpMax+1-p.xp)+' XP')}`) + '\n';
  else
    o += row(clr(C.green,'  ★ Nível máximo atingido!')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(bold(' ÚLTIMAS MENSAGENS DA EQUIPE')) + '\n';
  o += `╠${LINE}╣\n`;
  if (msgs.length === 0)
    o += row(clr(C.gray,'  (nenhuma mensagem ainda)')) + '\n';
  else
    for (const m of msgs) {
      const linhas = wrapPrefixedColored(clr(C.gray, `${m.tag} `), m.texto, INN - 1, 2);
      for (const l of linhas) o += row(` ${l}`) + '\n';
    }
  o += `╠${LINE}╣\n`;
  o += row(dim('  name <seu nome>   Enter atualizar   Esc voltar')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${clr(C.cyan,'>')} ${APP.inputBuf}${clr(C.gray,'█')}`) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

function handleDevKey(key) {
  if (key === '\r') {
    if (APP.inputBuf.trim()) {
      const parts = APP.inputBuf.trim().split(/\s+/);
      if (parts[0] === 'name' && parts[1]) {
        const p = loadProgress(); p.name = parts.slice(1).join(' '); saveProgress(p);
        APP.lastFb = `Nome atualizado: ${p.name}`;
      }
    }
    APP.inputBuf = '';
  } else if (key === '\x7f' || key === '\x08') {
    APP.inputBuf = APP.inputBuf.slice(0, -1);
  } else if (key.charCodeAt(0) >= 32) {
    APP.inputBuf += key;
  }
  render();
}

module.exports = { buildDev, handleDevKey };
