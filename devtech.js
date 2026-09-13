// devtech.js — DEVTECH SISTEMAS S.A. — Sistema Unificado
// Execute: node devtech.js
'use strict';

const fs   = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
//  PATHS
// ─────────────────────────────────────────────────────────────────────────────

const ROOT          = __dirname;
const DATA_DIR      = path.join(ROOT, '.devtech');
const SPRINT_FILE   = path.join(DATA_DIR, 'sprint.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const AULAS_FILE    = path.join(DATA_DIR, 'aulas.md');
const PROJECTS_DIR  = path.join(ROOT, 'projects');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ─────────────────────────────────────────────────────────────────────────────
//  ANSI
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  cls:     '\x1b[2J\x1b[3J\x1b[H',
  home:    '\x1b[H',
  hide:    '\x1b[?25l',
  show:    '\x1b[?25h',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  reset:   '\x1b[0m',
  red:     '\x1b[31m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  cyan:    '\x1b[36m',
  white:   '\x1b[97m',
  gray:    '\x1b[90m',
  bgBlack: '\x1b[40m',
};

const W = 80, INN = W - 4;   // border=2, pad=1 each side → inner=76
const LINE = '═'.repeat(W - 2);
const DIV  = '─'.repeat(W - 2);
const SPIN = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
const SPARK_CH = ['▁','▂','▃','▄','▅','▆','▇','█'];

function row(str) {
  const s = stripAnsi(str);
  const pad = Math.max(0, INN - s.length);
  return `║ ${str}${' '.repeat(pad)} ║`;
}

function cen(str) {
  const s = stripAnsi(str);
  const lp = Math.max(0, Math.floor((INN - s.length) / 2));
  const rp = Math.max(0, INN - s.length - lp);
  return `║ ${' '.repeat(lp)}${str}${' '.repeat(rp)} ║`;
}

function stripAnsi(s) {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

function clr(color, str) { return `${color}${str}${C.reset}`; }
function bold(str)   { return `${C.bold}${str}${C.reset}`; }
function dim(str)    { return `${C.dim}${str}${C.reset}`; }

// ─────────────────────────────────────────────────────────────────────────────
//  NPCs
// ─────────────────────────────────────────────────────────────────────────────

const NPC = {
  lead: { nome: 'Rafael (Tech Lead)', tag: '[LEAD]' },
  qa:   { nome: 'Ana (QA)',           tag: '[QA]  ' },
  pm:   { nome: 'Marcos (PM)',        tag: '[PM]  ' },
  dev:  { nome: 'Priya (Dev)',        tag: '[DEV] ' },
  ops:  { nome: 'DevOps',            tag: '[OPS] ' },
};

const MSGS_AMBIENTE = [
  [NPC.qa,   'Regressao passando em staging. Pode subir.'],
  [NPC.dev,  'Alguem sabe onde ficam as configs do banco de dev?'],
  [NPC.pm,   'Reuniao de refinamento amanha as 10h.'],
  [NPC.lead, 'Commits no imperativo. "Adiciona" nao "Adicionando".'],
  [NPC.qa,   'Build CI quebrou. Quem commitou por ultimo?'],
  [NPC.dev,  'PR #47 esperando review ha 2 dias.'],
  [NPC.pm,   'Cliente pediu demo na quinta.'],
  [NPC.lead, 'PR sem descricao vai ser devolvido.'],
  [NPC.qa,   'Edge case no modulo de relatorios. Abrindo ticket.'],
  [NPC.ops,  'Deploy em staging concluido. Build #214 estavel.'],
  [NPC.dev,  'Dica: .find() retorna o elemento, .findIndex() o index.'],
  [NPC.lead, 'Se travar, nao perde tempo sozinho. Pede ajuda.'],
  [NPC.pm,   'Burndown ok essa sprint. Bom ritmo.'],
  [NPC.ops,  'Backup do banco concluido.'],
  [NPC.lead, 'Codigo limpo e o que qualquer dev consegue entender.'],
  [NPC.qa,   'Cobertura subiu pra 74%. Meta e 80%.'],
  [NPC.dev,  'Finalmente entendi closures. Levou 3h hahaha.'],
  [NPC.pm,   'Novo req do cliente. Jogando no backlog.'],
];

const INCIDENTES = [
  [NPC.ops,  'ALERTA: latencia do pagamento acima do normal (320ms).'],
  [NPC.qa,   'ALERTA: Falha intermitente no modulo de relatorios.'],
  [NPC.ops,  'ALERTA: Pico de memoria em staging. Monitorando.'],
  [NPC.lead, 'ALERTA: Dependencia com vulnerabilidade critica.'],
];

const RESOLUCOES = [
  [NPC.ops,  'RESOLVIDO: Latencia ok. Causa: query sem indice.'],
  [NPC.qa,   'RESOLVIDO: Falha resolvida. Era problema de timezone.'],
  [NPC.ops,  'RESOLVIDO: Memoria ok apos restart do worker.'],
  [NPC.lead, 'RESOLVIDO: PR de seguranca mergeado.'],
];

// ─────────────────────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────────────────────

const LEVELS = [
  { name: 'Estagiário', xpMin: 0,    xpMax: 149,  salary: 'R$ 800–R$ 1.500',     folder: 'estagiario', fase: 1  },
  { name: 'Trainee',    xpMin: 150,  xpMax: 349,  salary: 'R$ 2.000–R$ 3.500',   folder: 'trainee',    fase: 2  },
  { name: 'Junior I',   xpMin: 350,  xpMax: 599,  salary: 'R$ 3.000–R$ 4.500',   folder: 'junior-1',   fase: 3  },
  { name: 'Junior II',  xpMin: 600,  xpMax: 899,  salary: 'R$ 4.000–R$ 5.500',   folder: 'junior-2',   fase: 5  },
  { name: 'Junior III', xpMin: 900,  xpMax: 1249, salary: 'R$ 5.000–R$ 7.000',   folder: 'junior-3',   fase: 6  },
  { name: 'Pleno I',    xpMin: 1250, xpMax: 1649, salary: 'R$ 6.500–R$ 9.000',   folder: 'pleno-1',    fase: 7  },
  { name: 'Pleno II',   xpMin: 1650, xpMax: 2099, salary: 'R$ 8.500–R$ 11.000',  folder: 'pleno-2',    fase: 8  },
  { name: 'Pleno III',  xpMin: 2100, xpMax: 2599, salary: 'R$ 10.000–R$ 14.000', folder: 'pleno-3',    fase: 9  },
  { name: 'Sênior I',   xpMin: 2600, xpMax: 3149, salary: 'R$ 13.000–R$ 17.000', folder: 'senior-1',   fase: 11 },
  { name: 'Sênior II',  xpMin: 3150, xpMax: 3749, salary: 'R$ 16.000–R$ 22.000', folder: 'senior-2',   fase: 13 },
  { name: 'Sênior III', xpMin: 3750, xpMax: null, salary: 'R$ 20.000–R$ 30.000+',folder: 'senior-3',   fase: 14 },
];

function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--)
    if (xp >= LEVELS[i].xpMin) return { lv: LEVELS[i], idx: i };
  return { lv: LEVELS[0], idx: 0 };
}

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return { name: 'Dev', xp: 0, avisos: 0, atrasadas: 0 };
  try {
    const p = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    if (!('avisos' in p))   p.avisos   = 0;
    if (!('atrasadas' in p)) p.atrasadas = 0;
    return p;
  } catch { return { name: 'Dev', xp: 0, avisos: 0, atrasadas: 0 }; }
}

