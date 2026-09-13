const {
  medirTempo,
  compararAlgoritmos,
  analisarCrescimento,
  Benchmark
} = require('../complexidade');

describe('medirTempo', () => {
  test('retorna objeto com media, min, max, p95', () => {
    const resultado = medirTempo((a, b) => a + b, [1, 2], 10);
    expect(resultado).toHaveProperty('media');
    expect(resultado).toHaveProperty('min');
    expect(resultado).toHaveProperty('max');
    expect(resultado).toHaveProperty('p95');
  });

  test('todos os valores são números não-negativos', () => {
    const resultado = medirTempo(() => {}, [], 20);
    expect(typeof resultado.media).toBe('number');
    expect(typeof resultado.min).toBe('number');
    expect(typeof resultado.max).toBe('number');
    expect(typeof resultado.p95).toBe('number');
    expect(resultado.min).toBeGreaterThanOrEqual(0);
    expect(resultado.max).toBeGreaterThanOrEqual(resultado.min);
    expect(resultado.media).toBeGreaterThanOrEqual(resultado.min);
    expect(resultado.media).toBeLessThanOrEqual(resultado.max);
  });

  test('usa o número de repetições informado', () => {
    let contador = 0;
    medirTempo(() => { contador++; }, [], 37);
    expect(contador).toBe(37);
  });

  test('repetições padrão é 100', () => {
    let contador = 0;
    medirTempo(() => { contador++; }, []);
    expect(contador).toBe(100);
  });

  test('p95 não é maior que max', () => {
    const resultado = medirTempo(() => {}, [], 50);
    expect(resultado.p95).toBeLessThanOrEqual(resultado.max);
    expect(resultado.p95).toBeGreaterThanOrEqual(resultado.min);
  });
});

describe('compararAlgoritmos', () => {
  const impls = {
    lento: (n) => { let s = 0; for (let i = 0; i < n; i++) s += i; return s; },
    rapido: (n) => (n * (n - 1)) / 2
  };

  const casos = [
    { args: [100], descricao: 'n=100' },
    { args: [500], descricao: 'n=500' }
  ];

  test('retorna chave para cada caso de teste', () => {
    const resultado = compararAlgoritmos(impls, casos);
    expect(resultado).toHaveProperty('n=100');
    expect(resultado).toHaveProperty('n=500');
  });

  test('cada caso tem vencedor e tempos', () => {
    const resultado = compararAlgoritmos(impls, casos);
    const caso = resultado['n=100'];
    expect(caso).toHaveProperty('vencedor');
    expect(caso).toHaveProperty('tempos');
    expect(caso.tempos).toHaveProperty('lento');
    expect(caso.tempos).toHaveProperty('rapido');
  });

  test('vencedor é um dos nomes de implementação', () => {
    const resultado = compararAlgoritmos(impls, casos);
    expect(['lento', 'rapido']).toContain(resultado['n=100'].vencedor);
  });

  test('tempos são números não-negativos', () => {
    const resultado = compararAlgoritmos(impls, casos);
    const tempos = resultado['n=100'].tempos;
    Object.values(tempos).forEach(t => {
      expect(typeof t).toBe('number');
      expect(t).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('analisarCrescimento', () => {
  test('retorna estrutura esperada', () => {
    const resultado = analisarCrescimento(arr => arr.length, [10, 20, 40]);
    expect(resultado).toHaveProperty('tamanhos');
    expect(resultado).toHaveProperty('tempos');
    expect(resultado).toHaveProperty('razoes');
    expect(resultado).toHaveProperty('complexidadeInferida');
  });

  test('tamanhos no resultado batem com entrada', () => {
    const tamanhos = [100, 200, 400];
    const resultado = analisarCrescimento(arr => arr.length, tamanhos);
    expect(resultado.tamanhos).toEqual(tamanhos);
  });

  test('primeira razão é null', () => {
    const resultado = analisarCrescimento(arr => arr.length, [100, 200]);
    expect(resultado.razoes[0]).toBeNull();
  });

  test('complexidadeInferida é string', () => {
    const resultado = analisarCrescimento(arr => arr.length, [100, 200, 400]);
    expect(typeof resultado.complexidadeInferida).toBe('string');
  });

  test('função O(1) infere O(1)', () => {
    const resultado = analisarCrescimento(arr => 42, [100, 200, 400, 800]);
    expect(resultado.complexidadeInferida).toBe('O(1)');
  });
});

describe('Benchmark', () => {
  test('instancia corretamente', () => {
    const bench = new Benchmark('teste');
    expect(bench).toBeDefined();
  });

  test('adicionar e executar sem erros', () => {
    const bench = new Benchmark('soma');
    bench.adicionar('loop', arr => { let s = 0; arr.forEach(x => s += x); return s; });
    expect(() => bench.executar([10, 100])).not.toThrow();
  });

  test('relatorio retorna string', () => {
    const bench = new Benchmark('bench');
    bench.adicionar('fn', arr => arr.length);
    bench.executar([50, 100]);
    const rel = bench.relatorio();
    expect(typeof rel).toBe('string');
  });

  test('relatorio inclui nome do benchmark', () => {
    const bench = new Benchmark('meu-bench');
    bench.adicionar('fn', arr => arr.length);
    bench.executar([10]);
    expect(bench.relatorio()).toContain('meu-bench');
  });

  test('relatorio inclui os tamanhos executados', () => {
    const bench = new Benchmark('tamanhos');
    bench.adicionar('fn', arr => arr.length);
    bench.executar([100, 1000]);
    const rel = bench.relatorio();
    expect(rel).toContain('100');
    expect(rel).toContain('1000');
  });
});
