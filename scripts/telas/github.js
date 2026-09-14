'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { C, LINE, bold, cen, clr, dim, row } = require('../core/ansi');
const { APP } = require('../core/app');
const { PROJECTS_DIR, ROOT, loadSprint } = require('../core/dados');
const { gitBranchAtual } = require('../core/gitflow');
const { render } = require('../core/screen');
const { renderMarkdown } = require('../core/texto');

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
  // status check da PR — mesma logica de branch protection de um repo real:
  // mostra se a ultima Action (concluir) passou, antes mesmo do merge.
  const ultima = ultimaAction(s);
  const ciTag  = !ultima ? clr(C.gray,'CI —') : ultima.sucesso ? clr(C.green,'CI ✓') : clr(C.red,'CI ✗');
  return s.tasks.filter(t => t.prNumero).map(t => {
    let estado, cor;
    if (t.status === 'done')          { estado = 'MERGEADO';                    cor = C.magenta; }
    else if (t.status === 'revisao')  { estado = 'ABERTO — em revisão';         cor = C.green;   }
    else if (t.status === 'aprovado') { estado = 'APROVADO — commit';           cor = C.cyan;    }
    else if (t.status === 'aceite')   { estado = 'COMMITADO — aceite';          cor = C.yellow;  }
    else                              { estado = 'MUDANÇAS SOLICITADAS';        cor = C.red;     }
    const num    = `#PR${t.prNumero}`.padEnd(6);
    const titulo = (t.title.length > 26 ? t.title.slice(0,25)+'…' : t.title).padEnd(26);
    return `  ${clr(cor,'●')} ${clr(C.gray,num)} ${titulo} ${clr(C.gray,'closes #'+t.id).padEnd(11)} ${ciTag}  ${clr(cor,estado)}`;
  });
}

// ultima Action rodada nesse projeto — ciRuns e resetado junto com a sprint
// (atribuir()), entao a lista inteira ja e so do projeto atual.
function ultimaAction(s) {
  const runs = s.ciRuns || [];
  return runs.length ? runs[runs.length - 1] : null;
}

function actionsDoProjeto(s) {
  return (s.ciRuns || []).slice().reverse().map(run => {
    const cor    = run.sucesso ? C.green : C.red;
    const icon   = run.sucesso ? '✓' : '✗';
    const estado = run.sucesso ? 'success' : 'failure';
    const quando = new Date(run.quando).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
    const numero = `#${run.numero}`.padEnd(4);
    const proj   = (run.projeto || '—').padEnd(30);
    // Jobs do pipeline: lint (bloqueia so com erro) e test — igual um
    // workflow real com mais de um step por run.
    let jobs = '';
    if (run.lintErros !== undefined) {
      const lintOk = run.lintErros === 0;
      const lintCor = lintOk ? C.green : C.red;
      const lintTxt = `lint:${lintOk ? '✓' : '✗'+run.lintErros}${run.lintAvisos ? '('+run.lintAvisos+'w)' : ''}`;
      const testCor = run.testesOk ? C.green : C.red;
      jobs = ` ${clr(lintCor, lintTxt)} ${clr(testCor, `test:${run.testesOk ? '✓' : '✗'}`)}`;
    }
    return `  ${clr(cor,icon)} run ${clr(C.gray,numero)} ${clr(C.gray,quando)}  ${proj}${jobs} ${clr(cor,estado)}`;
  });
}

// Aba "Commits" — le o git log de verdade (nao inventa nada), filtrado pro
// caminho do projeto ativo, igual a aba Commits de um repositorio real
// mostrando so o que mudou dentro daquela pasta.
function commitsDoProjeto(s) {
  if (!s.projetoAtual) return [clr(C.gray, '  Nenhum projeto ativo — sem branch pra listar commits.')];
  const branch = gitBranchAtual();
  const projRel = path.join('projects', s.projetoAtual);
  const res = spawnSync('git', ['log', '-20', '--pretty=format:%h\x1f%an\x1f%ar\x1f%s', '--', projRel], { cwd: ROOT, encoding: 'utf8' });
  const cabecalho = clr(C.gray, `  branch atual: ${branch || '(detached / fora de um repo git)'}`);
  if (res.status !== 0 || !res.stdout.trim()) {
    return [cabecalho, '', clr(C.gray, '  Nenhum commit ainda mexendo nesse projeto. Faz o primeiro commit!')];
  }
  const linhas = res.stdout.trim().split('\n').map(ln => {
    const [hash, autor, quando, msg] = ln.split('\x1f');
    return `  ${clr(C.yellow, hash)}  ${clr(C.gray, (quando||'').padEnd(16))} ${clr(C.cyan, (autor||'').padEnd(16))} ${msg||''}`;
  });
  return [cabecalho, ''].concat(linhas);
}

