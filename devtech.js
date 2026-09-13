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
  magenta: '\x1b[35m',
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
  const trunc = truncateVisible(str, INN);
  const s = stripAnsi(trunc);
  const pad = Math.max(0, INN - s.length);
  return `║ ${trunc}${' '.repeat(pad)} ║`;
}

function cen(str) {
  const trunc = truncateVisible(str, INN);
  const s = stripAnsi(trunc);
  const lp = Math.max(0, Math.floor((INN - s.length) / 2));
  const rp = Math.max(0, INN - s.length - lp);
  return `║ ${' '.repeat(lp)}${trunc}${' '.repeat(rp)} ║`;
}

function stripAnsi(s) {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

// Trunca `str` para no máximo `maxLen` caracteres VISÍVEIS, preservando
// os códigos ANSI de cor intactos (para não quebrar a formatação nem a
// largura da linha quando o conteúdo — nome, tarefa, mensagem — é maior
// que o espaço interno da caixa).
function truncateVisible(str, maxLen) {
  if (stripAnsi(str).length <= maxLen) return str;
  let out = '', visible = 0, i = 0;
  while (i < str.length && visible < maxLen) {
    if (str[i] === '\x1b') {
      const m = str.slice(i).match(/^\x1b\[[0-9;]*m/);
      if (m) { out += m[0]; i += m[0].length; continue; }
    }
    out += str[i]; visible++; i++;
  }
  return out + C.reset;
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

// sprintDias = duracao padrao da sprint (calendario) pra projetos desse
// nivel. Nao tem por que um projeto simples de Estagiario levar os mesmos
// 15 dias corridos de um projeto de Senior — a complexidade cresce com o
// nivel, entao o prazo cresce junto.
const LEVELS = [
  { name: 'Estagiário', xpMin: 0,    xpMax: 149,  salary: 'R$ 800–R$ 1.500',     folder: 'estagiario', fase: 1,  sprintDias: 7  },
  { name: 'Trainee',    xpMin: 150,  xpMax: 349,  salary: 'R$ 2.000–R$ 3.500',   folder: 'trainee',    fase: 2,  sprintDias: 7  },
  { name: 'Junior I',   xpMin: 350,  xpMax: 599,  salary: 'R$ 3.000–R$ 4.500',   folder: 'junior-1',   fase: 3,  sprintDias: 10 },
  { name: 'Junior II',  xpMin: 600,  xpMax: 899,  salary: 'R$ 4.000–R$ 5.500',   folder: 'junior-2',   fase: 5,  sprintDias: 10 },
  { name: 'Junior III', xpMin: 900,  xpMax: 1249, salary: 'R$ 5.000–R$ 7.000',   folder: 'junior-3',   fase: 6,  sprintDias: 10 },
  { name: 'Pleno I',    xpMin: 1250, xpMax: 1649, salary: 'R$ 6.500–R$ 9.000',   folder: 'pleno-1',    fase: 7,  sprintDias: 12 },
  { name: 'Pleno II',   xpMin: 1650, xpMax: 2099, salary: 'R$ 8.500–R$ 11.000',  folder: 'pleno-2',    fase: 8,  sprintDias: 12 },
  { name: 'Pleno III',  xpMin: 2100, xpMax: 2599, salary: 'R$ 10.000–R$ 14.000', folder: 'pleno-3',    fase: 9,  sprintDias: 12 },
  { name: 'Sênior I',   xpMin: 2600, xpMax: 3149, salary: 'R$ 13.000–R$ 17.000', folder: 'senior-1',   fase: 11, sprintDias: 15 },
  { name: 'Sênior II',  xpMin: 3150, xpMax: 3749, salary: 'R$ 16.000–R$ 22.000', folder: 'senior-2',   fase: 13, sprintDias: 15 },
  { name: 'Sênior III', xpMin: 3750, xpMax: null, salary: 'R$ 20.000–R$ 30.000+',folder: 'senior-3',   fase: 14, sprintDias: 15 },
];

function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--)
    if (xp >= LEVELS[i].xpMin) return { lv: LEVELS[i], idx: i };
  return { lv: LEVELS[0], idx: 0 };
}

const PROGRESS_DEFAULT = { name: 'Dev', xp: 0, avisos: 0, atrasadas: 0, ultimoAcessoEm: null, diasSeguidos: 0, diasFaltados: 0 };

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return { ...PROGRESS_DEFAULT };
  try {
    const p = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    for (const k of Object.keys(PROGRESS_DEFAULT)) if (!(k in p)) p[k] = PROGRESS_DEFAULT[k];
    return p;
  } catch { return { ...PROGRESS_DEFAULT }; }
}

function saveProgress(p) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2)); }

