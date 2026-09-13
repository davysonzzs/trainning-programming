const { somar, subtrair, multiplicar, dividir, resto, ehPar } = require('../calculadora');

test('somar', () => expect(somar(2, 3)).toBe(5));
test('subtrair', () => expect(subtrair(10, 4)).toBe(6));
test('multiplicar', () => expect(multiplicar(3, 4)).toBe(12));

describe('dividir', () => {
  test('divisao normal', () => expect(dividir(10, 2)).toBe(5));
  test('divisao por zero retorna mensagem de erro', () => {
    expect(dividir(10, 0)).toBe('Erro: divisao por zero');
  });
});

describe('resto', () => {
  test('resto de 7 por 2', () => expect(resto(7, 2)).toBe(1));
  test('resto exato e zero', () => expect(resto(10, 5)).toBe(0));
});

describe('ehPar', () => {
  test('numero par', () => expect(ehPar(4)).toBe(true));
  test('numero impar', () => expect(ehPar(7)).toBe(false));
  test('zero e par', () => expect(ehPar(0)).toBe(true));
});
