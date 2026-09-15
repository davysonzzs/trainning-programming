# Tópico 6 — Arrays: criação, iteração e métodos essenciais

*Fase 1 — Fundamentos de Programação · [voltar para a trilha](../../AULAS.md)*

---

## O que é

Um array guarda uma lista ordenada de valores.

```js
const frutas = ['maçã', 'banana', 'uva'];
frutas[0];      // 'maçã' — índice começa em 0
frutas.length;  // 3
```

Dá para percorrer com `for` (usando o índice), mas os métodos prontos do array
costumam deixar o código mais direto — e nenhum deles muda o array original, todos
devolvem um valor novo:

- **`.map()`** transforma cada item, devolvendo um array novo do **mesmo tamanho**.
- **`.filter()`** devolve só os itens que passam num teste (a função passada retorna
  `true`/`false`).
- **`.reduce()`** "reduz" o array inteiro a um único valor, acumulando passo a passo.
- **`.find()`** devolve o **primeiro** item que passa no teste (ou `undefined`, se
  nenhum passar).

## Exemplo

```js
const precos       = [10, 25, 8, 40];
const comDesconto  = precos.map(p => p * 0.9);              // [9, 22.5, 7.2, 36]
const caros         = precos.filter(p => p > 20);             // [25, 40]
const total          = precos.reduce((soma, p) => soma + p, 0); // 83
```

## Na prática da DevTech

Um relatório de chamados de suporte, filtrando e somando (exemplo genérico — não é o
seu exercício de lista de compras/vendas/pedidos):

```js
const chamados = [
  { assunto: 'login',    urgente: true,  minutos: 15 },
  { assunto: 'cobranca', urgente: false, minutos: 40 },
  { assunto: 'bug',      urgente: true,  minutos: 90 },
];

const urgentes     = chamados.filter(c => c.urgente);
const tempoTotal    = chamados.reduce((soma, c) => soma + c.minutos, 0); // 145
const soAssuntos    = chamados.map(c => c.assunto); // ['login', 'cobranca', 'bug']
```

Combinar `.filter()` + `.reduce()` (filtrar primeiro, somar depois) é exatamente o tipo
de encadeamento que `19-relatorio-estatisticas-vendas` e `20-processador-pedidos`
esperam de você.

## Tente você

Com `const numeros = [4, 15, 8, 23, 16, 42]`, use `.filter()` para pegar só os pares,
depois `.map()` para dobrar cada um, depois `.reduce()` para somar tudo — em três linhas
separadas, para ver cada resultado no meio do caminho.

## Erros comuns

- Esquecer o valor inicial (`0` no exemplo acima) no `.reduce()` quando o array pode vir
  vazio.
- Achar que `.map()`/`.filter()` alteram o array original — eles não alteram.

## Onde aparece nos seus projetos

`18-sistema-lista-compras-mercado`, `19-relatorio-estatisticas-vendas`,
`20-processador-pedidos`.
