# Tópico 5 — Funções: parâmetros, retorno e escopo

*Fase 1 — Fundamentos de Programação · [voltar para a trilha](../../AULAS.md)*

---

## O que é

Uma função empacota um pedaço de lógica que você pode chamar quantas vezes quiser, com
entradas (**parâmetros**) diferentes a cada vez.

```js
function somar(a, b) {
  return a + b;
}
somar(2, 3);   // 5
somar(10, -4); // 6
```

`return` interrompe a função e devolve um valor para quem chamou — sem `return`, a
função devolve `undefined`. Uma função pode ter vários `return`, um para cada caminho
possível (combinado com `if`, por exemplo).

## Exemplo

**Escopo** é "onde uma variável existe". Uma variável declarada dentro de uma função
(com `let`/`const`) só existe *dentro* dela — ninguém de fora enxerga. Isso é bom: cada
função pode usar nomes de variável livremente sem atropelar outra parte do código.

```js
function calcular() {
  const resultado = 10; // só existe aqui dentro
  return resultado;
}
console.log(resultado); // ERRO — resultado não existe fora da função
```

Uma função também pode "lembrar" de uma variável de fora dela, mesmo depois de ter
terminado de rodar, se ela devolver algo que ainda usa essa variável — isso é o começo
do conceito de **closure**:

```js
function criarCofre(saldoInicial) {
  let saldo = saldoInicial;
  return {
    depositar(valor) { saldo += valor; },
    consultar() { return saldo; },
  };
}
const cofreA = criarCofre(100);
cofreA.depositar(50);
cofreA.consultar(); // 150 — "saldo" continua vivo, preso ao objeto devolvido
```

## Na prática da DevTech

Funções pequenas que fazem uma coisa só, e se combinam, evitam repetir lógica. Exemplo
genérico (frete, não é seu exercício de juros/desconto):

```js
function calcularFrete(peso) {
  return peso <= 5 ? 12 : 25;
}
function calcularTotalComFrete(valorProdutos, peso) {
  return valorProdutos + calcularFrete(peso); // reaproveita a função de cima
}
```

Reaproveitar uma função pequena dentro de outra maior é exatamente o que
`15-modulo-utilitarios-financeiros` e `17-calculadora-financeira` pedem — cada função
resolve uma parte, e a função "de cima" só organiza a ordem em que elas são chamadas.

## Tente você

Escreva uma função `media(a, b, c)` que devolve a média dos três números, e uma
`ehPar(n)` que devolve `true`/`false` usando o `%` do Tópico 2. Depois tente o exemplo
de `criarCofre` acima no REPL: crie dois cofres diferentes e confirme que depositar num
não muda o saldo do outro.

## Erros comuns

- Esquecer o `return` e o resultado virar `undefined` silenciosamente.
- Tentar usar, fora da função, uma variável que só existe dentro dela.

## Onde aparece nos seus projetos

`15-modulo-utilitarios-financeiros`, `16-sistema-contadores-independentes` (o exemplo de
closure acima é bem próximo do que esse projeto pede), `17-calculadora-financeira`.
