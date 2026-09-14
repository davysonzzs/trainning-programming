# Tópico 2 — Variáveis, tipos de dados e operadores

*Fase 1 — Fundamentos de Programação · [voltar para a trilha](../../AULAS.md)*

---

## O que é

Uma variável é um espaço nomeado na memória para guardar um valor que você vai usar
depois. Em JavaScript moderno, declare com `let` (quando o valor pode mudar) ou `const`
(quando não muda mais depois de criado — prefira `const` sempre que der).

```js
const nome = 'Ana';       // string (texto)
let idade = 28;            // number (número)
let ativo = true;          // boolean (verdadeiro/falso)
let endereco;               // undefined — declarada mas sem valor ainda
```

JavaScript tem tipos primitivos principais: `string`, `number`, `boolean`, `undefined`,
`null`, e o composto `object` (que inclui arrays e funções). Use `typeof valor` para
descobrir o tipo em tempo de execução.

## Exemplo

Operadores aritméticos (`+ - * / %`) funcionam em números; o `%` (**módulo**) devolve o
**resto** de uma divisão — é como se descobre se um número é par (`n % 2 === 0`) ou
múltiplo de outro.

```js
const resto = 17 % 5;   // 2 (17 dividido por 5 dá 3, resta 2)
```

Operadores de comparação (`=== !== > < >= <=`) devolvem um `boolean`. **Use sempre
`===` e `!==`** (comparação estrita) em vez de `==`/`!=` — o `==` tenta converter tipos
diferentes antes de comparar, o que gera surpresas (`'5' == 5` é `true`, `'5' === 5` é
`false`).

## Na prática da DevTech

Um bug clássico de sistema de verdade: um formulário HTML manda tudo como texto, mesmo
quando parece número. Imagine um pedido chegando assim (exemplo genérico, não é o seu
exercício):

```js
const pedido = { quantidade: '3', precoUnitario: '9.90' };

// Bug: concatena texto em vez de somar
const totalErrado = pedido.quantidade + pedido.precoUnitario; // '39.90' (string!)

// Certo: converte antes de operar
const totalCerto = Number(pedido.quantidade) * Number(pedido.precoUnitario); // 29.7
```

Repare que `typeof pedido.quantidade` é `'string'`, mesmo o valor "parecendo" um
número — é exatamente esse tipo de checagem que os projetos `04-dados-cadastrais` e
`06-conversor-tipos` pedem pra você automatizar.

## Tente você

No terminal, rode `node` (sem argumento nenhum) para abrir o console interativo (REPL),
e teste, um de cada vez: `typeof 10`, `10 % 3`, `'10' === 10`, `'10' == 10`. Veja a
diferença na tela antes de seguir. `.exit` (ou Ctrl+D) fecha o REPL.

## Erros comuns

- Misturar string com number sem querer: `'3' + 2` dá `'32'` (concatenação de texto),
  não `5`.
- Usar `==` por hábito e levar uma comparação inesperada.

## Onde aparece nos seus projetos

`04-dados-cadastrais`, `05-calculadora-interna`, `06-conversor-tipos`.
