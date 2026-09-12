const {
  criarPipeline,
  stageLint,
  stageTestes,
  stageBuild,
  stageVerificarCoverage,
} = require('../pipeline');

describe('criarPipeline', () => {
  test('executa pipeline simples com sucesso', async () => {
    const pipeline = criarPipeline({ nome: 'CI', stages: [] });
    pipeline.adicionarStage({
      nome: 'etapa-1',
      executar: async () => ({ ok: true }),
      abortar_se_falha: false,
    });
    const resultado = await pipeline.executar({ versao: '1.0.0' });
    expect(resultado.sucesso).toBe(true);
    expect(resultado.stages[0].status).toBe('passou');
    expect(resultado.stages[0].resultado).toEqual({ ok: true });
  });

  test('stages recebem contexto com input e resultados anteriores', async () => {
    const pipeline = criarPipeline({ nome: 'Contexto', stages: [] });
    let contextoRecebido;
    pipeline.adicionarStage({
      nome: 'primeiro',
      executar: async () => 'resultado-do-primeiro',
      abortar_se_falha: false,
    });
    pipeline.adicionarStage({
      nome: 'segundo',
      executar: async (ctx) => { contextoRecebido = ctx; return 'ok'; },
      abortar_se_falha: false,
    });
    await pipeline.executar({ entrada: 42 });
    expect(contextoRecebido.input).toEqual({ entrada: 42 });
    expect(contextoRecebido.resultados['primeiro']).toBe('resultado-do-primeiro');
  });

  test('stage que falha sem abortar nao para o pipeline', async () => {
    const pipeline = criarPipeline({ nome: 'Continua', stages: [] });
    pipeline.adicionarStage({
      nome: 'falha',
      executar: async () => { throw new Error('erro no stage'); },
      abortar_se_falha: false,
    });
    pipeline.adicionarStage({
      nome: 'continua',
      executar: async () => 'ainda roda',
      abortar_se_falha: false,
    });
    const resultado = await pipeline.executar({});
    expect(resultado.stages[0].status).toBe('falhou');
    expect(resultado.stages[1].status).toBe('passou');
  });

  test('stage com abortar_se_falha=true para o pipeline', async () => {
    const pipeline = criarPipeline({ nome: 'Aborta', stages: [] });
    pipeline.adicionarStage({
      nome: 'critico',
      executar: async () => { throw new Error('falha critica'); },
      abortar_se_falha: true,
    });
    pipeline.adicionarStage({
      nome: 'nao-deve-rodar',
      executar: async () => 'nunca chega aqui',
      abortar_se_falha: false,
    });
    const resultado = await pipeline.executar({});
    expect(resultado.sucesso).toBe(false);
    expect(resultado.stages[0].status).toBe('falhou');
    expect(resultado.stages[1].status).toBe('pulado');
  });

  test('mede duracao total do pipeline', async () => {
    const pipeline = criarPipeline({ nome: 'Tempo', stages: [] });
    pipeline.adicionarStage({
      nome: 'rapido',
      executar: async () => 'ok',
      abortar_se_falha: false,
    });
    const resultado = await pipeline.executar({});
    expect(typeof resultado.duracao).toBe('number');
    expect(resultado.duracao).toBeGreaterThanOrEqual(0);
  });

  test('mede duracao de cada stage', async () => {
    const pipeline = criarPipeline({ nome: 'TempoPorStage', stages: [] });
    pipeline.adicionarStage({
      nome: 'stage',
      executar: async () => 'ok',
      abortar_se_falha: false,
    });
    const resultado = await pipeline.executar({});
    expect(typeof resultado.stages[0].duracao).toBe('number');
  });

  test('relatorio retorna string', async () => {
    const pipeline = criarPipeline({ nome: 'Relatorio', stages: [] });
    pipeline.adicionarStage({ nome: 's1', executar: async () => 'ok', abortar_se_falha: false });
    const resultado = await pipeline.executar({});
    const texto = pipeline.relatorio(resultado);
    expect(typeof texto).toBe('string');
    expect(texto.length).toBeGreaterThan(0);
  });
});

describe('stageLint', () => {
  test('aprova arquivos validos', async () => {
    const stage = stageLint(['src/index.js', 'src/utils.js']);
    const resultado = await stage.executar({ input: {}, resultados: {} });
    expect(resultado.passou).toBe(true);
  });

  test('rejeita arquivos invalidos', async () => {
    const stage = stageLint(['', null, 'valido.js']);
    await expect(stage.executar({ input: {}, resultados: {} })).rejects.toThrow();
  });
});

describe('stageTestes', () => {
  test('passa quando todos os testes passam', async () => {
    const stage = stageTestes([() => true, () => true]);
    const resultado = await stage.executar({ input: {}, resultados: {} });
    expect(resultado.passou).toBe(true);
    expect(resultado.passaram).toBe(2);
  });

  test('falha quando algum teste falha', async () => {
    const stage = stageTestes([() => true, () => false]);
    await expect(stage.executar({ input: {}, resultados: {} })).rejects.toThrow();
  });
});

describe('stageBuild', () => {
  test('transforma entradas em artefatos', async () => {
    const stage = stageBuild(['index.js', 'utils.js']);
    const resultado = await stage.executar({ input: {}, resultados: {} });
    expect(resultado.artefatos).toHaveLength(2);
    expect(resultado.artefatos[0]).toContain('compiled');
  });
});

describe('stageVerificarCoverage', () => {
  test('passa quando coverage >= minimo', async () => {
    const stage = stageVerificarCoverage(80, 95);
    const resultado = await stage.executar({ input: {}, resultados: {} });
    expect(resultado.passou).toBe(true);
    expect(resultado.percentual).toBe(95);
  });

  test('falha quando coverage < minimo', async () => {
    const stage = stageVerificarCoverage(80, 70);
    await expect(stage.executar({ input: {}, resultados: {} })).rejects.toThrow(/insuficiente/i);
  });
});
