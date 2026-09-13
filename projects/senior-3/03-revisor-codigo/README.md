# DEVTECH SISTEMAS S.A.
## Qualidade: Revisor Automatizado de Código

> URGENTE: Três bugs críticos chegaram em produção esta semana, todos vindos de PRs aprovados sem revisão adequada. O Tech Lead precisa de um gate automático no CI até o fim da sprint.

---
### Contexto

O time da DevTech cresceu rápido e o processo de code review não acompanhou. PRs com `var`, `console.log` em produção e funções de 200 linhas estão chegando ao ambiente de produção semanalmente. O Tech Lead quer um revisor automático mínimo que bloqueie os piores casos antes mesmo do humano olhar o código.

**Nível:** Sênior III
**Sprint:** Sênior III — Revisor de Código
**Estimativa:** 2h
**Prioridade:** Alta

---
### O que fazer
- [ ] Criar o arquivo `revisor.js`
- [ ] Implementar `regraTamanhoCodigo(maxLinhas)`
- [ ] Implementar `regraVarProibido()`
- [ ] Implementar `regraConsoleLog()`
- [ ] Implementar `regraNomesClaros(excecoesLoop)`
- [ ] Implementar `regraFuncaoGrande(maxLinhas)`
- [ ] Implementar a classe `Revisor` com `analisar`, `analisarMultiplos` e `gerarRelatorio`
- [ ] Fazer todos os testes passarem (`npm test`)

---
### Arquivo a criar
`revisor.js`

---
### Especificação das funções

Cada função de regra recebe uma string `codigo` e retorna um array de issues:
```js
// Formato de issue:
{ linha: 5, mensagem: 'Use let ou const em vez de var', severidade: 'erro' }
```

#### `regraTamanhoCodigo(maxLinhas = 200)`
```js
const regra = regraTamanhoCodigo(3);
regra('linha1\nlinha2\nlinha3\nlinha4');
// [{ linha: 3, mensagem: 'Arquivo muito grande: 4 linhas (max: 3)', severidade: 'aviso' }]

regra('linha1\nlinha2');
// []
```

#### `regraVarProibido()`
```js
const regra = regraVarProibido();
regra('const x = 1;\nvar y = 2;\nlet z = 3;');
// [{ linha: 2, mensagem: 'Use let ou const em vez de var', severidade: 'erro' }]
```
Detecta `var ` (com espaço) em cada linha.

#### `regraConsoleLog()`
```js
const regra = regraConsoleLog();
regra('function foo() {\n  console.log("debug");\n}');
// [{ linha: 2, mensagem: 'Remova console.log antes de commitar', severidade: 'aviso' }]
```
Não detectar `console.log` em linhas que começam com `//`.

#### `regraNomesClaros(excecoesLoop = ['i','j','k','n','x','y'])`
```js
const regra = regraNomesClaros();
regra('const ab = 1;\nconst i = 0;\nconst nome = "ok";');
// [{ linha: 1, mensagem: "Nome de variável muito curto: 'ab'", severidade: 'sugestao' }]
// (i está na lista de exceções)
```

#### `regraFuncaoGrande(maxLinhas = 30)`
Detecta funções com mais de `maxLinhas` linhas internas usando heurística de contagem de linhas entre `function` e seu `}` de fechamento.
```js
const regra = regraFuncaoGrande(3);
const codigo = [
  'function grande() {',
  '  const a = 1;',
  '  const b = 2;',
  '  const c = 3;',
  '  const d = 4;',
  '}'
].join('\n');
regra(codigo);
// [{ linha: 1, mensagem: 'Função muito grande: 4 linhas internas (max: 3)', severidade: 'aviso' }]
```

#### `class Revisor`
```js
const revisor = new Revisor([regraVarProibido(), regraConsoleLog()]);
const resultado = revisor.analisar('var x = 1;\nconsole.log(x);', 'app.js');
// {
//   arquivo: 'app.js',
//   issues: [
//     { linha: 1, mensagem: 'Use let ou const em vez de var', severidade: 'erro' },
//     { linha: 2, mensagem: 'Remova console.log antes de commitar', severidade: 'aviso' }
//   ],
//   aprovado: false,
//   pontuacao: 75   // 100 - (1*20) - (1*5)
// }
```

Pontuação: `100 - (erros * 20) - (avisos * 5) - (sugestoes * 1)`

`analisarMultiplos(arquivos)` — `arquivos = [{nome, codigo}]`:
```js
// retorna:
{
  arquivos: [...resultados],
  totalIssues: 3,
  aprovados: 1,
  reprovados: 1
}
```

`gerarRelatorio(resultado)` — string legível no terminal com issues agrupados por severidade e pontuação final.

---
### Como testar
```bash
npm install
npm test
```

---
### Dicas (tente sozinho antes de usar)

**regraVarProibido e regraConsoleLog:**
- Como você itera sobre as linhas de uma string e rastreia o número de cada linha?
- Lembre-se que os índices de array começam em 0, mas números de linha começam em 1.

**regraNomesClaros:**
- Como o regex `\b(let|const|var)\s+([a-z]{1,2})\b` captura o nome da variável?
- Como você verifica se um valor está em um array (lista de exceções)?

**Revisor.analisar:**
- Como você conta issues por severidade para calcular a pontuação?
- Como você determina se o arquivo está `aprovado` (dica: apenas erros reprovam)?

---
### Tarefas sugeridas para o Sprint
```
add Criar revisor.js
add Implementar regraTamanhoCodigo
add Implementar regraVarProibido
add Implementar regraConsoleLog
add Implementar regraNomesClaros
add Implementar regraFuncaoGrande
add Implementar classe Revisor com analisar
add Implementar analisarMultiplos e gerarRelatorio
add Fazer todos os testes passarem
```
