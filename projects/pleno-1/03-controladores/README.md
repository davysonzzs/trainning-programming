# 03 — Controladores

**Nível:** Pleno I
**Sprint:** Pleno I — Node.js + API REST Patterns
**Estimativa:** 1h 30m

---

## Contexto

A API de produtos da DevTech precisa de controllers padronizados para todas as entidades do sistema. A separação de responsabilidades entre controller e repositório facilita testes unitários e reutilização de lógica.

## O que fazer

Implemente a função `criarControladorCRUD(repositorio)` que recebe um repositório injetado e retorna um objeto com os cinco handlers padrão de uma API CRUD. Também implemente `tratarErros(fn)` como wrapper de segurança.

## Arquivo a criar

`controladores.js` na raiz deste projeto.

## Especificação

### `criarControladorCRUD(repositorio)`

Retorna objeto com:

- `async listar(req, res)` — chama `repositorio.findAll()`, retorna status 200 com o array
- `async buscarPorId(req, res)` — usa `req.params.id`, chama `repositorio.findById(id)`. Se não encontrado: 404 `{ erro: 'Não encontrado' }`.
- `async criar(req, res)` — usa `req.body`, chama `repositorio.create(dados)`. Retorna 201 com o item criado.
- `async atualizar(req, res)` — `req.params.id` + `req.body`, chama `repositorio.update(id, dados)`. 200 ou 404.
- `async deletar(req, res)` — `req.params.id`, chama `repositorio.delete(id)`. 204 (body null) ou 404.

O repositório injetado deve ter: `findAll()`, `findById(id)`, `create(dados)`, `update(id, dados)`, `delete(id)`.

### `tratarErros(fn)`

Wrapper async:
```js
const handler = tratarErros(async (req, res) => {
  // pode lançar erro
});
```
- Se `fn` lançar erro, seta `res.status(500).json({ erro: mensagem })` e não propaga a exceção.

## Como testar

```bash
npm install
npm test
```

## Dicas

- Use mocks Jest (`jest.fn()`) para simular o repositório nos testes.
- `findById` retornando `null` deve resultar em 404.
- `delete` retornando `false` (não encontrado) deve resultar em 404.
- `tratarErros` deve capturar a exceção e transformar em resposta 500.

## Tarefas

- [ ] Implementar `criarControladorCRUD(repositorio)` com os 5 handlers
- [ ] Handler `listar` — findAll + 200
- [ ] Handler `buscarPorId` — findById + 200 ou 404
- [ ] Handler `criar` — create + 201
- [ ] Handler `atualizar` — update + 200 ou 404
- [ ] Handler `deletar` — delete + 204 ou 404
- [ ] Implementar `tratarErros(fn)` como wrapper async
- [ ] Exportar `criarControladorCRUD` e `tratarErros`
- [ ] Passar nos testes com `npm test`
