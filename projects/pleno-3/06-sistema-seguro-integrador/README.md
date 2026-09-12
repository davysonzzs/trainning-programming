# 06 — Sistema Seguro Integrador

**Nível:** Pleno III
**Fase:** 9+10 — Segurança + Arquitetura (Integrador)
**Estimativa:** 2h 30m

---

## Contexto

Este e o projeto integrador do Pleno III. Voce ja implementou hash de senhas, JWT, RBAC, Clean Architecture e Design Patterns em projetos separados. Agora e hora de juntar tudo em um sistema coeso.

A DevTech precisa de um modulo de autenticacao e autorizacao completo: registro de usuarios, login com senha segura, tokens JWT stateless e controle de acesso por papeis. Tudo em um unico modulo testavel e bem organizado.

---

## O que fazer

Implemente o arquivo `sistema.js` que integra todos os subsistemas desenvolvidos no Pleno III em uma `class SistemaSeguro`.

**IMPORTANTE:** Voce deve implementar os subsistemas necessarios diretamente no `sistema.js` (hash, jwt, rbac) ou pode reutilizar seus modulos anteriores importando com `require('../01-sistema-hash/hash')` etc. A escolha e sua — o importante e que `sistema.js` funcione de forma independente.

---

## Arquivo a criar

**`sistema.js`** na raiz deste projeto.

---

## Especificacao

### `class SistemaSeguro`

#### `constructor()`
Inicializa:
- Sistema de hash (para senhas)
- Sistema de JWT (para tokens)
- Sistema de RBAC (para permissoes)
- Armazenamento de usuarios (array/objeto in-memory)

Configura papeis padrao:
- `'usuario'`: `['ler:perfil', 'editar:perfil']`
- `'admin'`: `['ler:perfil', 'editar:perfil', 'usuario:listar', 'admin:promover', 'admin:tudo']`

#### `async registrarUsuario({ nome, email, senha })`
- Verifica se email ja existe → lanca `Error('Email ja cadastrado')`
- Faz hash da senha
- Cria usuario com id unico
- Atribui papel `'usuario'`
- Retorna `{ id, nome, email }` (sem senha)

#### `async autenticar(email, senha)`
- Busca usuario por email → lanca `Error('Credenciais invalidas')` se nao encontrado
- Compara senha com hash → lanca `Error('Credenciais invalidas')` se errada
- Gera token JWT com `{ userId: id, email, papel }`
- Retorna `{ token, usuario: { id, nome, email } }`

#### `async verificarAcesso(token, permissao)`
- Verifica e decodifica JWT → lanca `Error('Token invalido')` se invalido
- Verifica permissao no RBAC
- Retorna `boolean`

#### `async promoverAdmin(adminToken, usuarioId)`
- Verifica token do solicitante
- Verifica se solicitante tem permissao `'admin:promover'`
- Atribui papel `'admin'` ao usuarioId
- Retorna `{ sucesso: true, usuarioId, novoPapel: 'admin' }`

#### `listarUsuarios(adminToken)`
- Verifica token
- Verifica permissao `'usuario:listar'`
- Retorna lista de usuarios SEM campo `senha`

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

Antes de codar, pense:

1. **Como organizar o `constructor`?** Pense em quais objetos voce precisa manter em memoria: usuarios, ACL, segredo JWT. Onde cada um fica?

2. **Por que retornar sem senha?** `{ id, nome, email }` ao inves de retornar o objeto completo do usuario protege contra vazamento acidental.

3. **`verificarAcesso` compoe dois sistemas:** JWT (autenticacao) + RBAC (autorizacao). Qual e a diferenca entre esses dois conceitos?

4. **`promoverAdmin` tem dupla verificacao:** verifica o token do admin E verifica a permissao. O que acontece se um usuario comum tentar chamar essa funcao com seu proprio token?

5. **Ordem de validacoes importa:** Em `autenticar`, por que voce retorna sempre `'Credenciais invalidas'` tanto para email nao encontrado quanto para senha errada? Que ataque voce previne com isso?

---

## Tarefas para o Sprint

- [ ] Implementar (ou importar) subsistemas: hash, jwt, rbac
- [ ] Implementar `constructor` com inicializacao de todos os subsistemas
- [ ] Implementar `registrarUsuario` com hash e atribuicao de papel
- [ ] Implementar `autenticar` com verificacao de hash e geracao de JWT
- [ ] Implementar `verificarAcesso` integrando JWT + RBAC
- [ ] Implementar `promoverAdmin` com verificacao de permissao
- [ ] Implementar `listarUsuarios` com verificacao de permissao
- [ ] Garantir que todos os testes passam com `npm test`
