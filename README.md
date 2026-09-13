# DevTech Sistemas S.A.
### Simulador de Carreira — Engenheiro de Software Fullstack JavaScript

---

Você acabou de ser contratado como **Estagiário** na DevTech Sistemas S.A.

A empresa tem projetos reais, um time com personalidade própria e sprints com prazo.
Seu objetivo: evoluir de Estagiário até **Sênior III**, entregando projetos, passando em testes
e sendo promovido pelo Tech Lead.

Tudo via terminal. Sem interface gráfica. Como deve ser.

---

## Início rápido

```bash
node devtech.js
```

Um arquivo. Todas as telas. Navegue com ↑↓ e Enter.

### Resetar o progresso

Quer voltar tudo ao estado inicial (nome, XP, sprint, mensagens e projetos marcados como entregues)?

```bash
npm run resetar
```

Pede confirmação antes de apagar. Para pular a confirmação (ex.: scripts/CI): `npm run resetar -- -y`.
Se o simulador estiver rodando, feche-o antes para o reset ter efeito completo.

---

## Estrutura do repositório

```
/
├── devtech.js         ← PONTO DE ENTRADA — executa tudo
├── src/               ← módulos internos (não execute diretamente)
│   ├── empresa.js
│   ├── sprint.js
│   ├── dev.js
│   ├── projetos.js
│   └── aulas.js
│
├── projects/
│   ├── estagiario/     ← 30 mini-projetos (Fase 1 completa, ver abaixo)
│   │   ├── 01-mensagens-onboarding/
│   │   ├── 02-guia-preparo-pedido/
│   │   ├── ...
│   │   └── 30-integrador-fase1/       ← projeto final do nível
│   └── trainee/ junior-1/ ... senior-3/   ← ainda "aguardando novo cliente"
│
├── .devtech/          ← dados internos do sistema
│   ├── sprint.json    ← estado da sprint atual
│   ├── progress.json  ← seu XP e nome
│   └── aulas.md       ← trilha completa de estudos
│
└── docs/
    └── plan.md        ← guia do sistema (para o Claude)
```

---

## Níveis de carreira

```
Estagiário → Trainee → Junior I → II → III → Pleno I → II → III → Sênior I → II → III
```

Cada nível tem vários mini-projetos (3 por tópico da fase de estudo correspondente do
`aulas.md`) — no Estagiário são 30, do "Hello World" até o projeto integrador final. O
último projeto de cada nível é sempre o integrador — o mais importante, mistura tudo que
foi praticado na fase inteira.
Promoções são feitas pelo Claude (seu Tech Lead e QA) quando você conclui todos os projetos.

---

## Comandos do Painel de Sprint

| Comando | O que faz |
|---|---|
| `projeto` | Atribui o próximo projeto pendente do seu nível — já traz sprint (dias corridos conforme o nível) e backlog do README, cada tarefa com o tempo inteiro pra ela |
| `ver <id>` | Mostra o título completo da tarefa (as colunas do quadro cortam títulos longos) |
| `start <id>` | Move a tarefa pra DESENVOLVENDO e zera o timer dela (bloqueado se outra tarefa já estiver ativa) |
| `revisar <id>` | Manda a tarefa pra EM REVISÃO com o QA — timer pausa até ele responder |
| `rm <id>` | Remove tarefa |
| `concluir` | Entrega o projeto — só libera com **todo** o backlog concluído e aprovado |
| `pausar` / `retomar` | Pausa ou retoma o timer da tarefa ativa |
| `inicio` | Reinicia o timer da tarefa ativa |
| Enter | Atualiza a tela e os timers |
| Ctrl+C | Sai |

Não existe comando pra definir nome de sprint, estimativa ou tarefa na
mão — tudo isso vem do README via `projeto`. Só dá pra ter **uma tarefa
em andamento por vez**: `start` numa segunda tarefa antes da atual ser
aprovada é bloqueado ("[QA] Termina a #X antes de começar outra").

## Simulador vivo: três relógios + prática diária

