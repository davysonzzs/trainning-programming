# DEVTECH SISTEMAS S.A.
## Feature: Calculadora de troco do caixa automático da lanchonete

> Caixa automático da lanchonete da empresa precisa calcular o troco em moedas/notas.

---

### Contexto

A lanchonete do prédio instalou um caixa automático e pediu ajuda da DevTech pra calcular
o troco: dado quanto o cliente pagou e quanto custou o pedido, o sistema precisa dizer
quantas notas/moedas de cada valor entregar, usando a menor quantidade possível. Isso é
um algoritmo clássico — antes de programar, pensa em como você faria isso na mão: sempre
usar primeiro a maior nota/moeda que couber no valor restante.

**Nível:** Estagiário  
**Sprint:** Estagiário — Troco do Caixa  
**Estimativa:** 0h 40m  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Lógica de programação: algoritmos e pseudocódigo (3/3)

---

### O que fazer

- [ ] Criar o arquivo `troco.js` na raiz deste projeto
- [ ] Implementar `calcularTroco(valorPago, valorCompra)`
- [ ] Implementar `decompor(valor)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`troco.js`

---

### Especificação das funções

**Cédulas/moedas disponíveis (em reais):** `100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.10, 0.05`

**`calcularTroco(valorPago, valorCompra)`**
- Retorna o valor do troco (`valorPago - valorCompra`), arredondado para 2 casas decimais
- Se `valorPago` for menor que `valorCompra`, retorna `0` (não existe troco negativo)

**`decompor(valor)`**
- Recebe um valor em reais (ex: `37.5`)
- Retorna um array com a menor quantidade de cédulas/moedas que somam esse valor, da
  maior pra menor
- Ex: `decompor(37.5)` → `[20, 10, 5, 2, 0.5]`
- Ex: `decompor(3)` → `[2, 1]`
- Valor `0` retorna array vazio `[]`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`calcularTroco`** — Subtração simples, só cuidado com o caso do pagamento ser menor
que a compra, e com arredondamento de casas decimais (`Math.round`).

**`decompor`** — Pense em pseudocódigo primeiro: "enquanto sobrar valor, pega a maior
cédula que ainda cabe nele, tira do valor restante, guarda na lista, repete". Isso é um
`while` (ainda não obrigatório usar, mas ajuda pensar assim) percorrendo a lista de
cédulas da maior pra menor. Cuidado com problemas de arredondamento de ponto flutuante —
uma dica é trabalhar em centavos (multiplicar tudo por 100) e converter de volta no final.

---

### Tarefas sugeridas para o Sprint

```
add Criar troco.js
add Implementar calcularTroco
add Implementar decompor
add Passar em todos os testes
```
