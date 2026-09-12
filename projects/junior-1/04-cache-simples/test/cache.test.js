const { criarCache } = require('../cache');

// Utilitário: cria uma função "agora" controlável manualmente
function criarRelogio(inicio = 0) {
  let tempo = inicio;
  return {
    agora: () => tempo,
    avancar: (ms) => { tempo += ms; },
  };
}

// ─── set e get básicos ───────────────────────────────────────────────────────

describe('set e get básicos', () => {
  test('armazena e recupera um valor', () => {
    const relogio = criarRelogio();
    const cache = criarCache(1000, relogio.agora);
    cache.set('chave', 'valor');
    expect(cache.get('chave')).toBe('valor');
  });

  test('armazena e recupera objeto', () => {
    const relogio = criarRelogio();
    const cache = criarCache(1000, relogio.agora);
    const obj = { id: 1, nome: 'teste' };
    cache.set('obj', obj);
    expect(cache.get('obj')).toEqual(obj);
  });

  test('retorna null para chave inexistente', () => {
    const cache = criarCache(1000);
    expect(cache.get('inexistente')).toBeNull();
  });

  test('sobrescreve valor existente', () => {
    const relogio = criarRelogio();
    const cache = criarCache(1000, relogio.agora);
    cache.set('x', 'primeiro');
    cache.set('x', 'segundo');
    expect(cache.get('x')).toBe('segundo');
  });
});

// ─── expiração ───────────────────────────────────────────────────────────────

describe('expiração (TTL)', () => {
  test('retorna null após expiração', () => {
    const relogio = criarRelogio(0);
    const cache = criarCache(500, relogio.agora);
    cache.set('token', 'abc123');
    relogio.avancar(500); // avança exatamente até o limite
    expect(cache.get('token')).toBeNull();
  });

  test('ainda retorna valor antes de expirar', () => {
    const relogio = criarRelogio(0);
    const cache = criarCache(500, relogio.agora);
    cache.set('token', 'abc123');
    relogio.avancar(499);
    expect(cache.get('token')).toBe('abc123');
  });

  test('entradas diferentes expiram de forma independente', () => {
    const relogio = criarRelogio(0);
    const cache = criarCache(1000, relogio.agora);
    cache.set('a', 'valor-a');
    relogio.avancar(500);
    cache.set('b', 'valor-b'); // inserido 500ms depois
    relogio.avancar(600);     // total: 1100ms desde 'a', 600ms desde 'b'
    expect(cache.get('a')).toBeNull();   // expirou
    expect(cache.get('b')).toBe('valor-b'); // ainda válido
  });
});

// ─── has ─────────────────────────────────────────────────────────────────────

describe('has', () => {
  test('retorna true para chave existente e válida', () => {
    const relogio = criarRelogio(0);
    const cache = criarCache(1000, relogio.agora);
    cache.set('key', 42);
    expect(cache.has('key')).toBe(true);
  });

  test('retorna false para chave inexistente', () => {
    const cache = criarCache(1000);
    expect(cache.has('fantasma')).toBe(false);
  });

  test('retorna false para chave expirada', () => {
    const relogio = criarRelogio(0);
    const cache = criarCache(100, relogio.agora);
    cache.set('key', 'valor');
    relogio.avancar(200);
    expect(cache.has('key')).toBe(false);
  });
});

// ─── delete ──────────────────────────────────────────────────────────────────

describe('delete', () => {
  test('remove entrada existente e retorna true', () => {
    const relogio = criarRelogio(0);
    const cache = criarCache(1000, relogio.agora);
    cache.set('x', 'y');
    expect(cache.delete('x')).toBe(true);
    expect(cache.get('x')).toBeNull();
  });

  test('retorna false para chave inexistente', () => {
    const cache = criarCache(1000);
    expect(cache.delete('naoExiste')).toBe(false);
  });
});

// ─── limpar ──────────────────────────────────────────────────────────────────

describe('limpar', () => {
  test('remove apenas entradas expiradas', () => {
    const relogio = criarRelogio(0);
    const cache = criarCache(1000, relogio.agora);
    cache.set('a', 1);
    cache.set('b', 2);
    relogio.avancar(1100); // expira 'a' e 'b'
    cache.set('c', 3);     // válido
    const removidos = cache.limpar();
    expect(removidos).toBe(2);
    expect(cache.get('c')).toBe(3);
  });

  test('retorna 0 quando não há expirados', () => {
    const relogio = criarRelogio(0);
    const cache = criarCache(5000, relogio.agora);
    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.limpar()).toBe(0);
  });
});

// ─── tamanho ─────────────────────────────────────────────────────────────────

describe('tamanho', () => {
  test('retorna 0 para cache vazio', () => {
    const cache = criarCache(1000);
    expect(cache.tamanho()).toBe(0);
  });

  test('conta apenas entradas não expiradas', () => {
    const relogio = criarRelogio(0);
    const cache = criarCache(500, relogio.agora);
    cache.set('a', 1);
    cache.set('b', 2);
    relogio.avancar(600); // expira 'a' e 'b'
    cache.set('c', 3);    // válido
    expect(cache.tamanho()).toBe(1);
  });

  test('aumenta ao adicionar entradas válidas', () => {
    const relogio = criarRelogio(0);
    const cache = criarCache(1000, relogio.agora);
    cache.set('x', 1);
    cache.set('y', 2);
    expect(cache.tamanho()).toBe(2);
  });

  test('diminui após delete', () => {
    const relogio = criarRelogio(0);
    const cache = criarCache(1000, relogio.agora);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.delete('a');
    expect(cache.tamanho()).toBe(1);
  });
});