function loadSprint() {
  if (!fs.existsSync(SPRINT_FILE)) {
    const init = { sprint: 'Sprint 1', nextId: 1, tasks: [], tempoAtivoMs: 0,
      sessaoIniciadaEm: null, pausadoEm: null, estimativaHoras: 2, projetoAtual: null,
      extensoesQA: 0, sprintIniciadaEm: null, prazoDias: 15, tarefaAtivaId: null,
      nextPr: 1, ciRuns: [] };
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
    if (!('extensoesQA'      in d)) d.extensoesQA      = 0;
    if (!('sprintIniciadaEm' in d)) d.sprintIniciadaEm = null;
    if (!('prazoDias'        in d)) d.prazoDias        = 15;
    if (!('tarefaAtivaId'    in d)) d.tarefaAtivaId    = null;
    if (!('nextPr'           in d)) d.nextPr           = 1;
    if (!('ciRuns'           in d)) d.ciRuns           = [];
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
  screen:    'menu',    // menu | empresa | sprint | dev | projetos | aulas | github
  menuSel:   0,
  frame:     0,
  inputBuf:  '',
  lastFb:    null,      // sprint feedback
  aulasScroll: 0,
  aulaLines: [],
  projetosScroll: 0,
  projView: 'list',        // list | readme
  projIndice: [],
  projReadmeAtual: null,
  readmeLines: [],
  readmeScroll: 0,
  githubTab: 'issues',     // issues | prs | actions
  githubScroll: 0,

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
  { key:'6', label:'GitHub (simulado)',         desc:'Issues, Pull Requests e Actions'  },
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
  const hora   = horaAtual();
  const tarefa = s.tarefaAtivaId ? s.tasks.find(t => t.id === s.tarefaAtivaId) : null;

  // o cronometro e por tarefa (o QA passa uma coisa de cada vez) — sem
  // tarefa ativa, nao tem o que medir.
  if (!tarefa)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.gray,'—')} nenhuma tarefa em andamento — "start <nº>" pra começar`;

  const ativo   = tempoAtivoTotal(s);
  const est     = tarefa.estimativaHoras || s.estimativaHoras;
  const estMs   = est * 3600000;
  const pausado = !s.sessaoIniciadaEm;
  const pct     = ativo / estMs;
  const rot     = `#${tarefa.id}: `;

  if (pausado)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.yellow,'⏸ PAUSADO')} — ${rot}${fmtMs(ativo)} / ${est}h`;

  if (pct >= 2.0)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.red,'⚠ CRÍTICO')}: ${rot}${fmtMs(ativo)} / ${est}h  (+${fmtMs(ativo-estMs)})`;

  if (pct >= 1.0)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.red,'⚠ ESTOURADO')}: ${rot}${fmtMs(ativo)} / ${est}h  (+${fmtMs(ativo-estMs)})`;

  if (pct >= 0.8)
    return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.yellow,'⚡')} ${rot}${fmtMs(ativo)} / ${est}h  (faltam ${fmtMs(estMs-ativo)})`;

  return `${clr(C.gray,'Hora:')} ${hora}  ${clr(C.green,'▶')} ${rot}${fmtMs(ativo)} / ${est}h  (faltam ${clr(C.cyan,fmtMs(estMs-ativo))})`;
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
  o += row(bold(clr(C.cyan, '  ██████╗ ███████╗██╗   ██╗████████╗███████╗ ██████╗██╗  ██╗'))) + '\n';
  o += row(clr(C.cyan, '  ██╔══██╗██╔════╝██║   ██║╚══██╔══╝██╔════╝██╔════╝██║  ██║')) + '\n';
  o += row(clr(C.cyan, '  ██║  ██║█████╗  ██║   ██║   ██║   █████╗  ██║     ███████║')) + '\n';
  o += row(clr(C.cyan, '  ██║  ██║██╔══╝  ╚██╗ ██╔╝   ██║   ██╔══╝  ██║     ██╔══██║')) + '\n';
  o += row(clr(C.cyan, '  ██████╔╝███████╗ ╚████╔╝    ██║   ███████╗╚██████╗██║  ██║')) + '\n';
  o += row(clr(C.cyan, '  ╚═════╝ ╚══════╝  ╚═══╝     ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝')) + '\n';
  o += cen(clr(C.gray, 'S I S T E M A S   S . A .   —   Sistema de Treinamento')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${bold(p.name)} ${clr(C.gray,'│')} ${clr(C.yellow,lv.name)} ${clr(C.gray,'│')} XP: ${clr(C.cyan,String(p.xp))}/${lv.xpMax !== null ? lv.xpMax+1 : 'MAX'} ${clr(C.gray,'│')} ${proj.concluidos}/${proj.total} proj ${clr(C.gray,'│')} ${clr(C.cyan,horaAtual())}`) + '\n';
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
  o += row(dim(`  ↑↓  mover   Enter  entrar   1-6  atalho   Ctrl+C  sair`)) + '\n';
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

  // orcamento fixo de 6 linhas — mensagem comprida quebra em ate 2 linhas,
  // e se nao couber tudo, prioriza as mais recentes (por isso monta de tras pra frente)
  const BUDGET_FEED = 6;
  const gruposFeed = [];
  let totalFeed = 0;
  for (const item of [...exibir].reverse()) {
    const pfx     = item.tipo==='alerta' ? clr(C.yellow,'⚠') : item.tipo==='ok' ? clr(C.green,'✓') : ' ';
    const prefixo = ` ${pfx} ${clr(C.gray,item.hora)}  ${item.tag}  `;
    const linhas  = wrapPrefixedColored(prefixo, item.msg, INN, 2);
    if (totalFeed + linhas.length > BUDGET_FEED) break;
    gruposFeed.push(linhas);
    totalFeed += linhas.length;
  }
  gruposFeed.reverse();
  const linhasFeed = gruposFeed.flat();
  for (const ln of linhasFeed) o += row(ln) + '\n';
  for (let i = linhasFeed.length; i < BUDGET_FEED; i++) o += row('') + '\n';

  o += `╠${LINE}╣\n`;
  o += row(dim('  Esc  voltar ao menu   Enter  atualizar')) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

// ── SPRINT ───────────────────────────────────────────────────────────────────

function buildSprint(s) {
  const p        = loadProgress();
  const backlog  = s.tasks.filter(t => t.status==='backlog');
  const doing    = s.tasks.filter(t => t.status==='doing');
  const revisao  = s.tasks.filter(t => t.status==='revisao');
  const done     = s.tasks.filter(t => t.status==='done');
  const rows     = Math.max(backlog.length, doing.length, revisao.length, done.length, 1);
  const pausado  = !s.sessaoIniciadaEm;
  const COL      = 18;   // 4 colunas de 18 + 3 separadores "│" + 1 indent = 76 = INN
  const msgs     = loadMessages().slice(-3);
  // troca a cada 15s de tempo REAL, nao a cada frame — como a tela agora
  // redesenha sozinha (150ms), usar APP.frame direto fazia a mensagem
  // ambiente trocar a cada tick, parecendo um monte de mensagem piscando.
  const aMsg     = MSGS_AMBIENTE[Math.floor(Date.now() / 15000) % MSGS_AMBIENTE.length];

  // sprint de verdade: prazo em dias corridos, roda mesmo com o app fechado
  const diasRestantes = s.sprintIniciadaEm
    ? Math.max(0, (s.prazoDias||15) - Math.floor((Date.now()-new Date(s.sprintIniciadaEm).getTime())/86400000))
    : null;

  function cell(task, col) {
    if (!task) return ' '.repeat(col);
    const s2 = `[${task.id}] ${task.title}`;
    return (s2.length > col ? s2.slice(0,col-1)+'…' : s2).padEnd(col);
  }

  function comSufixo(task, sufixo) {
    if (!task) return ' '.repeat(COL);
    const s2 = `[${task.id}] ${task.title}${sufixo}`;
    return (s2.length > COL ? s2.slice(0,COL-1)+'…' : s2).padEnd(COL);
  }

  function doingCell(task) {
    if (!task) return ' '.repeat(COL);
    const suf = pausado ? ' (pausado)' : ` (${Math.floor((Date.now()-new Date(task.startedAt||Date.now()).getTime())/60000)}m)`;
    return comSufixo(task, suf);
  }

  function revisaoCell(task) {
    if (!task) return ' '.repeat(COL);
    const min = Math.floor((Date.now()-new Date(task.enviadoRevisaoEm||Date.now()).getTime())/60000);
    return comSufixo(task, ` ⏳${min>0?min+'m':''}`);
  }

  // pad ANTES de colorir, pra não contar os códigos ANSI como largura
  function padVisible(str, width) {
    return str + ' '.repeat(Math.max(0, width - stripAnsi(str).length));
  }

  function quadroRow(a, b, c, d) { return row(` ${a}│${b}│${c}│${d}`); }

  const sepLine = clr(C.gray, '─'.repeat(COL) + '┼' + '─'.repeat(COL) + '┼' + '─'.repeat(COL) + '┼' + '─'.repeat(COL));

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += row(` ${bold('DEVTECH SISTEMAS S.A.')}  ${' '.repeat(26)}Dev: ${bold(p.name)}  XP: ${clr(C.cyan,String(p.xp))}`) + '\n';
  o += row(` Sprint: ${bold(s.sprint)}${pausado ? '  '+clr(C.yellow,'[PAUSADO]') : ''}  ${s.projetoAtual ? clr(C.gray,'  proj: '+s.projetoAtual) : ''}`) + '\n';
  if (diasRestantes !== null) {
    const cor = diasRestantes <= 2 ? C.red : diasRestantes <= 5 ? C.yellow : C.green;
    const ext = s.extensoesQA > 0 ? clr(C.gray, `  (${s.extensoesQA} reestimativa(s))`) : '';
    o += row(` ${clr(C.gray,'Prazo:')} ${clr(cor, `${diasRestantes} dia${diasRestantes===1?'':'s'} restante${diasRestantes===1?'':'s'}`)} de ${s.prazoDias||15} corridos${ext}`) + '\n';
  }
  o += row(` ${timerLine(s)}`) + '\n';
  o += `╠${LINE}╣\n`;
  o += quadroRow(
    padVisible(bold(clr(C.cyan,'BACKLOG')), COL),
    padVisible(bold(clr(C.yellow,'DESENVOLV.')), COL),
    padVisible(bold(clr(C.magenta,'EM REVISÃO')), COL),
    bold(clr(C.green,'CONCLUÍDO')),
  ) + '\n';
  o += row(` ${sepLine}`) + '\n';
  for (let i = 0; i < rows; i++) {
    const bd = cell(backlog[i], COL);
    const dd = doingCell(doing[i]);
    const rv = revisaoCell(revisao[i]);
    const dn = cell(done[i], COL);
    o += quadroRow(
      bd,
      doing[i]   ? clr(C.yellow,dd)  : dd,
      revisao[i] ? clr(C.magenta,rv) : rv,
      done[i]    ? clr(C.green,dn)   : dn,
    ) + '\n';
  }
  o += `╠${LINE}╣\n`;
  o += row(bold(' MENSAGENS')) + '\n';
  o += `╠${LINE}╣\n`;
  const linhaMsg = (tag, texto) =>
    wrapPrefixedColored('', `${tag} ${texto}`, INN - 1, 2)
      .map(l => row(` ${clr(C.gray, l)}`)).join('\n');
  if (msgs.length === 0) {
    o += linhaMsg(aMsg[0].tag, aMsg[1]) + '\n';
  } else {
    for (const m of msgs) o += linhaMsg(m.tag, m.texto) + '\n';
    o += linhaMsg(aMsg[0].tag, aMsg[1]) + '\n';
  }
  o += `╠${LINE}╣\n`;
  if (APP.lastFb) o += row(` ${APP.lastFb}`) + '\n', o += `╠${LINE}╣\n`;
  o += row(dim('  projeto  (pega o próximo da sua fila)')) + '\n';
  o += row(dim('  ver/start/revisar/rm <nº>   pausar   retomar   concluir')) + '\n';
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
  o += row(`  ${clr(C.gray,'Prática diária')}   ${clr(C.cyan,String(p.diasSeguidos||0))} dia(s) seguido(s)${p.diasFaltados>0?clr(C.gray,`  (${p.diasFaltados} perdido(s) ao todo)`):''}`) + '\n';
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
    for (const m of msgs) {
      const linhas = wrapPrefixedColored(clr(C.gray, `${m.tag} `), m.texto, INN - 1, 2);
      for (const l of linhas) o += row(` ${l}`) + '\n';
    }
  o += `╠${LINE}╣\n`;
  o += row(dim('  name <seu nome>   Enter atualizar   Esc voltar')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${clr(C.cyan,'>')} ${APP.inputBuf}${clr(C.gray,'█')}`) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

