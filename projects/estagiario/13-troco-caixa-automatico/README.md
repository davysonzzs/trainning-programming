# DEVTECH SISTEMAS S.A.
## Feature: Calculadora de troco do caixa automático da lanchonete

> Caixa automático da lanchonete da empresa precisa calcular o troco em moedas/notas.

---

### Contexto

Lembra do projeto `03-recibo-de-venda`, lá no seu primeiro dia? Você calculou subtotal,
desconto e total — tudo em passos fixos, sem loop, porque ainda não tinha visto repetição.
Agora a lanchonete do prédio pediu a continuação: um caixa automático que, além do troco,
diz **quantas notas/moedas de cada valor entregar**, usando a menor quantidade possível.
Dessa vez o loop é o jeito certo de resolver — o número de cédulas varia a cada venda, e
não dá pra "escrever na mão" um passo pra cada uma.

Isso é um algoritmo clássico — antes de programar, pensa em como você faria isso na mão:
sempre usar primeiro a maior nota/moeda que couber no valor restante, e repetir até não
sobrar nada.

**Nível:** Estagiário  
**Sprint:** Estagiário — Troco do Caixa  
**Estimativa:** 1h 30m  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Estruturas de repetição (for, while, do-while) (4/5)

---

### O que fazer

- [ ] Criar o arquivo `troco.js` na raiz deste projeto
- [ ] Implementar `calcularTroco(valorPago, valorCompra)`
- [ ] Implementar `decompor(valor)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`troco.js`

---

### Especificação das funções

**Cédulas/moedas disponíveis (em reais):** `100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.10, 0.05`

**`calcularTroco(valorPago, valorCompra)`**
- Retorna o valor do troco (`valorPago - valorCompra`), arredondado para 2 casas decimais
- Se `valorPago` for menor que `valorCompra`, retorna `0` (não existe troco negativo)

**`decompor(valor)`**
- Recebe um valor em reais (ex: `37.5`)
- Retorna um array com a menor quantidade de cédulas/moedas que somam esse valor, da
  maior pra menor
- Ex: `decompor(37.5)` → `[20, 10, 5, 2, 0.5]`
- Ex: `decompor(3)` → `[2, 1]`
- Valor `0` retorna array vazio `[]`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 4 — Estruturas de repetição (for, while, do-while)**
> em [`04-estruturas-de-repeticao.md`](../../../aulas/fase-01-fundamentos-de-programacao/04-estruturas-de-repeticao.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`calcularTroco`** — Subtração simples, só cuidado com o caso do pagamento ser menor
que a compra, e com arredondamento de casas decimais (`Math.round`).

**`decompor`** — Pense em pseudocódigo primeiro: "enquanto sobrar valor, pega a maior
cédula que ainda cabe nele, tira do valor restante, guarda na lista, repete". Isso é um
`while` percorrendo a lista de cédulas da maior pra menor — o mesmo `while` que você já
praticou em `12-monitor-eventos-sistema`, só que agora combinado com um `for` por fora
pra percorrer as cédulas. Cuidado com problemas de arredondamento de ponto flutuante —
uma dica é trabalhar em centavos (multiplicar tudo por 100) e converter de volta no final.

Exemplo do mesmo *padrão* ("pega a maior unidade que cabe, repete") num problema
diferente — quantas caixas de cada tamanho pra embalar um peso, usando a maior
caixa possível primeiro:

```js
function embalarPeso(pesoKg, tamanhosDisponiveis) {
  // tamanhosDisponiveis já vem ordenado do maior pro menor, ex: [10, 5, 1]
  let restante = pesoKg;
  const caixas = [];
  for (const tamanho of tamanhosDisponiveis) {
    while (restante >= tamanho) {
      caixas.push(tamanho);
      restante -= tamanho;
    }
  }
  return caixas; // ex: embalarPeso(23, [10, 5, 1]) → [10, 10, 1, 1, 1]
}
```

---

### Tarefas sugeridas para o Sprint

```
add Criar troco.js
add Implementar calcularTroco
add Implementar decompor
add Passar em todos os testes
```
