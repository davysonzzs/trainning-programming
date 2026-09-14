# PLAN — SISTEMA DE APRENDIZADO DEVTECH

## Como o sistema funciona

Este repositório simula o dia a dia numa empresa de software fictícia — **DevTech Sistemas S.A.**
O desenvolvedor (usuário) é um funcionário que evolui de Estagiário até Sênior III.

---

## Ponto de entrada único

```bash
node devtech.js
```

O sistema abre com uma tela de boot animada e um menu principal com navegação por ↑↓ e Enter.
Telas disponíveis no menu:
1. **Sistema Corporativo** — monitor em tempo real com animações, NPCs, métricas
2. **Painel de Sprint** — board de tarefas interativo com input de comandos
3. **Ficha do Desenvolvedor** — nível, XP, salário, avisos de desempenho
4. **Quadro de Projetos** — todos os projetos com status
5. **Trilha de Estudos** — currículo com scroll por ↑↓
6. **GitHub (simulado)** — Issues, Pull Requests, Actions, Commits e README

Fora do menu, dois interstícios disparam sozinhos: o **Daily Standup** (1x por dia
real, antes do menu) e o **1:1 com o Tech Lead** (a cada 3 projetos entregues).

Esc em qualquer tela volta ao menu. Ctrl+C sai (pausa a sprint automaticamente).

---

## Estrutura de pastas

```
devtech.js              ← PONTO DE ENTRADA — estado global, render/teclado, boot
scripts/
├── core/                ← helpers compartilhados entre telas
│   ├── ansi.js               cores, caixas, truncamento de texto
│   ├── app.js                estado global (APP), menu, feed corporativo
│   ├── dados.js               paths, NPCs, load/save (sprint/progress/mensagens)
│   ├── draw-utils.js          barra de XP, medidor, sparkline, timer da tarefa
│   ├── gitflow.js             leitura da branch atual (nunca cria/muda nada)
│   ├── lint.js                roda o ESLint (eslint.config.js) no "concluir"
│   ├── screen.js              indireção pra render()/goTo() sem ciclo de require
│   └── texto.js               quebra de linha, parser de markdown do README
├── telas/                ← uma tela do menu = um arquivo (build + handle da tecla)
│   ├── menu.js  empresa.js  sprint.js  dev.js  revisao1a1.js
│   └── projetos.js  aulas.js  github.js  standup.js
└── reset.js               ← `npm run resetar`
.devtech/
├── progress.json       ← XP, nome, avisos, atrasos (não edite manualmente)
├── sprint.json         ← estado da sprint ativa
└── messages.json       ← histórico de mensagens dos NPCs
AULAS.md                 ← índice da trilha (14 fases) — fica na RAIZ, de propósito: é
                           documentação pra ler direto (editor/GitHub), não dado interno
                           do jogo. AULAS_FILE em core/dados.js aponta pra cá.
aulas/                    ← conteúdo completo por tópico, um .md por tópico, dentro de
                           `fase-NN-slug/` (só a Fase 1 tem essa pasta por enquanto — ver
                           AULAS_DIR/pastaDaFase() em core/dados.js e telas/aulas.js)
.github/
└── copilot-instructions.md  ← configura Copilot como QA Ana
projects/
├── estagiario/         ← 30 mini-projetos (Fase 1 do AULAS.md — ver seção abaixo)
├── trainee/            ← aguardando (Fase 2 — ainda não construída)
├── junior-1/           ← aguardando (Fase 3)
├── junior-2/           ← aguardando (Fase 5)
├── junior-3/           ← aguardando (Fase 6)
├── pleno-1/            ← aguardando (Fase 7)
├── pleno-2/            ← aguardando (Fase 8)
├── pleno-3/            ← aguardando (Fase 9)
├── senior-1/           ← aguardando (Fase 11)
├── senior-2/           ← aguardando (Fase 13)
└── senior-3/           ← aguardando (Fase 14)
```

Cada nível "aguardando" tem só um `README.md` (placeholder "aguardando novo cliente") —
sem subpastas, então não conta como projeto pro simulador. Serão reconstruídos um nível
de cada vez, seguindo o padrão descrito em **"Plano: trilha completa por fase"** abaixo.

---

## Fluxo de trabalho por sprint

A sprint agora é um **lote de 1 a 3 projetos** (não mais um projeto único quebrado em
tarefas) — cada projeto do lote é uma unidade só, sem sub-tarefas dentro dele.

