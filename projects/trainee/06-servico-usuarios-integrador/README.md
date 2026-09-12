# DEVTECH SISTEMAS S.A.
## Projeto Final: Serviço de Usuários do Portal Interno

> ENTREGA FINAL: sistema de gerenciamento de usuários precisa estar pronto para o lançamento do portal interno da DevTech.

---

### Contexto
Como projeto integrador do nível Trainee, você vai construir o serviço de usuários do portal interno da DevTech. Este módulo combina tudo que foi aprendido: classes ES6, async/await, closures, destructuring e spread. O diretor de TI, Henrique, acompanhará a entrega pessoalmente — é o projeto mais importante do sprint.

**Nível:** Trainee
**Sprint:** Trainee — Serviço de Usuários Integrador
**Estimativa:** 2h 30m
**Prioridade:** Alta

---

### O que fazer
- [ ] Criar o arquivo `servico.js` na raiz deste projeto
- [ ] Implementar a classe `ServicoUsuarios` com `constructor`
- [ ] Implementar o método `criar`
- [ ] Implementar o método `buscar`
- [ ] Implementar o método `atualizar`
- [ ] Implementar o método `listar`
- [ ] Implementar o método `remover`
- [ ] Implementar o método `total`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar
`servico.js`

---

### Especificação das funções

**`class ServicoUsuarios`**

`constructor()`
- Inicializa um `Map` interno para armazenar usuários (chave: id, valor: objeto do usuário)
- Inicializa `nextId = 1` para auto-incremento de IDs

`async criar({ nome, email })`
- Usa destructuring no parâmetro
- Lança `new Error('Dados obrigatórios')` se `nome` ou `email` estiverem ausentes ou vazios
- Lança `new Error('Email já cadastrado')` se já existe usuário com o mesmo email (case-insensitive)
- Cria o usuário com `{ id: nextId++, nome, email }` e armazena no Map
- Retorna o objeto do usuário criado

`async buscar(id)`
- Busca o usuário pelo id no Map
- Lança `new Error('Usuário não encontrado')` se não existir
- Retorna o objeto do usuário

`async atualizar(id, dados)`
- Busca o usuário (pode reusar `buscar`)
- Mescla `dados` no usuário existente usando spread: `{ ...usuarioExistente, ...dados }`
- Atualiza o Map com o usuário mesclado
- Retorna o objeto do usuário atualizado

`async listar()`
- Retorna um array com todos os usuários armazenados no Map
- Ex: se há 3 usuários, retorna array com 3 objetos

`async remover(id)`
- Busca o usuário (lança erro se não encontrado via `buscar`)
- Remove do Map
- Retorna `true`

`total()`
- Método síncrono
- Retorna o número de usuários no Map
- Ex: após criar 3 usuários, `total()` → `3`

---

### Como testar
```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`constructor`** — `new Map()` cria um Map vazio. Como você acessa, insere e remove entradas de um Map? Quais são os métodos `.get()`, `.set()`, `.delete()`, `.has()` e `.size`?

**`criar`** — Como você verifica duplicidade de email percorrendo os valores do Map? `Map.values()` retorna um iterador — como convertê-lo para array para usar métodos como `.some()`?

**`buscar`** — `Map.get(id)` retorna `undefined` se a chave não existir. Como você usa isso para decidir entre retornar o usuário ou lançar o erro?

**`atualizar`** — Spread em objetos: `{ ...a, ...b }` — o que acontece quando `a` e `b` têm a mesma propriedade? Qual dos dois "vence"? Isso é o comportamento desejado aqui?

**`listar`** — `Map.values()` retorna um iterador. Como você converte para um array simples? Pense em `Array.from()` ou spread `[...]`.

**`remover`** — Você pode chamar `await this.buscar(id)` dentro de outro método `async`? O erro lançado por `buscar` vai se propagar automaticamente para quem chamou `remover`?

---

### Tarefas sugeridas para o Sprint
```
add Criar servico.js
add Implementar constructor com Map e nextId
add Implementar método criar com validação e verificação de duplicidade
add Implementar método buscar com erro se não encontrado
add Implementar método atualizar com spread
add Implementar método listar retornando array
add Implementar método remover com retorno true
add Implementar método total síncrono
```
