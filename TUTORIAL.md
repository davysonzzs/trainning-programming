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

**Receba o lote.** Você não escolhe: assim como na vida real, o QA já
deixa o **lote da sprint** pronto no board assim que você entra na tela —
de 1 a 3 projetos, sempre na ordem da trilha (nunca de outra senioridade).
Não existe comando pra "pegar" projeto — ele já está lá:
```
[QA] Sprint 1: coloquei 2 projeto(s) no seu backlog — 01-mensagens-onboarding,
     02-guia-preparo-pedido. Prazo: 7 dias corridos.
```
Repare que **já vem tudo pronto** — nome da sprint, estimativa de horas e
prazo de dias vêm do próprio README de cada projeto (ou são calculados a
partir de quantos projetos caíram no lote). Quando você entrega o lote
inteiro, o próximo já entra sozinho — nunca precisa pedir.

O board tem 4 colunas — **BACKLOG · ANDAMENTO · EM REVISÃO · CONCLUÍDO**
— e cada projeto do lote aparece numerado (`[1]`, `[2]`...) numa delas:

```
BACKLOG → start <nº> → ANDAMENTO → revisar <nº> → EM REVISÃO → concluir <nº> → CONCLUÍDO
```

- `ver <nº>` → mostra o status completo do projeto (as colunas do board
  cortam títulos longos com "…").
- `start <nº>` → joga o projeto pra **ANDAMENTO** e liga o cronômetro de
  horas nele. Só um projeto tem o cronômetro ligado por vez, mas dá pra
  ter **mais de um "em andamento"** ao mesmo tempo — repetir `start` noutro
  projeto acumula o tempo do que estava ativo e troca o cronômetro pra ele.
- `revisar <nº>` → manda pra **EM REVISÃO**, com o QA — ele já roda lint +
  `npm test` de verdade na hora, então quando responder (minutos a até uns
  dois dias, mesmo com o simulador fechado) o motivo de uma reprovação é
  sempre real, nunca sorteio.
- O QA responde sozinho: **aprova** (o projeto some da coluna EM REVISÃO,
  vira "aprovado" — falta só `concluir <nº>`) ou **reprova** (ele volta pra
  **ANDAMENTO** com o motivo, pra você ajustar e mandar de novo).
- `concluir <nº>` → só funciona com o projeto já **aprovado** pelo QA. Roda
  `npm test` mais uma vez (confirmação final, tipo um CI antes do merge),
  marca como entregue e dá XP.

Esses comandos (e `pausar`/`retomar`/`commit`) ficam sempre visíveis na
própria tela do Painel de Sprint, então não precisa decorar nada.

**`commit <mensagem>` é o que salva o jogo em disco.** Sem ele, nada do
que mudou (XP, sprint, projetos) fica gravado — fechar o simulador sem
commitar volta pro último commit na próxima vez que abrir. `concluir`
também salva sozinho, por ser um marco por si só, mas qualquer outro
progresso (começou um projeto, mandou pra revisão...) só é salvo de
verdade quando você digita `commit`, exatamente como um commit de Git de
verdade — é você quem decide a hora.

---

## 5. Trabalhe no projeto

Antes de dar `start`, corta a feature branch desse projeto (a partir da sua
branch pessoal, `dev/seu-nome`):
```bash
git checkout -b feature/mensagens-onboarding
```

Aí sim, marque o projeto como em andamento (o cronômetro de horas liga nele):
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

Quando o projeto estiver pronto, volte ao painel e manda pra revisão. Se o
seu lote tiver mais de um projeto, dá pra já começar o próximo enquanto o
QA olha o primeiro:
```
> revisar 1
> start 2
```

O QA roda lint + `npm test` de verdade na hora e responde depois (minutos a
até uns dois dias, mesmo com o simulador fechado) — se aprovar, o projeto
some da coluna EM REVISÃO e vira "aprovado" (falta só `concluir 1`); se
reprovar, ele volta pra **ANDAMENTO** com o motivo real do erro, pra você
ajustar e mandar `revisar 1` de novo.

---

## 6. Dois relógios: horas do projeto + prazo do lote

**Horas ativas — por projeto.** Cada projeto tem uma estimativa vinda do
README (mínimo **1h**, crescendo com a complexidade — os primeiros do
Estagiário ficam perto de 1h, o integrador chega a 4h). Só conta enquanto o
cronômetro do projeto *ativo* tá rodando — mostrado no topo do Painel de
Sprint:

| Estado | Exibição |
|---|---|
| Normal (< 80%) | `▶ #1: 45m / 1h  (faltam 15m)` |
| Atenção (80%+) | `⚡ #1: 55m / 1h  (faltam 5m)` |
| Estourado | `⚠ ESTOURADO: #1: 1h 10m / 1h  (+10m)` |

Se precisar pausar e voltar depois:
```
> pausar
```
Feche o terminal, o tempo salvo fica registrado. Na próxima vez que abrir
(depois de `retomar`), o cronômetro continua de onde parou. Só um projeto
tem o cronômetro ligado por vez — `start` noutro projeto do lote acumula o
tempo do que estava ativo e troca o cronômetro pra ele, sem perder nada.

