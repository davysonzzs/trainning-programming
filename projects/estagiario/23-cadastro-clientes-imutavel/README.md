# DEVTECH SISTEMAS S.A.
## Refactor: CRUD de clientes com mutação de estado

> Tech Lead pediu refatoração urgente — CRM mutando objetos diretamente, causando bugs.

---

### Contexto

O CRM interno tem um bug sutil: funções que deveriam "atualizar" um cliente estão modificando
o objeto original na memória, quebrando outras partes do sistema que têm referência ao mesmo
objeto. Tech Lead Rafael quer que todas as funções sejam **imutáveis** — sempre retornam
uma nova estrutura, nunca modificam a existente.

**Nível:** Estagiário  
**Sprint:** Estagiário — Cadastro de Clientes  
**Estimativa:** 2h 30m  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Objetos: propriedades, métodos e referências (3/3)

---

### O que fazer

- [ ] Criar o arquivo `clientes.js` na raiz deste projeto
- [ ] Implementar `adicionar(clientes, cliente)` — imutável
- [ ] Implementar `buscar(clientes, id)`
- [ ] Implementar `atualizar(clientes, id, dados)` — imutável
- [ ] Implementar `desativar(clientes, id)` — imutável
- [ ] Implementar `listarAtivos(clientes)`
- [ ] Implementar `buscarPorEmail(clientes, email)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`clientes.js`

---

### Especificação das funções

**Estrutura de um cliente:** `{ id, nome, email, ativo: true }`

**REGRA CENTRAL — Imutabilidade:**
Nenhuma função deve modificar o array `clientes` recebido como parâmetro.
Sempre retorne um novo array ou objeto. Use spread (`...`) ou métodos como `.map()`, `.filter()`.

**`adicionar(clientes, cliente)`**
- Retorna novo array com o cliente no final

**`buscar(clientes, id)`**
- Retorna o cliente com o id informado, ou `null`

**`atualizar(clientes, id, dados)`**
- Retorna novo array onde o cliente com `id` tem suas propriedades mescladas com `dados`
- Se id não existir, retorna o array sem alteração

**`desativar(clientes, id)`**
- Retorna novo array onde o cliente com `id` tem `ativo: false`

**`listarAtivos(clientes)`**
- Retorna apenas clientes com `ativo: true`

**`buscarPorEmail(clientes, email)`**
- Retorna cliente ou `null` (busca case-insensitive)

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 7 — Objetos: propriedades, métodos e referências**
> em [`07-objetos.md`](../../../aulas/fase-01-fundamentos-de-programacao/07-objetos.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**Imutabilidade — a regra central** — Se você usar `clientes.push(...)` ou `clientes[i].ativo = false`, você está mutando. O teste vai pegar isso. Sempre retorne um novo array/objeto.

**`adicionar`** — Como você cria um novo array com todos os elementos de um existente mais um novo? Spread (`[...clientes, novoCliente]`) é a forma mais direta.

**`atualizar`** — Use `.map()`. Para o cliente com o `id` certo, retorne um novo objeto mesclando as propriedades antigas com as novas (`{ ...cliente, ...dados }`). Para os outros, retorne o cliente sem mudança.

**`desativar`** — Mesma lógica do `atualizar`, mas só muda uma propriedade: `ativo: false`.

**`buscarPorEmail`** — "Case-insensitive" significa que `'ANA@DEV.COM'` deve encontrar `'ana@dev.com'`. Como você normaliza strings para comparar?

---

### Tarefas sugeridas para o Sprint

```
add Criar clientes.js
add Implementar adicionar e buscar
add Implementar atualizar (imutavel)
add Implementar desativar e listarAtivos
add Implementar buscarPorEmail
add Passar em todos os testes de imutabilidade
```
