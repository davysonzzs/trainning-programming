# Tópico 4 — Estruturas de repetição (for, while, do-while)

*Fase 1 — Fundamentos de Programação · [voltar para a trilha](../../AULAS.md)*

---

## O que é

Um loop repete um bloco de código enquanto uma condição for verdadeira, sem você
copiar e colar a mesma linha várias vezes.

`for` é o mais comum quando você já sabe (ou consegue calcular) quantas vezes quer
repetir:

```js
for (let i = 0; i < 5; i++) {
  console.log('Passo', i);
}
// i comeca em 0, roda enquanto i < 5, soma 1 (i++) a cada volta
```

## Exemplo

`while` repete enquanto a condição continuar `true` — bom quando você não sabe de
antemão quantas voltas vai precisar:

```js
let saldo = 100;
while (saldo > 0) {
  saldo -= 30;
}
```

`do-while` é igual ao `while`, mas testa a condição **depois** de rodar o bloco —
então o corpo roda pelo menos uma vez, mesmo que a condição já comece falsa.

**Cuidado com loop infinito:** se a condição nunca vira `false` (por exemplo, esqueceu
de atualizar a variável que ela testa), o programa fica rodando para sempre — em Node,
`Ctrl+C` interrompe.

## Na prática da DevTech

Somar o total de uma lista de pedidos do dia (exemplo genérico — os projetos usam
outros dados):

```js
const pedidosDoDia = [120, 45, 300, 80];
let totalDoDia = 0;
for (let i = 0; i < pedidosDoDia.length; i++) {
  totalDoDia += pedidosDoDia[i];
}
// totalDoDia = 545
```

O padrão "declarar um acumulador fora do loop, atualizar ele a cada volta" aparece o
tempo todo — é o mesmo raciocínio usado em `10-gerador-tabela-precos` (para montar uma
tabela) e em `11-monitor-eventos-sistema` (para contar até um limite), só que aplicado
a problemas diferentes.

## Tente você

No REPL (`node`), escreva um `for` que imprime os números pares de 0 a 20, depois
reescreva o mesmo resultado com `while`.

## Erros comuns

- Esquecer o `i++` (ou equivalente) dentro de um `while` → loop infinito.
- Usar `<=` quando queria `<` (ou o contrário) e rodar uma vez a mais ou a menos do que
  devia — o erro clássico chamado "off-by-one".

## Onde aparece nos seus projetos

`10-gerador-tabela-precos`, `11-monitor-eventos-sistema`, `12-gerador-relatorio-visual`.
