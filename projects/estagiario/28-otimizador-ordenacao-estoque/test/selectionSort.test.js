const { selectionSortCrescente, indiceDoMenor } = require('../selectionSort');

describe('indiceDoMenor', () => {
  test('encontra o indice do menor a partir de uma posicao', () => {
    expect(indiceDoMenor([5, 2, 8, 1], 1)).toBe(3);
  });
  test('a partir do inicio', () => {
    expect(indiceDoMenor([5, 2, 8, 1], 0)).toBe(3);
  });
});

describe('selectionSortCrescente', () => {
  test('ordena do menor pro maior', () => {
    expect(selectionSortCrescente([5, 2, 8, 1])).toEqual([1, 2, 5, 8]);
  });
  test('nao altera o array original', () => {
    const original = [3, 1, 2];
    selectionSortCrescente(original);
    expect(original).toEqual([3, 1, 2]);
  });
  test('array vazio ou de 1 item', () => {
    expect(selectionSortCrescente([])).toEqual([]);
    expect(selectionSortCrescente([9])).toEqual([9]);
  });
});
