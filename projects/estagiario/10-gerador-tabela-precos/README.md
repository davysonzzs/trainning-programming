# DEVTECH SISTEMAS S.A.
## Feature: Gerador de tabela de preços por quantidade

> Fornecedor pediu uma tabela mostrando o preço total pra cada quantidade de 1 a 10
> unidades de um produto — hoje isso é montado à mão numa planilha.

---

### Contexto

O time comercial monta manualmente uma "tabela de multiplicação" de preços toda vez que
fecha com um fornecedor novo (1 unidade custa X, 2 custam 2X, e assim por diante, até 10).
Isso é repetitivo — a cara de um problema resolvido com **loop**. Você vai gerar essa
tabela automaticamente com `for`.

**Nível:** Estagiário  
**Sprint:** Estagiário — Tabela de Preços  
**Estimativa:** 0h 45m  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Estruturas de repetição (for, while, do-while) (1/3)

---

### O que fazer

- [ ] Criar o arquivo `tabuada.js` na raiz deste projeto
- [ ] Implementar `tabelaDePrecos(precoUnitario)`
- [ ] Implementar `somaDe1Ate(n)`
- [ ] Implementar `primeirosMultiplos(base, quantidade)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`tabuada.js`

---

### Especificação das funções

**`tabelaDePrecos(precoUnitario)`**
- Retorna um array com 10 posições: `[1 * precoUnitario, 2 * precoUnitario, ..., 10 * precoUnitario]`
- Ex: `tabelaDePrecos(5)` → `[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]`

**`somaDe1Ate(n)`**
- Retorna a soma de todos os números inteiros de `1` até `n` (incluindo `n`)
- Ex: `somaDe1Ate(5)` → `15` (1+2+3+4+5)
- `n` igual a `0` ou negativo retorna `0`

**`primeirosMultiplos(base, quantidade)`**
- Retorna um array com os primeiros `quantidade` múltiplos de `base` (sem contar o `0`)
- Ex: `primeirosMultiplos(3, 4)` → `[3, 6, 9, 12]`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`tabelaDePrecos`** — Um `for (let i = 1; i <= 10; i++)` percorrendo de 1 a 10,
guardando `i * precoUnitario` num array a cada volta.

**`somaDe1Ate`** — Comece com um acumulador `let total = 0` fora do loop, e vá somando
`i` a cada volta do `for`. Não esqueça de tratar o caso de `n` ser `0` ou negativo antes
do loop.

**`primeirosMultiplos`** — Parecido com `tabelaDePrecos`, mas em vez de ir sempre de 1 a
10, você vai de 1 até `quantidade`, multiplicando por `base` a cada volta.

---

### Tarefas sugeridas para o Sprint

```
add Criar tabuada.js
add Implementar tabelaDePrecos
add Implementar somaDe1Ate
add Implementar primeirosMultiplos
add Passar em todos os testes
```
