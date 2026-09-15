const {
  valoresDasVendas,
  vendasAcimaDe,
  totalVendido,
  buscarVendaPorId,
} = require('../estatisticas');

const vendas = [
  { id: 1, vendedor: 'Ana', valor: 100 },
  { id: 2, vendedor: 'Joao', valor: 250 },
  { id: 3, vendedor: 'Ana', valor: 50 },
];

test('valoresDasVendas extrai os valores', () => {
  expect(valoresDasVendas(vendas)).toEqual([100, 250, 50]);
});

test('vendasAcimaDe filtra por meta', () => {
  expect(vendasAcimaDe(vendas, 80)).toEqual([vendas[0], vendas[1]]);
});

test('totalVendido soma tudo', () => {
  expect(totalVendido(vendas)).toBe(400);
});

test('totalVendido de lista vazia e zero', () => {
  expect(totalVendido([])).toBe(0);
});

describe('buscarVendaPorId', () => {
  test('encontra a venda', () => {
    expect(buscarVendaPorId(vendas, 2)).toEqual(vendas[1]);
  });
  test('id inexistente retorna undefined', () => {
    expect(buscarVendaPorId(vendas, 99)).toBeUndefined();
  });
});
