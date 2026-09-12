const { Storage, criarStorage } = require('../storage');

describe('Storage — operações básicas', () => {
  let s;

  beforeEach(() => {
    s = new Storage('teste');
  });

  test('deve inicializar com zero itens', () => {
    expect(s.length()).toBe(0);
  });

  test('setItem e getItem devem funcionar para string', () => {
    s.setItem('nome', 'Ana');
    expect(s.getItem('nome')).toBe('Ana');
  });

  test('setItem e getItem devem funcionar para número', () => {
    s.setItem('idade', 30);
    expect(s.getItem('idade')).toBe(30);
  });

  test('setItem e getItem devem funcionar para objeto', () => {
    const obj = { a: 1, b: [1, 2] };
    s.setItem('config', obj);
    expect(s.getItem('config')).toEqual(obj);
  });

  test('setItem e getItem devem funcionar para boolean', () => {
    s.setItem('ativo', false);
    expect(s.getItem('ativo')).toBe(false);
  });

  test('getItem deve retornar null para chave inexistente', () => {
    expect(s.getItem('inexistente')).toBeNull();
  });

  test('removeItem deve remover e retornar true', () => {
    s.setItem('x', 1);
    expect(s.removeItem('x')).toBe(true);
    expect(s.getItem('x')).toBeNull();
  });

  test('removeItem deve retornar false para chave inexistente', () => {
    expect(s.removeItem('nao-existe')).toBe(false);
  });

  test('length deve refletir a quantidade de itens', () => {
    s.setItem('a', 1);
    s.setItem('b', 2);
    expect(s.length()).toBe(2);
    s.removeItem('a');
    expect(s.length()).toBe(1);
  });

  test('keys deve retornar chaves sem prefixo', () => {
    s.setItem('chave1', 'v1');
    s.setItem('chave2', 'v2');
    const chaves = s.keys();
    expect(chaves).toContain('chave1');
    expect(chaves).toContain('chave2');
    expect(chaves.some(k => k.includes(':'))).toBe(false);
  });

  test('clear deve remover todos os itens do namespace', () => {
    s.setItem('x', 1);
    s.setItem('y', 2);
    s.clear();
    expect(s.length()).toBe(0);
  });
});

describe('Storage — isolamento de namespaces', () => {
  test('namespaces diferentes não devem interferir', () => {
    const s1 = new Storage('modA');
    const s2 = new Storage('modB');
    s1.setItem('token', 'abc');
    expect(s2.getItem('token')).toBeNull();
  });

  test('clear de um namespace não deve apagar o outro', () => {
    const s1 = new Storage('modA');
    const s2 = new Storage('modB');
    s1.setItem('k', 1);
    s2.setItem('k', 2);
    s1.clear();
    expect(s2.getItem('k')).toBe(2);
    expect(s1.getItem('k')).toBeNull();
  });
});

describe('criarStorage', () => {
  test('deve retornar instância de Storage', () => {
    const s = criarStorage('auth');
    expect(s).toBeInstanceOf(Storage);
  });

  test('instância criada deve usar o namespace fornecido', () => {
    const s = criarStorage('auth');
    s.setItem('user', 'joao');
    expect(s.getItem('user')).toBe('joao');
  });
});
