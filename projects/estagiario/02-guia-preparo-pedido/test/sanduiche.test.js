const { montarPasso, montarSanduiche, resumoDoPedido } = require('../sanduiche');

describe('montarPasso', () => {
  test('monta o texto do passo 1', () => {
    expect(montarPasso(1, 'pao')).toBe('Passo 1: adicionar pao');
  });

  test('monta o texto do passo 3', () => {
    expect(montarPasso(3, 'queijo')).toBe('Passo 3: adicionar queijo');
  });
});

describe('montarSanduiche', () => {
  test('monta os 3 passos na ordem certa', () => {
    expect(montarSanduiche('pao', 'carne', 'maionese')).toEqual([
      'Passo 1: adicionar pao',
      'Passo 2: adicionar carne',
      'Passo 3: adicionar maionese',
    ]);
  });

  test('funciona com outros ingredientes', () => {
    expect(montarSanduiche('pao integral', 'frango', 'mostarda')).toEqual([
      'Passo 1: adicionar pao integral',
      'Passo 2: adicionar frango',
      'Passo 3: adicionar mostarda',
    ]);
  });
});

describe('resumoDoPedido', () => {
  test('monta o resumo do pedido', () => {
    expect(resumoDoPedido('Ana', 'pao', 'carne', 'maionese')).toBe(
      'Pedido de Ana: pao, carne e maionese'
    );
  });

  test('funciona com outro cliente', () => {
    expect(resumoDoPedido('Bruno', 'pao integral', 'frango', 'mostarda')).toBe(
      'Pedido de Bruno: pao integral, frango e mostarda'
    );
  });
});
