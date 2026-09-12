// dev.js — DEVTECH SISTEMAS S.A. — Ficha do Desenvolvedor
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

const DATA_DIR      = path.join(__dirname, '.devtech');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── Níveis ────────────────────────────────────────────────────────────────────

const LEVELS = [
  { name: 'Estagiário',  xpMin: 0,    xpMax: 149,  salary: 'R$ 800 – R$ 1.500'     },
  { name: 'Trainee',     xpMin: 150,  xpMax: 349,  salary: 'R$ 2.000 – R$ 3.500'   },
  { name: 'Junior I',    xpMin: 350,  xpMax: 599,  salary: 'R$ 3.000 – R$ 4.500'   },
  { name: 'Junior II',   xpMin: 600,  xpMax: 899,  salary: 'R$ 4.000 – R$ 5.500'   },
  { name: 'Junior III',  xpMin: 900,  xpMax: 1249, salary: 'R$ 5.000 – R$ 7.000'   },
  { name: 'Pleno I',     xpMin: 1250, xpMax: 1649, salary: 'R$ 6.500 – R$ 9.000'   },
  { name: 'Pleno II',    xpMin: 1650, xpMax: 2099, salary: 'R$ 8.500 – R$ 11.000'  },
  { name: 'Pleno III',   xpMin: 2100, xpMax: 2599, salary: 'R$ 10.000 – R$ 14.000' },
  { name: 'Sênior I',    xpMin: 2600, xpMax: 3149, salary: 'R$ 13.000 – R$ 17.000' },
  { name: 'Sênior II',   xpMin: 3150, xpMax: 3749, salary: 'R$ 16.000 – R$ 22.000' },
  { name: 'Sênior III',  xpMin: 3750, xpMax: null, salary: 'R$ 20.000 – R$ 30.000+'},
];

function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpMin) return { level: LEVELS[i], index: i };
  }
  return { level: LEVELS[0], index: 0 };
}

function progressBar(xp, level, width = 24) {
  if (level.xpMax === null) return `[${'█'.repeat(width)}] NÍVEL MÁXIMO`;
  const range   = level.xpMax - level.xpMin;
  const current = xp - level.xpMin;
  const filled  = Math.round((current / range) * width);
  return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}] ${xp}/${level.xpMax + 1} XP`;
}

// ── Persistência ──────────────────────────────────────────────────────────────

function load() {
  if (!fs.existsSync(PROGRESS_FILE)) return { name: 'Dev', xp: 0 };
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
}

function contarProjetos() {
  const projectsDir = path.join(__dirname, 'projects');
  if (!fs.existsSync(projectsDir)) return { concluidos: 0, total: 0 };
  let concluidos = 0, total = 0;
  for (const nivel of fs.readdirSync(projectsDir)) {
    const nivelPath = path.join(projectsDir, nivel);
    if (!fs.statSync(nivelPath).isDirectory()) continue;
    for (const proj of fs.readdirSync(nivelPath)) {
      const projPath = path.join(nivelPath, proj);
      if (!fs.statSync(projPath).isDirectory()) continue;
      total++;
      if (fs.existsSync(path.join(projPath, '.concluido'))) concluidos++;
    }
  }
  return { concluidos, total };
}

function save(p) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

function loadMessages() {
  if (!fs.existsSync(MESSAGES_FILE)) return [];
  return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
}

// ── Renderização ──────────────────────────────────────────────────────────────

const W     = 46;
const INNER = W - 6;
const H     = '═'.repeat(W - 2);
const DIV   = '─'.repeat(W - 2);

function row(label, value) {
  const content = `${label}: ${value}`;
  return `║  ${content.slice(0, INNER).padEnd(INNER)}  ║`;
}

function center(str) {
  const lpad = Math.floor((INNER - str.length) / 2);
  const rpad = INNER - str.length - lpad;
  return `║  ${' '.repeat(Math.max(0, lpad))}${str}${' '.repeat(Math.max(0, rpad))}  ║`;
}

function renderFicha(message) {
  const p = load();
  const { level, index } = getLevel(p.xp);
  const bar  = progressBar(p.xp, level);
  const next = level.xpMax !== null ? LEVELS[index + 1] : null;
  const msgs = loadMessages().slice(-4);

  console.clear();
  console.log('');
  console.log(`╔${H}╗`);
  console.log(center('DEVTECH SISTEMAS S.A.'));
  console.log(center('── Ficha do Desenvolvedor ──'));
  console.log(`╠${H}╣`);
  const { concluidos, total } = contarProjetos();
  console.log(row('Desenvolvedor', p.name));
  console.log(row('Nível        ', level.name));
  console.log(row('XP           ', p.xp));
  console.log(row('Salário      ', level.salary));
  console.log(row('Projetos     ', `${concluidos}/${total} concluidos`));
  console.log(`╠${H}╣`);
  console.log(`║  ${bar.padEnd(INNER)}  ║`);

  if (next) {
    const info = `→ ${next.name} em ${level.xpMax + 1 - p.xp} XP`;
    console.log(`║  ${info.slice(0, INNER).padEnd(INNER)}  ║`);
  }

  console.log(`╠${H}╣`);
  console.log(center('MENSAGENS DA EQUIPE'));
  console.log(`╠${H}╣`);

  if (msgs.length === 0) {
    console.log(`║  ${'(nenhuma mensagem ainda)'.padEnd(INNER)}  ║`);
  } else {
    msgs.forEach(m => {
      const linha = `${m.tag} ${m.texto}`;
      console.log(`║  ${linha.slice(0, INNER).padEnd(INNER)}  ║`);
    });
    // pad restante
    for (let i = msgs.length; i < 4; i++) {
      console.log(`║  ${' '.repeat(INNER)}  ║`);
    }
  }

  console.log(`╚${H}╝`);
  console.log('');

  if (message) {
    console.log(`  ${message}`);
    console.log('');
  }

  console.log('  name <seu nome>  │  [Enter para atualizar]  │  [Ctrl+C para sair]');
  console.log('');
}

// ── Comandos ──────────────────────────────────────────────────────────────────

function handleCommand(input) {
  const parts = input.trim().split(/\s+/);
  const cmd   = parts[0]?.toLowerCase();
  const rest  = parts.slice(1).join(' ');

  if (cmd === 'name') {
    if (!rest) return '⚠  Use: name <seu nome>';
    const p = load();
    p.name  = rest;
    save(p);
    return `✅ Nome atualizado para: ${rest}`;
  }

  if (cmd === '' || cmd === undefined) return null;

  return `⚠  Comando desconhecido: "${cmd}"`;
}

// ── Loop principal ────────────────────────────────────────────────────────────

renderFicha(null);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.on('SIGINT', () => {
  console.log('\n\n  Saindo do sistema...\n');
  process.exit(0);
});

function prompt() {
  rl.question('  > ', (input) => {
    const message = handleCommand(input);
    renderFicha(message);
    prompt();
  });
}

prompt();
