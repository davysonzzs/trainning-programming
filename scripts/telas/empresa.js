'use strict';

const { C, INN, LINE, bold, cen, clr, dim, row } = require('../core/ansi');
const { APP, pushFeed, spin } = require('../core/app');
const { INCIDENTES, MSGS_AMBIENTE, NPC, RESOLUCOES, contarProjetos, dataAtual, getLevel, horaAtual, loadProgress, loadSprint, pushMessage } = require('../core/dados');
const { metBar, sparkline, timerLine } = require('../core/draw-utils');
const { wrapPrefixedColored } = require('../core/texto');

function buildEmpresa() {
  const p   = loadProgress();
  const s   = loadSprint();
  const pj  = contarProjetos();

  const sprintNome    = s?.sprint || '—';
  const sprintProj    = s?.projetoAtual ? `projects/${s.projetoAtual}` : '—';
  const pausado       = s ? !s.sessaoIniciadaEm : true;
  const statusSprint  = pausado ? clr(C.yellow,'PAUSADA') : clr(C.green,'ATIVO');
  const done = s?.projetos?.filter(pr=>pr.status==='done').length||0;
  const tot  = s?.projetos?.length||0;

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
    o += row(` ${clr(C.gray,'Projetos:')} ${clr(C.green,String(done))}/${tot} concluidos (lote atual)`) + '\n';
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

module.exports = { buildEmpresa, tickEmpresa };
