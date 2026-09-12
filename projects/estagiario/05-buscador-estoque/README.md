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

### Tarefas sugeridas para o Sprint

```
add Criar buscador.js
add Implementar buscaLinear (loop manual)
add Implementar buscaPorFaixaDePreco
add Implementar ordenarPorPreco e ordenarPorNome
add Implementar filtrarComEstoque
add Passar em todos os testes
```
