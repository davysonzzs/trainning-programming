const { string, number, boolean, array, object, validar } = require('../schema');

describe('string()', () => {
  test('valida string simples sem opts', () => {
    const v = string();
    const resultado = v('hello');
    expect(resultado.valido).toBe(true);
    expect(resultado.erros).toHaveLength(0);
  });

  test('falha quando required e valor é undefined', () => {
    const v = string({ required: true });
    const resultado = v(undefined);
    expect(resultado.valido).toBe(false);
    expect(resultado.erros.length).toBeGreaterThan(0);
  });

  test('falha quando required e valor é string vazia', () => {
    const v = string({ required: true });
    const resultado = v('');
    expect(resultado.valido).toBe(false);
  });

  test('falha quando comprimento menor que minLength', () => {
    const v = string({ minLength: 5 });
    const resultado = v('abc');
    expect(resultado.valido).toBe(false);
    expect(resultado.erros[0]).toMatch(/5/);
  });

  test('falha quando comprimento maior que maxLength', () => {
    const v = string({ maxLength: 3 });
    const resultado = v('abcdef');
    expect(resultado.valido).toBe(false);
  });

  test('falha quando pattern não bate', () => {
    const v = string({ pattern: /^\d+$/ });
    const resultado = v('abc123');
    expect(resultado.valido).toBe(false);
  });

  test('aplica transform trim antes de validar', () => {
    const v = string({ transform: 'trim', minLength: 3 });
    const resultado = v('  ab  ');
    expect(resultado.valido).toBe(false); // 'ab' tem 2 chars após trim
    const resultado2 = string({ transform: 'trim' })('  hello  ');
    expect(resultado2.valor).toBe('hello');
  });

  test('campo opcional sem required passa com undefined', () => {
    const v = string({ minLength: 3 });
    const resultado = v(undefined);
    expect(resultado.valido).toBe(true);
  });
});

describe('number()', () => {
  test('valida número simples', () => {
    const v = number();
    expect(v(42).valido).toBe(true);
  });

  test('falha quando required e valor é undefined', () => {
    const v = number({ required: true });
    expect(v(undefined).valido).toBe(false);
  });

  test('falha quando valor menor que min', () => {
    const v = number({ min: 10 });
    expect(v(5).valido).toBe(false);
  });

  test('falha quando valor maior que max', () => {
    const v = number({ max: 100 });
    expect(v(200).valido).toBe(false);
  });

  test('falha quando integer e valor é float', () => {
    const v = number({ integer: true });
    expect(v(3.14).valido).toBe(false);
  });

  test('passa quando integer e valor é inteiro', () => {
    const v = number({ integer: true });
    expect(v(7).valido).toBe(true);
  });
});

describe('boolean()', () => {
  test('valida true', () => {
    expect(boolean()(true).valido).toBe(true);
  });

  test('valida false', () => {
    expect(boolean()(false).valido).toBe(true);
  });

  test('falha quando required e valor é undefined', () => {
    expect(boolean({ required: true })(undefined).valido).toBe(false);
  });
});

describe('array()', () => {
  test('valida array de strings', () => {
    const v = array(string());
    expect(v(['a', 'b', 'c']).valido).toBe(true);
  });

  test('falha quando required e valor é undefined', () => {
    const v = array(string(), { required: true });
    expect(v(undefined).valido).toBe(false);
  });

  test('falha quando array tem menos itens que minLength', () => {
    const v = array(string(), { minLength: 3 });
    expect(v(['a']).valido).toBe(false);
  });

  test('falha quando item do array não passa no validator', () => {
    const v = array(number({ min: 0 }));
    const resultado = v([1, -5, 3]);
    expect(resultado.valido).toBe(false);
  });
});

describe('object() e validar()', () => {
  const schema = object({
    nome: string({ required: true, minLength: 2 }),
    idade: number({ required: true, min: 0 }),
    ativo: boolean(),
  });

  test('valida objeto válido', () => {
    const resultado = schema({ nome: 'Ana', idade: 25, ativo: true });
    expect(resultado.valido).toBe(true);
    expect(Object.keys(resultado.erros).length).toBe(0);
  });

  test('retorna erros por campo quando inválido', () => {
    const resultado = schema({ nome: 'A', idade: -1 });
    expect(resultado.valido).toBe(false);
    expect(resultado.erros.nome).toBeDefined();
    expect(resultado.erros.idade).toBeDefined();
  });

  test('validar() delega para object()', () => {
    const s = object({ titulo: string({ required: true }) });
    const resultado = validar(s, { titulo: 'Olá' });
    expect(resultado.valido).toBe(true);
  });

  test('validar() retorna erros para dados inválidos', () => {
    const s = object({ titulo: string({ required: true }) });
    const resultado = validar(s, {});
    expect(resultado.valido).toBe(false);
    expect(resultado.erros.titulo).toBeDefined();
  });
});
