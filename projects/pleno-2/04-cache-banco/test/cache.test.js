const RepositorioComCache = require('../cache');

function criarRepoMock() {
  const dados = new Map();
  let nextId = 1;
  return {
    _dados: dados,
    findById: jest.fn(async (id) => dados.get(Number(id)) || null),
    findAll: jest.fn(async (filtros = {}) => {
      const todos = Array.from(dados.values());
      return todos.filter((r) =>
        Object.entries(filtros).every(([k, v]) => r[k] === v)
      );
    }),
    create: jest.fn(async (d) => {
      const r = { id: nextId++, ...d };
      dados.set(r.id, r);
      return r;
    }),
    update: jest.fn(async (id, d) => {
      const r = dados.get(Number(id));
      if (!r) return null;
      const atualizado = { ...r, ...d };
      dados.set(Number(id), atualizado);
      return atualizado;
    }),
    delete: jest.fn(async (id) => {
      const ok = dados.has(Number(id));
      dados.delete(Number(id));
      return ok;
    }),
  };
}

describe('findById — cache', () => {
  test('primeiro acesso vai ao repositório (miss)', async () => {
    const repo = criarRepoMock();
    await repo.create({ nome: 'Ana' });
    const cache = new RepositorioComCache(repo);
    await cache.findById(1);
    expect(repo.findById).toHaveBeenCalledTimes(1);
    expect(cache.estatisticasCache().misses).toBe(1);
  });

  test('segundo acesso usa o cache (hit)', async () => {
    const repo = criarRepoMock();
    await repo.create({ nome: 'Bob' });
    const cache = new RepositorioComCache(repo);
    await cache.findById(1);
    await cache.findById(1);
    expect(repo.findById).toHaveBeenCalledTimes(1); // só 1 vez no repo
    expect(cache.estatisticasCache().hits).toBe(1);
  });

  test('TTL expirado força nova ida ao repositório', async () => {
    jest.useFakeTimers();
    const repo = criarRepoMock();
    await repo.create({ nome: 'Carlos' });
    const cache = new RepositorioComCache(repo, 1000); // TTL de 1 segundo
    await cache.findById(1);
    jest.advanceTimersByTime(1500); // avança 1.5s
    await cache.findById(1);
    expect(repo.findById).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });
});

describe('findAll — cache', () => {
  test('primeiro findAll vai ao repositório', async () => {
    const repo = criarRepoMock();
    const cache = new RepositorioComCache(repo);
    await cache.findAll({});
    expect(repo.findAll).toHaveBeenCalledTimes(1);
  });

  test('segundo findAll com mesmo filtro usa cache', async () => {
    const repo = criarRepoMock();
    const cache = new RepositorioComCache(repo);
    await cache.findAll({ ativo: true });
    await cache.findAll({ ativo: true });
    expect(repo.findAll).toHaveBeenCalledTimes(1);
  });

  test('filtros diferentes usam cache independente', async () => {
    const repo = criarRepoMock();
    const cache = new RepositorioComCache(repo);
    await cache.findAll({ tipo: 'A' });
    await cache.findAll({ tipo: 'B' });
    expect(repo.findAll).toHaveBeenCalledTimes(2);
  });
});

describe('create — invalidação de cache', () => {
  test('create invalida cache de listas', async () => {
    const repo = criarRepoMock();
    const cache = new RepositorioComCache(repo);
    await cache.findAll({});
    await cache.create({ nome: 'Novo' });
    await cache.findAll({});
    expect(repo.findAll).toHaveBeenCalledTimes(2); // reconsulta após create
  });
});

describe('update — invalidação de cache', () => {
  test('update invalida cache do item', async () => {
    const repo = criarRepoMock();
    await repo.create({ nome: 'Original' });
    const cache = new RepositorioComCache(repo);
    await cache.findById(1);
    await cache.update(1, { nome: 'Novo' });
    await cache.findById(1);
    expect(repo.findById).toHaveBeenCalledTimes(2);
  });

  test('update invalida cache de listas', async () => {
    const repo = criarRepoMock();
    await repo.create({ nome: 'Original' });
    const cache = new RepositorioComCache(repo);
    await cache.findAll({});
    await cache.update(1, { nome: 'Atualizado' });
    await cache.findAll({});
    expect(repo.findAll).toHaveBeenCalledTimes(2);
  });
});

describe('delete — invalidação de cache', () => {
  test('delete invalida cache do item e listas', async () => {
    const repo = criarRepoMock();
    await repo.create({ nome: 'Para deletar' });
    const cache = new RepositorioComCache(repo);
    await cache.findById(1);
    await cache.findAll({});
    await cache.delete(1);
    await cache.findById(1);
    await cache.findAll({});
    expect(repo.findById).toHaveBeenCalledTimes(2);
    expect(repo.findAll).toHaveBeenCalledTimes(2);
  });
});

describe('invalidarCache e estatisticasCache', () => {
  test('invalidarCache() sem pattern limpa tudo', async () => {
    const repo = criarRepoMock();
    await repo.create({ nome: 'X' });
    const cache = new RepositorioComCache(repo);
    await cache.findById(1);
    cache.invalidarCache();
    expect(cache.estatisticasCache().tamanho).toBe(0);
  });

  test('estatisticasCache retorna hits, misses e tamanho', async () => {
    const repo = criarRepoMock();
    await repo.create({ nome: 'Y' });
    const cache = new RepositorioComCache(repo);
    await cache.findById(1);
    await cache.findById(1);
    const stats = cache.estatisticasCache();
    expect(stats.hits).toBeGreaterThanOrEqual(1);
    expect(stats.misses).toBeGreaterThanOrEqual(1);
    expect(typeof stats.tamanho).toBe('number');
  });
});
