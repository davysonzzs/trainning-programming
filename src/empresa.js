// empresa.js — DEVTECH SISTEMAS S.A. — Sistema Corporativo
// Deixe este terminal aberto enquanto trabalha.
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

const DATA_DIR      = path.join(__dirname, '.devtech');
const SPRINT_FILE   = path.join(DATA_DIR, 'sprint.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── ANSI ──────────────────────────────────────────────────────────────────────

const A = {
  clear:    '\x1b[2J\x1b[H',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h',
  bold:     '\x1b[1m',
  dim:      '\x1b[2m',
  reset:    '\x1b[0m',
  green:    '\x1b[32m',
  yellow:   '\x1b[33m',
  red:      '\x1b[31m',
  cyan:     '\x1b[36m',
  white:    '\x1b[37m',
  gray:     '\x1b[90m',
};

// ── NPCs ──────────────────────────────────────────────────────────────────────

const NPC = {
  lead: { nome: 'Rafael (Tech Lead)', tag: '[LEAD]' },
  qa:   { nome: 'Ana (QA)',           tag: '[QA]  ' },
  pm:   { nome: 'Marcos (PM)',        tag: '[PM]  ' },
  dev:  { nome: 'Priya (Dev)',        tag: '[DEV] ' },
  ops:  { nome: 'Sistema DevOps',     tag: '[OPS] ' },
};

const ATIVIDADES = [
  [NPC.qa,   'Regressao passando em staging. Pode subir pra prod quando quiser.'],
  [NPC.dev,  'Alguem sabe onde fica o arquivo de config do banco de dev?'],
  [NPC.pm,   'Reuniao de refinamento amanha as 10h. Me confirma presenca.'],
  [NPC.lead, 'Lembrem: mensagem de commit no imperativo. "Adiciona" nao "Adicionando".'],
  [NPC.qa,   'Build do CI quebrou. Quem foi o ultimo a commitar no main?'],
  [NPC.dev,  'PR #47 esperando review ha 2 dias. Alguem pode dar uma olhada?'],
  [NPC.pm,   'Cliente pediu demo na quinta. Preciso de algo funcional ate quarta.'],
  [NPC.lead, 'Pode fazer code review no modulo de auth? Quero mais um par de olhos.'],
  [NPC.qa,   'Encontrei edge case no relatorio de vendas. Abrindo ticket agora.'],
  [NPC.dev,  'Subindo ambiente local. Se tiver erro de CORS, me fala que eu ajudo.'],
  [NPC.pm,   'Stakeholder quer o relatorio de progresso ate amanha de manha.'],
  [NPC.lead, 'Se travar em algo, nao perde tempo tentando sozinho: pede ajuda.'],
  [NPC.ops,  'Deploy em staging concluido. Build #214 estavel.'],
  [NPC.qa,   'Adicionando casos de teste para o modulo de pagamentos.'],
  [NPC.dev,  'Alguem mais com lentidao no npm install? Demorando 4 min aqui.'],
  [NPC.lead, 'Lembrete: sprint review sexta as 16h. Prepara um resumo do que fez.'],
  [NPC.ops,  'Backup do banco de dev concluido com sucesso.'],
  [NPC.pm,   'Novo requisito chegou. Vou jogar no backlog pra proxima sprint.'],
  [NPC.dev,  'Finalmente entendi closures. So demorou umas 3 horas hahaha.'],
  [NPC.qa,   'Todos os testes de smoke passando. Ambiente saudavel.'],
  [NPC.lead, 'Codigo limpo nao e o que funciona. E o que qualquer dev consegue entender.'],
  [NPC.ops,  'Alerta: disco de logs em 78%. Limpando entradas antigas.'],
  [NPC.dev,  'Quem criou a funcao "processarCoisa"? Preciso entender o que ela faz.'],
  [NPC.pm,   'Burndown olhando bem essa sprint. Bom ritmo, galera.'],
  [NPC.lead, 'Evitando magic numbers no codigo, por favor. Use constantes.'],
  [NPC.qa,   'Cobertura de testes subiu para 74%. Meta e 80% ate fim do mes.'],
  [NPC.ops,  'Certificado SSL renovado automaticamente.'],
  [NPC.dev,  'Dica: .find() retorna o elemento, .findIndex() retorna a posicao.'],
  [NPC.lead, 'PR sem descricao vai ser devolvido. Explica o que fez e por que.'],
  [NPC.pm,   'Aprovacao do cliente no mockup. Podemos comecar a implementar.'],
];

const INCIDENTES = [
  [NPC.ops,  'ALERTA: latencia do servico de pagamento acima do normal (320ms avg).'],
  [NPC.qa,   'ALERTA: Falha intermitente no modulo de relatorios. Investigando.'],
  [NPC.ops,  'ALERTA: Pico de memoria no servidor de staging. Monitorando.'],
  [NPC.lead, 'ALERTA: Dependencia desatualizada com vulnerabilidade critica. Abrindo PR.'],
  [NPC.ops,  'ALERTA: Job de sincronizacao falhou. Reexecutando automaticamente.'],
];

const RESOLUCOES = [
  [NPC.ops,  'RESOLVIDO: Latencia normalizada. Causa: query sem indice. Indice adicionado.'],
  [NPC.qa,   'RESOLVIDO: Falha no relatorio resolvida. Era problema de timezone.'],
  [NPC.ops,  'RESOLVIDO: Memoria estabilizada apos restart do worker.'],
  [NPC.lead, 'RESOLVIDO: PR de atualizacao de dependencia mergeado.'],
  [NPC.ops,  'RESOLVIDO: Job de sincronizacao concluido com sucesso na segunda tentativa.'],
];

// ── Estado ────────────────────────────────────────────────────────────────────

let feed = [];
let frame = 0;
let tickAtividade = 0;
let tickIncidente = 0;
let incidenteAtivo = false;
let incidenteIdx = null;
let xpAnterior = -1;
let sprintAnteriorNome = null;
let tasksDoneAnterior = 0;

// Métricas animadas
let metricas = { api: 62, auth: 44, banco: 38, cache: 71, worker: 55 };
let tickMetrica = 0;

// Sparkline de tráfego
const SPARK_CHARS = ['▁','▂','▃','▄','▅','▆','▇','█'];
let sparkData = Array.from({ length: 18 }, () => Math.floor(Math.random() * 6) + 1);
let reqPs = 847;
let latencia = 23;

// ── Spinner ────────────────────────────────────────────────────────────────────

const SPIN = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
function spin(offset = 0) { return SPIN[(frame + offset) % SPIN.length]; }

// ── Helpers ───────────────────────────────────────────────────────────────────

const W     = 76;
const INNER = W - 4;
const LINE  = '═'.repeat(W - 2);
const DIV   = '─'.repeat(W - 2);

function pad(str, n) {
  const s = String(str);
  return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length);
}

