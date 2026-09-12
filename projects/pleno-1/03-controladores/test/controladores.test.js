const { criarControladorCRUD, tratarErros } = require('../controladores');

// Mock de res reutilizável
function criarRes() {
  const res = {
    _status: 200,
    _body: null,
    status(code) { this._status = code; return this; },
    json(dados) { this._body = dados; return this; },
    send(texto) { this._body = texto; return this; },
  };
  return res;
}

// Mock de repositório
function criarRepoPadrao(overrides = {}) {
  return {
    findAll: jest.fn().mockResolvedValue([{ id: 1, nome: 'Item A' }]),
    findById: jest.fn().mockResolvedValue({ id: 1, nome: 'Item A' }),
    create: jest.fn().mockResolvedValue({ id: 2, nome: 'Novo' }),
    update: jest.fn().mockResolvedValue({ id: 1, nome: 'Atualizado' }),
    delete: jest.fn().mockResolvedValue(true),
    ...overrides,
  };
}

describe('listar', () => {
  test('retorna 200 com array de itens', async () => {
    const repo = criarRepoPadrao();
    const ctrl = criarControladorCRUD(repo);
    const res = criarRes();
    await ctrl.listar({ params: {}, query: {} }, res);
    expect(res._status).toBe(200);
    expect(Array.isArray(res._body)).toBe(true);
    expect(res._body.length).toBe(1);
  });

  test('chama repositorio.findAll()', async () => {
    const repo = criarRepoPadrao();
    const ctrl = criarControladorCRUD(repo);
    await ctrl.listar({ params: {}, query: {} }, criarRes());
    expect(repo.findAll).toHaveBeenCalledTimes(1);
  });
});

describe('buscarPorId', () => {
  test('retorna 200 com o item quando encontrado', async () => {
    const repo = criarRepoPadrao();
    const ctrl = criarControladorCRUD(repo);
    const res = criarRes();
    await ctrl.buscarPorId({ params: { id: '1' } }, res);
    expect(res._status).toBe(200);
    expect(res._body.id).toBe(1);
  });

  test('retorna 404 quando findById retorna null', async () => {
    const repo = criarRepoPadrao({ findById: jest.fn().mockResolvedValue(null) });
    const ctrl = criarControladorCRUD(repo);
    const res = criarRes();
    await ctrl.buscarPorId({ params: { id: '99' } }, res);
    expect(res._status).toBe(404);
    expect(res._body.erro).toBeTruthy();
  });

  test('passa o id correto para findById', async () => {
    const repo = criarRepoPadrao();
    const ctrl = criarControladorCRUD(repo);
    await ctrl.buscarPorId({ params: { id: '42' } }, criarRes());
    expect(repo.findById).toHaveBeenCalledWith('42');
  });
});

describe('criar', () => {
  test('retorna 201 com o item criado', async () => {
    const repo = criarRepoPadrao();
    const ctrl = criarControladorCRUD(repo);
    const res = criarRes();
    await ctrl.criar({ body: { nome: 'Novo' } }, res);
    expect(res._status).toBe(201);
    expect(res._body.id).toBe(2);
  });

  test('passa o body para repositorio.create()', async () => {
    const repo = criarRepoPadrao();
    const ctrl = criarControladorCRUD(repo);
    const body = { nome: 'Produto X', preco: 99 };
    await ctrl.criar({ body }, criarRes());
    expect(repo.create).toHaveBeenCalledWith(body);
  });
});

describe('atualizar', () => {
  test('retorna 200 com item atualizado', async () => {
    const repo = criarRepoPadrao();
    const ctrl = criarControladorCRUD(repo);
    const res = criarRes();
    await ctrl.atualizar({ params: { id: '1' }, body: { nome: 'Novo Nome' } }, res);
    expect(res._status).toBe(200);
    expect(res._body.nome).toBe('Atualizado');
  });

  test('retorna 404 quando update retorna null', async () => {
    const repo = criarRepoPadrao({ update: jest.fn().mockResolvedValue(null) });
    const ctrl = criarControladorCRUD(repo);
    const res = criarRes();
    await ctrl.atualizar({ params: { id: '99' }, body: {} }, res);
    expect(res._status).toBe(404);
  });
});

describe('deletar', () => {
  test('retorna 204 quando deletado com sucesso', async () => {
    const repo = criarRepoPadrao();
    const ctrl = criarControladorCRUD(repo);
    const res = criarRes();
    await ctrl.deletar({ params: { id: '1' } }, res);
    expect(res._status).toBe(204);
  });

  test('retorna 404 quando delete retorna false', async () => {
    const repo = criarRepoPadrao({ delete: jest.fn().mockResolvedValue(false) });
    const ctrl = criarControladorCRUD(repo);
    const res = criarRes();
    await ctrl.deletar({ params: { id: '99' } }, res);
    expect(res._status).toBe(404);
  });
});

describe('tratarErros', () => {
  test('executa fn normalmente quando não há erro', async () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const wrapped = tratarErros(fn);
    const res = criarRes();
    await wrapped({ params: {} }, res);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(res._status).toBe(200);
  });

  test('captura erro e retorna status 500', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('Falha interna'));
    const wrapped = tratarErros(fn);
    const res = criarRes();
    await wrapped({ params: {} }, res);
    expect(res._status).toBe(500);
    expect(res._body.erro).toBe('Falha interna');
  });

  test('não propaga a exceção para o chamador', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('Erro'));
    const wrapped = tratarErros(fn);
    await expect(wrapped({ params: {} }, criarRes())).resolves.not.toThrow();
  });
});