// ── PROJETOS ─────────────────────────────────────────────────────────────────

function getProjectStatus(nivel, proj, atual) {
  const pp = path.join(PROJECTS_DIR, nivel, proj);
  if (fs.existsSync(path.join(pp, '.concluido')))   return { icon: clr(C.green,'✓'), label: 'ENTREGUE',     cor: C.green  };
  if (atual && atual.includes(proj))                return { icon: clr(C.yellow,'⚙'), label: 'EM ANDAMENTO', cor: C.yellow };
  return { icon: clr(C.gray,'○'), label: 'PENDENTE',     cor: C.gray   };
}

function buildProjetos() {
  if (APP.projView === 'readme') return buildProjetoReadme();

  const sprint = loadSprint();
  const atual  = sprint?.projetoAtual || null;
  const proj   = contarProjetos();

  const lines = [];
  const indice = [];   // mapeia numero exibido → { nivel, pj }
  if (!fs.existsSync(PROJECTS_DIR)) {
    lines.push(clr(C.gray,'  Nenhum projeto encontrado.'));
  } else {
    for (const nivel of fs.readdirSync(PROJECTS_DIR).sort()) {
      const np = path.join(PROJECTS_DIR, nivel);
      if (!fs.statSync(np).isDirectory()) continue;
      const lv = LEVELS.find(l => l.folder === nivel);
      lines.push(`  ${bold(clr(C.cyan, (lv ? lv.name : nivel).padEnd(12)))}`);
      for (const pj of fs.readdirSync(np).sort()) {
        const pp = path.join(np, pj);
        if (!fs.statSync(pp).isDirectory()) continue;
        const st = getProjectStatus(nivel, pj, atual);
        indice.push({ nivel, pj });
        const num = String(indice.length).padStart(2,'0');
        lines.push(`  ${clr(C.gray,num)}  ${st.icon}  ${clr(st.cor, pj.padEnd(34))} ${clr(st.cor, st.label)}`);
      }
    }
  }
  APP.projIndice = indice;

  const visible = 18;
  const total   = lines.length;
  const scroll  = Math.max(0, Math.min(APP.projetosScroll, Math.max(0, total - visible)));
  APP.projetosScroll = scroll;

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold('DEVTECH SISTEMAS S.A.  ─  Quadro de Projetos')) + '\n';
  o += row(` ${clr(C.green,String(proj.concluidos))}/${proj.total} projetos entregues  ${xpBar(proj.concluidos, {xpMin:0,xpMax:proj.total-1}, 30)}`) + '\n';
  if (total > visible)
    o += row(dim(`  [${scroll+1}-${Math.min(scroll+visible,total)} de ${total}]`)) + '\n';
  o += `╠${LINE}╣\n`;

  const slice = lines.slice(scroll, scroll + visible);
  for (const ln of slice) o += row(ln) + '\n';
  for (let i = slice.length; i < visible; i++) o += row('') + '\n';

  o += `╠${LINE}╣\n`;
  if (APP.lastFb) { o += row(` ${APP.lastFb}`) + '\n'; o += `╠${LINE}╣\n`; }
  o += row(dim('  ↑↓  rolar   PgUp/PgDn  página   Nº + Enter  ler README   Esc  voltar')) + '\n';
  o += `╠${LINE}╣\n`;
  o += row(` ${clr(C.cyan,'>')} ${APP.inputBuf}${clr(C.gray,'█')}`) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

// ── README do projeto ───────────────────────────────────────────────────────

function buildProjetoReadme() {
  const { nivel, pj } = APP.projReadmeAtual || {};
  const lv = LEVELS.find(l => l.folder === nivel);

  const visible = 24;
  const total   = APP.readmeLines.length;
  const scroll  = Math.max(0, Math.min(APP.readmeScroll, Math.max(0, total - visible)));
  APP.readmeScroll = scroll;

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold(`README  ─  ${pj || '?'}`)) + '\n';
  o += row(dim(`  ${lv ? lv.name : nivel}   [${scroll+1}-${Math.min(scroll+visible,total)} de ${total}]`)) + '\n';
  o += `╠${LINE}╣\n`;

  const slice = APP.readmeLines.slice(scroll, scroll + visible);
  for (const ln of slice) o += row(' ' + ln) + '\n';
  for (let i = slice.length; i < visible; i++) o += row('') + '\n';

  o += `╠${LINE}╣\n`;
  o += row(dim('  ↑↓  rolar   PgUp/PgDn  página   Esc  voltar ao quadro')) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

// ── MARKDOWN → TERMINAL ─────────────────────────────────────────────────────
// Só reformata para EXIBIÇÃO dentro do simulador — o arquivo README.md em
// disco não é tocado, então quem preferir abrir/ler o .md puro continua
// vendo o markdown normal (editor, cat, GitHub etc.).

const MD_WIDTH = 68;

function wrapWords(text, width) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = [], curLen = 0;
  for (const w of words) {
    const add = curLen === 0 ? w.length : curLen + 1 + w.length;
    if (add > width && curLen > 0) { lines.push(cur.join(' ')); cur = [w]; curLen = w.length; }
    else { cur.push(w); curLen = add; }
  }
  if (cur.length) lines.push(cur.join(' '));
  return lines.length ? lines : [''];
}

// Mensagem maior que a largura disponível? Em vez de cortar, quebra em até
// `maxLines` linhas — a primeira com `prefixColored` (pode já vir colorido,
// só a largura visível dele importa pro cálculo), as seguintes indentadas
// na mesma coluna onde o texto começou.
function wrapPrefixedColored(prefixColored, body, width, maxLines) {
  const plainLen = stripAnsi(prefixColored).length;
  const avail    = Math.max(10, width - plainLen);
  let chunks = wrapWords(body, avail);
  if (chunks.length > maxLines) {
    chunks = chunks.slice(0, maxLines);
    chunks[maxLines - 1] = chunks[maxLines - 1] + '…';
  }
  const indent = ' '.repeat(plainLen);
  return chunks.map((c, i) => (i === 0 ? prefixColored + c : indent + c));
}

