// projetos.js — DEVTECH SISTEMAS S.A. — Painel de Missoes
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

const PROJECTS_DIR  = path.join(__dirname, 'projects');
const DEVTECH_DIR   = path.join(__dirname, '.devtech');
const SPRINT_FILE   = path.join(DEVTECH_DIR, 'sprint.json');
const PROGRESS_FILE = path.join(DEVTECH_DIR, 'progress.json');

// ── Leitura de dados ──────────────────────────────────────────────────────────

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return { name: 'Dev', xp: 0 };
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
}

function loadSprint() {
  if (!fs.existsSync(SPRINT_FILE)) return { projetoAtual: null };
  return JSON.parse(fs.readFileSync(SPRINT_FILE, 'utf8'));
}

function nomeAmigavel(pasta) {
  return pasta
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function lerEstimativa(projetoPath) {
  const readme = path.join(projetoPath, 'README.md');
  if (!fs.existsSync(readme)) return '?';
  const match = fs.readFileSync(readme, 'utf8').match(/\*\*Estimativa:\*\*\s*(.+)/);
  return match ? match[1].trim() : '?';
}

function lerNivel(projetoPath) {
  const readme = path.join(projetoPath, 'README.md');
  if (!fs.existsSync(readme)) return null;
  const match = fs.readFileSync(readme, 'utf8').match(/\*\*Nível:\*\*\s*(.+)/);
  return match ? match[1].trim() : null;
}

function statusProjeto(projetoPath, projetoRel) {
  if (fs.existsSync(path.join(projetoPath, '.concluido'))) return 'CONCLUIDO';
  const sprint = loadSprint();
  if (sprint.projetoAtual === projetoRel) return 'EM ANDAMENTO';
  return 'PENDENTE';
}

function listarNiveis() {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR)
    .filter(d => fs.statSync(path.join(PROJECTS_DIR, d)).isDirectory())
    .sort();
}

function listarProjetos(nivel) {
  const nivelPath = path.join(PROJECTS_DIR, nivel);
  return fs.readdirSync(nivelPath)
    .filter(d => fs.statSync(path.join(nivelPath, d)).isDirectory())
    .sort()
    .map(pasta => {
      const projetoPath = path.join(nivelPath, pasta);
      const projetoRel  = `${nivel}/${pasta}`;
      return {
        pasta,
        nome:       nomeAmigavel(pasta),
        estimativa: lerEstimativa(projetoPath),
        status:     statusProjeto(projetoPath, projetoRel),
        final:      pasta.startsWith('06'),
      };
    });
}

// ── Renderização ──────────────────────────────────────────────────────────────

const LINE = '═'.repeat(74);
const DIV  = '─'.repeat(74);

function statusTag(status) {
  switch (status) {
    case 'CONCLUIDO':    return '[ ENTREGUE  ]';
    case 'EM ANDAMENTO': return '[  FAZENDO  ]';
    default:             return '[  PENDENTE ]';
  }
}

function barraProgresso(concluidos, total, width = 30) {
  const filled = Math.round((concluidos / Math.max(total, 1)) * width);
  return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}] ${concluidos}/${total}`;
}

function renderPainel() {
  const p      = loadProgress();
  const niveis = listarNiveis();

  console.clear();
  console.log('');
  console.log(LINE);
  console.log(`  DEVTECH SISTEMAS S.A.                       Dev: ${p.name}  XP: ${p.xp}`);
  console.log('  Painel de Projetos');
  console.log(LINE);

  let totalGlobal = 0;
  let concluidosGlobal = 0;

  for (const nivel of niveis) {
    const projetos    = listarProjetos(nivel);
    const concluidos  = projetos.filter(p => p.status === 'CONCLUIDO').length;
    totalGlobal      += projetos.length;
    concluidosGlobal += concluidos;

    const nomeNivel = nivel.charAt(0).toUpperCase() + nivel.slice(1);
    console.log('');
    console.log(`  >> ${nomeNivel.toUpperCase()} — ${concluidos}/${projetos.length} concluidos`);
    console.log(DIV);

    projetos.forEach(proj => {
      const tag    = statusTag(proj.status);
      const final  = proj.final ? ' [PROJETO FINAL]' : '';
      const nome   = `${proj.pasta.slice(0, 2)}. ${proj.nome}${final}`;
      const est    = proj.estimativa.padStart(7);
      const espaco = ' '.repeat(Math.max(1, 42 - nome.length));
      console.log(`  ${nome}${espaco}${tag}  ${est}`);
    });
  }

  console.log('');
  console.log(LINE);
  const barra = barraProgresso(concluidosGlobal, totalGlobal);
  console.log(`  Progresso total: ${barra}`);

  if (concluidosGlobal === totalGlobal && totalGlobal > 0) {
    console.log('');
    console.log('  TODOS OS PROJETOS CONCLUIDOS!');
    console.log('  Solicite sua promocao no chat do Claude.');
  } else {
    const sprint = loadSprint();
    if (sprint.projetoAtual) {
      console.log(`  Projeto ativo: projects/${sprint.projetoAtual}`);
    } else {
      console.log('  Dica: use "projeto <pasta>" no sprint.js para definir o projeto ativo.');
    }
  }

  console.log(LINE);
  console.log('  [Enter para atualizar]  [Ctrl+C para sair]');
  console.log('');
}

// ── Loop principal ────────────────────────────────────────────────────────────

renderPainel();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.on('SIGINT', () => {
  console.log('\n\n  Saindo...\n');
  process.exit(0);
});

function prompt() {
  rl.question('  > ', () => {
    renderPainel();
    prompt();
  });
}

prompt();
