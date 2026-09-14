# DEVTECH SISTEMAS S.A.
## Chamado de suporte: desconto do cliente Ouro veio errado

> Diferente dos outros projetos, aqui você **não parte do zero** — o código já existe.
> É a sua primeira tarefa de manutenção: mexer em algo que outra pessoa escreveu.

---

### Contexto

Chegou um chamado do time de atendimento: um cliente nível **Ouro** reclamou que o
desconto de uma compra de R$ 200 veio menor do que devia. O Tech Lead deu uma olhada
rápida no `legado.js` e confirmou: "esse arquivo tá cheio de código copiado e colado,
não me surpreende que tenha um bug escondido nele. Enquanto você tá aí, já aproveita
e deixa mais fácil de ler — a próxima pessoa que mexer vai agradecer."

Isso é **metade do trabalho de um dev de verdade**: você não vai só escrever código
novo pra sempre — boa parte do tempo é ler o que já existe, entender por que quebrou,
consertar sem quebrar mais nada, e deixar melhor do que encontrou.

**Nível:** Estagiário (extra — fora da sequência numerada, mas vale os mesmos XP)
**Sprint:** Estagiário — Manutenção e Refatoração
**Estimativa:** 2h 30m  
**Prioridade:** Alta (chamado de cliente)
**Tópico da trilha:** Fase 1 — pratica funções, condicionais e (o assunto principal
aqui) **manutenção de código existente**, que não é um tópico numerado da trilha mas
é parte do dia a dia

---

### O que fazer

- [ ] Abrir `legado.js` e rodar `npm test` pra ver qual caso está falhando
- [ ] Achar o bug: compare os três blocos (`bronze`, `prata`, `ouro`) com atenção —
      um deles foi copiado e colado do bloco errado e ninguém trocou o número certo
- [ ] Corrigir o valor errado
- [ ] Refatorar `calcularDesconto` pra eliminar a duplicação entre os três blocos —
      dica: os três seguem o mesmo padrão ("acima de X%, Y de desconto"), dá pra
      resolver com uma estrutura de dados (objeto/array) em vez de repetir o `if`
      três vezes
- [ ] Rodar `npm test` de novo — os testes são os mesmos de antes e devem continuar
      passando (o contrato da função não muda, só o código por dentro)
- [ ] Rodar `npx eslint projects/estagiario/31-refatoracao-modulo-descontos` (na raiz
      do repositório) e conferir se não sobrou nada

---

### Regras do arquivo

**Não pode mudar:**
- Os nomes das funções exportadas (`calcularDesconto`, `valorComDesconto`)
- O que cada função recebe e devolve (a assinatura) — quem usa esse módulo em outro
  lugar do sistema não pode quebrar
- O arquivo de teste (`test/desconto.test.js`) — ele já descreve o comportamento
  correto; é o seu alvo, não o que você edita

**Pode (e deve) mudar:**
- Tudo dentro de `legado.js`: nomes de variável, estrutura do código, eliminar
  duplicação, adicionar uma constante em vez de número mágico solto no meio do código

---

### Dicas (tente sozinho antes de usar)

> 📘 Esse projeto pratica funções e condicionais — se algum dos dois ainda não
> fez sentido, revise o
> [Tópico 5 — Funções](../../../aulas/fase-01-fundamentos-de-programacao/05-funcoes-parametros-retorno-escopo.md)
> ou o
> [Tópico 3 — Condicionais](../../../aulas/fase-01-fundamentos-de-programacao/03-estruturas-condicionais.md)
> (ou tecla `[5]` no simulador) antes de mexer no `legado.js`. O assunto
> principal aqui — manutenção de código existente — não tem tópico numerado,
> é prática mesmo.

**Achando o bug** — Não saia editando direto. Abra os três blocos (`bronze`,
`prata`, `ouro`) lado a lado e compare os números um a um contra a
Especificação abaixo. Um dos três tem um valor que foi copiado do bloco
errado — é assim que bug de copia-e-cola se disfarça: o código *parece*
certo até você comparar com a régua de fora (o teste, ou a especificação).

**Refatorando sem quebrar** — Troque um `if` de cada vez e rode `npm test`
depois de cada troca — se algo quebrar, você sabe exatamente qual mudança
causou. Nunca reescreva a função inteira de uma vez só e só depois rode o
teste; se der errado, você não vai saber qual parte foi.

**Eliminando a duplicação** — Quando vários `if` fazem a mesma pergunta
("é maior ou igual a X?") pra decidir entre poucas opções fixas, uma tabela
(array de objetos, por exemplo) percorrida com `.find()` costuma substituir
a cadeia toda por um único trecho reutilizável. Exemplo genérico (frete, não
desconto — a ideia é a mesma, adapte pro seu caso):

```js
const FAIXAS_FRETE = [
  { min: 200, valor: 0 },
  { min: 100, valor: 15 },
  { min: 0,   valor: 30 },
];

function calcularFrete(valorCompra) {
  const faixa = FAIXAS_FRETE.find(f => valorCompra >= f.min);
  return faixa.valor;
}
```
Repare: adicionar uma faixa nova vira uma linha no array, não mais um `if`
inteiro — é isso que "eliminar duplicação" quer dizer na prática.

---

### Especificação (o comportamento esperado — o que os testes cobram)

**`calcularDesconto(nivel, valor)`**
- `nivel` pode ser `'bronze'`, `'prata'` ou `'ouro'`
- Bronze: 5% de desconto se `valor >= 100`, senão 0%
- Prata: 10% se `valor >= 100`, 5% se `valor >= 50`, senão 0%
- Ouro: 15% se `valor >= 100`, 10% se `valor >= 50`, senão 5%
- Nível não reconhecido: 0% de desconto
- Retorna o valor do desconto em reais (não a porcentagem)

**`valorComDesconto(nivel, valor)`**
- Retorna `valor` menos o desconto calculado por `calcularDesconto`

---

### Por que isso importa

Esse bug existe justamente **por causa** da duplicação: quando alguém precisou ajustar
a regra do nível Ouro, só lembrou de mudar dois dos três `if`, porque o código copiado
não deixava óbvio que os três blocos precisavam do mesmo tratamento. Código duplicado
não é só "feio" — é onde bug se esconde. Isso é o motivo real pra refatorar, não só
estética.

---

### Tarefas sugeridas para o Sprint

```
add Rodar os testes e achar o caso que falha
add Corrigir o desconto errado do nivel Ouro
add Refatorar calcularDesconto pra eliminar a duplicacao
add Passar em todos os testes de novo
add Rodar o lint e conferir
```
