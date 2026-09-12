# 06 — API Completa (Integrador)

**Nível:** Pleno I
**Sprint:** Pleno I — Node.js + API REST Patterns
**Estimativa:** 2h 30m

---

## Contexto

Projeto integrador do Pleno I. A DevTech quer ver todas as camadas trabalhando juntas: Router, Middlewares, Controllers, Schema Validation e Service Layer — integrados em uma API funcional testável sem servidor HTTP real.

## O que fazer

Implemente a função `criarAPI(config)` em `api.js` que monta todas as camadas e expõe um método `api.request(metodo, path, req)` para processar requisições de forma programática (sem `http.createServer`).

## Arquivo a criar

`api.js` na raiz deste projeto.

## Especificação

### `criarAPI(config = {})`

Retorna um objeto `api` com:

**`api.router`** — o Router interno (instância do router)

**`api.request(metodo, path, reqOpts = {})`** — processa uma requisição e retorna `res`:
- `reqOpts` pode ter `body`, `headers`, `query`, `params`
- Passa por middlewares globais e handlers da rota registrada

**Rotas configuradas:**

| Método | Path | Ação |
|--------|------|------|
| GET | /health | `{ status: 'ok', timestamp: Date.now() }` |
| GET | /produtos | Lista com filtros via `req.query` |
| POST | /produtos | Cria com validação (nome required, preco > 0) |
| GET | /produtos/:id | Busca por id |
| PUT | /produtos/:id | Atualiza produto |
| DELETE | /produtos/:id | Deleta produto |

**Middlewares globais:**
- Logger (adiciona logId e startTime)
- A rota POST /produtos deve validar o body com schema

**Repositório interno:**
- Implementado em memória (Map) dentro do próprio `api.js`
- Sem dependência externa

**Validação de POST /produtos:**
- `nome`: string required
- `preco`: number required, min > 0
- `estoque`: number required, min >= 0

## Como testar

```bash
npm install
npm test
```

## Dicas

- Você pode implementar o repositório em memória diretamente em `api.js` (não precisa importar o projeto 02-repositorio-base).
- O router, middlewares e schema podem ser implementados localmente ou ser cópias simplificadas dos projetos anteriores.
- O foco é a **integração** — verificar que as camadas funcionam juntas via `api.request(...)`.
- `api.request` deve retornar o objeto `res` final (com `status`, `body`, `headers`).

## Tarefas

- [ ] Implementar repositório em memória dentro de `api.js`
- [ ] Implementar router simples (ou reutilizar lógica do projeto 01)
- [ ] Configurar middlewares globais (logger)
- [ ] Registrar todas as 6 rotas
- [ ] Implementar validação de schema para POST /produtos
- [ ] Implementar `criarAPI(config)` que monta tudo e retorna `{ router, request }`
- [ ] Exportar `criarAPI`
- [ ] Passar nos testes com `npm test`
