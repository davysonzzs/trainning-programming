# Tutorial — Primeiro Projeto

Bem-vindo à **DevTech Sistemas S.A.**

Você acabou de ser contratado como Estagiário. Seu primeiro projeto está esperando.
Este tutorial mostra o fluxo completo do início ao fim.

---

## 1. Inicie o sistema

```bash
node devtech.js
```

Uma tela de boot animada carrega o sistema corporativo.
Na **primeira vez que você abre o sistema em cada dia**, antes do menu, aparece o
**Daily Standup**: três perguntas rápidas (o que fez ontem / vai fazer hoje / algum
bloqueio). Responde e dá Enter em cada uma — ou pressiona Esc pra pular sem responder,
se não quiser. Não trava o jogo, mas fica registrado e o último standup aparece na
Ficha do Desenvolvedor.

Depois disso (ou direto, se já fez o standup hoje), você chega ao menu principal com
6 opções navegáveis por ↑↓ + Enter.

---

## 2. Registre seu nome

No menu, acesse **[3] Ficha do Desenvolvedor**.
Digite `name Seu Nome` e pressione Enter.
Pressione Esc para voltar ao menu.

---

## 3. Veja o projeto disponível

No menu, acesse **[4] Quadro de Projetos**.
Você verá os projetos do nível Estagiário, todos como `○ PENDENTE`, numerados — são 30
mini-projetos, cada um bem pequeno, do "Hello World" até o projeto integrador final.
O primeiro é `01  ○  01-mensagens-onboarding`.

Leia o README sem sair do simulador: digite o número do projeto e Enter
(no exemplo, `01` + Enter — o zero na frente é só de exibição, `1` também
funciona). Esc volta pro quadro. Se preferir, também dá pra ler direto no
terminal:
```bash
cat projects/estagiario/01-mensagens-onboarding/README.md
```

O README tem:
- **Contexto** — por que o arquivo precisa ser criado
- **O que fazer** — lista de funções para implementar
- **Especificação** — como cada função deve se comportar
- **Dicas** — perguntas guiadas (use se travar, antes do Copilot)
- **Tarefas para o Sprint** (última seção, o nome varia um pouco de
  projeto pra projeto) — é a mesma lista do "O que fazer", só que já
  formatada. No próximo capítulo ela entra sozinha no seu BACKLOG, você
  não precisa copiar nada.

---

## 4. Configure a sprint

No menu, acesse **[2] Painel de Sprint**. Lá embaixo tem uma barra `>` —
é nela que você digita os comandos abaixo e aperta Enter (não precisa de
aspas, mesmo em nomes com espaço).

**Receba o projeto.** Você não escolhe: assim como na vida real, o QA te
diz o que já tá na sua fila. Digite `projeto` sem nada depois, e o
sistema atribui o próximo projeto pendente do **seu nível atual**:
```
> projeto
```
Isso te dá `estagiario/01-mensagens-onboarding` automaticamente — é o
mesmo que aparece com `○ PENDENTE` no Quadro de Projetos. Quando você
entregar esse, rode `projeto` de novo pra pegar o próximo da fila (nunca
um projeto de outra senioridade) — são 30 no total, bem curtos no
começo, crescendo aos poucos.

Repare que **já vem tudo pronto** — o nome da sprint, a estimativa de
horas, e o **BACKLOG já entra populado com as tarefas do "O que fazer"**
do README. Você não digita nada disso, é o QA quem organiza:
```
[QA] Próximo da fila pra você: "01-mensagens-onboarding".
     Sprint "Estagiário — Primeiro Deploy", estimativa 0.33h.
     Já deixei 4 tarefa(s) no backlog.
```
Não existem mais comandos pra você digitar nome de sprint, estimativa ou
tarefa à mão — nome e estimativa vêm do README, e as tarefas entram
sozinhas no backlog quando o `projeto` é atribuído.

