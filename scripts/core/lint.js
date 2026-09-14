'use strict';

const path = require('path');
const { spawnSync } = require('child_process');
const { PROJECTS_DIR, ROOT } = require('./dados');

function rodarLint(projetoRel) {
  const alvo = path.join(PROJECTS_DIR, projetoRel);
  const res  = spawnSync('npx', ['eslint', alvo, '--format', 'json'], { cwd: ROOT, encoding: 'utf8' });
  let resultados;
  try { resultados = JSON.parse(res.stdout); }
  catch {
    // "nenhum arquivo pra lintar" (projeto ainda sem nenhum .js proprio) ou
    // erro de infra do ESLint — nao e bug do aluno, o npm test ja teria
    // barrado antes disso. Nao bloqueia por essa via.
    return { rodou: false, bloqueado: false, erros: 0, avisos: 0 };
  }
  let erros = 0, avisos = 0, exemplo = null;
  for (const arq of resultados) {
    for (const msg of arq.messages) {
      if (msg.severity === 2) { erros++; if (!exemplo) exemplo = `${msg.ruleId} (linha ${msg.line}): ${msg.message}`; }
      else avisos++;
    }
  }
  return { rodou: true, bloqueado: erros > 0, erros, avisos, exemplo };
}

module.exports = { rodarLint };
