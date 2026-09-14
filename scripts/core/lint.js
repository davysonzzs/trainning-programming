'use strict';

const fs = require('fs');
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

// Roda o Jest de verdade (o mesmo "npm test" que o aluno roda na mao) e,
// se falhar, extrai um motivo legivel — nome do teste + a linha de erro,
// nao so "falhou". E assim que o QA da review ("revisar") sabe dizer POR
// QUE voltou, em vez de um motivo generico e aleatorio.
function rodarTestes(projetoRel) {
  const projPath = path.join(PROJECTS_DIR, projetoRel);
  if (!fs.existsSync(path.join(projPath, 'node_modules')))
    return { rodou: false, precisaInstalar: true };

  const res = spawnSync('npx', ['jest', '--json', '--silent'], { cwd: projPath, encoding: 'utf8' });

  let json;
  try { json = JSON.parse(res.stdout); }
  catch {
    // saida nao veio em JSON (erro de infra do Jest, projeto sem teste
    // ainda etc.) — cai pro status code puro, sem motivo detalhado.
    return { rodou: true, passou: res.status === 0, motivo: null };
  }

  if (json.success) return { rodou: true, passou: true, motivo: null };

  for (const suite of json.testResults || []) {
    const falha = (suite.testResults || []).find(t => t.status === 'failed');
    if (falha) {
      const msg = (falha.failureMessages && falha.failureMessages[0]) || '';
      const linha = msg.split('\n').find(l => l.trim() && !l.trim().startsWith('at ')) || msg;
      return { rodou: true, passou: false, motivo: `"${falha.fullName}" falhou: ${linha.trim().slice(0, 160)}` };
    }
    // falha no nivel da suite (arquivo com erro de sintaxe, import quebrado,
    // funcao ainda nao exportada etc.) — sem teste individual pra apontar.
    // A 1ª linha e so o cabecalho padrao do Jest ("● Test suite failed to
    // run") — a causa de verdade (ex.: "Cannot find module...") vem depois.
    if (suite.status === 'failed' && suite.message) {
      const linha = suite.message.split('\n')
        .map(l => l.trim())
        .find(l => l && l !== '● Test suite failed to run' && !l.startsWith('at ') && !/^[>|]|^\d+\s*\|/.test(l));
      return { rodou: true, passou: false, motivo: (linha || suite.message.trim()).slice(0, 200) };
    }
  }
  return { rodou: true, passou: false, motivo: 'Os testes nao passaram.' };
}

module.exports = { rodarLint, rodarTestes };
