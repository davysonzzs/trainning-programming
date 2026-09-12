# 02 — Middlewares

**Nível:** Pleno I
**Sprint:** Pleno I — Node.js + API REST Patterns
**Estimativa:** 2h

---

## Contexto

O novo microserviço da DevTech precisa de middlewares reutilizáveis: logging de requisições, validação de corpo, autenticação por token e rate limiting. Cada middleware segue o padrão `(req, res, next) => void`.

## O que fazer

Implemente as funções de middleware exportadas por `middlewares.js`. Cada função de fábrica retorna um middleware no padrão `(req, res, next) => ...`.

## Arquivo a criar

`middlewares.js` na raiz deste projeto.

## Especificação

### `logger()`
Retorna middleware que:
- Adiciona `req.logId` — string única baseada em `Date.now() + Math.random()`
- Adiciona `req.startTime` — timestamp atual
- Sempre chama `next()`

### `validarBody(schema)`
- `schema` é um objeto: `{ campo: { required, type, minLength } }`
- Se algum campo falhar a validação: chama `res.status(400).json({ erro: 'mensagem' })` e **não** chama `next()`
- Se válido: chama `next()`

### `autenticar(tokensValidos)`
- Verifica se `req.headers.authorization` tem o formato `'Bearer <token>'` e se `<token>` está em `tokensValidos`
- Se inválido: `res.status(401).json({ erro: 'Não autorizado' })` — não chama `next()`
- Se válido: adiciona `req.usuario = { token }` e chama `next()`

### `rateLimiter(maxReqs, janelaSeg)`
- Controla por IP (`req.headers['x-ip']`)
- Se excedeu `maxReqs` dentro de `janelaSeg` segundos: `res.status(429).json({ erro: 'Limite excedido' })`
- Caso contrário, chama `next()`

### `composarMiddlewares(...middlewares)`
- Recebe N middlewares e retorna um único middleware que os executa em sequência

## Como testar

```bash
npm install
npm test
```

## Dicas

- O objeto `res` nos testes é um mock com métodos `status`, `json` (encadeáveis).
- `rateLimiter` usa closure com `Map` para manter estado entre chamadas — janela baseada em timestamp.
- `composarMiddlewares` implementa o mesmo padrão de `next()` encadeado do Router.

## Tarefas

- [ ] Implementar `logger()` que adiciona `logId` e `startTime` ao req
- [ ] Implementar `validarBody(schema)` com validação de `required`, `type`, `minLength`
- [ ] Implementar `autenticar(tokensValidos)` com verificação Bearer
- [ ] Implementar `rateLimiter(maxReqs, janelaSeg)` com controle por IP
- [ ] Implementar `composarMiddlewares(...middlewares)`
- [ ] Exportar todas as funções no module.exports
- [ ] Passar nos testes com `npm test`
