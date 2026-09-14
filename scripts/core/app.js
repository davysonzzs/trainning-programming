'use strict';

const { SPIN } = require('./ansi');
const { horaAtual } = require('./dados');

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
  standupPasso: 0,         // 0 ontem | 1 hoje | 2 bloqueio | 3 fim
  standupRespostas: {},

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
  { key:'6', label:'GitHub (simulado)',         desc:'Issues, PRs, Actions, Commits e README'  },
];

function spin(o=0) { return SPIN[(APP.frame+o) % SPIN.length]; }

function pushFeed(npc, msg, tipo='normal') {
  APP.feed.push({ hora: horaAtual(), tag: npc.tag, msg, tipo });
  if (APP.feed.length > 10) APP.feed.shift();
}

module.exports = { APP, MENU_ITEMS, spin, pushFeed };
