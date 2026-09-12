# 06 — Sistema Distribuido Integrador

**Nível:** Sênior II
**Fase:** 13 — Sistemas Distribuidos (Integrador)
**Estimativa:** 2h 30m

---

## Contexto

Este e o projeto integrador do Senor II. Voce ja implementou fila de mensagens, circuit breaker, rate limiter, event sourcing e balanceamento de carga. Agora e hora de integrar tudo em uma plataforma distribuida resiliente.

A DevTech precisa de uma arquitetura que suporte alta disponibilidade: multiplos servidores com balanceamento, protecao contra falhas em cascata com circuit breaker, protecao contra abuso com rate limiting, processamento assincrono com filas e log imutavel de eventos com event sourcing.

---

## O que fazer

Implemente o arquivo `sistema.js` com a `class SistemaDistribuido` que orquestra todos os subsistemas.

---

## Arquivo a criar

**`sistema.js`** na raiz deste projeto.

---

## Especificacao

### `class SistemaDistribuido`

#### `constructor(config = {})`
Config padrao:
```js
{
  servidores: [{ id: 's1', host: 'localhost', peso: 1 }],
  rateLimit: { maxReqs: 100, janelaSeg: 60 },
  circuitBreaker: { limiarFalhas: 5 }
}
```

Inicializa internamente:
- Balanceador de carga (round-robin com os servidores)
- Rate limiter (fixed window)
- Circuit breaker (envolve a funcao de processamento)
- Fila de mensagens
- Event store

#### `async processarRequisicao(req)`
`req`: `{ ip, dados, clienteId }`

1. Verifica rate limit (pelo `req.ip` ou `'anonimo'`)
   - Se bloqueado: retorna `{ bloqueado: true, motivo: 'Rate limit excedido' }`
2. Seleciona servidor via balanceador
3. Executa processamento via circuit breaker (a funcao interna pode ser: `async () => { return { servidor: servidorSelecionado.id, dados: req.dados }; }`)
4. Publica evento no event store: `'REQUISICAO_PROCESSADA'` com dados da req e servidor
5. Retorna `{ sucesso: true, servidor: id, resultado: { ... } }`

#### `async publicarTarefa(topico, dados)`
Publica mensagem na fila. Retorna id da mensagem.

#### `async processarFilas()`
Consome e "processa" mensagens pendentes de todos os topicos conhecidos. Retorna numero de mensagens processadas.

#### `statusGeral()`
Retorna objeto com estado de todos os subsistemas:
```js
{
  balanceador: { totalRequisicoes, servidores: [...] },
  circuitBreaker: { estado, estatisticas },
  filas: { estatisticas },
  eventos: { total: store.lerTodos().length }
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

1. **A ordem das verificacoes importa:** Por que verificar rate limit ANTES de selecionar servidor e executar circuit breaker? O que voce poupa ao fazer isso?

2. **O circuit breaker envolve uma funcao interna:** Essa funcao e o "servico externo" simulado. No constructor, crie um `CircuitBreaker` com uma funcao que simula processamento. Todos os requests passam por ele.

3. **`processarFilas` precisa saber quais topicos existem:** Como voce rastreia os topicos publicados? O sistema de fila ja rastreia via `estatisticas()`?

4. **`statusGeral` e um snapshot:** Ele nao muda o estado de nada, apenas le. Como voce garante que e uma funcao pura de leitura?

5. **Reutilize os modulos:** Voce pode implementar os subsistemas diretamente no `sistema.js` ou copiar logica dos projetos anteriores. O importante e que o sistema integrado funcione.

---

## Tarefas para o Sprint

- [ ] Implementar `constructor` inicializando todos os subsistemas
- [ ] Implementar `processarRequisicao` com rate limit, balanceamento e circuit breaker
- [ ] Implementar publicacao de evento no event store por requisicao
- [ ] Implementar `publicarTarefa` e `processarFilas`
- [ ] Implementar `statusGeral` lendo estado de todos os subsistemas
- [ ] Garantir que todos os testes passam com `npm test`
