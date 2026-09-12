const {
  criarContador,
  memoizar,
  pipeline,
  agruparPor,
  once,
} = require('../funcional');

describe('criarContador', () => {
  test('inicia com valor padrão 0', () => {
    const c = criarContador();
    expect(c.valor()).toBe(0);
  });

  test('inicia com valor customizado', () => {
    const c = criarContador(10);
    expect(c.valor()).toBe(10);
  });

  test('incrementar aumenta o valor em 1', () => {
    const c = criarContador(5);
    c.incrementar();
    expect(c.valor()).toBe(6);
  });

  test('decrementar diminui o valor em 1', () => {
    const c = criarContador(5);
    c.decrementar();
    expect(c.valor()).toBe(4);
  });

  test('resetar volta ao valor de inicio', () => {
    const c = criarContador(3);
    c.incrementar();
    c.incrementar();
    expect(c.valor()).toBe(5);
    c.resetar();
    expect(c.valor()).toBe(3);
  });

  test('múltiplos contadores são independentes', () => {
    const c1 = criarContador();
    const c2 = criarContador(100);
    c1.incrementar();
    expect(c1.valor()).toBe(1);
    expect(c2.valor()).toBe(100);
  });
});

describe('memoizar', () => {
  test('retorna o mesmo resultado para os mesmos argumentos', () => {
    const fn = jest.fn((x) => x * 2);
    const memoFn = memoizar(fn);
    expect(memoFn(5)).toBe(10);
    expect(memoFn(5)).toBe(10);
  });

  test('executa fn apenas uma vez para os mesmos argumentos', () => {
    const fn = jest.fn((x) => x * 3);
    const memoFn = memoizar(fn);
    memoFn(4);
    memoFn(4);
    memoFn(4);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('executa fn para cada conjunto único de argumentos', () => {
    const fn = jest.fn((x, y) => x + y);
    const memoFn = memoizar(fn);
    memoFn(1, 2);
    memoFn(1, 3);
    memoFn(1, 2);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('pipeline', () => {
  test('aplica funções da esquerda para a direita', () => {
    const resultado = pipeline(
      (x) => x + 1,
      (x) => x * 2
    )(3);
    expect(resultado).toBe(8);
  });

  test('funciona com uma única função', () => {
    const resultado = pipeline((x) => x * 10)(5);
    expect(resultado).toBe(50);
  });

  test('funciona com três funções', () => {
    const resultado = pipeline(
      (x) => x + 2,
      (x) => x * 3,
      (x) => x - 1
    )(0);
    expect(resultado).toBe(5);
  });

  test('funciona com strings', () => {
    const resultado = pipeline(
      (s) => s.trim(),
      (s) => s.toUpperCase()
    )('  devtech  ');
    expect(resultado).toBe('DEVTECH');
  });
});

describe('agruparPor', () => {
  const funcionarios = [
    { nome: 'Ana', departamento: 'TI' },
    { nome: 'Bruno', departamento: 'RH' },
    { nome: 'Carla', departamento: 'TI' },
    { nome: 'Diego', departamento: 'RH' },
    { nome: 'Eva', departamento: 'TI' },
  ];

  test('agrupa itens pela chave informada', () => {
    const resultado = agruparPor(funcionarios, 'departamento');
    expect(resultado['TI']).toHaveLength(3);
    expect(resultado['RH']).toHaveLength(2);
  });

  test('mantém os objetos completos em cada grupo', () => {
    const resultado = agruparPor(funcionarios, 'departamento');
    expect(resultado['TI'][0].nome).toBe('Ana');
  });

  test('funciona com array de um elemento', () => {
    const resultado = agruparPor([{ tipo: 'X', valor: 1 }], 'tipo');
    expect(resultado['X']).toHaveLength(1);
  });
});

describe('once', () => {
  test('executa fn apenas na primeira chamada', () => {
    const fn = jest.fn(() => 42);
    const onceFn = once(fn);
    onceFn();
    onceFn();
    onceFn();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('retorna sempre o resultado da primeira chamada', () => {
    let count = 0;
    const fn = () => ++count;
    const onceFn = once(fn);
    expect(onceFn()).toBe(1);
    expect(onceFn()).toBe(1);
    expect(onceFn()).toBe(1);
  });

  test('passa argumentos corretamente na primeira chamada', () => {
    const fn = jest.fn((a, b) => a + b);
    const onceFn = once(fn);
    expect(onceFn(3, 4)).toBe(7);
    expect(onceFn(10, 20)).toBe(7);
    expect(fn).toHaveBeenCalledWith(3, 4);
  });
});
