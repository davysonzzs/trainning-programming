const { codificarBase64, decodificarBase64, assinar, verificar, criarToken, extrairPayload } = require('../jwt');

describe('codificarBase64 / decodificarBase64', () => {
  test('encode e decode sao operacoes inversas', () => {
    const original = 'Hello, DevTech!';
    const encoded = codificarBase64(original);
    expect(decodificarBase64(encoded)).toBe(original);
  });

  test('encode de objeto JSON funciona', () => {
    const obj = JSON.stringify({ alg: 'DevHS256', typ: 'JWT' });
    const encoded = codificarBase64(obj);
    expect(JSON.parse(decodificarBase64(encoded))).toEqual({ alg: 'DevHS256', typ: 'JWT' });
  });

  test('encode produz string diferente do original', () => {
    const original = 'senha123';
    expect(codificarBase64(original)).not.toBe(original);
  });
});

describe('assinar', () => {
  test('retorna string com 3 partes separadas por ponto', () => {
    const token = assinar({ userId: 1 }, 'segredo');
    const partes = token.split('.');
    expect(partes).toHaveLength(3);
  });

  test('segunda parte contem o payload codificado', () => {
    const payload = { userId: 42, papel: 'admin' };
    const token = assinar(payload, 'segredo');
    const partes = token.split('.');
    const payloadDecodificado = JSON.parse(decodificarBase64(partes[1]));
    expect(payloadDecodificado).toMatchObject(payload);
  });

  test('primeira parte contem o header com alg e typ', () => {
    const token = assinar({ x: 1 }, 'seg');
    const partes = token.split('.');
    const header = JSON.parse(decodificarBase64(partes[0]));
    expect(header).toHaveProperty('alg');
    expect(header).toHaveProperty('typ', 'JWT');
  });

  test('mesmo payload e segredo geram mesmo token (deterministico)', () => {
    const payload = { userId: 1 };
    const t1 = assinar(payload, 'segredo');
    const t2 = assinar(payload, 'segredo');
    expect(t1).toBe(t2);
  });

  test('segredos diferentes geram tokens diferentes', () => {
    const payload = { userId: 1 };
    const t1 = assinar(payload, 'segredo1');
    const t2 = assinar(payload, 'segredo2');
    expect(t1).not.toBe(t2);
  });
});

describe('verificar', () => {
  test('retorna payload para token valido', () => {
    const payload = { userId: 7, nome: 'Ana' };
    const token = assinar(payload, 'meu-segredo');
    const resultado = verificar(token, 'meu-segredo');
    expect(resultado).toMatchObject(payload);
  });

  test('lanca erro para assinatura invalida', () => {
    const token = assinar({ userId: 1 }, 'segredo-correto');
    expect(() => verificar(token, 'segredo-errado')).toThrow('Token invalido');
  });

  test('lanca erro para token adulterado', () => {
    const token = assinar({ userId: 1, papel: 'usuario' }, 'segredo');
    const partes = token.split('.');
    // Adultera o payload trocando o papel para admin
    const payloadAdulterado = codificarBase64(JSON.stringify({ userId: 1, papel: 'admin' }));
    const tokenAdulterado = `${partes[0]}.${payloadAdulterado}.${partes[2]}`;
    expect(() => verificar(tokenAdulterado, 'segredo')).toThrow('Token invalido');
  });

  test('lanca erro para token expirado', () => {
    const expPassado = Math.floor(Date.now() / 1000) - 3600; // 1 hora atras
    const token = assinar({ userId: 1, exp: expPassado }, 'segredo');
    expect(() => verificar(token, 'segredo')).toThrow('Token expirado');
  });

  test('nao lanca erro para token sem exp (sem expiracao)', () => {
    const token = assinar({ userId: 1 }, 'segredo');
    expect(() => verificar(token, 'segredo')).not.toThrow();
  });
});

describe('criarToken', () => {
  test('inclui iat no payload', () => {
    const token = criarToken({ userId: 1 }, 'segredo');
    const payload = extrairPayload(token);
    expect(payload).toHaveProperty('iat');
    expect(typeof payload.iat).toBe('number');
  });

  test('inclui exp no payload', () => {
    const token = criarToken({ userId: 1 }, 'segredo');
    const payload = extrairPayload(token);
    expect(payload).toHaveProperty('exp');
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });

  test('expiracao padrao e 3600 segundos', () => {
    const antes = Math.floor(Date.now() / 1000);
    const token = criarToken({ userId: 1 }, 'segredo');
    const payload = extrairPayload(token);
    expect(payload.exp - payload.iat).toBe(3600);
  });

  test('respeita expiracao customizada', () => {
    const token = criarToken({ userId: 1 }, 'segredo', 60);
    const payload = extrairPayload(token);
    expect(payload.exp - payload.iat).toBe(60);
  });

  test('token criado com criarToken pode ser verificado', () => {
    const token = criarToken({ userId: 5, papel: 'admin' }, 'segredo');
    const payload = verificar(token, 'segredo');
    expect(payload.userId).toBe(5);
    expect(payload.papel).toBe('admin');
  });
});

describe('extrairPayload', () => {
  test('extrai payload sem verificar assinatura', () => {
    const payload = { userId: 99, dado: 'qualquer' };
    const token = assinar(payload, 'qualquer-segredo');
    const extraido = extrairPayload(token);
    expect(extraido).toMatchObject(payload);
  });

  test('funciona mesmo com segredo errado (nao valida)', () => {
    const token = assinar({ x: 1 }, 'segredo');
    // nao deve lancar erro mesmo que passassemos segredo errado
    expect(() => extrairPayload(token)).not.toThrow();
  });
});
