# DEVTECH SISTEMAS S.A.
## Bug Fix: Loop de processamento duplicando e perdendo pedidos

> Sistema de e-commerce interno com bug crítico em produção — pedidos sumindo.

---

### Contexto

QA Ana abriu ticket P1: o sistema de processamento de pedidos está duplicando alguns itens
e ignorando outros. O log mostra que o problema está no módulo `pedidos.js`, que foi deletado
acidentalmente. Você precisa recriar as funções de processamento. Os testes já estão prontos.

**Nível:** Estagiário  
**Sprint:** Estagiário — Processador de Pedidos  
**Estimativa:** 2h  
**Prioridade:** Alta

---

### O que fazer

- [ ] Criar o arquivo `pedidos.js` na raiz deste projeto
- [ ] Implementar `contarItens(pedido)`
- [ ] Implementar `calcularTotal(pedido)`
- [ ] Implementar `filtrarPorStatus(pedidos, status)`
- [ ] Implementar `agruparPorStatus(pedidos)`
- [ ] Implementar `processarLote(pedidos)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`pedidos.js`

---

### Especificação das funções

**Estrutura de um item:** `{ nome, preco, quantidade }`  
**Estrutura de um pedido:** `{ id, cliente, status, items: [...] }`  
**Status possíveis:** `'pendente'` | `'processando'` | `'entregue'` | `'cancelado'`

**`contarItens(pedido)`**
- Soma a `quantidade` de todos os items
- Ex: items com qtd 2 e 3 → retorna `5`

**`calcularTotal(pedido)`**
- Soma `preco * quantidade` de cada item, arredondado 2 casas

**`filtrarPorStatus(pedidos, status)`**
- Retorna array com apenas os pedidos do status informado

**`agruparPorStatus(pedidos)`**
- Retorna: `{ pendente: [], processando: [], entregue: [], cancelado: [] }`
- Todas as chaves sempre presentes, mesmo que vazias

**`processarLote(pedidos)`**
- Mapeia cada pedido para: `{ ...pedido, total, quantidadeItens }`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`contarItens`** — Você não quer contar quantos itens existem no array — quer somar o campo `quantidade` de cada um. São coisas diferentes.

**`calcularTotal`** — Para cada item: `preco * quantidade`. Acumule esses valores. Você já fez algo parecido em `calcularFaturamento`?

**`filtrarPorStatus`** — Percorra o array e retorne somente os pedidos cujo `status` é igual ao parâmetro recebido.

**`agruparPorStatus`** — Comece criando o objeto com as 4 chaves já definidas e arrays vazios. Depois percorra os pedidos e empurre cada um para a chave correta.

**`processarLote`** — Mapeie o array. Para cada pedido, retorne um novo objeto com todas as propriedades do pedido original, mais `total` e `quantidadeItens`. Spread (`...`) pode ajudar a copiar as propriedades.

---

### Tarefas sugeridas para o Sprint

```
add Criar pedidos.js
add Implementar contarItens e calcularTotal
add Implementar filtrarPorStatus
add Implementar agruparPorStatus
add Implementar processarLote
add Passar em todos os testes
```
