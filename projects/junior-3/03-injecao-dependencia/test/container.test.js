const { Container, criarEscopo } = require('../container');

describe('Container — register e resolve', () => {
  test('deve resolver valor registrado via factory', () => {
    const c = new Container();
    c.register('saudacao', () => 'Olá!');
    expect(c.resolve('saudacao')).toBe('Olá!');
  });

  test('deve lançar erro para dependência não registrada', () => {
    const c = new Container();
    expect(() => c.resolve('naoExiste')).toThrow('Dependência não registrada: naoExiste');
  });

  test('singleton deve retornar mesma instância', () => {
    const c = new Container();
    c.register('obj', () => ({ id: Math.random() }), true);
    const a = c.resolve('obj');
    const b = c.resolve('obj');
    expect(a).toBe(b);
  });

  test('não-singleton deve retornar nova instância a cada resolve', () => {
    const c = new Container();
    c.register('obj', () => ({ id: Math.random() }), false);
    const a = c.resolve('obj');
    const b = c.resolve('obj');
    expect(a).not.toBe(b);
  });

  test('factory recebe o container como argumento', () => {
    const c = new Container();
    c.registerValue('config', { url: 'http://api.local' });
    c.register('cliente', (container) => ({
      url: container.resolve('config').url,
    }));
    expect(c.resolve('cliente').url).toBe('http://api.local');
  });
});

describe('Container — registerValue', () => {
  test('deve registrar valor direto', () => {
    const c = new Container();
    c.registerValue('versao', '1.0.0');
    expect(c.resolve('versao')).toBe('1.0.0');
  });

  test('deve registrar objeto como valor', () => {
    const c = new Container();
    const config = { debug: true };
    c.registerValue('config', config);
    expect(c.resolve('config')).toBe(config);
  });
});

describe('Container — has', () => {
  test('deve retornar true para nome registrado', () => {
    const c = new Container();
    c.registerValue('x', 1);
    expect(c.has('x')).toBe(true);
  });

  test('deve retornar false para nome não registrado', () => {
    const c = new Container();
    expect(c.has('naoExiste')).toBe(false);
  });
});

describe('Container — reset', () => {
  test('deve limpar instâncias mas manter registros', () => {
    const c = new Container();
    let chamadas = 0;
    c.register('servico', () => { chamadas++; return {}; });
    c.resolve('servico'); // cria instância
    c.reset();
    c.resolve('servico'); // deve criar nova instância
    expect(chamadas).toBe(2);
  });
});

describe('criarEscopo', () => {
  test('deve herdar registros do pai', () => {
    const pai = new Container();
    pai.registerValue('db', { tipo: 'postgres' });
    const filho = criarEscopo(pai);
    expect(filho.resolve('db')).toEqual({ tipo: 'postgres' });
  });

  test('instâncias do filho devem ser isoladas do pai', () => {
    const pai = new Container();
    let contador = 0;
    pai.register('servico', () => ({ id: ++contador }));
    const filho = criarEscopo(pai);
    const instPai = pai.resolve('servico');
    const instFilho = filho.resolve('servico');
    expect(instPai).not.toBe(instFilho);
  });

  test('filho pode sobrescrever registro do pai', () => {
    const pai = new Container();
    pai.registerValue('env', 'producao');
    const filho = criarEscopo(pai);
    filho.registerValue('env', 'teste');
    expect(filho.resolve('env')).toBe('teste');
    expect(pai.resolve('env')).toBe('producao');
  });
});
