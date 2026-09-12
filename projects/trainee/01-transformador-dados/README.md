# DEVTECH SISTEMAS S.A.
## Incidente: Transformador de Dados do E-commerce Deletado

> URGENTE: sistema de exibição de produtos está quebrando em produção — arquivo deletado antes do commit.

---

### Contexto
Leonardo, dev do time de e-commerce, estava refatorando o módulo de transformação de dados quando acidentalmente deletou `transformador.js` e fez push sem o arquivo. O pipeline de CI falhou e o painel de produtos está exibindo erros para todos os usuários. A equipe precisa que você recrie o arquivo imediatamente para restaurar o sistema.

**Nível:** Trainee
**Sprint:** Trainee — Transformador de Dados
**Estimativa:** 1h 30m
**Prioridade:** Alta

---

### O que fazer
- [ ] Criar o arquivo `transformador.js` na raiz deste projeto
- [ ] Implementar `formatarNome`
- [ ] Implementar `somarTodos`
- [ ] Implementar `combinarArrays`
- [ ] Implementar `mapearPrecos`
- [ ] Implementar `extrairDados`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar
`transformador.js`

---

### Especificação das funções

**`formatarNome({ nome, sobrenome })`**
- Recebe um objeto com propriedades `nome` e `sobrenome` via destructuring de parâmetro
- Retorna uma string no formato `"Sobrenome, Nome"`
- Ex: `formatarNome({ nome: 'Ana', sobrenome: 'Lima' })` → `"Lima, Ana"`

**`somarTodos(...nums)`**
- Recebe qualquer quantidade de números via rest operator
- Retorna a soma de todos os argumentos
- Ex: `somarTodos(1, 2, 3, 4)` → `10`
- Ex: `somarTodos()` → `0`

**`combinarArrays(arr1, arr2)`**
- Combina dois arrays usando spread operator
- Remove duplicatas comparando por valor primitivo
- Retorna o novo array sem modificar os originais
- Ex: `combinarArrays([1, 2, 3], [2, 3, 4])` → `[1, 2, 3, 4]`

**`mapearPrecos(produtos, desconto)`**
- `produtos` é um array de objetos `{ nome, preco }`
- `desconto` é um número percentual (ex: `10` = 10%)
- Usa arrow function em `.map()`
- Retorna array de `{ nome, precoOriginal, precoFinal }` onde `precoFinal = preco - (preco * desconto / 100)`, arredondado para 2 casas decimais
- Ex: `mapearPrecos([{ nome: 'Camiseta', preco: 100 }], 10)` → `[{ nome: 'Camiseta', precoOriginal: 100, precoFinal: 90 }]`

**`extrairDados(pedido)`**
- `pedido` tem o shape: `{ id, cliente: { nome, email }, itens, total }`
- Usa destructuring aninhado para extrair os campos necessários
- Retorna `{ id, nomeCliente: cliente.nome, total }`
- Ex: `extrairDados({ id: 1, cliente: { nome: 'João', email: 'j@j.com' }, itens: [], total: 99.9 })` → `{ id: 1, nomeCliente: 'João', total: 99.9 }`

---

### Como testar
```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`formatarNome`** — Você sabe que pode desestruturar o objeto diretamente nos parâmetros da função? Como ficaria `function({ a, b })` em vez de `function(obj)` e depois `obj.a`?

**`somarTodos`** — Como o operador `...` antes do parâmetro captura "todos os argumentos restantes" em um array? Que método de array calcula a soma acumulada de todos os elementos?

**`combinarArrays`** — Se você usar `[...arr1, ...arr2]`, vai ter duplicatas. Que estrutura de dados nativa do JavaScript garante valores únicos automaticamente? Como converter de volta para array?

**`mapearPrecos`** — Você está retornando um objeto dentro do `.map()` com arrow function. Quando uma arrow function retorna um objeto literal com `{}`, o que você precisa fazer para o JS não confundir com o bloco de código?

**`extrairDados`** — O destructuring pode ser aninhado: `const { a: { b } } = obj` extrai `obj.a.b` como `b`. Mas e se você quiser renomear ao mesmo tempo que desestrutura?

---

### Tarefas sugeridas para o Sprint
```
add Criar transformador.js
add Implementar formatarNome com destructuring de parâmetro
add Implementar somarTodos com rest operator
add Implementar combinarArrays com spread e remoção de duplicatas
add Implementar mapearPrecos com arrow function e .map()
add Implementar extrairDados com destructuring aninhado
```
