const { numerosDosCrachas, repetirMensagem } = require('../evento');

describe('numerosDosCrachas', () => {
  test('gera numeros de 1 a 4', () => {
    expect(numerosDosCrachas(4)).toEqual([1, 2, 3, 4]);
  });
  test('quantidade 1 retorna so o primeiro', () => {
    expect(numerosDosCrachas(1)).toEqual([1]);
  });
  test('quantidade zero retorna vazio', () => {
    expect(numerosDosCrachas(0)).toEqual([]);
  });
  test('quantidade negativa retorna vazio', () => {
    expect(numerosDosCrachas(-2)).toEqual([]);
  });
});

describe('repetirMensagem', () => {
  test('repete a mensagem 3 vezes', () => {
    expect(repetirMensagem('Bem-vindo!', 3)).toEqual(['Bem-vindo!', 'Bem-vindo!', 'Bem-vindo!']);
  });
  test('vezes 1 retorna array com um item', () => {
    expect(repetirMensagem('Oi', 1)).toEqual(['Oi']);
  });
  test('vezes zero retorna vazio', () => {
    expect(repetirMensagem('Oi', 0)).toEqual([]);
  });
  test('vezes negativo retorna vazio', () => {
    expect(repetirMensagem('Oi', -1)).toEqual([]);
  });
});
