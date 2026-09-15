const { bubbleSortCrescente, bubbleSortDecrescente } = require('../bubbleSort');

describe('bubbleSortCrescente', () => {
  test('ordena do menor pro maior', () => {
    expect(bubbleSortCrescente([5, 2, 8, 1])).toEqual([1, 2, 5, 8]);
  });
  test('nao altera o array original', () => {
    const original = [3, 1, 2];
    bubbleSortCrescente(original);
    expect(original).toEqual([3, 1, 2]);
  });
  test('array vazio ou de 1 item', () => {
    expect(bubbleSortCrescente([])).toEqual([]);
    expect(bubbleSortCrescente([7])).toEqual([7]);
  });
});

describe('bubbleSortDecrescente', () => {
  test('ordena do maior pro menor', () => {
    expect(bubbleSortDecrescente([5, 2, 8, 1])).toEqual([8, 5, 2, 1]);
  });
});
