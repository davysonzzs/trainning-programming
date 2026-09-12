# DEVTECH SISTEMAS S.A.
## Projeto Final: Core do CLI de Gerenciamento de Tarefas

> **ENTREGA DE SPRINT — Product Owner Cláudia:** O time interno está usando planilhas para controlar tarefas de sprint. Precisamos de um CLI simples para substituir isso. Esse é o projeto integrador do Junior I — aplica tudo que foi aprendido.

---
### Contexto

A DevTech usa um CLI interno chamado `devtask` para gerenciar tarefas durante os sprints. O módulo core desse CLI precisa ser reconstruído do zero: o arquivo original foi perdido em um problema de versionamento. Você vai implementar o parser de comandos e o gerenciador de tarefas completo.

Este é o projeto integrador do nível Junior I. Ele combina manipulação de strings, validação com erros, closures e boas práticas de organização de código.

**Nível:** Junior I
**Sprint:** Junior I — Projeto Integrador
**Estimativa:** 2h 30m
**Prioridade:** Média

---
### O que fazer

- [ ] Criar `cli.js`
- [ ] Implementar `parsearComando(linha)`
- [ ] Implementar classe `GerenciadorTarefas`
- [ ] Implementar `constructor()`
- [ ] Implementar `adicionar(titulo)`
- [ ] Implementar `concluir(id)`
- [ ] Implementar `remover(id)`
- [ ] Implementar `listar(filtro)`
- [ ] Implementar `estatisticas()`
- [ ] Fazer todos os testes passarem

---
### Arquivo a criar

`cli.js`

---
### Especificação das funções

#### `parsearComando(linha)`
Recebe uma string representando um comando do CLI e retorna um objeto com `{ comando, args }`.
- `"add comprar pão"` → `{ comando: 'add', args: ['comprar', 'pão'] }`
- `"list"` → `{ comando: 'list', args: [] }`
- `"done 3"` → `{ comando: 'done', args: ['3'] }`
- Retorna `null` para linha vazia ou apenas espaços
- O primeiro token é sempre o comando, o restante são os args

---

#### `class GerenciadorTarefas`

##### `constructor()`
Inicializa:
- `tarefas`: array vazio
- `nextId`: número começando em `1`

##### `adicionar(titulo)`
- Valida que `titulo` não é vazio/somente espaços. Lança `Error('Título obrigatório')` se inválido.
- Cria objeto: `{ id: <nextId>, titulo: titulo.trim(), concluida: false, criadoEm: new Date().toISOString() }`
- Incrementa `nextId`
- Adiciona ao array `tarefas`
- Retorna a tarefa criada

##### `concluir(id)`
- Busca a tarefa pelo `id` (número)
- Marca `concluida = true`
- Retorna a tarefa atualizada
- Lança `Error('Tarefa não encontrada')` se `id` não existir

##### `remover(id)`
- Remove a tarefa com o `id` informado do array
- Retorna `true` se removeu
- Lança `Error('Tarefa não encontrada')` se `id` não existir

##### `listar(filtro = 'todas')`
Retorna subconjunto das tarefas baseado no filtro:
- `'todas'` → todas as tarefas
- `'pendentes'` → apenas `concluida === false`
- `'concluidas'` → apenas `concluida === true`

##### `estatisticas()`
Retorna:
```js
{
  total: <número>,
  concluidas: <número>,
  pendentes: <número>,
  percentualConcluido: <número entre 0 e 100, arredondado>
}
```
- `percentualConcluido` de 0 quando não há tarefas

---
### Como testar

```bash
npm install
npm test
```

---
### Dicas (tente sozinho antes de usar)

- `parsearComando` pode usar `.trim().split(/\s+/)` para dividir a linha em tokens. O primeiro é o comando, o resto são args.
- Para validar título vazio, `.trim().length === 0` é suficiente.
- Para buscar por id, use `.find()` no array — lembre que `id` é número mas o argumento pode chegar como string vinda do CLI.
- O `criadoEm` usa `new Date().toISOString()` — o teste não vai verificar o valor exato, apenas que o campo existe.
- Para `percentualConcluido`, `Math.round((concluidas / total) * 100)` resolve o arredondamento.
- Como o `remover` atualiza o array sem criar um novo? Use `splice` com o índice encontrado, ou `filter` reatribuindo `this.tarefas`.

---
### Tarefas sugeridas para o Sprint

```
node sprint.js add "06-cli: implementar parsearComando"
node sprint.js add "06-cli: implementar GerenciadorTarefas.adicionar"
node sprint.js add "06-cli: implementar GerenciadorTarefas.concluir"
node sprint.js add "06-cli: implementar GerenciadorTarefas.remover"
node sprint.js add "06-cli: implementar GerenciadorTarefas.listar"
node sprint.js add "06-cli: implementar GerenciadorTarefas.estatisticas"
node sprint.js add "06-cli: fazer todos os testes passarem"
```
