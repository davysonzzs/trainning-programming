# Tópico 8 — Recursão e casos base

*Fase 1 — Fundamentos de Programação · [voltar para a trilha](../../AULAS.md)*

---

## O que é

Uma função **recursiva** é uma função que chama a si mesma para resolver uma versão
menor do mesmo problema. Toda recursão precisa de duas partes:

- **Caso base** — quando parar, sem chamar a função de novo.
- **Caso recursivo** — onde ela chama a si mesma com uma entrada "menor", se
  aproximando do caso base.

```js
function fatorial(n) {
  if (n === 0) return 1;      // caso base
  return n * fatorial(n - 1); // caso recursivo
}
fatorial(4); // 4 * fatorial(3) * ... até fatorial(0) = 1 → 24
```

Sem caso base (ou um caso base que nunca é alcançado), a função chama a si mesma para
sempre, até o programa quebrar com `Maximum call stack size exceeded` — é o "loop
infinito" da recursão.

## Exemplo

Quase tudo que se resolve com recursão também dá para resolver com um loop — recursão
costuma deixar o código mais curto para problemas que já são "naturalmente" divididos
em partes menores de si mesmos:

```js
function somaDaLista(valores) {
  if (valores.length === 0) return 0;               // caso base: lista vazia
  const [primeiro, ...resto] = valores;
  return primeiro + somaDaLista(resto);              // caso recursivo
}
somaDaLista([10, 20, 30]); // 10 + somaDaLista([20, 30]) = ... = 60
```

## Na prática da DevTech

Dados de verdade costumam vir **aninhados** — uma categoria com subcategorias, um menu
com submenus. Recursão é a ferramenta certa pra "descer" nessas estruturas sem saber de
antemão quantos níveis existem (exemplo genérico — não é o seu exercício):

```js
const categoria = {
  nome: 'Eletrônicos',
  itens: 12,
  subcategorias: [
    { nome: 'Celulares', itens: 5, subcategorias: [] },
    { nome: 'Acessórios', itens: 3, subcategorias: [
      { nome: 'Capinhas', itens: 8, subcategorias: [] },
    ]},
  ],
};

function contarItensTotal(cat) {
  const dosFilhos = cat.subcategorias.reduce(
    (soma, sub) => soma + contarItensTotal(sub), // chama a si mesma pra cada filho
    0,
  );
  return cat.itens + dosFilhos;
}
contarItensTotal(categoria); // 12 + 5 + (3 + 8) = 28
```

Repare que o caso base aqui é implícito: quando `subcategorias` é um array vazio,
`.reduce()` devolve o valor inicial (`0`) sem chamar `contarItensTotal` de novo — a
recursão simplesmente para de se aprofundar.

## Tente você

Escreva `soma(n)` que soma de `1` até `n` usando recursão (`soma(n) = n + soma(n-1)`,
caso base `soma(0) = 0`). Teste `soma(5)` no REPL. Depois tente adaptar o exemplo de
`contarItensTotal` pra um array de listas dentro de listas (`[[1,2],[3,[4,5]]]`, por
exemplo) — é o mesmo raciocínio de "descer" na estrutura.

## Erros comuns

- Esquecer o caso base.
- O caso recursivo não se aproximar do caso base (ex.: chamar `fatorial(n)` de novo em
  vez de `fatorial(n - 1)`).

## Onde aparece nos seus projetos

`24-motor-calculo-combinatorio`, `25-consolidador-recursivo-pedidos`,
`26-simulador-crescimento-populacional`.
