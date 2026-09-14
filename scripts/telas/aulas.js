'use strict';

const fs = require('fs');
const path = require('path');
const { C, LINE, bold, cen, clr, dim, row } = require('../core/ansi');
const { APP } = require('../core/app');
const { AULAS_DIR, AULAS_FILE, getLevel, loadProgress } = require('../core/dados');
const { render } = require('../core/screen');
const { renderMarkdown } = require('../core/texto');

// Uma fase com conteudo de verdade (por enquanto so a Fase 1) tem uma pasta
// em AULAS_DIR (`fase-01-fundamentos-de-programacao/`, etc.) com um .md por
// topico, numerado — ver docs/plan.md pra convencao de quem cria a proxima
// fase. Acha a pasta pelo prefixo `fase-NN-`, sem precisar bater o slug
// inteiro do nome.
function pastaDaFase(faseNum) {
  if (!fs.existsSync(AULAS_DIR)) return null;
  const prefixo = `fase-${String(faseNum).padStart(2, '0')}-`;
  const achada = fs.readdirSync(AULAS_DIR)
    .find(d => d.startsWith(prefixo) && fs.statSync(path.join(AULAS_DIR, d)).isDirectory());
  return achada ? path.join(AULAS_DIR, achada) : null;
}

// Arquivos de topico dentro da pasta da fase: `01-algo.md`, `02-outro.md`...
// — o README.md da pasta e só o índice/links, não entra no conteúdo (senão
// duplicaria os mesmos links já mostrados pela tela).
function arquivosDeTopico(pastaFase) {
  return fs.readdirSync(pastaFase)
    .filter(f => /^\d+.*\.md$/i.test(f) && f.toLowerCase() !== 'readme.md')
    .sort();
}

// AULAS.md e o índice: preâmbulo (título, antes da 1a "## FASE") + um bloco
// por fase. O cabeçalho de cada fase é colorido na mão conforme o progresso
// (passada/atual/futura). Pro CONTEÚDO de cada fase: se ela já tem pasta de
// tópicos (Fase 1, por ora), lê e concatena esses arquivos — mais completos
// que o índice do AULAS.md; senão, cai pro corpo inline do próprio AULAS.md
// (a lista de assuntos "crua", pras fases ainda não construídas). Os dois
// casos passam pelo mesmo renderMarkdown() que os READMEs de projeto usam
// (ver scripts/telas/projetos.js).
function loadAulas() {
  if (APP.aulaLines.length) return;
  if (!fs.existsSync(AULAS_FILE)) { APP.aulaLines = [clr(C.gray, 'AULAS.md não encontrado.')]; return; }
  const raw = fs.readFileSync(AULAS_FILE, 'utf8');
  const p   = loadProgress();
  const { lv } = getLevel(p.xp);

  const blocos = raw.split(/\n(?=## FASE\s)/);
  let linhaFaseAtual = null;

  for (const bloco of blocos) {
    const quebra = bloco.indexOf('\n');
    const linha1 = quebra === -1 ? bloco : bloco.slice(0, quebra);
    const resto  = quebra === -1 ? ''    : bloco.slice(quebra + 1);
    const m = linha1.match(/^## FASE (\d+)\s*[—-]\s*(.*)/);

    if (!m) { APP.aulaLines.push(...renderMarkdown(bloco)); continue; }

    const faseNum   = parseInt(m[1], 10);
    const isCurrent = lv.fase === faseNum;
    const isPast    = lv.fase > faseNum;
    const icone = isCurrent ? '▶' : isPast ? '✓' : ' ';
    const cor   = isCurrent ? C.cyan : isPast ? C.green : C.gray;

    if (isCurrent && linhaFaseAtual === null) linhaFaseAtual = APP.aulaLines.length + 1;

    APP.aulaLines.push('');
    APP.aulaLines.push(bold(clr(cor, `${icone} FASE ${faseNum} — ${m[2].trim()}`)));
    APP.aulaLines.push(clr(cor, '═'.repeat(40)));

    const pastaFase = pastaDaFase(faseNum);
    const arquivos  = pastaFase ? arquivosDeTopico(pastaFase) : [];
    if (arquivos.length) {
      const conteudo = arquivos.map(f => fs.readFileSync(path.join(pastaFase, f), 'utf8')).join('\n\n');
      APP.aulaLines.push(...renderMarkdown(conteudo));
    } else {
      APP.aulaLines.push(...renderMarkdown(resto));
    }
  }

  // Primeira vez que a trilha e aberta nessa sessao: pula direto pro trecho
  // da fase atual em vez de sempre comecar do topo — a Fase 1 sozinha ja
  // tem bastante conteudo, ninguem quer rolar tudo pra achar onde parou.
  if (linhaFaseAtual !== null) APP.aulasScroll = Math.max(0, linhaFaseAtual - 1);
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
