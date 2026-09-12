# PLAN — SISTEMA DE APRENDIZADO DEVTECH

## Como o sistema funciona

Este repositório simula o dia a dia numa empresa de software fictícia — **DevTech Sistemas S.A.**
O desenvolvedor (usuário) é um funcionário que evolui de Estagiário até Sênior III.

---

## Estrutura de pastas

```
projects/
├── 00-PROJECT/data/        ← dados do sprint, XP e mensagens (não edite manualmente)
├── estagiario/             ← projetos atuais (nível atual)
│   ├── 01-calculadora-financeira/
│   ├── 02-classificador-notas/
│   ├── 03-processador-pedidos/
│   ├── 04-cadastro-clientes/
│   ├── 05-buscador-estoque/
│   └── 06-relatorio-integrador/   ← projeto final do nível
├── trainee/                ← desbloqueado após promoção
├── junior-1/               ← desbloqueado após promoção
└── ...

aulas.md                    ← trilha completa de estudo
sprint.js                   ← painel de sprint (node sprint.js)
dev.js                      ← ficha do desenvolvedor (node dev.js)
```

---

## Fluxo de trabalho por projeto

1. Abrir o projeto em `projects/<nivel>/NN-nome/`
2. Ler o `README.md` — contém o cenário, o que fazer e as tarefas sugeridas
3. No terminal: `node sprint.js`
   - Renomear a sprint: `sprint "Estagiário — Nome do Projeto"`
   - Definir estimativa: `estimativa 2`
   - Adicionar as tarefas: `add <titulo>`
   - Trabalhar: `start <id>` quando começar uma tarefa, `done <id>` quando terminar (+25 XP)
4. Criar o arquivo de implementação (ex: `financeiro.js`) dentro da pasta do projeto
5. Rodar os testes: `cd projects/estagiario/01-calculadora-financeira && npm install && npm test`
6. Se os testes passarem e a sprint não tiver estourado: projeto concluído

---

## Regras de promoção

- Claude (QA/avaliador) decide a promoção — não é automática
- Para pedir promoção: conclua todos os projetos do nível atual e peça no chat
- Claude vai verificar: testes passando, tempo médio das sprints, qualidade do código
- Se a sprint estourar muito: praticar mais antes de pedir promoção
- O projeto `06-relatorio-integrador` de cada nível é o **projeto final** — o mais importante

---

## Como criar projetos para o próximo nível

Quando o usuário pedir promoção e Claude aprovar, Claude deve:

1. Criar pasta `projects/<proximo-nivel>/` (ex: `projects/trainee/`)
2. Criar 6 projetos no mesmo formato: README, package.json, test/
3. Os projetos devem cobrir os temas das aulas correspondentes ao novo nível
4. O projeto `06-*` deve ser um integrador mais complexo
5. Atualizar este arquivo com o novo nível

### Níveis e conteúdo das aulas (aulas.md)

A trilha completa de estudos está em `.devtech/aulas.md`.

- **Estagiário** → Fase 1 (Fundamentos: variáveis, condicionais, loops, funções, arrays, objetos)
- **Trainee** → Fase 2 (JS Moderno: ES6+, classes, promises, async/await)
- **Junior I** → Fase 3 + 4 (Ferramentas + HTML/CSS)
- **Junior II** → Fase 5 + 6 (DOM + React lógica)
- **Junior III** → Fase 6 completo (React avançado)
- **Pleno I** → Fase 7 (Node.js + Express + API REST)
- **Pleno II** → Fase 8 (Banco de dados)
- **Pleno III** → Fase 9 + 10 (Auth + Arquitetura)
- **Sênior I** → Fase 11 + 12 (Testes avançados + DevOps)
- **Sênior II** → Fase 13 (Sistemas distribuídos)
- **Sênior III** → Fase 14 (Liderança técnica + System Design)

---

## Papel do Claude (QA e avaliador)

- **Durante o projeto:** Responder dúvidas técnicas, pode adicionar explicações no README do projeto
- **Na entrega:** Revisar o código se o usuário compartilhar, avaliar qualidade
- **Na promoção:** Verificar se o usuário está pronto e criar os projetos do próximo nível

---

## Comandos do sprint.js

| Comando | O que faz |
|---|---|
| `sprint <nome>` | Renomeia e inicia o timer |
| `estimativa <h>` | Define estimativa em horas (ex: `estimativa 1.5`) |
| `inicio` | Inicia/reinicia o timer sem renomear |
| `add <titulo>` | Adiciona tarefa ao backlog |
| `start <id>` | Move para Em Andamento (inicia timer da tarefa) |
| `done <id>` | Conclui tarefa (+25 XP) |
| `rm <id>` | Remove tarefa |
| Enter | Atualiza a tela e os timers |
| Ctrl+C | Sai do sistema |
