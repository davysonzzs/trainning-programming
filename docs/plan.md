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
├── estagiario/         ← 30 mini-projetos (Fase 1 do aulas.md — ver seção abaixo)
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

## Fluxo de trabalho por projeto

1. Abrir `node devtech.js` → Menu → **Quadro de Projetos** para ver o próximo projeto
2. Ler `projects/<nivel>/NN-nome/README.md` — cenário, spec e dicas
3. No menu → **Painel de Sprint**, digitar só `projeto` (sem argumento) — o QA atribui o
   próximo projeto pendente do nível atual, já com sprint, estimativa e backlog lidos
   direto do README (nada disso é digitado à mão — ver `add`/`sprint`/`estimativa`
   removidos do changelog em `UPDATES.md`)
4. `start <id>` na primeira tarefa do backlog (só uma ativa por vez, na ordem)
5. Criar o arquivo de implementação na pasta do projeto (nome exato no README, seção
   "Arquivo a criar") e rodar `npm install && npm test` até passar
6. `revisar <id>` manda pro QA — ele aprova (+25 XP, timer despausa) ou reprova sozinho
   depois de alguns segundos
7. Com todo o backlog `done`: `concluir` — roda `npm test` de novo e marca `.concluido`
   - Sprint estourada (tarefa ou prazo do projeto): penalidade de XP + aviso, aplicada na
     hora do estouro, não só na entrega (ver `UPDATES.md`)

---

## Plano: trilha completa por fase (para quando o usuário pedir a próxima)

A Fase 1 (`projects/estagiario/`) foi reconstruída em **30 mini-projetos** — 3 por
tópico da fase, do "Hello World" até o nível do antigo projeto único — porque o pulo de
"variáveis e operadores" direto pra "implementar 5 funções de regra de negócio" era
grande demais pra quem está começando agora. As fases 2 a 14 do `.devtech/aulas.md` ainda
não foram reconstruídas nesse formato — os níveis correspondentes têm só um
`README.md` placeholder ("aguardando novo cliente"). Quando o usuário pedir uma fase
nova, repetir exatamente este processo:

1. **Mapear a fase → nível.** Cada fase do `aulas.md` já tem um nível de carreira
   correspondente na tabela `LEVELS` de `devtech.js` (campo `fase`) — ex.: Fase 2 →
   Trainee, Fase 3 → Junior I. Usar a pasta `projects/<folder-do-nivel>/`.
2. **Contar os tópicos da fase** no `aulas.md` (cada linha `- Tópico: ...` sob o
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
6. **Todo README segue o template já usado**: Contexto → Nível/Sprint/Estimativa/
   Prioridade/Tópico da trilha → O que fazer (checklist) → Arquivo a criar → Especificação
   das funções → Como testar → Dicas (uma por função, nunca a resposta pronta) →
   Tarefas sugeridas para o Sprint (bloco ` ```add ...``` `, uma linha por tarefa — é o
   que popula o backlog sozinho via `extrairTarefas()`).
7. **Todo projeto precisa de teste real (Jest) e passar de fato.** Antes de considerar o
   nível pronto, escrever uma implementação de referência (fora do repositório, ex. numa
   pasta de sandbox) e rodar `npm test` contra os specs de cada mini-projeto — é assim que
   a Fase 1 pegou um bug de spec (função que dependia de campo não calculado ainda) antes
   de chegar no usuário. Specs ambíguos custam caro pra quem está aprendendo.
8. **`estimativaHoras` sempre no formato `Xh Ym`** no README (`parseEstimativaTexto` exige
   um dígito de hora — `0h 20m` funciona, `20m` sozinho não).
9. Ao terminar o nível, atualizar `README.md` (se algo do fluxo mudou), `UPDATES.md`
   (uma linha curta) e remover o placeholder "aguardando novo cliente" daquele nível.

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
