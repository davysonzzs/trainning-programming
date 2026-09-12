# 04 — Pipeline de CI

**Nível:** Sênior I
**Fase:** 12 — DevOps Patterns
**Estimativa:** 2h

---

## Contexto

O time da DevTech faz merges direto na main sem nenhuma verificacao automatizada. Bugs chegam em producao regularmente porque ninguem roda os testes antes de mergear. O Tech Lead Pedro quer implementar um pipeline de CI (Continuous Integration) que bloqueia merges quando testes falham ou coverage esta abaixo do minimo.

Como o ambiente e Node.js puro, o pipeline sera implementado como um modulo testavel — sem GitHub Actions, sem Jenkins. O conceito e o mesmo: stages sequenciais, cada um com entrada e saida, abortando se configurado para isso.

---

## O que fazer

Implemente o arquivo `pipeline.js` com um sistema de pipeline de CI configuravel com stages sequenciais.

---

## Arquivo a criar

**`pipeline.js`** na raiz deste projeto.

---

## Especificacao

### `criarPipeline(config)`

`config`: `{ nome: string, stages: Stage[] }`

Cada Stage e um objeto:
```js
{
  nome: string,
  executar: async (contexto) => qualquerValor,
  abortar_se_falha: boolean  // default false
}
```

O contexto passado para cada stage:
```js
{
  input: { ... },        // input original do pipeline
  resultados: {          // resultados dos stages anteriores
    'nome-stage': resultado
  }
}
```

O pipeline retornado tem:

#### `async executar(input = {})`
Executa stages em sequencia. Para cada stage:
- Mede tempo de execucao
- Captura resultado ou erro
- Se falhou e `abortar_se_falha = true`: para o pipeline
- Stages posteriores ao abort ficam com `status: 'pulado'`

Retorna:
```js
{
  sucesso: boolean,  // true se todos os stages essenciais passaram
  duracao: number,   // ms total
  stages: [
    {
      nome: string,
      status: 'passou' | 'falhou' | 'pulado',
      duracao: number,
      resultado: any,
      erro: string | null
    }
  ]
}
```

#### `adicionarStage(stage)`
Adiciona stage ao pipeline (encadeamento).

#### `relatorio(resultado)`
Formata resultado como string para terminal.

### Stages pre-definidos

#### `stageLint(arquivos)`
Verifica se cada arquivo e uma string nao-vazia. Retorna `{ passou: true, arquivos }` ou lanca erro com arquivos invalidos.

#### `stageTestes(suite)`
`suite` e array de funcoes `() => boolean`. Executa todos. Retorna `{ passou: boolean, total, passaram, falharam }`. Lanca erro se algum falhar.

#### `stageBuild(entradas)`
Transforma entradas: retorna `{ artefatos: entradas.map(e => e + '.compiled'), tamanhoKb: entradas.length * 10 }`.

#### `stageVerificarCoverage(percentualMinimo, percentualAtual)`
Retorna `{ passou: true, percentual: percentualAtual }` ou lanca `Error('Coverage insuficiente: X% < Y%')`.

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

Antes de codar, pense:

1. **Como voce mede duracao de um stage?** `Date.now()` antes e depois? `performance.now()` para mais precisao?

2. **O contexto acumulado entre stages** — como o stage 3 acessa o resultado do stage 1? Pense em como voce vai construir e passar esse objeto.

3. **`abortar_se_falha` vs continuar:** Se um stage de lint falha mas nao tem `abortar_se_falha`, o pipeline deve continuar? Os stages seguintes ainda rodam?

4. **`sucesso` no retorno final:** Quando o pipeline e considerado bem-sucedido? Se um stage falhou mas nao era essencial (`abortar_se_falha: false`), o pipeline ainda e `sucesso: true`?

5. **`relatorio` como string formatada:** Como voce alinha o texto? Status colorido? Use simbolos ASCII como `[OK]` e `[FAIL]`.

---

## Tarefas para o Sprint

- [ ] Implementar `criarPipeline` com logica de execucao sequencial
- [ ] Implementar medicao de tempo por stage
- [ ] Implementar logica de `abortar_se_falha`
- [ ] Implementar acumulacao de contexto entre stages
- [ ] Implementar `adicionarStage` e `relatorio`
- [ ] Implementar os 4 stages pre-definidos
- [ ] Garantir que todos os testes passam com `npm test`
