const { Roteador } = require('../roteador');

describe('Roteador — rota simples', () => {
  test('deve chamar handler para rota exata', () => {
    const r = new Roteador();
    r.rota('/home', () => 'bem-vindo');
    expect(r.navegar('/home')).toBe('bem-vindo');
  });

  test('deve passar contexto ao handler', () => {
    const r = new Roteador();
    r.rota('/home', (ctx) => ctx.caminho);
    expect(r.navegar('/home')).toBe('/home');
  });

  test('deve lançar erro para rota não encontrada', () => {
    const r = new Roteador();
    expect(() => r.navegar('/inexistente')).toThrow('Rota não encontrada');
  });
});

describe('Roteador — parâmetros dinâmicos', () => {
  test('deve extrair parâmetro único', () => {
    const r = new Roteador();
    r.rota('/usuario/:id', (ctx) => ctx.params.id);
    expect(r.navegar('/usuario/42')).toBe('42');
  });

  test('deve extrair múltiplos parâmetros', () => {
    const r = new Roteador();
    r.rota('/item/:categoria/:id', (ctx) => ctx.params);
    const params = r.navegar('/item/eletronicos/99');
    expect(params.categoria).toBe('eletronicos');
    expect(params.id).toBe('99');
  });

  test('deve passar dados extras pelo contexto', () => {
    const r = new Roteador();
    r.rota('/ping', (ctx) => ctx.dados.token);
    expect(r.navegar('/ping', { token: 'abc123' })).toBe('abc123');
  });
});

describe('Roteador — listarRotas', () => {
  test('deve retornar array com os padrões registrados', () => {
    const r = new Roteador();
    r.rota('/home', () => {});
    r.rota('/usuario/:id', () => {});
    const rotas = r.listarRotas();
    expect(rotas).toContain('/home');
    expect(rotas).toContain('/usuario/:id');
  });

  test('deve retornar array vazio se nenhuma rota registrada', () => {
    const r = new Roteador();
    expect(r.listarRotas()).toEqual([]);
  });
});

describe('Roteador — middlewares', () => {
  test('middleware deve ser executado antes do handler', () => {
    const r = new Roteador();
    const ordem = [];
    r.use((ctx, next) => { ordem.push('middleware'); next(); });
    r.rota('/test', () => { ordem.push('handler'); return 'ok'; });
    r.navegar('/test');
    expect(ordem).toEqual(['middleware', 'handler']);
  });

  test('múltiplos middlewares devem ser executados em ordem', () => {
    const r = new Roteador();
    const ordem = [];
    r.use((ctx, next) => { ordem.push(1); next(); });
    r.use((ctx, next) => { ordem.push(2); next(); });
    r.rota('/test', () => { ordem.push(3); return 'ok'; });
    r.navegar('/test');
    expect(ordem).toEqual([1, 2, 3]);
  });

  test('middleware pode interromper a cadeia não chamando proximo', () => {
    const r = new Roteador();
    const handler = jest.fn(() => 'ok');
    r.use((ctx, next) => { /* não chama next() */ });
    r.rota('/test', handler);
    r.navegar('/test');
    expect(handler).not.toHaveBeenCalled();
  });

  test('middleware pode modificar o contexto', () => {
    const r = new Roteador();
    r.use((ctx, next) => { ctx.usuario = 'admin'; next(); });
    r.rota('/perfil', (ctx) => ctx.usuario);
    expect(r.navegar('/perfil')).toBe('admin');
  });
});
