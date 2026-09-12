const {
  logger,
  validarBody,
  autenticar,
  rateLimiter,
  composarMiddlewares,
} = require('../middlewares');

// Helper para criar mock de res
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

describe('logger()', () => {
  test('adiciona logId ao req', () => {
    const mw = logger();
    const req = { headers: {} };
    const res = criarRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(typeof req.logId).toBe('string');
    expect(req.logId.length).toBeGreaterThan(0);
  });

  test('adiciona startTime ao req', () => {
    const mw = logger();
    const req = { headers: {} };
    const res = criarRes();
    const next = jest.fn();
    const antes = Date.now();
    mw(req, res, next);
    expect(req.startTime).toBeGreaterThanOrEqual(antes);
  });

  test('sempre chama next()', () => {
    const mw = logger();
    const req = { headers: {} };
    const res = criarRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('validarBody(schema)', () => {
  const schema = {
    nome: { required: true, type: 'string', minLength: 3 },
    idade: { required: true, type: 'number' },
  };

  test('chama next() quando body é válido', () => {
    const mw = validarBody(schema);
    const req = { body: { nome: 'Ana', idade: 25 } };
    const res = criarRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('retorna 400 quando campo required está ausente', () => {
    const mw = validarBody(schema);
    const req = { body: { nome: 'Ana' } };
    const res = criarRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res._status).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('retorna 400 quando tipo do campo é incorreto', () => {
    const mw = validarBody(schema);
    const req = { body: { nome: 'Ana', idade: 'vinte' } };
    const res = criarRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res._status).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('retorna 400 quando minLength não é atendido', () => {
    const mw = validarBody(schema);
    const req = { body: { nome: 'Al', idade: 20 } };
    const res = criarRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res._status).toBe(400);
    expect(res._body.erro).toBeTruthy();
    expect(next).not.toHaveBeenCalled();
  });
});

describe('autenticar(tokensValidos)', () => {
  const tokens = ['token-abc', 'token-xyz'];

  test('chama next() e adiciona req.usuario com token válido', () => {
    const mw = autenticar(tokens);
    const req = { headers: { authorization: 'Bearer token-abc' } };
    const res = criarRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.usuario).toEqual({ token: 'token-abc' });
  });

  test('retorna 401 com token inválido', () => {
    const mw = autenticar(tokens);
    const req = { headers: { authorization: 'Bearer token-invalido' } };
    const res = criarRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res._status).toBe(401);
    expect(res._body.erro).toBe('Não autorizado');
    expect(next).not.toHaveBeenCalled();
  });

  test('retorna 401 quando header authorization está ausente', () => {
    const mw = autenticar(tokens);
    const req = { headers: {} };
    const res = criarRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res._status).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('retorna 401 quando formato não é Bearer', () => {
    const mw = autenticar(tokens);
    const req = { headers: { authorization: 'Basic token-abc' } };
    const res = criarRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res._status).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('rateLimiter(maxReqs, janelaSeg)', () => {
  test('permite requisições abaixo do limite', () => {
    const mw = rateLimiter(3, 60);
    const req = { headers: { 'x-ip': '10.0.0.1' } };
    const res = criarRes();
    const next = jest.fn();
    mw(req, criarRes(), jest.fn());
    mw(req, criarRes(), jest.fn());
    mw(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('bloqueia com 429 quando limite é excedido', () => {
    const mw = rateLimiter(2, 60);
    const req = { headers: { 'x-ip': '10.0.0.2' } };
    mw(req, criarRes(), jest.fn());
    mw(req, criarRes(), jest.fn());
    const res = criarRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res._status).toBe(429);
    expect(next).not.toHaveBeenCalled();
  });

  test('IPs diferentes têm contadores independentes', () => {
    const mw = rateLimiter(1, 60);
    const reqA = { headers: { 'x-ip': '1.1.1.1' } };
    const reqB = { headers: { 'x-ip': '2.2.2.2' } };
    mw(reqA, criarRes(), jest.fn());
    const next = jest.fn();
    mw(reqB, criarRes(), next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('composarMiddlewares(...middlewares)', () => {
  test('executa todos os middlewares em sequência', () => {
    const ordem = [];
    const m1 = (req, res, next) => { ordem.push(1); next(); };
    const m2 = (req, res, next) => { ordem.push(2); next(); };
    const m3 = (req, res, next) => { ordem.push(3); next(); };
    const composto = composarMiddlewares(m1, m2, m3);
    const next = jest.fn();
    composto({}, criarRes(), next);
    expect(ordem).toEqual([1, 2, 3]);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('para a execução se um middleware não chamar next()', () => {
    const ordem = [];
    const m1 = (req, res, next) => { ordem.push(1); next(); };
    const m2 = (req, res, next) => { ordem.push(2); /* não chama next */ };
    const m3 = (req, res, next) => { ordem.push(3); next(); };
    const composto = composarMiddlewares(m1, m2, m3);
    const next = jest.fn();
    composto({}, criarRes(), next);
    expect(ordem).toEqual([1, 2]);
    expect(next).not.toHaveBeenCalled();
  });
});