// Aplica negrito/itálico/código/links inline (markdown) usando ANSI.
function mdInline(text) {
  return text
    .replace(/`([^`]+)`/g,        (_, c) => clr(C.yellow, c))
    .replace(/\*\*([^*]+)\*\*/g,  (_, b) => bold(b))
    .replace(/__([^_]+)__/g,      (_, b) => bold(b))
    .replace(/\*([^*]+)\*/g,      (_, i) => dim(i))
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => clr(C.cyan, t) + ' ' + clr(C.gray, `(${u})`));
}

// Quebra `text` em linhas de até `width` (medindo texto puro) e prefixa a
// primeira com `prefix` (colorido) e as demais com espaços do mesmo tamanho.
function mdBlock(text, prefix, width) {
  const indent = ' '.repeat(stripAnsi(prefix).length);
  return wrapWords(text, Math.max(10, width - stripAnsi(prefix).length))
    .map((ln, i) => (i === 0 ? prefix : indent) + mdInline(ln));
}

function renderMarkdown(raw) {
  const out = [];
  let paragrafo = [];
  let emCodigo = false;
  let codigo = [];

  function flush() {
    if (!paragrafo.length) return;
    const texto = paragrafo.join(' ').trim();
    paragrafo = [];
    if (!texto) return;
    for (const ln of wrapWords(texto, MD_WIDTH)) out.push(mdInline(ln));
  }

  for (const raw2 of raw.split('\n')) {
    const hardBreak = /  $/.test(raw2);   // duas espacos no fim = quebra de linha do markdown
    const ln = raw2.replace(/\s+$/, '');
    const fence = ln.match(/^```/);

    if (fence) {
      if (!emCodigo) {
        flush();
        emCodigo = true; codigo = [];
        out.push(clr(C.gray, '  ┌' + '─'.repeat(MD_WIDTH - 2)));
      } else {
        for (const cl of codigo) out.push(clr(C.green, '  │ ') + clr(C.green, cl));
        out.push(clr(C.gray, '  └' + '─'.repeat(MD_WIDTH - 2)));
        emCodigo = false;
      }
      continue;
    }
    if (emCodigo) { codigo.push(ln.length > MD_WIDTH - 4 ? ln.slice(0, MD_WIDTH - 5) + '…' : ln); continue; }

    if (ln.trim() === '')                     { flush(); out.push(''); continue; }
    if (/^-{3,}$/.test(ln.trim()))             { flush(); out.push(clr(C.gray, '─'.repeat(MD_WIDTH))); continue; }

    let m;
    if (m = ln.match(/^#\s+(.*)/))             { flush(); out.push(''); out.push(bold(clr(C.cyan, mdInline(m[1])))); out.push(clr(C.cyan, '═'.repeat(Math.min(MD_WIDTH, stripAnsi(mdInline(m[1])).length)))); continue; }
    if (m = ln.match(/^##\s+(.*)/))            { flush(); out.push(''); out.push(bold(clr(C.cyan, '▎ ' + mdInline(m[1])))); continue; }
    if (m = ln.match(/^###\s+(.*)/))           { flush(); out.push(''); out.push(bold(clr(C.yellow, '• ' + mdInline(m[1])))); continue; }
    if (m = ln.match(/^>\s?(.*)/))             { flush(); out.push(...mdBlock(m[1], clr(C.gray, '  │ '), MD_WIDTH)); continue; }
    if (m = ln.match(/^[-*]\s+\[ \]\s+(.*)/))  { flush(); out.push(...mdBlock(m[1], clr(C.gray, '  ○ '), MD_WIDTH)); continue; }
    if (m = ln.match(/^[-*]\s+\[x\]\s+(.*)/i)) { flush(); out.push(...mdBlock(m[1], clr(C.green, '  ✓ '), MD_WIDTH)); continue; }
    if (m = ln.match(/^[-*]\s+(.*)/))          { flush(); out.push(...mdBlock(m[1], clr(C.cyan, '  • '), MD_WIDTH)); continue; }
    if (m = ln.match(/^(\d+)\.\s+(.*)/))       { flush(); out.push(...mdBlock(m[2], clr(C.cyan, `  ${m[1]}. `), MD_WIDTH)); continue; }

    paragrafo.push(ln);
    if (hardBreak) flush();   // quebra de linha explicita do markdown: nao junta com a proxima
  }
  flush();
  return out;
}

function abrirReadme(num) {
  const entry = APP.projIndice?.[num - 1];
  if (!entry) return `  Projeto nº ${num} não encontrado.`;
  const readmePath = path.join(PROJECTS_DIR, entry.nivel, entry.pj, 'README.md');
  if (!fs.existsSync(readmePath)) {
    APP.readmeLines = [clr(C.gray, 'Este projeto ainda não tem README.md.')];
  } else {
    APP.readmeLines = renderMarkdown(fs.readFileSync(readmePath, 'utf8'));
  }
  APP.projReadmeAtual = entry;
  APP.readmeScroll = 0;
  APP.projView = 'readme';
  return null;
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

// ── GITHUB (SIMULADO) ────────────────────────────────────────────────────────
// Nao e um GitHub de verdade — e uma leitura das mesmas tarefas do backlog,
// so que apresentada no vocabulario de Issues/PRs/Actions. Nenhum estado novo
// e inventado aqui, tudo vem do sprint.json que ja existe.

function issuesDoBacklog(s) {
  return s.tasks.map(t => {
    const fechada = t.status === 'done';
    const cor     = fechada ? C.magenta : C.green;
    const icon    = fechada ? '●' : '○';
    const estado  = fechada ? 'CLOSED' : 'OPEN';
    const num     = `#${t.id}`.padEnd(5);
    const titulo  = (t.title.length > 44 ? t.title.slice(0,43)+'…' : t.title).padEnd(44);
    return `  ${clr(cor,icon)} ${clr(C.gray,num)} ${titulo} ${clr(cor,estado)}`;
  });
}

function prsDoBacklog(s) {
  return s.tasks.filter(t => t.prNumero).map(t => {
    let estado, cor;
    if (t.status === 'done')          { estado = 'MERGEADO';             cor = C.magenta; }
    else if (t.status === 'revisao')  { estado = 'ABERTO — em revisão';  cor = C.green;   }
    else                              { estado = 'MUDANÇAS SOLICITADAS'; cor = C.red;     }
    const num    = `#PR${t.prNumero}`.padEnd(6);
    const titulo = (t.title.length > 30 ? t.title.slice(0,29)+'…' : t.title).padEnd(30);
    return `  ${clr(cor,'●')} ${clr(C.gray,num)} ${titulo} ${clr(C.gray,'closes #'+t.id).padEnd(20)} ${clr(cor,estado)}`;
  });
}

function actionsDoProjeto(s) {
  return (s.ciRuns || []).slice().reverse().map(run => {
    const cor    = run.sucesso ? C.green : C.red;
    const icon   = run.sucesso ? '✓' : '✗';
    const estado = run.sucesso ? 'success' : 'failure';
    const quando = new Date(run.quando).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
    const numero = `#${run.numero}`.padEnd(4);
    const proj   = (run.projeto || '—').padEnd(38);
    return `  ${clr(cor,icon)} run ${clr(C.gray,numero)} ${clr(C.gray,quando)}  ${proj} ${clr(cor,estado)}`;
  });
}

function buildGithub() {
  const s = loadSprint();
  const TABS = [
    { key: 'issues',  label: 'Issues',         dados: issuesDoBacklog(s) },
    { key: 'prs',     label: 'Pull Requests',  dados: prsDoBacklog(s)    },
    { key: 'actions', label: 'Actions',         dados: actionsDoProjeto(s) },
  ];
  const abaAtual = TABS.find(t => t.key === APP.githubTab) || TABS[0];
  const linhas   = abaAtual.dados.length ? abaAtual.dados : [clr(C.gray, '  (nada por aqui ainda)')];

  const visible = 18;
  const total   = linhas.length;
  const scroll  = Math.max(0, Math.min(APP.githubScroll, Math.max(0, total - visible)));
  APP.githubScroll = scroll;

  const tabLine = TABS.map((t, i) => {
    const texto = `[${i+1}] ${t.label}`;
    return t.key === abaAtual.key ? bold(clr(C.cyan, texto)) : clr(C.gray, texto);
  }).join('   ');

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold('DEVTECH SISTEMAS S.A.  ─  GitHub (simulado)')) + '\n';
  o += row(` ${tabLine}`) + '\n';
  if (total > visible)
    o += row(dim(`  [${scroll+1}-${Math.min(scroll+visible,total)} de ${total}]`)) + '\n';
  o += `╠${LINE}╣\n`;

  const slice = linhas.slice(scroll, scroll + visible);
  for (const ln of slice) o += row(ln) + '\n';
  for (let i = slice.length; i < visible; i++) o += row('') + '\n';

  o += `╠${LINE}╣\n`;
  o += row(dim('  1/2/3  trocar aba   ↑↓  rolar   Esc  voltar ao menu')) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SPRINT COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

function pick(arr, ...args) {
  return arr[Math.floor(Math.random() * arr.length)](...args);
}

// ─────────────────────────────────────────────────────────────────────────────
//  GITFLOW — so verificacao (leitura), nunca cria/troca/commita nada sozinho.
//  O simulador so avisa se a branch atual nao bate com a esperada; quem roda
//  os comandos de git e sempre o aluno.
// ─────────────────────────────────────────────────────────────────────────────

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

// O dev não escolhe o projeto — recebe o que tá na fila do próprio nível.
// Acha o primeiro projeto ainda não entregue dentro da pasta do nível atual.
function proximoProjetoNivel() {
  const p  = loadProgress();
  const lv = getLevel(p.xp).lv;
  const nivelDir = path.join(PROJECTS_DIR, lv.folder);
  if (!fs.existsSync(nivelDir)) return null;
  const projetos = fs.readdirSync(nivelDir)
    .filter(pj => fs.statSync(path.join(nivelDir, pj)).isDirectory())
    .sort();
  for (const pj of projetos) {
    if (!fs.existsSync(path.join(nivelDir, pj, '.concluido')))
      return { nivel: lv.folder, pj, rel: `${lv.folder}/${pj}` };
  }
  return null; // tudo entregue neste nivel
}

// Prazo da sprint (dias corridos) varia com o nivel — nao faz sentido um
// projeto de Estagiario ter os mesmos 15 dias de um de Senior. O projeto
// "06" de cada nivel e sempre o integrador (mistura tudo que foi visto),
// entao ganha alguns dias a mais mesmo dentro do mesmo nivel.
function prazoSprintPara(nivelFolder, pjNome) {
  const lv = LEVELS.find(l => l.folder === nivelFolder);
  const base = lv?.sprintDias || 7;
  const ehIntegrador = /^06-|integrador/i.test(pjNome);
  return ehIntegrador ? base + 3 : base;
}

// "1h 30m" / "2h" / "2h 30m" → horas decimais (1.5 / 2 / 2.5)
function parseEstimativaTexto(txt) {
  const m = txt.match(/(\d+)\s*h(?:\s*(\d+)\s*m)?/i);
  if (!m) return null;
  const h = parseInt(m[1], 10), min = m[2] ? parseInt(m[2], 10) : 0;
  return +(h + min / 60).toFixed(2);
}

// O nome da sprint e a estimativa não são o dev que inventa — já vêm
// definidos no README do projeto (é o QA/PM que decide isso). Lê de lá.
// A seção de tarefas varia de nome ("Tarefas", "Tarefas para o Sprint",
// "Tarefas sugeridas para o Sprint"...) e de formato: uns já vêm como
// comando (`add texto`), outros como checklist (`- [ ] texto`). Aceita
// os dois e devolve só os títulos, prontos pra virar tarefas no backlog.
function extrairTarefas(raw) {
  const linhas = raw.split('\n');
  let dentro = false;
  const tarefas = [];
  for (const ln of linhas) {
    if (/^#+\s*.*tarefas/i.test(ln)) { dentro = true; continue; }
    if (dentro && /^#+\s/.test(ln)) break; // proxima secao do README, para
    if (!dentro) continue;
    const cmd = ln.match(/^add\s+(.+)/i);
    const chk = ln.match(/^-\s*\[[ xX]?\]\s*(.+)/);
    if (cmd) tarefas.push(cmd[1].trim());
    else if (chk) tarefas.push(chk[1].trim().replace(/`/g, ''));
  }
  return tarefas;
}

function metaDoProjeto(nivel, pj) {
  const readmePath = path.join(PROJECTS_DIR, nivel, pj, 'README.md');
  if (!fs.existsSync(readmePath)) return {};
  const raw = fs.readFileSync(readmePath, 'utf8');
  const sprintM = raw.match(/\*\*Sprint:\*\*\s*(.+)/);
  const estM    = raw.match(/\*\*Estimativa:\*\*\s*(.+)/);
  return {
    sprint: sprintM ? sprintM[1].trim() : null,
    estimativaHoras: estM ? parseEstimativaTexto(estM[1]) : null,
    tarefas: extrairTarefas(raw),
  };
}

const RESP = {
  start:     [(id)=>[NPC.lead,`#${id} em andamento. Avisa se travar.`], (id)=>[NPC.dev,`Boa sorte na #${id}!`]],
  revisar:   [(id)=>[NPC.qa,`Recebi a #${id}, vou dar uma olhada.`], (id)=>[NPC.dev,`Mandei a #${id} pra revisão. Torcendo.`]],
  aprovado:  [(id)=>[NPC.qa,`Testei #${id}. Passou, aprovado! Pode commitar.`], (id)=>[NPC.lead,`#${id} aprovada no code review. Não esquece o commit no imperativo.`]],
  reprovado: [(id)=>[NPC.qa,`#${id} voltou — achei um problema, dá uma olhada de novo.`], (id)=>[NPC.lead,`#${id} precisa de ajuste antes de fechar.`]],
  pausar:    [()=>[NPC.dev,`Ate mais!`], ()=>[NPC.lead,`Salva antes de sair.`]],
  retomar:   [()=>[NPC.dev,`Bem-vindo de volta!`], ()=>[NPC.lead,`Bora terminar.`]],
};

// Simula o tempo que o QA leva pra olhar a tarefa (8-20s reais). Ao resolver,
// recarrega o sprint do disco (o dev pode ter mexido em outra coisa nesse
// meio-tempo) e só aplica se a tarefa ainda estiver esperando revisão.
// A resolucao da revisao do QA e por DATA (task.revisaoResolveEm), nao por
// setTimeout em memoria — um setTimeout morre se o simulador for fechado
// antes da hora, deixando a tarefa presa em "EM REVISAO" pra sempre. Assim,
// ela resolve sozinha na proxima vez que o loop rodar, mesmo que isso seja
// so quando o jogador abrir o app de novo, dias depois.
function checkRevisoesQA() {
  const s = loadSprint();
  if (!s) return;
  let mudou = false;

  for (const task of s.tasks) {
    if (task.status !== 'revisao') continue;

    // tarefa presa de uma sessao anterior (fechada antes da hora, ou de
    // uma versao mais antiga do simulador) — resolve agora mesmo.
    if (!task.revisaoResolveEm) {
      task.revisaoResolveEm = new Date().toISOString();
      task.revisaoAprovada  = Math.random() < 0.7;
    }
    if (Date.now() < new Date(task.revisaoResolveEm).getTime()) continue;

    if (task.revisaoAprovada) {
      task.status = 'done'; task.completedAt = new Date().toISOString();
      task.tempoGastoMs = tempoAtivoTotal(s); // registro do tempo real gasto nela
      const p = loadProgress(); p.xp += 25; saveProgress(p);
      const [n, t] = pick(RESP.aprovado, task.id); pushMessage(n, t);
      APP._lastRevisaoMsg = clr(C.green, `★ #${task.id} aprovada pelo QA! +25 XP`);
      // acabou essa tarefa — o cronometro fica livre ate a proxima ser iniciada
      s.tarefaAtivaId = null; s.sessaoIniciadaEm = null; s.pausadoEm = new Date().toISOString();
    } else {
      task.status = 'doing';
      const [n, t] = pick(RESP.reprovado, task.id); pushMessage(n, t);
      APP._lastRevisaoMsg = clr(C.yellow, `#${task.id} voltou pra desenvolvimento — o QA pediu ajuste.`);
      // mesma tarefa continua ativa — o relogio dela volta a rodar de onde parou
      s.sessaoIniciadaEm = new Date().toISOString(); s.pausadoEm = null;
    }
    delete task.revisaoResolveEm;
    delete task.revisaoAprovada;
    mudou = true;
  }

  if (mudou) {
    saveSprint(s);
    if (APP.screen === 'sprint') APP.lastFb = APP._lastRevisaoMsg;
  }
}

function sprintCommand(input, s) {
  const parts = input.trim().split(/\s+/);
  const cmd   = parts[0]?.toLowerCase();
  // aspas sao opcionais aqui (nao e um shell) — se o jogador envolver o
  // texto em "..." ou '...' por habito, elas sao removidas em vez de
  // virarem parte literal do nome.
  const rest  = parts.slice(1).join(' ').replace(/^(["'])(.*)\1$/, '$2');

  switch (cmd) {
    // as tarefas ja vem do README quando "projeto" atribui — nao tem mais
    // por que o dev cadastrar a mao, entao nao existe mais comando pra isso.
    case 'ver': {
      const id = parseInt(rest), task = s.tasks.find(t=>t.id===id);
      if (!task) return '  Use: ver <nº> (número da tarefa)';
      const statusLabel = {
        backlog: clr(C.gray,'BACKLOG'), doing: clr(C.yellow,'DESENVOLVENDO'),
        revisao: clr(C.magenta,'EM REVISÃO'), done: clr(C.green,'CONCLUÍDO'),
      }[task.status] || task.status;
      return `  #${task.id} [${statusLabel}]  ${task.title}`;
    }
    case 'start': {
      const id = parseInt(rest), task = s.tasks.find(t=>t.id===id);
      if (!task) return `  Tarefa #${id} nao encontrada.`;
      if (task.status==='done')    return `  #${id} ja concluida.`;
      if (task.status==='revisao') return `  #${id} ta em revisao com o QA. Aguarde.`;
      if (task.status==='doing')   return `  #${id} ja esta em andamento.`;

      // uma tarefa de cada vez, na ordem — nao da pra pular pra frente
      // nem ter duas ativas ao mesmo tempo. So avanca quando a anterior
      // for finalizada e aprovada pelo QA (status 'done').
      const outraAtiva = s.tasks.find(t => t.id!==id && (t.status==='doing' || t.status==='revisao'));
      if (outraAtiva)
        return clr(C.yellow, `  [QA] Termina a #${outraAtiva.id} antes de começar outra — uma de cada vez.`);

      const pendenteAntes = s.tasks
        .filter(t => t.id < id && t.status !== 'done')
        .sort((a,b) => a.id - b.id)[0];
      if (pendenteAntes)
        return clr(C.yellow, `  [QA] Segue a ordem do backlog — termina a #${pendenteAntes.id} antes de partir pra #${id}.`);

      task.status = 'doing'; task.startedAt = new Date().toISOString();
      // o cronometro agora e por tarefa: zera aqui e passa a valer contra
      // a estimativa dessa tarefa especifica (nao mais o total do projeto).
      s.tempoAtivoMs = 0; s.sessaoIniciadaEm = new Date().toISOString(); s.pausadoEm = null;
      s.tarefaAtivaId = id;
      saveSprint(s);
      const [n,t] = pick(RESP.start,id); pushMessage(n,t);
      const est = task.estimativaHoras || s.estimativaHoras;

      // gitflow — so verifica a branch atual (leitura), nunca cria/troca nada.
      // O aviso completo vai pro painel de MENSAGENS (que ja suporta varias
      // linhas) — a linha de retorno aqui fica curta, de proposito.
      const esperada = branchEsperadaProjeto(s.projetoAtual);
      const atual    = gitBranchAtual();
      let avisoBranch = '';
      if (esperada && atual && atual !== esperada) {
        pushMessage(NPC.lead, `Branch errada pra codar ("${atual}"). Recomendado: git checkout -b ${esperada}`);
        avisoBranch = clr(C.yellow, '  [branch errada — ver MENSAGENS]');
      }
      return `${clr(C.yellow,'>')} #${id} em andamento.  ${clr(C.gray,`(estimativa: ${est}h)`)}${avisoBranch}`;
    }
    // quem finaliza a tarefa agora e o QA, nao o dev — manda pra revisao
    case 'done': {
      const id = parseInt(rest);
      return `  Isso quem decide é o QA agora — manda pra revisão: revisar ${isNaN(id) ? '<nº>' : id}`;
    }
    case 'revisar': {
      const id = parseInt(rest), task = s.tasks.find(t=>t.id===id);
      if (!task) return `  Tarefa #${id} nao encontrada.`;
      if (task.status==='backlog') return `  #${id} nem foi iniciada ainda — use: start ${id}`;
      if (task.status==='revisao') return `  #${id} ja esta em revisao. Aguarde o QA.`;
      if (task.status==='done')    return `  #${id} ja concluida.`;
      task.status = 'revisao'; task.enviadoRevisaoEm = new Date().toISOString();
      // vira uma PR simulada na primeira vez que sai do backlog pra revisao —
      // se voltar (reprovada) e for de novo, e a mesma PR, so reaberta.
      if (!task.prNumero) { task.prNumero = s.nextPr++; task.prBranch = branchEsperadaProjeto(s.projetoAtual); }
      // resolucao decidida e marcada por DATA (nao setTimeout) — sobrevive
      // a fechar o simulador antes da hora, veja checkRevisoesQA().
      const delayMs = 8000 + Math.random() * 12000;
      task.revisaoResolveEm = new Date(Date.now() + delayMs).toISOString();
      task.revisaoAprovada  = Math.random() < 0.7;
      // o dev para de codar enquanto espera — pausa o relogio da sprint
      if (s.sessaoIniciadaEm) {
        const el = Date.now() - new Date(s.sessaoIniciadaEm).getTime();
        s.tempoAtivoMs = (s.tempoAtivoMs||0) + el;
        s.sessaoIniciadaEm = null; s.pausadoEm = new Date().toISOString();
      }
      saveSprint(s);
      const [n,t] = pick(RESP.revisar,id); pushMessage(n,t);
      return `${clr(C.magenta,'⏳')} #${id} enviada pra revisão do QA. Timer pausado até ele responder.`;
    }
    case 'rm': {
      const id = parseInt(rest), idx = s.tasks.findIndex(t=>t.id===id);
      if (idx===-1) return `  Tarefa #${id} nao encontrada.`;
      s.tasks.splice(idx,1); saveSprint(s);
      return `  #${id} removida.`;
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
    case 'projeto': {
      const p  = loadProgress();
      const lv = getLevel(p.xp).lv;

      // nome da sprint e estimativa nao sao o dev que inventa — ja vem
      // definido no README (quem decide isso e o QA/PM). So atribui o
      // projeto e copia esses dois campos de la.
      function atribuir(prox) {
        const jaEstaAtivo = s.projetoAtual === prox.rel;
        const meta = metaDoProjeto(prox.nivel, prox.pj);
        s.projetoAtual = prox.rel;
        if (meta.sprint)          s.sprint = meta.sprint;
        if (meta.estimativaHoras) s.estimativaHoras = meta.estimativaHoras;
        if (!jaEstaAtivo) {
          s.sprintIniciadaEm = new Date().toISOString(); // sprint real, em dias corridos
          s.prazoDias = prazoSprintPara(prox.nivel, prox.pj);
          s.tarefaAtivaId = null; s.sessaoIniciadaEm = null; s.tempoAtivoMs = 0;
        }
        s.extensoesQA = 0;
        APP.ov80 = false;

        // o "O que fazer" ja diz o que tem que ser feito — poe direto no
        // BACKLOG, o dev nao precisa copiar linha por linha do README.
        // So nao repete se o projeto atribuido e ja estava ativo.
        // A estimativa do README nao e dividida entre as tarefas — cada
        // uma recebe o valor CHEIO. Dividir deixaria tarefas de poucos
        // minutos, o que pressiona demais quem ainda ta aprendendo (1.5h,
        // 2h ou ate 3h por tarefa e razoavel pra quem ta comecando).
        let adicionadas = 0;
        const porTarefa = s.estimativaHoras;
        if (!jaEstaAtivo && meta.tarefas?.length) {
          for (const titulo of meta.tarefas) {
            s.tasks.push({ id: s.nextId++, title: titulo, status: 'backlog', estimativaHoras: porTarefa });
            adicionadas++;
          }
        }
        saveSprint(s);

        const fraseTarefas = adicionadas > 0
          ? ` Já deixei ${adicionadas} tarefa(s) no backlog, ${porTarefa}h cada.`
          : '';
        pushMessage(NPC.qa, `Próximo da fila pra você: "${prox.pj}". Sprint "${s.sprint}", ${s.prazoDias||15} dias corridos.${fraseTarefas}`);
        return `${clr(C.green,'>')} Projeto atribuído: ${prox.rel}  ${clr(C.gray,`(${s.sprint}, ${s.prazoDias||15}d)`)}${fraseTarefas ? clr(C.cyan, fraseTarefas) : ''}`;
      }

      // sem argumento: pega o proximo da fila do seu nivel (o normal do dia a dia)
      if (!rest) {
        const prox = proximoProjetoNivel();
        if (!prox) return clr(C.green, `  [QA] Você já entregou tudo do nível ${lv.name}. Aguarde a próxima leva.`);
        return atribuir(prox);
      }

      // com argumento: so aceita se for do seu proprio nivel — o dev nao escolhe
      // livremente entre pastas de outras senioridades.
      const pp = path.join(PROJECTS_DIR, rest);
      if (!fs.existsSync(pp)) return `  Pasta nao encontrada: projects/${rest}`;
      const nivelDoProjeto = rest.split('/')[0];
      if (nivelDoProjeto !== lv.folder)
        return clr(C.yellow, `  [QA] Isso não é da sua sprint — é nível ${nivelDoProjeto}, você tá em ${lv.name}. Digite "projeto" sem nada pra ver o que é seu.`);
      const pjNome = rest.split('/').slice(1).join('/');
      return atribuir({ nivel: nivelDoProjeto, pj: pjNome, rel: rest });
    }
    case 'concluir': {
      if (!s.projetoAtual) return '  Nenhum projeto ativo.';
      const marker = path.join(PROJECTS_DIR, s.projetoAtual, '.concluido');
      if (fs.existsSync(marker)) return '  Projeto ja entregue.';
      // so entrega o projeto com o backlog inteiro finalizado e aprovado —
      // a "revisao" do projeto todo pressupoe que cada item ja passou pela dele.
      const pendentes = s.tasks.filter(t => t.status !== 'done');
      if (pendentes.length > 0) {
        const exemplo = pendentes[0];
        return clr(C.yellow, `  [QA] Ainda tem ${pendentes.length} tarefa(s) pendente(s) (ex.: #${exemplo.id}). Termina e aprova tudo antes de entregar.`);
      }
      const projPath = path.join(PROJECTS_DIR, s.projetoAtual);
      if (!fs.existsSync(path.join(projPath, 'node_modules')))
        return `  Execute "npm install" na pasta do projeto primeiro.`;
      const res = spawnSync('npm', ['test','--','--silent'], { cwd: projPath, encoding:'utf8', stdio:'pipe' });

      // registra a Action (CI) rodada, passe ou falhe — igual um workflow
      // de verdade que roda a cada tentativa de entrega.
      s.ciRuns = s.ciRuns || [];
      s.ciRuns.push({
        numero: s.ciRuns.length + 1,
        quando: new Date().toISOString(),
        projeto: s.projetoAtual,
        sucesso: res.status === 0,
      });
      if (s.ciRuns.length > 30) s.ciRuns = s.ciRuns.slice(-30);
      saveSprint(s);

      if (res.status !== 0) {
        pushMessage(NPC.qa, 'Entrega bloqueada — testes falhando. Corrige antes de entregar.');
        return clr(C.red,'  [QA] Bloqueado: testes nao passaram. Rode "npm test" no projeto.');
      }
      // As penalidades de atraso ja foram aplicadas ao vivo (checkOvertime,
      // toda vez que o QA precisou reestimar) — aqui so fecha as contas.
      const p2 = loadProgress();
      let penMsg = '';
      if (s.extensoesQA > 0) {
        p2.atrasadas = (p2.atrasadas || 0) + 1;
        penMsg = clr(C.yellow, ` (entregue com ${s.extensoesQA} reestimativa(s) no caminho)`);
        pushMessage(NPC.pm, 'Projeto entregue, mas com reestimativas no meio do caminho. Vamos calibrar melhor a proxima.');
      }
      saveProgress(p2);
      fs.writeFileSync(marker, new Date().toISOString());
      pushMessage(NPC.qa,   'Suite completa passou. Aprovado!');
      pushMessage(NPC.lead, `Entregue! Otimo trabalho, ${p2.name}.`);
      pushMessage(NPC.pm,   'Entrega registrada. Proximo projeto disponivel.');

      // gitflow — so avisa (leitura), nao mexe em nada. O merge de verdade
      // (feature -> develop) e sempre manual, feito pelo aluno.
      const esperada = branchEsperadaProjeto(s.projetoAtual);
      const atual    = gitBranchAtual();
      if (esperada && atual === esperada) {
        pushMessage(NPC.lead, `Testes ok e entregue — agora faz o merge: git checkout develop && git merge ${esperada}`);
      } else if (esperada && atual && atual !== 'main' && atual !== 'develop') {
        pushMessage(NPC.lead, `Confere se commitou tudo em "${atual}" antes de mergear em develop.`);
      }

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

  // Promocao de nivel — hora de "fechar a release": sugere subir uma
  // release/* pra main e taguear (so aviso narrativo, nunca automatico).
  const nivelIdx = getLevel(p.xp).idx;
  if (APP._nivelPrevIdx !== undefined && nivelIdx > APP._nivelPrevIdx) {
    const lv = getLevel(p.xp).lv;
    pushFeed(NPC.lead, `Promovido pra ${lv.name}! Hora de fechar a release.`, 'ok');
    pushMessage(NPC.lead, `Parabéns, ${lv.name}! Sugestão: git checkout -b release/${lv.folder} a partir de develop, testa tudo, e daí sim merge em main + tag.`);
  }
  APP._nivelPrevIdx = nivelIdx;
}

// Quando a sprint estoura, o dev nao reestima sozinho — o QA negocia mais
// tempo com o PM. Mas isso nao e de graca: cada reestimativa vira um aviso
// de desempenho registrado na hora (nao só na entrega), com XP cada vez
// maior perdido se acontecer de novo na mesma sprint.
// O tempo estourado agora e por TAREFA (o QA te passa uma coisa de cada
// vez, cada uma com seu prazo) — nao mais o total do projeto. O prazo do
// projeto inteiro (calendario, 15 dias) e outra coisa, ver checkPrazoSprint.
function checkOvertime() {
  const s = loadSprint();
  if (!s || !s.sessaoIniciadaEm || !s.tarefaAtivaId) return;
  const tarefa = s.tasks.find(t => t.id === s.tarefaAtivaId && t.status === 'doing');
  if (!tarefa) return;

  const estimativa = tarefa.estimativaHoras || s.estimativaHoras;
  const ativo = tempoAtivoTotal(s);
  const estMs = estimativa * 3600000;
  const pct   = ativo / estMs;

  if (pct >= 0.8 && !APP.ov80) {
    APP.ov80 = true;
    pushMessage(NPC.pm, `Atencao! Tarefa #${tarefa.id} chegando no limite do tempo. Quanto falta?`);
    if (APP.screen === 'sprint') APP.lastFb = clr(C.yellow,`⚡ #${tarefa.id}: 80% do tempo estimado usado. Foco!`);
  }

  if (pct >= 1.0) {
    const extensao = Math.max(0.25, +(estimativa * 0.5).toFixed(2));
    s.extensoesQA = (s.extensoesQA || 0) + 1;
    tarefa.estimativaHoras = +(estimativa + extensao).toFixed(2);
    saveSprint(s);

    const penalidade = 5 * s.extensoesQA; // -5, -10, -15... escalando por sprint
    const p = loadProgress();
    p.xp     = Math.max(0, p.xp - penalidade);
    p.avisos = (p.avisos || 0) + 1;
    saveProgress(p);

    pushMessage(NPC.qa, `Tarefa #${tarefa.id} estourou o tempo. Consegui +${extensao}h com o PM, mas isso vira aviso no seu histórico.`);
    pushMessage(NPC.lead, s.extensoesQA > 1
      ? `Essa já é a ${s.extensoesQA}ª reestimativa dessa sprint. Precisamos conversar sobre planejamento.`
      : 'Uma tarefa estourou o tempo. Da próxima vez avisa antes de chegar no limite.');
    if (APP.screen === 'sprint')
      APP.lastFb = clr(C.red, `⚠ #${tarefa.id} estourou — QA deu +${extensao}h  (aviso registrado, -${penalidade} XP)`);

    APP.ov80 = false; // reseta pra poder alertar de novo dentro do novo prazo
  }
}

function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function diasEntreDatas(a, b) {
  const da = new Date(a + 'T00:00:00'), db = new Date(b + 'T00:00:00');
  return Math.round((db - da) / 86400000);
}

// Simulador vivo: a sprint corre em dias corridos de verdade (15 dias),
// mesmo com o app fechado — nao e so tempo ativo de codigo. Se o prazo
// bater, o QA renegocia com o PM, mas isso soma no mesmo contador de
// avisos/XP que o estouro de horas (as duas coisas pesam junto).
function checkPrazoSprint() {
  const s = loadSprint();
  if (!s || !s.projetoAtual || !s.sprintIniciadaEm) return;

  const prazo    = s.prazoDias || 15;
  const decorrido = Math.floor((Date.now() - new Date(s.sprintIniciadaEm).getTime()) / 86400000);
  if (decorrido < prazo) return;

  const extensaoDias = 7;
  s.prazoDias = prazo + extensaoDias;
  s.extensoesQA = (s.extensoesQA || 0) + 1;
  saveSprint(s);

  const penalidade = 5 * s.extensoesQA;
  const p = loadProgress();
  p.xp     = Math.max(0, p.xp - penalidade);
  p.avisos = (p.avisos || 0) + 1;
  saveProgress(p);

  pushMessage(NPC.pm, `Os ${prazo} dias da sprint bateram. Consegui +${extensaoDias} dias com o cliente, mas isso vira aviso.`);
  pushMessage(NPC.qa, 'Nao da pra esticar prazo pra sempre — precisamos fechar isso logo.');
  if (APP.screen === 'sprint')
    APP.lastFb = clr(C.red, `⚠ Prazo de ${prazo} dias estourou — QA conseguiu +${extensaoDias}d  (aviso registrado, -${penalidade} XP)`);
}

// Roda uma vez por dia real (mesmo com o app fechado nesse meio-tempo):
// pratica diaria de verdade tem consequencia se falhar, igual no trampo.
function checkAcessoDiario() {
  const p = loadProgress();
  const hoje = localDateStr(new Date());

  if (!p.ultimoAcessoEm) {
    p.ultimoAcessoEm = hoje; p.diasSeguidos = 1; saveProgress(p);
    return null; // primeiro acesso, nada a cobrar ainda
  }
  if (p.ultimoAcessoEm === hoje) return null; // ja acessou hoje

  const diff = diasEntreDatas(p.ultimoAcessoEm, hoje);
  p.ultimoAcessoEm = hoje;

  if (diff === 1) {
    p.diasSeguidos = (p.diasSeguidos || 0) + 1;
    saveProgress(p);
    return { tipo: 'streak', dias: p.diasSeguidos };
  }

  const faltados = diff - 1;
  p.diasFaltados  = (p.diasFaltados || 0) + faltados;
  p.avisos        = (p.avisos || 0) + 1;
  const penalidade = 5 * faltados;
  p.xp            = Math.max(0, p.xp - penalidade);
  p.diasSeguidos  = 1;
  saveProgress(p);
  return { tipo: 'falta', dias: faltados, xp: penalidade };
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
    case 'github':   out = buildGithub();  break;
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
  if (screen === 'aulas')    { APP.aulaLines = []; APP.aulasScroll = 0; }
  if (screen === 'projetos') { APP.projetosScroll = 0; APP.projView = 'list'; }
  if (screen === 'github')   { APP.githubScroll = 0; }
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
  if (key === '\x1b') {
    if (APP.screen === 'projetos' && APP.projView === 'readme') {
      APP.projView = 'list';     // volta pro quadro, não pro menu
      render(); return;
    }
    goTo('menu'); render(); return; // Esc
  }

  // Number shortcuts from menu
  const n = parseInt(key);
  if (APP.screen === 'menu' && n >= 1 && n <= 6) {
    APP.menuSel = n - 1;
    goTo(['empresa','sprint','dev','projetos','aulas','github'][n-1]);
    render(); return;
  }

  switch (APP.screen) {
    case 'menu':     handleMenuKey(key); break;
    case 'sprint':   handleSprintKey(key); break;
    case 'dev':      handleDevKey(key); break;
    case 'projetos': handleProjetosKey(key); break;
    case 'aulas':    handleAulasKey(key); break;
    case 'github':   handleGithubKey(key); break;
    case 'empresa':  render(); break;
  }
});

function handleMenuKey(key) {
  if (key === '\x1b[A' || key === 'k') APP.menuSel = (APP.menuSel + MENU_ITEMS.length - 1) % MENU_ITEMS.length;
  if (key === '\x1b[B' || key === 'j') APP.menuSel = (APP.menuSel + 1) % MENU_ITEMS.length;
  if (key === '\r') goTo(['empresa','sprint','dev','projetos','aulas','github'][APP.menuSel]);
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

function handleGithubKey(key) {
  if (key === '1' || key === '2' || key === '3') {
    APP.githubTab = ['issues','prs','actions'][Number(key)-1];
    APP.githubScroll = 0;
  }
  if (key === '\x1b[A') APP.githubScroll = Math.max(0, APP.githubScroll - 1);
  if (key === '\x1b[B') APP.githubScroll++;
  if (key === '\x1b[5~') APP.githubScroll = Math.max(0, APP.githubScroll - 10); // PgUp
  if (key === '\x1b[6~') APP.githubScroll += 10;                                 // PgDn
  render();
}

function handleProjetosKey(key) {
  if (APP.projView === 'readme') {
    if (key === '\x1b[A') APP.readmeScroll = Math.max(0, APP.readmeScroll - 1);
    if (key === '\x1b[B') APP.readmeScroll++;
    if (key === '\x1b[5~') APP.readmeScroll = Math.max(0, APP.readmeScroll - 10); // PgUp
    if (key === '\x1b[6~') APP.readmeScroll += 10;                                 // PgDn
    render();
    return;
  }

  if (key === '\x1b[A') APP.projetosScroll = Math.max(0, APP.projetosScroll - 1);
  if (key === '\x1b[B') APP.projetosScroll++;
  if (key === '\x1b[5~') APP.projetosScroll = Math.max(0, APP.projetosScroll - 10); // PgUp
  if (key === '\x1b[6~') APP.projetosScroll += 10;                                   // PgDn

  if (key === '\r') {
    const num = parseInt(APP.inputBuf.trim(), 10);
    APP.lastFb = isNaN(num) ? null : abrirReadme(num);
    APP.inputBuf = '';
  } else if (key === '\x7f' || key === '\x08') {
    APP.inputBuf = APP.inputBuf.slice(0, -1);
  } else if (key.charCodeAt(0) >= 32) {
    APP.inputBuf += key;
  }
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
APP._nivelPrevIdx = getLevel(APP._xpPrev).idx;

boot().then(() => {
  pushFeed(NPC.ops, `Sistema iniciado. Bem-vindo, ${loadProgress().name}.`, 'ok');
  pushFeed(NPC.lead, 'Foco nas entregas. Bom trabalho hoje.');

  const acesso = checkAcessoDiario();
  if (acesso?.tipo === 'falta') {
    const pl = acesso.dias === 1 ? 'dia' : 'dias';
    pushMessage(NPC.lead, `Sumiu ${acesso.dias} ${pl}. Isso conta como aviso de desempenho — não deixa a rotina cair.`);
    pushMessage(NPC.pm, 'O cliente fica de olho na constância da equipe.');
    pushFeed(NPC.lead, `${acesso.dias} ${pl} sem aparecer. Aviso registrado (-${acesso.xp} XP).`, 'alerta');
  } else if (acesso?.tipo === 'streak' && acesso.dias > 1 && acesso.dias % 5 === 0) {
    pushMessage(NPC.lead, `${acesso.dias} dias seguidos de acesso! Ritmo sólido.`);
    pushFeed(NPC.lead, `${acesso.dias} dias seguidos de prática. Mandou bem.`, 'ok');
  }

  // resolve na hora qualquer revisao que devia ter terminado enquanto o
  // app estava fechado (ou uma que ficou presa de uma versao anterior)
  checkRevisoesQA();

  render();

  // Main loop: 150ms — animações suaves
  setInterval(() => {
    APP.frame++;
    tickEmpresa();
    checkOvertime();
    checkPrazoSprint();
    checkRevisoesQA();
    // sprint tambem redesenha sozinho — senao o "Hora:"/tempo da tarefa
    // ativa so atualiza quando o jogador aperta uma tecla, parecendo parado.
    if (APP.screen === 'empresa' || APP.screen === 'menu' || APP.screen === 'sprint') render();
  }, 150);
});
