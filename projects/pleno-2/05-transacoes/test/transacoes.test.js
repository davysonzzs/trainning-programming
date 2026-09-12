const { criarGerenciadorTransacoes, transferirSaldo } = require('../transacoes');

// Repositório simples em memória para os testes
function criarRepoBanco() {
  const dados = new Map();
  let nextId = 1;
  return {
    _dados: dados,
    _getSnapshot() {
      const snap = new Map();
      dados.forEach((v, k) => snap.set(k, { ...v }));
      return snap;
    },
    _restoreSnapshot(snap) {
      dados.clear();
      snap.forEach((v, k) => dados.set(k, v));
    },
    async create(d) {
      const r = { id: nextId++, ...d };
      dados.set(r.id, r);
      return r;
    },
    async findById(id) {
      return dados.get(Number(id)) || null;
    },
    async update(id, d) {
      const r = dados.get(Number(id));
      if (!r) return null;
      const atualizado = { ...r, ...d };
      dados.set(Number(id), atualizado);
      return atualizado;
    },
    async findAll() { return Array.from(dados.values()); },
  };
}

describe('criarGerenciadorTransacoes — iniciar e rollback', () => {
  test('rollback restaura estado anterior às mudanças', async () => {
    const repo = criarRepoBanco();
    await repo.create({ nome: 'Original', valor: 100 });
    const gt = criarGerenciadorTransacoes({ repo });
    await gt.iniciar();
    await repo.update(1, { valor: 999 });
    await gt.rollback();
    const r = await repo.findById(1);
    expect(r.valor).toBe(100);
  });

  test('commit mantém as mudanças realizadas', async () => {
    const repo = criarRepoBanco();
    await repo.create({ nome: 'Item', valor: 50 });
    const gt = criarGerenciadorTransacoes({ repo });
    await gt.iniciar();
    await repo.update(1, { valor: 200 });
    await gt.commit();
    const r = await repo.findById(1);
    expect(r.valor).toBe(200);
  });

  test('rollback desfaz múltiplas operações', async () => {
    const repo = criarRepoBanco();
    const gt = criarGerenciadorTransacoes({ repo });
    await gt.iniciar();
    await repo.create({ nome: 'A' });
    await repo.create({ nome: 'B' });
    await gt.rollback();
    const todos = await repo.findAll();
    expect(todos).toHaveLength(0);
  });
});

describe('criarGerenciadorTransacoes — executar(fn)', () => {
  test('executar() chama fn com os repositórios', async () => {
    const repo = criarRepoBanco();
    const gt = criarGerenciadorTransacoes({ repo });
    const fn = jest.fn(async (repos) => {
      await repos.repo.create({ x: 1 });
    });
    await gt.executar(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect((await repo.findAll()).length).toBe(1);
  });

  test('executar() faz rollback automaticamente se fn lança erro', async () => {
    const repo = criarRepoBanco();
    await repo.create({ saldo: 1000 });
    const gt = criarGerenciadorTransacoes({ repo });
    await expect(gt.executar(async (repos) => {
      await repos.repo.update(1, { saldo: 0 });
      throw new Error('Falha proposital');
    })).rejects.toThrow('Falha proposital');
    const r = await repo.findById(1);
    expect(r.saldo).toBe(1000); // estado revertido
  });

  test('executar() relança o erro após rollback', async () => {
    const repo = criarRepoBanco();
    const gt = criarGerenciadorTransacoes({ repo });
    await expect(
      gt.executar(async () => { throw new Error('Erro específico'); })
    ).rejects.toThrow('Erro específico');
  });
});

describe('transferirSaldo', () => {
  function criarRepoContas(contas) {
    const repo = criarRepoBanco();
    const promises = contas.map((c) => repo.create(c));
    return { repo, promises };
  }

  test('transfere saldo entre contas com sucesso', async () => {
    const repo = criarRepoBanco();
    const origem = await repo.create({ titular: 'Alice', saldo: 1000 });
    const destino = await repo.create({ titular: 'Bob', saldo: 200 });
    const result = await transferirSaldo(origem.id, destino.id, 300, repo);
    expect(result.sucesso).toBe(true);
    expect(result.novoSaldoOrigem).toBe(700);
    expect(result.novoSaldoDestino).toBe(500);
  });

  test('lança erro quando saldo é insuficiente', async () => {
    const repo = criarRepoBanco();
    const origem = await repo.create({ titular: 'Alice', saldo: 100 });
    const destino = await repo.create({ titular: 'Bob', saldo: 0 });
    await expect(
      transferirSaldo(origem.id, destino.id, 500, repo)
    ).rejects.toThrow('Saldo insuficiente');
  });

  test('lança erro quando conta origem não existe', async () => {
    const repo = criarRepoBanco();
    const destino = await repo.create({ titular: 'Bob', saldo: 0 });
    await expect(
      transferirSaldo(999, destino.id, 100, repo)
    ).rejects.toThrow('Conta origem não encontrada');
  });

  test('lança erro quando conta destino não existe', async () => {
    const repo = criarRepoBanco();
    const origem = await repo.create({ titular: 'Alice', saldo: 500 });
    await expect(
      transferirSaldo(origem.id, 999, 100, repo)
    ).rejects.toThrow('Conta destino não encontrada');
  });

  test('saldos não são alterados quando transferência falha', async () => {
    const repo = criarRepoBanco();
    const origem = await repo.create({ titular: 'Alice', saldo: 50 });
    const destino = await repo.create({ titular: 'Bob', saldo: 200 });
    try {
      await transferirSaldo(origem.id, destino.id, 100, repo);
    } catch (_) {}
    const o = await repo.findById(origem.id);
    const d = await repo.findById(destino.id);
    expect(o.saldo).toBe(50);
    expect(d.saldo).toBe(200);
  });
});

describe('múltiplos repositórios', () => {
  test('rollback afeta todos os repositórios registrados', async () => {
    const repoA = criarRepoBanco();
    const repoB = criarRepoBanco();
    const gt = criarGerenciadorTransacoes({ repoA, repoB });
    await gt.iniciar();
    await repoA.create({ nome: 'A' });
    await repoB.create({ nome: 'B' });
    await gt.rollback();
    expect((await repoA.findAll()).length).toBe(0);
    expect((await repoB.findAll()).length).toBe(0);
  });
});
