# 03 — Analisador de Cobertura

**Nível:** Sênior I
**Fase:** 11 — Testes Avancados
**Estimativa:** 2h

---

## Contexto

A DevTech tem dezenas de modulos legados sem Jest configurado. O Tech Lead Pedro precisa de visibilidade sobre a qualidade dos testes nesses modulos. Configurar Jest em cada um levaria semanas e envolveria mudancas em package.json de producao.

A solucao: um analisador de cobertura proprio que funciona no runtime — executa funcoes com casos de teste definidos e relata o que passou e o que falhou. Simples, sem configuracao, funciona em qualquer modulo Node.js.

---

## O que fazer

Implemente o arquivo `cobertura.js` com utilitarios para analise de cobertura e relatorio de testes.

---

## Arquivo a criar

**`cobertura.js`** na raiz deste projeto.

---

## Especificacao

### `analisarFuncao(fn, casosDeTest)`

Executa a funcao `fn` para cada caso de teste.

Cada caso: `{ args: [...], esperado: valor }`

Retorna:
```js
{
  passaram: number,
  falharam: number,
  percentual: number,    // 0 a 100
  falhas: [{ args, esperado, recebido }]
}
```

A comparacao usa igualdade profunda (JSON.stringify ou similar).

### `class RelatorioCobertura`

#### `registrar(modulo, funcao, passou)`
Registra resultado de um teste para um par modulo/funcao.

#### `percentualModulo(modulo)`
Retorna percentual de funcoes que passaram naquele modulo (0 a 100).

#### `relatorioCompleto()`
Retorna:
```js
{
  totalFuncoes: number,
  passaram: number,
  falharam: number,
  percentualGeral: number,
  porModulo: {
    'nome-modulo': { total, passaram, falharam, percentual }
  }
}
```

#### `exportarTexto()`
Retorna string formatada para terminal, ex:
```
=== Relatorio de Cobertura ===
Modulo: carrinho     | Funcoes: 8 | Passou: 7 | Falhou: 1 | 87.5%
Modulo: pagamento    | Funcoes: 4 | Passou: 4 | Falhou: 0 | 100.0%
------------------------------
Total: 12 funcoes | 11 passaram | 91.7%
```

### `criarSuite(descricao)`

Retorna objeto:
```js
{
  it(nome, fn)   // registra um caso de teste (fn retorna true/false ou lanca erro = falhou)
  run()          // executa todos os casos, retorna { descricao, total, passaram, falharam, resultados: [{nome, passou, erro}] }
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

1. **Como comparar valores esperados e recebidos?** `===` funciona para primitivos mas nao para objetos. Como voce compararia `{ a: 1 }` com `{ a: 1 }`?

2. **`try/catch` em `analisarFuncao`:** O que acontece se a funcao testada lanca um erro inesperado? Como voce captura isso e registra como falha?

3. **`RelatorioCobertura` armazena por modulo e funcao:** Qual estrutura de dados? `Map`? Objeto? O que e mais conveniente para calcular percentuais?

4. **`exportarTexto` precisa de formatacao:** Como voce alinha colunas no terminal? `padEnd` ou `padStart` em strings?

5. **`criarSuite` e um mini-framework de testes:** O que seu `it` faz de diferente do `jest.it`? Como voce captura erros de assercion sem Jest?

---

## Tarefas para o Sprint

- [ ] Implementar `analisarFuncao` com comparacao profunda
- [ ] Implementar `class RelatorioCobertura` com registro e percentuais
- [ ] Implementar `relatorioCompleto` agregando por modulo
- [ ] Implementar `exportarTexto` com formatacao de tabela
- [ ] Implementar `criarSuite` com `it` e `run`
- [ ] Garantir que todos os testes passam com `npm test`
