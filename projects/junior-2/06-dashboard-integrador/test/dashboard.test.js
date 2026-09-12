const { Dashboard } = require('../dashboard');

describe('Dashboard — registrarMetrica', () => {
  let dash;

  beforeEach(() => {
    dash = new Dashboard('dash-test');
  });

  test('deve registrar uma métrica sem erros', () => {
    expect(() => dash.registrarMetrica('cpu', 80)).not.toThrow();
  });

  test('métrica registrada deve aparecer em obterMetricas', () => {
    dash.registrarMetrica('cpu', 80);
    const metricas = dash.obterMetricas();
    expect(metricas).toHaveLength(1);
    expect(metricas[0].nome).toBe('cpu');
    expect(metricas[0].valor).toBe(80);
  });

  test('deve incluir timestamp na métrica', () => {
    dash.registrarMetrica('memoria', 50);
    const m = dash.obterMetricas()[0];
    expect(m.timestamp).toBeDefined();
    expect(typeof m.timestamp).toBe('string');
  });

  test('deve emitir evento "metrica" ao registrar', () => {
    const listener = jest.fn();
    dash.onMetrica(listener);
    dash.registrarMetrica('disco', 70);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0]).toMatchObject({ nome: 'disco', valor: 70 });
  });
});

describe('Dashboard — obterMetricas', () => {
  let dash;

  beforeEach(() => {
    dash = new Dashboard('dash-test-2');
    dash.registrarMetrica('cpu', 80);
    dash.registrarMetrica('cpu', 90);
    dash.registrarMetrica('memoria', 50);
  });

  test('sem filtro deve retornar todas as métricas', () => {
    expect(dash.obterMetricas()).toHaveLength(3);
  });

  test('com filtro de nome deve retornar apenas as métricas daquele nome', () => {
    const cpuMetricas = dash.obterMetricas('cpu');
    expect(cpuMetricas).toHaveLength(2);
    cpuMetricas.forEach(m => expect(m.nome).toBe('cpu'));
  });

  test('filtro por nome inexistente deve retornar array vazio', () => {
    expect(dash.obterMetricas('rede')).toHaveLength(0);
  });
});

describe('Dashboard — calcularEstatisticas', () => {
  let dash;

  beforeEach(() => {
    dash = new Dashboard('dash-test-3');
    dash.registrarMetrica('cpu', 60);
    dash.registrarMetrica('cpu', 80);
    dash.registrarMetrica('cpu', 100);
  });

  test('deve retornar min corretamente', () => {
    expect(dash.calcularEstatisticas('cpu').min).toBe(60);
  });

  test('deve retornar max corretamente', () => {
    expect(dash.calcularEstatisticas('cpu').max).toBe(100);
  });

  test('deve retornar media corretamente', () => {
    expect(dash.calcularEstatisticas('cpu').media).toBeCloseTo(80);
  });

  test('deve retornar total corretamente', () => {
    expect(dash.calcularEstatisticas('cpu').total).toBe(3);
  });

  test('deve retornar null para nome sem métricas', () => {
    expect(dash.calcularEstatisticas('rede')).toBeNull();
  });
});

describe('Dashboard — exportar', () => {
  test('deve agrupar métricas por nome', () => {
    const dash = new Dashboard('dash-test-4');
    dash.registrarMetrica('cpu', 70);
    dash.registrarMetrica('cpu', 80);
    dash.registrarMetrica('memoria', 40);
    const exportado = dash.exportar();
    expect(exportado).toHaveProperty('cpu');
    expect(exportado).toHaveProperty('memoria');
    expect(exportado.cpu).toHaveLength(2);
    expect(exportado.memoria).toHaveLength(1);
  });
});
