const {
  regraTamanhoCodigo,
  regraVarProibido,
  regraConsoleLog,
  regraNomesClaros,
  regraFuncaoGrande,
  Revisor
} = require('../revisor');

describe('regraTamanhoCodigo', () => {
  test('não reporta se dentro do limite', () => {
    const regra = regraTamanhoCodigo(5);
    expect(regra('a\nb\nc')).toEqual([]);
  });

  test('reporta aviso se excede o limite', () => {
    const regra = regraTamanhoCodigo(2);
    const issues = regra('a\nb\nc');
    expect(issues.length).toBe(1);
    expect(issues[0].severidade).toBe('aviso');
    expect(issues[0].mensagem).toContain('3');
    expect(issues[0].mensagem).toContain('2');
  });

  test('limite padrão é 200', () => {
    const regra = regraTamanhoCodigo();
    const codigo = Array(201).fill('x').join('\n');
    const issues = regra(codigo);
    expect(issues.length).toBe(1);
  });
});

describe('regraVarProibido', () => {
  test('detecta var em linha', () => {
    const regra = regraVarProibido();
    const issues = regra('const x = 1;\nvar y = 2;');
    expect(issues.length).toBe(1);
    expect(issues[0].linha).toBe(2);
    expect(issues[0].severidade).toBe('erro');
  });

  test('detecta múltiplas ocorrências de var', () => {
    const regra = regraVarProibido();
    const issues = regra('var a = 1;\nvar b = 2;');
    expect(issues.length).toBe(2);
  });

  test('não detecta var dentro de palavra (invariante)', () => {
    const regra = regraVarProibido();
    const issues = regra('const invariante = true;');
    expect(issues.length).toBe(0);
  });

  test('não reporta nada sem var', () => {
    const regra = regraVarProibido();
    expect(regra('const x = 1;\nlet y = 2;')).toEqual([]);
  });
});

describe('regraConsoleLog', () => {
  test('detecta console.log', () => {
    const regra = regraConsoleLog();
    const issues = regra('function f() {\n  console.log("x");\n}');
    expect(issues.length).toBe(1);
    expect(issues[0].linha).toBe(2);
    expect(issues[0].severidade).toBe('aviso');
  });

  test('não detecta console.log em comentário de linha', () => {
    const regra = regraConsoleLog();
    const issues = regra('// console.log("isso é comentário")');
    expect(issues.length).toBe(0);
  });

  test('não reporta nada sem console.log', () => {
    const regra = regraConsoleLog();
    expect(regra('const x = 1;')).toEqual([]);
  });
});

describe('regraNomesClaros', () => {
  test('detecta variável de 2 letras não-exceção', () => {
    const regra = regraNomesClaros();
    const issues = regra('const ab = 1;');
    expect(issues.length).toBe(1);
    expect(issues[0].severidade).toBe('sugestao');
    expect(issues[0].mensagem).toContain('ab');
  });

  test('ignora exceções de loop', () => {
    const regra = regraNomesClaros();
    const issues = regra('const i = 0;\nconst j = 1;\nconst k = 2;');
    expect(issues.length).toBe(0);
  });

  test('não reporta variáveis com nome longo', () => {
    const regra = regraNomesClaros();
    expect(regra('const nomeClaro = 1;')).toEqual([]);
  });

  test('exceções customizadas funcionam', () => {
    const regra = regraNomesClaros(['ab']);
    const issues = regra('const ab = 1;');
    expect(issues.length).toBe(0);
  });
});

describe('regraFuncaoGrande', () => {
  test('não reporta função pequena', () => {
    const regra = regraFuncaoGrande(10);
    const codigo = 'function pequena() {\n  return 1;\n}';
    expect(regra(codigo)).toEqual([]);
  });

  test('reporta função grande', () => {
    const regra = regraFuncaoGrande(3);
    const linhas = ['function grande() {'];
    for (let i = 0; i < 5; i++) linhas.push(`  const v${i} = ${i};`);
    linhas.push('}');
    const issues = regra(linhas.join('\n'));
    expect(issues.length).toBe(1);
    expect(issues[0].severidade).toBe('aviso');
    expect(issues[0].mensagem).toContain('grande');
  });
});

describe('Revisor', () => {
  test('analisar retorna estrutura esperada', () => {
    const revisor = new Revisor([regraVarProibido()]);
    const resultado = revisor.analisar('var x = 1;', 'test.js');
    expect(resultado).toHaveProperty('arquivo', 'test.js');
    expect(resultado).toHaveProperty('issues');
    expect(resultado).toHaveProperty('aprovado');
    expect(resultado).toHaveProperty('pontuacao');
  });

  test('aprovado = false se há erros', () => {
    const revisor = new Revisor([regraVarProibido()]);
    const resultado = revisor.analisar('var x = 1;', 'test.js');
    expect(resultado.aprovado).toBe(false);
  });

  test('aprovado = true se sem erros', () => {
    const revisor = new Revisor([regraConsoleLog()]);
    const resultado = revisor.analisar('const x = 1;', 'test.js');
    expect(resultado.aprovado).toBe(true);
  });

  test('pontuacao desconta erros (20), avisos (5) e sugestoes (1)', () => {
    const revisor = new Revisor([regraVarProibido(), regraConsoleLog()]);
    // 1 erro (20) + 1 aviso (5) = 100 - 25 = 75
    const resultado = revisor.analisar('var x = 1;\nconsole.log(x);', 'test.js');
    expect(resultado.pontuacao).toBe(75);
  });

  test('analisarMultiplos retorna contadores', () => {
    const revisor = new Revisor([regraVarProibido()]);
    const resultado = revisor.analisarMultiplos([
      { nome: 'ok.js', codigo: 'const x = 1;' },
      { nome: 'ruim.js', codigo: 'var y = 2;' }
    ]);
    expect(resultado.aprovados).toBe(1);
    expect(resultado.reprovados).toBe(1);
    expect(resultado.totalIssues).toBeGreaterThanOrEqual(1);
  });

  test('gerarRelatorio retorna string', () => {
    const revisor = new Revisor([regraVarProibido()]);
    const resultado = revisor.analisar('var x = 1;', 'test.js');
    expect(typeof revisor.gerarRelatorio(resultado)).toBe('string');
  });
});
