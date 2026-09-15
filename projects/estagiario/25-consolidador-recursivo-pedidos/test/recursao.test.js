const { somarValoresRecursivo, contagemRegressiva, inverterArrayRecursivo } = require('../recursao');

describe('somarValoresRecursivo', () => {
  test('soma uma lista de valores', () => expect(somarValoresRecursivo([10, 20, 30])).toBe(60));
  test('array vazio soma zero', () => expect(somarValoresRecursivo([])).toBe(0));
  test('lista de um item', () => expect(somarValoresRecursivo([5])).toBe(5));
});

describe('contagemRegressiva', () => {
  test('conta de 3 a 1', () => expect(contagemRegressiva(3)).toEqual([3, 2, 1]));
  test('n zero retorna vazio', () => expect(contagemRegressiva(0)).toEqual([]));
});

describe('inverterArrayRecursivo', () => {
  test('inverte a lista', () => expect(inverterArrayRecursivo([1, 2, 3])).toEqual([3, 2, 1]));
  test('lista de um item permanece igual', () => expect(inverterArrayRecursivo([1])).toEqual([1]));
  test('lista vazia permanece vazia', () => expect(inverterArrayRecursivo([])).toEqual([]));
});
