# Tópico 3 — Estruturas condicionais (if, else, switch)

*Fase 1 — Fundamentos de Programação · [voltar para a trilha](../../AULAS.md)*

---

## O que é

Um programa que sempre faz a mesma coisa não decide nada. `if` executa um bloco só
quando uma condição é `true`; `else` cobre o que sobra.

```js
function classificar(nota) {
  if (nota >= 7) {
    return 'aprovado';
  } else if (nota >= 5) {
    return 'recuperação';
  } else {
    return 'reprovado';
  }
}
```

Condições se combinam com `&&` (E — as duas precisam ser verdadeiras) e `||` (OU — pelo
menos uma precisa ser verdadeira), e se negam com `!`.

```js
const podeEntrar = idade >= 18 && temIngresso;
const folga       = ehFeriado || ehFimDeSemana;
```

## Exemplo

`switch` é uma alternativa a uma cadeia longa de `if/else if` quando você compara **o
mesmo valor** contra várias opções fixas — não esqueça o `break` em cada `case`, ou a
execução "cai" pro próximo de propósito (fallthrough).

```js
switch (cargo) {
  case 'estagiario': salario = 1000; break;
  case 'junior':      salario = 3000; break;
  default:            salario = 0;
}
```

## Na prática da DevTech

Um caso bem comum: decidir o valor do frete a partir de uma faixa de peso (exemplo
genérico — não é o seu exercício de idade/sensor/cardápio):

```js
function calcularFrete(pesoKg) {
  if (pesoKg <= 1)       return 5;
  else if (pesoKg <= 5)  return 12;
  else if (pesoKg <= 20) return 25;
  else                    return 40;
}
```

Repare na ordem dos `if`: eles testam do menor peso pro maior, e cada `else if` só roda
se o anterior falhou — testar `pesoKg <= 20` primeiro faria todo peso menor que isso
"parar" ali sem chance de cair nas faixas certas. É o mesmo cuidado com limites que os
projetos `07-classificador-idade`, `08-validador-sensor-estacionamento` e
`09-sistema-cardapio-dinamico` cobram de você.

## Tente você

Escreva uma função `ehMaiorDeIdade(idade)` que devolve `true`/`false`, depois uma
`categoriaEtaria(idade)` que devolve `'crianca'`, `'adolescente'` ou `'adulto'` usando
`if/else if`.

## Erros comuns

- Esquecer o `break` no `switch`.
- Usar vários `if` separados quando deveriam ser `else if` — isso testa todas as
  condições mesmo depois de uma já ter batido, o que além de desnecessário pode causar
  bugs quando as condições se sobrepõem.
- Testar os limites na ordem errada (do maior pro menor quando deveria ser do menor pro
  maior, ou vice-versa).

## Onde aparece nos seus projetos

`07-classificador-idade`, `08-validador-sensor-estacionamento`,
`09-sistema-cardapio-dinamico`.
