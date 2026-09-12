# DEVTECH SISTEMAS S.A.
## Utilitários: Módulo Funcional Reutilizável para a Base de Código

> DECISÃO TÉCNICA: Tech Lead Rafael aprovou módulo de utilitários funcionais — aguarda implementação para adotar em todos os times.

---

### Contexto
Rafael, Tech Lead da DevTech, quer padronizar o uso de padrões funcionais em toda a base de código. Ele definiu que o arquivo `funcional.js` será o módulo central de utilitários reutilizáveis. Todos os times vão depender desse módulo, então ele precisa estar bem implementado e coberto por testes.

**Nível:** Trainee
**Sprint:** Trainee — Funcional
**Estimativa:** 2h
**Prioridade:** Média

---

### O que fazer
- [ ] Criar o arquivo `funcional.js` na raiz deste projeto
- [ ] Implementar `criarContador`
- [ ] Implementar `memoizar`
- [ ] Implementar `pipeline`
- [ ] Implementar `agruparPor`
- [ ] Implementar `once`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar
`funcional.js`

---

### Especificação das funções

**`criarContador(inicio = 0)`**
- Retorna um objeto com quatro métodos usando closure sobre uma variável interna
- `incrementar()` — aumenta o valor interno em 1
- `decrementar()` — diminui o valor interno em 1
- `valor()` — retorna o valor atual
- `resetar()` — retorna o valor ao `inicio` original
- Ex: `const c = criarContador(5); c.incrementar(); c.valor()` → `6`

**`memoizar(fn)`**
- Higher-order function que recebe uma função `fn` e retorna uma nova função
- A nova função guarda em cache o resultado de cada chamada, usando `JSON.stringify(args)` como chave
- Se chamada com os mesmos argumentos, retorna o resultado do cache sem executar `fn` novamente
- Ex: se `fn` é chamada 2x com os mesmos args, `fn` de verdade executa apenas 1 vez

**`pipeline(...fns)`**
- Recebe qualquer quantidade de funções
- Retorna uma nova função que aplica as funções da esquerda para a direita
- `pipeline(f, g, h)(x)` equivale a `h(g(f(x)))`
- Ex: `pipeline(x => x + 1, x => x * 2)(3)` → `8`

**`agruparPor(arr, chave)`**
- Recebe um array de objetos e uma string `chave`
- Retorna um objeto onde cada propriedade é um valor distinto de `chave` e o valor é um array com os objetos que têm aquele valor
- Ex: `agruparPor([{ tipo: 'A', v: 1 }, { tipo: 'B', v: 2 }, { tipo: 'A', v: 3 }], 'tipo')` → `{ A: [{ tipo: 'A', v: 1 }, { tipo: 'A', v: 3 }], B: [{ tipo: 'B', v: 2 }] }`

**`once(fn)`**
- Recebe uma função `fn` e retorna uma nova função
- A nova função executa `fn` apenas na primeira chamada e armazena o resultado
- Em todas as chamadas seguintes, retorna o resultado da primeira chamada sem executar `fn` novamente
- Ex: se `fn` retorna `Math.random()`, todas as chamadas a `once(fn)` retornam o mesmo número

---

### Como testar
```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`criarContador`** — Uma closure "fecha" sobre variáveis do escopo externo. Se você declara `let count = inicio` dentro de `criarContador` e retorna um objeto com métodos, esses métodos conseguem ler e modificar `count`? Por quê?

**`memoizar`** — Onde você vai guardar o cache? Precisa ser uma variável que persiste entre chamadas da função retornada. `JSON.stringify` de um array de argumentos funciona como chave única — como você acessa o array de argumentos em uma função com `...args`?

**`pipeline`** — Se você tem um array de funções e um valor inicial, como o método `.reduce()` pode aplicar cada função ao resultado da anterior? Qual é o valor inicial do `reduce` aqui?

**`agruparPor`** — Como você usa `.reduce()` para construir um objeto a partir de um array? O acumulador começa como `{}`. Para cada item, como você adiciona o item ao array correto dentro do acumulador sem perder os itens anteriores?

**`once`** — Você precisa de duas coisas: uma variável para saber se `fn` já foi chamada, e outra para guardar o resultado. Essas variáveis precisam sobreviver entre chamadas da função retornada — isso é uma closure?

---

### Tarefas sugeridas para o Sprint
```
add Criar funcional.js
add Implementar criarContador com closure
add Implementar memoizar com cache interno
add Implementar pipeline com reduce
add Implementar agruparPor com reduce
add Implementar once com flag de execução
```
