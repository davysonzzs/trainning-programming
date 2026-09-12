# 06 — ORM Integrador

**Nível:** Pleno II
**Sprint:** Pleno II — Padrões de Banco de Dados
**Estimativa:** 2h 30m

---

## Contexto

Projeto integrador do Pleno II. A DevTech quer um ORM simples que unifique todos os padrões do nível: Repository, Cache, Migrations e Transactions. Inspirado no Prisma, mas em JS puro com dados em memória.

## O que fazer

Implemente `criarORM(config)` em `orm.js`. O ORM permite definir models, executar migrations automáticas e operar sobre os dados com cache transparente e suporte a transações.

## Arquivo a criar

`orm.js` na raiz deste projeto.

## Especificação

### `criarORM(config = {})`

**`config`** pode ter:
- `ttlCache` — TTL do cache em ms (padrão 60000)

Retorna um objeto `orm` com:

---

**`orm.define(nome, campos)`**
- Define um model (similar a Prisma schema)
- `campos` é `{ [campo]: { type: 'string'|'number'|'boolean', required: boolean, default: any } }`
- Registra internamente o model

**`orm.model(nome)`**
- Retorna instância do Model para o nome dado
- Lança erro se model não foi definido com `define()`

**Model Instance** — objeto retornado por `orm.model(nome)`:

| Método | Descrição |
|--------|-----------|
| `async findAll(filtros)` | Lista com filtros, usa cache |
| `async findById(id)` | Busca por id, usa cache |
| `async findOne(filtros)` | Primeiro resultado |
| `async create(dados)` | Cria com defaults e timestamps |
| `async update(id, dados)` | Atualiza campos |
| `async delete(id)` | Remove registro |
| `async count(filtros)` | Contagem |

**`orm.migrar()`**
- Inicializa as "tabelas" internas para todos os models definidos
- Idempotente: pode ser chamado múltiplas vezes sem duplicar dados

**`orm.transacao(fn)`**
- Executa `fn(orm)` em uma transação
- Se `fn` lançar erro: rollback de todos os models, relança o erro

---

## Exemplo de uso

```js
const orm = criarORM({ ttlCache: 5000 });

orm.define('Usuario', {
  nome: { type: 'string', required: true },
  email: { type: 'string', required: true },
  ativo: { type: 'boolean', default: true },
});

await orm.migrar();

const Usuario = orm.model('Usuario');
const user = await Usuario.create({ nome: 'Ana', email: 'ana@dev.com' });
const todos = await Usuario.findAll({ ativo: true });
```

## Como testar

```bash
npm install
npm test
```

## Dicas

- Internamente, cada model tem seu próprio repositório (Map) e seu próprio cache.
- `orm.migrar()` pode simplesmente garantir que cada model definido tem seu repositório inicializado.
- Para transações, guarde snapshots dos Maps de cada model antes de executar fn.
- `create` deve aplicar os `default` de campos não informados.
- Não é necessário validação de tipos nos testes — foco na arquitetura.

## Tarefas

- [ ] Implementar `criarORM(config)`
- [ ] Implementar `define(nome, campos)` registrando o schema
- [ ] Implementar repositório interno por model
- [ ] Implementar `model(nome)` retornando instância com todos os métodos CRUD
- [ ] Implementar cache transparente nos métodos `findById` e `findAll`
- [ ] Implementar `migrar()` inicializando estruturas
- [ ] Implementar `transacao(fn)` com rollback automático
- [ ] Aplicar defaults no `create`
- [ ] Exportar `criarORM`
- [ ] Passar nos testes com `npm test`