function saveProgress(p) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2)); }

function loadSprint() {
  if (!fs.existsSync(SPRINT_FILE)) {
    const init = { sprint: 'Sprint 1', nextId: 1, tasks: [], tempoAtivoMs: 0,
      sessaoIniciadaEm: null, pausadoEm: null, estimativaHoras: 2, projetoAtual: null };
    fs.writeFileSync(SPRINT_FILE, JSON.stringify(init, null, 2));
    return init;
  }
  try {
    const d = JSON.parse(fs.readFileSync(SPRINT_FILE, 'utf8'));
    if (!('tempoAtivoMs'     in d)) d.tempoAtivoMs     = 0;
    if (!('sessaoIniciadaEm' in d)) d.sessaoIniciadaEm = null;
    if (!('pausadoEm'        in d)) d.pausadoEm        = null;
    if (!('projetoAtual'     in d)) d.projetoAtual     = null;
    if (!('estimativaHoras'  in d)) d.estimativaHoras  = 2;
    return d;
  } catch { return null; }
}

function saveSprint(s) { fs.writeFileSync(SPRINT_FILE, JSON.stringify(s, null, 2)); }

function loadMessages() {
  if (!fs.existsSync(MESSAGES_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8')); } catch { return []; }
}

function pushMessage(npc, txt) {
  const msgs = loadMessages();
  msgs.push({ tag: npc.tag, nome: npc.nome, texto: txt });
  if (msgs.length > 20) msgs.splice(0, msgs.length - 20);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2));
}

function tempoAtivoTotal(s) {
  let t = s.tempoAtivoMs || 0;
  if (s.sessaoIniciadaEm) t += Date.now() - new Date(s.sessaoIniciadaEm).getTime();
  return t;
}

