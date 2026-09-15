# DEVTECH SISTEMAS S.A.
## Bug Fix: Módulo de cálculo financeiro quebrado

> Sistema de pagamentos retornando valores errados após refactor — P1 aberto pelo cliente.

---

### Contexto

O dev que fez o último refactor deletou o arquivo `financeiro.js` por engano antes de commitar.
O sistema de cobranças está parado. Você precisa recriar o módulo do zero com base nos testes
que sobreviveram no repositório. Tech Lead já deixou os testes prontos — é só fazer passar.

**Nível:** Estagiário  
**Sprint:** Estagiário — Calculadora Financeira  
**Estimativa:** 2h  
**Prioridade:** Alta  
**Tópico da trilha:** Fase 1 — Fundamentos › Funções: parâmetros, retorno e escopo (3/3)

---

### O que fazer

- [ ] Criar o arquivo `financeiro.js` na raiz deste projeto
- [ ] Implementar `calcularJuros(valor, taxa, meses)`
- [ ] Implementar `calcularDesconto(valor, percentual)`
- [ ] Implementar `calcularParcelas(valorTotal, numParcelas)`
- [ ] Implementar `calcularImposto(valor, tipo)`
- [ ] Implementar `resumoCompra(preco, desconto, imposto)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`financeiro.js` — módulo CommonJS com todas as funções exportadas.

```js
// Exemplo de estrutura esperada
function calcularJuros(valor, taxa, meses) { ... }

module.exports = { calcularJuros, calcularDesconto, ... };
```

---

### Especificação das funções

**`calcularJuros(valor, taxa, meses)`**
- Juros compostos: `valor * (1 + taxa/100) ^ meses`
- Retorna número arredondado para 2 casas decimais
- Ex: `calcularJuros(1000, 2, 3)` → `1061.21`

**`calcularDesconto(valor, percentual)`**
- `valor - (valor * percentual / 100)`
- Retorna número arredondado para 2 casas decimais
- Ex: `calcularDesconto(200, 10)` → `180`

**`calcularParcelas(valorTotal, numParcelas)`**
- Divisão simples arredondada para 2 casas decimais
- Ex: `calcularParcelas(100, 3)` → `33.33`

**`calcularImposto(valor, tipo)`**
- Tipos aceitos: `'ISS'` (5%), `'ICMS'` (12%), `'IPI'` (10%)
- Retorna o valor do imposto (não o total)
- Ex: `calcularImposto(1000, 'ISS')` → `50`
- Lança `Error('Tipo de imposto invalido')` para tipo desconhecido

**`resumoCompra(preco, descontoPercentual, tipoImposto)`**
- Retorna objeto: `{ original, desconto, impostos, total }`
- `total = preco - desconto_calculado + imposto_calculado`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 5 — Funções: parâmetros, retorno e escopo**
> em [`05-funcoes-parametros-retorno-escopo.md`](../../../aulas/fase-01-fundamentos-de-programacao/05-funcoes-parametros-retorno-escopo.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`calcularJuros`** — Se o valor cresce a cada mês sobre o resultado do mês anterior (não sobre o original), qual operador matemático faz isso acumular ao longo dos meses?

**`calcularDesconto`** — Quanto é X% de um valor? Você está subtraindo o desconto do valor original?

**`calcularParcelas`** — Divisão simples. Mas o que `Math.round` faz com casas decimais?

**`calcularImposto`** — Você está retornando o valor do imposto, não o total com imposto. E para tipo inválido, o que `throw new Error(...)` faz?

**`resumoCompra`** — Você já implementou as funções anteriores. Use-as. Qual é a ordem: primeiro desconto, depois imposto, ou vice-versa? Leia a especificação do `total`.

---

### Tarefas sugeridas para o Sprint

No Painel de Sprint, depois de rodar `projeto` (ele já define a sprint e a estimativa pra você), adicione:
```
add Criar financeiro.js
add Implementar calcularJuros
add Implementar calcularDesconto e calcularParcelas
add Implementar calcularImposto
add Implementar resumoCompra
add Passar em todos os testes
```
