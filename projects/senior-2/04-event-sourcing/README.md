# 04 — Event Sourcing + CQRS

**Nível:** Sênior II
**Fase:** 13 — Sistemas Distribuidos
**Estimativa:** 2h

---

## Contexto

O sistema bancario da DevTech (simulado) tem um bug critico: ao atualizar o saldo de uma conta, o historico de transacoes e sobrescrito. A auditoria exige um log imutavel de todas as operacoes. "Por que o saldo e negativo?" "Nao sabemos — o dado foi sobrescrito."

Event Sourcing resolve isso: em vez de armazenar o estado atual (saldo = 500), armazene a sequencia de eventos que levou a esse estado (conta criada com 1000, saque de 300, deposito de 200, saque de 400). O estado atual e sempre derivado dos eventos.

---

## O que fazer

Implemente o arquivo `eventos.js` com um Event Store e um mecanismo de agregados para reconstruir estado a partir de eventos.

---

## Arquivo a criar

**`eventos.js`** na raiz deste projeto.

---

## Especificacao

### `class EventStore`

#### `publicar(streamId, tipo, dados, versaoEsperada)`
Adiciona evento ao stream. Versao e auto-incrementada por stream.
- Se versao atual do stream != `versaoEsperada`: lanca `Error('Conflito de versao')`
- Evento: `{ id, streamId, tipo, dados, versao, timestamp }`
- Retorna o evento publicado

**Controle de concorrencia otimista:** `versaoEsperada = 0` para primeiro evento do stream. `versaoEsperada = N` para publicar como versao N+1.

#### `ler(streamId, desdeVersao = 0)`
Retorna array de eventos do stream a partir de `desdeVersao` (inclusive).

#### `lerTodos(tipo = null)`
Retorna todos os eventos. Se `tipo` fornecido, filtra pelo tipo.

### `criarAgregado(tipo, handlers)`

`handlers`: objeto mapeando tipo de evento para funcao de reducao:
```js
{
  CONTA_CRIADA: (estado, evento) => ({ ...estado, titular: evento.dados.titular, saldo: 0 }),
  DEPOSITO:     (estado, evento) => ({ ...estado, saldo: estado.saldo + evento.dados.valor }),
  SAQUE:        (estado, evento) => ({ ...estado, saldo: estado.saldo - evento.dados.valor }),
}
```

Retorna uma CLASSE (nao instancia) com:

```js
constructor(id)    // id do agregado = streamId
carregar(eventos)  // aplica eventos em sequencia reconstruindo estado
aplicar(tipo, dados, store) // publica evento no store e aplica no estado local
estado()           // estado atual
versaoAtual()      // ultima versao do stream
```

---

## Como testar

```bash
npm install
npm test
```

Os testes criam um agregado `Conta` para simular operacoes bancarias.

---

## Dicas

Antes de codar, pense:

1. **Por que Event Sourcing e mais seguro?** O que acontece se voce quiser saber "qual era o saldo em 15/03/2024"? Com state atual, impossivel. Com event sourcing, basta reprocessar eventos ate aquela data.

2. **Conflito de versao (Optimistic Locking):** Se dois usuarios tentam sacar ao mesmo tempo, ambos lem versao 5. O primeiro publica como versao 6. O segundo tenta publicar versao 6 — ERRO. Isso previne race conditions.

3. **`carregar` e idempotente:** Se voce chamar `carregar` duas vezes com os mesmos eventos, o estado deve ser o mesmo (nao dobrar). Como voce garante isso?

4. **Estado inicial:** Antes de qualquer evento, qual e o estado? `{}` vazio? `null`? O handler de `CONTA_CRIADA` recebe esse estado inicial como primeiro argumento.

5. **`criarAgregado` retorna uma CLASSE:** Por que uma classe e nao um objeto? Porque voce pode ter multiplas contas (multiplos agregados do mesmo tipo). `new Conta('conta-1')` e `new Conta('conta-2')` sao independentes.

---

## Tarefas para o Sprint

- [ ] Implementar `EventStore` com armazenamento de eventos por stream
- [ ] Implementar controle de versao e deteccao de conflito
- [ ] Implementar `ler` e `lerTodos` com filtros
- [ ] Implementar `criarAgregado` retornando classe configurada
- [ ] Implementar `carregar` aplicando handlers em sequencia
- [ ] Implementar `aplicar` publicando no store e atualizando estado
- [ ] Criar exemplo de uso com agregado `Conta` nos testes
- [ ] Garantir que todos os testes passam com `npm test`
