# DEVTECH SISTEMAS S.A.
## Feature: Módulo de busca do sistema de estoque

> Busca atual é lenta e imprecisa — cliente reclamando de produto "não encontrado" existindo no estoque.

---

### Contexto

O sistema de estoque usa um loop manual para buscar produtos e está retornando resultados
incorretos quando há produtos com nomes similares. Além disso, a listagem não está ordenada,
dificultando o uso. Você vai criar o módulo de busca do zero com algoritmos corretos.

**Nível:** Estagiário  
**Sprint:** Estagiário — Buscador de Estoque  
**Estimativa:** 2h  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Algoritmos de busca (linear e binária) (1/3) — e reforça ordenação

---

### O que fazer

- [ ] Criar o arquivo `buscador.js` na raiz deste projeto
- [ ] Implementar `buscaLinear(produtos, nome)`
- [ ] Implementar `buscaPorFaixaDePreco(produtos, min, max)`
- [ ] Implementar `ordenarPorPreco(produtos)`
- [ ] Implementar `ordenarPorNome(produtos)`
- [ ] Implementar `filtrarComEstoque(produtos)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`buscador.js`

---

### Especificação das funções

**Estrutura de um produto:** `{ id, nome, preco, estoque }`

**`buscaLinear(produtos, nome)`**
- Percorre o array item a item (não use `.find()` ainda — pratique o loop)
- Busca por nome **exato** (case-insensitive)
- Retorna o produto encontrado ou `null`

**`buscaPorFaixaDePreco(produtos, min, max)`**
- Retorna array com produtos onde `min <= preco <= max`

**`ordenarPorPreco(produtos)`**
- Retorna **novo array** ordenado por `preco` crescente (não modifica o original)

**`ordenarPorNome(produtos)`**
- Retorna **novo array** ordenado por `nome` em ordem alfabética (A→Z)

**`filtrarComEstoque(produtos)`**
- Retorna apenas produtos com `estoque > 0`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`buscaLinear`** — Use `for` ou `while`. A cada iteração compare o nome do produto com o parâmetro (ambos em lowercase). Quando encontrar, retorne o produto. Se terminar sem encontrar, retorne `null`.

**`buscaPorFaixaDePreco`** — Duas condições precisam ser verdadeiras ao mesmo tempo: `preco >= min` E `preco <= max`. Que método de array retorna um subconjunto baseado numa condição?

**`ordenarPorPreco` / `ordenarPorNome`** — `.sort()` modifica o array original. Como você ordena sem modificar? Dica: faça uma cópia primeiro. Para strings, pesquise o que `localeCompare` faz.

**`filtrarComEstoque`** — Uma condição só: `estoque > 0`. Qual método de array é feito exatamente para isso?

---

### Tarefas sugeridas para o Sprint

```
add Criar buscador.js
add Implementar buscaLinear (loop manual)
add Implementar buscaPorFaixaDePreco
add Implementar ordenarPorPreco e ordenarPorNome
add Implementar filtrarComEstoque
add Passar em todos os testes
```
