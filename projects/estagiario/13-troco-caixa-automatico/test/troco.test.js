const { calcularTroco, decompor } = require('../troco');

describe('calcularTroco', () => {
  test('calcula o troco corretamente', () => {
    expect(calcularTroco(50, 37.5)).toBe(12.5);
  });

  test('pagamento exato retorna zero', () => {
    expect(calcularTroco(20, 20)).toBe(0);
  });

  test('pagamento menor que a compra retorna zero', () => {
    expect(calcularTroco(10, 20)).toBe(0);
  });
});

describe('decompor', () => {
  test('decompoe 37.5 nas menores cedulas possiveis', () => {
    expect(decompor(37.5)).toEqual([20, 10, 5, 2, 0.5]);
  });

  test('decompoe 3 em duas moedas', () => {
    expect(decompor(3)).toEqual([2, 1]);
  });

  test('valor zero retorna array vazio', () => {
    expect(decompor(0)).toEqual([]);
  });

  test('decompoe valor com centavos pequenos', () => {
    expect(decompor(0.15)).toEqual([0.10, 0.05]);
  });
});