- **Horas ativas — por tarefa.** O QA passa uma tarefa de cada vez, e
  cada uma ganha o **tempo inteiro do README** (não é dividido entre as
  tarefas do backlog — dividir deixaria cada uma com poucos minutos, o
  que pressiona demais quem ainda tá aprendendo). Estourou o tempo de uma
  tarefa? O QA renegocia mais tempo pra ela sozinho, mas isso registra um
  **aviso de desempenho** e tira XP (-5 na 1ª vez na sprint, -10 na 2ª,
  escalando).
- **Prazo da sprint — do projeto inteiro.** Dias **corridos** (7 a 15,
  conforme o nível — veja o TUTORIAL), contando mesmo com o app fechado
  (é sprint de verdade, não sessão de terminal). Estourou o prazo? Mesma
  consequência: QA ganha +7 dias, mas vira aviso + XP.
- **Prática diária** — passou um dia inteiro sem abrir o simulador? Isso
  conta como falta de verdade: aviso de desempenho, XP perdido, e o
  streak de dias seguidos (visível na Ficha do Desenvolvedor) reseta.

Nenhum desses estouros trava o jogo — mas todos custam caro no seu
histórico, igual aconteceria num trampo de verdade.

O QA aprova ou reprova cada tarefa em revisão sozinho, depois de alguns
segundos: aprovada vai pra CONCLUÍDO (+25 XP); reprovada volta pra
DESENVOLVENDO pra ajustar e mandar de novo.

---

## Como funciona um projeto

Cada projeto em `projects/estagiario/NN-nome/` tem:

- **`README.md`** — cenário da empresa, o que fazer e tarefas sugeridas
- **`test/`** — testes Jest já escritos. Começam falhando — você faz passarem
- **`package.json`** — configuração Jest

Você cria o arquivo de implementação (ex: `financeiro.js`) do zero.

```bash
# Dentro da pasta do projeto:
npm install
npm test      # falha até você implementar
# ... implementa ...
npm test      # passa = projeto resolvido
```

---

## Pedindo promoção

Quando terminar todos os projetos do nível atual:

1. No menu **Quadro de Projetos** — confirme que todos estão como `[ENTREGUE]`
2. Abra o chat do **Claude Code** e diga: **"Terminei os projetos de Estagiário, pode avaliar?"**
3. O Claude Code revisa e, se aprovado, cria os projetos do próximo nível

---

## GitHub Copilot como QA

O repositório tem um arquivo `.github/copilot-instructions.md` que configura
o GitHub Copilot Chat para agir como **QA Ana** — analista de qualidade da DevTech.

**O que o Copilot pode fazer:**
- Explicar erros do terminal e do Jest
- Explicar conceitos de JavaScript
- Apontar onde a lógica está errada
- Guiar com perguntas sem entregar a resposta

**O que o Copilot não pode fazer:**
- Escrever código de implementação
- Entregar a solução pronta

Se ele tentar escrever código, diga: *"Não escreve código, só me explica."*

---

## Gitflow — como usar branch nesse jogo

O jogo pratica o modelo clássico de Gitflow (`main` / `develop` /
`feature/*` / `release/*` / `hotfix/*`), adaptado pro fato de que este
repositório é **compartilhado** — várias pessoas usam a mesma `main`
como template, então ninguém deveria commitar direto nela.

| Papel no Gitflow | Aqui neste repo compartilhado |
|---|---|
| `main` (produção) | O template limpo — **nunca commite aqui** |
| `develop` (integração) | Sua branch pessoal `dev/seu-nome` faz esse papel |
| `feature/*` (por tarefa) | `feature/<projeto>`, cortada da sua `dev/seu-nome` |
| `release/*` (fechando versão) | Pratique ao ser promovido de nível (veja abaixo) |
| `hotfix/*` (correção urgente) | Conceitual por enquanto — sem gatilho no jogo ainda |

```bash
# Começar uma nova sessão (primeira vez ou recomeço)
git checkout main
git checkout -b dev/seu-nome

# A cada projeto novo, corta uma feature a partir da sua dev/seu-nome
git checkout -b feature/calculadora-financeira

# ...implementa, testa, QA aprova (revisar <nº> no jogo)...

# Fecha a feature de volta na sua branch pessoal
git checkout dev/seu-nome
git merge feature/calculadora-financeira

# Quer recomeçar do zero?
git checkout main
git branch -D dev/seu-nome
git checkout -b dev/seu-nome
```

