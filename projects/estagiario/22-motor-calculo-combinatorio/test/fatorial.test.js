const { fatorialRecursivo, potenciaRecursiva } = require('../fatorial');

describe('fatorialRecursivo', () => {
  test('caso base 0! = 1', () => expect(fatorialRecursivo(0)).toBe(1));
  test('5! = 120', () => expect(fatorialRecursivo(5)).toBe(120));
  test('1! = 1', () => expect(fatorialRecursivo(1)).toBe(1));
});

describe('potenciaRecursiva', () => {
  test('2^5 = 32', () => expect(potenciaRecursiva(2, 5)).toBe(32));
  test('qualquer base ^0 = 1', () => expect(potenciaRecursiva(7, 0)).toBe(1));
  test('3^3 = 27', () => expect(potenciaRecursiva(3, 3)).toBe(27));
});
