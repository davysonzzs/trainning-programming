# 01 — Roteador HTTP

**Nível:** Pleno I
**Sprint:** Pleno I — Node.js + API REST Patterns
**Estimativa:** 2h

---

## Contexto

A DevTech Sistemas está construindo um novo microserviço de pagamentos e precisa de um router HTTP modular, semelhante ao Express, mas implementado em JS puro. Isso garante que a equipe entenda profundamente o padrão antes de usar frameworks externos.

## O que fazer

Implemente uma classe `Router` que simule o roteamento Express-like: registro de rotas por método HTTP, suporte a parâmetros dinâmicos (`:id`), cadeia de middlewares (middleware chain) e middlewares globais.

## Arquivo a criar

`roteador.js` na raiz deste projeto.

## Especificação

### Classe `Router`

```js
const router = new Router();
```

**Métodos de registro de rotas:**
- `get(path, ...handlers)` — registra handlers para GET
- `post(path, ...handlers)` — registra handlers para POST
- `put(path, ...handlers)` — registra handlers para PUT
- `delete(path, ...handlers)` — registra handlers para DELETE
- `use(middleware)` — registra middleware global (executado antes de qualquer handler)

**Método de despacho:**
- `handle(metodo, path, req)` — encontra a rota compatível (suportando params `:id`), cria o objeto `res`, executa middlewares globais + handlers em chain, retorna `res` final

**Shape do `req`:**
```js
{ metodo, path, params: {}, body: {}, headers: {}, query: {} }
```

**Shape do `res` (criado internamente pelo router):**
```js
res.json(dados)     // seta body e header Content-Type: application/json
res.status(code)    // seta status code (retorna res para encadeamento)
res.send(texto)     // seta body como string
```
`res` começa com `{ status: 200, body: null, headers: {} }`.

**Extração de parâmetros:**
- Rota `/usuarios/:id` com path `/usuarios/42` → `req.params = { id: '42' }`

**Middleware chain:**
- Cada handler recebe `(req, res, next)` e chama `next()` para passar ao próximo.
- Se um handler não chamar `next()`, a chain para.

## Como testar

```bash
npm install
npm test
```

## Dicas

- Use `path.split('/')` e compare segmento a segmento para detectar parâmetros (`:param`).
- Implemente `next` como uma função que chama o próximo handler no array.
- Os middlewares globais ficam em um array separado e são sempre executados primeiro.
- `res.status(code)` deve retornar `res` para permitir `.status(404).json(...)`.

## Tarefas

- [ ] Criar a classe `Router` com o constructor inicializando rotas por método
- [ ] Implementar `get`, `post`, `put`, `delete` para registrar rotas
- [ ] Implementar `use` para middlewares globais
- [ ] Implementar matching de path com suporte a parâmetros dinâmicos
- [ ] Implementar o objeto `res` com métodos `json`, `status`, `send`
- [ ] Implementar a cadeia de execução (next pattern)
- [ ] Retornar 404 se nenhuma rota for encontrada
- [ ] Passar nos testes com `npm test`
