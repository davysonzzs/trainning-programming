# Tópico 9 — Algoritmos de ordenação (bubble sort, selection sort)

*Fase 1 — Fundamentos de Programação · [voltar para a trilha](../../AULAS.md)*

---

## O que é

Ordenar é colocar os elementos de um array em ordem (crescente ou decrescente).
JavaScript já tem `.sort()` pronto, mas entender **como** um algoritmo de ordenação
funciona por dentro é o que ensina a pensar em passos e complexidade — por isso a fase
pede para implementar na mão.

## Exemplo

**Selection sort** — a ideia: para cada posição, ache o menor valor do restante do
array e troque com a posição atual.

```
[5, 2, 4, 1]
posição 0: menor do resto é 1 (índice 3) → troca → [1, 2, 4, 5]
posição 1: menor do resto é 2 (já está lá)          → [1, 2, 4, 5]
posição 2: menor do resto é 4 (já está lá)          → [1, 2, 4, 5]
```

```js
function indiceDoMenor(arr, apartirDe) {
  let menor = apartirDe;
  for (let i = apartirDe + 1; i < arr.length; i++) {
    if (arr[i] < arr[menor]) menor = i;
  }
  return menor;
}
```

**Bubble sort** — a ideia: comparar pares vizinhos e trocar quando estão na ordem
errada, repetindo várias passadas até nada mais trocar (os maiores valores vão
"borbulhando" para o fim a cada passada).

## Na prática da DevTech

Ordenar uma fila de chamados de suporte por prioridade (exemplo genérico — os projetos
usam fila de atendimento, estoque e funcionários, não chamados):

```js
const chamados = [
  { protocolo: 'A1', prioridade: 2 },
  { protocolo: 'A2', prioridade: 5 },
  { protocolo: 'A3', prioridade: 1 },
];

function indiceDoMaisPrioritario(lista, apartirDe) {
  let escolhido = apartirDe;
  for (let i = apartirDe + 1; i < lista.length; i++) {
    if (lista[i].prioridade > lista[escolhido].prioridade) escolhido = i;
  }
  return escolhido;
}
```

Repare: é o **mesmo algoritmo** de `indiceDoMenor` acima, só que comparando
`.prioridade` de um objeto em vez de comparar números soltos — essa é a adaptação que
`29-ranking-personalizavel-funcionarios` pede depois de `27-ordenador-fila-atendimento`
e `28-otimizador-ordenacao-estoque` já terem trabalhado com números puros.

## Tente você

No papel, simule um selection sort em `[9, 3, 7, 1]` passo a passo antes de programar —
anote o estado do array depois de cada troca.

## Erros comuns

- Trocar o **valor** em vez do **índice** guardado (ou o contrário) — `indiceDoMenor`
  deve devolver um índice, não o valor.
- Esquecer de reiniciar a busca do "menor" (ou "mais prioritário") a cada posição nova.

## Onde aparece nos seus projetos

`27-ordenador-fila-atendimento`, `28-otimizador-ordenacao-estoque`,
`29-ranking-personalizavel-funcionarios`.