Se a sprint estourar o tempo estimado, você não perde o acesso nem
trava: o **QA renegocia mais tempo com o PM automaticamente** — só que
isso fica registrado como um **aviso de desempenho** (e custa XP, cada
vez mais se acontecer de novo na mesma sprint: -5 XP na 1ª vez, -10 XP
na 2ª, e assim por diante). Ou seja, dá pra estourar o prazo sem travar
o jogo, mas isso pesa no seu histórico — bem diferente de simplesmente
digitar uma estimativa maior pra você mesmo.

Cada tarefa entra numerada (`#1`, `#2`...) na coluna **BACKLOG**. O
quadro tem 4 colunas, e você não é quem fecha a tarefa — isso é o QA:

```
BACKLOG → start <nº> → DESENVOLVENDO → revisar <nº> → EM REVISÃO → CONCLUÍDO
```

- `ver <número>` → mostra o título completo da tarefa. As colunas do
  quadro são estreitas e cortam títulos longos com "…" — use `ver` quando
  não der pra ler tudo.
- `start <número>` → joga pra **DESENVOLVENDO** (começa a valer o timer)
- `revisar <número>` → manda pra **EM REVISÃO**, com o QA. **O timer da
  sprint pausa sozinho** enquanto isso — você não tá codando, então não
  conta como hora trabalhada.
- O QA responde sozinho depois de alguns segundos: **aprova** (a tarefa
  vai pra **CONCLUÍDO** e você ganha **+25 XP**) ou **reprova** (ela volta
  pra **DESENVOLVENDO** pra você ajustar e mandar de novo). O timer volta
  a rodar assim que ele responde, dos dois jeitos.
- `rm <número>` → remove a tarefa

Esses comandos (e `pausar`/`retomar`/`concluir`) ficam sempre visíveis
na própria tela do Painel de Sprint, então não precisa decorar nada.

---

## 5. Trabalhe no projeto

Antes de marcar a tarefa como em andamento, corta a feature branch dessa
sprint (a partir da sua branch pessoal, `dev/seu-nome`):
```bash
git checkout -b feature/mensagens-onboarding
```

Aí sim, marque a primeira tarefa como em andamento:
```
> start 1
```
Se você esquecer a branch, o `[LEAD]` avisa (o jogo confere com
`git branch --show-current`, só leitura — não troca nada por você).

Em outro terminal, crie o arquivo de implementação:
```bash
# Na pasta do projeto
cd projects/estagiario/01-mensagens-onboarding
npm install
npm test    # vai falhar — é esperado, o arquivo ainda não existe
```

Crie `mensagens.js` e implemente as funções uma por uma (o nome do arquivo
está sempre na seção "Arquivo a criar" do README de cada projeto).
A cada função implementada, rode `npm test` para ver o progresso.

Quando uma tarefa estiver pronta, volte ao painel e manda pra revisão:
```
> revisar 1
> start 2
```

O QA analisa e responde sozinho — se aprovar, cai em **CONCLUÍDO** e você
ganha **+25 XP**; se pedir ajuste, ela volta pra **DESENVOLVENDO** e você
manda `revisar 1` de novo depois de corrigir.

---

## 6. Timer e sprint

Tem três relógios diferentes rodando ao mesmo tempo:

**Horas ativas — por tarefa.** O QA te passa uma coisa de cada vez, e
cada uma tem o **tempo inteiro do README** pra ela (não é dividido entre
as tarefas — cada uma ganha, por exemplo, 1.5h completas, o suficiente
pra quem ainda tá aprendendo não sentir pressão). Só conta enquanto o
timer da tarefa *atual* tá rodando — mostrado no topo do Painel de
Sprint:

| Estado | Exibição |
|---|---|
| Normal (< 80%) | `▶ #2: 45m / 1.5h  (faltam 45m)` |
| Atenção (80%+) | `⚡ #2: 1h 15m / 1.5h  (faltam 15m)` |
| Estourado | `⚠ ESTOURADO: #2: 1h 35m / 1.5h  (+5m)` |

