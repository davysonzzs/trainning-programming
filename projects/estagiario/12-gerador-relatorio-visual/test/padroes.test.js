const { barra, graficoDeBarras, contarVogais, ehPalindromo } = require('../padroes');

describe('barra', () => {
  test('gera barra de 3', () => expect(barra(3)).toBe('###'));
  test('zero gera vazio', () => expect(barra(0)).toBe(''));
});

describe('graficoDeBarras', () => {
  test('gera uma barra por valor', () => {
    expect(graficoDeBarras([3, 1, 4])).toEqual(['###', '#', '####']);
  });
  test('array vazio retorna vazio', () => {
    expect(graficoDeBarras([])).toEqual([]);
  });
});

describe('contarVogais', () => {
  test('conta vogais em DevTech', () => expect(contarVogais('DevTech')).toBe(2));
  test('texto sem vogais', () => expect(contarVogais('xyz')).toBe(0));
});

describe('ehPalindromo', () => {
  test('Ovo e palindromo', () => expect(ehPalindromo('Ovo')).toBe(true));
  test('DevTech nao e palindromo', () => expect(ehPalindromo('DevTech')).toBe(false));
  test('Arara e palindromo', () => expect(ehPalindromo('Arara')).toBe(true));
});
