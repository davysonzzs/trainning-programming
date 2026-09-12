# 03 — Controle de Acesso (RBAC)

**Nível:** Pleno III
**Fase:** 9 — Segurança
**Estimativa:** 2h

---

## Contexto

O sistema da DevTech cresceu de um projeto pequeno para uma plataforma com dezenas de modulos. O problema: a logica de autorizacao foi implementada de forma ad-hoc ao longo de anos. O codigo esta cheio de `if (usuario.isAdmin)`, `if (usuario.tipo === 'gerente')`, `if (usuario.permissoes.includes('X'))` espalhados em centenas de arquivos.

Quando um novo papel de usuario e criado (ex: "moderador"), o time precisa cacar todos esses ifs no codigo para decidir o que o moderador pode ou nao fazer. E um pesadelo de manutencao.

O Tech Lead Pedro quer implementar RBAC (Role-Based Access Control) centralizado: um unico lugar que define quem pode fazer o que.

---

## O que fazer

Implemente o arquivo `acesso.js` com um sistema de controle de acesso baseado em papeis (RBAC) com suporte a heranca de papeis.

---

## Arquivo a criar

**`acesso.js`** na raiz deste projeto.

---

## Especificacao

### `criarSistemaACL()`

Retorna um objeto com os seguintes metodos:

#### `definirPermissoes(papel, permissoes)`
Define as permissoes de um papel. Permissoes sao strings no formato `'acao:recurso'`.

```js
acl.definirPermissoes('editor', ['ler:artigo', 'criar:artigo', 'editar:artigo'])
acl.definirPermissoes('admin', ['ler:artigo', 'deletar:artigo', 'gerenciar:usuario'])
```

#### `atribuirPapel(usuarioId, papel)`
Atribui um papel a um usuario.

```js
acl.atribuirPapel('user-1', 'editor')
```

#### `verificar(usuarioId, permissao)`
Retorna `true` se o usuario tem a permissao (diretamente ou por heranca de papel).

#### `verificarTodos(usuarioId, permissoes)`
Retorna `true` apenas se o usuario tem TODAS as permissoes listadas.

#### `verificarAlgum(usuarioId, permissoes)`
Retorna `true` se o usuario tem ALGUMA das permissoes listadas.

#### `listarPermissoes(usuarioId)`
Retorna array com todas as permissoes do usuario (incluindo herdadas), sem duplicatas.

#### `herdar(papel, papelPai)`
O `papel` herda todas as permissoes do `papelPai`. Se o `papelPai` ganhar novas permissoes depois, elas tambem se aplicam.

```js
acl.definirPermissoes('leitor', ['ler:artigo'])
acl.definirPermissoes('editor', ['criar:artigo', 'editar:artigo'])
acl.herdar('editor', 'leitor')  // editor agora tem: ler, criar e editar
```

#### `middleware(permissao)`
Retorna uma funcao `(req, res, next) => void` que:
- Verifica se `req.usuario.id` tem a permissao
- Se sim: chama `next()`
- Se nao: chama `next(new Error('Acesso negado'))` ou seta `res.status` se disponivel

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

Antes de codar, pense:

1. **Como voce armazenaria os dados?** Voce precisa de: mapa de papel→permissoes, mapa de usuario→papel, mapa de herancas. Que estrutura de dados usa para cada?

2. **Heranca de papeis em cadeia:** Se `superAdmin` herda de `admin` que herda de `editor`, como voce coleta todas as permissoes? Pense em recursao ou BFS/DFS.

3. **`listarPermissoes` deve ter duplicatas?** Se pai e filho tem a mesma permissao, ela deve aparecer duas vezes? Use `Set` para eliminar duplicatas.

4. **O `middleware` retorna uma funcao:** O que isso tem a ver com closures? Como a funcao retornada "lembra" qual permissao verificar?

5. **O que acontece se `verificar` for chamado para um usuario sem papel atribuido?** Deve retornar `false` (sem permissoes) ou lancar erro?

---

## Tarefas para o Sprint

- [ ] Implementar estrutura de dados interna (mapas para papeis, usuarios, herancas)
- [ ] Implementar `definirPermissoes` e `atribuirPapel`
- [ ] Implementar `verificar` com suporte basico
- [ ] Adicionar suporte a heranca de papeis em `herdar` e atualizar `verificar`
- [ ] Implementar `verificarTodos` e `verificarAlgum`
- [ ] Implementar `listarPermissoes` sem duplicatas
- [ ] Implementar `middleware` retornando funcao de closure
- [ ] Garantir que todos os testes passam com `npm test`
