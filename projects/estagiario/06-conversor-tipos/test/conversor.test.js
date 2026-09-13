const { paraNumero, paraTexto, paraBooleano, saoIguais, saoIdenticos } = require('../conversor');

describe('paraNumero', () => {
  test('converte texto numerico', () => expect(paraNumero('10')).toBe(10));
  test('texto invalido retorna null', () => expect(paraNumero('abc')).toBeNull());
});

describe('paraTexto', () => {
  test('converte numero', () => expect(paraTexto(10)).toBe('10'));
  test('converte boolean', () => expect(paraTexto(true)).toBe('true'));
});

describe('paraBooleano', () => {
  test.each([[0, false], ['', false], [null, false], [undefined, false], [NaN, false]])(
    '%p vira false', (valor, esperado) => expect(paraBooleano(valor)).toBe(esperado)
  );
  test.each([[1, true], ['texto', true], [{}, true], [[], true]])(
    '%p vira true', (valor, esperado) => expect(paraBooleano(valor)).toBe(esperado)
  );
});

describe('saoIguais', () => {
  test('numero e texto equivalentes sao iguais', () => expect(saoIguais(10, '10')).toBe(true));
  test('valores diferentes nao sao iguais', () => expect(saoIguais(10, 20)).toBe(false));
});

describe('saoIdenticos', () => {
  test('numero e texto equivalentes nao sao identicos', () => expect(saoIdenticos(10, '10')).toBe(false));
  test('mesmo tipo e valor sao identicos', () => expect(saoIdenticos(10, 10)).toBe(true));
});
