# DEVTECH SISTEMAS S.A.
## Feature: App de lista de compras do mercado parceiro

> App de lista de compras precisa de funções básicas pra adicionar itens, somar o total
> do carrinho e contar quantos itens tem na lista.

---

### Contexto

O mercado parceiro contratou a DevTech pra criar as regras de negócio de um app de lista
de compras. Nada de tela ainda — só a lógica: guardar itens numa lista (array), calcular
o total e contar quantos itens existem. É a porta de entrada pro trabalho com **arrays**.

**Nível:** Estagiário  
**Sprint:** Estagiário — Lista de Compras  
**Estimativa:** 2h  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Arrays: criação, iteração e métodos essenciais (1/3)

---

### O que fazer

- [ ] Criar o arquivo `compras.js` na raiz deste projeto
- [ ] Implementar `adicionarItem(lista, item)`
- [ ] Implementar `totalDaLista(lista)`
- [ ] Implementar `contarItens(lista)`
- [ ] Implementar `itemMaisCaro(lista)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`compras.js`

---

### Especificação das funções

**Estrutura de um item:** `{ nome, preco }`

**`adicionarItem(lista, item)`**
- Recebe um array de itens e um novo item
- Retorna um **novo** array com o item adicionado no final (não altere o array recebido)

**`totalDaLista(lista)`**
- Retorna a soma do `preco` de todos os itens da lista
- Lista vazia retorna `0`

**`contarItens(lista)`**
- Retorna quantos itens existem na lista

**`itemMaisCaro(lista)`**
- Retorna o item (objeto completo) com o maior `preco`
- Lista vazia retorna `null`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 6 — Arrays: criação, iteração e métodos essenciais**
> em [`06-arrays.md`](../../../aulas/fase-01-fundamentos-de-programacao/06-arrays.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`adicionarItem`** — Existe um jeito de criar um array novo já com os itens antigos
mais um novo no final, sem usar `.push()` diretamente no array recebido (`.push()`
modifica o original). O spread (`[...lista, item]`) resolve isso — se você ainda não viu
spread, por enquanto pode usar `.concat([item])`, que também gera um array novo.

**`totalDaLista`** — Percorra a lista com um `for` (ou `.forEach`) somando `item.preco`
num acumulador.

**`contarItens`** — É só `.length`.

**`itemMaisCaro`** — Percorra a lista guardando, num acumulador, o item com maior
`preco` visto até agora — parecido com achar o maior número, só que comparando uma
propriedade do objeto.

---

### Tarefas sugeridas para o Sprint

```
add Criar compras.js
add Implementar adicionarItem
add Implementar totalDaLista
add Implementar contarItens
add Implementar itemMaisCaro
add Passar em todos os testes
```
