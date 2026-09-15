# Atualizações

## 2026-09-15 (2)
- 📖 **Roteiro (`AULAS.md`) ampliado** com disciplinas que ainda não apareciam
  explicitamente na trilha, pedidas pelo usuário — inseridas dentro das 14 fases já
  existentes (nenhuma fase nova, nenhum projeto do Estagiário mudou):
  - **POO explícita** — Fase 2 ganhou os 4 pilares da POO em JS, herança com
    `extends`/`super`/campos privados, e composição vs. herança
  - **Qualidade de software e carreira** — Fase 3 ganhou mentalidade de QA/bug report,
    currículo e portfólio de dev júnior, GitHub/LinkedIn como vitrine, e entrevista
    técnica júnior
  - **UX/UI** — Fase 4 ganhou heurísticas de usabilidade, hierarquia visual/tipografia,
    prototipação (wireframes) e design systems
  - **Análise de sistemas** — Fase 8 ganhou modelagem de dados (DER/normalização) e a
    Fase 10 ganhou levantamento de requisitos (user stories) e UML (visão geral)
  - **Gestão de startups** — Fase 14 (Sênior, já era sobre liderança/decisão) ganhou
    mentalidade de produto/MVP, métricas de produto (funil, retenção, LTV/CAC) e lançar
    um side project
  - Programação web e banco de dados já tinham cobertura própria (Fases 4/5/7 e 8) —
    sem mudança de estrutura, só reforço pontual

## 2026-09-15
- 🐛 **Vazamento de conceito corrigido**: `02-guia-preparo-pedido` e o antigo
  `03-troco-moedas` exigiam `for`/`while` pra passar nos testes — antes de o tópico de
  Estruturas de repetição existir. `02` foi redesenhado pra receber sempre 3 ingredientes
  fixos (sequência pura, sem loop); o problema do troco virou `13-troco-caixa-automatico`,
  agora dentro do próprio tópico de repetição, onde faz sentido de verdade
- ✨ Novo projeto `03-recibo-de-venda` no lugar do antigo `03` — mesma posição (Lógica de
  programação, 3/3), conteúdo 100% sequencial (subtotal → desconto → total)
- ✨ **Tópico de Estruturas de repetição passou de 3 pra 5 projetos** — a virada de "sem
  loop" pra "com loop" é o maior salto conceitual da Fase 1, e 3 projetos jogavam o
  aprendiz direto num `for` com acumulador. Agora: `10-gerador-crachas-evento` (o `for`
  mais simples que existe, sem acumulador), `11-gerador-tabela-precos` (for + acumulador),
  `12-monitor-eventos-sistema` (while/do-while), `13-troco-caixa-automatico` (while dentro
  de for, aplicação real), `14-gerador-relatorio-visual` (loops aninhados + strings)
- 📖 `aulas/.../04-estruturas-de-repeticao.md` bem mais destrinchado: tabela passo a passo
  de como o `for` executa, explicação de acumulador, loops aninhados e loops em strings
  com exemplo próprio de cada um (antes era só um resumo curto)
- 🔨 **Todos os projetos de `11` em diante foram renumerados** (`10-31` → `11-33`) pra
  abrir espaço pros 2 novos projetos do tópico de repetição — nenhum conteúdo de projeto
  de `15` em diante mudou, só o número da pasta e as referências cruzadas nos `aulas/*.md`
  e nos docs da raiz. Total do Estagiário: de 31 pra **33** (32 numerados + o bônus de
  refatoração)
- 🐛 Posição `(x/y)` do tópico de Algoritmos de busca corrigida de `(1/3)`/`(2/3)` pra
  `(1/2)`/`(2/2)` — o tópico sempre teve só 2 projetos, o rótulo é que estava errado

## 2026-09-14 (3)
- 📖 **Trilha de Estudos virou documentação de verdade.** A Fase 1 (Estagiário) ganhou
  um `.md` por tópico em `aulas/fase-01-fundamentos-de-programacao/` — explicação
  acessível pra quem nunca programou, exemplo genérico, um segundo exemplo num cenário
  parecido com os projetos da DevTech, "Tente você", erros comuns e em quais projetos
  aquele tópico aparece. `AULAS.md` na raiz virou o índice (era `.devtech/aulas.md`,
  dado interno — agora é documentação de verdade, lida direto no editor/GitHub, sem
  precisar abrir o simulador)
