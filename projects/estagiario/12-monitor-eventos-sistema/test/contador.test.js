const { contarAteLimite, fatorial, processarFila } = require('../contador');

describe('contarAteLimite', () => {
  test('conta de 1 a 4', () => expect(contarAteLimite(4)).toEqual([1, 2, 3, 4]));
  test('limite zero retorna vazio', () => expect(contarAteLimite(0)).toEqual([]));
  test('limite negativo retorna vazio', () => expect(contarAteLimite(-3)).toEqual([]));
});

describe('fatorial', () => {
  test('fatorial de 5', () => expect(fatorial(5)).toBe(120));
  test('fatorial de 0 e 1', () => expect(fatorial(0)).toBe(1));
  test('fatorial de 1', () => expect(fatorial(1)).toBe(1));
});

describe('processarFila', () => {
  test('marca cada item como processado', () => {
    expect(processarFila(['a', 'b'])).toEqual(['processado: a', 'processado: b']);
  });
  test('fila vazia retorna vazio', () => {
    expect(processarFila([])).toEqual([]);
  });
});
