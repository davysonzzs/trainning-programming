# 02 — Circuit Breaker

**Nível:** Sênior II
**Fase:** 13 — Sistemas Distribuidos
**Estimativa:** 2h

---

## Contexto

O servico de pagamento da DevTech ficou instavel: ele responde lentamente ou retorna erro em 80% das chamadas. O problema e que o sistema continua tentando chamar o servico a cada requisicao, causando fila de threads bloqueadas. Em 5 minutos, toda a plataforma esta lenta, nao apenas o pagamento.

O padrao Circuit Breaker resolve isso: apos um numero de falhas, o circuito "abre" e para de chamar o servico falho. Requests subsequentes falham imediatamente (fast-fail) sem esperar timeout. Apos um tempo, o circuito testa se o servico se recuperou.

---

## O que fazer

Implemente o arquivo `circuit.js` com o padrao Circuit Breaker com maquina de estados: FECHADO, ABERTO e MEIO_ABERTO.

---

## Arquivo a criar

**`circuit.js`** na raiz deste projeto.

---

## Especificacao

### `class CircuitBreaker`

```js
constructor(fn, config = {})
```

Config:
- `limiarFalhas` (default 5): quantas falhas consecutivas para abrir o circuito
- `timeoutMs` (default 60000): quanto tempo o circuito fica aberto antes de ir para MEIO_ABERTO
- `limiarSucesso` (default 2): quantos sucessos em MEIO_ABERTO para fechar o circuito

#### Estados

**FECHADO** (normal):
- Executa `fn` normalmente
- Conta falhas consecutivas
- Ao atingir `limiarFalhas`: transita para ABERTO

**ABERTO** (bloqueado):
- Lanca `Error('Circuito aberto')` imediatamente sem executar `fn`
- Quando `Date.now() - ultimaFalha >= timeoutMs`: transita para MEIO_ABERTO

**MEIO_ABERTO** (testando):
- Permite UMA chamada de cada vez
- Se sucesso: incrementa contador de sucessos. Ao atingir `limiarSucesso`: fecha circuito.
- Se falha: volta imediatamente para ABERTO

#### `async executar(...args)`
Executa conforme o estado atual. Propaga o retorno ou erro de `fn`.

#### `estado()`
Retorna string: `'FECHADO'`, `'ABERTO'` ou `'MEIO_ABERTO'`

#### `estatisticas()`
```js
{ estado, falhas, sucessos, ultimaFalha, totalChamadas }
```

#### `resetar()`
Volta para FECHADO, zera contadores.

---

## Como testar

```bash
npm install
npm test
```

Para testar transicoes de estado sem esperar o timeout real, os testes manipulam o tempo via `jest.useFakeTimers()` ou passam timestamp customizado.

Dica: para tornar o `timeoutMs` testavel sem `jest.useFakeTimers`, aceite um parametro `agora = () => Date.now()` no construtor ou no `executar`.

---

## Dicas

Antes de codar, pense:

1. **O que sao "falhas consecutivas"?** Se ocorrem 3 falhas, depois 1 sucesso, depois 2 falhas — o circuito deve abrir (limiar 5)? As falhas se resetam com um sucesso no estado FECHADO.

2. **MEIO_ABERTO e delicado:** Voce nao pode deixar multiplas chamadas entrarem ao mesmo tempo em MEIO_ABERTO. Como voce implementa "apenas UMA chamada de cada vez"?

3. **Como testar sem esperar 60 segundos?** O parametro `agora` injetavel e crucial. Nos testes, voce pode passar `() => Date.now() + 70000` para simular que o tempo passou.

4. **Por que MEIO_ABERTO existe?** Sem ele, o circuito ficaria aberto para sempre. O MEIO_ABERTO e a "sonda": testa se o servico voltou antes de abrir completamente.

5. **`estatisticas().falhas` conta falhas consecutivas ou totais?** O que seria mais util para monitoramento?

---

## Tarefas para o Sprint

- [ ] Implementar maquina de estados com as 3 transicoes
- [ ] Implementar `executar` no estado FECHADO com contagem de falhas
- [ ] Implementar fast-fail no estado ABERTO com verificacao de timeout
- [ ] Implementar logica de MEIO_ABERTO com limite de chamadas
- [ ] Implementar `estado`, `estatisticas` e `resetar`
- [ ] Tornar o timeout testavel sem espera real (parametro `agora`)
- [ ] Garantir que todos os testes passam com `npm test`