1. Abrir `node devtech.js` → Menu → **Painel de Sprint**. O QA já deixa o lote da sprint
   no BACKLOG sozinho (1 a 3 projetos do seu nível, na ordem da trilha) — não existe mais
   comando pra "pegar" projeto manualmente.
2. Ler `projects/<nivel>/NN-nome/README.md` de cada um — cenário, spec e dicas.
3. `start <nº>` no projeto que for começar (o número aparece no board). Só um projeto fica
   com o cronômetro ligado por vez, mas dá pra ter vários "em andamento" ao mesmo tempo —
   `start` num projeto pausado/parado acumula o tempo do anterior e liga o novo.
4. Criar o arquivo de implementação (nome exato no README) e rodar `npm install && npm
   test` até passar.
5. `revisar <nº>` manda pro QA — ele roda lint + `npm test` de verdade na hora (motivo real
   do erro se reprovar, não é mais sorteio) e leva um tempo **real** pra responder: de
   minutos a até uns dois dias, mesmo com o simulador fechado nesse meio-tempo. O projeto
   sai de "ativo" nessa hora — comece outro do backlog em vez de ficar esperando parado.
6. Quando o QA aprova, o projeto some da coluna EM REVISÃO e vira `aprovado` (mesmo que
   você esteja trabalhando em outro no momento — **a prioridade continua sempre com o
   projeto que você está ativamente codando**, o aprovado só espera vez).
7. `concluir <nº>` no projeto aprovado — roda `npm test` de novo, marca `.concluido` e dá
   XP (escala com o tamanho do projeto). Se ainda sobrar projeto aberto no lote, a sprint
   continua; só quando o lote inteiro é entregue é que o QA solta o próximo (1 a 3 de novo).
   - Prazo por projeto estourado: penalidade de XP + aviso, aplicada na hora do estouro,
     não só na entrega (ver `UPDATES.md`)
8. `commit <mensagem>`, a qualquer momento — **é o único ponto em que o jogo é salvo em
   disco** (XP, sprint, projetos, tempo). Sem commit, nada do que mudou desde o último é
   persistido; se fechar o simulador sem commitar, o progresso volta pro último commit na
   próxima vez que abrir. O jogador decide a hora de commitar. `concluir` também salva
   sozinho, por ser um marco por si só.

---

## Plano: trilha completa por fase (para quando o usuário pedir a próxima)

A Fase 1 (`projects/estagiario/`) foi reconstruída em **30 mini-projetos** — 3 por
tópico da fase, do "Hello World" até o nível do antigo projeto único — porque o pulo de
"variáveis e operadores" direto pra "implementar 5 funções de regra de negócio" era
grande demais pra quem está começando agora. As fases 2 a 14 do `AULAS.md` ainda não
foram reconstruídas nesse formato — os níveis correspondentes têm só um
`README.md` placeholder ("aguardando novo cliente"). Quando o usuário pedir uma fase
nova, repetir exatamente este processo:

1. **Mapear a fase → nível.** Cada fase do `AULAS.md` já tem um nível de carreira
   correspondente na tabela `LEVELS` de `core/dados.js` (campo `fase`) — ex.: Fase 2 →
   Trainee, Fase 3 → Junior I. Usar a pasta `projects/<folder-do-nivel>/`.
2. **Contar os tópicos da fase** no `AULAS.md` (cada linha `- Tópico: ...` sob o
   `## FASE N`) e multiplicar por 3 — esse é o total de mini-projetos daquele nível.
   Fases maiores (ex.: Fase 6 — React, com 14 tópicos) geram bem mais projetos que a
   Fase 1; é esperado, não é bug.
3. **Numerar linearmente** `01` a `NN` dentro da pasta do nível (mesma decisão já tomada
   pro usuário na Fase 1 — sem subpasta por tópico).
4. **Nomear as pastas como projeto real da empresa**, nunca com nome de tópico
   pedagógico — ex. `08-validador-sensor-estacionamento`, não `08-condicionais`. O README
   de cada um é que carrega o contexto de negócio (bug fix / feature / refactor pedido por
   um cliente/setor fictício da DevTech) e a linha **`Tópico da trilha:`** dizendo qual
   tópico da fase aquele projeto pratica e a posição dele na trilha (`(2/3)` etc).
