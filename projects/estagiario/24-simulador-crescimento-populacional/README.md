# DEVTECH SISTEMAS S.A.
## Feature: Simulador de crescimento de assinantes do produto

> Time de produto quer projetar quantos assinantes novos surgem por mês, seguindo um
> padrão onde cada mês depende da soma dos dois meses anteriores — a sequência de Fibonacci.

---

### Contexto

O time de growth notou que a curva de novos assinantes se parece com a sequência de
Fibonacci (cada valor é a soma dos dois anteriores) em fases iniciais de crescimento
orgânico. Pediram uma função recursiva pra simular isso — é o exemplo mais clássico de
recursão que existe, e também mostra por que recursão **sem cuidado** pode ficar lenta.

**Nível:** Estagiário  
**Sprint:** Estagiário — Simulador de Crescimento  
**Estimativa:** 1h  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Recursão e casos base (3/3)

---

### O que fazer

- [ ] Criar o arquivo `fibonacci.js` na raiz deste projeto
- [ ] Implementar `fibonacciRecursivo(posicao)`
- [ ] Implementar `sequenciaFibonacci(quantidade)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`fibonacci.js`

---

### Especificação das funções

**`fibonacciRecursivo(posicao)`**
- Retorna o valor de Fibonacci na `posicao` indicada (começando em `0`)
- Sequência: posição `0` → `0`, posição `1` → `1`, posição `2` → `1`, posição `3` → `2`,
  posição `4` → `3`, posição `5` → `5`, posição `6` → `8`...
- Cada valor (a partir da posição `2`) é a soma dos dois anteriores
- **Use recursão** — dois casos base: posição `0` e posição `1`

**`sequenciaFibonacci(quantidade)`**
- Retorna um array com os primeiros `quantidade` valores da sequência (posições `0` até
  `quantidade - 1`), usando `fibonacciRecursivo`
- Ex: `sequenciaFibonacci(6)` → `[0, 1, 1, 2, 3, 5]`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`fibonacciRecursivo`** — Dessa vez tem **dois** casos base, não um só: `posicao === 0`
retorna `0`, e `posicao === 1` retorna `1`. Pra qualquer outra posição, a função é
`fibonacciRecursivo(posicao - 1) + fibonacciRecursivo(posicao - 2)` — repare que ela
chama a si mesma **duas vezes**.

**`sequenciaFibonacci`** — Um loop de `0` até `quantidade - 1`, chamando
`fibonacciRecursivo` pra cada posição e guardando o resultado num array.

**Curiosidade:** repare que `fibonacciRecursivo(30)` já demora perceptivelmente — é
porque a mesma posição é recalculada várias vezes. Existe uma técnica (memoization) pra
resolver isso, mas ela é assunto de um tópico mais avançado.

---

### Tarefas sugeridas para o Sprint

```
add Criar fibonacci.js
add Implementar fibonacciRecursivo
add Implementar sequenciaFibonacci
add Passar em todos os testes
```