function fmtMs(ms) {
  if (!ms || ms <= 0) return '0m';
  const m = Math.floor(ms / 60000), h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${(m%60).toString().padStart(2,'0')}m` : `${m}m`;
}

function horaAtual() {
  const n = new Date();
  return [n.getHours(), n.getMinutes(), n.getSeconds()].map(x => String(x).padStart(2,'0')).join(':');
}

function dataAtual() {
  return new Date().toLocaleDateString('pt-BR', { weekday:'short', day:'2-digit', month:'2-digit' });
}

function contarProjetos() {
  if (!fs.existsSync(PROJECTS_DIR)) return { concluidos:0, total:0 };
  let c=0, t=0;
  for (const nv of fs.readdirSync(PROJECTS_DIR)) {
    const np = path.join(PROJECTS_DIR, nv);
    if (!fs.statSync(np).isDirectory()) continue;
    for (const pj of fs.readdirSync(np)) {
      const pp = path.join(np, pj);
      if (!fs.statSync(pp).isDirectory()) continue;
      t++;
      if (fs.existsSync(path.join(pp, '.concluido'))) c++;
    }
  }
  return { concluidos:c, total:t };
}

// ─────────────────────────────────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────────────────────────────────

const APP = {
  screen:    'menu',    // menu | empresa | sprint | dev | projetos | aulas
  menuSel:   0,
  frame:     0,
  inputBuf:  '',
  lastFb:    null,      // sprint feedback
  aulasScroll: 0,
  aulaLines: [],

  // empresa
  feed: [], feedTick: 0, incAtivo: false, incIdx: null,
  metricas: { api:62, auth:44, banco:38, cache:71, worker:55 },
  spark: Array.from({length:18}, () => Math.floor(Math.random()*6)+1),
  reqPs: 847, lat: 23,

  // sprint overtime (per session, not persisted)
  ov80: false, ov100: false, ov150: false,
};

const MENU_ITEMS = [
  { key:'1', label:'Sistema Corporativo',      desc:'Monitor em tempo real da empresa' },
  { key:'2', label:'Painel de Sprint',          desc:'Gerencie tarefas e cronometro'    },
  { key:'3', label:'Ficha do Desenvolvedor',    desc:'Nivel, XP, salario e historico'   },
  { key:'4', label:'Quadro de Projetos',        desc:'Missoes disponiveis e progresso'  },
  { key:'5', label:'Trilha de Estudos',         desc:'14 fases ate Senior III'          },
];

function spin(o=0) { return SPIN[(APP.frame+o) % SPIN.length]; }

function pushFeed(npc, msg, tipo='normal') {
  APP.feed.push({ hora: horaAtual(), tag: npc.tag, msg, tipo });
  if (APP.feed.length > 10) APP.feed.shift();
}

// ─────────────────────────────────────────────────────────────────────────────
//  DRAW UTILS
// ─────────────────────────────────────────────────────────────────────────────

function xpBar(xp, lv, w=26) {
  if (lv.xpMax === null) return clr(C.cyan, '█'.repeat(w)) + ' MAX';
  const pct = (xp - lv.xpMin) / (lv.xpMax - lv.xpMin + 1);
  const filled = Math.round(pct * w);
  return clr(C.cyan, '█'.repeat(filled)) + clr(C.gray, '░'.repeat(w-filled));
}

function metBar(v, w=10) {
  const filled = Math.round((Math.min(100, Math.max(0,v))/100)*w);
  const c = v > 80 ? C.red : v > 60 ? C.yellow : C.green;
  return `${c}${'█'.repeat(filled)}${C.gray}${'░'.repeat(w-filled)}${C.reset} ${String(v).padStart(3)}%`;
}

function sparkline() {
  return APP.spark.map(v => {
    const i = Math.min(7, Math.max(0, Math.round((v/10)*7)));
    return `${v > 7 ? C.yellow : C.cyan}${SPARK_CH[i]}${C.reset}`;
  }).join('');
}

function timerLine(s) {
  const hora  = horaAtual();
  const ativo = tempoAtivoTotal(s);
  const estMs = s.estimativaHoras * 3600000;
  const pausado = !s.sessaoIniciadaEm;
  const pct  = ativo / estMs;

  if (!s.sessaoIniciadaEm && !s.pausadoEm && ativo === 0)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.gray,'—')} use "retomar" para iniciar o timer`;

  if (pausado)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.yellow,'⏸ PAUSADO')} — ${fmtMs(ativo)} / ${s.estimativaHoras}h`;

  if (pct >= 2.0)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.red,'⚠ SPRINT CRÍTICA')}: ${fmtMs(ativo)} / ${s.estimativaHoras}h  (+${fmtMs(ativo-estMs)})`;

  if (pct >= 1.0)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.red,'⚠ ESTOURADA')}: ${fmtMs(ativo)} / ${s.estimativaHoras}h  (+${fmtMs(ativo-estMs)})`;

  if (pct >= 0.8)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.yellow,'⚡')} ${fmtMs(ativo)} / ${s.estimativaHoras}h  (faltam ${fmtMs(estMs-ativo)})`;

  return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.green,'▶')} ${fmtMs(ativo)} / ${s.estimativaHoras}h  (faltam ${clr(C.cyan,fmtMs(estMs-ativo))})`;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREENS
// ─────────────────────────────────────────────────────────────────────────────

function buildMenu() {
  const p    = loadProgress();
  const { lv, idx } = getLevel(p.xp);
  const proj = contarProjetos();
  const next = lv.xpMax !== null ? LEVELS[idx+1] : null;

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += `║ ${clr(C.cyan, C.bold+'  ██████╗ ███████╗██╗   ██╗████████╗███████╗ ██████╗██╗  ██╗'+C.reset).padEnd(INN+20)} ║\n`;
  o += `║ ${clr(C.cyan, '  ██╔══██╗██╔════╝██║   ██║╚══██╔══╝██╔════╝██╔════╝██║  ██║').padEnd(INN+9)} ║\n`;
  o += `║ ${clr(C.cyan, '  ██║  ██║█████╗  ██║   ██║   ██║   █████╗  ██║     ███████║').padEnd(INN+9)} ║\n`;
  o += `║ ${clr(C.cyan, '  ██║  ██║██╔══╝  ╚██╗ ██╔╝   ██║   ██╔══╝  ██║     ██╔══██║').padEnd(INN+9)} ║\n`;
  o += `║ ${clr(C.cyan, '  ██████╔╝███████╗ ╚████╔╝    ██║   ███████╗╚██████╗██║  ██║').padEnd(INN+9)} ║\n`;
  o += `║ ${clr(C.cyan, '  ╚═════╝ ╚══════╝  ╚═══╝     ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝').padEnd(INN+9)} ║\n`;
  o += cen(clr(C.gray, 'S I S T E M A S   S . A .   —   Sistema de Treinamento')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${bold(p.name)}  ${clr(C.gray,'│')}  ${clr(C.yellow,lv.name)}  ${clr(C.gray,'│')}  XP: ${clr(C.cyan,String(p.xp))}/${lv.xpMax !== null ? lv.xpMax+1 : 'MAX'}  ${clr(C.gray,'│')}  ${proj.concluidos}/${proj.total} projetos  ${clr(C.gray,'│')}  ${dataAtual()} ${clr(C.cyan,horaAtual())}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += row('') + '\n';

  for (let i = 0; i < MENU_ITEMS.length; i++) {
    const sel = i === APP.menuSel;
    const cursor = sel ? clr(C.cyan, `${C.bold}▶ [${MENU_ITEMS[i].key}]`) : `  [${MENU_ITEMS[i].key}]`;
    const label  = sel ? bold(clr(C.white, MENU_ITEMS[i].label)) : MENU_ITEMS[i].label;
    const desc   = clr(C.gray, MENU_ITEMS[i].desc);
    o += row(`  ${cursor}  ${label.padEnd(sel ? 34+9 : 34)}  ${desc}`) + '\n';
  }

  o += row('') + '\n';
  if (next) {
    const bar = xpBar(p.xp, lv, 20);
    o += row(`  ${clr(C.gray,'Próximo:')} ${clr(C.yellow,next.name)}  ${bar}  ${clr(C.gray,String(lv.xpMax+1-p.xp)+' XP')}`) + '\n';
  }
  if (p.avisos > 0) o += row(`  ${clr(C.yellow,'⚠')}  Avisos de desempenho: ${clr(C.yellow,String(p.avisos))}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(dim(`  ↑↓  mover   Enter  entrar   1-5  atalho   Ctrl+C  sair`)) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

// ── EMPRESA ──────────────────────────────────────────────────────────────────

