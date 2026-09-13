# DEVTECH SISTEMAS S.A.
## Feature: Calculadora interna pro time financeiro

> Time financeiro pediu uma calculadora simples pra conferir contas rápido, sem precisar
> abrir planilha pra cada operação.

---

### Contexto

Nada de fórmula complexa ainda — o financeiro só quer somar, subtrair, multiplicar,
dividir e saber o resto de uma divisão (útil pra saber quantas caixas fechadas dá pra
montar com um estoque, por exemplo). É a hora de praticar os operadores aritméticos do
JavaScript de verdade, um por um.

**Nível:** Estagiário  
**Sprint:** Estagiário — Calculadora Interna  
**Estimativa:** 0h 40m  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Variáveis, tipos de dados e operadores (2/3)

---

### O que fazer

- [ ] Criar o arquivo `calculadora.js` na raiz deste projeto
- [ ] Implementar `somar(a, b)`
- [ ] Implementar `subtrair(a, b)`
- [ ] Implementar `multiplicar(a, b)`
- [ ] Implementar `dividir(a, b)`
- [ ] Implementar `resto(a, b)`
- [ ] Implementar `ehPar(numero)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`calculadora.js`

---

### Especificação das funções

**`somar(a, b)`** — retorna `a + b`

**`subtrair(a, b)`** — retorna `a - b`

**`multiplicar(a, b)`** — retorna `a * b`

**`dividir(a, b)`**
- Retorna `a / b`
- Se `b` for `0`, retorna a string `'Erro: divisao por zero'` em vez de calcular

**`resto(a, b)`** — retorna o resto da divisão inteira de `a` por `b` (operador `%`)

**`ehPar(numero)`**
- Retorna `true` se `numero` for par, `false` se for ímpar
- Use o operador `%` pra descobrir

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`somar`/`subtrair`/`multiplicar`** — Um `return` com o operador certo já resolve cada
uma. São as quatro operações básicas: `+`, `-`, `*`, `/`.

**`dividir`** — Antes de dividir, cheque se `b === 0`. Se for, devolve a mensagem de
erro em vez do cálculo — um `if` simples resolve.

**`resto`** — O operador `%` (módulo) devolve o que "sobra" de uma divisão. Ex: `7 % 2`
é `1`, porque `7` dividido por `2` dá `3` e sobra `1`.

**`ehPar`** — Todo número par, dividido por `2`, não deixa resto. Use `%` pra checar se
o resto é `0`.

---

### Tarefas sugeridas para o Sprint

```
add Criar calculadora.js
add Implementar somar, subtrair e multiplicar
add Implementar dividir (com tratamento de divisao por zero)
add Implementar resto e ehPar
add Passar em todos os testes
```
