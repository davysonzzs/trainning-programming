const { analisarFuncao, RelatorioCobertura, criarSuite } = require('../cobertura');

describe('analisarFuncao', () => {
  const somar = (a, b) => a + b;
  const dobrar = x => x * 2;
  const quebrado = x => { throw new Error('funcao quebrada'); };

  test('retorna passaram e falharam corretamente', () => {
    const resultado = analisarFuncao(somar, [
      { args: [1, 2], esperado: 3 },
      { args: [0, 0], esperado: 0 },
      { args: [5, 3], esperado: 9 }, // vai falhar (resultado real e 8)
    ]);
    expect(resultado.passaram).toBe(2);
    expect(resultado.falharam).toBe(1);
  });

  test('calcula percentual correto', () => {
    const resultado = analisarFuncao(dobrar, [
      { args: [5], esperado: 10 },
      { args: [3], esperado: 6 },
      { args: [2], esperado: 5 }, // falha
    ]);
    expect(resultado.percentual).toBeCloseTo(66.67, 0);
  });

  test('lista detalhes das falhas', () => {
    const resultado = analisarFuncao(somar, [
      { args: [1, 1], esperado: 99 }, // falha
    ]);
    expect(resultado.falhas).toHaveLength(1);
    expect(resultado.falhas[0].args).toEqual([1, 1]);
    expect(resultado.falhas[0].esperado).toBe(99);
    expect(resultado.falhas[0].recebido).toBe(2);
  });

  test('100% quando todos passam', () => {
    const resultado = analisarFuncao(somar, [
      { args: [1, 2], esperado: 3 },
      { args: [5, 5], esperado: 10 },
    ]);
    expect(resultado.passaram).toBe(2);
    expect(resultado.falharam).toBe(0);
    expect(resultado.percentual).toBe(100);
  });

  test('funcao que lanca erro e registrada como falha', () => {
    const resultado = analisarFuncao(quebrado, [
      { args: [1], esperado: 2 },
    ]);
    expect(resultado.falharam).toBe(1);
    expect(resultado.falhas[0]).toHaveProperty('recebido');
  });

  test('compara objetos por valor (igualdade profunda)', () => {
    const fn = x => ({ dobro: x * 2 });
    const resultado = analisarFuncao(fn, [
      { args: [5], esperado: { dobro: 10 } },
    ]);
    expect(resultado.passaram).toBe(1);
  });
});

describe('RelatorioCobertura', () => {
  let relatorio;

  beforeEach(() => {
    relatorio = new RelatorioCobertura();
  });

  test('registra e calcula percentual por modulo', () => {
    relatorio.registrar('carrinho', 'adicionar', true);
    relatorio.registrar('carrinho', 'remover', true);
    relatorio.registrar('carrinho', 'calcularTotal', false);
    expect(relatorio.percentualModulo('carrinho')).toBeCloseTo(66.67, 0);
  });

  test('percentual 100% quando todas passam', () => {
    relatorio.registrar('pagamento', 'cobrar', true);
    relatorio.registrar('pagamento', 'estornar', true);
    expect(relatorio.percentualModulo('pagamento')).toBe(100);
  });

  test('percentual 0% quando todas falham', () => {
    relatorio.registrar('bugado', 'fn1', false);
    relatorio.registrar('bugado', 'fn2', false);
    expect(relatorio.percentualModulo('bugado')).toBe(0);
  });

  test('relatorioCompleto retorna dados consolidados', () => {
    relatorio.registrar('mod-a', 'fn1', true);
    relatorio.registrar('mod-a', 'fn2', false);
    relatorio.registrar('mod-b', 'fn3', true);

    const r = relatorio.relatorioCompleto();
    expect(r.totalFuncoes).toBe(3);
    expect(r.passaram).toBe(2);
    expect(r.falharam).toBe(1);
    expect(r).toHaveProperty('porModulo');
    expect(r.porModulo).toHaveProperty('mod-a');
    expect(r.porModulo).toHaveProperty('mod-b');
  });

  test('percentualGeral calculado corretamente', () => {
    relatorio.registrar('m', 'a', true);
    relatorio.registrar('m', 'b', true);
    relatorio.registrar('m', 'c', false);
    relatorio.registrar('m', 'd', false);
    const r = relatorio.relatorioCompleto();
    expect(r.percentualGeral).toBe(50);
  });

  test('exportarTexto retorna string nao vazia', () => {
    relatorio.registrar('mod', 'fn', true);
    const texto = relatorio.exportarTexto();
    expect(typeof texto).toBe('string');
    expect(texto.length).toBeGreaterThan(0);
  });

  test('exportarTexto contem nome do modulo', () => {
    relatorio.registrar('meu-modulo', 'funcao', true);
    const texto = relatorio.exportarTexto();
    expect(texto).toContain('meu-modulo');
  });
});

describe('criarSuite', () => {
  test('executa testes e retorna resultados', () => {
    const suite = criarSuite('Minha Suite');
    suite.it('soma 1 + 1 = 2', () => {
      if (1 + 1 !== 2) throw new Error('falhou');
    });
    suite.it('soma 2 + 2 = 4', () => {
      if (2 + 2 !== 4) throw new Error('falhou');
    });
    const resultado = suite.run();
    expect(resultado.total).toBe(2);
    expect(resultado.passaram).toBe(2);
    expect(resultado.falharam).toBe(0);
  });

  test('registra falhas quando teste lanca erro', () => {
    const suite = criarSuite('Suite com falha');
    suite.it('teste que falha', () => {
      throw new Error('erro proposital');
    });
    const resultado = suite.run();
    expect(resultado.falharam).toBe(1);
    expect(resultado.resultados[0].passou).toBe(false);
    expect(resultado.resultados[0].erro).toContain('erro proposital');
  });

  test('descricao da suite e retornada no resultado', () => {
    const suite = criarSuite('Suite Especial');
    const resultado = suite.run();
    expect(resultado.descricao).toBe('Suite Especial');
  });

  test('mistura de testes passando e falhando', () => {
    const suite = criarSuite('Mista');
    suite.it('passa', () => { /* ok */ });
    suite.it('falha', () => { throw new Error('x'); });
    suite.it('passa tambem', () => { /* ok */ });
    const resultado = suite.run();
    expect(resultado.passaram).toBe(2);
    expect(resultado.falharam).toBe(1);
  });
});
