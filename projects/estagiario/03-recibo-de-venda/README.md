# DEVTECH SISTEMAS S.A.
## Feature: Recibo de venda do caixa da loja

> Caixa da loja física precisa emitir um recibo simples pro cliente: subtotal, desconto
> e total, sempre nessa ordem.

---

### Contexto

O caixa da loja parceira ainda calcula o recibo de cabeça, e às vezes erra a conta na
correria. Pediram um sistema que faz os três cálculos sempre na mesma ordem certa:
primeiro o subtotal (preço vezes quantidade), depois o desconto (se a campanha do dia
tiver um percentual), e só então o total. Nenhuma decisão a tomar, nenhum passo se
repete — é sequência pura: cada cálculo usa o resultado do anterior, na ordem certa,
igual você já praticou nos dois projetos anteriores.

**Nível:** Estagiário  
**Sprint:** Estagiário — Recibo do Caixa  
**Estimativa:** 1h  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Lógica de programação: algoritmos e pseudocódigo (3/3)

---

### O que fazer

- [ ] Criar o arquivo `recibo.js` na raiz deste projeto
- [ ] Implementar `calcularSubtotal(precoUnitario, quantidade)`
- [ ] Implementar `calcularDesconto(subtotal, percentualDesconto)`
- [ ] Implementar `calcularTotal(subtotal, desconto)`
- [ ] Implementar `gerarRecibo(precoUnitario, quantidade, percentualDesconto)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`recibo.js`

---

### Especificação das funções

**`calcularSubtotal(precoUnitario, quantidade)`**
- Retorna `precoUnitario * quantidade`
- Ex: `calcularSubtotal(12, 3)` → `36`

**`calcularDesconto(subtotal, percentualDesconto)`**
- Retorna `subtotal * percentualDesconto / 100`, arredondado para 2 casas decimais
- Ex: `calcularDesconto(36, 25)` → `9`
- `percentualDesconto` igual a `0` retorna `0`

**`calcularTotal(subtotal, desconto)`**
- Retorna `subtotal - desconto`
- Ex: `calcularTotal(36, 9)` → `27`

**`gerarRecibo(precoUnitario, quantidade, percentualDesconto)`**
- Chama as três funções acima, **nessa ordem**, e devolve uma string:
  `'Subtotal: R$ ' + subtotal + ' | Desconto: R$ ' + desconto + ' | Total: R$ ' + total`
- Ex: `gerarRecibo(12, 3, 25)` → `'Subtotal: R$ 36 | Desconto: R$ 9 | Total: R$ 27'`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 1 — Lógica de programação: algoritmos e pseudocódigo**
> em [`01-logica-algoritmos-pseudocodigo.md`](../../../aulas/fase-01-fundamentos-de-programacao/01-logica-algoritmos-pseudocodigo.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`calcularSubtotal`** — Multiplicação direta, igual você já fez na calculadora interna.

**`calcularDesconto`** — Uma regra de três: `percentualDesconto` por cento de `subtotal`.
O arredondamento pra 2 casas usa o mesmo truque de sempre: multiplica por `100`,
arredonda com `Math.round`, divide por `100` de novo. Exemplo genérico (calculando juros
de um empréstimo, não é o seu caso, é só pra ver a conta):

```js
function calcularJuros(valor, percentual) {
  const jurosBruto = valor * percentual / 100;
  return Math.round(jurosBruto * 100) / 100; // arredonda pra 2 casas
}
calcularJuros(200, 12.5); // 25
```

**`calcularTotal`** — Subtração simples entre os dois valores que você já calculou.

**`gerarRecibo`** — Não recalcule nada: chame `calcularSubtotal`, depois
`calcularDesconto` (usando o subtotal que acabou de calcular), depois `calcularTotal`
(usando os dois valores anteriores), e monte a string no final. É exatamente esse
encadeamento — o resultado de um passo vira a entrada do próximo — que "sequência de
passos" quer dizer na prática.

---

### Tarefas sugeridas para o Sprint

```
add Criar recibo.js
add Implementar calcularSubtotal
add Implementar calcularDesconto
add Implementar calcularTotal
add Implementar gerarRecibo
add Passar em todos os testes
```
