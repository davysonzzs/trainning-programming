# Tópico 10 — Algoritmos de busca (linear e binária)

*Fase 1 — Fundamentos de Programação · [voltar para a trilha](../../AULAS.md)*

---

## O que é

**Busca linear** — percorre o array do início ao fim comparando cada item, até achar
(ou terminar sem achar). Funciona em qualquer array, ordenado ou não, mas no pior caso
olha todos os elementos.

```js
function buscaLinear(arr, alvo) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === alvo) return i;
  }
  return -1;
}
```

## Exemplo

**Busca binária** — só funciona em array **já ordenado**, mas é muito mais rápida: em
vez de olhar item por item, ela olha o do **meio** e descarta metade do array a cada
passo.

```js
function buscaBinaria(arr, alvo) {
  let inicio = 0, fim = arr.length - 1;
  while (inicio <= fim) {
    const meio = Math.floor((inicio + fim) / 2);
    if (arr[meio] === alvo) return meio;
    if (arr[meio] < alvo) inicio = meio + 1;
    else fim = meio - 1;
  }
  return -1;
}
```

A cada volta do `while`, o espaço de busca (`fim - inicio`) cai pela metade — por isso
um array de 1 milhão de itens leva no máximo ~20 comparações, contra até 1 milhão na
busca linear.

## Na prática da DevTech

Buscar um protocolo de atendimento numa lista já ordenada por número (exemplo genérico —
os projetos buscam produto no estoque e no catálogo, não protocolo):

```js
const protocolos = [1001, 1004, 1010, 1023, 1050, 1099]; // já ordenados

function existeProtocolo(alvo) {
  let inicio = 0, fim = protocolos.length - 1;
  while (inicio <= fim) {
    const meio = Math.floor((inicio + fim) / 2);
    if (protocolos[meio] === alvo) return true;
    if (protocolos[meio] < alvo) inicio = meio + 1;
    else fim = meio - 1;
  }
  return false;
}
existeProtocolo(1023); // true
existeProtocolo(1500); // false
```

Repare que a única diferença pro `buscaBinaria` genérico acima é **o que** está sendo
comparado — o algoritmo em si não muda. É essa mesma ideia, aplicada a produtos, que
`30-busca-linear-estoque` e `31-motor-busca-rapida-catalogo` pedem.

## Tente você

Simule `buscaBinaria([2, 5, 8, 12, 16, 23, 38, 45], 23)` no papel: anote `inicio`,
`fim` e `meio` a cada volta até achar o índice.

## Erros comuns

- Rodar busca binária num array que não está ordenado — o algoritmo "funciona" sem dar
  erro, mas pode devolver resultado errado.
- Trocar `inicio = meio + 1` por `inicio = meio` (ou o equivalente em `fim`) — sem o
  `+1`/`-1`, o loop pode nunca terminar.

## Onde aparece nos seus projetos

`30-busca-linear-estoque`, `31-motor-busca-rapida-catalogo` — e o `32-integrador-fase1`
fecha a fase misturando tudo que veio antes dele. O bônus
`33-refatoracao-modulo-descontos` pratica ler e consertar código que já existe, em vez
de criar do zero — a outra metade do trabalho real de um dev.
