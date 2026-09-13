const { HistoricoSprints, Estimador } = require('../estimador');

function historicoComSprints(n, estimativaH = 40, realH = 56, concluidas = 8) {
  const h = new HistoricoSprints();
  for (let i = 0; i < n; i++) {
    h.registrar({ nome: `Sprint ${i + 1}`, estimativaH, realH, tarefas: 10, concluidas });
  }
  return h;
}

describe('HistoricoSprints', () => {
  test('registrar adiciona sprint ao histórico', () => {
    const h = new HistoricoSprints();
    h.registrar({ nome: 'S1', estimativaH: 40, realH: 50, tarefas: 10, concluidas: 8 });
    expect(h.sprints.length).toBe(1);
  });

  test('velocidadeMedia calcula média de concluídas', () => {
    const h = historicoComSprints(3, 40, 50, 8);
    expect(h.velocidadeMedia(5)).toBe(8);
  });

  test('velocidadeMedia usa todas se menos que N', () => {
    const h = historicoComSprints(2, 40, 50, 6);
    expect(h.velocidadeMedia(10)).toBe(6);
  });

  test('velocidadeMedia usa apenas as últimas N', () => {
    const h = new HistoricoSprints();
    h.registrar({ nome: 'S1', estimativaH: 40, realH: 50, tarefas: 10, concluidas: 4 });
    h.registrar({ nome: 'S2', estimativaH: 40, realH: 50, tarefas: 10, concluidas: 10 });
    h.registrar({ nome: 'S3', estimativaH: 40, realH: 50, tarefas: 10, concluidas: 10 });
    // últimas 2: média = 10
    expect(h.velocidadeMedia(2)).toBe(10);
  });

  test('precisaoMedia retorna float arredondado a 2 casas', () => {
    const h = new HistoricoSprints();
    h.registrar({ nome: 'S1', estimativaH: 40, realH: 56, tarefas: 10, concluidas: 8 }); // 1.4
    h.registrar({ nome: 'S2', estimativaH: 40, realH: 44, tarefas: 10, concluidas: 9 }); // 1.1
    // (1.4 + 1.1) / 2 = 1.25
    expect(h.precisaoMedia(5)).toBe(1.25);
  });

  test('precisaoMedia retorna número', () => {
    const h = historicoComSprints(3);
    expect(typeof h.precisaoMedia()).toBe('number');
  });

  test('tendencia retorna string válida', () => {
    const h = historicoComSprints(6);
    const t = h.tendencia();
    expect(['melhorando', 'piorando', 'estavel']).toContain(t);
  });

  test('tendencia estavel com histórico uniforme', () => {
    const h = historicoComSprints(6, 40, 44, 8); // precisão sempre 1.1
    expect(h.tendencia()).toBe('estavel');
  });
});

describe('Estimador', () => {
  function estimadorPadrao() {
    const h = historicoComSprints(3, 40, 40, 8); // precisaoMedia = 1.0
    return new Estimador(h);
  }

  test('estimarTarefa retorna número', () => {
    const e = estimadorPadrao();
    expect(typeof e.estimarTarefa(3, 'media')).toBe('number');
  });

  test('complexidade baixa aplica fator 0.5', () => {
    const h = historicoComSprints(3, 40, 40, 8); // precisao = 1.0
    const e = new Estimador(h);
    // 2 pontos * 0.5 * 1.0 = 1.0
    expect(e.estimarTarefa(2, 'baixa')).toBe(1.0);
  });

  test('complexidade alta aplica fator 2.0', () => {
    const h = historicoComSprints(3, 40, 40, 8); // precisao = 1.0
    const e = new Estimador(h);
    // 3 pontos * 2.0 * 1.0 = 6.0
    expect(e.estimarTarefa(3, 'alta')).toBe(6.0);
  });

  test('estimarSprint retorna estrutura esperada', () => {
    const e = estimadorPadrao();
    const tarefas = [{ titulo: 'A', pontos: 1, complexidade: 'baixa' }];
    const resultado = e.estimarSprint(tarefas, 40);
    expect(resultado).toHaveProperty('estimativaH');
    expect(resultado).toHaveProperty('capacidadeH', 40);
    expect(resultado).toHaveProperty('risco');
    expect(resultado).toHaveProperty('tarefasQueCabem');
    expect(resultado).toHaveProperty('tarefasQueNaoCabem');
  });

  test('risco alto quando estimativa > 90% da capacidade', () => {
    const h = historicoComSprints(3, 40, 80, 8); // precisao = 2.0
    const e = new Estimador(h);
    // tarefa de 10 pontos media = 10 * 1.0 * 2.0 = 20h
    const resultado = e.estimarSprint([{ titulo: 'Grande', pontos: 10, complexidade: 'media' }], 5);
    expect(resultado.risco).toBe('alto');
  });

  test('sugerirCapacidade retorna estrutura esperada', () => {
    const e = estimadorPadrao();
    const resultado = e.sugerirCapacidade(40);
    expect(resultado).toHaveProperty('horasRecomendadas');
    expect(resultado).toHaveProperty('tarefasBaixa');
    expect(resultado).toHaveProperty('tarefasMedia');
    expect(resultado).toHaveProperty('tarefasAlta');
  });

  test('horasRecomendadas é 80% da capacidade', () => {
    const e = estimadorPadrao();
    expect(e.sugerirCapacidade(40).horasRecomendadas).toBe(32);
  });

  test('quantidades de tarefas são inteiros', () => {
    const e = estimadorPadrao();
    const resultado = e.sugerirCapacidade(40);
    expect(Number.isInteger(resultado.tarefasBaixa)).toBe(true);
    expect(Number.isInteger(resultado.tarefasMedia)).toBe(true);
    expect(Number.isInteger(resultado.tarefasAlta)).toBe(true);
  });
});
