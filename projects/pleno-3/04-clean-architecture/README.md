# 04 — Clean Architecture

**Nível:** Pleno III
**Fase:** 10 — Arquitetura
**Estimativa:** 2h

---

## Contexto

O modulo de produtos da DevTech Sistemas esta um caos. Regras de negocio estao misturadas com queries SQL diretas. Validacoes estao nos controllers. Os use cases estao nos models. Ninguem consegue testar nada sem subir o banco de dados.

O Tech Lead Pedro quer refatorar usando Clean Architecture: separar claramente Entities (regras de negocio), Use Cases (orquestracao) e Adapters (conversao de dados). A regra de ouro: as camadas internas nao conhecem as externas.

---

## O que fazer

Implemente o arquivo `arquitetura.js` com uma feature completa de gerenciamento de produtos seguindo os principios da Clean Architecture.

---

## Arquivo a criar

**`arquitetura.js`** na raiz deste projeto.

---

## Especificacao

### Entities (classes puras, sem dependencias externas)

#### `class Produto`

```js
constructor({ id, nome, preco, estoque, categoria })
```

**`validar()`** — Lanca `Error` se:
- nome vazio ou undefined
- preco menor ou igual a 0
- estoque negativo

**`aplicarDesconto(percentual)`** — Retorna novo preco com desconto aplicado (nao muta o objeto). Lanca erro se percentual <= 0 ou >= 100.

**`estaDisponivel()`** — Retorna `true` se estoque > 0.

### Use Cases (recebem repositorio por injecao de dependencia)

O repositorio tem a interface:
```js
{
  salvar(produto) -> Promise<produto>,
  buscarPorId(id)  -> Promise<produto | null>,
  listar(filtros)  -> Promise<[produto]>,
  atualizar(id, dados) -> Promise<produto>
}
```

#### `class CriarProduto`
```js
constructor(repo)
async executar({ nome, preco, estoque, categoria })
```
Cria instancia de `Produto`, chama `validar()`, salva no repo. Retorna produto salvo.

#### `class BuscarProdutos`
```js
constructor(repo)
async executar(filtros = {})
```
Busca produtos no repo aplicando filtros. Filtros possiveis: `{ categoria, disponiveis }`.

#### `class AtualizarEstoque`
```js
constructor(repo)
async executar(id, quantidade)
```
Busca produto, atualiza estoque, salva. Lanca erro se produto nao encontrado. Lanca erro se estoque resultante for negativo.

### Adapters

#### `apresentadorProduto(produto)`
Converte produto para formato de apresentacao:
```js
{
  id, nome, preco, preco_formatado: 'R$ 19,90',
  estoque, disponivel: true/false, categoria
}
```

#### `parsearEntradaProduto(dadosBrutos)`
Normaliza entrada antes de criar a entity:
- Converte `preco` para Number (pode vir como string)
- Converte `estoque` para Number
- Faz `.trim()` no `nome` e `categoria`
- Remove campos desconhecidos

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

Antes de codar, pense:

1. **Por que a `class Produto` nao pode importar nada?** O que aconteceria com a testabilidade se Produto importasse uma conexao com banco?

2. **O que e injecao de dependencia?** Como `CriarProduto` recebe o repositorio? Por que isso e melhor que importar o repositorio direto?

3. **Como voce cria um repositorio fake nos testes?** Voce precisa de um banco real para testar o use case? Pense em um objeto simples com um array.

4. **`aplicarDesconto` nao muta o objeto** — por que imutabilidade e importante em entities? Como retornar novo preco sem `this.preco = novoPreco`?

5. **`parsearEntradaProduto` e a barreira de seguranca** — o que aconteceria se nao normalizassemos a entrada e o usuario mandasse `preco: "abc"` ou campos extras?

---

## Tarefas para o Sprint

- [ ] Implementar `class Produto` com `validar`, `aplicarDesconto` e `estaDisponivel`
- [ ] Criar repositorio in-memory nos testes (para injecao de dependencia)
- [ ] Implementar `class CriarProduto` com validacao e persistencia
- [ ] Implementar `class BuscarProdutos` com filtros
- [ ] Implementar `class AtualizarEstoque` com validacao de negativo
- [ ] Implementar `apresentadorProduto` com preco formatado
- [ ] Implementar `parsearEntradaProduto` com normalizacao
- [ ] Garantir que todos os testes passam com `npm test`
