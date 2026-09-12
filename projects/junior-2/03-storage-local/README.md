# 03 — Storage Local

**Nível:** Junior II
**Sprint:** Junior II — Storage Local
**Estimativa:** 1h 30m

---

## Contexto

O dashboard interno da DevTech tem vários módulos (autenticação, preferências, cache de dados) que precisam guardar configurações em memória durante a execução. O time decidiu criar um `Storage` inspirado no `localStorage` do browser — mesma API, mas rodando no Node.js com suporte a **namespaces** para que um módulo não interfira no outro.

---

## O que fazer

Crie o arquivo `storage.js` exportando a classe `Storage` e a função factory `criarStorage`.

---

## Arquivo a criar

```
storage.js
```

---

## Especificação

### Classe `Storage`

**Constructor:** `constructor(namespace = 'default')`
- Armazena o namespace e cria um `Map` interno para os dados
- Chave interna é composta: `namespace:chave`

| Método | Comportamento |
|--------|--------------|
| `setItem(chave, valor)` | Serializa `valor` com `JSON.stringify` e armazena com chave `namespace:chave` |
| `getItem(chave)` | Busca pela chave prefixada, deserializa com `JSON.parse`. Retorna `null` se não existe |
| `removeItem(chave)` | Remove a chave prefixada. Retorna `true` se existia, `false` se não |
| `clear()` | Remove APENAS os itens do namespace atual (não apaga outros namespaces) |
| `length()` | Quantidade de itens do namespace atual |
| `keys()` | Array de chaves do namespace atual (sem o prefixo `namespace:`) |

### Função `criarStorage(namespace)`

Factory que retorna `new Storage(namespace)`.

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- A chave interna no Map deve ser `\`\${this.namespace}:\${chave}\`` — assim `auth:token` e `cache:token` não colidem
- `JSON.stringify` e `JSON.parse` funcionam para qualquer tipo JS: string, número, array, objeto, boolean
- Para `clear()`, itere sobre as chaves do Map e delete apenas as que começam com `\`\${this.namespace}:\``
- Para `keys()`, filtre as chaves do Map pelo prefixo e remova o prefixo antes de retornar
- Por que usar `Map` em vez de objeto `{}`? O `Map` preserva a ordem de inserção e tem métodos nativos de iteração
- Dois namespaces diferentes devem ser completamente isolados — um `clear()` não apaga o outro

---

## Tarefas para o Sprint

- [ ] Criar `storage.js` com a classe `Storage`
- [ ] Implementar `setItem` com serialização JSON e prefixo de namespace
- [ ] Implementar `getItem` com deserialização e retorno `null` quando ausente
- [ ] Implementar `removeItem` retornando boolean
- [ ] Implementar `clear` removendo apenas itens do namespace atual
- [ ] Implementar `length` e `keys` filtrados por namespace
- [ ] Implementar factory `criarStorage`
- [ ] Rodar `npm test` e garantir que todos os testes passam
