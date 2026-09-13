const { adicionarItem, totalDaLista, contarItens, itemMaisCaro } = require('../compras');

describe('adicionarItem', () => {
  test('adiciona item no final sem alterar o original', () => {
    const lista = [{ nome: 'Arroz', preco: 20 }];
    const nova = adicionarItem(lista, { nome: 'Feijao', preco: 8 });
    expect(nova).toEqual([{ nome: 'Arroz', preco: 20 }, { nome: 'Feijao', preco: 8 }]);
    expect(lista).toEqual([{ nome: 'Arroz', preco: 20 }]);
  });
});

describe('totalDaLista', () => {
  test('soma os precos', () => {
    expect(totalDaLista([{ preco: 10 }, { preco: 5 }])).toBe(15);
  });
  test('lista vazia retorna zero', () => {
    expect(totalDaLista([])).toBe(0);
  });
});

describe('contarItens', () => {
  test('conta os itens', () => expect(contarItens([{}, {}, {}])).toBe(3));
});

describe('itemMaisCaro', () => {
  test('encontra o item de maior preco', () => {
    const lista = [{ nome: 'A', preco: 10 }, { nome: 'B', preco: 30 }, { nome: 'C', preco: 5 }];
    expect(itemMaisCaro(lista)).toEqual({ nome: 'B', preco: 30 });
  });
  test('lista vazia retorna null', () => {
    expect(itemMaisCaro([])).toBeNull();
  });
});
