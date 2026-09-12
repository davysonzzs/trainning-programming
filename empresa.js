// empresa.js — DEVTECH SISTEMAS S.A. — Sistema Corporativo
// Deixe este terminal aberto enquanto trabalha.
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
  lead: { nome: 'Rafael (Tech Lead)', tag: '[LEAD]' },
  qa:   { nome: 'Ana (QA)',           tag: '[QA]  ' },
  pm:   { nome: 'Marcos (PM)',        tag: '[PM]  ' },
  dev:  { nome: 'Priya (Dev)',        tag: '[DEV] ' },
  ops:  { nome: 'Sistema DevOps',     tag: '[OPS] ' },
};

// ── Feed de atividades ─────────────────────────────────────────────────────────

const ATIVIDADES_ALEATORIAS = [
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
  [NPC.pm,   'Novo requisito do cliente chegou. Vou jogar no backlog pra proxima sprint.'],
  [NPC.dev,  'Finalmente entendi closures. So demorou umas 3 horas hahaha.'],
  [NPC.qa,   'Todos os testes de smoke passando. Ambiente saudavel.'],
  [NPC.lead, 'Codigo limpo nao e o que funciona. E o que qualquer dev consegue entender.'],
  [NPC.ops,  'Alerta: disco de logs em 78% de capacidade. Limpando entradas antigas.'],
  [NPC.dev,  'Quem criou a funcao "processarCoisa"? Preciso entender o que ela faz.'],
  [NPC.pm,   'Burndown olhando bem essa sprint. Bom ritmo, galera.'],
  [NPC.lead, 'Evitando magic numbers no codigo, por favor. Use constantes com nomes.'],
  [NPC.qa,   'Cobertura de testes subiu para 74%. Meta e 80% ate fim do mes.'],
  [NPC.ops,  'Certificado SSL renovado automaticamente. Nenhuma acao necessaria.'],
  [NPC.dev,  'Dica: .find() retorna o elemento, .findIndex() retorna a posicao.'],
  [NPC.lead, 'PR sem descricao vai ser devolvido. Explica o que fez e por que.'],
  [NPC.pm,   'Aprovacao do cliente no mockup. Podemos comecar a implementar.'],
];

const INCIDENTES = [
  [NPC.ops,  '⚠  ALERTA: latencia do servico de pagamento acima do normal (320ms avg).'],
  [NPC.qa,   '⚠  Falha intermitente no modulo de relatorios. Investigando.'],
  [NPC.ops,  '⚠  Pico de memoria no servidor de staging. Monitorando.'],
  [NPC.lead, '⚠  Dependencia desatualizada com vulnerabilidade critica. Abrindo PR.'],
  [NPC.ops,  '⚠  Job de sincronizacao falhou. Reexecutando automaticamente.'],
];

const RESOLUCOES = [
  [NPC.ops,  '✓  Latencia normalizada. Causa: query sem indice. Indice adicionado.'],
  [NPC.qa,   '✓  Falha no relatorio resolvida. Era problema de timezone.'],
  [NPC.ops,  '✓  Memoria estabilizada apos restart do worker.'],
  [NPC.lead, '✓  PR de atualizacao de dependencia mergeado.'],
  [NPC.ops,  '✓  Job de sincronizacao concluido com sucesso na segunda tentativa.'],
];

// ── Estado interno ─────────────────────────────────────────────────────────────

let feed = [];
let incidenteAtivo = null;
let incidenteIdx   = null;
let xpAnterior     = 0;
let sprintAnterior = null;
let tarefasAnteror = 0;

const MAX_FEED = 12;

