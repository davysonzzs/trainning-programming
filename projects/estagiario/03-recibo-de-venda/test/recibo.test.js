const { calcularSubtotal, calcularDesconto, calcularTotal, gerarRecibo } = require('../recibo');

describe('calcularSubtotal', () => {
  test('multiplica preco pela quantidade', () => {
    expect(calcularSubtotal(12, 3)).toBe(36);
  });
  test('funciona com quantidade 1', () => {
    expect(calcularSubtotal(10, 1)).toBe(10);
  });
});

describe('calcularDesconto', () => {
  test('calcula percentual do subtotal', () => {
    expect(calcularDesconto(36, 25)).toBe(9);
  });
  test('percentual zero retorna zero', () => {
    expect(calcularDesconto(50, 0)).toBe(0);
  });
  test('arredonda para 2 casas decimais', () => {
    expect(calcularDesconto(3.33, 10)).toBe(0.33);
  });
});

describe('calcularTotal', () => {
  test('subtrai o desconto do subtotal', () => {
    expect(calcularTotal(36, 9)).toBe(27);
  });
  test('desconto zero mantem o subtotal', () => {
    expect(calcularTotal(50, 0)).toBe(50);
  });
});

describe('gerarRecibo', () => {
  test('monta a string com subtotal, desconto e total', () => {
    expect(gerarRecibo(12, 3, 25)).toBe('Subtotal: R$ 36 | Desconto: R$ 9 | Total: R$ 27');
  });
  test('funciona sem desconto', () => {
    expect(gerarRecibo(10, 5, 0)).toBe('Subtotal: R$ 50 | Desconto: R$ 0 | Total: R$ 50');
  });
});
