const { criarLogger, ColetorMetricas, Tracer } = require('../monitoramento');

describe('criarLogger', () => {
  let logger;

  beforeEach(() => {
    logger = criarLogger('pagamento');
  });

  test('registra log info com campos corretos', () => {
    logger.info('pagamento iniciado', { valor: 100 });
    const logs = logger.obterLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      nivel: 'INFO',
      modulo: 'pagamento',
      msg: 'pagamento iniciado',
      meta: { valor: 100 },
    });
    expect(logs[0]).toHaveProperty('timestamp');
  });

  test('registra warn e error', () => {
    logger.warn('timeout detectado');
    logger.error('falha critica', { codigo: 500 });
    const logs = logger.obterLogs();
    expect(logs[0].nivel).toBe('WARN');
    expect(logs[1].nivel).toBe('ERROR');
  });

  test('filtra logs por nivel', () => {
    logger.info('info 1');
    logger.error('error 1');
    logger.info('info 2');
    const infos = logger.obterLogs('INFO');
    expect(infos).toHaveLength(2);
    const errors = logger.obterLogs('ERROR');
    expect(errors).toHaveLength(1);
  });

  test('limpar remove todos os logs', () => {
    logger.info('msg');
    logger.warn('msg2');
    logger.limpar();
    expect(logger.obterLogs()).toHaveLength(0);
  });

  test('modulo e preservado nos logs', () => {
    const loggerA = criarLogger('modulo-a');
    const loggerB = criarLogger('modulo-b');
    loggerA.info('a');
    loggerB.info('b');
    expect(loggerA.obterLogs()[0].modulo).toBe('modulo-a');
    expect(loggerB.obterLogs()[0].modulo).toBe('modulo-b');
  });
});

describe('ColetorMetricas', () => {
  let coletor;

  beforeEach(() => {
    coletor = new ColetorMetricas();
  });

  test('incrementar acumula valores', () => {
    coletor.incrementar('requisicoes');
    coletor.incrementar('requisicoes');
    coletor.incrementar('requisicoes', 5);
    const medicoes = coletor.obter('requisicoes');
    const soma = medicoes.reduce((acc, m) => acc + m.valor, 0);
    expect(soma).toBe(7);
  });

  test('gauge sobrescreve valor anterior', () => {
    coletor.gauge('conexoes', 10);
    coletor.gauge('conexoes', 15);
    const medicoes = coletor.obter('conexoes');
    const ultimo = medicoes[medicoes.length - 1];
    expect(ultimo.valor).toBe(15);
  });

  test('registrarHistograma armazena valores individuais', () => {
    coletor.registrarHistograma('latencia', 100);
    coletor.registrarHistograma('latencia', 200);
    coletor.registrarHistograma('latencia', 150);
    const medicoes = coletor.obter('latencia');
    expect(medicoes).toHaveLength(3);
  });

  test('resumo calcula min, max e count', () => {
    [10, 50, 30, 80, 20, 60, 40, 70, 90, 15].forEach(v =>
      coletor.registrarHistograma('tempo', v)
    );
    const r = coletor.resumo('tempo');
    expect(r.count).toBe(10);
    expect(r.min).toBe(10);
    expect(r.max).toBe(90);
    expect(typeof r.sum).toBe('number');
  });

  test('resumo calcula percentis', () => {
    for (let i = 1; i <= 100; i++) {
      coletor.registrarHistograma('latencia-p', i);
    }
    const r = coletor.resumo('latencia-p');
    expect(r.p50).toBeGreaterThanOrEqual(49);
    expect(r.p50).toBeLessThanOrEqual(51);
    expect(r.p95).toBeGreaterThanOrEqual(94);
    expect(r.p99).toBeGreaterThanOrEqual(98);
  });
});

describe('Tracer', () => {
  let tracer;

  beforeEach(() => {
    tracer = new Tracer();
  });

  test('iniciarSpan retorna span com id e inicio', () => {
    const span = tracer.iniciarSpan('operacao');
    expect(span).toHaveProperty('id');
    expect(span).toHaveProperty('nome', 'operacao');
    expect(span).toHaveProperty('inicio');
    expect(span).toHaveProperty('finalizar');
  });

  test('span raiz tem traceId gerado', () => {
    const span = tracer.iniciarSpan('raiz');
    expect(span).toHaveProperty('traceId');
    expect(typeof span.traceId).toBe('string');
  });

  test('span filho herda traceId do pai', () => {
    const pai = tracer.iniciarSpan('pai');
    const filho = tracer.iniciarSpan('filho', pai.id);
    expect(filho.traceId).toBe(pai.traceId);
  });

  test('finalizar registra duracao', () => {
    const span = tracer.iniciarSpan('op');
    span.finalizar();
    expect(span).toHaveProperty('duracao');
    expect(span.duracao).toBeGreaterThanOrEqual(0);
  });

  test('listarSpans retorna spans do traceId', () => {
    const raiz = tracer.iniciarSpan('raiz');
    tracer.iniciarSpan('filho1', raiz.id);
    tracer.iniciarSpan('filho2', raiz.id);
    const spans = tracer.listarSpans(raiz.traceId);
    expect(spans).toHaveLength(3);
  });

  test('arvore retorna estrutura hierarquica', () => {
    const raiz = tracer.iniciarSpan('raiz');
    raiz.finalizar();
    const filho1 = tracer.iniciarSpan('filho1', raiz.id);
    filho1.finalizar();
    const neto = tracer.iniciarSpan('neto', filho1.id);
    neto.finalizar();

    const arvore = tracer.arvore(raiz.traceId);
    expect(arvore).toHaveLength(1);
    expect(arvore[0].span.nome).toBe('raiz');
    expect(arvore[0].filhos).toHaveLength(1);
    expect(arvore[0].filhos[0].span.nome).toBe('filho1');
    expect(arvore[0].filhos[0].filhos).toHaveLength(1);
  });
});
