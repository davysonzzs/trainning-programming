'use strict';

const C = {
  cls:     '\x1b[2J\x1b[3J\x1b[H',
  home:    '\x1b[H',
  hide:    '\x1b[?25l',
  show:    '\x1b[?25h',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  reset:   '\x1b[0m',
  red:     '\x1b[31m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  magenta: '\x1b[35m',
  cyan:    '\x1b[36m',
  white:   '\x1b[97m',
  gray:    '\x1b[90m',
  bgBlack: '\x1b[40m',
};

const W = 80, INN = W - 4;   // border=2, pad=1 each side → inner=76

const LINE = '═'.repeat(W - 2);

const DIV  = '─'.repeat(W - 2);

const SPIN = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];

const SPARK_CH = ['▁','▂','▃','▄','▅','▆','▇','█'];

function row(str) {
  const trunc = truncateVisible(str, INN);
  const s = stripAnsi(trunc);
  const pad = Math.max(0, INN - s.length);
  return `║ ${trunc}${' '.repeat(pad)} ║`;
}

function cen(str) {
  const trunc = truncateVisible(str, INN);
  const s = stripAnsi(trunc);
  const lp = Math.max(0, Math.floor((INN - s.length) / 2));
  const rp = Math.max(0, INN - s.length - lp);
  return `║ ${' '.repeat(lp)}${trunc}${' '.repeat(rp)} ║`;
}

function stripAnsi(s) {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

// Trunca `str` para no máximo `maxLen` caracteres VISÍVEIS, preservando
// os códigos ANSI de cor intactos (para não quebrar a formatação nem a
// largura da linha quando o conteúdo — nome, tarefa, mensagem — é maior
// que o espaço interno da caixa).
function truncateVisible(str, maxLen) {
  if (stripAnsi(str).length <= maxLen) return str;
  let out = '', visible = 0, i = 0;
  while (i < str.length && visible < maxLen) {
    if (str[i] === '\x1b') {
      const m = str.slice(i).match(/^\x1b\[[0-9;]*m/);
      if (m) { out += m[0]; i += m[0].length; continue; }
    }
    out += str[i]; visible++; i++;
  }
  return out + C.reset;
}

function clr(color, str) { return `${color}${str}${C.reset}`; }

function bold(str)   { return `${C.bold}${str}${C.reset}`; }

function dim(str)    { return `${C.dim}${str}${C.reset}`; }

module.exports = { C, W, INN, LINE, DIV, SPIN, SPARK_CH, row, cen, stripAnsi, truncateVisible, clr, bold, dim };
