# 02 — Repositório Base

**Nível:** Pleno II
**Sprint:** Pleno II — Padrões de Banco de Dados
**Estimativa:** 2h

---

## Contexto

Vários serviços da DevTech usam SQL raw diretamente nas camadas de negócio. O Tech Lead quer introduzir o Repository Pattern antes de migrar para Prisma — criando uma camada de abstração com dados em memória (Map) para facilitar testes e evolução futura.

## O que fazer

Implemente a classe `Repositorio` em `repositorio.js`. Ela simula um banco de dados usando um `Map` interno e expõe uma interface assíncrona padrão com todas as operações CRUD, além de funcionalidades extras como `count` e `bulkCreate`.

## Arquivo a criar

`repositorio.js` na raiz deste projeto.

## Especificação

### `class Repositorio`

**`constructor(nomeTabela)`**
- Cria um `Map` interno para armazenar registros
- Inicia `nextId = 1` para auto-incremento

**`async findAll(filtros = {})`**
- Retorna todos os registros do Map
- Se `filtros` for informado, filtra por igualdade em todos os campos do objeto
- Exemplo: `findAll({ ativo: true })` → só registros com `ativo === true`

**`async findById(id)`**
- Retorna o registro com o id dado ou `null`

**`async findOne(filtros)`**
- Retorna o primeiro registro que corresponde aos filtros ou `null`

**`async create(dados)`**
- Cria registro com `id` auto-incrementado
- Adiciona `createdAt` e `updatedAt` como ISO strings (`new Date().toISOString()`)
- Armazena no Map e retorna o registro completo

**`async update(id, dados)`**
- Faz merge dos dados no registro existente (spread)
- Atualiza `updatedAt`
- Retorna o registro atualizado ou `null` se não encontrado

**`async delete(id)`**
- Remove o registro do Map
- Retorna `true` se encontrado e removido, `false` caso contrário

**`async count(filtros = {})`**
- Retorna a contagem de registros que correspondem aos filtros

**`async bulkCreate(arrayDados)`**
- Cria vários registros de uma vez
- Retorna array com todos os registros criados (cada um com id, createdAt, updatedAt)

## Como testar

```bash
npm install
npm test
```

## Dicas

- O `Map` deve armazenar registros com chave `id` (number).
- `findAll` sem filtros deve retornar `Array.from(map.values())`.
- Para filtrar: itere sobre os registros e verifique se todos os pares chave/valor do filtro batem.
- Os timestamps usam `new Date().toISOString()`.

## Tarefas

- [ ] Implementar constructor com Map e nextId
- [ ] Implementar `findAll(filtros)` com filtragem
- [ ] Implementar `findById(id)`
- [ ] Implementar `findOne(filtros)`
- [ ] Implementar `create(dados)` com id auto e timestamps
- [ ] Implementar `update(id, dados)` com merge e updatedAt
- [ ] Implementar `delete(id)` retornando boolean
- [ ] Implementar `count(filtros)`
- [ ] Implementar `bulkCreate(arrayDados)`
- [ ] Exportar a classe `Repositorio`
- [ ] Passar nos testes com `npm test`
