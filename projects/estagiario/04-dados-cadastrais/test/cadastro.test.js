const { tipoDe, nomeValido, idadeValida, cadastroValido } = require('../cadastro');

describe('tipoDe', () => {
  test('identifica string', () => {
    expect(tipoDe('Ana')).toBe('string');
  });
  test('identifica number', () => {
    expect(tipoDe(25)).toBe('number');
  });
  test('identifica boolean', () => {
    expect(tipoDe(true)).toBe('boolean');
  });
});

describe('nomeValido', () => {
  test('nome preenchido e valido', () => {
    expect(nomeValido('Ana')).toBe(true);
  });
  test('string vazia e invalida', () => {
    expect(nomeValido('')).toBe(false);
  });
  test('numero nao e nome valido', () => {
    expect(nomeValido(123)).toBe(false);
  });
});

describe('idadeValida', () => {
  test('idade dentro da faixa e valida', () => {
    expect(idadeValida(25)).toBe(true);
  });
  test('idade menor que 18 e invalida', () => {
    expect(idadeValida(17)).toBe(false);
  });
  test('idade maior ou igual a 120 e invalida', () => {
    expect(idadeValida(120)).toBe(false);
  });
  test('idade como texto e invalida', () => {
    expect(idadeValida('25')).toBe(false);
  });
});

describe('cadastroValido', () => {
  test('cadastro totalmente valido', () => {
    expect(cadastroValido('Ana', 30, true)).toBe(true);
  });
  test('nome invalido derruba o cadastro', () => {
    expect(cadastroValido('', 30, true)).toBe(false);
  });
  test('idade invalida derruba o cadastro', () => {
    expect(cadastroValido('Ana', 15, true)).toBe(false);
  });
  test('ativo fora do tipo boolean derruba o cadastro', () => {
    expect(cadastroValido('Ana', 30, 'sim')).toBe(false);
  });
});
