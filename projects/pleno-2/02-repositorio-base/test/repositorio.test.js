const Repositorio = require('../repositorio');

describe('Repositorio — create', () => {
  test('cria registro com id auto-incrementado', async () => {
    const repo = new Repositorio('usuarios');
    const u1 = await repo.create({ nome: 'Ana' });
    const u2 = await repo.create({ nome: 'Bob' });
    expect(u1.id).toBe(1);
    expect(u2.id).toBe(2);
  });

  test('registro criado tem createdAt e updatedAt como ISO strings', async () => {
    const repo = new Repositorio('t');
    const r = await repo.create({ x: 1 });
    expect(typeof r.createdAt).toBe('string');
    expect(typeof r.updatedAt).toBe('string');
    expect(() => new Date(r.createdAt)).not.toThrow();
  });

  test('retorna o registro completo com os dados passados', async () => {
    const repo = new Repositorio('produtos');
    const p = await repo.create({ nome: 'Caneta', preco: 5 });
    expect(p.nome).toBe('Caneta');
    expect(p.preco).toBe(5);
  });
});

describe('Repositorio — findAll', () => {
  test('retorna array vazio quando não há registros', async () => {
    const repo = new Repositorio('t');
    const todos = await repo.findAll();
    expect(todos).toEqual([]);
  });

  test('retorna todos os registros sem filtros', async () => {
    const repo = new Repositorio('t');
    await repo.create({ nome: 'A' });
    await repo.create({ nome: 'B' });
    const todos = await repo.findAll();
    expect(todos.length).toBe(2);
  });

  test('filtra registros por campo', async () => {
    const repo = new Repositorio('usuarios');
    await repo.create({ nome: 'Ana', ativo: true });
    await repo.create({ nome: 'Bob', ativo: false });
    const ativos = await repo.findAll({ ativo: true });
    expect(ativos.length).toBe(1);
    expect(ativos[0].nome).toBe('Ana');
  });

  test('filtra por múltiplos campos (AND implícito)', async () => {
    const repo = new Repositorio('produtos');
    await repo.create({ cat: 'A', ativo: true });
    await repo.create({ cat: 'A', ativo: false });
    await repo.create({ cat: 'B', ativo: true });
    const resultado = await repo.findAll({ cat: 'A', ativo: true });
    expect(resultado.length).toBe(1);
  });
});

describe('Repositorio — findById', () => {
  test('retorna registro existente pelo id', async () => {
    const repo = new Repositorio('t');
    const criado = await repo.create({ valor: 42 });
    const encontrado = await repo.findById(criado.id);
    expect(encontrado.valor).toBe(42);
  });

  test('retorna null quando id não existe', async () => {
    const repo = new Repositorio('t');
    const r = await repo.findById(999);
    expect(r).toBeNull();
  });
});

describe('Repositorio — findOne', () => {
  test('retorna o primeiro registro que bate os filtros', async () => {
    const repo = new Repositorio('t');
    await repo.create({ email: 'a@a.com' });
    await repo.create({ email: 'b@b.com' });
    const r = await repo.findOne({ email: 'b@b.com' });
    expect(r).not.toBeNull();
    expect(r.email).toBe('b@b.com');
  });

  test('retorna null quando nenhum registro bate', async () => {
    const repo = new Repositorio('t');
    const r = await repo.findOne({ email: 'nao@existe.com' });
    expect(r).toBeNull();
  });
});

describe('Repositorio — update', () => {
  test('atualiza campos do registro e retorna atualizado', async () => {
    const repo = new Repositorio('t');
    const criado = await repo.create({ nome: 'Antigo', preco: 10 });
    const atualizado = await repo.update(criado.id, { preco: 20 });
    expect(atualizado.preco).toBe(20);
    expect(atualizado.nome).toBe('Antigo'); // mantém campo não atualizado
  });

  test('atualiza o campo updatedAt', async () => {
    const repo = new Repositorio('t');
    const criado = await repo.create({ x: 1 });
    const antes = criado.updatedAt;
    await new Promise((r) => setTimeout(r, 5));
    const atualizado = await repo.update(criado.id, { x: 2 });
    expect(atualizado.updatedAt).not.toBe(antes);
  });

  test('retorna null quando id não existe', async () => {
    const repo = new Repositorio('t');
    const r = await repo.update(999, { x: 1 });
    expect(r).toBeNull();
  });
});

describe('Repositorio — delete', () => {
  test('retorna true quando registro é deletado', async () => {
    const repo = new Repositorio('t');
    const criado = await repo.create({ x: 1 });
    const resultado = await repo.delete(criado.id);
    expect(resultado).toBe(true);
  });

  test('retorna false quando id não existe', async () => {
    const repo = new Repositorio('t');
    const resultado = await repo.delete(999);
    expect(resultado).toBe(false);
  });

  test('registro não pode ser encontrado após delete', async () => {
    const repo = new Repositorio('t');
    const criado = await repo.create({ x: 1 });
    await repo.delete(criado.id);
    const r = await repo.findById(criado.id);
    expect(r).toBeNull();
  });
});

describe('Repositorio — count', () => {
  test('conta todos os registros sem filtros', async () => {
    const repo = new Repositorio('t');
    await repo.create({ a: 1 });
    await repo.create({ a: 2 });
    expect(await repo.count()).toBe(2);
  });

  test('conta com filtros', async () => {
    const repo = new Repositorio('t');
    await repo.create({ tipo: 'X' });
    await repo.create({ tipo: 'Y' });
    await repo.create({ tipo: 'X' });
    expect(await repo.count({ tipo: 'X' })).toBe(2);
  });
});

describe('Repositorio — bulkCreate', () => {
  test('cria múltiplos registros e retorna todos', async () => {
    const repo = new Repositorio('t');
    const criados = await repo.bulkCreate([{ n: 1 }, { n: 2 }, { n: 3 }]);
    expect(criados.length).toBe(3);
    expect(criados.every((r) => r.id !== undefined)).toBe(true);
  });

  test('todos os registros ficam disponíveis no findAll', async () => {
    const repo = new Repositorio('t');
    await repo.bulkCreate([{ x: 'a' }, { x: 'b' }]);
    const todos = await repo.findAll();
    expect(todos.length).toBe(2);
  });
});
