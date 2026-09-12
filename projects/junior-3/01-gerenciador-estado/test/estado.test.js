const { criarEstado, Atom } = require('../estado');

// criarEstado retorna [getState, setState, subscribe]
// onde setState(valor | fn) e subscribe(fn) => unsubscribe

describe('criarEstado', () => {
  test('deve retornar getState que devolve o estado inicial', () => {
    const [getState] = criarEstado(42);
    expect(getState()).toBe(42);
  });

  test('setState com valor direto deve atualizar o estado', () => {
    const [getState, setState] = criarEstado(0);
    setState(99);
    expect(getState()).toBe(99);
  });

  test('setState com função deve usar estado atual', () => {
    const [getState, setState] = criarEstado(10);
    setState(prev => prev + 5);
    expect(getState()).toBe(15);
  });

  test('setState com função encadeada deve acumular', () => {
    const [getState, setState] = criarEstado([]);
    setState(prev => [...prev, 1]);
    setState(prev => [...prev, 2]);
    expect(getState()).toEqual([1, 2]);
  });

  test('subscribe deve ser notificado com (novoEstado, estadoAnterior)', () => {
    const [getState, setState, subscribe] = criarEstado(0);
    const listener = jest.fn();
    subscribe(listener);
    setState(7);
    expect(listener).toHaveBeenCalledWith(7, 0);
  });

  test('unsubscribe deve parar as notificações', () => {
    const [, setState, subscribe] = criarEstado(0);
    const listener = jest.fn();
    const unsub = subscribe(listener);
    unsub();
    setState(5);
    expect(listener).not.toHaveBeenCalled();
  });

  test('múltiplos subscribers devem ser notificados', () => {
    const [, setState, subscribe] = criarEstado('a');
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    subscribe(fn1);
    subscribe(fn2);
    setState('b');
    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
  });

  test('estado inicial pode ser objeto', () => {
    const [getState] = criarEstado({ nome: 'Ana', ativo: true });
    expect(getState()).toEqual({ nome: 'Ana', ativo: true });
  });
});

describe('Atom', () => {
  test('deve inicializar com o valor fornecido', () => {
    const a = new Atom(10);
    expect(a.get()).toBe(10);
  });

  test('set deve atualizar o valor', () => {
    const a = new Atom(0);
    a.set(5);
    expect(a.get()).toBe(5);
  });

  test('set com função deve atualizar com base no valor atual', () => {
    const a = new Atom(3);
    a.set(v => v * 2);
    expect(a.get()).toBe(6);
  });

  test('subscribe deve ser notificado com (novoValor, valorAnterior)', () => {
    const a = new Atom(0);
    const listener = jest.fn();
    a.subscribe(listener);
    a.set(1);
    expect(listener).toHaveBeenCalledWith(1, 0);
  });

  test('unsubscribe deve remover o listener', () => {
    const a = new Atom(0);
    const listener = jest.fn();
    const unsub = a.subscribe(listener);
    unsub();
    a.set(1);
    expect(listener).not.toHaveBeenCalled();
  });

  test('derive deve criar atom com valor calculado', () => {
    const a = new Atom(5);
    const dobro = a.derive(v => v * 2);
    expect(dobro.get()).toBe(10);
  });

  test('atom derivado deve se atualizar quando o original muda', () => {
    const a = new Atom(5);
    const dobro = a.derive(v => v * 2);
    a.set(10);
    expect(dobro.get()).toBe(20);
  });

  test('múltiplos subscribers devem ser todos notificados', () => {
    const a = new Atom('inicio');
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    a.subscribe(fn1);
    a.subscribe(fn2);
    a.set('fim');
    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
  });

  test('derive encadeado deve propagar mudanças', () => {
    const a = new Atom(2);
    const quad = a.derive(v => v * v);
    const negQuad = quad.derive(v => -v);
    a.set(3);
    expect(quad.get()).toBe(9);
    expect(negQuad.get()).toBe(-9);
  });
});