- ✨ Tela **[5] Trilha de Estudos** reescrita pra renderizar esse conteúdo com o mesmo
  `renderMarkdown()` dos READMEs de projeto (títulos, listas, blocos de código com
  wrap de verdade) em vez do parser cru de antes, e agora abre direto na fase atual em
  vez de sempre no topo
- 📖 Os 31 READMEs de projeto do Estagiário ganharam um link direto pro tópico
  correspondente no topo da seção "Dicas", e os mais enxutos (ex.: `03`, `04`, `06`,
  `07`, `08`, `13`, `14`, `31`) ganharam um exemplo genérico curto (domínio diferente do
  exercício) pro conceito mais novo daquele projeto — sem entregar a resposta
- ⚖️ Prazo da sprint agora é do **lote inteiro** (não mais por projeto nem por nível):
  3 dias corridos pra lote de 1 projeto, 7 pra lote de 2, 15 pra lote de 3 ou qualquer
  lote com o projeto integrador — reflete quanto foi juntado na sprint, não a
  senioridade. Extensão de prazo (quando estoura) agora é proporcional ao prazo
  original, não mais um +7 fixo
- ⚖️ Estimativa de horas por projeto agora tem piso de **1h** (era possível ter projeto
  com 20-50min) — os 31 READMEs do Estagiário foram recalibrados numa progressão
  crescente de complexidade, de `1h` no primeiro projeto até `4h` no integrador

## 2026-09-14 (2)
- 🔨 Reformulação grande do Painel de Sprint: a sprint agora é um **lote de 1 a 3 projetos**
  (o QA solta sozinho, na ordem da trilha) em vez de um único projeto quebrado em tarefas —
  cada projeto é uma unidade só. `start <nº>` liga/troca qual projeto está com o cronômetro
  ativo; dá pra ter vários "em andamento" ao mesmo tempo, sem perder progresso de nenhum
- ✨ `revisar` agora roda lint + `npm test` **de verdade** na hora (não sorteio) e o QA leva
  um tempo real pra responder — de minutos a até uns dois dias, mesmo com o app fechado. Se
  reprovar, a mensagem traz o motivo real do erro (teste que falhou, módulo faltando...)
- ✨ Enquanto um projeto espera o QA, a prioridade continua sempre com o projeto que você
  está ativamente codando — resolver uma revisão em segundo plano nunca troca o foco sozinho
- ✨ `commit` virou **o salvamento do jogo**: `commit <mensagem>` grava XP/sprint/projetos em
  disco — sem commit, nada do que mudou desde o último é persistido (fechar sem commitar
  volta pro último salvo). `concluir` também salva, por ser um marco por si só
- ✨ Removidos os comandos `projeto`, `outro`, `voltar`, `add`, `done`, `rm`, `inicio` do
  Painel de Sprint — o lote de projetos e a troca de foco (`start <nº>`) já cobrem o que eles
  faziam, sem precisar escolher/parkear projeto manualmente
- ✨ Badges no Menu Principal (novidade real de cada tela: incidente ativo, projeto aprovado
  esperando `concluir`, PR em revisão) — o Painel de Sprint é a tela mais usada, isso ajuda a
  lembrar de passar pelas outras

