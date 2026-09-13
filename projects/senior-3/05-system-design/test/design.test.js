const { calcularCapacidade, estimarArmazenamento, ArquiteturaDocumentada } = require('../design');

describe('calcularCapacidade', () => {
  test('retorna estrutura esperada', () => {
    const resultado = calcularCapacidade({ requisicoesPorSeg: 100, latenciaMediaMs: 100, disponibilidade: 99.9 });
    expect(resultado).toHaveProperty('servidoresNecessarios');
    expect(resultado).toHaveProperty('armazenamentoDiarioGB');
    expect(resultado).toHaveProperty('bandaLarguraMbps');
    expect(resultado).toHaveProperty('sla');
  });

  test('sla tem disponibilidade e downTimeDiarioMin', () => {
    const r = calcularCapacidade({ requisicoesPorSeg: 100, latenciaMediaMs: 100, disponibilidade: 99.9 });
    expect(r.sla).toHaveProperty('disponibilidade', 99.9);
    expect(r.sla).toHaveProperty('downTimeDiarioMin');
  });

  test('servidoresNecessarios usa Lei de Little', () => {
    // 100 req/s * 200ms / 1000 = 20
    const r = calcularCapacidade({ requisicoesPorSeg: 100, latenciaMediaMs: 200, disponibilidade: 99 });
    expect(r.servidoresNecessarios).toBe(20);
  });

  test('servidoresNecessarios arredonda para cima', () => {
    // 10 * 150 / 1000 = 1.5 → ceil = 2
    const r = calcularCapacidade({ requisicoesPorSeg: 10, latenciaMediaMs: 150, disponibilidade: 99 });
    expect(r.servidoresNecessarios).toBe(2);
  });

  test('downTimeDiarioMin com disponibilidade 99% é ~14.4 min', () => {
    const r = calcularCapacidade({ requisicoesPorSeg: 10, latenciaMediaMs: 10, disponibilidade: 99 });
    // (1 - 0.99) * 1440 = 14.4
    expect(r.sla.downTimeDiarioMin).toBe(14.4);
  });

  test('todos os valores são números', () => {
    const r = calcularCapacidade({ requisicoesPorSeg: 500, latenciaMediaMs: 100, disponibilidade: 99.9 });
    expect(typeof r.servidoresNecessarios).toBe('number');
    expect(typeof r.armazenamentoDiarioGB).toBe('number');
    expect(typeof r.bandaLarguraMbps).toBe('number');
  });
});

describe('estimarArmazenamento', () => {
  test('retorna mes1GB, mes6GB e mes12GB', () => {
    const r = estimarArmazenamento({ usuariosAtivos: 1000, tamanhoMedioRegistroKB: 1, crescimentoDiarioPct: 1 });
    expect(r).toHaveProperty('mes1GB');
    expect(r).toHaveProperty('mes6GB');
    expect(r).toHaveProperty('mes12GB');
  });

  test('mes12GB é maior que mes6GB que é maior que mes1GB', () => {
    const r = estimarArmazenamento({ usuariosAtivos: 100000, tamanhoMedioRegistroKB: 2, crescimentoDiarioPct: 2 });
    expect(r.mes12GB).toBeGreaterThan(r.mes6GB);
    expect(r.mes6GB).toBeGreaterThan(r.mes1GB);
  });

  test('sem crescimento os valores são iguais', () => {
    const r = estimarArmazenamento({ usuariosAtivos: 1000, tamanhoMedioRegistroKB: 1, crescimentoDiarioPct: 0 });
    expect(r.mes1GB).toBe(r.mes6GB);
    expect(r.mes6GB).toBe(r.mes12GB);
  });

  test('valores são números arredondados a 2 casas', () => {
    const r = estimarArmazenamento({ usuariosAtivos: 1000, tamanhoMedioRegistroKB: 1, crescimentoDiarioPct: 1 });
    expect(typeof r.mes1GB).toBe('number');
    expect(String(r.mes1GB).split('.')[1]?.length ?? 0).toBeLessThanOrEqual(2);
  });
});

describe('ArquiteturaDocumentada', () => {
  function montarArquitetura() {
    const arq = new ArquiteturaDocumentada('Sistema Teste');
    arq.adicionarComponente('API', 'gateway', 'Entrada');
    arq.adicionarComponente('DB', 'database', 'Dados');
    arq.conectar('API', 'DB', 'HTTP');
    arq.adicionarTradeoff('Latência aumenta com carga', 'performance');
    return arq;
  }

  test('documentar retorna estrutura completa', () => {
    const doc = montarArquitetura().documentar();
    expect(doc).toHaveProperty('nome', 'Sistema Teste');
    expect(doc).toHaveProperty('componentes');
    expect(doc).toHaveProperty('conexoes');
    expect(doc).toHaveProperty('tradeoffs');
  });

  test('componentes são adicionados corretamente', () => {
    const doc = montarArquitetura().documentar();
    expect(doc.componentes.length).toBe(2);
    expect(doc.componentes[0]).toHaveProperty('nome', 'API');
    expect(doc.componentes[0]).toHaveProperty('tipo', 'gateway');
  });

  test('conexoes são registradas', () => {
    const doc = montarArquitetura().documentar();
    expect(doc.conexoes.length).toBe(1);
    expect(doc.conexoes[0]).toHaveProperty('origem', 'API');
    expect(doc.conexoes[0]).toHaveProperty('destino', 'DB');
    expect(doc.conexoes[0]).toHaveProperty('protocolo', 'HTTP');
  });

  test('tradeoffs são registrados', () => {
    const doc = montarArquitetura().documentar();
    expect(doc.tradeoffs.length).toBe(1);
    expect(doc.tradeoffs[0]).toHaveProperty('impacto', 'performance');
  });

  test('exportarTexto retorna string', () => {
    expect(typeof montarArquitetura().exportarTexto()).toBe('string');
  });

  test('exportarTexto inclui nome da arquitetura', () => {
    expect(montarArquitetura().exportarTexto()).toContain('Sistema Teste');
  });

  test('exportarTexto inclui conexão no formato A → B (protocolo)', () => {
    const texto = montarArquitetura().exportarTexto();
    expect(texto).toContain('API');
    expect(texto).toContain('DB');
    expect(texto).toContain('HTTP');
  });

  test('exportarTexto inclui os tradeoffs', () => {
    expect(montarArquitetura().exportarTexto()).toContain('performance');
  });
});
