const { faixaEtaria, precoIngresso, podeAssistir } = require('../idade');

describe('faixaEtaria', () => {
  test.each([
    [5, 'crianca'], [11, 'crianca'],
    [12, 'adolescente'], [17, 'adolescente'],
    [18, 'adulto'], [59, 'adulto'],
    [60, 'idoso'], [90, 'idoso'],
  ])('idade %i -> %s', (idade, esperado) => {
    expect(faixaEtaria(idade)).toBe(esperado);
  });
});

describe('precoIngresso', () => {
  test('crianca paga 10', () => expect(precoIngresso(8)).toBe(10));
  test('adolescente paga 16', () => expect(precoIngresso(15)).toBe(16));
  test('adulto paga 24', () => expect(precoIngresso(30)).toBe(24));
  test('idoso paga 10', () => expect(precoIngresso(65)).toBe(10));
});

describe('podeAssistir', () => {
  test('idade igual a classificacao pode assistir', () => expect(podeAssistir(16, 16)).toBe(true));
  test('idade maior pode assistir', () => expect(podeAssistir(20, 14)).toBe(true));
  test('idade menor nao pode assistir', () => expect(podeAssistir(10, 14)).toBe(false));
  test('classificacao livre sempre permite', () => expect(podeAssistir(5, 0)).toBe(true));
});
