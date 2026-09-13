# DEVTECH SISTEMAS S.A.
## Integração: Plataforma de Liderança Técnica

> PROJETO FINAL: O CTO nomeou você Tech Lead sênior da nova plataforma de pagamentos. Você precisa integrar análise de código, documentação de decisões, planejamento de sprint e dimensionamento de sistema em um único fluxo de trabalho.

---
### Contexto

A DevTech está construindo sua plataforma de pagamentos — o produto mais crítico da empresa. Como Tech Lead, você é responsável por garantir qualidade de código (gate no CI), rastreabilidade das decisões de arquitetura (ADRs), planejamento de sprint baseado em dados (estimativas calibradas) e capacidade de infraestrutura dimensionada corretamente. Este projeto integra todas as ferramentas criadas no Sênior III em uma única API de liderança técnica.

**Nível:** Sênior III
**Sprint:** Sênior III — Tech Lead Integrador
**Estimativa:** 2h 30m
**Prioridade:** Alta

---
### O que fazer
- [ ] Criar o arquivo `techlead.js`
- [ ] Importar módulos dos projetos 02, 03, 04 e 05
- [ ] Implementar a classe `TechLead` com todos os métodos
- [ ] Garantir que `relatorioTecnico()` formata corretamente todas as seções
- [ ] Fazer todos os testes passarem (`npm test`)

---
### Arquivo a criar
`techlead.js`

---
### Especificação

#### Imports obrigatórios
```js
const { criarSistemaADR } = require('../02-sistema-adr/adr');
const { Revisor, regraTamanhoCodigo, regraVarProibido, regraConsoleLog, regraNomesClaros } = require('../03-revisor-codigo/revisor');
const { HistoricoSprints, Estimador } = require('../04-estimador-sprints/estimador');
const { calcularCapacidade, estimarArmazenamento } = require('../05-system-design/design');
```

#### `class TechLead`

```js
const lead = new TechLead();
```

O constructor deve inicializar:
- `this.sistemaADR` via `criarSistemaADR()`
- `this.revisor` via `new Revisor([regraTamanhoCodigo(), regraVarProibido(), regraConsoleLog(), regraNomesClaros()])`
- `this.historico` via `new HistoricoSprints()`
- `this.estimador` via `new Estimador(this.historico)`

#### `avaliarCodigo(codigo, nomeArquivo)`
Delega para `this.revisor.analisar(codigo, nomeArquivo)`.

```js
const resultado = lead.avaliarCodigo('var x = 1;', 'app.js');
// mesmo retorno de Revisor.analisar
```

#### `documentarDecisao(dados)`
Delega para `this.sistemaADR.criar(dados)`.

```js
const adr = lead.documentarDecisao({ titulo: 'Usar Redis', contexto: '...', ... });
// retorna ADR criada
```

#### `planejarSprint(tarefas, capacidadeH)`
Delega para `this.estimador.estimarSprint(tarefas, capacidadeH)`.

#### `registrarSprintReal(dados)`
Delega para `this.historico.registrar(dados)`.

#### `projetarCapacidade(config)`
Chama `calcularCapacidade(config)` e `estimarArmazenamento(config)` e retorna objeto combinado:
```js
{
  capacidade: { /* resultado de calcularCapacidade */ },
  armazenamento: { /* resultado de estimarArmazenamento */ }
}
```
`config` deve ter todos os campos necessários para ambas as funções.

#### `relatorioTecnico()`
Retorna string formatada com separadores ASCII:

```
================================================
           RELATÓRIO TÉCNICO — DEVTECH
================================================

--- HISTÓRICO DE SPRINTS ---
Sprints registradas: 3
Velocidade média: 8.0 tarefas/sprint
Precisão média: 1.25x (equipe leva 1.25x o estimado)
Tendência: estável

--- ADRs RECENTES (últimas 3) ---
[ADR-003] Adotar Redis — status: aceita
[ADR-002] Migrar para microsserviços — status: proposta
[ADR-001] Escolher PostgreSQL — status: aceita

--- SEM DADOS ---
(Registre sprints e ADRs para ver o relatório completo)

================================================
```

Se não houver sprints registradas, exiba `"Nenhuma sprint registrada ainda."` na seção de histórico.
Se não houver ADRs, exiba `"Nenhuma ADR registrada ainda."`.

---
### Como testar
```bash
cd /workspaces/trainning-programming/projects/senior-3/06-tech-lead-integrador
npm install
npm test
```

> Atenção: os módulos dos projetos 02-05 precisam existir. Os testes deste projeto usam `require('../02-sistema-adr/adr')` etc. Certifique-se de que os outros projetos foram implementados antes de rodar os testes deste.

---
### Dicas (tente sozinho antes de usar)

**avaliarCodigo e documentarDecisao:**
- Estes métodos são basicamente wrappers — você já implementou a lógica nos outros projetos.
- O constructor é o lugar mais importante: inicialize tudo corretamente.

**projetarCapacidade:**
- Como você combina dois objetos em um? `{ capacidade: ..., armazenamento: ... }`
- E se `config` não tiver todos os campos? Deixe as funções lançar erros normalmente.

**relatorioTecnico:**
- Como você pega as últimas 3 ADRs da lista? Pense em `slice(-3).reverse()`.
- Template literals com `\n` e separadores `---` tornam o relatório legível.

---
### Tarefas sugeridas para o Sprint
```
add Criar techlead.js com imports corretos
add Implementar constructor com inicialização de todos os módulos
add Implementar avaliarCodigo delegando ao Revisor
add Implementar documentarDecisao delegando ao sistemaADR
add Implementar planejarSprint e registrarSprintReal
add Implementar projetarCapacidade combinando os dois cálculos
add Implementar relatorioTecnico com formatação ASCII
add Fazer todos os testes passarem
```
