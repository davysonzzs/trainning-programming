const { ehParOuImpar, sinalDoNumero, maiorEntre, estaNoIntervalo } = require('../numeros');

describe('ehParOuImpar', () => {
  test('numero par', () => expect(ehParOuImpar(8)).toBe('par'));
  test('numero impar', () => expect(ehParOuImpar(7)).toBe('impar'));
});

describe('sinalDoNumero', () => {
  test('positivo', () => expect(sinalDoNumero(5)).toBe('positivo'));
  test('negativo', () => expect(sinalDoNumero(-5)).toBe('negativo'));
  test('zero', () => expect(sinalDoNumero(0)).toBe('zero'));
});

describe('maiorEntre', () => {
  test('primeiro e maior', () => expect(maiorEntre(10, 5)).toBe(10));
  test('segundo e maior', () => expect(maiorEntre(3, 8)).toBe(8));
  test('iguais', () => expect(maiorEntre(4, 4)).toBe(4));
});

describe('estaNoIntervalo', () => {
  test('dentro do intervalo', () => expect(estaNoIntervalo(5, 1, 10)).toBe(true));
  test('no limite inferior', () => expect(estaNoIntervalo(1, 1, 10)).toBe(true));
  test('no limite superior', () => expect(estaNoIntervalo(10, 1, 10)).toBe(true));
  test('fora do intervalo', () => expect(estaNoIntervalo(15, 1, 10)).toBe(false));
});
