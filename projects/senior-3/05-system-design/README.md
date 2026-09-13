# DEVTECH SISTEMAS S.A.
## Arquitetura: Calculadora de Capacidade e System Design

> URGENTE: A campanha de Black Friday gerou 10x mais tráfego do que o esperado e o sistema ficou fora do ar por 4 horas. A diretoria exige um relatório de capacidade e um plano de redesenho para a próxima semana.

---
### Contexto

O sistema de e-commerce da DevTech foi dimensionado para 100 req/s em produção. Durante a campanha, atingiu 1.200 req/s e colapsou. A infraestrutura atual tem 2 servidores, sem cache, sem fila de mensagens, sem balanceador de carga. O Tech Lead precisa de cálculos de capacidade reais e uma documentação de arquitetura alvo para apresentar à diretoria.

**Nível:** Sênior III
**Sprint:** Sênior III — System Design
**Estimativa:** 2h
**Prioridade:** Alta

---
### O que fazer
- [ ] Criar o arquivo `design.js`
- [ ] Implementar `calcularCapacidade({ requisicoesPorSeg, latenciaMediaMs, disponibilidade })`
- [ ] Implementar `estimarArmazenamento({ usuariosAtivos, tamanhoMedioRegistroKB, crescimentoDiarioPct })`
- [ ] Implementar a classe `ArquiteturaDocumentada`
- [ ] Fazer todos os testes passarem (`npm test`)

---
### Arquivo a criar
`design.js`

---
### Especificação das funções

#### `calcularCapacidade({ requisicoesPorSeg, latenciaMediaMs, disponibilidade })`
Retorna métricas de capacidade para o sistema:

```js
calcularCapacidade({ requisicoesPorSeg: 1000, latenciaMediaMs: 200, disponibilidade: 99.9 });
// {
//   servidoresNecessarios: Math.ceil(1000 * 200 / 1000),  // = 200
//   armazenamentoDiarioGB: Math.round(1000 * 86400 * 0.5 / 1024 / 1024 * 10) / 10,
//   bandaLarguraMbps: Math.round(1000 * 0.5 * 8 / 1000 * 10) / 10,
//   sla: {
//     disponibilidade: 99.9,
//     downTimeDiarioMin: Math.round((1 - 99.9 / 100) * 1440 * 10) / 10
//   }
// }
```

Fórmulas:
- `servidoresNecessarios = Math.ceil(requisicoesPorSeg * latenciaMediaMs / 1000)` — Lei de Little
- `armazenamentoDiarioGB = Math.round(requisicoesPorSeg * 86400 * 0.5 / 1024 / 1024 * 10) / 10` (0.5KB por req)
- `bandaLarguraMbps = Math.round(requisicoesPorSeg * 0.5 * 8 / 1000 * 10) / 10` (KB → Mbps)
- `downTimeDiarioMin = Math.round((1 - disponibilidade / 100) * 1440 * 10) / 10`

#### `estimarArmazenamento({ usuariosAtivos, tamanhoMedioRegistroKB, crescimentoDiarioPct })`
Calcula crescimento composto de armazenamento:

```js
estimarArmazenamento({ usuariosAtivos: 10000, tamanhoMedioRegistroKB: 2, crescimentoDiarioPct: 1 });
// {
//   mes1GB: ...,    // após 30 dias de crescimento composto
//   mes6GB: ...,    // após 180 dias
//   mes12GB: ...    // após 360 dias
// }
```

Base inicial em GB: `usuariosAtivos * tamanhoMedioRegistroKB / 1024 / 1024`
Crescimento composto: `base * (1 + crescimentoDiarioPct/100)^dias`
Arredonde a 2 casas decimais.

#### `class ArquiteturaDocumentada`
```js
const arq = new ArquiteturaDocumentada('E-commerce DevTech');

arq.adicionarComponente('API Gateway', 'gateway', 'Ponto de entrada único');
arq.adicionarComponente('Serviço de Pedidos', 'service', 'Processa pedidos');
arq.adicionarComponente('PostgreSQL', 'database', 'Banco principal');
arq.adicionarComponente('Redis', 'cache', 'Cache de sessão');

arq.conectar('API Gateway', 'Serviço de Pedidos', 'HTTP');
arq.conectar('Serviço de Pedidos', 'PostgreSQL', 'TCP');
arq.conectar('Serviço de Pedidos', 'Redis', 'TCP');

arq.adicionarTradeoff('Redis aumenta complexidade ops', 'disponibilidade');

const doc = arq.documentar();
// {
//   nome: 'E-commerce DevTech',
//   componentes: [...],
//   conexoes: [...],
//   tradeoffs: [...]
// }

console.log(arq.exportarTexto());
// "=== E-commerce DevTech ===
//
// Componentes:
// [gateway] API Gateway — Ponto de entrada único
// [service] Serviço de Pedidos — Processa pedidos
// ...
//
// Conexões:
// API Gateway → Serviço de Pedidos (HTTP)
// Serviço de Pedidos → PostgreSQL (TCP)
// ...
//
// Tradeoffs:
// [disponibilidade] Redis aumenta complexidade ops"
```

Tipos válidos de componente: `'service'|'database'|'cache'|'queue'|'gateway'|'client'`
Protocolos válidos: `'HTTP'|'gRPC'|'async'|'TCP'`
Impactos de tradeoff: `'performance'|'escalabilidade'|'consistencia'|'disponibilidade'`

---
### Como testar
```bash
npm install
npm test
```

---
### Dicas (tente sozinho antes de usar)

**calcularCapacidade:**
- A Lei de Little diz que N = λ × W, onde λ é a taxa de chegada e W é o tempo médio de serviço. Como isso se aplica aos servidores?
- Por que dividimos por 1000 na fórmula de servidores (latência está em ms)?

**estimarArmazenamento:**
- Crescimento composto: se você tem X hoje e cresce 1% ao dia, amanhã tem X * 1.01. Como você calcula isso para 30 dias?
- `Math.pow(base, expoente)` ou o operador `**` podem ajudar.

**ArquiteturaDocumentada:**
- Como você mantém listas de componentes, conexões e tradeoffs? Arrays no constructor?
- `exportarTexto` pode usar template literals com `\n` para separar seções.

---
### Tarefas sugeridas para o Sprint
```
add Criar design.js
add Implementar calcularCapacidade com Lei de Little
add Implementar estimarArmazenamento com crescimento composto
add Implementar ArquiteturaDocumentada.adicionarComponente e conectar
add Implementar adicionarTradeoff, documentar e exportarTexto
add Fazer todos os testes passarem
```
