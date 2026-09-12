# 01 — Gerenciador de Estado

**Nível:** Junior III
**Sprint:** Junior III — Gerenciador de Estado
**Estimativa:** 2h

---

## Contexto

O React usa `useState` e `useAtom` (Jotai) para gerenciar estado reativo em componentes. Como o simulador da DevTech roda 100% no terminal, você vai implementar os **mesmos padrões** em JavaScript puro — sem React, sem browser. O objetivo é entender a mecânica de estado reativo que está por trás de qualquer framework.

Este módulo é a base de todos os outros projetos do nível Junior III.

---

## O que fazer

Crie o arquivo `estado.js` exportando a função `criarEstado` e a classe `Atom`.

---

## Arquivo a criar

```
estado.js
```

---

## Especificação

### Função `criarEstado(inicial)`

Retorna um array `[getState, setState]`:

| Função | Comportamento |
|--------|--------------|
| `getState()` | Retorna o estado atual |
| `setState(novoValor)` | Se `novoValor` for uma função, chama com o estado atual e usa o retorno como novo estado. Se for valor direto, substitui. Depois notifica todos os subscribers |
| `subscribe(fn)` | Registra listener chamado com `(novoEstado, estadoAnterior)` após cada `setState`. Retorna função `unsubscribe` que remove o listener |

### Classe `Atom`

Estado atômico com suporte a derivação:

**Constructor:** `constructor(valorInicial)`

| Método | Comportamento |
|--------|--------------|
| `get()` | Retorna valor atual |
| `set(valor)` | Atualiza (aceita valor direto ou função atualizadora). Notifica subscribers |
| `subscribe(fn)` | Registra listener, retorna `unsubscribe` |
| `derive(fn)` | Retorna novo `Atom` que se atualiza automaticamente quando este Atom muda. O valor do Atom derivado é `fn(valorAtual)` |

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- `criarEstado` é semelhante ao `useState` do React — a diferença é que aqui você chama `getState()` em vez de usar a variável diretamente
- Para `setState` com função: `if (typeof novoValor === 'function') { novoEstado = novoValor(estadoAtual); }`
- `subscribe` deve retornar uma função que, quando chamada, remove o listener do array (use `filter` ou `splice`)
- Para `Atom.derive(fn)`: crie um novo Atom com `fn(this.get())` como valor inicial. Registre um subscriber no Atom original que chama `atomDerivado.set(fn(novoValor))` a cada mudança
- Por que o `setState` do React também aceita função? Para evitar problemas com estado desatualizado em closures assíncronas

---

## Tarefas para o Sprint

- [ ] Criar `estado.js` com a função `criarEstado`
- [ ] Implementar `getState` retornando estado atual
- [ ] Implementar `setState` com suporte a função atualizadora
- [ ] Implementar `subscribe` com retorno de `unsubscribe`
- [ ] Criar classe `Atom` com `get`, `set`, `subscribe`
- [ ] Implementar `Atom.derive` criando Atom computado
- [ ] Garantir que `unsubscribe` remove o listener corretamente
- [ ] Rodar `npm test` e garantir que todos os testes passam
