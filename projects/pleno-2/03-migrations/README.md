# 03 — Sistema de Migrations

**Nível:** Pleno II
**Sprint:** Pleno II — Padrões de Banco de Dados
**Estimativa:** 2h

---

## Contexto

O banco de dados da DevTech foi alterado manualmente diversas vezes em produção e ninguém sabe o estado atual do schema. O Tech Lead quer introduzir um sistema de migrations versionado para garantir que todos os ambientes estejam sincronizados.

## O que fazer

Implemente a função `criarSistemaMigrations(banco)` em `migrations.js`. O `banco` é um objeto JS simples que as funções `up/down` vão modificar diretamente (simulando um banco em memória).

## Arquivo a criar

`migrations.js` na raiz deste projeto.

## Especificação

### `criarSistemaMigrations(banco)`

Retorna um objeto com os seguintes métodos:

**`registrar(nome, up, down)`**
- Registra uma migration com nome único
- `up(banco)` — função que aplica a mudança (síncrona)
- `down(banco)` — função que desfaz a mudança (síncrona)
- Ordem de registro determina a ordem de execução

**`async migrar()`**
- Executa todas as migrations `up` ainda não executadas, na ordem de registro
- Marca cada migration como executada com timestamp
- Retorna array com os nomes das migrations executadas nesta chamada

**`async reverter(n = 1)`**
- Executa `down` das últimas `n` migrations executadas (ordem inversa)
- Remove-as da lista de executadas
- Retorna array com os nomes das migrations revertidas

**`status()`**
- Retorna `{ executadas: string[], pendentes: string[] }`

**`historico()`**
- Retorna array de `{ nome, executadaEm }` em ordem cronológica
- Somente migrations que foram executadas aparecem aqui

## Como testar

```bash
npm install
npm test
```

## Dicas

- Mantenha duas listas internas: `migrations` (todas registradas, em ordem) e `executadas` (as já rodadas, com timestamps).
- `migrar()` filtra as migrations ainda não executadas e as executa em sequência.
- `reverter(n)` pega as últimas `n` da lista `executadas` e as reverte na ordem inversa.
- As funções `up` e `down` recebem o objeto `banco` e o modificam diretamente.

## Tarefas

- [ ] Implementar `registrar(nome, up, down)`
- [ ] Implementar `async migrar()` executando pending migrations
- [ ] Implementar `async reverter(n)` revertendo as últimas n
- [ ] Implementar `status()` com executadas e pendentes
- [ ] Implementar `historico()` em ordem cronológica
- [ ] Exportar `criarSistemaMigrations`
- [ ] Passar nos testes com `npm test`
