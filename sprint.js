// sprint.js — DEVTECH SISTEMAS S.A. — Painel de Sprint
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

const DATA_DIR      = path.join(__dirname, '.devtech');
const SPRINT_FILE   = path.join(DATA_DIR, 'sprint.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── NPCs ──────────────────────────────────────────────────────────────────────

const NPC = {
  lead: { nome: 'Tech Lead Rafael', tag: '[LEAD]' },
  qa:   { nome: 'QA Ana',           tag: '[QA]  ' },
  pm:   { nome: 'PM Marcos',        tag: '[PM]  ' },
  dev:  { nome: 'Dev Priya',        tag: '[DEV] ' },
};

const RESPOSTAS = {
  done:   [
    (id) => [NPC.lead, `Tarefa #${id} aprovada no code review. Bom trabalho!`],
    (id) => [NPC.qa,   `Testei a #${id}. Passou em todos os cenarios.`],
    (id) => [NPC.lead, `PR da #${id} mergeado na main. Pode fechar o ticket.`],
    (id) => [NPC.dev,  `Arrasou na #${id}! Eu tava quebrando a cabeca com isso.`],
  ],
  start:  [
    (id) => [NPC.lead, `Tarefa #${id} em andamento. Me avisa se travar.`],
    (id) => [NPC.dev,  `Boa sorte na #${id}! Posso ajudar se precisar.`],
    (id) => [NPC.qa,   `Vou preparar os casos de teste pra #${id}.`],
  ],
  add:    [
    ()   => [NPC.pm,   `Task adicionada. Classificando como prioridade media.`],
    ()   => [NPC.lead, `Boa task. Lembra de seguir o padrao de nomenclatura.`],
  ],
  sprint: [
    ()   => [NPC.lead, `Dev, voce pegou outro trabalho. Da uma olhada no backlog.`],
    ()   => [NPC.pm,   `Nova sprint! Foco nas entregas, galera.`],
    ()   => [NPC.dev,  `Nova sprint! Bora codar. Conta comigo se precisar.`],
  ],
  pausar: [
    ()   => [NPC.dev,  `Pausando aqui tambem. Ate mais!`],
    ()   => [NPC.lead, `Ok, salva o que tiver aberto antes de sair.`],
    ()   => [NPC.pm,   `Tudo bem, sprint salva. Ate logo!`],
  ],
  retomar: [
    ()   => [NPC.dev,  `Bem-vindo de volta! Bora codar.`],
    ()   => [NPC.lead, `De volta ao trabalho! Bora terminar essa sprint.`],
    ()   => [NPC.qa,   `Otimo! Estava esperando pra testar quando ficasse pronto.`],
  ],
};

const AMBIENTE = [
  [NPC.qa,   'Regressao passando. Podem subir para staging.'],
  [NPC.dev,  'Alguem sabe onde ficam as configs do banco de dev?'],
  [NPC.pm,   'Reuniao de planning amanha as 10h. Confiram presenca.'],
  [NPC.lead, 'Lembrem de commitar com mensagens descritivas.'],
  [NPC.qa,   'Build do CI/CD quebrou. Quem commitou por ultimo?'],
  [NPC.dev,  'Alguem revisou o PR #47? Ta esperando ha 2 dias.'],
  [NPC.pm,   'Cliente pediu demo na quinta. Precisamos de algo funcional.'],
  [NPC.lead, 'Pode fazer code review no PR do modulo de auth?'],
  [NPC.qa,   'Edge case no modulo de relatorios. Vou abrir ticket.'],
  [NPC.dev,  'Subindo ambiente local. Se der erro de CORS, me chama.'],
  [NPC.pm,   'Stakeholder quer o relatorio de progresso ate amanha.'],
  [NPC.lead, 'Se travar em algo, nao perde tempo: pede ajuda logo.'],
];

// ── Tempo ─────────────────────────────────────────────────────────────────────

function horaAtual() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function formatarTempo(ms) {
  if (ms <= 0) return '0m';
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, '0')}m` : `${m}m`;
}

// Tempo total ativo = acumulado de sessões anteriores + sessão atual (se ativa)
function tempoAtivoTotal(state) {
  let total = state.tempoAtivoMs || 0;
  if (state.sessaoIniciadaEm) {
    total += Date.now() - new Date(state.sessaoIniciadaEm).getTime();
  }
  return total;
}

function minutosNaTarefa(task) {
  if (!task.startedAt) return 0;
  return Math.floor((Date.now() - new Date(task.startedAt).getTime()) / 60000);
}

// ── Persistência ──────────────────────────────────────────────────────────────

function loadSprint() {
  if (!fs.existsSync(SPRINT_FILE)) {
    const init = {
      sprint: 'Sprint 1', nextId: 1, tasks: [],
      tempoAtivoMs: 0, sessaoIniciadaEm: null, pausadoEm: null,
      estimativaHoras: 2, projetoAtual: null,
    };
    fs.writeFileSync(SPRINT_FILE, JSON.stringify(init, null, 2));
    return init;
  }
  const data = JSON.parse(fs.readFileSync(SPRINT_FILE, 'utf8'));
  // Migração: formato antigo usava iniciadoEm
  if (data.iniciadoEm && !('tempoAtivoMs' in data)) {
    data.tempoAtivoMs     = 0;
    data.sessaoIniciadaEm = data.iniciadoEm;
    data.pausadoEm        = null;
    delete data.iniciadoEm;
  }
  // Garantir campos novos
  if (!('tempoAtivoMs'     in data)) data.tempoAtivoMs     = 0;
  if (!('sessaoIniciadaEm' in data)) data.sessaoIniciadaEm = null;
  if (!('pausadoEm'        in data)) data.pausadoEm        = null;
  if (!('projetoAtual'     in data)) data.projetoAtual     = null;
  return data;
}

function saveSprint(state) {
  fs.writeFileSync(SPRINT_FILE, JSON.stringify(state, null, 2));
}

// Ao abrir o app: se havia sessão ativa, auto-pausa e salva o tempo
function autoSalvarSessaoAberta(state) {
  if (!state.sessaoIniciadaEm) return false;
  const elapsed          = Date.now() - new Date(state.sessaoIniciadaEm).getTime();
  state.tempoAtivoMs     = (state.tempoAtivoMs || 0) + elapsed;
  state.sessaoIniciadaEm = null;
  state.pausadoEm        = new Date().toISOString();
  saveSprint(state);
  return true;
}

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) {
    const init = { name: 'Dev', xp: 0 };
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(init, null, 2));
    return init;
  }
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

function loadMessages() {
  if (!fs.existsSync(MESSAGES_FILE)) return [];
  return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
}

function pushMessage(npc, texto) {
  const msgs = loadMessages();
  msgs.push({ tag: npc.tag, nome: npc.nome, texto });
  if (msgs.length > 20) msgs.splice(0, msgs.length - 20);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2));
}

// ── Renderização ──────────────────────────────────────────────────────────────

const LINE = '═'.repeat(74);
const DIV  = '─'.repeat(74);
const COL  = 22;

function trunc(str, max) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str.padEnd(max);
}

function cellBacklog(task) {
  if (!task) return ' '.repeat(COL);
  return trunc(`[${task.id}] ${task.title}`, COL);
}

function cellDoing(task, pausado) {
  if (!task) return ' '.repeat(COL);
  const suffix = pausado ? ' (pausado)' : ` (${minutosNaTarefa(task)}m)`;
  return trunc(`[${task.id}] ${task.title}${suffix}`, COL);
}

function cellDone(task) {
  if (!task) return ' '.repeat(COL);
  return trunc(`[${task.id}] ${task.title}`, COL);
}

function linhaTimer(state) {
  const hora    = horaAtual();
  const ativo   = tempoAtivoTotal(state);
  const estMs   = state.estimativaHoras * 3600000;
  const pausado = !state.sessaoIniciadaEm;

  // Nunca iniciado
  if (!state.sessaoIniciadaEm && !state.pausadoEm && ativo === 0) {
    return `  Hora: ${hora}  |  use "retomar" ou "inicio" para iniciar o timer`;
  }

  // Pausado
  if (pausado) {
    return `  Hora: ${hora}  |  PAUSADO — tempo salvo: ${formatarTempo(ativo)} / ${state.estimativaHoras}h  (use "retomar")`;
  }

  // Ativo — estourou?
  if (ativo > estMs) {
    return `  Hora: ${hora}  |  SPRINT ESTOURADA: ${formatarTempo(ativo)} / ${state.estimativaHoras}h  (+${formatarTempo(ativo - estMs)})`;
  }

  return `  Hora: ${hora}  |  Tempo: ${formatarTempo(ativo)} / ${state.estimativaHoras}h  (faltam ${formatarTempo(estMs - ativo)})`;
}

function renderBoard(state, feedback) {
  const p       = loadProgress();
  const pausado = !state.sessaoIniciadaEm;
  const backlog = state.tasks.filter(t => t.status === 'backlog');
  const doing   = state.tasks.filter(t => t.status === 'doing');
  const done    = state.tasks.filter(t => t.status === 'done');
  const rows    = Math.max(backlog.length, doing.length, done.length, 1);
  const sep     = '  ' + '─'.repeat(COL) + '─┼─' + '─'.repeat(COL) + '─┼─' + '─'.repeat(COL);
  const msgs    = loadMessages().slice(-3);
  const [aNpc, aTexto] = AMBIENTE[Math.floor(Math.random() * AMBIENTE.length)];

  console.clear();
  console.log('');
  console.log(LINE);
  console.log(`  DEVTECH SISTEMAS S.A.                         Dev: ${p.name}  XP: ${p.xp}`);
  console.log(`  Sprint: ${state.sprint}${pausado ? '  [PAUSADO]' : ''}`);
  if (state.projetoAtual) console.log(`  Projeto: projects/${state.projetoAtual}`);
  console.log(linhaTimer(state));
  console.log(LINE);
  console.log(`  ${'BACKLOG'.padEnd(COL)} │ ${'EM ANDAMENTO'.padEnd(COL)} │ CONCLUIDO`);
  console.log(sep);

  for (let i = 0; i < rows; i++) {
    console.log(`  ${cellBacklog(backlog[i])} │ ${cellDoing(doing[i], pausado)} │ ${cellDone(done[i])}`);
  }

  console.log(LINE);
  console.log('  MENSAGENS DA EQUIPE');
  console.log(DIV);

  if (msgs.length === 0) {
    console.log(`  ${aNpc.tag} ${aNpc.nome}: ${aTexto}`.slice(0, 73));
  } else {
    msgs.forEach(m => console.log(`  ${m.tag} ${m.nome}: ${m.texto}`.slice(0, 73)));
    console.log(`  ${aNpc.tag} ${aNpc.nome}: ${aTexto}`.slice(0, 73));
  }

  console.log(LINE);
  if (feedback) {
    console.log(`  ${feedback}`);
    console.log(LINE);
  }
  console.log('  add <titulo>  |  start <id>  |  done <id>  |  rm <id>  |  sprint <nome>');
  console.log('  pausar  |  retomar  |  projeto <pasta>  |  concluir  |  estimativa <h>');
  console.log('');
}

// ── Comandos ──────────────────────────────────────────────────────────────────

function pick(arr, ...args) {
  const fn = arr[Math.floor(Math.random() * arr.length)];
  return fn(...args);
}

function handleCommand(input, state) {
  const parts = input.trim().split(/\s+/);
  const cmd   = parts[0]?.toLowerCase();
  const rest  = parts.slice(1).join(' ');

  switch (cmd) {
    case 'add': {
      if (!rest) return '  Use: add <titulo da tarefa>';
      state.tasks.push({ id: state.nextId++, title: rest, status: 'backlog' });
      saveSprint(state);
      const [npc, txt] = pick(RESPOSTAS.add);
      pushMessage(npc, txt);
      return `+ Tarefa #${state.nextId - 1} adicionada ao Backlog.`;
    }

    case 'start': {
      const id   = parseInt(rest);
      const task = state.tasks.find(t => t.id === id);
      if (!task) return `  Tarefa #${id} nao encontrada.`;
      if (task.status === 'done') return `  Tarefa #${id} ja foi concluida.`;
      task.status    = 'doing';
      task.startedAt = new Date().toISOString();
      // Auto-retomar se pausado
      if (!state.sessaoIniciadaEm) {
        state.sessaoIniciadaEm = new Date().toISOString();
        state.pausadoEm        = null;
      }
      saveSprint(state);
      const [npc, txt] = pick(RESPOSTAS.start, id);
      pushMessage(npc, txt);
      return `> Tarefa #${id} em andamento.`;
    }

    case 'done': {
      const id   = parseInt(rest);
      const task = state.tasks.find(t => t.id === id);
      if (!task) return `  Tarefa #${id} nao encontrada.`;
      const min  = minutosNaTarefa(task);
      const info = min > 0 ? ` (${min}m na tarefa)` : '';
      task.status      = 'done';
      task.completedAt = new Date().toISOString();
      saveSprint(state);
      const p = loadProgress();
      p.xp += 25;
      saveProgress(p);
      const [npc, txt] = pick(RESPOSTAS.done, id);
      pushMessage(npc, txt);
      return `* Tarefa #${id} concluida!${info}  +25 XP  (total: ${p.xp} XP)`;
    }

    case 'rm': {
      const id  = parseInt(rest);
      const idx = state.tasks.findIndex(t => t.id === id);
      if (idx === -1) return `  Tarefa #${id} nao encontrada.`;
      state.tasks.splice(idx, 1);
      saveSprint(state);
      return `x Tarefa #${id} removida.`;
    }

    case 'sprint': {
      if (!rest) return '  Use: sprint <nome do sprint>';
      state.sprint           = rest;
      state.tempoAtivoMs     = 0;
      state.sessaoIniciadaEm = new Date().toISOString();
      state.pausadoEm        = null;
      saveSprint(state);
      const [npc, txt] = pick(RESPOSTAS.sprint);
      pushMessage(npc, txt);
      return `> Sprint "${rest}" iniciada! Timer zerado.`;
    }

    case 'pausar': {
      if (!state.sessaoIniciadaEm) return '  Sprint ja esta pausada.';
      const elapsed          = Date.now() - new Date(state.sessaoIniciadaEm).getTime();
      state.tempoAtivoMs     = (state.tempoAtivoMs || 0) + elapsed;
      state.sessaoIniciadaEm = null;
      state.pausadoEm        = new Date().toISOString();
      saveSprint(state);
      const [npc, txt] = pick(RESPOSTAS.pausar);
      pushMessage(npc, txt);
      return `|| Sprint pausada. Tempo salvo: ${formatarTempo(state.tempoAtivoMs)}`;
    }

    case 'retomar': {
      if (state.sessaoIniciadaEm) return '  Sprint ja esta em andamento.';
      state.sessaoIniciadaEm = new Date().toISOString();
      state.pausadoEm        = null;
      saveSprint(state);
      const [npc, txt] = pick(RESPOSTAS.retomar);
      pushMessage(npc, txt);
      return `> Sprint retomada as ${horaAtual()}.`;
    }

    case 'inicio': {
      if (state.sessaoIniciadaEm) {
        const elapsed      = Date.now() - new Date(state.sessaoIniciadaEm).getTime();
        state.tempoAtivoMs = (state.tempoAtivoMs || 0) + elapsed;
      }
      state.sessaoIniciadaEm = new Date().toISOString();
      state.pausadoEm        = null;
      saveSprint(state);
      return `> Timer iniciado as ${horaAtual()}.`;
    }

    case 'estimativa': {
      const h = parseFloat(rest);
      if (isNaN(h) || h <= 0) return '  Use: estimativa <horas>  (ex: estimativa 1.5)';
      state.estimativaHoras = h;
      saveSprint(state);
      return `> Estimativa definida: ${h}h`;
    }

    case 'projeto': {
      if (!rest) return '  Use: projeto <pasta>  (ex: projeto estagiario/01-calculadora-financeira)';
      const projetoPath = path.join(__dirname, 'projects', rest);
      if (!fs.existsSync(projetoPath)) return `  Pasta nao encontrada: projects/${rest}`;
      state.projetoAtual = rest;
      saveSprint(state);
      return `> Projeto ativo: projects/${rest}`;
    }

    case 'concluir': {
      if (!state.projetoAtual) return '  Nenhum projeto ativo. Use: projeto <pasta>';
      const marker = path.join(__dirname, 'projects', state.projetoAtual, '.concluido');
      if (fs.existsSync(marker)) return '  Projeto ja foi concluido anteriormente.';
      fs.writeFileSync(marker, new Date().toISOString());
      pushMessage(NPC.lead, `Projeto concluido! Excelente trabalho, ${loadProgress().name}.`);
      pushMessage(NPC.pm,   `Entrega registrada. Proximo projeto disponivel no painel.`);
      pushMessage(NPC.qa,   `Todos os testes passaram. Aprovado!`);
      return `ENTREGUE! Use "node projetos.js" para ver seu progresso.`;
    }

    case '':
    case undefined:
      return null;

    default:
      return `  Comando desconhecido: "${cmd}"`;
  }
}

