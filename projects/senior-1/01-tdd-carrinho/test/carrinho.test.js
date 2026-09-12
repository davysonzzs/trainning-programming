const { Carrinho } = require('../carrinho');

describe('Carrinho — TDD', () => {
  let carrinho;

  beforeEach(() => {
    carrinho = new Carrinho();
  });

  const produtoA = { id: 'p1', nome: 'Teclado', preco: 150 };
  const produtoB = { id: 'p2', nome: 'Mouse', preco: 80 };
  const produtoC = { id: 'p3', nome: 'Monitor', preco: 1200 };

  // ============================
  // adicionar
  // ============================

  test('[adicionar] adiciona produto novo ao carrinho', () => {
    carrinho.adicionar(produtoA, 1);
    expect(carrinho.itens).toHaveLength(1);
    expect(carrinho.itens[0].produto.id).toBe('p1');
    expect(carrinho.itens[0].quantidade).toBe(1);
  });

  test('[adicionar] acumula quantidade se produto ja existe', () => {
    carrinho.adicionar(produtoA, 2);
    carrinho.adicionar(produtoA, 3);
    expect(carrinho.itens).toHaveLength(1);
    expect(carrinho.itens[0].quantidade).toBe(5);
  });

  test('[adicionar] lanca erro para quantidade zero', () => {
    expect(() => carrinho.adicionar(produtoA, 0)).toThrow(/invalida/i);
  });

  test('[adicionar] lanca erro para quantidade negativa', () => {
    expect(() => carrinho.adicionar(produtoA, -1)).toThrow(/invalida/i);
  });

  test('[adicionar] produtos diferentes sao itens separados', () => {
    carrinho.adicionar(produtoA, 1);
    carrinho.adicionar(produtoB, 2);
    expect(carrinho.itens).toHaveLength(2);
  });

  // ============================
  // remover
  // ============================

  test('[remover] remove produto existente', () => {
    carrinho.adicionar(produtoA, 1);
    carrinho.adicionar(produtoB, 2);
    carrinho.remover('p1');
    expect(carrinho.itens).toHaveLength(1);
    expect(carrinho.itens[0].produto.id).toBe('p2');
  });

  test('[remover] lanca erro para produto nao encontrado', () => {
    expect(() => carrinho.remover('id-inexistente')).toThrow(/nao encontrado/i);
  });

  // ============================
  // calcularSubtotal
  // ============================

  test('[calcularSubtotal] retorna 0 para carrinho vazio', () => {
    expect(carrinho.calcularSubtotal()).toBe(0);
  });

  test('[calcularSubtotal] calcula corretamente com varios itens', () => {
    carrinho.adicionar(produtoA, 2); // 150 * 2 = 300
    carrinho.adicionar(produtoB, 3); // 80 * 3 = 240
    expect(carrinho.calcularSubtotal()).toBe(540);
  });

  // ============================
  // aplicarCupom e calcularDesconto
  // ============================

  test('[aplicarCupom] aplica cupom de desconto', () => {
    carrinho.adicionar(produtoA, 1); // 150
    carrinho.aplicarCupom('PROMO10', 10);
    expect(carrinho.calcularDesconto()).toBe(15); // 10% de 150
  });

  test('[aplicarCupom] lanca erro para desconto invalido (0)', () => {
    expect(() => carrinho.aplicarCupom('ZERODESC', 0)).toThrow(/invalido/i);
  });

  test('[aplicarCupom] lanca erro para desconto 100 ou mais', () => {
    expect(() => carrinho.aplicarCupom('TUDO', 100)).toThrow(/invalido/i);
    expect(() => carrinho.aplicarCupom('MAIS', 150)).toThrow(/invalido/i);
  });

  test('[calcularDesconto] retorna 0 sem cupom', () => {
    carrinho.adicionar(produtoA, 1);
    expect(carrinho.calcularDesconto()).toBe(0);
  });

  test('[aplicarCupom] substitui cupom anterior', () => {
    carrinho.adicionar(produtoC, 1); // 1200
    carrinho.aplicarCupom('DEZ', 10);
    carrinho.aplicarCupom('VINTE', 20);
    expect(carrinho.calcularDesconto()).toBe(240); // 20% de 1200
  });

  // ============================
  // calcularTotal
  // ============================

  test('[calcularTotal] retorna subtotal sem cupom', () => {
    carrinho.adicionar(produtoA, 2); // 300
    expect(carrinho.calcularTotal()).toBe(300);
  });

  test('[calcularTotal] retorna subtotal menos desconto com cupom', () => {
    carrinho.adicionar(produtoC, 1); // 1200
    carrinho.aplicarCupom('DEZ', 10); // desconto 120
    expect(carrinho.calcularTotal()).toBe(1080);
  });

  // ============================
  // limpar
  // ============================

  test('[limpar] remove todos os itens', () => {
    carrinho.adicionar(produtoA, 2);
    carrinho.adicionar(produtoB, 1);
    carrinho.limpar();
    expect(carrinho.itens).toHaveLength(0);
  });

  test('[limpar] remove o cupom', () => {
    carrinho.adicionar(produtoA, 1);
    carrinho.aplicarCupom('DEZ', 10);
    carrinho.limpar();
    expect(carrinho.calcularDesconto()).toBe(0);
  });

  // ============================
  // quantidadeItens
  // ============================

  test('[quantidadeItens] retorna 0 para carrinho vazio', () => {
    expect(carrinho.quantidadeItens()).toBe(0);
  });

  test('[quantidadeItens] soma todas as quantidades', () => {
    carrinho.adicionar(produtoA, 2);
    carrinho.adicionar(produtoB, 3);
    carrinho.adicionar(produtoC, 1);
    expect(carrinho.quantidadeItens()).toBe(6);
  });
});
