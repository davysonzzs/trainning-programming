const { criarContador, somarComEscopoLocal, criarContadorComInicio } = require('../contadores');

describe('criarContador', () => {
  test('comeca em zero', () => {
    const c = criarContador();
    expect(c.valorAtual()).toBe(0);
  });

  test('incrementar aumenta o valor', () => {
    const c = criarContador();
    expect(c.incrementar()).toBe(1);
    expect(c.incrementar()).toBe(2);
    expect(c.valorAtual()).toBe(2);
  });

  test('dois contadores sao independentes', () => {
    const a = criarContador();
    const b = criarContador();
    a.incrementar();
    a.incrementar();
    b.incrementar();
    expect(a.valorAtual()).toBe(2);
    expect(b.valorAtual()).toBe(1);
  });
});

describe('somarComEscopoLocal', () => {
  test('soma dois numeros', () => expect(somarComEscopoLocal(3, 4)).toBe(7));
});

describe('criarContadorComInicio', () => {
  test('comeca no valor inicial', () => {
    const c = criarContadorComInicio(10);
    expect(c.valorAtual()).toBe(10);
    expect(c.incrementar()).toBe(11);
  });
});
