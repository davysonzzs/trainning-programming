# DEVTECH SISTEMAS S.A.
## Módulo: Validação Assíncrona do Serviço de Pagamentos

> BLOQUEIO: nova arquitetura de pagamentos exige módulo de Promises — time de integração aguarda para prosseguir.

---

### Contexto
A DevTech está migrando o serviço de pagamentos para uma arquitetura orientada a eventos. O tech lead Fábio definiu que toda operação de validação deve retornar Promises — sem callbacks, sem async/await neste módulo. O time de integração está bloqueado aguardando o `banco.js` para conectar com a fila de mensagens.

**Nível:** Trainee
**Sprint:** Trainee — Banco de Promessas
**Estimativa:** 2h
**Prioridade:** Alta

---

### O que fazer
- [ ] Criar o arquivo `banco.js` na raiz deste projeto
- [ ] Implementar `buscarConta`
- [ ] Implementar `validarTransferencia`
- [ ] Implementar `calcularTarifas`
- [ ] Implementar `processarTransacoes`
- [ ] Implementar `primeiraResposta`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar
`banco.js`

---

### Especificação das funções

> Atenção: todas as funções devem retornar `Promise`. NÃO use `async/await` neste módulo — use `new Promise(...)` ou métodos estáticos como `Promise.resolve`, `Promise.reject`, `Promise.all`, `Promise.race`.

**`buscarConta(id, contas)`**
- `contas` é um array de objetos com ao menos a propriedade `id`
- Resolve com o objeto da conta se encontrada
- Rejeita com `new Error('Conta não encontrada')` se nenhuma conta tiver o `id` informado
- Ex: `buscarConta(1, [{ id: 1, saldo: 100 }])` → resolve com `{ id: 1, saldo: 100 }`

**`validarTransferencia(valor, saldoOrigem)`**
- Resolve com `valor` se `saldoOrigem >= valor`
- Rejeita com `new Error('Saldo insuficiente')` caso contrário
- Ex: `validarTransferencia(50, 100)` → resolve com `50`

**`calcularTarifas(valor)`**
- Sempre resolve (nunca rejeita)
- Resolve com `{ valor, tarifa: valor * 0.01, total: valor + valor * 0.01 }`
- Ex: `calcularTarifas(200)` → resolve com `{ valor: 200, tarifa: 2, total: 202 }`

**`processarTransacoes(transacoes)`**
- Recebe um array de Promises
- Resolve com array de todos os resultados quando todas as Promises resolverem
- Se qualquer uma rejeitar, a Promise retornada também rejeita
- Use `Promise.all`

**`primeiraResposta(fontes)`**
- Recebe um array de Promises
- Resolve (ou rejeita) com o resultado da primeira Promise que se estabelecer
- Use `Promise.race`

---

### Como testar
```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`buscarConta`** — Dentro de `new Promise((resolve, reject) => { ... })`, como você encontra um item em array pelo id? O que acontece se `.find()` não encontrar nada (retorna `undefined`)?

**`validarTransferencia`** — Você pode usar `Promise.resolve(valor)` e `Promise.reject(new Error(...))` como atalhos em vez de `new Promise`. Qual das duas formas você prefere usar aqui?

**`calcularTarifas`** — Como você passa um objeto como argumento para `resolve()`? Lembre que `resolve` recebe um único valor — mas esse valor pode ser qualquer coisa, inclusive um objeto.

**`processarTransacoes`** — `Promise.all` recebe um array. O que ele retorna? Quando ele rejeita automaticamente?

**`primeiraResposta`** — `Promise.race` e `Promise.all` têm assinaturas parecidas. Qual a diferença fundamental no comportamento deles com o array de Promises?

---

### Tarefas sugeridas para o Sprint
```
add Criar banco.js
add Implementar buscarConta com new Promise
add Implementar validarTransferencia com resolve/reject
add Implementar calcularTarifas com objeto de retorno
add Implementar processarTransacoes com Promise.all
add Implementar primeiraResposta com Promise.race
```
