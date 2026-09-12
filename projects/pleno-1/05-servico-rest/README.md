# 05 — Serviço REST (Service Layer)

**Nível:** Pleno I
**Sprint:** Pleno I — Node.js + API REST Patterns
**Estimativa:** 2h

---

## Contexto

O serviço de estoque da DevTech tinha toda a lógica de negócio misturada com o código HTTP. O Tech Lead pediu a criação de uma camada de serviço isolada — independente do transporte HTTP — para facilitar testes e reutilização.

## O que fazer

Implemente a classe `ServicoEstoque` em `servico.js`. Ela recebe um repositório injetado (não faz acesso a banco diretamente) e centraliza toda a lógica de negócio de estoque.

## Arquivo a criar

`servico.js` na raiz deste projeto.

## Especificação

### `class ServicoEstoque`

**`constructor(repositorio)`**
- Armazena o repositório injetado

**`async listarProdutos(filtros = {})`**
- Filtros aceitos: `{ categoria, precoMin, precoMax, emEstoque }`
- Chama `repo.findAll()` e filtra o resultado em memória
- `emEstoque: true` → só produtos com `estoque > 0`
- `precoMin` / `precoMax` → filtro por `produto.preco`
- `categoria` → filtro por `produto.categoria`

**`async buscarProduto(id)`**
- Chama `repo.findById(id)`
- Lança `Error('Produto não encontrado')` se null

**`async criarProduto(dados)`**
- Valida: `dados.nome` é obrigatório → lança `Error('Nome é obrigatório')`
- Valida: `dados.preco > 0` → lança `Error('Preço deve ser positivo')`
- Valida: `dados.estoque >= 0` → lança `Error('Estoque não pode ser negativo')`
- Se válido: chama `repo.create(dados)` e retorna o produto criado

**`async atualizarEstoque(id, quantidade)`**
- Verifica se produto existe (lança erro se não)
- Verifica se `quantidade >= 0` → lança `Error('Quantidade não pode ser negativa')`
- Chama `repo.update(id, { estoque: quantidade })` e retorna produto atualizado

**`async processarVenda(pedido)`**
- `pedido = { itens: [{ produtoId, quantidade }] }`
- Para cada item, verifica se produto existe e tem estoque suficiente
- Se algum item faltar estoque: retorna `{ sucesso: false, itensFaltando: [...], total: 0 }`
- Se tudo ok: desconta estoque de cada produto, calcula total e retorna `{ sucesso: true, itensFaltando: [], total }`

## Como testar

```bash
npm install
npm test
```

## Dicas

- Use `jest.fn()` para simular o repositório — foque em testar a lógica de negócio.
- `processarVenda` deve ser atômico: só debita se TODOS os itens tiverem estoque.
- `total` é a soma de `produto.preco * quantidade` para cada item.

## Tarefas

- [ ] Implementar `constructor(repositorio)`
- [ ] Implementar `listarProdutos(filtros)` com filtragem
- [ ] Implementar `buscarProduto(id)` com erro se não encontrado
- [ ] Implementar `criarProduto(dados)` com validações
- [ ] Implementar `atualizarEstoque(id, quantidade)` com validação
- [ ] Implementar `processarVenda(pedido)` com verificação de estoque
- [ ] Exportar `ServicoEstoque`
- [ ] Passar nos testes com `npm test`
