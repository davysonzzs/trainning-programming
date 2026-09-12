const { SistemaDevOps } = require('../devops');

describe('SistemaDevOps', () => {
  let sistema;

  beforeEach(() => {
    sistema = new SistemaDevOps();
  });

  describe('executarPipeline', () => {
    test('retorna aprovado=true quando todos os testes passam', async () => {
      const resultado = await sistema.executarPipeline('modulo.js', [
        () => true,
        () => true,
        () => true,
      ]);
      expect(resultado.aprovado).toBe(true);
    });

    test('retorna aprovado=false quando algum teste falha', async () => {
      const resultado = await sistema.executarPipeline('bugado.js', [
        () => true,
        () => false,
      ]);
      expect(resultado.aprovado).toBe(false);
    });

    test('retorna metricas corretas', async () => {
      const resultado = await sistema.executarPipeline('app.js', [
        () => true,
        () => true,
        () => false,
      ]);
      expect(resultado.metricas.total).toBe(3);
      expect(resultado.metricas.passaram).toBe(2);
      expect(resultado.metricas.falharam).toBe(1);
      expect(typeof resultado.metricas.cobertura).toBe('number');
    });

    test('retorna relatorio como string', async () => {
      const resultado = await sistema.executarPipeline('app.js', [() => true]);
      expect(typeof resultado.relatorio).toBe('string');
      expect(resultado.relatorio.length).toBeGreaterThan(0);
    });

    test('pipeline vazio e aprovado por padrao', async () => {
      const resultado = await sistema.executarPipeline('vazio.js', []);
      expect(resultado.aprovado).toBe(true);
      expect(resultado.metricas.total).toBe(0);
    });
  });

  describe('deployar', () => {
    test('bloqueia deploy se pipeline nao foi executado', async () => {
      await expect(sistema.deployar('1.0.0', 'staging')).rejects.toThrow(/bloqueado/i);
    });

    test('bloqueia deploy se ultimo pipeline falhou', async () => {
      await sistema.executarPipeline('app.js', [() => false]);
      await expect(sistema.deployar('1.0.0', 'producao')).rejects.toThrow(/bloqueado/i);
    });

    test('permite deploy se ultimo pipeline foi aprovado', async () => {
      await sistema.executarPipeline('app.js', [() => true]);
      const resultado = await sistema.deployar('1.0.0', 'staging');
      expect(resultado.sucesso).toBe(true);
      expect(resultado.versao).toBe('1.0.0');
      expect(resultado.ambiente).toBe('staging');
    });

    test('retorna duracao do deploy', async () => {
      await sistema.executarPipeline('app.js', [() => true]);
      const resultado = await sistema.deployar('1.0.0', 'staging');
      expect(typeof resultado.duracao).toBe('number');
    });
  });

  describe('dashboard', () => {
    test('retorna string nao vazia', () => {
      const dash = sistema.dashboard();
      expect(typeof dash).toBe('string');
      expect(dash.length).toBeGreaterThan(0);
    });

    test('contem contagem de pipelines executados', async () => {
      await sistema.executarPipeline('a.js', [() => true]);
      await sistema.executarPipeline('b.js', [() => false]);
      const dash = sistema.dashboard();
      expect(dash).toMatch(/2/);
    });

    test('contem informacoes de deploy apos deployar', async () => {
      await sistema.executarPipeline('app.js', [() => true]);
      await sistema.deployar('2.0.0', 'staging');
      const dash = sistema.dashboard();
      expect(dash).toContain('2.0.0');
    });

    test('mostra taxa de sucesso', async () => {
      await sistema.executarPipeline('a.js', [() => true]);
      await sistema.executarPipeline('b.js', [() => true]);
      await sistema.executarPipeline('c.js', [() => false]);
      const dash = sistema.dashboard();
      expect(dash).toMatch(/66[.,]?7?%|67%/); // 2/3 = 66.7%
    });
  });
});
