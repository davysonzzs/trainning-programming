const { dobrar, quadrado, ehPositivo, arredondarPara, media } = require('../utilitarios');

test('dobrar', () => expect(dobrar(4)).toBe(8));
test('quadrado', () => expect(quadrado(5)).toBe(25));

describe('ehPositivo', () => {
  test('numero positivo', () => expect(ehPositivo(3)).toBe(true));
  test('numero negativo', () => expect(ehPositivo(-3)).toBe(false));
  test('zero nao e positivo', () => expect(ehPositivo(0)).toBe(false));
});

describe('arredondarPara', () => {
  test('arredonda para 2 casas', () => expect(arredondarPara(3.14159, 2)).toBe(3.14));
  test('arredonda para 0 casas', () => expect(arredondarPara(3.7, 0)).toBe(4));
});

describe('media', () => {
  test('media de tres numeros', () => expect(media(1, 2, 3)).toBe(2));
  test('media com decimais', () => expect(media(1, 2, 4)).toBe(2.33));
});
