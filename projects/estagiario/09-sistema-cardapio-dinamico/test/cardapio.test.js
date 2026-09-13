const { precoLanche, precoBebida, precoTotal } = require('../cardapio');

describe('precoLanche', () => {
  test.each([['pequeno', 12], ['medio', 18], ['grande', 24], ['gigante', 0]])(
    '%s -> %i', (tamanho, esperado) => expect(precoLanche(tamanho)).toBe(esperado)
  );
});

describe('precoBebida', () => {
  test.each([['suco', 7], ['refrigerante', 6], ['agua', 4], ['cha', 0]])(
    '%s -> %i', (tipo, esperado) => expect(precoBebida(tipo)).toBe(esperado)
  );
});

describe('precoTotal', () => {
  test('soma lanche medio e suco', () => expect(precoTotal('medio', 'suco')).toBe(25));
  test('soma lanche grande e agua', () => expect(precoTotal('grande', 'agua')).toBe(28));
});