function pushFeed(npc, msg, tipo = 'normal') {
  const hora = horaAtual();
  feed.push({ hora, tag: npc.tag, nome: npc.nome, msg, tipo });
  if (feed.length > MAX_FEED) feed.shift();
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

// ── Tempo ─────────────────────────────────────────────────────────────────────

function horaAtual() {
  const n = new Date();
  return `${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}:${n.getSeconds().toString().padStart(2,'0')}`;
}

function dataAtual() {
  const n = new Date();
  return n.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

function tempoAtivo(state) {
  if (!state) return 0;
  let total = state.tempoAtivoMs || 0;
  if (state.sessaoIniciadaEm) total += Date.now() - new Date(state.sessaoIniciadaEm).getTime();
  return total;
}

function formatarTempo(ms) {
  if (ms <= 0) return '0m';
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${(m % 60).toString().padStart(2,'0')}m` : `${m}m`;
}

// ── Métricas fake dos sistemas ─────────────────────────────────────────────────

function metricasCPU() {
  // Simula carga variando levemente em torno de um valor base
  const bases = [23, 41, 18, 67];
  return bases.map(b => Math.max(1, Math.min(99, b + Math.floor((Math.random() - 0.5) * 8))));
}

function metricasMem() {
  return Math.floor(62 + (Math.random() - 0.5) * 6);
}

function barraMetrica(valor, max = 100, tamanho = 10) {
  const filled = Math.round((valor / max) * tamanho);
  return `[${'█'.repeat(filled)}${'░'.repeat(tamanho - filled)}] ${valor}%`;
}

// ── Renderização ──────────────────────────────────────────────────────────────

const W   = 76;
const LIN = '═'.repeat(W - 2);
const DIV = '─'.repeat(W - 2);

function pad(str, n) {
  const s = String(str);
  return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length);
}

function centro(str) {
  const lp = Math.floor((W - 2 - str.length) / 2);
  const rp = W - 2 - str.length - lp;
  return `║ ${' '.repeat(Math.max(0,lp))}${str}${' '.repeat(Math.max(0,rp))} ║`;
}

function linha(str) {
  return `║ ${pad(str, W - 4)} ║`;
}

function renderizar() {
  const p       = loadProgress();
  const sprint  = loadSprint();
  const projs   = contarProjetos();
  const cpu     = metricasCPU();
  const mem     = metricasMem();
  const hora    = horaAtual();
  const data    = dataAtual();

  // Info da sprint
  const sprintNome    = sprint?.sprint || '—';
  const sprintProjeto = sprint?.projetoAtual || '—';
  const sprintPausado = sprint ? !sprint.sessaoIniciadaEm : true;
  const sprintTempo   = sprint ? tempoAtivo(sprint) : 0;
  const sprintEst     = sprint?.estimativaHoras || 2;
  const tarefasDone   = sprint?.tasks?.filter(t => t.status === 'done').length || 0;
  const tarefasTot    = sprint?.tasks?.length || 0;

  console.clear();

  // Header
  console.log(`╔${LIN}╗`);
  console.log(centro('DEVTECH SISTEMAS S.A.'));
  console.log(centro('── Sistema Corporativo ──'));
  console.log(`╠${LIN}╣`);
  console.log(linha(`  ${data}                                           ${hora}`));
  console.log(linha(`  Dev: ${p.name}   │   XP: ${p.xp}   │   Projetos: ${projs.concluidos}/${projs.total} entregues`));
  console.log(`╠${LIN}╣`);

  // Status sistemas
  console.log(linha('  STATUS DOS SISTEMAS'));
  console.log(`╠${LIN}╣`);
  console.log(linha(`  API Gateway    ${barraMetrica(cpu[0])}    Banco de Dados  ${barraMetrica(mem)}`));
  console.log(linha(`  Auth Service   ${barraMetrica(cpu[1])}    Worker Pool     ${barraMetrica(cpu[2])}`));
  console.log(linha(`  Cache Redis    ${barraMetrica(cpu[3])}    Staging Env     [██████████] OK `));
  console.log(`╠${LIN}╣`);

  // Sprint ativa
  console.log(linha('  SPRINT ATIVA'));
  console.log(`╠${LIN}╣`);
  if (sprint) {
    const statusSprint = sprintPausado ? 'PAUSADA' : 'EM ANDAMENTO';
    console.log(linha(`  ${sprintNome}  [${statusSprint}]`));
    console.log(linha(`  Projeto: ${sprintProjeto}`));
    console.log(linha(`  Tempo: ${formatarTempo(sprintTempo)} / ${sprintEst}h   Tarefas: ${tarefasDone}/${tarefasTot} concluidas`));
  } else {
    console.log(linha('  Nenhuma sprint ativa. Execute node sprint.js para iniciar.'));
  }
  console.log(`╠${LIN}╣`);

  // Feed de atividades
  console.log(linha('  ATIVIDADES DA EQUIPE'));
  console.log(`╠${LIN}╣`);

  const linhasFeed = feed.length > 0 ? feed : [
    { hora: hora, tag: NPC.ops.tag, nome: NPC.ops.nome, msg: 'Todos os sistemas operacionais. Aguardando atividades.', tipo: 'normal' }
  ];

  for (const item of linhasFeed.slice(-8)) {
    const cor   = item.tipo === 'alerta' ? '⚠ ' : item.tipo === 'ok' ? '✓ ' : '  ';
    const linha_ = `${cor}${item.hora}  ${item.tag}  ${item.msg}`;
    console.log(linha(linha_));
  }

  // Padding para manter altura constante
  for (let i = linhasFeed.slice(-8).length; i < 8; i++) {
    console.log(linha(''));
  }

  console.log(`╚${LIN}╝`);
  console.log('');
  console.log('  Deixe este terminal aberto enquanto trabalha.   [Ctrl+C para sair]');
  console.log('');
}

// ── Boot sequence ──────────────────────────────────────────────────────────────

function boot() {
  const etapas = [
    '  Iniciando DevTech Sistemas S.A...',
    '  Carregando modulos do sistema...',
    '  Conectando ao banco de dados...',
    '  Verificando estado da sprint...',
    '  Sincronizando feed da equipe...',
    '  Sistema pronto.',
    '',
  ];

  return new Promise(resolve => {
    console.clear();
    console.log('');
    console.log('  ██████╗ ███████╗██╗   ██╗████████╗███████╗ ██████╗██╗  ██╗');
    console.log('  ██╔══██╗██╔════╝██║   ██║╚══██╔══╝██╔════╝██╔════╝██║  ██║');
    console.log('  ██║  ██║█████╗  ██║   ██║   ██║   █████╗  ██║     ███████║');
    console.log('  ██║  ██║██╔══╝  ╚██╗ ██╔╝   ██║   ██╔══╝  ██║     ██╔══██║');
    console.log('  ██████╔╝███████╗ ╚████╔╝    ██║   ███████╗╚██████╗██║  ██║');
    console.log('  ╚═════╝ ╚══════╝  ╚═══╝     ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝');
    console.log('');
    console.log('  SISTEMAS S.A. — Plataforma Corporativa v2.4.1');
    console.log('  ─────────────────────────────────────────────');
    console.log('');

    let i = 0;
    const iv = setInterval(() => {
      if (i < etapas.length) {
        console.log(etapas[i]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(resolve, 400);
      }
    }, 280);
  });
}

// ── Monitoramento de mudanças ──────────────────────────────────────────────────

function verificarMudancas() {
  const p      = loadProgress();
  const sprint = loadSprint();

  // XP ganho
  if (p.xp > xpAnterior && xpAnterior > 0) {
    const ganho = p.xp - xpAnterior;
    pushFeed(NPC.lead, `${p.name} ganhou +${ganho} XP! Total: ${p.xp} XP.`, 'ok');
  }
  xpAnterior = p.xp;

  // Mudança de sprint
  if (sprint && sprint.sprint !== sprintAnterior && sprintAnterior !== null) {
    pushFeed(NPC.pm, `Nova sprint iniciada: "${sprint.sprint}". Foco nas entregas!`);
  }
  if (sprint) sprintAnterior = sprint.sprint;

  // Tarefas concluidas
  if (sprint) {
    const done = sprint.tasks?.filter(t => t.status === 'done').length || 0;
    if (done > tarefasDone && tarefasDone >= 0) {
      pushFeed(NPC.qa, `Tarefa concluida na sprint. ${done}/${sprint.tasks.length} feitas.`, 'ok');
    }
    tarefasDone = done;
  }
}

// ── Eventos aleatórios ────────────────────────────────────────────────────────

let tarefasDone = 0;
let tickAtividade = 0;
let tickIncidente = 0;

function tick() {
  tickAtividade++;
  tickIncidente++;

  // Mensagem de atividade aleatória a cada ~45s
  if (tickAtividade >= 9) {
    tickAtividade = 0;
    const [npc, msg] = ATIVIDADES_ALEATORIAS[Math.floor(Math.random() * ATIVIDADES_ALEATORIAS.length)];
    pushFeed(npc, msg);
  }

  // Incidente aleatório a cada ~5-8 min
  if (!incidenteAtivo && tickIncidente >= Math.floor(60 + Math.random() * 40)) {
    tickIncidente = 0;
    incidenteIdx  = Math.floor(Math.random() * INCIDENTES.length);
    const [npc, msg] = INCIDENTES[incidenteIdx];
    pushFeed(npc, msg, 'alerta');
    incidenteAtivo = true;

    // Resolve o incidente após 1-2 minutos
    setTimeout(() => {
      const [npcR, msgR] = RESOLUCOES[incidenteIdx];
      pushFeed(npcR, msgR, 'ok');
      incidenteAtivo = false;
    }, 60000 + Math.random() * 60000);
  }

  verificarMudancas();
  renderizar();
}

// ── Inicialização ─────────────────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.on('SIGINT', () => {
  console.log('\n\n  Encerrando sistema corporativo...\n');
  process.exit(0);
});

// Inicializa estado anterior
const _p = loadProgress();
xpAnterior = _p.xp;
const _s = loadSprint();
if (_s) {
  sprintAnterior = _s.sprint;
  tarefasDone = _s.tasks?.filter(t => t.status === 'done').length || 0;
}

// Boot e start
boot().then(() => {
  pushFeed(NPC.ops, `Sistema inicializado. Bem-vindo, ${loadProgress().name}.`, 'ok');
  pushFeed(NPC.lead, 'Bom trabalho hoje. Foco nas entregas da sprint.');

  renderizar();

  // Tick a cada 5 segundos
  setInterval(tick, 5000);

  // Mantém readline aberto
  rl.on('line', () => {
    renderizar();
  });
});
