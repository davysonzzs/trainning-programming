# DEVTECH SISTEMAS S.A.
## Feature: Catálogo de produtos da loja parceira

> Loja parceira precisa de funções que criem e leiam informações de produtos — hoje isso
> tá espalhado em variáveis soltas, sem organização.

---

### Contexto

Até agora cada informação de um produto (nome, preço, estoque) seria uma variável
separada. Isso não escala — muito mais organizado é juntar tudo num único **objeto**, com
propriedades nomeadas. Você vai criar as primeiras funções que trabalham com objetos:
criar, ler propriedades e adicionar um método a ele.

**Nível:** Estagiário  
**Sprint:** Estagiário — Catálogo de Produtos  
**Estimativa:** 2h  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Objetos: propriedades, métodos e referências (1/3)

---

### O que fazer

- [ ] Criar o arquivo `produto.js` na raiz deste projeto
- [ ] Implementar `criarProduto(nome, preco, estoque)`
- [ ] Implementar `descricao(produto)`
- [ ] Implementar `temEstoque(produto)`
- [ ] Implementar `aplicarDesconto(produto, percentual)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`produto.js`

---

### Especificação das funções

**`criarProduto(nome, preco, estoque)`**
- Retorna um objeto: `{ nome, preco, estoque }`

**`descricao(produto)`**
- Recebe um produto (objeto) e retorna uma string:
  `'<nome> - R$ <preco> (<estoque> em estoque)'`
- Ex: `descricao({ nome: 'Mouse', preco: 50, estoque: 10 })` → `'Mouse - R$ 50 (10 em estoque)'`

**`temEstoque(produto)`**
- Retorna `true` se `produto.estoque` for maior que `0`, senão `false`

**`aplicarDesconto(produto, percentual)`**
- Retorna um **novo** objeto igual ao produto, mas com o `preco` reduzido pelo percentual
  (arredondado para 2 casas decimais) — **não altere o objeto original**
- Ex: `aplicarDesconto({ nome: 'Mouse', preco: 100, estoque: 5 }, 10)` →
  `{ nome: 'Mouse', preco: 90, estoque: 5 }`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 7 — Objetos: propriedades, métodos e referências**
> em [`07-objetos.md`](../../../aulas/fase-01-fundamentos-de-programacao/07-objetos.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`criarProduto`** — Um objeto literal: `{ nome: nome, preco: preco, estoque: estoque }`
— ou, como os nomes da propriedade e da variável são iguais, você pode simplesmente
escrever `{ nome, preco, estoque }` (JavaScript entende os dois jeitos).

**`descricao`** — Acesse as propriedades do objeto com `produto.nome`, `produto.preco`
etc, e concatene numa string.

**`temEstoque`** — Uma comparação direta com a propriedade `estoque`.

**`aplicarDesconto`** — Pra não alterar o original, crie um objeto novo copiando as
propriedades (`{ ...produto, preco: novoPreco }` — o spread `...` copia tudo do objeto
antigo, e o que vier depois sobrescreve). Se ainda não conhece spread de objeto, pode
montar manualmente: `{ nome: produto.nome, preco: novoPreco, estoque: produto.estoque }`.

---

### Tarefas sugeridas para o Sprint

```
add Criar produto.js
add Implementar criarProduto
add Implementar descricao
add Implementar temEstoque
add Implementar aplicarDesconto
add Passar em todos os testes
```
