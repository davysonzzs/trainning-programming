const { hash, comparar, gerarSalt, transformar } = require('../hash');

describe('gerarSalt', () => {
  test('gera string com tamanho padrao de 16', () => {
    const salt = gerarSalt();
    expect(salt).toHaveLength(16);
  });

  test('gera string com tamanho customizado', () => {
    expect(gerarSalt(8)).toHaveLength(8);
    expect(gerarSalt(32)).toHaveLength(32);
  });

  test('contem apenas caracteres alfanumericos', () => {
    const salt = gerarSalt(100);
    expect(salt).toMatch(/^[a-zA-Z0-9]+$/);
  });

  test('gera valores diferentes a cada chamada (aleatorio)', () => {
    const salts = new Set(Array.from({ length: 20 }, () => gerarSalt()));
    expect(salts.size).toBeGreaterThan(1);
  });
});

describe('transformar', () => {
  test('e deterministica: mesma entrada sempre retorna mesmo resultado', () => {
    const r1 = transformar('senha123', 10);
    const r2 = transformar('senha123', 10);
    expect(r1).toBe(r2);
  });

  test('rounds diferentes produzem resultados diferentes', () => {
    const r1 = transformar('senha123', 1);
    const r2 = transformar('senha123', 10);
    expect(r1).not.toBe(r2);
  });

  test('textos diferentes produzem resultados diferentes', () => {
    const r1 = transformar('senhaA', 5);
    const r2 = transformar('senhaB', 5);
    expect(r1).not.toBe(r2);
  });

  test('retorna string nao-vazia', () => {
    const r = transformar('abc', 1);
    expect(typeof r).toBe('string');
    expect(r.length).toBeGreaterThan(0);
  });

  test('retorna string hexadecimal valida', () => {
    const r = transformar('teste', 3);
    expect(r).toMatch(/^[0-9a-f]+$/i);
  });
});

describe('hash', () => {
  test('retorna string no formato $devhash$<rounds>$<saltehash>', () => {
    const h = hash('minhasenha');
    expect(h).toMatch(/^\$devhash\$\d+\$.+$/);
  });

  test('usa rounds padrao 10', () => {
    const h = hash('senha');
    expect(h).toMatch(/^\$devhash\$10\$/);
  });

  test('respeita rounds customizados', () => {
    const h = hash('senha', 5);
    expect(h).toMatch(/^\$devhash\$5\$/);
  });

  test('gera hashes diferentes para a mesma senha (salt aleatorio)', () => {
    const h1 = hash('mesmaSenha');
    const h2 = hash('mesmaSenha');
    expect(h1).not.toBe(h2);
  });

  test('hash nao contem a senha em texto puro', () => {
    const senha = 'senha-super-secreta';
    const h = hash(senha);
    expect(h).not.toContain(senha);
  });
});

describe('comparar', () => {
  test('retorna true para senha correta', () => {
    const h = hash('minha123');
    expect(comparar('minha123', h)).toBe(true);
  });

  test('retorna false para senha errada', () => {
    const h = hash('minha123');
    expect(comparar('senha_errada', h)).toBe(false);
  });

  test('retorna false para string vazia', () => {
    const h = hash('minha123');
    expect(comparar('', h)).toBe(false);
  });

  test('funciona com rounds customizados', () => {
    const h = hash('abc', 3);
    expect(comparar('abc', h)).toBe(true);
    expect(comparar('xyz', h)).toBe(false);
  });

  test('hashes diferentes da mesma senha sao ambos validos', () => {
    const h1 = hash('senha');
    const h2 = hash('senha');
    expect(comparar('senha', h1)).toBe(true);
    expect(comparar('senha', h2)).toBe(true);
  });

  test('senha com caracteres especiais', () => {
    const senha = 'P@$$w0rd!#%&*';
    const h = hash(senha);
    expect(comparar(senha, h)).toBe(true);
    expect(comparar('P@$$w0rd', h)).toBe(false);
  });
});
