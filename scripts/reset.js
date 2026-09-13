// scripts/reset.js — Reseta o progresso do simulador ao estado zerado
// Uso: npm run resetar        (pede confirmação)
//      npm run resetar -- -y  (sem confirmação, útil em CI/scripts)
'use strict';

const fs   = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT         = path.join(__dirname, '..');
const DATA_DIR      = path.join(ROOT, '.devtech');
const PROJECTS_DIR  = path.join(ROOT, 'projects');

const STATE_FILES = [
  path.join(DATA_DIR, 'progress.json'),
  path.join(DATA_DIR, 'sprint.json'),
  path.join(DATA_DIR, 'messages.json'),
];

function findConcluidoMarkers(dir) {
  const found = [];
  if (!fs.existsSync(dir)) return found;
  for (const nivel of fs.readdirSync(dir)) {
    const np = path.join(dir, nivel);
    if (!fs.statSync(np).isDirectory()) continue;
    for (const proj of fs.readdirSync(np)) {
      const marker = path.join(np, proj, '.concluido');
      if (fs.existsSync(marker)) found.push(marker);
    }
  }
  return found;
}

function doReset() {
  let removed = 0;

  for (const f of STATE_FILES) {
    if (fs.existsSync(f)) { fs.unlinkSync(f); removed++; console.log(`  ✓ removido: ${path.relative(ROOT, f)}`); }
  }

  const markers = findConcluidoMarkers(PROJECTS_DIR);
  for (const m of markers) { fs.unlinkSync(m); removed++; console.log(`  ✓ removido: ${path.relative(ROOT, m)}`); }

  if (removed === 0) {
    console.log('\n  Nada para resetar — o sistema já está zerado.\n');
  } else {
    console.log(`\n  Sistema resetado (${removed} arquivo(s) removidos). Nome, XP, sprint, mensagens e projetos entregues voltaram ao estado inicial.\n`);
  }
}

const skipConfirm = process.argv.includes('-y') || process.argv.includes('--yes');

if (skipConfirm || !process.stdin.isTTY) {
  doReset();
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('  Isso vai apagar nome, XP, sprint, mensagens e o progresso dos projetos entregues. Confirmar? (s/N) ', (answer) => {
    rl.close();
    if (/^s(im)?$/i.test(answer.trim())) {
      doReset();
    } else {
      console.log('\n  Cancelado. Nada foi alterado.\n');
    }
  });
}
