/**
 * PROJETO TDD — Carrinho de Compras
 *
 * Este arquivo contem o ESQUELETO do carrinho. Todos os metodos lancam
 * Error('Nao implementado'). Sua missao e implementar os metodos guiado
 * pelos testes (Red -> Green -> Refactor).
 *
 * INSTRUCOES:
 * 1. Execute `npm test` — todos os testes vao falhar (Red)
 * 2. Implemente UM metodo por vez
 * 3. Execute `npm test` — o teste daquele metodo deve passar (Green)
 * 4. Refatore se necessario, mantendo os testes verdes (Refactor)
 * 5. Repita para o proximo metodo
 */

class Carrinho {
  constructor() {
    this.itens = [];
    this.cupom = null;
  }

  /**
   * Adiciona produto ao carrinho com a quantidade especificada.
   * Se o produto ja existe, incrementa a quantidade.
   * Lanca Error('Quantidade invalida') se quantidade <= 0.
   * @param {{ id: string, nome: string, preco: number }} produto
   * @param {number} quantidade
   */
  adicionar(produto, quantidade) {
    throw new Error('Nao implementado');
  }

  /**
   * Remove completamente um produto do carrinho pelo id.
   * Lanca Error('Produto nao encontrado') se o id nao existir.
   * @param {string} produtoId
   */
  remover(produtoId) {
    throw new Error('Nao implementado');
  }

  /**
   * Aplica um cupom de desconto percentual ao carrinho.
   * Substitui cupom anterior se ja existir.
   * Lanca Error('Desconto invalido') se desconto <= 0 ou >= 100.
   * @param {string} codigo
   * @param {number} desconto - percentual (ex: 10 para 10%)
   */
  aplicarCupom(codigo, desconto) {
    throw new Error('Nao implementado');
  }

  /**
   * Retorna a soma de (preco * quantidade) de todos os itens,
   * SEM aplicar desconto do cupom.
   * @returns {number}
   */
  calcularSubtotal() {
    throw new Error('Nao implementado');
  }

  /**
   * Retorna o valor do desconto em reais.
   * Se nao houver cupom, retorna 0.
   * @returns {number}
   */
  calcularDesconto() {
    throw new Error('Nao implementado');
  }

  /**
   * Retorna o total final: subtotal - desconto.
   * @returns {number}
   */
  calcularTotal() {
    throw new Error('Nao implementado');
  }

  /**
   * Remove todos os itens e o cupom do carrinho.
   */
  limpar() {
    throw new Error('Nao implementado');
  }

  /**
   * Retorna o numero total de itens (soma das quantidades).
   * Ex: 2 unidades do produto A + 3 unidades do B = 5
   * @returns {number}
   */
  quantidadeItens() {
    throw new Error('Nao implementado');
  }
}

module.exports = { Carrinho };
