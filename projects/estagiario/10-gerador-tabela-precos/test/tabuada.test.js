const { tabelaDePrecos, somaDe1Ate, primeirosMultiplos } = require('../tabuada');

describe('tabelaDePrecos', () => {
  test('gera a tabela de 1 a 10', () => {
    expect(tabelaDePrecos(5)).toEqual([5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
  });
  test('funciona com preco 1', () => {
    expect(tabelaDePrecos(1)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe('somaDe1Ate', () => {
  test('soma de 1 a 5', () => expect(somaDe1Ate(5)).toBe(15));
  test('soma de 1 a 1', () => expect(somaDe1Ate(1)).toBe(1));
  test('n zero retorna zero', () => expect(somaDe1Ate(0)).toBe(0));
  test('n negativo retorna zero', () => expect(somaDe1Ate(-5)).toBe(0));
});

describe('primeirosMultiplos', () => {
  test('4 primeiros multiplos de 3', () => {
    expect(primeirosMultiplos(3, 4)).toEqual([3, 6, 9, 12]);
  });
  test('3 primeiros multiplos de 7', () => {
    expect(primeirosMultiplos(7, 3)).toEqual([7, 14, 21]);
  });
});
