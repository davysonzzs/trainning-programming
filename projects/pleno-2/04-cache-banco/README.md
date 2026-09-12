# 04 — Cache de Banco

**Nível:** Pleno II
**Sprint:** Pleno II — Padrões de Banco de Dados
**Estimativa:** 2h

---

## Contexto

O banco de desenvolvimento da DevTech está sobrecarregado com queries repetidas para os mesmos registros. O time quer uma camada de cache transparente (Decorator Pattern) que envolva o repositório existente sem alterar a interface.

## O que fazer

Implemente a classe `RepositorioComCache` em `cache.js`. Ela decora um repositório existente adicionando cache em memória com TTL (time-to-live) e invalidação inteligente.

## Arquivo a criar

`cache.js` na raiz deste projeto.

## Especificação

### `class RepositorioComCache`

**`constructor(repositorio, ttlMs = 60000)`**
- Recebe um repositório para decorar
- `ttlMs` — tempo em milissegundos para itens expirarem no cache
- Inicializa o Map interno de cache e contadores de hits/misses

**`async findById(id)`**
- Chave de cache: `'<nomeTabela>:id:<id>'` — se repositório não expõe nomeTabela, use genérico `'item:id:<id>'`
- Se existir no cache e não estiver expirado: retorna do cache (hit)
- Se não existir ou expirado: vai ao repositório, armazena no cache, retorna (miss)

**`async findAll(filtros = {})`**
- Chave de cache: `'list:<hash>'` onde hash é `JSON.stringify(filtros)`
- Mesmo padrão: hit → cache, miss → repositório + armazena

**`async create(dados)`**
- Chama repositório diretamente
- Invalida todas as chaves de listas no cache (prefixo `'list:'`)

**`async update(id, dados)`**
- Chama repositório
- Invalida cache do item específico e todas as listas

**`async delete(id)`**
- Chama repositório
- Invalida cache do item e todas as listas

**`invalidarCache(pattern = null)`**
- Se `pattern` é null: limpa todo o cache
- Se `pattern` é string: remove todas as chaves que contêm o pattern

**`estatisticasCache()`**
- Retorna `{ hits: number, misses: number, tamanho: number }`
- `tamanho` é o número atual de entradas válidas (não expiradas) no cache

## Como testar

```bash
npm install
npm test
```

## Dicas

- Armazene no cache: `{ valor, expiraEm: Date.now() + ttlMs }`.
- Para verificar TTL: `Date.now() > expiraEm` → expirado.
- Para invalidar listas: itere sobre as chaves do Map e delete as que começam com `'list:'`.
- Use `jest.useFakeTimers()` nos testes de TTL para simular passagem de tempo.

## Tarefas

- [ ] Implementar constructor com cache Map, TTL e contadores
- [ ] Implementar `findById` com cache hit/miss
- [ ] Implementar `findAll` com cache por filtros
- [ ] Implementar `create` com invalidação de listas
- [ ] Implementar `update` com invalidação de item e listas
- [ ] Implementar `delete` com invalidação de item e listas
- [ ] Implementar `invalidarCache(pattern)`
- [ ] Implementar `estatisticasCache()`
- [ ] Exportar a classe `RepositorioComCache`
- [ ] Passar nos testes com `npm test`
