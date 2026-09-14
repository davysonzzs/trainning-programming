'use strict';

const { spawnSync } = require('child_process');
const { ROOT } = require('./dados');

function gitBranchAtual() {
  try {
    const res = spawnSync('git', ['branch', '--show-current'], { cwd: ROOT, encoding: 'utf8' });
    if (res.status !== 0) return null; // nao e repo git, git nao instalado, etc.
    return res.stdout.trim() || null;  // vazio = HEAD destacado
  } catch { return null; }
}

function slugProjeto(pj) {
  return pj.replace(/^\d+-/, ''); // "01-calculadora-financeira" -> "calculadora-financeira"
}

function branchEsperadaProjeto(projetoAtual) {
  if (!projetoAtual) return null;
  const pj = projetoAtual.split('/')[1];
  return `feature/${slugProjeto(pj)}`;
}

module.exports = { gitBranchAtual, slugProjeto, branchEsperadaProjeto };