function center(str) {
  const lp = Math.floor((INNER - str.length) / 2);
  const rp  = INNER - str.length - lp;
  return `║  ${' '.repeat(Math.max(0,lp))}${str}${' '.repeat(Math.max(0,rp))}  ║`;
}

function row(str) {
  return `║  ${pad(str, INNER)}  ║`;
}

function barraMetrica(valor, tamanho = 12) {
  const filled = Math.round((Math.min(100, Math.max(0, valor)) / 100) * tamanho);
  const cor = valor > 80 ? A.red : valor > 60 ? A.yellow : A.green;
  return `${cor}${'█'.repeat(filled)}${A.gray}${'░'.repeat(tamanho - filled)}${A.reset}`;
}

function sparkline() {
  return sparkData.map(v => {
    const idx = Math.min(7, Math.max(0, Math.round((v / 10) * 7)));
    const cor = v > 7 ? A.yellow : A.cyan;
    return `${cor}${SPARK_CHARS[idx]}${A.reset}`;
  }).join('');
}

function horaAtual() {
  const n = new Date();
  return [n.getHours(), n.getMinutes(), n.getSeconds()]
    .map(x => x.toString().padStart(2, '0')).join(':');
}

function dataAtual() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });
}

function formatarTempo(ms) {
  if (!ms || ms <= 0) return '0m';
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${(m%60).toString().padStart(2,'0')}m` : `${m}m`;
}

// ── Leitura de dados ──────────────────────────────────────────────────────────

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return { name: 'Dev', xp: 0 };
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); } catch { return { name: 'Dev', xp: 0 }; }
}

function loadSprint() {
  if (!fs.existsSync(SPRINT_FILE)) return null;
  try { return JSON.parse(fs.readFileSync(SPRINT_FILE, 'utf8')); } catch { return null; }
}

function contarProjetos() {
  const dir = path.join(__dirname, 'projects');
  if (!fs.existsSync(dir)) return { concluidos: 0, total: 0 };
  let c = 0, t = 0;
  for (const nivel of fs.readdirSync(dir)) {
    const np = path.join(dir, nivel);
    if (!fs.statSync(np).isDirectory()) continue;
    for (const proj of fs.readdirSync(np)) {
      const pp = path.join(np, proj);
      if (!fs.statSync(pp).isDirectory()) continue;
      t++;
      if (fs.existsSync(path.join(pp, '.concluido'))) c++;
    }
  }
  return { concluidos: c, total: t };
}

// ── Feed ──────────────────────────────────────────────────────────────────────

const MAX_FEED = 8;

function pushFeed(npc, msg, tipo = 'normal') {
  feed.push({ hora: horaAtual(), tag: npc.tag, nome: npc.nome, msg, tipo });
  if (feed.length > MAX_FEED) feed.shift();
}

// ── Renderização ──────────────────────────────────────────────────────────────

function buildFrame() {
  const p      = loadProgress();
  const sprint = loadSprint();
  const projs  = contarProjetos();
  const hora   = `${A.bold}${A.cyan}${horaAtual()}${A.reset}`;
  const data   = dataAtual();

  const sprintNome    = sprint?.sprint || '—';
  const sprintProjeto = sprint?.projetoAtual ? `projects/${sprint.projetoAtual}` : '—';
  const sprintPausado = sprint ? !sprint.sessaoIniciadaEm : true;
  const sprintTempo   = sprint ? (() => {
    let t = sprint.tempoAtivoMs || 0;
    if (sprint.sessaoIniciadaEm) t += Date.now() - new Date(sprint.sessaoIniciadaEm).getTime();
    return t;
  })() : 0;
  const sprintEst     = sprint?.estimativaHoras || 2;
  const tasksDone     = sprint?.tasks?.filter(t => t.status === 'done').length || 0;
  const tasksTot      = sprint?.tasks?.length || 0;
  const statusSprint  = sprintPausado
    ? `${A.yellow}PAUSADA${A.reset}`
    : `${A.green}EM ANDAMENTO${A.reset}`;

  let out = A.clear;

  // Header
  out += `╔${LINE}╗\n`;
  out += center(`${A.bold}DEVTECH SISTEMAS S.A.${A.reset}`);
  out += '\n';
  out += center(`${A.gray}── Sistema Corporativo ──${A.reset}`);
  out += '\n';
  out += `╠${LINE}╣\n`;
  out += row(`${A.gray}${data}${A.reset}    ${hora}`);
  out += '\n';
  out += row(`Dev: ${A.bold}${p.name}${A.reset}   │   XP: ${A.cyan}${p.xp}${A.reset}   │   Projetos: ${A.green}${projs.concluidos}/${projs.total}${A.reset} entregues`);
  out += '\n';

  // Sistemas
  out += `╠${LINE}╣\n`;
  out += row(`${A.bold}STATUS DOS SISTEMAS${A.reset}`);
  out += '\n';
  out += `╠${LINE}╣\n`;

  const s = (o) => `${A.cyan}${spin(o)}${A.reset}`;
  const pct = (v) => `${String(v).padStart(3)}%`;

  out += row(`${s(0)} API Gateway  ${barraMetrica(metricas.api)}  ${pct(metricas.api)}   ${s(3)} Auth Service  ${barraMetrica(metricas.auth)}  ${pct(metricas.auth)}`);
  out += '\n';
  out += row(`${s(1)} Banco Dados  ${barraMetrica(metricas.banco)}  ${pct(metricas.banco)}   ${s(4)} Cache Redis   ${barraMetrica(metricas.cache)}  ${pct(metricas.cache)}`);
  out += '\n';
  out += row(`${s(2)} Worker Pool  ${barraMetrica(metricas.worker)}  ${pct(metricas.worker)}   ${s(5)} Staging Env  ${A.green}██████████${A.reset}   OK`);
  out += '\n';

  // Sparkline
  out += `╠${LINE}╣\n`;
  out += row(`${A.gray}Tráfego:${A.reset}  ${sparkline()}  ${A.cyan}${reqPs} req/s${A.reset}   ${A.gray}Latência: ${latencia}ms${A.reset}`);
  out += '\n';

  // Sprint
  out += `╠${LINE}╣\n`;
  out += row(`${A.bold}SPRINT ATIVA${A.reset}`);
  out += '\n';
  out += `╠${LINE}╣\n`;

  if (sprint) {
    out += row(`${A.bold}${sprintNome}${A.reset}  [${statusSprint}]`);
    out += '\n';
    out += row(`${A.gray}Projeto:${A.reset} ${sprintProjeto}`);
    out += '\n';
    out += row(`${A.gray}Tempo:${A.reset} ${formatarTempo(sprintTempo)} / ${sprintEst}h   ${A.gray}Tarefas:${A.reset} ${A.green}${tasksDone}${A.reset}/${tasksTot} concluidas`);
    out += '\n';
  } else {
    out += row(`${A.gray}Nenhuma sprint ativa. Execute node sprint.js para iniciar.${A.reset}`);
    out += '\n';
    out += row('');
    out += '\n';
    out += row('');
    out += '\n';
  }

  // Feed
  out += `╠${LINE}╣\n`;
  out += row(`${A.bold}ATIVIDADES DA EQUIPE${A.reset}`);
  out += '\n';
  out += `╠${LINE}╣\n`;

  const feedExibir = feed.length > 0 ? feed : [{
    hora: horaAtual(), tag: NPC.ops.tag, nome: NPC.ops.nome,
    msg: 'Todos os sistemas operacionais. Aguardando atividades.', tipo: 'ok',
  }];

  for (const item of feedExibir.slice(-MAX_FEED)) {
    let cor = A.reset;
    let prefixo = ' ';
    if (item.tipo === 'alerta') { cor = A.yellow; prefixo = '⚠'; }
    else if (item.tipo === 'ok') { cor = A.green;  prefixo = '✓'; }

    const linha = `${prefixo} ${A.gray}${item.hora}${A.reset}  ${cor}${item.tag}${A.reset}  ${item.msg}`;
    out += row(linha);
    out += '\n';
  }

  // Padding
  for (let i = feedExibir.slice(-MAX_FEED).length; i < MAX_FEED; i++) {
    out += row('');
    out += '\n';
  }

  out += `╚${LINE}╝\n`;
  out += `\n  ${A.gray}Deixe este terminal aberto enquanto trabalha.   [Ctrl+C para sair]${A.reset}\n`;

  return out;
}

// ── Atualização de estado ──────────────────────────────────────────────────────

function atualizarMetricas() {
  for (const k of Object.keys(metricas)) {
    const delta = Math.floor((Math.random() - 0.5) * 6);
    metricas[k] = Math.max(5, Math.min(95, metricas[k] + delta));
  }
}

function atualizarSparkline() {
  // Smooth random walk
  const last = sparkData[sparkData.length - 1];
  const next = Math.max(1, Math.min(10, last + Math.floor((Math.random() - 0.5) * 3)));
  sparkData.shift();
  sparkData.push(next);
  reqPs   = Math.max(200, Math.min(2000, reqPs + Math.floor((Math.random() - 0.5) * 80)));
  latencia = Math.max(5, Math.min(150, latencia + Math.floor((Math.random() - 0.5) * 6)));
}

function verificarMudancas() {
  const p      = loadProgress();
  const sprint = loadSprint();

  if (xpAnterior >= 0 && p.xp > xpAnterior) {
    const ganho = p.xp - xpAnterior;
    pushFeed(NPC.lead, `${p.name} ganhou +${ganho} XP! Total: ${p.xp} XP.`, 'ok');
  }
  xpAnterior = p.xp;

  if (sprint) {
    if (sprintAnteriorNome !== null && sprint.sprint !== sprintAnteriorNome) {
      pushFeed(NPC.pm, `Nova sprint iniciada: "${sprint.sprint}". Foco nas entregas!`);
    }
    sprintAnteriorNome = sprint.sprint;

    const done = sprint.tasks?.filter(t => t.status === 'done').length || 0;
    if (done > tasksDoneAnterior) {
      pushFeed(NPC.qa, `Tarefa concluida! ${done}/${sprint.tasks.length} na sprint.`, 'ok');
    }
    tasksDoneAnterior = done;
  }
}

// ── Loop principal ────────────────────────────────────────────────────────────

function tick() {
  frame++;
  tickAtividade++;
  tickIncidente++;
  tickMetrica++;

  // Sparkline: cada tick (~150ms)
  if (frame % 3 === 0) atualizarSparkline();

  // Métricas: a cada ~3s (20 ticks)
  if (tickMetrica >= 20) {
    tickMetrica = 0;
    atualizarMetricas();
    verificarMudancas();
  }

  // Atividade NPC: a cada ~45s (300 ticks)
  if (tickAtividade >= 300) {
    tickAtividade = 0;
    const [npc, msg] = ATIVIDADES[Math.floor(Math.random() * ATIVIDADES.length)];
    pushFeed(npc, msg);
  }

  // Incidente: a cada ~5-8 min (2000-3200 ticks)
  if (!incidenteAtivo && tickIncidente >= Math.floor(2000 + Math.random() * 1200)) {
    tickIncidente = 0;
    incidenteIdx = Math.floor(Math.random() * INCIDENTES.length);
    const [npc, msg] = INCIDENTES[incidenteIdx];
    pushFeed(npc, msg, 'alerta');
    incidenteAtivo = true;
    setTimeout(() => {
      const [npcR, msgR] = RESOLUCOES[incidenteIdx];
      pushFeed(npcR, msgR, 'ok');
      incidenteAtivo = false;
    }, 60000 + Math.random() * 60000);
  }

  process.stdout.write(buildFrame());
}

// ── Boot sequence ─────────────────────────────────────────────────────────────

function boot() {
  const etapas = [
    { msg: 'Verificando integridade do sistema...',   pct: 10 },
    { msg: 'Carregando modulos corporativos...',       pct: 25 },
    { msg: 'Conectando ao banco de dados...',          pct: 40 },
    { msg: 'Inicializando servicos de autenticacao...', pct: 55 },
    { msg: 'Sincronizando feed da equipe...',          pct: 70 },
    { msg: 'Carregando estado da sprint...',           pct: 85 },
    { msg: 'Sistema pronto.',                          pct: 100 },
  ];

  function barra(pct, w = 32) {
    const filled = Math.round((pct / 100) * w);
    return `${A.green}${'█'.repeat(filled)}${A.gray}${'░'.repeat(w - filled)}${A.reset}`;
  }

  function renderBoot(idx, pct, msg) {
    let out = A.clear;
    out += '\n\n';
    out += `  ${A.cyan}${A.bold}`;
    out += '  ██████╗ ███████╗██╗   ██╗████████╗███████╗ ██████╗██╗  ██╗\n';
    out += '  ██╔══██╗██╔════╝██║   ██║╚══██╔══╝██╔════╝██╔════╝██║  ██║\n';
    out += '  ██║  ██║█████╗  ██║   ██║   ██║   █████╗  ██║     ███████║\n';
    out += '  ██║  ██║██╔══╝  ╚██╗ ██╔╝   ██║   ██╔══╝  ██║     ██╔══██║\n';
    out += '  ██████╔╝███████╗ ╚████╔╝    ██║   ███████╗╚██████╗██║  ██║\n';
    out += '  ╚═════╝ ╚══════╝  ╚═══╝     ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝\n';
    out += `${A.reset}\n`;
    out += `  ${A.bold}SISTEMAS S.A.${A.reset} ${A.gray}— Plataforma Corporativa v2.4.1${A.reset}\n`;
    out += `  ${A.gray}${'─'.repeat(56)}${A.reset}\n\n`;

    for (let i = 0; i < etapas.length; i++) {
      if (i < idx) {
        out += `  ${A.green}✓${A.reset}  ${A.gray}${etapas[i].msg}${A.reset}\n`;
      } else if (i === idx) {
        out += `  ${A.cyan}${SPIN[Math.floor(Date.now() / 80) % SPIN.length]}${A.reset}  ${etapas[i].msg}\n`;
      } else {
        out += `  ${A.gray}·  ${etapas[i].msg}${A.reset}\n`;
      }
    }

    out += '\n';
    out += `  [${barra(pct)}]  ${A.bold}${String(pct).padStart(3)}%${A.reset}\n`;
    out += '\n';

    process.stdout.write(out);
  }

  return new Promise(resolve => {
    let i = 0;
    const iv = setInterval(() => {
      renderBoot(i, etapas[i]?.pct || 100, etapas[i]?.msg || '');
      i++;
      if (i >= etapas.length) {
        clearInterval(iv);
        setTimeout(resolve, 500);
      }
    }, 300);
  });
}

// ── Inicialização ─────────────────────────────────────────────────────────────

// Esconde cursor e restaura no exit
process.stdout.write(A.hideCursor);
process.on('exit', () => process.stdout.write(A.showCursor));
process.on('SIGTERM', () => { process.stdout.write(A.showCursor); process.exit(0); });

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('SIGINT', () => {
  process.stdout.write(A.showCursor);
  process.stdout.write(`\n\n  ${A.gray}Encerrando sistema corporativo...${A.reset}\n\n`);
  process.exit(0);
});

// Inicializa estado anterior
const _p = loadProgress();
xpAnterior = _p.xp;
const _s = loadSprint();
if (_s) {
  sprintAnteriorNome = _s.sprint;
  tasksDoneAnterior  = _s.tasks?.filter(t => t.status === 'done').length || 0;
}

// Boot → loop
boot().then(() => {
  pushFeed(NPC.ops, `Sistema inicializado. Bem-vindo, ${loadProgress().name}.`, 'ok');
  pushFeed(NPC.lead, 'Bom trabalho hoje. Foco nas entregas da sprint.');

  // Tick a cada 150ms para animações suaves
  setInterval(tick, 150);

  // Mantém readline aberto (Enter força re-render)
  rl.on('line', () => process.stdout.write(buildFrame()));
});
