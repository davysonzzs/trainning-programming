const { buscaBinaria, contarTentativas } = require('../buscaBinaria');

const lista = [1, 3, 5, 7, 9, 11, 13];

describe('buscaBinaria', () => {
  test('encontra valor no meio', () => expect(buscaBinaria(lista, 7)).toBe(3));
  test('encontra primeiro valor', () => expect(buscaBinaria(lista, 1)).toBe(0));
  test('encontra ultimo valor', () => expect(buscaBinaria(lista, 13)).toBe(6));
  test('valor inexistente retorna -1', () => expect(buscaBinaria(lista, 4)).toBe(-1));
  test('lista vazia retorna -1', () => expect(buscaBinaria([], 5)).toBe(-1));
});

describe('contarTentativas', () => {
  test('conta tentativas ate achar', () => {
    expect(contarTentativas(lista, 7)).toBeGreaterThan(0);
    expect(contarTentativas(lista, 7)).toBeLessThanOrEqual(3);
  });
  test('tentativas para valor inexistente e finita', () => {
    expect(contarTentativas(lista, 100)).toBeGreaterThan(0);
  });
});
