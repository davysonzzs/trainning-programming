# DEVTECH SISTEMAS S.A.
## Feature: Módulo de Agenda Assíncrona para CRM Interno

> SPRINT ATIVO: módulo de agenda com async/await é pré-requisito para integração com APIs externas na próxima semana.

---

### Contexto
O CRM interno da DevTech precisa de um módulo de agenda de contatos que opere de forma assíncrona, preparando o terreno para futuras integrações com APIs externas de sincronização. A analista Beatriz mapeou os requisitos e o time de backend aguarda o `agenda.js` para continuar o desenvolvimento da camada de integração.

**Nível:** Trainee
**Sprint:** Trainee — Agenda Async
**Estimativa:** 2h
**Prioridade:** Alta

---

### O que fazer
- [ ] Criar o arquivo `agenda.js` na raiz deste projeto
- [ ] Implementar `buscarContato`
- [ ] Implementar `adicionarContato`
- [ ] Implementar `removerContato`
- [ ] Implementar `sincronizarAgendas`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar
`agenda.js`

---

### Especificação das funções

> Todas as funções devem ser declaradas com `async`. Use `throw new Error(...)` para lançar erros dentro de funções async.

**`async buscarContato(nome, agenda)`**
- `agenda` é um array de objetos `{ nome, email, ... }`
- Busca por nome (case-insensitive)
- Retorna o objeto do contato se encontrado
- Lança `new Error('Contato não encontrado')` se não encontrar
- Ex: `await buscarContato('ana', [{ nome: 'Ana', email: 'a@a.com' }])` → `{ nome: 'Ana', email: 'a@a.com' }`

**`async adicionarContato(contato, agenda)`**
- `contato` é um objeto que deve ter pelo menos `nome` e `email`
- Lança `new Error('Dados inválidos')` se `nome` ou `email` estiverem ausentes ou vazios
- Retorna um novo array com o contato adicionado (não modifica o array original)
- Ex: `await adicionarContato({ nome: 'Bia', email: 'b@b.com' }, [])` → `[{ nome: 'Bia', email: 'b@b.com' }]`

**`async removerContato(email, agenda)`**
- Remove o contato com o email informado (case-insensitive)
- Lança `new Error('Contato não encontrado')` se nenhum contato tiver esse email
- Retorna novo array sem o contato removido (não modifica o original)
- Ex: `await removerContato('a@a.com', [{ nome: 'Ana', email: 'A@A.COM' }])` → `[]`

**`async sincronizarAgendas(agenda1, agenda2)`**
- Combina os contatos das duas agendas
- Remove duplicatas por `email` (case-insensitive) — em caso de conflito, mantém o contato da `agenda1`
- Retorna nova agenda ordenada por `nome` (ordem alfabética)
- Ex: se `agenda1 = [{ nome: 'Bia', email: 'b@b.com' }]` e `agenda2 = [{ nome: 'Bia2', email: 'b@b.com' }, { nome: 'Carlos', email: 'c@c.com' }]`, o resultado tem Bia (da agenda1) e Carlos, ordenados por nome

---

### Como testar
```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`buscarContato`** — Uma função `async` que lança um erro com `throw` — quem chamar com `await` receberá esse erro como rejeição de Promise. Como você faz a comparação case-insensitive de strings em JavaScript?

**`adicionarContato`** — Como você verifica se uma string está "ausente ou vazia"? Pense em valores falsy. Você precisa modificar o array original ou pode criar um novo com spread?

**`removerContato`** — Que método de array cria um novo array com apenas os elementos que passam em uma condição? Como comparar dois emails ignorando maiúsculas?

**`sincronizarAgendas`** — Para remover duplicatas de um array de objetos por uma propriedade, como você usa um `Map` ou `reduce` para manter apenas uma entrada por email? Como o método `.sort()` funciona com strings para ordenar por nome?

---

### Tarefas sugeridas para o Sprint
```
add Criar agenda.js
add Implementar buscarContato com case-insensitive
add Implementar adicionarContato com validação e imutabilidade
add Implementar removerContato com case-insensitive
add Implementar sincronizarAgendas com deduplicação e ordenação
```
