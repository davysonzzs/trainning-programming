'use strict';

const fs = require('fs');
const path = require('path');

// ATENÇÃO: este arquivo vive em scripts/core/ — ROOT precisa apontar pra
// raiz do repositório (onde ficam .devtech/ e projects/), dois níveis
// acima, não __dirname direto (que seria scripts/core/).
const ROOT          = path.join(__dirname, '..', '..');

const DATA_DIR      = path.join(ROOT, '.devtech');

const SPRINT_FILE   = path.join(DATA_DIR, 'sprint.json');

const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

const AULAS_FILE    = path.join(DATA_DIR, 'aulas.md');

const PROJECTS_DIR  = path.join(ROOT, 'projects');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

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
      nextPr: 1, ciRuns: [], projetoEmEspera: null };
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
    // projeto "parado" esperando revisao enquanto o dev troca pra outro
    // (comando "outro"/"voltar") — null quando so tem 1 projeto em jogo.
    if (!('projetoEmEspera'  in d)) d.projetoEmEspera  = null;
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

function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function diasEntreDatas(a, b) {
  const da = new Date(a + 'T00:00:00'), db = new Date(b + 'T00:00:00');
  return Math.round((db - da) / 86400000);
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

module.exports = { ROOT, DATA_DIR, SPRINT_FILE, PROGRESS_FILE, MESSAGES_FILE, AULAS_FILE, PROJECTS_DIR, NPC, MSGS_AMBIENTE, INCIDENTES, RESOLUCOES, LEVELS, getLevel, PROGRESS_DEFAULT, loadProgress, saveProgress, loadSprint, saveSprint, loadMessages, pushMessage, tempoAtivoTotal, fmtMs, horaAtual, dataAtual, contarProjetos, localDateStr, diasEntreDatas, checkAcessoDiario };
