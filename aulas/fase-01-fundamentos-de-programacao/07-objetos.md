# Tópico 7 — Objetos: propriedades, métodos e referências

*Fase 1 — Fundamentos de Programação · [voltar para a trilha](../../AULAS.md)*

---

## O que é

Um objeto guarda dados relacionados como pares **chave: valor**.

```js
const produto = {
  nome: 'Teclado',
  preco: 150,
  emEstoque: true,
};
produto.nome;      // 'Teclado'
produto['preco'];  // 150 — mesma coisa, com colchetes
```

Objetos podem ter funções como valor — chamadas de **métodos** do objeto. `this`,
dentro de um método, se refere ao próprio objeto:

```js
const carrinho = {
  itens: [],
  adicionar(item) { this.itens.push(item); },
};
carrinho.adicionar('Mouse');
```

## Exemplo

**Objetos e arrays são passados por referência.** Copiar a variável não copia o
conteúdo — as duas variáveis passam a apontar para o mesmo objeto na memória:

```js
const a = { valor: 1 };
const b = a;
b.valor = 2;
console.log(a.valor); // 2 — mudou em "a" também!
```

Para criar uma cópia de verdade (rasa) e não correr esse risco, use o *spread*:
`const copia = { ...original };`.

## Na prática da DevTech

Uma reserva de sala que precisa ser "atualizada" sem alterar o registro original —
exemplo genérico, não é o seu exercício de catálogo/avaliação/cadastro:

```js
const reserva = { sala: 'A1', horario: '14h', pessoas: 4 };

// Errado: muda o objeto original — quem mais tiver essa referência é afetado
function mudarHorarioMutando(r, novoHorario) {
  r.horario = novoHorario;
  return r;
}

// Certo: devolve um objeto novo, o original fica intacto
function mudarHorario(r, novoHorario) {
  return { ...r, horario: novoHorario };
}

const novaReserva = mudarHorario(reserva, '16h');
reserva.horario;     // '14h' — não mudou
novaReserva.horario; // '16h'
```

Esse é exatamente o cuidado que `21-cadastro-clientes-imutavel` cobra: funções que
"atualizam" sempre devolvendo um objeto novo, nunca mexendo no que já existia.

## Tente você

Crie um objeto `pessoa` com `nome` e `idade`, e escreva uma função que recebe um objeto
e devolve um **novo** objeto com a idade `+1`, sem alterar o original
(`{ ...pessoa, idade: pessoa.idade + 1 }`).

## Erros comuns

- Mudar um objeto recebido como parâmetro achando que isso não afeta quem chamou —
  afeta, porque é a mesma referência.
- Comparar dois objetos com `===` esperando `true` quando o conteúdo é igual — `===` em
  objetos compara *referência*, não conteúdo (`{a:1} === {a:1}` é `false`).

## Onde aparece nos seus projetos

`19-catalogo-produtos-loja`, `20-avaliacao-funcionarios`, `21-cadastro-clientes-imutavel`.
