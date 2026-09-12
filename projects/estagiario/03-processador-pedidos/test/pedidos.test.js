const {
  contarItens,
  calcularTotal,
  filtrarPorStatus,
  agruparPorStatus,
  processarLote,
} = require('../pedidos');

const pedidoBase = {
  id: 1,
  cliente: 'Joao',
  status: 'pendente',
  items: [
    { nome: 'Caneta', preco: 2.5,  quantidade: 4 },
    { nome: 'Caderno', preco: 15, quantidade: 2 },
  ],
};

describe('contarItens', () => {
  test('soma a quantidade de todos os itens', () => {
    expect(contarItens(pedidoBase)).toBe(6);
  });

  test('pedido sem itens retorna 0', () => {
    expect(contarItens({ ...pedidoBase, items: [] })).toBe(0);
  });

  test('item com quantidade 1', () => {
    const p = { ...pedidoBase, items: [{ nome: 'A', preco: 5, quantidade: 1 }] };
    expect(contarItens(p)).toBe(1);
  });
});

describe('calcularTotal', () => {
  test('calcula preco * quantidade de cada item e soma', () => {
    // 2.5*4 + 15*2 = 10 + 30 = 40
    expect(calcularTotal(pedidoBase)).toBe(40);
  });

  test('pedido sem itens retorna 0', () => {
    expect(calcularTotal({ ...pedidoBase, items: [] })).toBe(0);
  });

  test('arredonda para 2 casas decimais', () => {
    const p = { ...pedidoBase, items: [{ nome: 'X', preco: 1.1, quantidade: 3 }] };
    expect(calcularTotal(p)).toBe(3.3);
  });
});

describe('filtrarPorStatus', () => {
  const pedidos = [
    { id: 1, status: 'pendente',    items: [] },
    { id: 2, status: 'entregue',    items: [] },
    { id: 3, status: 'pendente',    items: [] },
    { id: 4, status: 'cancelado',   items: [] },
  ];

  test('filtra apenas pedidos pendentes', () => {
    expect(filtrarPorStatus(pedidos, 'pendente').length).toBe(2);
  });

  test('filtra apenas pedidos entregues', () => {
    expect(filtrarPorStatus(pedidos, 'entregue').length).toBe(1);
  });

  test('retorna array vazio para status sem ocorrencias', () => {
    expect(filtrarPorStatus(pedidos, 'processando').length).toBe(0);
  });
});

describe('agruparPorStatus', () => {
  const pedidos = [
    { id: 1, status: 'pendente',  items: [] },
    { id: 2, status: 'entregue',  items: [] },
    { id: 3, status: 'pendente',  items: [] },
  ];

  test('retorna objeto com todas as chaves de status', () => {
    const resultado = agruparPorStatus(pedidos);
    expect(resultado).toHaveProperty('pendente');
    expect(resultado).toHaveProperty('processando');
    expect(resultado).toHaveProperty('entregue');
    expect(resultado).toHaveProperty('cancelado');
  });

  test('agrupa pedidos no status correto', () => {
    const resultado = agruparPorStatus(pedidos);
    expect(resultado.pendente.length).toBe(2);
    expect(resultado.entregue.length).toBe(1);
    expect(resultado.processando.length).toBe(0);
  });
});

describe('processarLote', () => {
  const pedidos = [pedidoBase, { ...pedidoBase, id: 2, items: [{ nome: 'X', preco: 5, quantidade: 2 }] }];

  test('adiciona total e quantidadeItens a cada pedido', () => {
    const resultado = processarLote(pedidos);
    expect(resultado[0]).toHaveProperty('total');
    expect(resultado[0]).toHaveProperty('quantidadeItens');
  });

  test('calcula total corretamente para cada pedido', () => {
    const resultado = processarLote(pedidos);
    expect(resultado[0].total).toBe(40);
    expect(resultado[1].total).toBe(10);
  });

  test('nao modifica o array original', () => {
    const copia = [...pedidos];
    processarLote(pedidos);
    expect(pedidos).toEqual(copia);
  });
});
