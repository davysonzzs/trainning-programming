# DEVTECH SISTEMAS S.A.
## Feature: Cache em Memória com TTL para API Pública

> **ALERTA DE CAPACIDADE — Tech Lead Rafael:** A API de cotação de moedas está recebendo 3000 req/min mas só suporta 100. Estamos sendo bloqueados e recebendo erros 429. Precisamos de cache em memória com expiração automática para ontem.

---
### Contexto

O serviço de painel financeiro da DevTech consulta uma API pública de câmbio a cada requisição do usuário. Com o crescimento da base, o volume de chamadas explodiu. A solução imediata é um cache em memória: guardar o resultado por N segundos e servir a resposta guardada enquanto não expirar.

O Tech Lead pediu uma implementação com **factory function** (closure) para encapsular o estado interno. Sem bibliotecas externas.

**Nível:** Junior I
**Sprint:** Junior I — Closures e Factory Functions
**Estimativa:** 2h
**Prioridade:** Alta

---
### O que fazer

- [ ] Criar `cache.js`
- [ ] Implementar `criarCache(ttlMs, agora)`
- [ ] Implementar método `set(chave, valor)`
- [ ] Implementar método `get(chave)` com verificação de expiração
- [ ] Implementar método `has(chave)`
- [ ] Implementar método `delete(chave)`
- [ ] Implementar método `limpar()`
- [ ] Implementar método `tamanho()`
- [ ] Fazer todos os testes passarem

---
### Arquivo a criar

`cache.js`

---
### Especificação das funções

#### `criarCache(ttlMs, agora = () => Date.now())`
Factory function que cria e retorna um objeto de cache.
- `ttlMs`: tempo de vida em milissegundos para cada entrada
- `agora`: função que retorna o tempo atual (padrão: `() => Date.now()`). Parâmetro usado para facilitar testes sem timers reais.
- O estado interno (Map com as entradas) fica encapsulado no closure — não exposto externamente.
- Retorna um objeto com os métodos abaixo.

#### `.set(chave, valor)`
Armazena o valor associado à chave, junto com o timestamp do momento atual (via `agora()`).
- Sobrescreve se a chave já existir.
- Não retorna valor significativo (pode retornar `undefined`).

#### `.get(chave)`
Retorna o valor se a entrada existir e não tiver expirado.
- Expirada = `agora() - timestampDaEntrada >= ttlMs`
- Retorna `null` se a chave não existir ou tiver expirado.

#### `.has(chave)`
Retorna `true` se a chave existir e não tiver expirado, `false` caso contrário.

#### `.delete(chave)`
Remove a entrada da chave.
- Retorna `true` se a entrada existia (e foi removida), `false` se não existia.

#### `.limpar()`
Remove todas as entradas **expiradas** do cache.
- Retorna o número de entradas removidas.
- Entradas válidas (não expiradas) permanecem.

#### `.tamanho()`
Retorna a quantidade de entradas **válidas** (não expiradas) no cache.

---
### Como testar

```bash
npm install
npm test
```

---
### Dicas (tente sozinho antes de usar)

- A função `criarCache` deve usar um `Map` interno declarado com `const` dentro da função — como o closure mantém esse Map vivo entre chamadas?
- Em `.set`, o que você armazena no Map além do valor? Você precisa guardar o **momento** em que o item foi inserido.
- Em `.get`, como você calcula se o item expirou usando `agora()` e o timestamp guardado?
- Por que receber `agora` como parâmetro facilita os testes? Como você simula "pular no tempo" sem usar `setTimeout`?
- Em `.limpar()`, como você itera sobre um Map e remove entradas durante a iteração?

---
### Tarefas sugeridas para o Sprint

```
node sprint.js add "04-cache: implementar criarCache e set/get básicos"
node sprint.js add "04-cache: implementar lógica de expiração em get e has"
node sprint.js add "04-cache: implementar delete"
node sprint.js add "04-cache: implementar limpar e tamanho"
node sprint.js add "04-cache: fazer todos os testes passarem"
```