function buildEmpresa() {
  const p   = loadProgress();
  const s   = loadSprint();
  const pj  = contarProjetos();
  const msgs = loadMessages().slice(-6);

  const sprintNome    = s?.sprint || '—';
  const sprintProj    = s?.projetoAtual ? `projects/${s.projetoAtual}` : '—';
  const pausado       = s ? !s.sessaoIniciadaEm : true;
  const statusSprint  = pausado ? clr(C.yellow,'PAUSADA') : clr(C.green,'ATIVO');
  const done = s?.tasks?.filter(t=>t.status==='done').length||0;
  const tot  = s?.tasks?.length||0;

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold('DEVTECH SISTEMAS S.A.  ─  Monitor Corporativo')) + '\n';
  o += row(` ${clr(C.gray,dataAtual())}  ${' '.repeat(40)}  ${clr(C.cyan,horaAtual())}`) + '\n';
  o += row(` Dev: ${bold(p.name)}   XP: ${clr(C.cyan,String(p.xp))}   Projetos: ${clr(C.green,`${pj.concluidos}/${pj.total}`)}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(bold(' STATUS DOS SISTEMAS')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${clr(C.cyan,spin(0))} API Gateway   ${metBar(APP.metricas.api)}    ${clr(C.cyan,spin(3))} Auth Service  ${metBar(APP.metricas.auth)}`) + '\n';
  o += row(` ${clr(C.cyan,spin(1))} Banco Dados   ${metBar(APP.metricas.banco)}    ${clr(C.cyan,spin(4))} Cache Redis   ${metBar(APP.metricas.cache)}`) + '\n';
  o += row(` ${clr(C.cyan,spin(2))} Worker Pool   ${metBar(APP.metricas.worker)}    ${clr(C.green,'✓')} Staging Env   ${clr(C.green,'██████████')}  OK`) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${clr(C.gray,'Tráfego:')}  ${sparkline()}  ${clr(C.cyan,APP.reqPs+' req/s')}   ${clr(C.gray,'Latência: '+APP.lat+'ms')}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(bold(' SPRINT ATIVA')) + '\n';
  o += `╠${LINE}╣\n`;
  if (s) {
    o += row(` ${bold(sprintNome)}  [${statusSprint}]`) + '\n';
    o += row(` ${clr(C.gray,'Projeto:')} ${sprintProj}`) + '\n';
    o += row(` ${timerLine(s)}`) + '\n';
    o += row(` ${clr(C.gray,'Tarefas:')} ${clr(C.green,String(done))}/${tot} concluidas`) + '\n';
  } else {
    o += row(clr(C.gray,' Nenhuma sprint ativa. Acesse "Painel de Sprint" para iniciar.')) + '\n';
    o += row('') + '\n'; o += row('') + '\n'; o += row('') + '\n';
  }
  o += `╠${LINE}╣\n`;
  o += row(bold(' ATIVIDADES DA EQUIPE')) + '\n';
  o += `╠${LINE}╣\n`;

  const exibir = APP.feed.length > 0 ? APP.feed.slice(-6) : [
    { hora: horaAtual(), tag: NPC.ops.tag, msg: 'Todos os sistemas operacionais.', tipo:'ok' }
  ];

  for (const item of exibir) {
    const pfx = item.tipo==='alerta' ? clr(C.yellow,'⚠') : item.tipo==='ok' ? clr(C.green,'✓') : ' ';
    o += row(` ${pfx} ${clr(C.gray,item.hora)}  ${item.tag}  ${item.msg}`) + '\n';
  }
  for (let i = exibir.length; i < 6; i++) o += row('') + '\n';

  o += `╠${LINE}╣\n`;
  o += row(dim('  Esc  voltar ao menu   Enter  atualizar')) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

// ── SPRINT ───────────────────────────────────────────────────────────────────