**O simulador confere isso pra você (só leitura, nunca mexe sozinho).**
Ao dar `start` numa tarefa, ele roda `git branch --show-current` e avisa
(pelo `[LEAD]`, sem bloquear) se você não estiver na `feature/*` esperada.
No `concluir`, avisa pra fazer o merge de volta. **Ele nunca cria, troca
ou commita uma branch por você** — só lê e avisa, o resto é sua prática.
Isso funciona **sem internet**: `git branch`/`checkout`/`merge`/`commit`
são operações locais, não dependem de rede nem de GitHub.

**Promoção de nível = hora da "release".** Ao subir de nível, o jogo
sugere (via mensagem do Lead) abrir uma `release/<nível>` a partir da sua
`dev/seu-nome`, validar tudo, e mergear de volta — o mesmo espírito de
uma release real, só que fechando na sua própria branch (já que a `main`
compartilhada não é sua pra mexer).

Dados de progresso (XP, sprint, mensagens) ficam em `.devtech/` e **não são commitados**.
O que vai para o git é apenas o código que você implementa nos projetos.

**Commit é manual, de propósito.** O simulador nunca commita por você — é
o QA (Copilot ou o `[QA]` do próprio jogo) quem avisa "pode commitar",
mas quem escreve a mensagem e roda `git commit` é você. Faz parte do
que se está praticando.

**Pull Request é opcional e por sua conta.** Isso depende de um remoto
(GitHub) configurado, então só faz sentido se você tiver o seu próprio
fork/repositório. Não abra PR contra este repositório — a `main` aqui é
o template limpo que outras pessoas também usam pra começar do zero. Se
você tem seu próprio fork, pode ir além do que o jogo confere: dar
`push` na feature e abrir um PR de verdade contra o seu fork, pra
praticar revisão de código também — mas isso é 100% sua escolha, o
simulador não espera nem cobra isso.

## GitHub (simulado) — `[6]` no menu

Uma tela dentro do simulador que apresenta o que você já está fazendo no
vocabulário de uma plataforma de versionamento — **não é conectada a um
GitHub de verdade**, é só outra visão dos mesmos dados do backlog:

| Aba | O que mostra |
|---|---|
| **Issues** | Cada tarefa do backlog vira uma issue: número, título, `OPEN`/`CLOSED` |
| **Pull Requests** | Cada tarefa que já foi `revisar`-izada vira um PR: número, qual issue fecha, e o estado — `ABERTO`, `MUDANÇAS SOLICITADAS` (reprovada, voltou pra dev) ou `MERGEADO` |
| **Actions** | Histórico de toda tentativa de `concluir` — cada rodada de `npm test` vira um "workflow run", `success` ou `failure`, com data/hora |

Troque de aba com `1`/`2`/`3`, role com `↑↓`. É só leitura — pensada pra
fixar o vocabulário (issue, PR, CI) que você vai usar em qualquer time
de verdade, sem precisar de conta no GitHub nem de internet.

### O que precisa de internet (e o que não precisa)

| Parte | Precisa de rede? |
|---|---|
| O simulador (`devtech.js`) | **Não** — roda 100% local, sempre |
| `git commit` | **Não** — operação local |
| `npm test` (depois de instalado) | **Não** |
| `npm install` de um projeto novo | **Sim**, só na primeira vez (baixa as dependências) |
| GitHub Copilot Chat | **Sim**, sempre — é um serviço hospedado |
| `git push` / abrir PR | **Sim**, e precisa de remoto configurado |

Ou seja: dá pra jogar, implementar e commitar 100% offline **depois**
que as dependências de cada projeto já estiverem instaladas uma vez.
Sem internet, só fica de fora o QA do Copilot e a instalação inicial.

---

## Divisão de responsabilidades

| Ferramenta | Papel |
|---|---|
| **GitHub Copilot** | QA do dia a dia — tira dúvidas, explica erros, guia sem dar o código |
| **Claude Code** | Manutenção do simulador — bugs no sistema, novos projetos, promoção de nível |

---

> Leia o `TUTORIAL.md` para um passo a passo do primeiro projeto.
