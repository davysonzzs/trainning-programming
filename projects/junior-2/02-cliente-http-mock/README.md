# 02 — Cliente HTTP Mock

**Nível:** Junior II
**Sprint:** Junior II — Cliente HTTP Mock
**Estimativa:** 2h

---

## Contexto

O time de qualidade da DevTech precisa de testes de integração que não dependam de servidor real. A ideia é criar um `ClienteHTTP` que simula o padrão `fetch` — com métodos `get`, `post` e `delete` assíncronos — mas opera sobre dados injetados no constructor. Assim os testes rodam sem nenhuma conexão de rede.

---

## O que fazer

Crie o arquivo `cliente.js` exportando a classe `ClienteHTTP` e a função auxiliar `tratarResposta`.

---

## Arquivo a criar

```
cliente.js
```

---

## Especificação

### Classe `ClienteHTTP`

**Constructor:** `constructor(baseUrl, opcoes = {})`
- Armazena `baseUrl` e `opcoes`
- Os dados simulados ficam em `opcoes.dados` (objeto onde cada chave é um endpoint sem a `/`, ex: `{ usuarios: [...], produtos: [...] }`)

**Métodos:**

| Método | Comportamento |
|--------|--------------|
| `async get(endpoint, params = {})` | Extrai a chave do endpoint (ex: `/usuarios` → `usuarios`), busca em `opcoes.dados`. Retorna `{ status: 200, dados: [...], ok: true }` se encontrado, ou `{ status: 404, dados: null, ok: false }` se não |
| `async post(endpoint, corpo)` | Se `corpo` for nulo/vazio/objeto vazio, retorna `{ status: 400, dados: null, ok: false }`. Senão, adiciona ao array do endpoint em `opcoes.dados` e retorna `{ status: 201, dados: corpo, ok: true }` |
| `async delete(endpoint, id)` | Busca item com `item.id === id` no array do endpoint. Se não encontrar, retorna `{ status: 404, ok: false }`. Se encontrar, remove e retorna `{ status: 200, ok: true }` |

### Função `tratarResposta(resposta)`

- Se `!resposta.ok`, lança `new Error(\`HTTP \${resposta.status}\`)`
- Se ok, retorna `resposta.dados`

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- Os métodos são `async` mas não há I/O real — use `return` diretamente (ou `Promise.resolve`)
- Para extrair a chave do endpoint `/usuarios`, use `endpoint.replace('/', '')` ou `endpoint.slice(1)`
- Corpo "vazio" pode ser: `null`, `undefined`, `{}` (objeto sem chaves). Use `Object.keys(corpo).length === 0` para checar objeto vazio
- O `delete` compara `item.id === id` — atenção ao tipo: se o id for número, a comparação `===` falhará com string. Use `==` ou converta
- Por que usar `async` mesmo sem await? Isso garante que o retorno sempre seja uma Promise — quem chama pode usar `await` ou `.then()`

---

## Tarefas para o Sprint

- [ ] Criar `cliente.js` com a classe `ClienteHTTP`
- [ ] Implementar `get` com busca nos dados injetados
- [ ] Implementar `post` com validação de corpo vazio
- [ ] Implementar `delete` com busca por id e remoção
- [ ] Implementar função `tratarResposta`
- [ ] Garantir que todos os métodos são `async` (retornam Promise)
- [ ] Rodar `npm test` e garantir que todos os testes passam
