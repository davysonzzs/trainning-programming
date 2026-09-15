# Tópico 4 — Estruturas de repetição (for, while, do-while)

*Fase 1 — Fundamentos de Programação · [voltar para a trilha](../../AULAS.md)*

---

## O que é

Um loop repete um bloco de código várias vezes, sem você copiar e colar a mesma linha.
Até aqui (Tópicos 1 a 3), toda vez que você precisava repetir algo, escrevia a linha de
novo à mão — funcionou porque o número de vezes era sempre pequeno e conhecido (3
ingredientes, sempre 3). Um loop resolve o caso em que isso não dá mais: **o número de
vezes só é conhecido quando o programa roda** — uma lista de pedidos do dia, por
exemplo, pode ter 3 itens hoje e 40 amanhã.

Existem três formas, e a diferença entre elas é **quando você já sabe quantas vezes vai
repetir**:

## O `for` — quando você já sabe quantas voltas vai dar

```js
for (let i = 0; i < 5; i++) {
  console.log('Passo', i);
}
// i comeca em 0, roda enquanto i < 5, soma 1 (i++) a cada volta
```

As três partes entre parênteses, na ordem:
1. `let i = 0` — roda **uma vez só**, antes de tudo: cria o contador.
2. `i < 5` — a condição, testada **antes de cada volta**. Enquanto for `true`, o loop
   continua; quando virar `false`, ele para (sem rodar mais nenhuma vez).
3. `i++` — roda **depois de cada volta**, atualiza o contador (`i++` é o mesmo que
   `i = i + 1`).

Passo a passo do que acontece com `for (let i = 0; i < 3; i++) { console.log(i); }`:

| Volta | `i` antes | `i < 3`? | Roda o bloco (imprime) | `i++` |
|---|---|---|---|---|
| 1 | `0` | `true` | `0` | `i` vira `1` |
| 2 | `1` | `true` | `1` | `i` vira `2` |
| 3 | `2` | `true` | `2` | `i` vira `3` |
| 4 | `3` | `false` | — (não roda, loop para) | — |

## O `while` — quando você não sabe de antemão quantas voltas vai precisar

`while` repete enquanto a condição continuar `true` — sem a parte de "contador" embutida
no `for`, então normalmente você cria e atualiza a variável de controle à mão:

```js
let saldo = 100;
while (saldo > 0) {
  saldo -= 30;
}
// saldo: 100 -> 70 -> 40 -> 10 -> -20 (para aqui, -20 > 0 e false)
```
Repare que não dava pra saber de antemão *quantas* vezes o loop ia rodar sem fazer a
conta — depende do valor de `saldo`, que muda a cada volta. É exatamente esse tipo de
situação que pede `while` em vez de `for`.

## O `do-while` — igual ao `while`, mas testa a condição depois

```js
let tentativas = 0;
do {
  tentativas++;
} while (tentativas < 0); // condição já nasce falsa
console.log(tentativas); // 1, não 0!
```
A diferença é sutil mas importante: o corpo do `do-while` roda **pelo menos uma vez**,
mesmo que a condição já comece falsa — porque ela só é testada *depois* do bloco rodar.
Um `while` normal, com a mesma condição, nunca rodaria nenhuma vez.

## O padrão do "acumulador"

O uso mais comum de loop é ir somando (ou multiplicando, ou concatenando) um resultado a
cada volta — chamado de **acumulador**: uma variável criada *fora* do loop, que cada
volta atualiza.

```js
const pedidosDoDia = [120, 45, 300, 80];
let totalDoDia = 0;              // acumulador, comeca em 0, fora do loop
for (let i = 0; i < pedidosDoDia.length; i++) {
  totalDoDia += pedidosDoDia[i]; // atualiza a cada volta
}
// totalDoDia = 545
```
Esse padrão ("declarar o acumulador fora do loop, atualizar ele a cada volta") aparece o
tempo todo — em `11-gerador-tabela-precos` (somando uma lista) e em
`12-monitor-eventos-sistema` (multiplicando, para o fatorial), só que aplicado a
problemas diferentes.

**Cuidado com loop infinito:** se a condição nunca vira `false` (por exemplo, esqueceu
de atualizar a variável que ela testa, ou atualizou ela errado), o programa fica rodando
para sempre — em Node, `Ctrl+C` interrompe.

## Loops aninhados (um loop dentro do outro)

Quando cada volta de um loop precisa, ela mesma, repetir algo, um loop entra dentro do
outro:

```js
for (let linha = 1; linha <= 3; linha++) {
  let texto = '';
  for (let coluna = 1; coluna <= linha; coluna++) {
    texto += '*';
  }
  console.log(texto);
}
// *
// **
// ***
```
O loop de fora roda 3 vezes (uma por linha); a cada uma dessas vezes, o loop de dentro
roda inteiro, do começo ao fim. É assim que se monta, por exemplo, uma barra de gráfico
de texto pra cada valor de uma lista.

## Percorrendo strings

Uma string se comporta como uma lista de caracteres pra fins de loop — `texto[i]` acessa
o caractere na posição `i`, e `texto.length` diz quantos caracteres ela tem:

```js
const texto = 'ABC';
for (let i = 0; i < texto.length; i++) {
  console.log(texto[i]); // A, depois B, depois C
}
```

## Tente você

No REPL (`node`), escreva um `for` que imprime os números pares de 0 a 20, depois
reescreva o mesmo resultado com `while`. Depois, tente montar a "pirâmide de `*`" do
exemplo de loops aninhados acima, mas com 5 linhas em vez de 3.

## Erros comuns

- Esquecer o `i++` (ou equivalente) dentro de um `while` → loop infinito.
- Usar `<=` quando queria `<` (ou o contrário) e rodar uma vez a mais ou a menos do que
  devia — o erro clássico chamado "off-by-one" (ex.: `for (i=1; i<=10; i++)` roda 10
  vezes, `for (i=1; i<10; i++)` roda só 9).
- Criar o acumulador **dentro** do loop em vez de fora — isso zera ele a cada volta, e no
  final ele só guarda o resultado da última volta, não a soma de todas.
- No `do-while`, esquecer que o bloco roda pelo menos uma vez mesmo com a condição já
  falsa — se seu caso não pode rodar nenhuma vez (ex.: lista vazia), trate isso antes.

## Onde aparece nos seus projetos

Este tópico tem 5 projetos (em vez dos 3 de costume) — a virada de "sem loop" pra "com
loop" é grande, então ela é dividida em passos menores:

1. `10-gerador-crachas-evento` — o `for` mais simples que existe: repetir um número já
   conhecido de vezes, sem acumulador nenhum.
2. `11-gerador-tabela-precos` — `for` com acumulador (somar, multiplicar).
3. `12-monitor-eventos-sistema` — `while` e `do-while`, quando o número de voltas não é
   conhecido de antemão.
4. `13-troco-caixa-automatico` — `while` dentro de `for`, aplicando o padrão "pega a
   maior unidade que cabe, repete" (o problema do troco que ficou pendente lá no
   `03-recibo-de-venda`, do primeiro tópico).
5. `14-gerador-relatorio-visual` — loops aninhados e loops percorrendo strings.
