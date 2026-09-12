# 05 — Transações

**Nível:** Pleno II
**Sprint:** Pleno II — Padrões de Banco de Dados
**Estimativa:** 2h

---

## Contexto

O sistema financeiro da DevTech precisa de atomicidade real: se uma transferência falhar no meio, o dinheiro não pode sumir. A equipe precisa de um gerenciador de transações que garanta que operações funcionem ou revertam completamente.

## O que fazer

Implemente `criarGerenciadorTransacoes(repositorios)` e `transferirSaldo(...)` em `transacoes.js`. O gerenciador cria snapshots do estado dos repositórios para permitir rollback em memória.

## Arquivo a criar

`transacoes.js` na raiz deste projeto.

## Especificação

### `criarGerenciadorTransacoes(repositorios)`

`repositorios` é um objeto `{ [nome]: repositorioInstance }` onde cada repositório tem um `Map` interno acessível.

Retorna:

**`async iniciar()`**
- Cria um snapshot profundo (deep clone) do estado atual de todos os repositórios
- Armazena internamente para uso no rollback

**`async commit()`**
- Descarta o snapshot — confirma as mudanças

**`async rollback()`**
- Restaura o estado de cada repositório ao snapshot salvo em `iniciar()`
- Substitui o Map interno dos repositórios pelo snapshot

**`async executar(fn)`**
- Chama `iniciar()`, executa `fn(repositorios)`, chama `commit()`
- Se `fn` lançar qualquer erro: chama `rollback()` e relança o erro

### `transferirSaldo(contaOrigem, contaDestino, valor, repoContas)`

- Verifica se `contaOrigem` existe — lança `Error('Conta origem não encontrada')` se não
- Verifica se `contaDestino` existe — lança erro similar
- Verifica se `contaOrigem.saldo >= valor` — lança `Error('Saldo insuficiente')` se não
- Se tudo ok: debita `contaOrigem` e credita `contaDestino`
- Retorna `{ sucesso: true, novoSaldoOrigem, novoSaldoDestino }`

## Como testar

```bash
npm install
npm test
```

## Dicas

- Para o snapshot, use `JSON.parse(JSON.stringify(...))` ou itere o Map para copiar cada entrada.
- O repositório precisa expor seu Map interno (ou um método `_getSnapshot`/`_restoreSnapshot`) para que o gerenciador possa salvar e restaurar o estado.
- `transferirSaldo` pode ser testada de forma isolada com um `repoContas` simples em memória.
- Nos testes de `executar`, verifique que após erro o estado voltou ao original.

## Tarefas

- [ ] Implementar `criarGerenciadorTransacoes(repositorios)`
- [ ] Implementar `iniciar()` com deep clone do estado
- [ ] Implementar `commit()` descartando o snapshot
- [ ] Implementar `rollback()` restaurando o snapshot
- [ ] Implementar `executar(fn)` com try/catch automático
- [ ] Implementar `transferirSaldo(...)` como utilitário
- [ ] Exportar `criarGerenciadorTransacoes` e `transferirSaldo`
- [ ] Passar nos testes com `npm test`
