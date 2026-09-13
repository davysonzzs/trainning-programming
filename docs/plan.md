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

Esc em qualquer tela volta ao menu. Ctrl+C sai (pausa a sprint automaticamente).

---

## Estrutura de pastas

```
devtech.js              ← PONTO DE ENTRADA — executa tudo
src/
├── empresa.js          ← módulo interno (não execute diretamente)
├── sprint.js           ← módulo interno
├── dev.js              ← módulo interno
├── projetos.js         ← módulo interno
└── aulas.js            ← módulo interno
.devtech/
├── progress.json       ← XP, nome, avisos, atrasos (não edite manualmente)
├── sprint.json         ← estado da sprint ativa
├── messages.json       ← histórico de mensagens dos NPCs
└── aulas.md            ← trilha de estudos (14 fases)
.github/
└── copilot-instructions.md  ← configura Copilot como QA Ana
projects/
├── estagiario/         ← 6 projetos
├── trainee/            ← 6 projetos
├── junior-1/           ← 6 projetos
├── junior-2/           ← 6 projetos
├── junior-3/           ← 6 projetos
├── pleno-1/            ← 6 projetos
├── pleno-2/            ← 6 projetos
├── pleno-3/            ← 6 projetos
├── senior-1/           ← 6 projetos
├── senior-2/           ← 6 projetos
└── senior-3/           ← 6 projetos
```

---

## Fluxo de trabalho por projeto

1. Abrir `node devtech.js` → Menu → **Quadro de Projetos** para ver o próximo projeto
2. Ler `projects/<nivel>/NN-nome/README.md` — cenário, spec e dicas
3. No menu → **Painel de Sprint**:
   - `projeto estagiario/01-calculadora-financeira`
   - `sprint "Estagiário — Calculadora Financeira"`
   - `estimativa 1.5`
   - `add <tarefa>` para cada subtarefa
   - `start <id>` / `done <id>` (+25 XP por tarefa)
4. Criar o arquivo de implementação na pasta do projeto
5. Testar: `cd projects/<nivel>/<projeto> && npm install && npm test`
6. Quando todos os testes passarem: voltar ao sprint, digitar `concluir`
   - O sistema roda `npm test` automaticamente antes de aceitar a entrega
   - Se sprint estourada: penalidade de XP aplicada automaticamente

---

## Mecânica de Sprint Timeout

| Limiar | Evento |
|---|---|
| **80%** do estimado | PM Marcos avisa no chat; ícone ⚡ no timer |
| **100%** (estourou) | Lead Rafael cobra; banner ⚠ ESTOURADA; Esc desativado temporariamente |
| **Entrega atrasada (100–200%)** | -10 XP na entrega; sprint registrada como atrasada |
| **Entrega com atraso grave (200%+)** | -20 XP; +1 aviso de desempenho em `progress.json` |

Avisos de desempenho ficam visíveis na **Ficha do Desenvolvedor**.

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

| Comando | O que faz |
|---|---|
| `sprint <nome>` | Renomeia e inicia o timer |
| `estimativa <h>` | Define estimativa (ex: `estimativa 1.5`) |
| `inicio` | Inicia timer sem renomear |
| `add <titulo>` | Adiciona tarefa ao backlog |
| `start <id>` | Move para Em Andamento |
| `done <id>` | Conclui tarefa (+25 XP) |
| `rm <id>` | Remove tarefa |
| `pausar` | Pausa o timer (salva tempo) |
| `retomar` | Retoma o timer |
| `projeto <pasta>` | Define projeto ativo (ex: `estagiario/01-...`) |
| `concluir` | Roda testes e entrega o projeto |
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