5. **Progressão dentro de cada trio de tópico:** projeto 1 introduz o conceito isolado
   com a menor superfície possível; projeto 2 aprofunda; projeto 3 mistura com o que já
   foi visto nos tópicos anteriores da mesma fase (nunca com tópicos de fases futuras).
6. **Criar `aulas/fase-NN-slug/` com um `.md` por tópico** (mesmo padrão da Fase 1 em
   `aulas/fase-01-fundamentos-de-programacao/`) — documentação de verdade, não lista de
   bullets: pra cada tópico, uma explicação acessível pra quem ainda não viu o assunto,
   um exemplo pequeno e rodável, um segundo exemplo num cenário parecido com os projetos
   da DevTech (domínio diferente do exercício, nunca a resposta pronta), um "Tente
   você", os erros mais comuns, e a lista dos projetos onde aquele tópico aparece.
   Arquivo numerado (`01-slug.md`, `02-slug.md`...) + um `README.md` na pasta com os
   links pros tópicos (`aulas/fase-01.../README.md` é o modelo). Depois, no `AULAS.md`
   da raiz, trocar a lista de bullets daquela fase por uma lista de links pros arquivos
   novos (mesmo formato da seção "FASE 1" do `AULAS.md` atual) — `pastaDaFase()` em
   `scripts/telas/aulas.js` acha a pasta sozinha pelo prefixo `fase-NN-`, sem precisar
   mexer em código. Isso é o que transforma **[5] Trilha de Estudos** de índice em
   material de estudo de verdade — sem isso, a Dica do README fica pedindo um conceito
   que o dev nunca viu explicado em lugar nenhum.
7. **Todo README segue o template já usado**: Contexto → Nível/Sprint/Estimativa/
   Prioridade/Tópico da trilha → O que fazer (checklist) → Arquivo a criar → Especificação
   das funções → Como testar → Dicas → Tarefas sugeridas para o Sprint (bloco
   ` ```add ...``` `, uma linha por tarefa — popula o backlog sozinho via
   `extrairTarefas()`). A seção de Dicas abre com uma citação (`>`) linkando pro arquivo
   do tópico correspondente em `aulas/fase-NN.../` (ver os 30 READMEs do Estagiário como
   referência do formato exato do link) e, pra cada função, um hint — nunca a resposta
   pronta, mas com um exemplo **genérico** (domínio diferente do exercício) sempre que o
   conceito novo não tiver sintaxe óbvia só pela descrição em prosa.
8. **Todo projeto precisa de teste real (Jest) e passar de fato.** Antes de considerar o
   nível pronto, escrever uma implementação de referência (fora do repositório, ex. numa
   pasta de sandbox) e rodar `npm test` contra os specs de cada mini-projeto — é assim que
   a Fase 1 pegou um bug de spec (função que dependia de campo não calculado ainda) antes
   de chegar no usuário. Specs ambíguos custam caro pra quem está aprendendo.
9. **`estimativaHoras` sempre no formato `Xh Ym`, com no mínimo `1h`** no README
   (`parseEstimativaTexto` exige um dígito de hora — `1h 30m` funciona, `30m` sozinho
   não; o código também aplica um piso de 1h em `distribuirNovoLote`, mas o README já
   deve nascer certo). Cresce com a complexidade: os primeiros projetos da fase ficam
   perto de `1h`, o integrador final é o mais alto do nível.
10. **Prazo de calendário não é mais por projeto nem por nível** — é do **lote** (1 a 3
    projetos que o QA junta na sprint): 3 dias pra lote de 1, 7 pra lote de 2, 15 pra
    lote de 3 ou qualquer lote com o integrador (`prazoLotePara()` em
    `scripts/telas/sprint.js`). Não precisa de nada especial no README pra isso — é
    calculado sozinho a partir de quantos projetos caem juntos no lote.
11. Ao terminar o nível, atualizar `README.md` (se algo do fluxo mudou), `UPDATES.md`
   (uma linha curta) e remover o placeholder "aguardando novo cliente" daquele nível.

---

## Mecânica de estouro — dois relógios independentes

**Horas ativas, por projeto** (`checkOvertime()` em `scripts/telas/sprint.js`) — só mede
o projeto com o cronômetro ligado (`s.projetoAtivoId`):

