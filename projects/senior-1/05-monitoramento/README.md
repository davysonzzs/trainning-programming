# 05 — Monitoramento e Observabilidade

**Nível:** Sênior I
**Fase:** 12 — DevOps Patterns
**Estimativa:** 2h

---

## Contexto

O sistema da DevTech em producao esta falhando de forma intermitente. A QA Ana abre tickets: "o sistema trava as vezes". O dev responde: "funciona na minha maquina". Sem logs estruturados, sem metricas, sem traces — e impossivel debugar o problema remotamente.

O Tech Lead Pedro quer implementar os tres pilares da Observabilidade (Observability) antes da proxima release:
1. **Logs estruturados** — saiba QUANDO e ONDE algo aconteceu
2. **Metricas** — saiba QUANTO e com que frequencia
3. **Traces distribuidos** — saiba o CAMINHO de uma requisicao pelo sistema

---

## O que fazer

Implemente o arquivo `monitoramento.js` com os tres pilares de observabilidade.

---

## Arquivo a criar

**`monitoramento.js`** na raiz deste projeto.

---

## Especificacao

### `criarLogger(modulo)`

Retorna objeto com metodos:
```js
info(msg, meta = {})   // nivel INFO
warn(msg, meta = {})   // nivel WARN
error(msg, meta = {})  // nivel ERROR
```

Cada chamada registra internamente um objeto:
```js
{ nivel, modulo, msg, meta, timestamp: Date.now() }
```

O logger tambem expoe:
```js
obterLogs()             // retorna array com todos os logs registrados
obterLogs(nivel)        // filtra por nivel
limpar()                // limpa o historico
```

### `class ColetorMetricas`

#### `incrementar(nome, valor = 1, tags = {})`
Contador. Acumula valores por nome+tags.

#### `registrarHistograma(nome, valor, tags = {})`
Registra valor individual (para calcular percentis depois).

#### `gauge(nome, valor, tags = {})`
Valor atual (sobrescreve anterior).

#### `obter(nome)`
Retorna array com todas as medicoes do nome (ordem de insercao).

#### `resumo(nome)`
Retorna objeto com estatisticas do histograma:
```js
{ count, sum, min, max, p50, p95, p99 }
```

Para calcular percentis: ordene os valores, pegue o elemento no indice `Math.floor(p/100 * count)`.

### `class Tracer`

#### `iniciarSpan(nome, parentId = null)`
Retorna span:
```js
{
  id: string (uuid simples),
  traceId: string,  // mesmo para spans do mesmo trace
  nome,
  parentId,
  inicio: Date.now(),
  finalizar()  // registra duracao e marca como finalizado
}
```

Se `parentId` for fornecido, o `traceId` deve ser o mesmo do span pai.

#### `listarSpans(traceId)`
Retorna todos os spans registrados com aquele traceId.

#### `arvore(traceId)`
Retorna estrutura hierarquica:
```js
[{
  span: { id, nome, duracao },
  filhos: [{ span, filhos: [...] }]
}]
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

1. **Por que logs estruturados sao melhores que `console.log('erro!')`?** O que voce ganha ao ter `{ nivel, modulo, msg, meta, timestamp }` vs uma string solta?

2. **Diferenca entre contador, histograma e gauge:** Contador so sobe (requisicoes totais). Histograma registra valores para calcular distribuicao (latencias). Gauge pode subir e descer (conexoes ativas). Quando usar cada um?

3. **Como calcular p95?** Se voce tem 100 valores ordenados, o p95 e o valor no indice 95. E se tiver 10 valores? Indice `floor(0.95 * 10) = 9` (ultimo elemento). Implemente isso.

4. **TraceId vs SpanId:** Por que um trace pode ter varios spans? Como voce garante que spans filho herdam o traceId do pai?

5. **`arvore` precisa de recursao** — como voce constroi a arvore a partir de um array plano de spans? Comece pelos spans raiz (sem parentId), depois adicione os filhos recursivamente.

---

## Tarefas para o Sprint

- [ ] Implementar `criarLogger` com niveis e filtros
- [ ] Implementar `ColetorMetricas.incrementar` e `gauge`
- [ ] Implementar `ColetorMetricas.registrarHistograma`
- [ ] Implementar `ColetorMetricas.resumo` com calculo de percentis
- [ ] Implementar `Tracer.iniciarSpan` com propagacao de traceId
- [ ] Implementar `Tracer.listarSpans` e `arvore`
- [ ] Garantir que todos os testes passam com `npm test`
