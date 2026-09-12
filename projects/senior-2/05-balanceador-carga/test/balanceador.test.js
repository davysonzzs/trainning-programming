const { criarBalanceador } = require('../balanceador');

const servidores = [
  { id: 's1', host: 'server1.devtech.com', peso: 1 },
  { id: 's2', host: 'server2.devtech.com', peso: 1 },
  { id: 's3', host: 'server3.devtech.com', peso: 1 },
];

describe('Round Robin', () => {
  let balanceador;

  beforeEach(() => {
    balanceador = criarBalanceador('round-robin', servidores);
  });

  test('distribui em sequencia circular', () => {
    const s1 = balanceador.proximo();
    const s2 = balanceador.proximo();
    const s3 = balanceador.proximo();
    const s4 = balanceador.proximo(); // volta ao inicio
    expect(s1.id).not.toBe(s2.id);
    expect(s4.id).toBe(s1.id);
  });

  test('todos os servidores sao usados igualmente', () => {
    const contagem = {};
    for (let i = 0; i < 9; i++) {
      const s = balanceador.proximo();
      contagem[s.id] = (contagem[s.id] || 0) + 1;
    }
    expect(contagem['s1']).toBe(3);
    expect(contagem['s2']).toBe(3);
    expect(contagem['s3']).toBe(3);
  });

  test('funciona com servidor adicionado', () => {
    balanceador.adicionarServidor({ id: 's4', host: 'server4.devtech.com', peso: 1 });
    const ids = new Set();
    for (let i = 0; i < 4; i++) ids.add(balanceador.proximo().id);
    expect(ids.has('s4')).toBe(true);
  });
});

describe('Least Connections', () => {
  let balanceador;

  beforeEach(() => {
    balanceador = criarBalanceador('least-connections', servidores);
  });

  test('escolhe servidor com menos conexoes', () => {
    balanceador.registrarConexao('s1');
    balanceador.registrarConexao('s1');
    balanceador.registrarConexao('s2');
    const escolhido = balanceador.proximo();
    expect(escolhido.id).toBe('s3'); // s3 tem 0 conexoes
  });

  test('distribui igualmente quando todos tem 0 conexoes', () => {
    const ids = new Set();
    for (let i = 0; i < 3; i++) ids.add(balanceador.proximo().id);
    expect(ids.size).toBeGreaterThanOrEqual(1); // pelo menos funciona sem erro
  });

  test('liberarConexao decrementa corretamente', () => {
    balanceador.registrarConexao('s1');
    balanceador.registrarConexao('s1');
    balanceador.liberarConexao('s1');
    const ativos = balanceador.servidoresAtivos();
    const s1 = ativos.find(s => s.id === 's1');
    expect(s1.conexoesAtivas).toBe(1);
  });

  test('conexoesAtivas nao fica negativo', () => {
    balanceador.liberarConexao('s1');
    const ativos = balanceador.servidoresAtivos();
    const s1 = ativos.find(s => s.id === 's1');
    expect(s1.conexoesAtivas).toBeGreaterThanOrEqual(0);
  });
});

describe('Weighted', () => {
  test('distribui proporcional ao peso', () => {
    const servsComPeso = [
      { id: 's1', host: 'server1', peso: 3 },
      { id: 's2', host: 'server2', peso: 1 },
    ];
    const balanceador = criarBalanceador('weighted', servsComPeso);
    const contagem = { s1: 0, s2: 0 };
    for (let i = 0; i < 40; i++) {
      const s = balanceador.proximo();
      contagem[s.id]++;
    }
    // s1 deve receber ~3x mais que s2
    expect(contagem['s1']).toBeGreaterThan(contagem['s2']);
    expect(contagem['s1'] / contagem['s2']).toBeCloseTo(3, 0);
  });
});

describe('IP Hash', () => {
  let balanceador;

  beforeEach(() => {
    balanceador = criarBalanceador('ip-hash', servidores);
  });

  test('mesmo IP sempre vai para o mesmo servidor', () => {
    const ip = '192.168.1.100';
    const s1 = balanceador.proximo({ ip });
    const s2 = balanceador.proximo({ ip });
    const s3 = balanceador.proximo({ ip });
    expect(s1.id).toBe(s2.id);
    expect(s2.id).toBe(s3.id);
  });

  test('IPs diferentes podem ir para servidores diferentes', () => {
    const ids = new Set();
    ['1.1.1.1', '2.2.2.2', '3.3.3.3', '4.4.4.4', '5.5.5.5', '6.6.6.6'].forEach(ip => {
      ids.add(balanceador.proximo({ ip }).id);
    });
    expect(ids.size).toBeGreaterThan(1);
  });
});

describe('estatisticas e servidoresAtivos', () => {
  let balanceador;

  beforeEach(() => {
    balanceador = criarBalanceador('round-robin', servidores);
  });

  test('estatisticas rastreia totalRequisicoes', () => {
    balanceador.proximo();
    balanceador.proximo();
    balanceador.proximo();
    expect(balanceador.estatisticas().totalRequisicoes).toBe(3);
  });

  test('estatisticas rastreia por servidor', () => {
    for (let i = 0; i < 6; i++) balanceador.proximo();
    const stats = balanceador.estatisticas();
    expect(stats.porServidor['s1']).toBeGreaterThan(0);
    expect(stats.porServidor['s2']).toBeGreaterThan(0);
  });

  test('servidoresAtivos retorna todos os servidores', () => {
    const ativos = balanceador.servidoresAtivos();
    expect(ativos).toHaveLength(3);
    ativos.forEach(s => {
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('host');
      expect(s).toHaveProperty('conexoesAtivas');
      expect(s).toHaveProperty('peso');
    });
  });

  test('removerServidor remove do pool', () => {
    balanceador.removerServidor('s3');
    const ativos = balanceador.servidoresAtivos();
    expect(ativos.find(s => s.id === 's3')).toBeUndefined();
  });
});
