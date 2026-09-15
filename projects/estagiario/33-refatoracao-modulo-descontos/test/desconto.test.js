const { calcularDesconto, valorComDesconto } = require('../legado');

describe('calcularDesconto — bronze', () => {
  test('sem desconto abaixo de 100', () => {
    expect(calcularDesconto('bronze', 80)).toBe(0);
  });
  test('5% a partir de 100', () => {
    expect(calcularDesconto('bronze', 200)).toBeCloseTo(10);
  });
});

describe('calcularDesconto — prata', () => {
  test('sem desconto abaixo de 50', () => {
    expect(calcularDesconto('prata', 30)).toBe(0);
  });
  test('5% entre 50 e 99.99', () => {
    expect(calcularDesconto('prata', 60)).toBeCloseTo(3);
  });
  test('10% a partir de 100', () => {
    expect(calcularDesconto('prata', 150)).toBeCloseTo(15);
  });
});

describe('calcularDesconto — ouro', () => {
  test('5% abaixo de 50', () => {
    expect(calcularDesconto('ouro', 30)).toBeCloseTo(1.5);
  });
  test('10% entre 50 e 99.99', () => {
    expect(calcularDesconto('ouro', 60)).toBeCloseTo(6);
  });
  test('15% a partir de 100 — o cliente reclamou que o desconto veio errado', () => {
    expect(calcularDesconto('ouro', 200)).toBeCloseTo(30);
  });
});

describe('valorComDesconto', () => {
  test('aplica o desconto sobre o valor da compra', () => {
    expect(valorComDesconto('ouro', 200)).toBeCloseTo(170);
  });
  test('cliente com nivel nao reconhecido nao recebe desconto', () => {
    expect(valorComDesconto('inexistente', 500)).toBe(500);
  });
});
