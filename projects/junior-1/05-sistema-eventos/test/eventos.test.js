const { EmissorEventos } = require('../eventos');

// ─── on e emit ───────────────────────────────────────────────────────────────

describe('on e emit', () => {
  test('callback é chamado quando evento é emitido', () => {
    const emissor = new EmissorEventos();
    const fn = jest.fn();
    emissor.on('login', fn);
    emissor.emit('login');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('callback recebe os dados passados no emit', () => {
    const emissor = new EmissorEventos();
    const fn = jest.fn();
    emissor.on('compra', fn);
    emissor.emit('compra', { produto: 'Camisa', valor: 49.9 });
    expect(fn).toHaveBeenCalledWith({ produto: 'Camisa', valor: 49.9 });
  });

  test('múltiplos callbacks são chamados na ordem de registro', () => {
    const emissor = new EmissorEventos();
    const ordem = [];
    emissor.on('tick', () => ordem.push(1));
    emissor.on('tick', () => ordem.push(2));
    emissor.on('tick', () => ordem.push(3));
    emissor.emit('tick');
    expect(ordem).toEqual([1, 2, 3]);
  });

  test('emit retorna número de callbacks chamados', () => {
    const emissor = new EmissorEventos();
    emissor.on('ev', jest.fn());
    emissor.on('ev', jest.fn());
    expect(emissor.emit('ev')).toBe(2);
  });

  test('emit retorna 0 para evento sem ouvintes', () => {
    const emissor = new EmissorEventos();
    expect(emissor.emit('semOuvintes')).toBe(0);
  });

  test('emit passa múltiplos argumentos para o callback', () => {
    const emissor = new EmissorEventos();
    const fn = jest.fn();
    emissor.on('dados', fn);
    emissor.emit('dados', 'a', 'b', 'c');
    expect(fn).toHaveBeenCalledWith('a', 'b', 'c');
  });
});

// ─── off ─────────────────────────────────────────────────────────────────────

describe('off', () => {
  test('remove callback e para de chamá-lo no emit', () => {
    const emissor = new EmissorEventos();
    const fn = jest.fn();
    emissor.on('click', fn);
    emissor.off('click', fn);
    emissor.emit('click');
    expect(fn).not.toHaveBeenCalled();
  });

  test('retorna true ao remover callback existente', () => {
    const emissor = new EmissorEventos();
    const fn = jest.fn();
    emissor.on('ev', fn);
    expect(emissor.off('ev', fn)).toBe(true);
  });

  test('retorna false para callback não registrado', () => {
    const emissor = new EmissorEventos();
    expect(emissor.off('ev', jest.fn())).toBe(false);
  });

  test('retorna false para evento inexistente', () => {
    const emissor = new EmissorEventos();
    expect(emissor.off('fantasma', jest.fn())).toBe(false);
  });

  test('remove apenas o callback especificado, mantendo outros', () => {
    const emissor = new EmissorEventos();
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    emissor.on('ev', fn1);
    emissor.on('ev', fn2);
    emissor.off('ev', fn1);
    emissor.emit('ev');
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
  });
});

// ─── once ────────────────────────────────────────────────────────────────────

describe('once', () => {
  test('callback é chamado na primeira emissão', () => {
    const emissor = new EmissorEventos();
    const fn = jest.fn();
    emissor.once('inicio', fn);
    emissor.emit('inicio');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('callback NÃO é chamado na segunda emissão', () => {
    const emissor = new EmissorEventos();
    const fn = jest.fn();
    emissor.once('inicio', fn);
    emissor.emit('inicio');
    emissor.emit('inicio');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('callback once recebe os dados do emit', () => {
    const emissor = new EmissorEventos();
    const fn = jest.fn();
    emissor.once('sinal', fn);
    emissor.emit('sinal', 42);
    expect(fn).toHaveBeenCalledWith(42);
  });

  test('once e on coexistem no mesmo evento', () => {
    const emissor = new EmissorEventos();
    const fnOnce = jest.fn();
    const fnOn = jest.fn();
    emissor.once('ev', fnOnce);
    emissor.on('ev', fnOn);
    emissor.emit('ev');
    emissor.emit('ev');
    expect(fnOnce).toHaveBeenCalledTimes(1);
    expect(fnOn).toHaveBeenCalledTimes(2);
  });
});

// ─── listarEventos ───────────────────────────────────────────────────────────

describe('listarEventos', () => {
  test('retorna array vazio quando não há eventos', () => {
    const emissor = new EmissorEventos();
    expect(emissor.listarEventos()).toEqual([]);
  });

  test('lista eventos com ouvintes registrados', () => {
    const emissor = new EmissorEventos();
    emissor.on('login', jest.fn());
    emissor.on('logout', jest.fn());
    const lista = emissor.listarEventos();
    expect(lista).toContain('login');
    expect(lista).toContain('logout');
    expect(lista).toHaveLength(2);
  });

  test('não lista evento após remover todos os ouvintes', () => {
    const emissor = new EmissorEventos();
    const fn = jest.fn();
    emissor.on('temporario', fn);
    emissor.off('temporario', fn);
    expect(emissor.listarEventos()).not.toContain('temporario');
  });
});
