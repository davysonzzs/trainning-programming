# 04 — Processador Stream

**Nível:** Junior II
**Sprint:** Junior II — Processador Stream
**Estimativa:** 2h

---

## Contexto

O pipeline de processamento de dados da DevTech precisa filtrar, transformar e agregar grandes volumes de registros. O problema atual é que cada operação cria um array intermediário na memória. O time quer uma abstração **lazy** — o processamento só acontece quando os dados são realmente necessários — similar ao conceito de Streams, mas implementado em JS puro com encadeamento de operações.

---

## O que fazer

Crie o arquivo `stream.js` exportando a classe `Stream` com os métodos de encadeamento.

---

## Arquivo a criar

```
stream.js
```

---

## Especificação

### Classe `Stream`

**Constructor:** `constructor(dados)`
- Internamente armazena uma função geradora/pipeline (não o array em si)
- A ideia é que `map`, `filter`, `take` retornem novas Streams compostas, sem executar nada ainda

| Método | Comportamento |
|--------|--------------|
| `map(fn)` | Retorna nova Stream aplicando `fn` a cada elemento |
| `filter(fn)` | Retorna nova Stream mantendo apenas elementos onde `fn(el)` é truthy |
| `reduce(fn, inicial)` | **Executa** o pipeline e acumula o resultado |
| `take(n)` | Retorna nova Stream com no máximo `n` elementos |
| `toArray()` | **Executa** o pipeline e retorna array com os elementos |
| `forEach(fn)` | **Executa** o pipeline chamando `fn` para cada elemento |

### Funções estáticas/auxiliares

| Função | Comportamento |
|--------|--------------|
| `Stream.from(dados)` | Factory: `Stream.from([1,2,3])` retorna nova Stream |
| `Stream.range(inicio, fim)` | Cria Stream com inteiros de `inicio` a `fim` (inclusive) |

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- A forma mais simples: armazene internamente uma função `_gerador` que retorna um array. Cada `map`/`filter` cria nova Stream com novo gerador que chama o anterior.
- `take(n)` pode usar `slice(0, n)` no array gerado — a "laziness" neste nível é conceitual (evitar múltiplas iterações externas)
- `reduce` e `toArray` são os pontos de "materialização" — eles chamam o pipeline interno
- `Stream.range(1, 5)` deve produzir `[1, 2, 3, 4, 5]`
- Por que lazy é melhor? Com 1 milhão de registros, `filter().map().take(10)` só processa o necessário para obter 10 resultados
- Encadeamentos devem ser imutáveis: cada chamada retorna uma **nova** Stream, não modifica a atual

---

## Tarefas para o Sprint

- [ ] Criar `stream.js` com a classe `Stream`
- [ ] Implementar `map` retornando nova Stream (lazy)
- [ ] Implementar `filter` retornando nova Stream (lazy)
- [ ] Implementar `take` limitando elementos
- [ ] Implementar `toArray` materializando o pipeline
- [ ] Implementar `reduce` para agregação
- [ ] Implementar `forEach` para efeitos colaterais
- [ ] Implementar `Stream.from` e `Stream.range`
- [ ] Rodar `npm test` e garantir que todos os testes passam
