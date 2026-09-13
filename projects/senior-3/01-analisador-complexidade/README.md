# DEVTECH SISTEMAS S.A.
## Ferramenta: Analisador de Complexidade de Algoritmos

> URGENTE: O Tech Lead precisa de dados empíricos sobre 3 implementações de busca antes da reunião de arquitetura de amanhã. Sem dados, a decisão será tomada no chute.

---
### Contexto

A DevTech tem um módulo de busca crítico que processa 2 milhões de registros por dia. Três desenvolvedores implementaram abordagens diferentes (busca linear, binária e com índice hash), mas ninguém mediu o desempenho real. O time discute há duas semanas qual usar em produção. O CTO perdeu a paciência e exigiu benchmarks concretos até amanhã às 9h.

**Nível:** Sênior III
**Sprint:** Sênior III — Análise de Complexidade
**Estimativa:** 2h
**Prioridade:** Alta

---
### O que fazer
- [ ] Criar o arquivo `complexidade.js`
- [ ] Implementar `medirTempo(fn, args, repeticoes)`
- [ ] Implementar `compararAlgoritmos(implementacoes, casosDeTest)`
- [ ] Implementar `analisarCrescimento(fn, tamanhos)`
- [ ] Implementar a classe `Benchmark`
- [ ] Fazer todos os testes passarem (`npm test`)

---
### Arquivo a criar
`complexidade.js`

---
### Especificação das funções

#### `medirTempo(fn, args, repeticoes = 100)`
Executa `fn(...args)` por `repeticoes` vezes e retorna estatísticas de tempo em ms.

```js
const resultado = medirTempo((arr) => arr.sort(), [[3,1,2]], 50);
// resultado = { media: 0.02, min: 0.01, max: 0.05, p95: 0.04 }
```

- Use `Date.now()` antes e depois de cada execução individual
- `p95`: percentil 95 (ordena os tempos, pega o valor no índice `Math.floor(0.95 * repeticoes)`)
- Todos os valores devem ser números (podem ser 0 em ambiente muito rápido)

#### `compararAlgoritmos(implementacoes, casosDeTest)`
Compara múltiplos algoritmos nos mesmos casos de teste.

```js
const impls = {
  linear: (arr, val) => arr.indexOf(val),
  binaria: (arr, val) => /* busca binária */
};
const casos = [
  { args: [[1,2,3,4,5], 3], descricao: 'array pequeno' },
  { args: [Array.from({length:1000}, (_,i)=>i), 500], descricao: 'array médio' }
];
const resultado = compararAlgoritmos(impls, casos);
// resultado = {
//   'array pequeno': { vencedor: 'linear', tempos: { linear: 0.01, binaria: 0.02 } },
//   'array médio': { vencedor: 'binaria', tempos: { linear: 0.5, binaria: 0.1 } }
// }
```

#### `analisarCrescimento(fn, tamanhos)`
Executa `fn` com arrays gerados automaticamente de cada tamanho e infere complexidade.

```js
const resultado = analisarCrescimento(arr => arr.length, [100, 200, 400]);
// resultado = {
//   tamanhos: [100, 200, 400],
//   tempos: [0.01, 0.01, 0.01],
//   razoes: [null, 1.0, 1.0],
//   complexidadeInferida: 'O(1)'
// }
```

Regras de inferência (pela mediana das razões, ignorando null):
- razão média ~1 → `'O(1)'`
- razão ~2 com dobro de tamanho → `'O(n)'`
- razão ~4 → `'O(n²)'`
- razão entre 2 e 3 → `'O(n log n)'`

#### `class Benchmark`
```js
const bench = new Benchmark('busca');
bench.adicionar('linear', arr => arr.indexOf(999));
bench.adicionar('hash', arr => new Set(arr).has(999));
bench.executar([100, 1000, 10000]);
console.log(bench.relatorio());
// "=== Benchmark: busca ===
// Tamanho 100: linear=0.01ms | hash=0.05ms
// Tamanho 1000: linear=0.05ms | hash=0.10ms
// ..."
```

- `executar(tamanhos)`: para cada tamanho, gera `Array.from({length: n}, () => Math.random() * n | 0)` e roda cada implementação com `medirTempo`
- `relatorio()`: tabela ASCII com tamanho x implementação x tempo médio

---
### Como testar
```bash
npm install
npm test
```

---
### Dicas (tente sozinho antes de usar)

**medirTempo:**
- Como você calcularia o percentil 95 de um array de tempos? Pense em ordenar e pegar o índice certo.
- Por que é importante rodar a função muitas vezes em vez de só uma?

**compararAlgoritmos:**
- Como você identificaria qual implementação teve o menor tempo médio para cada caso?
- O que acontece se dois algoritmos tiverem o mesmo tempo?

**analisarCrescimento:**
- Se dobramos o tamanho do array e o tempo quadruplica, que complexidade isso sugere?
- Como você calcularia a razão entre o tempo atual e o anterior?

---
### Tarefas sugeridas para o Sprint
```
add Criar complexidade.js
add Implementar medirTempo com estatísticas
add Implementar compararAlgoritmos
add Implementar analisarCrescimento com inferência de Big O
add Implementar classe Benchmark com relatório
add Fazer todos os testes passarem
```
