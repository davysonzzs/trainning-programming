const { criarFixedWindow, criarSlidingWindow, criarTokenBucket, criarLimiterMiddleware } = require('../limiter');

describe('criarFixedWindow', () => {
  const agora = () => 1000000; // tempo fixo para testes

  test('permite requisicoes dentro do limite', () => {
    const limiter = criarFixedWindow(5, 60);
    const resultado = limiter.verificar('ip-1', agora);
    expect(resultado.permitido).toBe(true);
  });

  test('rastreia restante corretamente', () => {
    const limiter = criarFixedWindow(5, 60);
    limiter.verificar('ip-1', agora);
    limiter.verificar('ip-1', agora);
    const r = limiter.verificar('ip-1', agora);
    expect(r.restante).toBe(2); // 5 - 3 = 2
  });

  test('bloqueia apos atingir limite', () => {
    const limiter = criarFixedWindow(3, 60);
    limiter.verificar('ip-1', agora);
    limiter.verificar('ip-1', agora);
    limiter.verificar('ip-1', agora);
    const r = limiter.verificar('ip-1', agora);
    expect(r.permitido).toBe(false);
    expect(r.restante).toBe(0);
  });

  test('chaves diferentes sao independentes', () => {
    const limiter = criarFixedWindow(2, 60);
    limiter.verificar('ip-1', agora);
    limiter.verificar('ip-1', agora);
    const r = limiter.verificar('ip-2', agora); // ip-2 ainda tem limite
    expect(r.permitido).toBe(true);
  });

  test('reseta na nova janela de tempo', () => {
    const limiter = criarFixedWindow(2, 10); // janela de 10 segundos
    const t0 = () => 0;
    const t1 = () => 11000; // 11 segundos depois (nova janela)
    limiter.verificar('ip-1', t0);
    limiter.verificar('ip-1', t0);
    // nova janela
    const r = limiter.verificar('ip-1', t1);
    expect(r.permitido).toBe(true);
  });

  test('retorna resetEm como timestamp', () => {
    const limiter = criarFixedWindow(5, 60);
    const r = limiter.verificar('ip-1', agora);
    expect(typeof r.resetEm).toBe('number');
    expect(r.resetEm).toBeGreaterThan(agora());
  });
});

describe('criarSlidingWindow', () => {
  test('permite requisicoes dentro do limite', () => {
    const limiter = criarSlidingWindow(5, 60);
    const t = () => 1000000;
    expect(limiter.verificar('ip-1', t).permitido).toBe(true);
  });

  test('bloqueia apos atingir limite na janela', () => {
    const limiter = criarSlidingWindow(3, 60);
    const t = () => 5000;
    limiter.verificar('ip-1', t);
    limiter.verificar('ip-1', t);
    limiter.verificar('ip-1', t);
    expect(limiter.verificar('ip-1', t).permitido).toBe(false);
  });

  test('requisicoes antigas saem da janela', () => {
    const limiter = criarSlidingWindow(3, 10);
    const t0 = () => 0;
    const t1 = () => 11000; // 11s depois — requisicoes de t0 saem da janela de 10s
    limiter.verificar('ip-1', t0);
    limiter.verificar('ip-1', t0);
    limiter.verificar('ip-1', t0);
    // As 3 requisicoes de t0 sairam da janela
    expect(limiter.verificar('ip-1', t1).permitido).toBe(true);
  });

  test('chaves sao independentes', () => {
    const limiter = criarSlidingWindow(2, 60);
    const t = () => 1000;
    limiter.verificar('ip-a', t);
    limiter.verificar('ip-a', t);
    expect(limiter.verificar('ip-b', t).permitido).toBe(true);
  });
});

describe('criarTokenBucket', () => {
  test('permite requisicao quando tem tokens', () => {
    const limiter = criarTokenBucket(10, 1);
    const t = () => 0;
    expect(limiter.verificar('ip-1', 1, t).permitido).toBe(true);
  });

  test('bloqueia quando bucket esta vazio', () => {
    const limiter = criarTokenBucket(2, 1);
    const t = () => 0;
    limiter.verificar('ip-1', 1, t);
    limiter.verificar('ip-1', 1, t);
    expect(limiter.verificar('ip-1', 1, t).permitido).toBe(false);
  });

  test('tokens sao recarregados ao longo do tempo', () => {
    const limiter = criarTokenBucket(5, 2); // 2 tokens/segundo
    const t0 = () => 0;
    const t2 = () => 2000; // 2 segundos depois
    limiter.verificar('ip-1', 5, t0); // gasta todos
    // 2 segundos depois: deve ter 4 tokens (2 * 2)
    const r = limiter.verificar('ip-1', 1, t2);
    expect(r.permitido).toBe(true);
  });

  test('retorna quantidade de tokens atuais', () => {
    const limiter = criarTokenBucket(10, 1);
    const t = () => 0;
    limiter.verificar('ip-1', 3, t);
    const r = limiter.verificar('ip-1', 0, t); // verifica sem gastar
    expect(r.tokens).toBeLessThanOrEqual(10);
  });

  test('nao ultrapassa capacidade maxima na recarga', () => {
    const limiter = criarTokenBucket(5, 10); // recarga rapida
    const t0 = () => 0;
    const t100 = () => 100000; // 100 segundos depois
    limiter.verificar('ip-1', 0, t0);
    const r = limiter.verificar('ip-1', 0, t100);
    expect(r.tokens).toBeLessThanOrEqual(5); // nao pode passar da capacidade
  });
});

describe('criarLimiterMiddleware', () => {
  test('chama next() para requisicao permitida', () => {
    const algoritmo = criarFixedWindow(100, 60);
    const mw = criarLimiterMiddleware(algoritmo, {});
    const req = { headers: { 'x-ip': '127.0.0.1' } };
    const next = jest.fn();
    mw(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('chama next com erro quando limite atingido', () => {
    const algoritmo = criarFixedWindow(1, 60);
    const mw = criarLimiterMiddleware(algoritmo, {});
    const req = { headers: { 'x-ip': '10.0.0.1' } };
    const next = jest.fn();
    mw(req, {}, next); // primeira — passa
    next.mockClear();
    mw(req, {}, next); // segunda — bloqueia
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('usa "anonimo" como chave quando x-ip nao esta presente', () => {
    const algoritmo = criarFixedWindow(100, 60);
    const mw = criarLimiterMiddleware(algoritmo, {});
    const req = { headers: {} };
    const next = jest.fn();
    expect(() => mw(req, {}, next)).not.toThrow();
    expect(next).toHaveBeenCalledWith();
  });
});