| Limiar | Evento |
|---|---|
| **80%** de `estimativaHoras` | PM Marcos avisa no chat; ícone ⚡ no timer |
| **100%** (estourou) | QA renegocia +50% do tempo estimado (mín. 15min) sozinho — registra `extensoesQA` no projeto, -5 XP na 1ª extensão da sprint, -10 na 2ª, escalando (`5 * extensoesQA`) |

**Prazo em dias corridos, por LOTE** (`checkPrazoSprint()`) — mede o lote inteiro desde
`s.loteAtribuidoEm`, não cada projeto:

| Limiar | Evento |
|---|---|
| Prazo do lote batido (`s.lotePrazoDias`) sem tudo entregue | QA consegue extensão com o PM — metade do prazo original, mínimo 3 dias — registra `s.loteExtensoesQA`, mesma escala de XP (`5 * loteExtensoesQA`) |

Nenhum dos dois trava o jogo (Esc continua livre) — só registra aviso de desempenho
(`progress.avisos`) e tira XP. Avisos ficam visíveis na **Ficha do Desenvolvedor**.

---

## Progressão de níveis (XP)

| Nível | XP mínimo | Salário |
|---|---|---|
| Estagiário | 0 | R$ 800–R$ 1.500 |
| Trainee | 150 | R$ 2.000–R$ 3.500 |
| Junior I | 350 | R$ 3.000–R$ 4.500 |
| Junior II | 600 | R$ 4.000–R$ 5.500 |
| Junior III | 900 | R$ 5.000–R$ 7.000 |
| Pleno I | 1.250 | R$ 6.500–R$ 9.000 |
| Pleno II | 1.650 | R$ 8.500–R$ 11.000 |
| Pleno III | 2.100 | R$ 10.000–R$ 14.000 |
| Sênior I | 2.600 | R$ 13.000–R$ 17.000 |
| Sênior II | 3.150 | R$ 16.000–R$ 22.000 |
| Sênior III | 3.750 | R$ 20.000–R$ 30.000+ |

---

## Papel do Claude Code (manutenção do simulador)

Claude Code é exclusivamente responsável pela manutenção do sistema DevTech:

- **Bugs no simulador:** Corrigir problemas em `devtech.js`, `sprint.js`, etc.
- **Novos projetos:** Criar projetos do próximo nível quando o usuário pedir promoção
- **Promoção:** Verificar se todos os projetos do nível estão entregues (`[ENTREGUE]`)
- **Não faz:** Responder dúvidas técnicas sobre os projetos, agir como QA

## Papel do GitHub Copilot (QA do dia a dia)

O Copilot é o QA — configurado via `.github/copilot-instructions.md`.
Responde dúvidas técnicas durante os projetos, mas nunca escreve código.

---

## Comandos do Painel de Sprint

O lote da sprint (1 a 3 projetos) é montado sozinho pelo QA — não existe mais comando pra
"pegar" projeto. Os números (`<nº>`) são os que aparecem no board.

| Comando | O que faz |
|---|---|
| `ver <nº>` | Mostra o status do projeto |
| `start <nº>` | Começa ou retoma o projeto — vira o "ativo" (o cronômetro segue ele) |
| `revisar <nº>` | Manda pro QA — roda lint + `npm test` de verdade e aprova/reprova com motivo, em tempo real (minutos a dias) |
| `concluir <nº>` | Só com o projeto aprovado — roda `npm test` de novo, marca `.concluido` e dá XP |
| `commit <mensagem>` | A qualquer momento — **é o que salva o jogo em disco** (ver seção de salvamento acima) |
| `pausar` / `retomar` | Pausa/retoma o timer do projeto ativo |
| Esc | Volta ao menu principal |

---

## Níveis e fases das aulas

- **Estagiário** → Fase 1 (Fundamentos)
- **Trainee** → Fase 2 (ES6+)
- **Junior I** → Fase 3 (Ferramentas)
- **Junior II** → Fase 5 (JS no Browser — adaptado para Node.js)
- **Junior III** → Fase 6 (React patterns — adaptado para JS puro)
- **Pleno I** → Fase 7 (Node.js + API REST)
- **Pleno II** → Fase 8 (Banco de dados)
- **Pleno III** → Fase 9+10 (Auth + Arquitetura)
- **Sênior I** → Fase 11+12 (Testes avançados + DevOps)
- **Sênior II** → Fase 13 (Sistemas distribuídos)
- **Sênior III** → Fase 14 (Liderança técnica)
