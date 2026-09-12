# 01 — Fila de Mensagens

**Nível:** Sênior II
**Fase:** 13 — Sistemas Distribuidos
**Estimativa:** 2h

---

## Contexto

O endpoint de processamento de pedidos da DevTech estava bloqueando a thread principal por 30 segundos ao processar pagamentos, enviar emails e atualizar estoque de forma sincrona. Durante esse tempo, nenhuma outra requisicao era atendida.

O Tech Lead Pedro quer desacoplar essas operacoes usando uma fila de mensagens: o endpoint publica uma mensagem na fila e retorna imediatamente. Um worker separado processa a mensagem de forma assincrona. O resultado: o usuario recebe resposta em milissegundos, e o processamento pesado acontece em background.

---

## O que fazer

Implemente o arquivo `fila.js` com um Message Queue pattern completo, incluindo prioridades, subscricoes e reprocessamento de falhas.

---

## Arquivo a criar

**`fila.js`** na raiz deste projeto.

---

## Especificacao

### `criarFila(config = {})`

Config: `{ maxTamanho: number, ttlMs: number }`

Retorna objeto com:

#### `publicar(topico, mensagem, prioridade = 0)`
Adiciona mensagem com:
```js
{ id, topico, mensagem, prioridade, publicadoEm: Date.now(), tentativas: 0 }
```
Mensagens com maior prioridade ficam no topo (fila de prioridade). Retorna o id da mensagem.

#### `consumir(topico)`
Remove e retorna a mensagem mais prioritaria do topico. Retorna `null` se fila vazia.

#### `assinar(topico, handler)`
Registra funcao `handler(mensagem)` chamada automaticamente quando mensagem e publicada no topico. Se handler lancar erro, incrementa `tentativas` e marca mensagem como falha.

#### `desassinar(topico, handler)`
Remove handler registrado.

#### `reprocessarFalhas()`
Mensagens que falharam (`tentativas >= 1`) e tem `tentativas < 3` voltam para a fila para nova tentativa. Retorna numero de mensagens reprocessadas.

#### `estatisticas()`
```js
{
  total: number,
  porTopico: {
    'nome-topico': { pendentes: number, processadas: number, falhas: number }
  }
}
```

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

Antes de codar, pense:

1. **Como implementar fila de prioridade?** Um heap seria ideal, mas voce pode usar array e ordenar por prioridade. O trade-off e O(n log n) por publicacao vs O(1) por consumo. Para o simulador, ordenacao simples e suficiente.

2. **Subscricoes sao sincronas ou assincronas?** Quando `publicar` e chamado, os handlers devem ser chamados imediatamente (sincrono) ou agendados (setTimeout 0)? Pense nas implicacoes para os testes.

3. **Como rastrear mensagens falhas?** Voce precisa de uma lista separada de "mensagens com falha" ou pode usar um campo `status` na mensagem? O que e mais facil de consultar?

4. **`reprocessarFalhas` tem limite:** Por que 3 tentativas? O que acontece apos 3 tentativas? A mensagem fica na "dead letter queue" indefinidamente?

5. **`maxTamanho` na config:** O que acontece quando a fila esta cheia e alguem tenta publicar? Lanca erro? Descarta a mensagem mais antiga (FIFO-eviction)?

---

## Tarefas para o Sprint

- [ ] Implementar `publicar` com ordenacao por prioridade
- [ ] Implementar `consumir` removendo a mensagem mais prioritaria
- [ ] Implementar `assinar` com chamada automatica do handler
- [ ] Implementar tratamento de erros no handler (incrementar tentativas)
- [ ] Implementar `desassinar`
- [ ] Implementar `reprocessarFalhas` (tentativas < 3)
- [ ] Implementar `estatisticas` com contadores por topico
- [ ] Garantir que todos os testes passam com `npm test`
