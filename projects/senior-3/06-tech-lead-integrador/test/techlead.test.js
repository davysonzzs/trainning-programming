const { TechLead } = require('../techlead');

function novoLead() {
  return new TechLead();
}

function dadosADR(extra = {}) {
  return {
    titulo: 'Adotar Redis',
    contexto: 'Cache de sessão necessário',
    decisao: 'Usar Redis 7',
    consequencias: 'Mais infraestrutura',
    alternativas: ['Memcached'],
    autor: 'Tech Lead',
    ...extra
  };
}

describe('TechLead — constructor', () => {
  test('instancia sem erros', () => {
    expect(() => novoLead()).not.toThrow();
  });

  test('possui propriedades internas inicializadas', () => {
    const lead = novoLead();
    expect(lead.sistemaADR).toBeDefined();
    expect(lead.revisor).toBeDefined();
    expect(lead.historico).toBeDefined();
    expect(lead.estimador).toBeDefined();
  });
});

describe('TechLead — avaliarCodigo', () => {
  test('retorna resultado de análise', () => {
    const lead = novoLead();
    const resultado = lead.avaliarCodigo('const x = 1;', 'app.js');
    expect(resultado).toHaveProperty('arquivo', 'app.js');
    expect(resultado).toHaveProperty('issues');
    expect(resultado).toHaveProperty('aprovado');
    expect(resultado).toHaveProperty('pontuacao');
  });

  test('detecta var como erro', () => {
    const lead = novoLead();
    const resultado = lead.avaliarCodigo('var x = 1;', 'ruim.js');
    expect(resultado.aprovado).toBe(false);
    expect(resultado.issues.some(i => i.severidade === 'erro')).toBe(true);
  });

  test('código limpo é aprovado', () => {
    const lead = novoLead();
    const resultado = lead.avaliarCodigo('const x = 1;\nfunction somar(a, b) { return a + b; }', 'ok.js');
    expect(resultado.aprovado).toBe(true);
  });
});

describe('TechLead — documentarDecisao', () => {
  test('cria ADR e retorna com id', () => {
    const lead = novoLead();
    const adr = lead.documentarDecisao(dadosADR());
    expect(adr).toHaveProperty('id');
    expect(adr.id).toMatch(/^ADR-\d+$/);
  });

  test('múltiplas decisões têm ids sequenciais', () => {
    const lead = novoLead();
    const adr1 = lead.documentarDecisao(dadosADR());
    const adr2 = lead.documentarDecisao(dadosADR({ titulo: 'Outra' }));
    expect(adr1.id).toBe('ADR-001');
    expect(adr2.id).toBe('ADR-002');
  });
});

describe('TechLead — planejarSprint', () => {
  test('retorna plano com risco e tarefas', () => {
    const lead = novoLead();
    const tarefas = [{ titulo: 'Feature A', pontos: 2, complexidade: 'media' }];
    const plano = lead.planejarSprint(tarefas, 40);
    expect(plano).toHaveProperty('estimativaH');
    expect(plano).toHaveProperty('capacidadeH', 40);
    expect(plano).toHaveProperty('risco');
    expect(plano).toHaveProperty('tarefasQueCabem');
  });
});

describe('TechLead — registrarSprintReal', () => {
  test('registra sprint no histórico', () => {
    const lead = novoLead();
    lead.registrarSprintReal({ nome: 'S1', estimativaH: 40, realH: 50, tarefas: 8, concluidas: 7 });
    expect(lead.historico.sprints.length).toBe(1);
  });

  test('múltiplos registros acumulam', () => {
    const lead = novoLead();
    lead.registrarSprintReal({ nome: 'S1', estimativaH: 40, realH: 50, tarefas: 8, concluidas: 7 });
    lead.registrarSprintReal({ nome: 'S2', estimativaH: 40, realH: 44, tarefas: 8, concluidas: 8 });
    expect(lead.historico.sprints.length).toBe(2);
  });
});

describe('TechLead — projetarCapacidade', () => {
  const configCompleta = {
    requisicoesPorSeg: 500,
    latenciaMediaMs: 100,
    disponibilidade: 99.9,
    usuariosAtivos: 50000,
    tamanhoMedioRegistroKB: 2,
    crescimentoDiarioPct: 1
  };

  test('retorna objeto com capacidade e armazenamento', () => {
    const lead = novoLead();
    const resultado = lead.projetarCapacidade(configCompleta);
    expect(resultado).toHaveProperty('capacidade');
    expect(resultado).toHaveProperty('armazenamento');
  });

  test('capacidade tem servidoresNecessarios', () => {
    const lead = novoLead();
    const resultado = lead.projetarCapacidade(configCompleta);
    expect(resultado.capacidade).toHaveProperty('servidoresNecessarios');
  });

  test('armazenamento tem mes12GB', () => {
    const lead = novoLead();
    const resultado = lead.projetarCapacidade(configCompleta);
    expect(resultado.armazenamento).toHaveProperty('mes12GB');
  });
});

describe('TechLead — relatorioTecnico', () => {
  test('retorna string', () => {
    const lead = novoLead();
    expect(typeof lead.relatorioTecnico()).toBe('string');
  });

  test('inclui seção de histórico de sprints', () => {
    const lead = novoLead();
    const rel = lead.relatorioTecnico();
    expect(rel.toUpperCase()).toContain('SPRINT');
  });

  test('inclui seção de ADRs', () => {
    const lead = novoLead();
    const rel = lead.relatorioTecnico();
    expect(rel.toUpperCase()).toContain('ADR');
  });

  test('após registrar dados, relatório reflete histórico', () => {
    const lead = novoLead();
    lead.registrarSprintReal({ nome: 'S1', estimativaH: 40, realH: 50, tarefas: 8, concluidas: 7 });
    lead.documentarDecisao(dadosADR());
    const rel = lead.relatorioTecnico();
    expect(rel).toContain('ADR-001');
  });

  test('relatório com dados tem informações de velocidade', () => {
    const lead = novoLead();
    lead.registrarSprintReal({ nome: 'S1', estimativaH: 40, realH: 40, tarefas: 10, concluidas: 9 });
    const rel = lead.relatorioTecnico();
    expect(rel).toMatch(/velocidade|tarefas|sprint/i);
  });
});
