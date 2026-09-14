// devtech.js — DEVTECH SISTEMAS S.A. — Sistema Unificado
// Execute: node devtech.js
//
// Ponto de entrada fino: so guarda o estado global (APP, via core/app),
// o loop de render/teclado e o boot. Cada tela (empresa, sprint, dev,
// projetos, aulas, github, standup) e seus helpers compartilhados
// (ansi, dados, lint, gitflow, texto/markdown) vivem em scripts/core e
// scripts/telas — veja lá antes de mexer em alguma tela especifica.
'use strict';

const { APP }                                            = require('./scripts/core/app');
const { C, SPIN }                                         = require('./scripts/core/ansi');
const { NPC, checkAcessoDiario, getLevel, loadProgress,
        loadSprint, saveSprint, pushMessage }              = require('./scripts/core/dados');
const { pushFeed }                                        = require('./scripts/core/app');
const coreScreen                                          = require('./scripts/core/screen');

const { buildMenu,     handleMenuKey }                    = require('./scripts/telas/menu');
const { buildEmpresa,  tickEmpresa }                      = require('./scripts/telas/empresa');
const { buildSprint,   handleSprintKey, checkOvertime,
        checkPrazoSprint, checkRevisoesQA }                = require('./scripts/telas/sprint');
const { buildDev,      handleDevKey }                     = require('./scripts/telas/dev');
const { buildProjetos, handleProjetosKey }                = require('./scripts/telas/projetos');
const { buildAulas,    handleAulasKey }                   = require('./scripts/telas/aulas');
const { buildGithub,   handleGithubKey }                  = require('./scripts/telas/github');
const { buildStandup,  handleStandupKey,
        precisaStandupHoje, salvarStandup }                = require('./scripts/telas/standup');
const { buildRevisao1a1, handleRevisao1a1Key }              = require('./scripts/telas/revisao1a1');

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
    case 'standup':  out = buildStandup(); break;
    case 'revisao1a1': out = buildRevisao1a1(); break;
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
  if (screen === 'standup')  { APP.standupPasso = 0; APP.standupRespostas = {}; }
}

// as telas (scripts/telas/*.js) chamam render()/goTo() atraves do modulo
// de indirecao core/screen — evita ciclo de require, ja que render() aqui
// precisa conhecer TODAS as telas. Registra a implementacao real.
coreScreen.bind({ render, goTo });

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
    if (APP.screen === 'standup') {
      salvarStandup(APP.standupRespostas, true); // registra como pulado, nao trava o jogo
      goTo('menu'); render(); return;
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
    case 'standup':  handleStandupKey(key); break;
    case 'revisao1a1': handleRevisao1a1Key(key); break;
    case 'empresa':  render(); break;
  }
});

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

  // primeira abertura do dia: pede o standup antes de qualquer outra tela
  // (nao trava — Esc pula e fica registrado como pulado)
  if (precisaStandupHoje(loadProgress())) goTo('standup');

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
