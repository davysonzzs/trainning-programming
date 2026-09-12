# 03 — Rate Limiter

**Nível:** Sênior II
**Fase:** 13 — Sistemas Distribuidos
**Estimativa:** 2h

---

## Contexto

Um concorrente descobriu que a API publica da DevTech nao tinha rate limiting e escreveu um script que fazia 10.000 requisicoes por segundo, derrubando o servico para todos os usuarios reais. O incidente durou 45 minutos.

O Tech Lead Pedro quer implementar rate limiting com tres algoritmos diferentes para entender os trade-offs de cada um antes de escolher qual usar em producao.

---

## O que fazer

Implemente o arquivo `limiter.js` com tres algoritmos de rate limiting: Fixed Window, Sliding Window e Token Bucket.

---

## Arquivo a criar

**`limiter.js`** na raiz deste projeto.

---

## Especificacao

Todos os limiters aceitam `agora = () => Date.now()` como ultimo argumento para testabilidade.

### `criarFixedWindow(maxReqs, janelaSeg)`

Divide o tempo em janelas fixas de `janelaSeg` segundos. Cada janela tem contador independente.

`verificar(chave, agora)` retorna:
```js
{ permitido: boolean, restante: number, resetEm: number }
```
`resetEm`: timestamp em ms quando a janela atual reseta.

**Problema conhecido:** Rafaga dupla na virada de janela (100 reqs no final da janela 1 + 100 reqs no inicio da janela 2 = 200 reqs em 1 segundo).

### `criarSlidingWindow(maxReqs, janelaSeg)`

Registra timestamp de cada requisicao. Ao verificar, conta apenas as requisicoes dentro da janela deslizante (ultimos `janelaSeg` segundos a partir de agora).

`verificar(chave, agora)` retorna:
```js
{ permitido: boolean, restante: number, resetEm: number }
```

Mais preciso que Fixed Window. Problema: usa mais memoria (guarda timestamps individuais).

### `criarTokenBucket(capacidade, taxaRecarga)`

`taxaRecarga`: tokens adicionados por segundo.

`verificar(chave, tokensNecessarios = 1, agora)` retorna:
```js
{ permitido: boolean, tokens: number, proximoToken: number }
```
`proximoToken`: timestamp em ms quando o proximo token estara disponivel.

### `criarLimiterMiddleware(algoritmo, config)`

`algoritmo`: objeto retornado por um dos `criar*` acima.
`config`: `{ mensagemErro? }` (opcional)

Retorna `(req, res, next) => void` usando `req.headers['x-ip']` como chave (ou `'anonimo'` se ausente).

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

Antes de codar, pense:

1. **Fixed Window vs Sliding Window:** Fixed Window e mais simples mas tem o problema de rafaga na virada. Sliding Window e mais preciso mas usa mais memoria. Implemente e veja a diferenca nos testes.

2. **Token Bucket e diferente:** Em vez de contar requisicoes, o bucket tem tokens que se enchem ao longo do tempo. Uma requisicao "gasta" tokens. Se o bucket esta vazio, a requisicao e bloqueada. Como voce calcula quantos tokens foram adicionados desde a ultima verificacao?

3. **`agora` como parametro:** Por que isso e essencial para testabilidade? Como voce testaria "depois de 1 segundo, o bucket deve ter mais tokens" sem `agora` injetavel?

4. **Chaves diferentes sao contadores independentes:** IP `192.168.0.1` e IP `192.168.0.2` nao compartilham contador. Como voce implementa isso? Um objeto/Map de chave → estado.

5. **`restante` no Fixed Window:** Se `maxReqs = 10` e ja foram feitas 7 requisicoes, `restante = 3`. O que acontece na requisicao que ultrapassa? `restante` fica negativo ou zera em 0?

---

## Tarefas para o Sprint

- [ ] Implementar `criarFixedWindow` com janelas de tempo fixas
- [ ] Implementar `criarSlidingWindow` com log de timestamps
- [ ] Implementar `criarTokenBucket` com recarga de tokens
- [ ] Implementar `criarLimiterMiddleware` para uso como middleware
- [ ] Testar cenarios de limite atingido e reset
- [ ] Garantir que todos os testes passam com `npm test`
