# DEVTECH SISTEMAS S.A.
## Feature: Relatório de estatísticas rápidas do time de vendas

> Time de vendas quer ver, de forma rápida, quais vendas foram acima de uma meta, o valor
> total vendido e a lista de vendedores únicos, sem escrever um loop pra cada consulta.

---

### Contexto

Você já sabe percorrer arrays com `for`. Agora é hora de conhecer os métodos que o
JavaScript já oferece prontos pra isso: `.map()`, `.filter()`, `.reduce()` e `.find()` —
eles fazem o mesmo que um `for`, só que com uma sintaxe mais direta e muito usada no
dia a dia de qualquer time.

**Nível:** Estagiário  
**Sprint:** Estagiário — Estatísticas de Vendas  
**Estimativa:** 1h  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Arrays: criação, iteração e métodos essenciais (2/3)

---

### O que fazer

- [ ] Criar o arquivo `estatisticas.js` na raiz deste projeto
- [ ] Implementar `valoresDasVendas(vendas)` — usando `.map()`
- [ ] Implementar `vendasAcimaDe(vendas, meta)` — usando `.filter()`
- [ ] Implementar `totalVendido(vendas)` — usando `.reduce()`
- [ ] Implementar `buscarVendaPorId(vendas, id)` — usando `.find()`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`estatisticas.js`

---

### Especificação das funções

**Estrutura de uma venda:** `{ id, vendedor, valor }`

**`valoresDasVendas(vendas)`**
- Retorna um array só com os `valor` de cada venda, na mesma ordem
- **Precisa usar `.map()`**

**`vendasAcimaDe(vendas, meta)`**
- Retorna um array só com as vendas cujo `valor` é maior que `meta`
- **Precisa usar `.filter()`**

**`totalVendido(vendas)`**
- Retorna a soma de todos os `valor`
- **Precisa usar `.reduce()`**

**`buscarVendaPorId(vendas, id)`**
- Retorna a venda (objeto completo) com aquele `id`, ou `undefined` se não achar
- **Precisa usar `.find()`**

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`.map(venda => venda.valor)`** — `.map()` transforma cada item do array em outra
coisa, gerando um array novo do mesmo tamanho.

**`.filter(venda => venda.valor > meta)`** — `.filter()` devolve só os itens que passam
no teste (a função que você passa deve retornar `true`/`false` pra cada item).

**`.reduce((acumulador, venda) => acumulador + venda.valor, 0)`** — `.reduce()` "reduz"
o array inteiro a um único valor, acumulando a cada passo. O `0` no final é o valor
inicial do acumulador.

**`.find(venda => venda.id === id)`** — `.find()` devolve o **primeiro** item que passa
no teste, ou `undefined` se nenhum passar.

---

### Tarefas sugeridas para o Sprint

```
add Criar estatisticas.js
add Implementar valoresDasVendas com map
add Implementar vendasAcimaDe com filter
add Implementar totalVendido com reduce
add Implementar buscarVendaPorId com find
add Passar em todos os testes
```