function buildSprint(s) {
  const p       = loadProgress();
  const backlog = s.tasks.filter(t => t.status==='backlog');
  const doing   = s.tasks.filter(t => t.status==='doing');
  const done    = s.tasks.filter(t => t.status==='done');
  const rows    = Math.max(backlog.length, doing.length, done.length, 1);
  const pausado = !s.sessaoIniciadaEm;
  const COL     = 22;
  const msgs    = loadMessages().slice(-3);
  const [aNpc]  = MSGS_AMBIENTE[APP.frame % MSGS_AMBIENTE.length];
  const aMsg    = MSGS_AMBIENTE[APP.frame % MSGS_AMBIENTE.length];

  function cell(task, col) {
    if (!task) return ' '.repeat(col);
    const s2 = `[${task.id}] ${task.title}`;
    return (s2.length > col ? s2.slice(0,col-1)+'…' : s2).padEnd(col);
  }

  function doingCell(task) {
    if (!task) return ' '.repeat(COL);
    const suf = pausado ? ' (pausado)' : ` (${Math.floor((Date.now()-new Date(task.startedAt||Date.now()).getTime())/60000)}m)`;
    const s2 = `[${task.id}] ${task.title}${suf}`;
    return (s2.length > COL ? s2.slice(0,COL-1)+'…' : s2).padEnd(COL);
  }

  const sep = `  ${clr(C.gray,'─'.repeat(COL)+'─┼─'+'─'.repeat(COL)+'─┼─'+'─'.repeat(COL))}`;

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += row(` ${bold('DEVTECH SISTEMAS S.A.')}  ${' '.repeat(26)}Dev: ${bold(p.name)}  XP: ${clr(C.cyan,String(p.xp))}`) + '\n';
  o += row(` Sprint: ${bold(s.sprint)}${pausado ? '  '+clr(C.yellow,'[PAUSADO]') : ''}  ${s.projetoAtual ? clr(C.gray,'  proj: '+s.projetoAtual) : ''}`) + '\n';
  o += row(` ${timerLine(s)}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${bold(clr(C.cyan,'BACKLOG')).padEnd(COL+9)}  ${bold(clr(C.yellow,'EM ANDAMENTO')).padEnd(COL+9)}  ${bold(clr(C.green,'CONCLUIDO'))}`) + '\n';
  o += sep + '\n';
  for (let i = 0; i < rows; i++) {
    const bd = cell(backlog[i], COL);
    const dd = doingCell(doing[i]);
    const dn = cell(done[i], COL);
    o += `  ${bd} │ ${doing[i] ? clr(C.yellow,dd) : dd} │ ${done[i] ? clr(C.green,dn) : dn}\n`;
  }
  o += `╠${LINE}╗\n`.replace('╗','╣');
  o += row(bold(' MENSAGENS')) + '\n';
  o += `╠${LINE}╣\n`;
  if (msgs.length === 0) {
    o += row(` ${clr(C.gray, aMsg[0].tag+' '+aMsg[1])}`) + '\n';
  } else {
    for (const m of msgs) o += row(` ${clr(C.gray, m.tag+' '+m.texto)}`) + '\n';
    o += row(` ${clr(C.gray, aMsg[0].tag+' '+aMsg[1])}`) + '\n';
  }
  o += `╠${LINE}╣\n`;
  if (APP.lastFb) o += row(` ${APP.lastFb}`) + '\n', o += `╠${LINE}╣\n`;
  o += row(dim('  add  start  done  rm  sprint  pausar  retomar  projeto  concluir  estimativa')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${clr(C.cyan,'>')} ${APP.inputBuf}${clr(C.gray,'█')}`) + '\n';
  o += `╚${LINE}╝\n`;
  o += dim('  Esc  voltar ao menu\n');
  return o;
}

// ── DEV ──────────────────────────────────────────────────────────────────────

function buildDev() {
  const p     = loadProgress();
  const { lv, idx } = getLevel(p.xp);
  const next  = lv.xpMax !== null ? LEVELS[idx+1] : null;
  const proj  = contarProjetos();
  const msgs  = loadMessages().slice(-5);

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold('DEVTECH SISTEMAS S.A.  ─  Ficha do Desenvolvedor')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row('') + '\n';
  o += row(`  ${clr(C.gray,'Desenvolvedor')}   ${bold(p.name)}`) + '\n';
  o += row(`  ${clr(C.gray,'Nível         ')}   ${bold(clr(C.yellow,lv.name))}`) + '\n';
  o += row(`  ${clr(C.gray,'XP            ')}   ${clr(C.cyan,String(p.xp))} XP`) + '\n';
  o += row(`  ${clr(C.gray,'Salário       ')}   ${lv.salary}`) + '\n';
  o += row(`  ${clr(C.gray,'Projetos      ')}   ${clr(C.green,String(proj.concluidos))}/${proj.total} entregues`) + '\n';
  if (p.atrasadas > 0) o += row(`  ${clr(C.gray,'Atrasos       ')}   ${clr(C.yellow,String(p.atrasadas))} sprint(s) atrasada(s)`) + '\n';
  if (p.avisos > 0)    o += row(`  ${clr(C.yellow,'⚠ Avisos      ')}   ${clr(C.yellow,String(p.avisos))} aviso(s) de desempenho`) + '\n';
  o += row('') + '\n';
  o += `╠${LINE}╣\n`;
  o += row(`  ${xpBar(p.xp, lv, 40)}`) + '\n';
  if (next)
    o += row(`  ${clr(C.gray,'→')} ${clr(C.yellow,next.name)} em ${clr(C.cyan,String(lv.xpMax+1-p.xp)+' XP')}`) + '\n';
  else
    o += row(clr(C.green,'  ★ Nível máximo atingido!')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(bold(' ÚLTIMAS MENSAGENS DA EQUIPE')) + '\n';
  o += `╠${LINE}╣\n`;
  if (msgs.length === 0)
    o += row(clr(C.gray,'  (nenhuma mensagem ainda)')) + '\n';
  else
    for (const m of msgs) o += row(` ${clr(C.gray,m.tag)} ${m.texto}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(dim('  name <seu nome>   Enter atualizar   Esc voltar')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${clr(C.cyan,'>')} ${APP.inputBuf}${clr(C.gray,'█')}`) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

// ── PROJETOS ─────────────────────────────────────────────────────────────────

function buildProjetos() {
  const sprint = loadSprint();
  const atual  = sprint?.projetoAtual || null;

  function getStatus(nivel, proj) {
    const pp = path.join(PROJECTS_DIR, nivel, proj);
    if (fs.existsSync(path.join(pp, '.concluido')))   return { icon: clr(C.green,'✓'), label: 'ENTREGUE',     cor: C.green  };
    if (atual && atual.includes(proj))                return { icon: clr(C.yellow,'⚙'), label: 'EM ANDAMENTO', cor: C.yellow };
    return { icon: clr(C.gray,'○'), label: 'PENDENTE',     cor: C.gray   };
  }

  const proj = contarProjetos();
  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold('DEVTECH SISTEMAS S.A.  ─  Quadro de Projetos')) + '\n';
  o += row(` ${clr(C.green,String(proj.concluidos))}/${proj.total} projetos entregues  ${xpBar(proj.concluidos, {xpMin:0,xpMax:proj.total-1}, 30)}`) + '\n';
  o += `╠${LINE}╣\n`;

  if (!fs.existsSync(PROJECTS_DIR)) {
    o += row(clr(C.gray,'  Nenhum projeto encontrado.')) + '\n';
  } else {
    for (const nivel of fs.readdirSync(PROJECTS_DIR).sort()) {
      const np = path.join(PROJECTS_DIR, nivel);
      if (!fs.statSync(np).isDirectory()) continue;
      const lv = LEVELS.find(l => l.folder === nivel);
      o += row(`  ${bold(clr(C.cyan, (lv ? lv.name : nivel).padEnd(12)))}`) + '\n';
      for (const pj of fs.readdirSync(np).sort()) {
        const pp = path.join(np, pj);
        if (!fs.statSync(pp).isDirectory()) continue;
        const st = getStatus(nivel, pj);
        o += row(`    ${st.icon}  ${clr(st.cor, pj)}`) + '\n';
      }
    }
  }

  o += `╠${LINE}╣\n`;
  o += row(dim('  Esc  voltar ao menu')) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

// ── AULAS ────────────────────────────────────────────────────────────────────

function loadAulas() {
  if (APP.aulaLines.length) return;
  if (!fs.existsSync(AULAS_FILE)) { APP.aulaLines = [clr(C.gray,'aulas.md não encontrado.')]; return; }
  const raw = fs.readFileSync(AULAS_FILE, 'utf8').split('\n');
  const p   = loadProgress();
  const { lv } = getLevel(p.xp);

  for (const ln of raw) {
    if (ln.startsWith('## FASE')) {
      // encontra o número da fase
      const m = ln.match(/FASE (\d+)/);
      const faseNum = m ? parseInt(m[1]) : 0;
      const isCurrent = lv.fase === faseNum;
      const isPast    = lv.fase > faseNum;
      if (isCurrent)    APP.aulaLines.push(clr(C.cyan, bold(`▶ ${ln}`)));
      else if (isPast)  APP.aulaLines.push(clr(C.green, `✓ ${ln}`));
      else              APP.aulaLines.push(clr(C.gray, `  ${ln}`));
    } else if (ln.startsWith('- ')) {
      APP.aulaLines.push(clr(C.gray, `    ${ln}`));
    } else if (ln.startsWith('#')) {
      APP.aulaLines.push(bold(ln));
    } else if (ln === '---') {
      APP.aulaLines.push(clr(C.gray, '  ' + '─'.repeat(INN-2)));
    } else {
      APP.aulaLines.push(ln);
    }
  }
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

// ─────────────────────────────────────────────────────────────────────────────
//  SPRINT COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

function pick(arr, ...args) {
  return arr[Math.floor(Math.random() * arr.length)](...args);
}

const RESP = {
  done:  [(id)=>[NPC.lead,`Tarefa #${id} aprovada no code review.`], (id)=>[NPC.qa,`Testei #${id}. Passou.`], (id)=>[NPC.dev,`Arrasou na #${id}!`]],
  start: [(id)=>[NPC.lead,`#${id} em andamento. Avisa se travar.`], (id)=>[NPC.dev,`Boa sorte na #${id}!`]],
  add:   [()=>[NPC.pm,`Task adicionada.`], ()=>[NPC.lead,`Boa task.`]],
  sprint:[()=>[NPC.pm,`Nova sprint! Foco.`], ()=>[NPC.dev,`Bora codar!`]],
  pausar:[()=>[NPC.dev,`Ate mais!`], ()=>[NPC.lead,`Salva antes de sair.`]],
  retomar:[()=>[NPC.dev,`Bem-vindo de volta!`], ()=>[NPC.lead,`Bora terminar.`]],
};

function sprintCommand(input, s) {
  const parts = input.trim().split(/\s+/);
  const cmd   = parts[0]?.toLowerCase();
  const rest  = parts.slice(1).join(' ');

  switch (cmd) {
    case 'add': {
      if (!rest) return '  Use: add <titulo>';
      s.tasks.push({ id: s.nextId++, title: rest, status: 'backlog' });
      saveSprint(s);
      const [n,t] = pick(RESP.add); pushMessage(n,t);
      return `${clr(C.green,'+')} Tarefa #${s.nextId-1} adicionada.`;
    }
    case 'start': {
      const id = parseInt(rest), task = s.tasks.find(t=>t.id===id);
      if (!task) return `  Tarefa #${id} nao encontrada.`;
      if (task.status==='done') return `  #${id} ja concluida.`;
      task.status = 'doing'; task.startedAt = new Date().toISOString();
      if (!s.sessaoIniciadaEm) { s.sessaoIniciadaEm = new Date().toISOString(); s.pausadoEm = null; }
      saveSprint(s);
      const [n,t] = pick(RESP.start,id); pushMessage(n,t);
      return `${clr(C.yellow,'>')} #${id} em andamento.`;
    }
    case 'done': {
      const id = parseInt(rest), task = s.tasks.find(t=>t.id===id);
      if (!task) return `  Tarefa #${id} nao encontrada.`;
      const min = Math.floor((Date.now()-new Date(task.startedAt||Date.now()).getTime())/60000);
      task.status = 'done'; task.completedAt = new Date().toISOString();
      saveSprint(s);
      const p = loadProgress(); p.xp += 25; saveProgress(p);
      const [n,t] = pick(RESP.done,id); pushMessage(n,t);
      return `${clr(C.green,'★')} #${id} concluida!${min>0?` (${min}m)`:''}  ${clr(C.cyan,'+25 XP')}  (total: ${p.xp} XP)`;
    }
    case 'rm': {
      const id = parseInt(rest), idx = s.tasks.findIndex(t=>t.id===id);
      if (idx===-1) return `  Tarefa #${id} nao encontrada.`;
      s.tasks.splice(idx,1); saveSprint(s);
      return `  #${id} removida.`;
    }
    case 'sprint': {
      if (!rest) return '  Use: sprint <nome>';
      s.sprint = rest; s.tempoAtivoMs = 0; s.sessaoIniciadaEm = new Date().toISOString(); s.pausadoEm = null;
      APP.ov80 = false; APP.ov100 = false; APP.ov150 = false;
      saveSprint(s);
      const [n,t] = pick(RESP.sprint); pushMessage(n,t);
      return `${clr(C.green,'>')} Sprint "${rest}" iniciada!`;
    }
    case 'pausar': {
      if (!s.sessaoIniciadaEm) return '  Sprint ja pausada.';
      const el = Date.now() - new Date(s.sessaoIniciadaEm).getTime();
      s.tempoAtivoMs = (s.tempoAtivoMs||0) + el;
      s.sessaoIniciadaEm = null; s.pausadoEm = new Date().toISOString();
      saveSprint(s);
      const [n,t] = pick(RESP.pausar); pushMessage(n,t);
      return `${clr(C.yellow,'⏸')} Pausado. Tempo salvo: ${fmtMs(s.tempoAtivoMs)}`;
    }
    case 'retomar': {
      if (s.sessaoIniciadaEm) return '  Sprint ja ativa.';
      s.sessaoIniciadaEm = new Date().toISOString(); s.pausadoEm = null;
      saveSprint(s);
      const [n,t] = pick(RESP.retomar); pushMessage(n,t);
      return `${clr(C.green,'▶')} Sprint retomada.`;
    }
    case 'inicio': {
      if (s.sessaoIniciadaEm) { const el=Date.now()-new Date(s.sessaoIniciadaEm).getTime(); s.tempoAtivoMs=(s.tempoAtivoMs||0)+el; }
      s.sessaoIniciadaEm = new Date().toISOString(); s.pausadoEm = null;
      saveSprint(s); return `${clr(C.green,'▶')} Timer iniciado.`;
    }
    case 'estimativa': {
      const h = parseFloat(rest);
      if (isNaN(h)||h<=0) return '  Use: estimativa <horas>';
      s.estimativaHoras = h; saveSprint(s);
      APP.ov80=false; APP.ov100=false; APP.ov150=false;
      return `  Estimativa: ${h}h`;
    }
    case 'projeto': {
      if (!rest) return '  Use: projeto <pasta>';
      const pp = path.join(PROJECTS_DIR, rest);
      if (!fs.existsSync(pp)) return `  Pasta nao encontrada: projects/${rest}`;
      s.projetoAtual = rest; saveSprint(s);
      return `  Projeto ativo: ${rest}`;
    }
    case 'concluir': {
      if (!s.projetoAtual) return '  Nenhum projeto ativo.';
      const marker = path.join(PROJECTS_DIR, s.projetoAtual, '.concluido');
      if (fs.existsSync(marker)) return '  Projeto ja entregue.';
      const projPath = path.join(PROJECTS_DIR, s.projetoAtual);
      if (!fs.existsSync(path.join(projPath, 'node_modules')))
        return `  Execute "npm install" na pasta do projeto primeiro.`;
      const res = spawnSync('npm', ['test','--','--silent'], { cwd: projPath, encoding:'utf8', stdio:'pipe' });
      if (res.status !== 0) {
        pushMessage(NPC.qa, 'Entrega bloqueada — testes falhando. Corrige antes de entregar.');
        return clr(C.red,'  [QA] Bloqueado: testes nao passaram. Rode "npm test" no projeto.');
      }
      // Overtime penalty
      const ativo = tempoAtivoTotal(s);
      const estMs = s.estimativaHoras * 3600000;
      const ratio = ativo / estMs;
      const p2 = loadProgress();
      let penMsg = '';
      if (ratio > 2.0) {
        p2.xp = Math.max(0, p2.xp - 20); p2.atrasadas = (p2.atrasadas||0)+1; p2.avisos = (p2.avisos||0)+1;
        penMsg = clr(C.red,' (-20 XP — atraso grave, aviso registrado)');
        pushMessage(NPC.lead, 'Sprint muito acima do estimado. Precisamos conversar sobre planejamento.');
      } else if (ratio > 1.0) {
        p2.xp = Math.max(0, p2.xp - 10); p2.atrasadas = (p2.atrasadas||0)+1;
        penMsg = clr(C.yellow,' (-10 XP — entrega atrasada)');
        pushMessage(NPC.pm, 'Projeto entregue com atraso. Na proxima sprint vamos refinar melhor.');
      }
      saveProgress(p2);
      fs.writeFileSync(marker, new Date().toISOString());
      pushMessage(NPC.qa,   'Suite completa passou. Aprovado!');
      pushMessage(NPC.lead, `Entregue! Otimo trabalho, ${p2.name}.`);
      pushMessage(NPC.pm,   'Entrega registrada. Proximo projeto disponivel.');
      return clr(C.green,'★ ENTREGUE! Testes OK.') + penMsg;
    }
    case '': case undefined: return null;
    default: return `  Comando desconhecido: "${cmd}"`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  TICK & OVERTIME CHECK
// ─────────────────────────────────────────────────────────────────────────────

function tickEmpresa() {
  APP.frame++;
  APP.feedTick++;

  if (APP.frame % 3 === 0) {
    APP.spark.shift();
    APP.spark.push(Math.max(1, Math.min(10, APP.spark[APP.spark.length-1] + Math.floor((Math.random()-0.5)*3))));
    APP.reqPs = Math.max(200, Math.min(2000, APP.reqPs + Math.floor((Math.random()-0.5)*60)));
    APP.lat   = Math.max(5, Math.min(150, APP.lat + Math.floor((Math.random()-0.5)*4)));
  }

  if (APP.frame % 20 === 0) {
    for (const k of Object.keys(APP.metricas))
      APP.metricas[k] = Math.max(5, Math.min(95, APP.metricas[k] + Math.floor((Math.random()-0.5)*5)));
  }

  if (APP.feedTick >= 300) {
    APP.feedTick = 0;
    const [npc,msg] = MSGS_AMBIENTE[Math.floor(Math.random()*MSGS_AMBIENTE.length)];
    pushFeed(npc, msg);
  }

  // Incidente
  if (!APP.incAtivo && APP.frame % 2400 === 0) {
    APP.incIdx = Math.floor(Math.random() * INCIDENTES.length);
    const [npc,msg] = INCIDENTES[APP.incIdx];
    pushFeed(npc, msg, 'alerta');
    APP.incAtivo = true;
    setTimeout(() => {
      const [npc2,msg2] = RESOLUCOES[APP.incIdx];
      pushFeed(npc2, msg2, 'ok');
      APP.incAtivo = false;
    }, 60000 + Math.random()*60000);
  }

  // XP change detection
  const p = loadProgress();
  if (APP._xpPrev !== undefined && p.xp > APP._xpPrev)
    pushFeed(NPC.lead, `+${p.xp - APP._xpPrev} XP ganho. Total: ${p.xp} XP.`, 'ok');
  APP._xpPrev = p.xp;
}

function checkOvertime() {
  const s = loadSprint();
  if (!s || !s.sessaoIniciadaEm) return;
  const ativo = tempoAtivoTotal(s);
  const estMs = s.estimativaHoras * 3600000;
  const pct   = ativo / estMs;

  if (pct >= 0.8 && !APP.ov80) {
    APP.ov80 = true;
    pushMessage(NPC.pm, 'Atencao! Sprint chegando ao limite. Quanto falta?');
    if (APP.screen === 'sprint') APP.lastFb = clr(C.yellow,'⚡ 80% do tempo estimado usado. Foco!');
  }
  if (pct >= 1.0 && !APP.ov100) {
    APP.ov100 = true;
    pushMessage(NPC.lead, 'Sprint estourada. O que aconteceu? Me fala.');
    pushMessage(NPC.qa, 'Vou pausar regressao ate a sprint fechar.');
    if (APP.screen === 'sprint') APP.lastFb = clr(C.red,'⚠ SPRINT ESTOURADA. Penalidade de XP na entrega.');
  }
  if (pct >= 1.5 && !APP.ov150) {
    APP.ov150 = true;
    pushMessage(NPC.pm, 'Cliente perguntando sobre o prazo. Consegue prever?');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  RENDER LOOP
// ─────────────────────────────────────────────────────────────────────────────

function render() {
  let out = '';
  switch (APP.screen) {
    case 'menu':     out = buildMenu();    break;
    case 'empresa':  out = buildEmpresa(); break;
    case 'sprint':   out = buildSprint(loadSprint()); break;
    case 'dev':      out = buildDev();     break;
    case 'projetos': out = buildProjetos(); break;
    case 'aulas':    out = buildAulas();   break;
  }
  process.stdout.write(out);
}

// ─────────────────────────────────────────────────────────────────────────────
//  INPUT
// ─────────────────────────────────────────────────────────────────────────────

function goTo(screen) {
  APP.screen   = screen;
  APP.inputBuf = '';
  APP.lastFb   = null;
  if (screen === 'aulas') { APP.aulaLines = []; APP.aulasScroll = 0; }
}

if (!process.stdin.isTTY) {
  console.error('\n  DevTech requer um terminal interativo.\n  Execute: node devtech.js\n');
  process.exit(1);
}

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (key) => {
  if (key === '\x03') { gracefulExit(); return; }     // Ctrl+C
  if (key === '\x1b') { goTo('menu'); render(); return; } // Esc

  // Number shortcuts from menu
  const n = parseInt(key);
  if (APP.screen === 'menu' && n >= 1 && n <= 5) {
    APP.menuSel = n - 1;
    goTo(['empresa','sprint','dev','projetos','aulas'][n-1]);
    render(); return;
  }

  switch (APP.screen) {
    case 'menu':     handleMenuKey(key); break;
    case 'sprint':   handleSprintKey(key); break;
    case 'dev':      handleDevKey(key); break;
    case 'projetos': render(); break;
    case 'aulas':    handleAulasKey(key); break;
    case 'empresa':  render(); break;
  }
});

function handleMenuKey(key) {
  if (key === '\x1b[A' || key === 'k') APP.menuSel = (APP.menuSel + MENU_ITEMS.length - 1) % MENU_ITEMS.length;
  if (key === '\x1b[B' || key === 'j') APP.menuSel = (APP.menuSel + 1) % MENU_ITEMS.length;
  if (key === '\r') goTo(['empresa','sprint','dev','projetos','aulas'][APP.menuSel]);
  render();
}

function handleSprintKey(key) {
  if (key === '\r') {
    const s = loadSprint();
    if (APP.inputBuf.trim()) {
      APP.lastFb = sprintCommand(APP.inputBuf, s);
    }
    APP.inputBuf = '';
  } else if (key === '\x7f' || key === '\x08') {
    APP.inputBuf = APP.inputBuf.slice(0, -1);
  } else if (key.charCodeAt(0) >= 32) {
    APP.inputBuf += key;
  }
  render();
}

function handleDevKey(key) {
  if (key === '\r') {
    if (APP.inputBuf.trim()) {
      const parts = APP.inputBuf.trim().split(/\s+/);
      if (parts[0] === 'name' && parts[1]) {
        const p = loadProgress(); p.name = parts.slice(1).join(' '); saveProgress(p);
        APP.lastFb = `Nome atualizado: ${p.name}`;
      }
    }
    APP.inputBuf = '';
  } else if (key === '\x7f' || key === '\x08') {
    APP.inputBuf = APP.inputBuf.slice(0, -1);
  } else if (key.charCodeAt(0) >= 32) {
    APP.inputBuf += key;
  }
  render();
}

function handleAulasKey(key) {
  if (key === '\x1b[A' || key === 'k') APP.aulasScroll = Math.max(0, APP.aulasScroll - 1);
  if (key === '\x1b[B' || key === 'j') APP.aulasScroll++;
  if (key === '\x1b[5~') APP.aulasScroll = Math.max(0, APP.aulasScroll - 10); // PgUp
  if (key === '\x1b[6~') APP.aulasScroll += 10;                                // PgDn
  render();
}

// ─────────────────────────────────────────────────────────────────────────────
//  BOOT
// ─────────────────────────────────────────────────────────────────────────────

function boot() {
  const steps = [
    { msg: 'Verificando integridade do sistema...', pct: 15 },
    { msg: 'Carregando perfil do desenvolvedor...', pct: 30 },
    { msg: 'Conectando ao repositorio de projetos...', pct: 50 },
    { msg: 'Sincronizando estado da sprint...', pct: 68 },
    { msg: 'Inicializando monitor corporativo...', pct: 85 },
    { msg: 'Sistema pronto.', pct: 100 },
  ];

  function barra(pct, w=34) {
    const f = Math.round((pct/100)*w);
    return `${C.cyan}${'█'.repeat(f)}${C.gray}${'░'.repeat(w-f)}${C.reset}`;
  }

  function frame(idx) {
    const sp = SPIN[Math.floor(Date.now()/80)%SPIN.length];
    let o = C.cls;
    o += '\n\n';
    o += `  ${C.cyan}${C.bold}`;
    o += '  ██████╗ ███████╗██╗   ██╗████████╗███████╗ ██████╗██╗  ██╗\n';
    o += '  ██╔══██╗██╔════╝██║   ██║╚══██╔══╝██╔════╝██╔════╝██║  ██║\n';
    o += '  ██║  ██║█████╗  ██║   ██║   ██║   █████╗  ██║     ███████║\n';
    o += '  ██║  ██║██╔══╝  ╚██╗ ██╔╝   ██║   ██╔══╝  ██║     ██╔══██║\n';
    o += '  ██████╔╝███████╗ ╚████╔╝    ██║   ███████╗╚██████╗██║  ██║\n';
    o += '  ╚═════╝ ╚══════╝  ╚═══╝     ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝\n';
    o += `${C.reset}\n`;
    o += `  ${C.bold}SISTEMAS S.A.${C.reset}  ${C.gray}─  Plataforma de Treinamento v3.0.0${C.reset}\n`;
    o += `  ${C.gray}${'─'.repeat(56)}${C.reset}\n\n`;
    for (let i=0; i<steps.length; i++) {
      if (i < idx)       o += `  ${C.green}✓${C.reset}  ${C.gray}${steps[i].msg}${C.reset}\n`;
      else if (i === idx) o += `  ${C.cyan}${sp}${C.reset}  ${steps[i].msg}\n`;
      else               o += `  ${C.gray}·  ${steps[i].msg}${C.reset}\n`;
    }
    const pct = steps[Math.min(idx, steps.length-1)].pct;
    o += `\n  [${barra(pct)}]  ${C.bold}${String(pct).padStart(3)}%${C.reset}\n\n`;
    process.stdout.write(o);
  }

  return new Promise(resolve => {
    let i = 0;
    // Auto-pause previous open session
    const s = loadSprint();
    if (s?.sessaoIniciadaEm) {
      const el = Date.now() - new Date(s.sessaoIniciadaEm).getTime();
      s.tempoAtivoMs = (s.tempoAtivoMs||0) + el;
      s.sessaoIniciadaEm = null; s.pausadoEm = new Date().toISOString();
      saveSprint(s);
    }
    const iv = setInterval(() => {
      frame(i); i++;
      if (i >= steps.length) { clearInterval(iv); setTimeout(resolve, 600); }
    }, 320);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  GRACEFUL EXIT
// ─────────────────────────────────────────────────────────────────────────────

function gracefulExit() {
  const s = loadSprint();
  if (s?.sessaoIniciadaEm) {
    const el = Date.now() - new Date(s.sessaoIniciadaEm).getTime();
    s.tempoAtivoMs = (s.tempoAtivoMs||0) + el;
    s.sessaoIniciadaEm = null; s.pausadoEm = new Date().toISOString();
    saveSprint(s);
  }
  process.stdout.write(C.show + '\n\n  Até mais, Dev. Sprint salva.\n\n');
  process.exit(0);
}

process.on('exit', () => process.stdout.write(C.show));
process.on('SIGTERM', () => gracefulExit());

// ─────────────────────────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────────────────────────

process.stdout.write(C.hide);
APP._xpPrev = loadProgress().xp;

boot().then(() => {
  pushFeed(NPC.ops, `Sistema iniciado. Bem-vindo, ${loadProgress().name}.`, 'ok');
  pushFeed(NPC.lead, 'Foco nas entregas. Bom trabalho hoje.');

  render();

  // Main loop: 150ms — animações suaves
  setInterval(() => {
    APP.frame++;
    tickEmpresa();
    checkOvertime();
    if (APP.screen === 'empresa' || APP.screen === 'menu') render();
  }, 150);
});
