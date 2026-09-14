# Tópico 1 — Lógica de programação: algoritmos e pseudocódigo

*Fase 1 — Fundamentos de Programação · [voltar para a trilha](../../AULAS.md)*

---

## O que é

Programar é, antes de qualquer sintaxe, descrever um problema como uma sequência de
passos pequenos e sem ambiguidade — isso é um **algoritmo**. Antes de escrever
`function` ou `if`, qualquer problema vale a pena resolver no papel primeiro, em
português mesmo: isso se chama **pseudocódigo**.

Um computador não "entende sozinho" — ele só executa exatamente o que está escrito, na
ordem em que está escrito. Se um passo depende de algo que ainda não foi feito, ou se a
ordem dos passos está errada, o resultado sai errado mesmo que cada linha "pareça"
certa isoladamente. Por isso vale a pena treinar o hábito de escrever os passos antes
de programar — é mais fácil achar um erro de raciocínio no papel do que depurando
código.

## Exemplo

Pseudocódigo para "fazer um café":

```
1. Ferver a água
2. Colocar pó no filtro
3. Despejar a água fervendo sobre o pó
4. Esperar coar
5. Servir
```

Cada passo é uma ação só, na ordem certa, sem pular etapa. Um algoritmo vira código
quando você troca cada passo por uma instrução de verdade:

```js
function fazerCafe() {
  console.log('Fervendo a água');
  console.log('Colocando pó no filtro');
  console.log('Despejando a água');
  console.log('Servido!');
}
```

Quando o mesmo passo se repete para vários itens de uma lista (por exemplo, "para cada
ingrediente, monte um passo"), você usa um **laço de repetição** (loop) — o Tópico 4
aprofunda isso, mas o padrão básico já serve desde já:
`for (let i = 0; i < lista.length; i++) { ... }` roda o bloco uma vez para cada posição
da lista.

## Na prática da DevTech

Imagine que o Tech Lead pede uma função que descreve o passo a passo de **ativar um
plano novo** pra um cliente (não é o seu exercício — é só pra ver o raciocínio):

```
1. Validar os dados do cliente
2. Criar o registro do plano
3. Enviar e-mail de confirmação
4. Liberar o acesso
```

Antes de escrever a função, a primeira pergunta é sempre: **a ordem importa?** Aqui sim
— validar antes de criar evita registrar um plano com dado inválido, e liberar acesso
antes de confirmar o pagamento (se houvesse essa etapa) seria um bug de negócio, não só
de código. Pensar a sequência certa *antes* de programar é o que os projetos
`01-mensagens-onboarding`, `02-guia-preparo-pedido` e `03-troco-moedas` pedem pra você
praticar.

## Tente você

Escreva o pseudocódigo (no papel ou num comentário) de "trocar um pneu furado" ou
"atravessar a rua com segurança" — depois transforme em uma função com um
`console.log` por passo, igual o exemplo. Não precisa entregar nada, é só para treinar
o raciocínio antes de complicar.

## Erros comuns

- Pular um passo "óbvio" — o computador não preenche lacunas sozinho.
- Colocar dois passos numa ordem que só funciona *às vezes* (ex.: "servir o café" antes
  de "coar").

## Onde aparece nos seus projetos

`01-mensagens-onboarding`, `02-guia-preparo-pedido` e `03-troco-moedas` — sequência de
passos certos, sem estrutura de decisão ainda.
