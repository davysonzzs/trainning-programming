const ServicoEstoque = require('../servico');

const produtosMock = [
  { id: 1, nome: 'Notebook', preco: 3000, estoque: 5, categoria: 'eletronicos' },
  { id: 2, nome: 'Mouse', preco: 80, estoque: 0, categoria: 'eletronicos' },
  { id: 3, nome: 'Mesa', preco: 500, estoque: 10, categoria: 'moveis' },
];

function criarRepoMock(produtos = produtosMock) {
  return {
    findAll: jest.fn().mockResolvedValue([...produtos]),
    findById: jest.fn().mockImplementation(async (id) =>
      produtos.find((p) => p.id === Number(id)) || null
    ),
    create: jest.fn().mockImplementation(async (dados) => ({ id: 99, ...dados })),
    update: jest.fn().mockImplementation(async (id, dados) => {
      const p = produtos.find((p) => p.id === Number(id));
      return p ? { ...p, ...dados } : null;
    }),
    delete: jest.fn().mockResolvedValue(true),
  };
}

describe('listarProdutos', () => {
  test('retorna todos os produtos sem filtros', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    const resultado = await svc.listarProdutos();
    expect(resultado.length).toBe(3);
  });

  test('filtra por categoria', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    const resultado = await svc.listarProdutos({ categoria: 'moveis' });
    expect(resultado.length).toBe(1);
    expect(resultado[0].nome).toBe('Mesa');
  });

  test('filtra produtos em estoque (emEstoque: true)', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    const resultado = await svc.listarProdutos({ emEstoque: true });
    expect(resultado.every((p) => p.estoque > 0)).toBe(true);
    expect(resultado.length).toBe(2);
  });

  test('filtra por precoMin e precoMax', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    const resultado = await svc.listarProdutos({ precoMin: 100, precoMax: 1000 });
    expect(resultado.length).toBe(1);
    expect(resultado[0].nome).toBe('Mesa');
  });
});

describe('buscarProduto', () => {
  test('retorna produto quando encontrado', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    const produto = await svc.buscarProduto(1);
    expect(produto.nome).toBe('Notebook');
  });

  test('lança erro quando produto não encontrado', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    await expect(svc.buscarProduto(999)).rejects.toThrow('Produto não encontrado');
  });
});

describe('criarProduto', () => {
  test('cria produto com dados válidos', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    const produto = await svc.criarProduto({ nome: 'Teclado', preco: 150, estoque: 20 });
    expect(produto.id).toBeDefined();
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  test('lança erro quando nome está ausente', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    await expect(svc.criarProduto({ preco: 100, estoque: 5 })).rejects.toThrow('Nome é obrigatório');
  });

  test('lança erro quando preco <= 0', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    await expect(svc.criarProduto({ nome: 'X', preco: 0, estoque: 5 })).rejects.toThrow('Preço deve ser positivo');
  });

  test('lança erro quando estoque é negativo', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    await expect(svc.criarProduto({ nome: 'X', preco: 10, estoque: -1 })).rejects.toThrow('Estoque não pode ser negativo');
  });
});

describe('atualizarEstoque', () => {
  test('atualiza estoque de produto existente', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    const atualizado = await svc.atualizarEstoque(1, 50);
    expect(atualizado.estoque).toBe(50);
  });

  test('lança erro quando produto não existe', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    await expect(svc.atualizarEstoque(999, 10)).rejects.toThrow();
  });

  test('lança erro quando quantidade é negativa', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    await expect(svc.atualizarEstoque(1, -5)).rejects.toThrow('Quantidade não pode ser negativa');
  });
});

describe('processarVenda', () => {
  test('processa venda com estoque suficiente', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    const resultado = await svc.processarVenda({
      itens: [{ produtoId: 1, quantidade: 2 }],
    });
    expect(resultado.sucesso).toBe(true);
    expect(resultado.total).toBe(6000);
    expect(resultado.itensFaltando).toHaveLength(0);
  });

  test('retorna sucesso false quando produto sem estoque', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    const resultado = await svc.processarVenda({
      itens: [{ produtoId: 2, quantidade: 1 }], // Mouse tem estoque 0
    });
    expect(resultado.sucesso).toBe(false);
    expect(resultado.itensFaltando.length).toBeGreaterThan(0);
  });

  test('não debita estoque se algum item faltar', async () => {
    const repo = criarRepoMock();
    const svc = new ServicoEstoque(repo);
    await svc.processarVenda({
      itens: [
        { produtoId: 1, quantidade: 2 },
        { produtoId: 2, quantidade: 1 }, // falha — sem estoque
      ],
    });
    // repo.update não deve ter sido chamado (rollback lógico)
    expect(repo.update).not.toHaveBeenCalled();
  });
});
