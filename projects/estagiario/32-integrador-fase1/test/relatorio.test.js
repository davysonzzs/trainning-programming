const {
  calcularFaturamento,
  ticketMedio,
  calcularCrescimento,
  top3Vendedores,
  relatorioCompleto,
} = require('../relatorio');

const vendas = [
  { id: 1, vendedor: 'Ana',    valor: 500,  produto: 'Notebook',  data: '2026-01-10' },
  { id: 2, vendedor: 'Bruno',  valor: 300,  produto: 'Mouse',     data: '2026-01-11' },
  { id: 3, vendedor: 'Ana',    valor: 800,  produto: 'Monitor',   data: '2026-01-12' },
  { id: 4, vendedor: 'Carla',  valor: 1200, produto: 'Servidor',  data: '2026-01-13' },
  { id: 5, vendedor: 'Bruno',  valor: 150,  produto: 'Teclado',   data: '2026-01-14' },
  { id: 6, vendedor: 'Ana',    valor: 400,  produto: 'Webcam',    data: '2026-01-15' },
  { id: 7, vendedor: 'Diego',  valor: 250,  produto: 'Headset',   data: '2026-01-16' },
];

describe('calcularFaturamento', () => {
  test('soma todos os valores de venda', () => {
    expect(calcularFaturamento(vendas)).toBe(3600);
  });

  test('array vazio retorna 0', () => {
    expect(calcularFaturamento([])).toBe(0);
  });

  test('uma venda retorna o valor dela', () => {
    expect(calcularFaturamento([{ valor: 999 }])).toBe(999);
  });
});

describe('ticketMedio', () => {
  test('calcula a media dos valores', () => {
    // 3600 / 7 = 514.28...
    expect(ticketMedio(vendas)).toBe(514.29);
  });

  test('array vazio retorna 0', () => {
    expect(ticketMedio([])).toBe(0);
  });

  test('uma venda retorna o proprio valor', () => {
    expect(ticketMedio([{ valor: 100 }])).toBe(100);
  });
});

describe('calcularCrescimento', () => {
  test('crescimento positivo entre meses', () => {
    expect(calcularCrescimento(1200, 1000)).toBe(20);
  });

  test('crescimento negativo (queda)', () => {
    expect(calcularCrescimento(800, 1000)).toBe(-20);
  });

  test('sem crescimento retorna 0', () => {
    expect(calcularCrescimento(1000, 1000)).toBe(0);
  });

  test('mes anterior zero retorna 0 (evita divisao por zero)', () => {
    expect(calcularCrescimento(500, 0)).toBe(0);
  });
});

describe('top3Vendedores', () => {
  test('retorna array com 3 elementos', () => {
    expect(top3Vendedores(vendas).length).toBe(3);
  });

  test('Ana deve ser a primeira (maior total: 500+800+400=1700)', () => {
    const top = top3Vendedores(vendas);
    expect(top[0].vendedor).toBe('Ana');
    expect(top[0].total).toBe(1700);
  });

  test('cada elemento tem vendedor e total', () => {
    const top = top3Vendedores(vendas);
    top.forEach(v => {
      expect(v).toHaveProperty('vendedor');
      expect(v).toHaveProperty('total');
    });
  });

  test('ordenado do maior para o menor total', () => {
    const top = top3Vendedores(vendas);
    expect(top[0].total).toBeGreaterThanOrEqual(top[1].total);
    expect(top[1].total).toBeGreaterThanOrEqual(top[2].total);
  });
});

describe('relatorioCompleto', () => {
  test('retorna todos os campos esperados', () => {
    const rel = relatorioCompleto(vendas);
    expect(rel).toHaveProperty('faturamento');
    expect(rel).toHaveProperty('ticketMedio');
    expect(rel).toHaveProperty('totalVendas');
    expect(rel).toHaveProperty('top3Vendedores');
    expect(rel).toHaveProperty('melhorVendedor');
  });

  test('totalVendas é o numero de vendas', () => {
    expect(relatorioCompleto(vendas).totalVendas).toBe(7);
  });

  test('melhorVendedor é Ana', () => {
    expect(relatorioCompleto(vendas).melhorVendedor).toBe('Ana');
  });

  test('faturamento bate com calcularFaturamento', () => {
    expect(relatorioCompleto(vendas).faturamento).toBe(3600);
  });
});