**Prazo da sprint — do LOTE inteiro.** Em dias **corridos** (nem precisa
estar com o app aberto — conta feito sprint de verdade), mostrado como
`Prazo: N dias restantes de M corridos` no topo do painel. A duração
reflete quantos projetos o QA juntou nesse lote, não a sua senioridade:

| Projetos no lote | Prazo |
|---|---|
| 1 projeto | 3 dias |
| 2 projetos | 7 dias |
| 3 projetos (ou qualquer lote com o integrador) | 15 dias |

Se qualquer um dos dois relógios estourar (horas do projeto ativo, ou dias
do lote inteiro sem entregar tudo), o QA renegocia mais tempo
automaticamente — só que isso registra um **aviso de desempenho** e tira
XP, cada vez mais se acontecer de novo na mesma sprint. Não trava o jogo,
mas pesa no seu histórico.

**Prática diária** — o simulador é vivo: cada dia real que passa sem você
abrir o app é um dia perdido de verdade, não só um número parado. Se você
sumir um ou mais dias, ao voltar o Lead comenta a ausência, e isso também
vira aviso + XP perdido (visível na Ficha do Desenvolvedor, em "Prática
diária"). Entrar todo dia — mesmo que por pouco tempo — é parte do jogo,
igual seria num emprego de verdade.

---

## 7. Entregue o projeto

`concluir <nº>` só funciona com o projeto já **aprovado** pelo QA (depois
de um `revisar <nº>` bem-sucedido):

```
> concluir 1
```

O sistema vai:
1. Conferir que o projeto está aprovado (recusa avisando se ainda não foi
   pra revisão, ou se voltou reprovado)
2. Rodar `npm test` mais uma vez — confirmação final, tipo um CI rodando
   antes do merge
3. Se passou: marcar como entregue, dar XP e notificar os NPCs
4. Sugerir (pelo `[LEAD]`) fazer o merge da feature de volta:
   ```bash
   git checkout dev/seu-nome
   git merge feature/mensagens-onboarding
   ```

**Não esqueça de salvar.** `concluir` já salva sozinho (é um marco por si
só), mas qualquer outro progresso no meio do caminho (começou um projeto,
mandou pra revisão) só fica gravado em disco de verdade com
`commit <mensagem>` — sem isso, fechar o simulador sem commitar volta pro
último commit na próxima vez que abrir.

**Quando o lote inteiro é entregue, o próximo já entra sozinho** — de 1 a 3
projetos novos, na ordem da trilha. Não precisa pedir nada.

Dá uma olhada em **[6] GitHub (simulado)** no menu — o projeto `1` aparece
como **Issue #1 CLOSED**, o `revisar 1` que você deu virou **Pull Request
#1 MERGEADO**, e o `concluir` que acabou de rodar aparece na aba
**Actions** como um workflow `success`. Dá pra ver o **README** do projeto
e os **Commits** de verdade (via `git log`) direto nas outras abas. É o
mesmo vocabulário que qualquer time usa no dia a dia — issue, PR, CI — só
que sem precisar de conta no GitHub.

**A cada 3 projetos entregues**, antes de voltar pro menu aparece um
**1:1 com o Tech Lead**: um resumo de XP, avisos, atrasos e streak, com
uma leitura qualitativa do Rafael sobre o seu ritmo — é a versão do jogo
pra uma review de performance de verdade. Só leitura, Enter volta pro menu.

---

## 8. Enquanto o QA revisa, siga em frente

Igual no trampo de verdade: uma revisão pode demorar (o QA simulado leva de
minutos a até uns dois dias; uma PR de verdade também). Em vez de ficar
esperando parado, se o seu lote tem mais de um projeto, é só começar o
próximo direto — nenhum comando especial pra "guardar o lugar":

```
> revisar 1        (manda o projeto 1 pro QA — ele sai de "ativo")
> start 2           (liga o cronômetro no projeto 2, sem perder nada do 1)
```

Quando quiser conferir se o QA já respondeu o projeto que ficou esperando,
`ver <nº>` mostra o status dele a qualquer momento — não precisa "voltar"
pra ele, ele continua no board.

**Se todo o lote travar no QA ao mesmo tempo** (nada pra iniciar, nada
aprovado esperando `concluir`), o painel avisa e sugere ir pra
**[5] Trilha de Estudos** — é uma boa hora pra estudar em vez de ficar só
esperando.

---

## 9. Consequências de atraso

A penalidade **não espera a entrega** — ela acontece na hora em que o
estouro rola (hora do projeto ativo, ou dias do lote inteiro), e escala a
cada vez que se repete na mesma sprint:

| Estouro (o que aconteceu) | Consequência |
|---|---|
| 1ª reestimativa na sprint (horas do projeto ou dias do lote) | -5 XP + 1 aviso |
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

**Ctrl+C pausa, mas não salva.**
O tempo ativo do projeto fica guardado em memória, mas só vai pro disco de
verdade com `commit <mensagem>` (ou `concluir`, que salva sozinho). Saiu
sem commitar? Na próxima vez que abrir, o jogo volta pro último commit.

---

Boa sorte, Dev. O time está esperando sua primeira entrega.
