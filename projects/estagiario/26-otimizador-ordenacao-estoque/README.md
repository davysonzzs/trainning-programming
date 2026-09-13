# DEVTECH SISTEMAS S.A.
## Feature: Otimizador de ordenação do painel de estoque

> Painel de estoque com poucas trocas de posição precisa de um algoritmo mais eficiente
> que o bubble sort pra ordenar a lista de quantidades.

---

### Contexto

O Tech Lead mostrou outro algoritmo de ordenação clássico: o **selection sort**. A
diferença pro bubble sort: em vez de trocar pares vizinhos várias vezes, ele busca o menor
(ou maior) elemento da parte ainda não ordenada e o coloca direto na posição certa — menos
trocas de posição no total.

**Nível:** Estagiário  
**Sprint:** Estagiário — Otimizador de Ordenação  
**Estimativa:** 1h  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Algoritmos de ordenação (bubble sort, selection sort) (2/3)

---

### O que fazer

- [ ] Criar o arquivo `selectionSort.js` na raiz deste projeto
- [ ] Implementar `selectionSortCrescente(numeros)`
- [ ] Implementar `indiceDoMenor(numeros, apartirDe)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`selectionSort.js`

---

### Especificação das funções

**`indiceDoMenor(numeros, apartirDe)`**
- Recebe um array e um índice inicial
- Retorna o **índice** (posição) do menor valor entre `apartirDe` e o final do array
- Ex: `indiceDoMenor([5, 2, 8, 1], 1)` → `3` (o `1` está na posição 3, e é o menor entre
  as posições 1, 2 e 3)

**`selectionSortCrescente(numeros)`**
- Retorna um **novo** array ordenado do menor pro maior, **usando o algoritmo
  selection sort** (não use `.sort()`)
- Não altere o array recebido
- Dica: use `indiceDoMenor` dentro dessa função

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`indiceDoMenor`** — Comece assumindo que o menor é o de `apartirDe`, e percorra o
resto do array comparando — sempre que achar um valor menor, atualiza o índice guardado.
No final, devolve o índice (não o valor).

**`selectionSortCrescente`** — Pra cada posição `i` do array (de `0` até o penúltimo),
ache o índice do menor valor a partir de `i` (com `indiceDoMenor`) e troque o valor dessa
posição com o valor da posição `i`. Ao final de todas as posições, o array está ordenado.

---

### Tarefas sugeridas para o Sprint

```
add Criar selectionSort.js
add Implementar indiceDoMenor
add Implementar selectionSortCrescente
add Passar em todos os testes
```
