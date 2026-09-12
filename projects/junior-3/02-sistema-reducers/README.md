# 02 — Sistema de Reducers

**Nível:** Junior III
**Sprint:** Junior III — Sistema de Reducers
**Estimativa:** 2h

---

## Contexto

O `useReducer` do React e o Redux compartilham o mesmo padrão: um **reducer** é uma função pura que recebe `(estado, action)` e retorna um novo estado — nunca modifica o original. Uma **store** centraliza o estado e garante que toda mudança passe pelo reducer. Você vai implementar esse padrão em JS puro para o módulo de carrinho de compras da DevTech.

---

## O que fazer

Crie o arquivo `reducers.js` exportando: `criarStore`, `combinarReducers`, `contadorReducer` e `listaReducer`.

---

## Arquivo a criar

```
reducers.js
```

---

## Especificação

### Função `criarStore(reducer, estadoInicial)`

Retorna objeto `{ getState, dispatch, subscribe }`:

| Método | Comportamento |
|--------|--------------|
| `getState()` | Retorna estado atual |
| `dispatch(action)` | Chama `reducer(estadoAtual, action)`, atualiza estado, notifica todos os subscribers com o novo estado |
| `subscribe(fn)` | Registra listener, retorna função `unsubscribe` |

### Função `combinarReducers(reducers)`

Recebe `{ chave: reducerFn, ... }` e retorna um reducer único que:
- Chama cada `reducerFn` com a fatia correspondente do estado
- Retorna novo estado combinado: `{ chave: novoValorDaFatia, ... }`

### Reducer `contadorReducer(estado = { valor: 0 }, action)`

| Action type | Comportamento |
|------------|--------------|
| `INCREMENT` | `valor + 1` |
| `DECREMENT` | `valor - 1` |
| `RESET` | `valor = 0` |
| `SET` | `valor = action.payload` |
| (outros) | retorna estado sem modificar |

### Reducer `listaReducer(estado = { itens: [] }, action)`

| Action type | Comportamento |
|------------|--------------|
| `ADD_ITEM` | Adiciona `action.payload` ao array de itens |
| `REMOVE_ITEM` | Remove item onde `item.id === action.payload` |
| `CLEAR` | Esvazia a lista |
| (outros) | retorna estado sem modificar |

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- Reducers devem ser **funções puras**: nunca use `push`, `splice` ou mutação direta. Use spread: `{ ...estado, valor: estado.valor + 1 }` e `[...estado.itens, action.payload]`
- Para `combinarReducers`, o estado combinado tem a forma `{ contador: { valor: 0 }, lista: { itens: [] } }`. Cada reducer recebe apenas sua fatia: `reducers.contador(estado.contador, action)`
- `dispatch` não precisa de await — o reducer é síncrono
- Por que reducers devem ser puros? Facilita testes (entrada → saída previsível) e permite implementar time-travel debugging
- Uma action é sempre `{ type: 'NOME', payload: valorOpcional }`

---

## Tarefas para o Sprint

- [ ] Criar `reducers.js` com a função `criarStore`
- [ ] Implementar `getState`, `dispatch` e `subscribe` na store
- [ ] Implementar `combinarReducers`
- [ ] Implementar `contadorReducer` com todas as actions
- [ ] Implementar `listaReducer` com todas as actions
- [ ] Garantir que reducers são puros (sem mutação)
- [ ] Testar `combinarReducers` com os dois reducers juntos
- [ ] Rodar `npm test` e garantir que todos os testes passam
