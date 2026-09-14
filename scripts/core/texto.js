'use strict';

const { C, bold, clr, dim, stripAnsi } = require('./ansi');

const MD_WIDTH = 68;

function wrapWords(text, width) {
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

// Mensagem maior que a largura disponível? Em vez de cortar, quebra em até
// `maxLines` linhas — a primeira com `prefixColored` (pode já vir colorido,
// só a largura visível dele importa pro cálculo), as seguintes indentadas
// na mesma coluna onde o texto começou.
function wrapPrefixedColored(prefixColored, body, width, maxLines) {
  const plainLen = stripAnsi(prefixColored).length;
  const avail    = Math.max(10, width - plainLen);
  let chunks = wrapWords(body, avail);
  if (chunks.length > maxLines) {
    chunks = chunks.slice(0, maxLines);
    chunks[maxLines - 1] = chunks[maxLines - 1] + '…';
  }
  const indent = ' '.repeat(plainLen);
  return chunks.map((c, i) => (i === 0 ? prefixColored + c : indent + c));
}

// Aplica negrito/itálico/código/links inline (markdown) usando ANSI.
function mdInline(text) {
  return text
    .replace(/`([^`]+)`/g,        (_, c) => clr(C.yellow, c))
    .replace(/\*\*([^*]+)\*\*/g,  (_, b) => bold(b))
    .replace(/__([^_]+)__/g,      (_, b) => bold(b))
    .replace(/\*([^*]+)\*/g,      (_, i) => dim(i))
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => clr(C.cyan, t) + ' ' + clr(C.gray, `(${u})`));
}

// Quebra `text` em linhas de até `width` (medindo texto puro) e prefixa a
// primeira com `prefix` (colorido) e as demais com espaços do mesmo tamanho.
function mdBlock(text, prefix, width) {
  const indent = ' '.repeat(stripAnsi(prefix).length);
  return wrapWords(text, Math.max(10, width - stripAnsi(prefix).length))
    .map((ln, i) => (i === 0 ? prefix : indent) + mdInline(ln));
}

function renderMarkdown(raw) {
  const out = [];
  let paragrafo = [];
  let emCodigo = false;
  let codigo = [];

  function flush() {
    if (!paragrafo.length) return;
    const texto = paragrafo.join(' ').trim();
    paragrafo = [];
    if (!texto) return;
    for (const ln of wrapWords(texto, MD_WIDTH)) out.push(mdInline(ln));
  }

  for (const raw2 of raw.split('\n')) {
    const hardBreak = /  $/.test(raw2);   // duas espacos no fim = quebra de linha do markdown
    const ln = raw2.replace(/\s+$/, '');
    const fence = ln.match(/^```/);

    if (fence) {
      if (!emCodigo) {
        flush();
        emCodigo = true; codigo = [];
        out.push(clr(C.gray, '  ┌' + '─'.repeat(MD_WIDTH - 2)));
      } else {
        for (const cl of codigo) out.push(clr(C.green, '  │ ') + clr(C.green, cl));
        out.push(clr(C.gray, '  └' + '─'.repeat(MD_WIDTH - 2)));
        emCodigo = false;
      }
      continue;
    }
    if (emCodigo) { codigo.push(ln.length > MD_WIDTH - 4 ? ln.slice(0, MD_WIDTH - 5) + '…' : ln); continue; }

    if (ln.trim() === '')                     { flush(); out.push(''); continue; }
    if (/^-{3,}$/.test(ln.trim()))             { flush(); out.push(clr(C.gray, '─'.repeat(MD_WIDTH))); continue; }

    let m;
    if (m = ln.match(/^#\s+(.*)/))             { flush(); out.push(''); out.push(bold(clr(C.cyan, mdInline(m[1])))); out.push(clr(C.cyan, '═'.repeat(Math.min(MD_WIDTH, stripAnsi(mdInline(m[1])).length)))); continue; }
    if (m = ln.match(/^##\s+(.*)/))            { flush(); out.push(''); out.push(bold(clr(C.cyan, '▎ ' + mdInline(m[1])))); continue; }
    if (m = ln.match(/^###\s+(.*)/))           { flush(); out.push(''); out.push(bold(clr(C.yellow, '• ' + mdInline(m[1])))); continue; }
    if (m = ln.match(/^>\s?(.*)/))             { flush(); out.push(...mdBlock(m[1], clr(C.gray, '  │ '), MD_WIDTH)); continue; }
    if (m = ln.match(/^[-*]\s+\[ \]\s+(.*)/))  { flush(); out.push(...mdBlock(m[1], clr(C.gray, '  ○ '), MD_WIDTH)); continue; }
    if (m = ln.match(/^[-*]\s+\[x\]\s+(.*)/i)) { flush(); out.push(...mdBlock(m[1], clr(C.green, '  ✓ '), MD_WIDTH)); continue; }
    if (m = ln.match(/^[-*]\s+(.*)/))          { flush(); out.push(...mdBlock(m[1], clr(C.cyan, '  • '), MD_WIDTH)); continue; }
    if (m = ln.match(/^(\d+)\.\s+(.*)/))       { flush(); out.push(...mdBlock(m[2], clr(C.cyan, `  ${m[1]}. `), MD_WIDTH)); continue; }

    paragrafo.push(ln);
    if (hardBreak) flush();   // quebra de linha explicita do markdown: nao junta com a proxima
  }
  flush();
  return out;
}

module.exports = { MD_WIDTH, wrapWords, wrapPrefixedColored, mdInline, mdBlock, renderMarkdown };
