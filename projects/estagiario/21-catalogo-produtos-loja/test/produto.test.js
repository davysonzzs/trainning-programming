const { criarProduto, descricao, temEstoque, aplicarDesconto } = require('../produto');

test('criarProduto monta o objeto', () => {
  expect(criarProduto('Mouse', 50, 10)).toEqual({ nome: 'Mouse', preco: 50, estoque: 10 });
});

test('descricao monta a string', () => {
  expect(descricao({ nome: 'Mouse', preco: 50, estoque: 10 })).toBe('Mouse - R$ 50 (10 em estoque)');
});

describe('temEstoque', () => {
  test('com estoque', () => expect(temEstoque({ estoque: 5 })).toBe(true));
  test('sem estoque', () => expect(temEstoque({ estoque: 0 })).toBe(false));
});

describe('aplicarDesconto', () => {
  test('aplica o desconto sem alterar o original', () => {
    const produto = { nome: 'Mouse', preco: 100, estoque: 5 };
    const comDesconto = aplicarDesconto(produto, 10);
    expect(comDesconto).toEqual({ nome: 'Mouse', preco: 90, estoque: 5 });
    expect(produto.preco).toBe(100);
  });
});
