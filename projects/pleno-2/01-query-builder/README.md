# 01 — Query Builder

**Nível:** Pleno II
**Sprint:** Pleno II — Padrões de Banco de Dados
**Estimativa:** 2h

---

## Contexto

A DevTech tem SQL manual espalhado por toda a codebase. O Tech Lead quer um query builder interno para abstrair essa lógica e preparar a migração para um ORM. Por ora, o builder apenas gera SQL — sem executar queries reais.

## O que fazer

Implemente a classe `QueryBuilder` em `query.js`. Ela usa o padrão fluent interface (encadeamento de métodos) e produz objetos `{ sql: string, params: [] }` com SQL parametrizado (usando `?` como placeholder).

## Arquivo a criar

`query.js` na raiz deste projeto.

## Especificação

### `class QueryBuilder`

**`constructor(tabela)`**
- Armazena o nome da tabela
- Estado inicial: campos `['*']`, sem WHERE, sem ORDER BY, sem LIMIT, sem OFFSET

**`select(...campos)`**
- Define os campos selecionados
- `select('nome', 'email')` → `SELECT nome, email FROM ...`
- Retorna `this` para encadeamento

**`where(campo, operador, valor)`**
- Acumula condições WHERE com AND implícito
- Operadores suportados: `=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`
- Retorna `this`

**`orderBy(campo, direcao = 'ASC')`**
- Define ordenação
- Retorna `this`

**`limit(n)`**
- Define limite de resultados
- Retorna `this`

**`offset(n)`**
- Define deslocamento
- Retorna `this`

**`build()`**
- Gera a query SELECT
- Retorna `{ sql: string, params: [] }`
- Exemplo: `SELECT nome FROM usuarios WHERE idade > ? ORDER BY nome ASC LIMIT 10`
- `params` contém os valores na ordem das condições WHERE

**`buildInsert(dados)`**
- `dados` é um objeto `{ campo: valor }`
- Retorna `{ sql: string, params: [] }` para INSERT
- Exemplo: `INSERT INTO usuarios (nome, email) VALUES (?, ?)`

**`buildUpdate(dados, where)`**
- `dados` — campos a atualizar
- `where` — objeto `{ campo: valor }` para a cláusula WHERE
- Retorna `{ sql, params }` para UPDATE
- Exemplo: `UPDATE usuarios SET nome = ?, email = ? WHERE id = ?`

## Como testar

```bash
npm install
npm test
```

## Dicas

- Use arrays internos para acumular `wheres`, `campos`, etc.
- `build()` monta a string SQL concatenando as partes, na ordem: SELECT, FROM, WHERE, ORDER BY, LIMIT, OFFSET.
- O array `params` deve ter os valores na mesma ordem em que aparecem os `?` no SQL.
- `buildInsert` e `buildUpdate` são métodos independentes — não usam o estado acumulado de `where()`.

## Tarefas

- [ ] Implementar constructor com estado inicial
- [ ] Implementar `select(...campos)` fluente
- [ ] Implementar `where(campo, operador, valor)` acumulativo
- [ ] Implementar `orderBy(campo, direcao)`
- [ ] Implementar `limit(n)` e `offset(n)`
- [ ] Implementar `build()` gerando SQL SELECT parametrizado
- [ ] Implementar `buildInsert(dados)`
- [ ] Implementar `buildUpdate(dados, where)`
- [ ] Exportar a classe `QueryBuilder`
- [ ] Passar nos testes com `npm test`
