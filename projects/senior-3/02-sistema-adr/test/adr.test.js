const { criarSistemaADR } = require('../adr');

function novoSistema() {
  return criarSistemaADR();
}

function dadosPadrao(extra = {}) {
  return {
    titulo: 'Adotar PostgreSQL',
    contexto: 'Precisamos de ACID',
    decisao: 'Usar PostgreSQL 15',
    consequencias: 'Curva de aprendizado',
    alternativas: ['MySQL', 'MongoDB'],
    autor: 'Dev Silva',
    ...extra
  };
}

describe('criar', () => {
  test('retorna ADR com id sequencial ADR-001', () => {
    const s = novoSistema();
    const adr = s.criar(dadosPadrao());
    expect(adr.id).toBe('ADR-001');
  });

  test('ids incrementam corretamente', () => {
    const s = novoSistema();
    s.criar(dadosPadrao());
    const adr2 = s.criar(dadosPadrao({ titulo: 'Outra' }));
    expect(adr2.id).toBe('ADR-002');
  });

  test('status padrão é proposta', () => {
    const s = novoSistema();
    const adr = s.criar(dadosPadrao());
    expect(adr.status).toBe('proposta');
  });

  test('status customizado é preservado', () => {
    const s = novoSistema();
    const adr = s.criar(dadosPadrao({ status: 'aceita' }));
    expect(adr.status).toBe('aceita');
  });

  test('criadoEm é string ISO', () => {
    const s = novoSistema();
    const adr = s.criar(dadosPadrao());
    expect(typeof adr.criadoEm).toBe('string');
    expect(() => new Date(adr.criadoEm)).not.toThrow();
  });

  test('historico começa vazio', () => {
    const s = novoSistema();
    const adr = s.criar(dadosPadrao());
    expect(adr.historico).toEqual([]);
  });
});

describe('atualizar', () => {
  test('atualiza campo da ADR', () => {
    const s = novoSistema();
    s.criar(dadosPadrao());
    const atualizada = s.atualizar('ADR-001', { status: 'aceita' });
    expect(atualizada.status).toBe('aceita');
  });

  test('registra entrada no histórico', () => {
    const s = novoSistema();
    s.criar(dadosPadrao());
    s.atualizar('ADR-001', { status: 'aceita' });
    const hist = s.historico('ADR-001');
    expect(hist.length).toBe(1);
    expect(hist[0].campo).toBe('status');
    expect(hist[0].valorAnterior).toBe('proposta');
    expect(hist[0].valorNovo).toBe('aceita');
    expect(hist[0]).toHaveProperty('atualizadoEm');
  });

  test('múltiplas atualizações acumulam histórico', () => {
    const s = novoSistema();
    s.criar(dadosPadrao());
    s.atualizar('ADR-001', { status: 'aceita' });
    s.atualizar('ADR-001', { status: 'supersedida' });
    expect(s.historico('ADR-001').length).toBe(2);
  });
});

describe('buscar e listar', () => {
  test('buscar retorna ADR por id', () => {
    const s = novoSistema();
    s.criar(dadosPadrao());
    const adr = s.buscar('ADR-001');
    expect(adr).not.toBeNull();
    expect(adr.id).toBe('ADR-001');
  });

  test('buscar retorna null para id inexistente', () => {
    const s = novoSistema();
    expect(s.buscar('ADR-999')).toBeNull();
  });

  test('listar retorna todas as ADRs', () => {
    const s = novoSistema();
    s.criar(dadosPadrao());
    s.criar(dadosPadrao({ titulo: 'Outra' }));
    expect(s.listar().length).toBe(2);
  });

  test('listar filtra por status', () => {
    const s = novoSistema();
    s.criar(dadosPadrao({ status: 'aceita' }));
    s.criar(dadosPadrao({ status: 'proposta', titulo: 'Outra' }));
    const aceitas = s.listar({ status: 'aceita' });
    expect(aceitas.length).toBe(1);
    expect(aceitas[0].status).toBe('aceita');
  });

  test('listar filtra por autor', () => {
    const s = novoSistema();
    s.criar(dadosPadrao({ autor: 'Maria' }));
    s.criar(dadosPadrao({ autor: 'João', titulo: 'Outra' }));
    expect(s.listar({ autor: 'Maria' }).length).toBe(1);
  });
});

describe('superseder', () => {
  test('marca ADR antiga como supersedida', () => {
    const s = novoSistema();
    s.criar(dadosPadrao());
    s.criar(dadosPadrao({ titulo: 'Nova decisão' }));
    s.superseder('ADR-001', 'ADR-002');
    expect(s.buscar('ADR-001').status).toBe('supersedida');
    expect(s.buscar('ADR-001').supersededBy).toBe('ADR-002');
  });

  test('nova ADR registra que supersede a antiga', () => {
    const s = novoSistema();
    s.criar(dadosPadrao());
    s.criar(dadosPadrao({ titulo: 'Nova' }));
    s.superseder('ADR-001', 'ADR-002');
    expect(s.buscar('ADR-002').supersedes).toBe('ADR-001');
  });
});

describe('exportarMarkdown', () => {
  test('retorna string', () => {
    const s = novoSistema();
    s.criar(dadosPadrao());
    expect(typeof s.exportarMarkdown('ADR-001')).toBe('string');
  });

  test('inclui id e titulo no markdown', () => {
    const s = novoSistema();
    s.criar(dadosPadrao());
    const md = s.exportarMarkdown('ADR-001');
    expect(md).toContain('ADR-001');
    expect(md).toContain('Adotar PostgreSQL');
  });

  test('inclui seções de decisão e contexto', () => {
    const s = novoSistema();
    s.criar(dadosPadrao());
    const md = s.exportarMarkdown('ADR-001');
    expect(md).toContain('Contexto');
    expect(md).toContain('Decisão');
  });
});