// Aba "README" — o README.md do projeto ativo, formatado com o mesmo
// renderizador de markdown usado no painel de projetos.
function readmeDoProjeto(s) {
  if (!s.projetoAtual) return [clr(C.gray, '  Nenhum projeto ativo.')];
  const readmePath = path.join(PROJECTS_DIR, s.projetoAtual, 'README.md');
  if (!fs.existsSync(readmePath)) return [clr(C.gray, '  Este projeto não tem README.md.')];
  return renderMarkdown(fs.readFileSync(readmePath, 'utf8'));
}

function buildGithub() {
  const s = loadSprint();
  const TABS = [
    { key: 'issues',  label: 'Issues',         dados: issuesDoBacklog(s)   },
    { key: 'prs',     label: 'Pull Requests',  dados: prsDoBacklog(s)      },
    { key: 'actions', label: 'Actions',        dados: actionsDoProjeto(s)  },
    { key: 'commits', label: 'Commits',        dados: commitsDoProjeto(s)  },
    { key: 'readme',  label: 'README',         dados: readmeDoProjeto(s)  },
  ];
  const abaAtual = TABS.find(t => t.key === APP.githubTab) || TABS[0];
  const linhas   = abaAtual.dados.length ? abaAtual.dados : [clr(C.gray, '  (nada por aqui ainda)')];

  const visible = 17;
  const total   = linhas.length;
  const scroll  = Math.max(0, Math.min(APP.githubScroll, Math.max(0, total - visible)));
  APP.githubScroll = scroll;

  const tabLine = TABS.map((t, i) => {
    const texto = `[${i+1}] ${t.label}`;
    return t.key === abaAtual.key ? bold(clr(C.cyan, texto)) : clr(C.gray, texto);
  }).join('   ');

  // badge de build no topo, igual o badge de README de repo real — reflete
  // a ultima Action rodada nesse projeto (concluir), qualquer que seja a
  // aba aberta no momento.
  const ultima = ultimaAction(s);
  const badge  = !ultima
    ? clr(C.gray, '○ build: nenhum run ainda — use "concluir" quando o backlog estiver pronto')
    : ultima.sucesso
      ? clr(C.green, '● build: passing')
      : clr(C.red,   '● build: failing');

  let o = C.cls + C.hide;
  o += `╔${LINE}╗\n`;
  o += cen(bold('DEVTECH SISTEMAS S.A.  ─  GitHub (simulado)')) + '\n';
  o += row(` ${tabLine}`) + '\n';
  o += row(`  ${badge}`) + '\n';
  if (total > visible)
    o += row(dim(`  [${scroll+1}-${Math.min(scroll+visible,total)} de ${total}]`)) + '\n';
  o += `╠${LINE}╣\n`;

  const slice = linhas.slice(scroll, scroll + visible);
  for (const ln of slice) o += row(ln) + '\n';
  for (let i = slice.length; i < visible; i++) o += row('') + '\n';

  o += `╠${LINE}╣\n`;
  o += row(dim('  1-5  trocar aba   ↑↓  rolar   Esc  voltar ao menu')) + '\n';
  o += `╚${LINE}╝\n`;
  return o;
}

function handleGithubKey(key) {
  if (key >= '1' && key <= '5') {
    APP.githubTab = ['issues','prs','actions','commits','readme'][Number(key)-1];
    APP.githubScroll = 0;
  }
  if (key === '\x1b[A') APP.githubScroll = Math.max(0, APP.githubScroll - 1);
  if (key === '\x1b[B') APP.githubScroll++;
  if (key === '\x1b[5~') APP.githubScroll = Math.max(0, APP.githubScroll - 10); // PgUp
  if (key === '\x1b[6~') APP.githubScroll += 10;                                 // PgDn
  render();
}

module.exports = { issuesDoBacklog, prsDoBacklog, ultimaAction, actionsDoProjeto, commitsDoProjeto, readmeDoProjeto, buildGithub, handleGithubKey };