Se precisar pausar e voltar depois:
```
> pausar
```
Feche o terminal. O tempo salvo fica registrado.
Na próxima vez que abrir, o timer continua de onde parou. **Só dá pra
ter uma tarefa em andamento por vez, e na ordem do backlog** — `start`
numa tarefa antes da anterior ser aprovada é bloqueado pelo QA, seja
porque tem outra em andamento/revisão, seja porque você tentou pular a
fila (ex.: `start 3` com a `#2` ainda pendente).

**Prazo da sprint — do projeto inteiro.** Em dias **corridos** (nem
precisa estar com o app aberto — conta feito sprint de verdade), mostrado
como `Prazo: N dias restantes de M corridos`. A duração varia com a
senioridade — não faz sentido o projeto `01` do Estagiário levar o mesmo
prazo de um projeto de Sênior:

| Nível | Prazo padrão | Projeto `06` (integrador) |
|---|---|---|
| Estagiário / Trainee | 7 dias | 10 dias |
| Junior I/II/III | 10 dias | 13 dias |
| Pleno I/II/III | 12 dias | 15 dias |
| Sênior I/II/III | 15 dias | 18 dias |

Se qualquer um dos dois estourar (tarefa ou os dias da sprint), o QA
renegocia mais tempo automaticamente (+7 dias) — só que isso registra um
**aviso de desempenho** e tira XP, cada vez mais se acontecer de novo na
mesma sprint. Não trava o jogo, mas pesa no seu histórico.

**Prática diária** — o simulador é vivo: cada dia real que passa sem
você abrir o app é um dia perdido de verdade, não só um número parado.
Se você sumir um ou mais dias, ao voltar o Lead comenta a ausência, e
isso também vira aviso + XP perdido (visível na Ficha do Desenvolvedor,
em "Prática diária"). Entrar todo dia — mesmo que por pouco tempo — é
parte do jogo, igual seria num emprego de verdade.

---

## 7. Entregue o projeto

O QA só aceita a entrega do projeto com **todas as tarefas do backlog
concluídas e aprovadas** — se sobrar alguma em BACKLOG, DESENVOLVENDO ou
EM REVISÃO, `concluir` é recusado avisando quantas faltam. Termine e
revise (`revisar <nº>`) tudo antes de tentar.

Com tudo aprovado:
```
> concluir
```

O sistema vai:
1. Conferir que não sobrou tarefa pendente
2. Rodar o **lint** (ESLint) — pega erro de verdade (variável que não
   existe, código morto...); aviso de estilo não trava a entrega
3. Rodar `npm test` automaticamente
4. Se os dois passaram: marcar como `[ENTREGUE]` e notificar os NPCs
5. Sugerir (pelo `[LEAD]`) fazer o merge da feature de volta:
   ```bash
   git checkout dev/seu-nome
   git merge feature/mensagens-onboarding
   ```

Se o lint achar **erro** de verdade, a entrega é bloqueada antes mesmo
de chegar no teste — corrige e roda `concluir` de novo. Pra ver o
relatório completo sem esperar o `concluir`, rode direto (na raiz do
repositório, não dentro da pasta do projeto):
```bash
npx eslint projects/estagiario/01-mensagens-onboarding
```

**A sprint reinicia sozinha.** Assim que você entrega, o backlog zera e
o próximo projeto da sua fila já entra automaticamente — não precisa
digitar `projeto` de novo.

Dá uma olhada em **[6] GitHub (simulado)** no menu — sua tarefa `#1`
aparece como **Issue #1 CLOSED**, o `revisar 1` que você deu virou
**Pull Request #1 MERGEADO**, e o `concluir` que acabou de rodar aparece
na aba **Actions** como um workflow `success` (com o resultado do lint e
dos testes lado a lado). Dá pra ver o **README** do projeto e os
**Commits** de verdade (via `git log`) direto nas outras abas. É o
mesmo vocabulário que qualquer time usa no dia a dia — issue, PR, CI —
só que sem precisar de conta no GitHub.

**A cada 3 projetos entregues**, antes de voltar pro menu aparece um
**1:1 com o Tech Lead**: um resumo de XP, avisos, atrasos e streak, com
uma leitura qualitativa do Rafael sobre o seu ritmo — é a versão do jogo
pra uma review de performance de verdade. Só leitura, Enter volta pro menu.

