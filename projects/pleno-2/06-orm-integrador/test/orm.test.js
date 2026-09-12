const { criarORM } = require('../orm');

function criarORMComUsuario(config = {}) {
  const orm = criarORM(config);
  orm.define('Usuario', {
    nome: { type: 'string', required: true },
    email: { type: 'string', required: true },
    ativo: { type: 'boolean', default: true },
  });
  return orm;
}

describe('criarORM — estrutura', () => {
  test('retorna objeto com define, model, migrar e transacao', () => {
    const orm = criarORM();
    expect(typeof orm.define).toBe('function');
    expect(typeof orm.model).toBe('function');
    expect(typeof orm.migrar).toBe('function');
    expect(typeof orm.transacao).toBe('function');
  });
});

describe('define e model', () => {
  test('model() retorna instância após define()', () => {
    const orm = criarORMComUsuario();
    const Usuario = orm.model('Usuario');
    expect(Usuario).toBeDefined();
    expect(typeof Usuario.create).toBe('function');
    expect(typeof Usuario.findAll).toBe('function');
    expect(typeof Usuario.findById).toBe('function');
    expect(typeof Usuario.update).toBe('function');
    expect(typeof Usuario.delete).toBe('function');
  });

  test('model() lança erro para model não definido', () => {
    const orm = criarORM();
    expect(() => orm.model('Inexistente')).toThrow();
  });
});

describe('CRUD básico via model', () => {
  test('create() retorna registro com id', async () => {
    const orm = criarORMComUsuario();
    const Usuario = orm.model('Usuario');
    const user = await Usuario.create({ nome: 'Ana', email: 'ana@dev.com' });
    expect(user.id).toBeDefined();
    expect(user.nome).toBe('Ana');
  });

  test('create() aplica valor default para campos não informados', async () => {
    const orm = criarORMComUsuario();
    const Usuario = orm.model('Usuario');
    const user = await Usuario.create({ nome: 'Bob', email: 'bob@dev.com' });
    expect(user.ativo).toBe(true); // default: true
  });

  test('findAll() retorna todos os registros criados', async () => {
    const orm = criarORMComUsuario();
    const Usuario = orm.model('Usuario');
    await Usuario.create({ nome: 'Ana', email: 'ana@dev.com' });
    await Usuario.create({ nome: 'Bob', email: 'bob@dev.com' });
    const todos = await Usuario.findAll();
    expect(todos.length).toBe(2);
  });

  test('findById() retorna registro existente', async () => {
    const orm = criarORMComUsuario();
    const Usuario = orm.model('Usuario');
    const criado = await Usuario.create({ nome: 'Carlos', email: 'c@dev.com' });
    const encontrado = await Usuario.findById(criado.id);
    expect(encontrado.nome).toBe('Carlos');
  });

  test('findById() retorna null para id inexistente', async () => {
    const orm = criarORMComUsuario();
    const Usuario = orm.model('Usuario');
    const r = await Usuario.findById(9999);
    expect(r).toBeNull();
  });

  test('update() atualiza campos do registro', async () => {
    const orm = criarORMComUsuario();
    const Usuario = orm.model('Usuario');
    const criado = await Usuario.create({ nome: 'Diana', email: 'd@dev.com' });
    const atualizado = await Usuario.update(criado.id, { nome: 'Diana Silva' });
    expect(atualizado.nome).toBe('Diana Silva');
  });

  test('delete() remove o registro', async () => {
    const orm = criarORMComUsuario();
    const Usuario = orm.model('Usuario');
    const criado = await Usuario.create({ nome: 'Teste', email: 't@dev.com' });
    await Usuario.delete(criado.id);
    const todos = await Usuario.findAll();
    expect(todos.length).toBe(0);
  });

  test('count() retorna contagem correta', async () => {
    const orm = criarORMComUsuario();
    const Usuario = orm.model('Usuario');
    await Usuario.create({ nome: 'E', email: 'e@dev.com', ativo: true });
    await Usuario.create({ nome: 'F', email: 'f@dev.com', ativo: false });
    expect(await Usuario.count()).toBe(2);
    expect(await Usuario.count({ ativo: true })).toBe(1);
  });
});

describe('migrar()', () => {
  test('migrar() pode ser chamado múltiplas vezes sem duplicar dados', async () => {
    const orm = criarORMComUsuario();
    await orm.migrar();
    await orm.migrar();
    const Usuario = orm.model('Usuario');
    await Usuario.create({ nome: 'X', email: 'x@dev.com' });
    const todos = await Usuario.findAll();
    expect(todos.length).toBe(1);
  });
});

describe('transacao()', () => {
  test('transacao() aplica mudanças quando fn não lança erro', async () => {
    const orm = criarORMComUsuario();
    const Usuario = orm.model('Usuario');
    await orm.transacao(async (o) => {
      await o.model('Usuario').create({ nome: 'Trans', email: 't@dev.com' });
    });
    const todos = await Usuario.findAll();
    expect(todos.length).toBe(1);
  });

  test('transacao() faz rollback quando fn lança erro', async () => {
    const orm = criarORMComUsuario();
    const Usuario = orm.model('Usuario');
    await expect(
      orm.transacao(async (o) => {
        await o.model('Usuario').create({ nome: 'Vai reverter', email: 'r@dev.com' });
        throw new Error('Falha na transação');
      })
    ).rejects.toThrow('Falha na transação');
    const todos = await Usuario.findAll();
    expect(todos.length).toBe(0);
  });

  test('transacao() relança o erro original', async () => {
    const orm = criarORMComUsuario();
    await expect(
      orm.transacao(async () => { throw new Error('Erro específico de transação'); })
    ).rejects.toThrow('Erro específico de transação');
  });
});

describe('models independentes', () => {
  test('dois models têm dados isolados entre si', async () => {
    const orm = criarORM();
    orm.define('Produto', { nome: { type: 'string', required: true } });
    orm.define('Categoria', { titulo: { type: 'string', required: true } });
    const Produto = orm.model('Produto');
    const Categoria = orm.model('Categoria');
    await Produto.create({ nome: 'Notebook' });
    await Produto.create({ nome: 'Mouse' });
    await Categoria.create({ titulo: 'Eletrônicos' });
    expect((await Produto.findAll()).length).toBe(2);
    expect((await Categoria.findAll()).length).toBe(1);
  });
});