## 2026-09-14
- 🐛 Corrigido: ao entregar um projeto, a sprint não reiniciava — o Backlog continuava acumulando tarefas antigas já concluídas e a numeração só crescia ([6], [7], [8]...)
- ✨ `concluir` agora encadeia direto com o próximo projeto da fila: sprint reinicia sozinha (backlog limpo, ids do zero, prazo em dias recalculado pela dificuldade do novo projeto) — não precisa mais digitar `projeto` de novo
- 🔒 Cada projeto novo é tratado como um repositório novo na empresa: Issues, Pull Requests e Actions do GitHub simulado (`[6]`) também zeram junto com a sprint, em vez de misturar com o projeto anterior
- ✨ GitHub simulado ganhou 2 abas novas: **Commits** (lê o `git log` de verdade, filtrado pro projeto ativo — hash, autor, data e mensagem) e **README** (o README.md do projeto atual, formatado)
- ✨ Badge de build (`passing`/`failing`/sem runs) no topo da tela de GitHub, refletindo a última Action — visível em qualquer aba
- ✨ Pull Requests agora mostram um status check de CI (`CI ✓`/`CI ✗`) antes do MERGEADO, reforçando o hábito de checar o build antes de mergear
- ✨ `concluir` agora roda **lint de verdade** (ESLint, config compartilhada em `eslint.config.js`) antes dos testes — bloqueia só em erro real (variável indefinida, código morto...), aviso de estilo não trava a entrega e vira comentário do Lead
- ✨ Aba **Actions** mostra os dois jobs do pipeline (lint e test) lado a lado em cada run, igual um workflow de CI de verdade
- ✨ Novos comandos `outro` / `voltar` no Painel de Sprint: enquanto uma tarefa espera revisão do QA (pode demorar), dá pra adiantar outro projeto da fila sem perder o progresso do atual — no máximo 2 projetos "em jogo" ao mesmo tempo
- ✨ Se os dois projetos travarem no QA ao mesmo tempo, o painel avisa e sugere ir pra Trilha de Estudos em vez de ficar esperando parado
- ✨ `concluir` agora volta automaticamente pro projeto que ficou esperando (se tinha um), em vez de puxar um terceiro novo da fila
- 🔨 Novo projeto bônus `33-refatoracao-modulo-descontos` (Estagiário): diferente dos outros 30, o código já existe — malfeito, duplicado e com um bug real escondido (causado exatamente pela duplicação) — a tarefa é consertar e refatorar sem quebrar os testes, praticando manutenção em vez de criação do zero
- ✨ **Daily Standup**: na primeira vez que abre o simulador no dia, pergunta o que fez ontem / vai fazer hoje / algum bloqueio — não trava (Esc pula), fica registrado e o último standup aparece na Ficha do Desenvolvedor `[3]`
- ✨ **1:1 com o Tech Lead**: a cada 3 projetos entregues, uma tela resume XP/avisos/atrasos/streak com uma leitura qualitativa do Lead — igual uma review de performance de verdade
- 🔨 **Refatoração grande**: `devtech.js` (2157 linhas) quebrado em `scripts/core/` (helpers compartilhados: cores, dados, lint, gitflow, texto) e `scripts/telas/` (um arquivo por tela) — melhora manutenção, sem mudar nenhum comportamento pro jogador

