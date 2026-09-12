# 02 — Testes de Integracao

**Nível:** Sênior I
**Fase:** 11 — Testes Avancados
**Estimativa:** 2h

---

## Contexto

O modulo de pedidos da DevTech tem 0% de cobertura de testes. O Tech Lead Pedro quer refatorar esse modulo, mas ninguem tem coragem de mexer sem testes. Principio conhecido como "Legacy Code" de Michael Feathers: para refatorar com seguranca, voce precisa de testes. Para ter testes, voce precisa entender o codigo. Para entender, voce precisa de... testes.

A saida: escrever os testes de integracao AGORA, antes do refactor. Testes de integracao testam multiplas camadas trabalhando juntas (ProcessadorPedidos + RepositorioPedidos), mas com dependencias externas (pagamento, email) substituidas por mocks controlados.

---

## O que fazer

Implemente o arquivo `integracao.js` com as classes do sistema de pedidos, e escreva testes de integracao usando mocks Jest para as dependencias externas.

---

## Arquivo a criar

**`integracao.js`** na raiz deste projeto.

---

## Especificacao

### `class RepositorioPedidos`
Armazenamento in-memory de pedidos.

```js
async salvar(pedido)          // salva, atribui id se nao tiver
async buscarPorId(id)         // retorna pedido ou null
async listar(filtros = {})    // filtros: { status }
async atualizar(id, dados)    // merge dos dados
```

### `class ServicoPagamento`
Classe mockavel. Metodo:
```js
async cobrar(pedidoId, valor, metodoPagamento) // retorna { transacaoId, status: 'aprovado' }
async estornar(transacaoId)                    // retorna { status: 'estornado' }
```

### `class ServicoEmail`
Classe mockavel. Metodo:
```js
async enviar(destinatario, assunto, corpo)     // retorna { enviado: true }
```

### `class ProcessadorPedidos`
Orquestra as camadas.

```js
constructor(repo, pagamento, email)
```

#### `async criar(pedido)`
1. Valida pedido: `{ clienteId, itens: [{ produtoId, quantidade, preco }], metodoPagamento }` — lanca erro se invalido
2. Calcula valor total (soma de quantidade * preco)
3. Chama `pagamento.cobrar(id, total, metodoPagamento)`
4. Se pagamento aprovado: salva pedido com `status: 'aprovado'`
5. Envia email de confirmacao (assunto: 'Pedido confirmado')
6. Retorna pedido salvo

#### `async cancelar(id, motivo)`
1. Busca pedido
2. Estorna pagamento via `pagamento.estornar(pedido.transacaoId)`
3. Atualiza status para `'cancelado'` com o motivo
4. Envia email de cancelamento
5. Retorna pedido atualizado

#### `async listar(filtros)`
Delega para `repo.listar(filtros)`.

---

## Como testar

```bash
npm install
npm test
```

Os testes usam `jest.fn()` e `jest.spyOn` para mockar `ServicoPagamento` e `ServicoEmail`.

---

## Dicas

Antes de codar, pense:

1. **Por que mockar `ServicoPagamento`?** O que aconteceria se o teste chamasse o pagamento real a cada `npm test`? Custo financeiro? Latencia? Dependencia de rede?

2. **`jest.fn()` vs instancia real:** Qual a diferenca entre `jest.fn()` e `new ServicoPagamento()`? Quando usar cada um?

3. **Verificar chamadas com `expect(mock).toHaveBeenCalledWith(...)`:** Por que isso e importante nos testes de integracao? O que estamos testando alem do resultado final?

4. **Cenario de falha de pagamento:** O que deve acontecer se `pagamento.cobrar` lanca um erro? O pedido deve ser salvo? O email deve ser enviado?

5. **`beforeEach` para resetar estado:** Por que e crucial resetar o estado do repositorio e dos mocks entre cada teste?

---

## Tarefas para o Sprint

- [ ] Implementar `RepositorioPedidos` in-memory com CRUD basico
- [ ] Implementar `ServicoPagamento` e `ServicoEmail` como classes reais (serao mockadas nos testes)
- [ ] Implementar `ProcessadorPedidos.criar` com validacao, pagamento, email
- [ ] Implementar `ProcessadorPedidos.cancelar` com estorno e email
- [ ] Escrever teste: criar pedido valido (verificar chamadas ao pagamento e email)
- [ ] Escrever teste: criar pedido invalido (sem itens) deve lancar erro
- [ ] Escrever teste: falha no pagamento nao salva pedido
- [ ] Escrever teste: cancelar pedido estorna e envia email
- [ ] Garantir que todos os testes passam com `npm test`
