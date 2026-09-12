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
# 1. Registre seu nome
node dev.js --name "Seu Nome"

# 2. Veja sua ficha de desenvolvedor
node dev.js

# 3. Veja os projetos disponíveis
node projetos.js

# 4. Abra o painel de sprint
node sprint.js
```

---

## As três telas

| Comando | O que é |
|---|---|
| `node sprint.js` | Painel de tarefas da sprint — onde você trabalha |
| `node dev.js` | Sua ficha: nível, XP, salário e progresso |
| `node projetos.js` | Quadro de missões — todos os projetos e status |

---

## Estrutura do repositório

```
/
├── sprint.js          ← painel de sprint (terminal interativo)
├── dev.js             ← ficha do desenvolvedor
├── projetos.js        ← quadro de projetos/missões
│
├── projects/
│   └── estagiario/    ← projetos do nível atual
│       ├── 01-calculadora-financeira/
│       ├── 02-classificador-notas/
│       ├── 03-processador-pedidos/
│       ├── 04-cadastro-clientes/
│       ├── 05-buscador-estoque/
│       └── 06-relatorio-integrador/   ← projeto final do nível
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

Cada nível tem 6 projetos. O **06** é sempre o projeto final — o mais importante.
Promoções são feitas pelo Claude (seu Tech Lead e QA) quando você conclui todos os projetos.

---

## Comandos do sprint.js

| Comando | O que faz |
|---|---|
| `sprint <nome>` | Nomeia a sprint e inicia o timer |
| `estimativa <h>` | Define duração esperada (ex: `estimativa 1.5`) |
| `projeto <pasta>` | Define o projeto ativo (ex: `projeto estagiario/01-calculadora-financeira`) |
| `add <titulo>` | Adiciona tarefa ao backlog |
| `start <id>` | Inicia uma tarefa (timer começa) |
| `done <id>` | Conclui tarefa (+25 XP) |
| `rm <id>` | Remove tarefa |
| `concluir` | Entrega o projeto ativo como concluído |
| `inicio` | Reinicia o timer da sprint |
| Enter | Atualiza a tela e os timers |
| Ctrl+C | Sai |

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

1. `node projetos.js` — confirme que todos estão como `[ENTREGUE]`
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

## Fluxo de branch — como usar o jogo

A branch `main` é o **template limpo** do jogo — sem progresso, sem dados.
Cada sessão de jogo vive numa branch própria.

```bash
# Começar uma nova sessão (primeira vez ou recomeço)
git checkout main
git checkout -b dev/seu-nome

# Jogar normalmente...

# Quer recomeçar do zero?
git checkout main
git branch -D dev/seu-nome
git checkout -b dev/seu-nome
```

Dados de progresso (XP, sprint, mensagens) ficam em `.devtech/` e **não são commitados**.
O que vai para o git é apenas o código que você implementa nos projetos.

---

## Divisão de responsabilidades

| Ferramenta | Papel |
|---|---|
| **GitHub Copilot** | QA do dia a dia — tira dúvidas, explica erros, guia sem dar o código |
| **Claude Code** | Manutenção do simulador — bugs no sistema, novos projetos, promoção de nível |

---

> Leia o `TUTORIAL.md` para um passo a passo do primeiro projeto.
