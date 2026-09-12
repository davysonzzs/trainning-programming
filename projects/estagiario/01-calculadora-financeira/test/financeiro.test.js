const {
  calcularJuros,
  calcularDesconto,
  calcularParcelas,
  calcularImposto,
  resumoCompra,
} = require('../financeiro');

describe('calcularJuros', () => {
  test('calcula juros compostos corretamente', () => {
    expect(calcularJuros(1000, 2, 3)).toBe(1061.21);
  });

  test('sem meses, retorna o valor original', () => {
    expect(calcularJuros(1000, 5, 0)).toBe(1000);
  });

  test('taxa zero nao gera juros', () => {
    expect(calcularJuros(500, 0, 12)).toBe(500);
  });
});

describe('calcularDesconto', () => {
  test('desconto de 10% em R$200 retorna R$180', () => {
    expect(calcularDesconto(200, 10)).toBe(180);
  });

  test('desconto de 50% divide o valor ao meio', () => {
    expect(calcularDesconto(300, 50)).toBe(150);
  });

  test('desconto zero retorna o valor original', () => {
    expect(calcularDesconto(100, 0)).toBe(100);
  });

  test('arredonda para 2 casas decimais', () => {
    expect(calcularDesconto(100, 33)).toBe(67);
  });
});

describe('calcularParcelas', () => {
  test('divide valor por numero de parcelas', () => {
    expect(calcularParcelas(300, 3)).toBe(100);
  });

  test('arredonda para 2 casas decimais', () => {
    expect(calcularParcelas(100, 3)).toBe(33.33);
  });

  test('1 parcela retorna o valor total', () => {
    expect(calcularParcelas(250, 1)).toBe(250);
  });
});

describe('calcularImposto', () => {
  test('ISS é 5% do valor', () => {
    expect(calcularImposto(1000, 'ISS')).toBe(50);
  });

  test('ICMS é 12% do valor', () => {
    expect(calcularImposto(1000, 'ICMS')).toBe(120);
  });

  test('IPI é 10% do valor', () => {
    expect(calcularImposto(1000, 'IPI')).toBe(100);
  });

  test('tipo invalido lanca erro', () => {
    expect(() => calcularImposto(1000, 'IOF')).toThrow('Tipo de imposto invalido');
  });
});

describe('resumoCompra', () => {
  test('retorna objeto com todos os campos', () => {
    const resultado = resumoCompra(1000, 10, 'ISS');
    expect(resultado).toHaveProperty('original', 1000);
    expect(resultado).toHaveProperty('desconto');
    expect(resultado).toHaveProperty('impostos');
    expect(resultado).toHaveProperty('total');
  });

  test('calcula total corretamente: preco - desconto + imposto', () => {
    // preco=1000, desconto=10% -> 100, imposto=ISS(5%)=50
    // total = 1000 - 100 + 50 = 950
    const resultado = resumoCompra(1000, 10, 'ISS');
    expect(resultado.total).toBe(950);
  });
});