## 2026-09-13
- 🐛 Bordas não quebram mais com nomes/textos longos
- ✨ `npm run resetar` — zera progresso, sprint e projetos entregues
- ✨ Quadro de Projetos `[4]`: paginação com `↑↓` / `PgUp/PgDn`
- ✨ Status `PENDENTE` / `EM ANDAMENTO` / `ENTREGUE` agora aparece nos projetos
- ✨ Dá pra ler o README do projeto direto no simulador (formatado, sem markdown cru)
- 🐛 Colunas do quadro Backlog/Em Andamento/Concluído (`[2]`) alinhadas
- ✨ Comandos da sprint mais claros na própria tela + aspas viraram opcionais
- 🔒 Dev não escolhe mais o projeto livremente — `projeto` atribui o próximo pendente do seu nível, e bloqueia projetos de outra senioridade
- ✨ Mensagens compridas que não cabem na tela agora quebram em duas linhas, em vez de cortar
- 🔒 Nome da sprint e estimativa de horas não são mais inventados pelo dev — vêm do README (QA/PM), copiados automaticamente ao rodar `projeto`
- ✨ Quadro de Sprint `[2]` ganhou a coluna **EM REVISÃO**: quem fecha a tarefa agora é o QA (`revisar <nº>`), não o dev — e o timer pausa sozinho enquanto ela espera revisão
- 🐛 7 READMEs de projeto citavam um comando `node sprint.js add "..."` de uma versão antiga do sistema — corrigido pra sintaxe atual (`add <tarefa>`)
- 📖 Tutorial explica melhor onde achar a lista de tarefas no README (o nome da seção varia por projeto)
- ✨ `projeto` já coloca as tarefas do README direto no BACKLOG — não precisa mais digitar `add` uma por uma
- 🗑️ Comando `add` removido (tarefa nunca mais é cadastrada à mão)
- ✨ Novo comando `ver <nº>` — mostra o título completo da tarefa, já que as colunas do quadro cortam títulos longos
- 🗑️ Comandos `sprint <nome>` e `estimativa <horas>` removidos — vinham do README, não fazia sentido o dev digitar
- 🔒 Sprint estourou? O QA renegocia mais tempo sozinho, mas isso agora vira aviso de desempenho + XP perdido na hora (escalando: -5, -10...), não só na entrega final
- ✨ Sprint agora tem prazo real de 15 dias corridos (conta mesmo com o app fechado), além do cronômetro de horas ativas — estourou os dias, mesma consequência dos avisos/XP
- ✨ Simulador vivo: sumir um dia inteiro sem abrir o app conta como falta de verdade (aviso + XP perdido) — streak de dias seguidos visível na Ficha do Desenvolvedor
- 🔒 O tempo estimado agora é **por tarefa** (fatia do README dividida entre os itens do backlog), não mais o total do projeto — a sprint de 15 dias continua sendo do projeto inteiro
- 🔒 Só dá pra ter uma tarefa em andamento por vez — `start` numa segunda tarefa é bloqueado até a atual ser aprovada
- 🔒 `concluir` só libera com todo o backlog concluído e aprovado pelo QA
- ⚖️ Prazo da sprint agora varia por nível (7 dias no Estagiário/Trainee até 15 no Sênior, +3 nos projetos integradores `06`) em vez de 15 dias fixos pra todo mundo
- 🐛 Corrigido: cada tarefa ganha o tempo **inteiro** do README (1.5h, 2h...), não mais dividido entre as tarefas do backlog — a divisão deixava tarefas de minutos, pressão demais pra quem tá aprendendo
- 🐛 Corrigido: dava pra pular a ordem do backlog (`start 2` sem nunca ter dado `start 1`) — agora só libera a próxima tarefa da fila depois que a anterior for aprovada
- 🐛 Corrigido: o relógio (`Hora:`/tempo da tarefa ativa) no Painel de Sprint só atualizava quando você apertava uma tecla — agora conta sozinho em tempo real
- 🐛 Corrigido: a mensagem ambiente do Painel de Sprint trocava a cada 150ms (rápido demais, parecia um monte de mensagem piscando) — agora troca a cada 15s de verdade
- 🐛 Corrigido: se o simulador fosse fechado antes do QA "responder" (8-20s), a tarefa ficava presa em EM REVISÃO pra sempre — a resolução agora é por data/hora salva, não por timer em memória, e resolve sozinha (mesmo tarefas já presas de antes desse conserto)
- 📖 Documentado: o que precisa de internet (Copilot, 1º `npm install`) e o que não precisa (simulador, `git commit`, testes já instalados) — commit continua manual, PR é opcional e nunca contra este repositório
- ✨ Gitflow: o simulador agora confere (só leitura, via `git branch --show-current`) se você tá na `feature/<projeto>` certa ao dar `start`, e sugere o merge de volta pra `dev/seu-nome` no `concluir` — nunca cria/troca/commita nada sozinho, e funciona 100% offline
- ✨ Ao subir de nível, o Lead sugere praticar uma `release/<nível>` — o momento de "fechar a release" no Gitflow
- ✨ Nova tela `[6] GitHub (simulado)` — Issues (backlog), Pull Requests (revisões) e Actions (histórico de `npm test` no `concluir`), tudo lido a partir dos mesmos dados da sprint, sem depender de internet nem conta no GitHub
- 🔨 Fase 1 (Estagiário) reconstruída do zero: de 6 projetos grandes pra **30 mini-projetos**, 3 por tópico (lógica → variáveis → condicionais → loops → funções → arrays → objetos → recursão → ordenação → busca), do "Hello World" até o integrador — cada README diz qual tópico da trilha (`aulas.md`) aquele projeto pratica
- 🗑️ Níveis Trainee a Sênior III zerados temporariamente (só `README.md` "aguardando novo cliente") — serão reconstruídos nesse mesmo formato de 3-por-tópico, um nível por vez
