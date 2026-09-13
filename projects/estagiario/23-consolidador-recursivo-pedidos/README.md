# DEVTECH SISTEMAS S.A.
## Feature: Consolidador recursivo de pedidos em lote

> Sistema de faturamento em lote está estourando memória com loops gigantes — Tech Lead
> quer testar uma versão recursiva pra comparar.

---

### Contexto

O time de faturamento processa pedidos em lote e quer uma versão do somador de valores
escrita com recursão, pra treinar o raciocínio recursivo sobre arrays (que é diferente de
recursão sobre números, como no projeto anterior). Aqui a "redução" acontece sobre a
**lista**, não sobre um número.

**Nível:** Estagiário  
**Sprint:** Estagiário — Consolidador de Pedidos  
**Estimativa:** 1h  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Recursão e casos base (2/3)

---

### O que fazer

- [ ] Criar o arquivo `recursao.js` na raiz deste projeto
- [ ] Implementar `somarValoresRecursivo(valores)`
- [ ] Implementar `contagemRegressiva(n)`
- [ ] Implementar `inverterArrayRecursivo(lista)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`recursao.js`

---

### Especificação das funções

**`somarValoresRecursivo(valores)`**
- Soma todos os números de um array **usando recursão** (nada de `for`, `while` ou
  `.reduce()`)
- Caso base: array vazio `[]` → `0`
- Ex: `somarValoresRecursivo([10, 20, 30])` → `60`

**`contagemRegressiva(n)`**
- Retorna um array contando de `n` até `1`, na ordem decrescente, **usando recursão**
- Caso base: `n <= 0` → `[]`
- Ex: `contagemRegressiva(3)` → `[3, 2, 1]`

**`inverterArrayRecursivo(lista)`**
- Inverte a ordem de um array **usando recursão** (sem usar `.reverse()`)
- Caso base: array vazio ou com 1 item → ele mesmo
- Ex: `inverterArrayRecursivo([1, 2, 3])` → `[3, 2, 1]`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`somarValoresRecursivo`** — Pense: "a soma da lista inteira é o primeiro item, mais a
soma do **resto** da lista". O resto de um array (sem o primeiro item) você pega com
`valores.slice(1)`. O caso base é quando a lista fica vazia.

**`contagemRegressiva`** — "A contagem de `n` é o próprio `n`, seguido da contagem de
`n - 1`". Você pode montar isso com `[n, ...contagemRegressiva(n - 1)]`, parando quando
`n` chega a `0`.

**`inverterArrayRecursivo`** — "Inverter a lista é: inverter o resto dela, e colocar o
primeiro item no final". Ou seja: `[...inverterArrayRecursivo(lista.slice(1)), lista[0]]`,
com caso base pra lista vazia ou de 1 item.

---

### Tarefas sugeridas para o Sprint

```
add Criar recursao.js
add Implementar somarValoresRecursivo
add Implementar contagemRegressiva
add Implementar inverterArrayRecursivo
add Passar em todos os testes
```
