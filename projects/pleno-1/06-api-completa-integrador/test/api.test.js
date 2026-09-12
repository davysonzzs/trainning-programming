const { criarAPI } = require('../api');

describe('criarAPI — estrutura', () => {
  test('retorna objeto com router e request', () => {
    const api = criarAPI();
    expect(api).toBeDefined();
    expect(typeof api.request).toBe('function');
    expect(api.router).toBeDefined();
  });
});

describe('GET /health', () => {
  test('retorna status 200 e { status: ok }', () => {
    const api = criarAPI();
    const res = api.request('GET', '/health', {});
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('POST /produtos — validação', () => {
  test('retorna 400 quando nome está ausente', () => {
    const api = criarAPI();
    const res = api.request('POST', '/produtos', {
      body: { preco: 100, estoque: 5 },
    });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBeTruthy();
  });

  test('retorna 400 quando preco é inválido', () => {
    const api = criarAPI();
    const res = api.request('POST', '/produtos', {
      body: { nome: 'X', preco: -10, estoque: 5 },
    });
    expect(res.status).toBe(400);
  });

  test('cria produto com dados válidos e retorna 201', () => {
    const api = criarAPI();
    const res = api.request('POST', '/produtos', {
      body: { nome: 'Notebook', preco: 3000, estoque: 10 },
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.nome).toBe('Notebook');
  });
});

describe('GET /produtos', () => {
  test('retorna 200 com array (vazio inicialmente)', () => {
    const api = criarAPI();
    const res = api.request('GET', '/produtos', {});
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('retorna produtos criados anteriormente', () => {
    const api = criarAPI();
    api.request('POST', '/produtos', { body: { nome: 'Mesa', preco: 500, estoque: 3 } });
    api.request('POST', '/produtos', { body: { nome: 'Cadeira', preco: 200, estoque: 8 } });
    const res = api.request('GET', '/produtos', {});
    expect(res.body.length).toBe(2);
  });
});

describe('GET /produtos/:id', () => {
  test('retorna 200 com produto existente', () => {
    const api = criarAPI();
    const criado = api.request('POST', '/produtos', {
      body: { nome: 'Teclado', preco: 150, estoque: 20 },
    });
    const id = criado.body.id;
    const res = api.request('GET', `/produtos/${id}`, { params: { id: String(id) } });
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Teclado');
  });

  test('retorna 404 para id inexistente', () => {
    const api = criarAPI();
    const res = api.request('GET', '/produtos/9999', { params: { id: '9999' } });
    expect(res.status).toBe(404);
  });
});

describe('PUT /produtos/:id', () => {
  test('atualiza produto existente e retorna 200', () => {
    const api = criarAPI();
    const criado = api.request('POST', '/produtos', {
      body: { nome: 'Monitor', preco: 1200, estoque: 5 },
    });
    const id = criado.body.id;
    const res = api.request('PUT', `/produtos/${id}`, {
      params: { id: String(id) },
      body: { preco: 1100 },
    });
    expect(res.status).toBe(200);
  });

  test('retorna 404 para id inexistente', () => {
    const api = criarAPI();
    const res = api.request('PUT', '/produtos/8888', {
      params: { id: '8888' },
      body: { preco: 50 },
    });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /produtos/:id', () => {
  test('deleta produto existente e retorna 204', () => {
    const api = criarAPI();
    const criado = api.request('POST', '/produtos', {
      body: { nome: 'Impressora', preco: 800, estoque: 2 },
    });
    const id = criado.body.id;
    const res = api.request('DELETE', `/produtos/${id}`, { params: { id: String(id) } });
    expect(res.status).toBe(204);
  });

  test('retorna 404 ao deletar id inexistente', () => {
    const api = criarAPI();
    const res = api.request('DELETE', '/produtos/7777', { params: { id: '7777' } });
    expect(res.status).toBe(404);
  });
});

describe('Middleware — logger', () => {
  test('req tem logId após passar pelo logger', () => {
    const api = criarAPI();
    let logIdCapturado = null;
    // Registra rota extra para inspecionar req
    api.router.get('/check-logger', (req, res, next) => {
      logIdCapturado = req.logId;
      res.json({ ok: true });
    });
    api.request('GET', '/check-logger', {});
    expect(logIdCapturado).toBeTruthy();
  });
});
