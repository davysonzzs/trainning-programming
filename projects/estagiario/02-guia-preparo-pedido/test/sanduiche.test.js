const { montarPasso, montarSanduiche, contarPassos } = require('../sanduiche');

describe('montarPasso', () => {
  test('monta o texto do passo 1', () => {
    expect(montarPasso(1, 'pao')).toBe('Passo 1: adicionar pao');
  });

  test('monta o texto do passo 3', () => {
    expect(montarPasso(3, 'queijo')).toBe('Passo 3: adicionar queijo');
  });
});

describe('montarSanduiche', () => {
  test('monta os passos na ordem certa', () => {
    expect(montarSanduiche(['pao', 'carne'])).toEqual([
      'Passo 1: adicionar pao',
      'Passo 2: adicionar carne',
    ]);
  });

  test('funciona com mais ingredientes', () => {
    expect(montarSanduiche(['pao', 'carne', 'queijo', 'molho'])).toEqual([
      'Passo 1: adicionar pao',
      'Passo 2: adicionar carne',
      'Passo 3: adicionar queijo',
      'Passo 4: adicionar molho',
    ]);
  });

  test('array vazio retorna array vazio', () => {
    expect(montarSanduiche([])).toEqual([]);
  });
});

describe('contarPassos', () => {
  test('conta os ingredientes', () => {
    expect(contarPassos(['pao', 'carne', 'queijo'])).toBe(3);
  });

  test('array vazio tem zero passos', () => {
    expect(contarPassos([])).toBe(0);
  });
});