---

## 8. Enquanto o QA revisa, siga em frente

Igual no trampo de verdade: uma revisão pode demorar (o QA simulado leva
de 8 a 20 segundos; uma PR de verdade pode levar dias). Em vez de ficar
esperando parado, dá pra adiantar **outro projeto** sem perder o
progresso do atual:

```
> revisar 3        (manda a última tarefa disponível pro QA)
> outro             (pega o próximo projeto da fila, sem descartar o outro)
```

O painel passa a mostrar `⏳ esperando: estagiario/01-...` no topo — é o
projeto que ficou parado. Quando quiser voltar pra ele (pra conferir se o
QA já respondeu, ou seguir outra tarefa do backlog dele):

```
> voltar
```

**Só dá pra ter 2 projetos "em jogo" ao mesmo tempo.** Se os dois
travarem no QA junto (nada pra iniciar em nenhum dos dois), o painel
avisa e sugere ir pra **[5] Trilha de Estudos** — é uma boa hora pra
estudar em vez de ficar só esperando. Entregar um dos dois projetos
(`concluir`) volta automaticamente pro outro, se ele ainda estiver
esperando.

---

## 9. Consequências de atraso

Diferente de antes, a penalidade **não espera a entrega** — ela acontece
na hora em que o estouro rola, e escala a cada vez que se repete na
mesma sprint:

| Estouro (o que aconteceu) | Consequência |
|---|---|
| 1ª reestimativa na sprint (tarefa ou prazo do projeto) | -5 XP + 1 aviso |
| 2ª reestimativa na mesma sprint | -10 XP + 1 aviso |
| 3ª reestimativa na mesma sprint | -15 XP + 1 aviso (e por aí vai) |
| Dia inteiro sem abrir o simulador | -5 XP por dia perdido + 1 aviso |

Avisos e a contagem de dias seguidos ficam registrados na sua **Ficha do
Desenvolvedor**. O objetivo é ir ajustando o ritmo com a prática — dá pra
estourar sem travar o jogo, mas isso pesa no seu histórico.

---

## 10. Peça ajuda se travar

Antes de travar por muito tempo, use o **GitHub Copilot Chat** como QA.
Ele está configurado para agir como **QA Ana** — explica conceitos e aponta
o que está errado, mas **nunca escreve o código por você**.

Exemplos de perguntas úteis:
- "O que significa esse erro do Jest?"
- "Como funciona a fórmula de juros compostos?"
- "Meu reduce está retornando undefined, o que pode ser?"

---

## 11. Faça os 30 projetos

```
01 → 02 → 03 → ... → 29 → 30
```

São 3 mini-projetos pra cada um dos 10 tópicos da Fase 1 (lógica, variáveis,
condicionais, loops, funções, arrays, objetos, recursão, ordenação, busca) —
os primeiros são bem curtos, e a dificuldade cresce aos poucos. O README de
cada um diz, na linha **"Tópico da trilha"**, qual assunto ele pratica.
O projeto `30-integrador-fase1` usa conceitos de todos os anteriores.
Quando todos estiverem `[ENTREGUE]`, você terá XP suficiente para o próximo nível.

**Bônus — `31-refatoracao-modulo-descontos`:** os 30 anteriores são todos "criar do
zero"; esse é diferente — o código **já existe** (funcionando, mas malfeito e com um
bug escondido) e a tarefa é ler, entender, consertar e refatorar sem quebrar o que já
funciona. É metade do trabalho real de um dev: manutenção, não só criação. Vale os
mesmos XP e entra na fila normalmente depois do `30`.

---

## Dicas

**Sprint estourou?**
Normal na primeira vez. Anote quanto levou. O objetivo é calibrar estimativas
com a prática até caber no tempo estimado.

**Esc sempre volta ao menu.**
Você não precisa fechar e reabrir nada. Navegue entre as telas livremente.

**Ctrl+C salva automaticamente.**
A sprint é pausada e o tempo ativo é preservado.

---

Boa sorte, Dev. O time está esperando sua primeira entrega.