// ── Inicialização ─────────────────────────────────────────────────────────────

const state = loadSprint();

// Se havia sessão aberta (terminal fechado sem pausar), auto-pausa e avisa
const foiAutoPausado = autoSalvarSessaoAberta(state);
let lastFeedback = foiAutoPausado
  ? `|| Sessao anterior detectada e pausada. Tempo salvo: ${formatarTempo(state.tempoAtivoMs)}. Use "retomar" para continuar.`
  : null;

renderBoard(state, lastFeedback);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Ao sair pelo Ctrl+C: pausa automaticamente antes de fechar
rl.on('SIGINT', () => {
  if (state.sessaoIniciadaEm) {
    const elapsed      = Date.now() - new Date(state.sessaoIniciadaEm).getTime();
    state.tempoAtivoMs = (state.tempoAtivoMs || 0) + elapsed;
    state.sessaoIniciadaEm = null;
    state.pausadoEm    = new Date().toISOString();
    saveSprint(state);
    console.log(`\n\n  Sprint pausada. Tempo salvo: ${formatarTempo(state.tempoAtivoMs)}\n`);
  } else {
    console.log('\n\n  Saindo...\n');
  }
  process.exit(0);
});

function prompt() {
  rl.question('  > ', (input) => {
    lastFeedback = handleCommand(input, state);
    renderBoard(state, lastFeedback);
    prompt();
  });
}

prompt();
