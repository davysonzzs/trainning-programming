const Router = require('../roteador');

describe('Router — constructor', () => {
  test('inicia com rotas vazias para todos os métodos HTTP', () => {
    const r = new Router();
    expect(r.rotas).toBeDefined();
    expect(Array.isArray(r.rotas.GET)).toBe(true);
    expect(Array.isArray(r.rotas.POST)).toBe(true);
    expect(Array.isArray(r.rotas.PUT)).toBe(true);
    expect(Array.isArray(r.rotas.DELETE)).toBe(true);
  });
});

describe('Router — registro de rotas', () => {
  test('router.get registra a rota no array GET', () => {
    const r = new Router();
    const handler = (req, res, next) => {};
    r.get('/teste', handler);
    expect(r.rotas.GET.length).toBe(1);
    expect(r.rotas.GET[0].path).toBe('/teste');
  });

  test('router.post registra a rota no array POST', () => {
    const r = new Router();
    r.post('/itens', (req, res, next) => {});
    expect(r.rotas.POST.length).toBe(1);
  });

  test('router.put registra a rota no array PUT', () => {
    const r = new Router();
    r.put('/itens/:id', (req, res, next) => {});
    expect(r.rotas.PUT.length).toBe(1);
  });

  test('router.delete registra a rota no array DELETE', () => {
    const r = new Router();
    r.delete('/itens/:id', (req, res, next) => {});
    expect(r.rotas.DELETE.length).toBe(1);
  });

  test('registra múltiplos handlers para a mesma rota', () => {
    const r = new Router();
    const h1 = (req, res, next) => next();
    const h2 = (req, res, next) => {};
    r.get('/multi', h1, h2);
    expect(r.rotas.GET[0].handlers.length).toBe(2);
  });
});

describe('Router — handle (despacho simples)', () => {
  test('executa o handler correto para GET /ping e retorna res', () => {
    const r = new Router();
    r.get('/ping', (req, res, next) => {
      res.json({ ok: true });
    });
    const res = r.handle('GET', '/ping', { params: {}, headers: {}, query: {} });
    expect(res.body).toEqual({ ok: true });
    expect(res.status).toBe(200);
  });

  test('retorna status 404 quando nenhuma rota é encontrada', () => {
    const r = new Router();
    const res = r.handle('GET', '/inexistente', { params: {}, headers: {}, query: {} });
    expect(res.status).toBe(404);
  });

  test('extrai parâmetros dinâmicos do path', () => {
    const r = new Router();
    let capturado = null;
    r.get('/usuarios/:id', (req, res, next) => {
      capturado = req.params.id;
      res.json({ id: req.params.id });
    });
    r.handle('GET', '/usuarios/42', { params: {}, headers: {}, query: {} });
    expect(capturado).toBe('42');
  });

  test('executa handlers em cadeia com next()', () => {
    const r = new Router();
    const ordem = [];
    r.get('/chain',
      (req, res, next) => { ordem.push(1); next(); },
      (req, res, next) => { ordem.push(2); res.json({ feito: true }); }
    );
    r.handle('GET', '/chain', { params: {}, headers: {}, query: {} });
    expect(ordem).toEqual([1, 2]);
  });

  test('para a chain se handler não chamar next()', () => {
    const r = new Router();
    const ordem = [];
    r.get('/para',
      (req, res, next) => { ordem.push(1); res.json({ parou: true }); },
      (req, res, next) => { ordem.push(2); }
    );
    r.handle('GET', '/para', { params: {}, headers: {}, query: {} });
    expect(ordem).toEqual([1]);
  });
});

describe('Router — objeto res', () => {
  test('res.status(code) retorna res para encadeamento', () => {
    const r = new Router();
    r.get('/status-chain', (req, res, next) => {
      res.status(201).json({ criado: true });
    });
    const res = r.handle('GET', '/status-chain', { params: {}, headers: {}, query: {} });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ criado: true });
  });

  test('res.json seta header Content-Type', () => {
    const r = new Router();
    r.get('/json-header', (req, res, next) => {
      res.json({ dado: 1 });
    });
    const res = r.handle('GET', '/json-header', { params: {}, headers: {}, query: {} });
    expect(res.headers['Content-Type']).toBe('application/json');
  });

  test('res.send seta body como string', () => {
    const r = new Router();
    r.get('/send', (req, res, next) => {
      res.send('texto simples');
    });
    const res = r.handle('GET', '/send', { params: {}, headers: {}, query: {} });
    expect(res.body).toBe('texto simples');
  });
});

describe('Router — middlewares globais (use)', () => {
  test('middleware global é executado antes dos handlers da rota', () => {
    const r = new Router();
    const ordem = [];
    r.use((req, res, next) => { ordem.push('global'); next(); });
    r.get('/rota', (req, res, next) => { ordem.push('handler'); res.json({}); });
    r.handle('GET', '/rota', { params: {}, headers: {}, query: {} });
    expect(ordem[0]).toBe('global');
    expect(ordem[1]).toBe('handler');
  });

  test('middleware global pode modificar req antes do handler', () => {
    const r = new Router();
    r.use((req, res, next) => { req.usuarioId = 99; next(); });
    let idCapturado = null;
    r.get('/me', (req, res, next) => {
      idCapturado = req.usuarioId;
      res.json({ id: idCapturado });
    });
    r.handle('GET', '/me', { params: {}, headers: {}, query: {} });
    expect(idCapturado).toBe(99);
  });

  test('middleware global pode interromper a chain respondendo antes', () => {
    const r = new Router();
    r.use((req, res, next) => { res.status(403).json({ erro: 'Proibido' }); });
    r.get('/protegido', (req, res, next) => { res.json({ dado: 'secreto' }); });
    const res = r.handle('GET', '/protegido', { params: {}, headers: {}, query: {} });
    expect(res.status).toBe(403);
    expect(res.body.erro).toBe('Proibido');
  });
});
