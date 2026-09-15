const { fibonacciRecursivo, sequenciaFibonacci } = require('../fibonacci');

describe('fibonacciRecursivo', () => {
  test.each([[0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]])(
    'posicao %i -> %i', (posicao, esperado) => expect(fibonacciRecursivo(posicao)).toBe(esperado)
  );
});

describe('sequenciaFibonacci', () => {
  test('gera os 6 primeiros valores', () => {
    expect(sequenciaFibonacci(6)).toEqual([0, 1, 1, 2, 3, 5]);
  });
  test('quantidade zero retorna vazio', () => {
    expect(sequenciaFibonacci(0)).toEqual([]);
  });
});
