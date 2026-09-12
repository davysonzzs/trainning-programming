const {
  Produto,
  CriarProduto,
  BuscarProdutos,
  AtualizarEstoque,
  apresentadorProduto,
  parsearEntradaProduto,
} = require('../arquitetura');

// Repositorio in-memory para testes (injecao de dependencia)
function criarRepositorioFake() {
  const dados = {};
  let nextId = 1;
  return {
    async salvar(produto) {
      const id = produto.id || `prod-${nextId++}`;
      const salvo = { ...produto, id };
      dados[id] = salvo;
      return salvo;
    },
    async buscarPorId(id) {
      return dados[id] || null;
    },
    async listar(filtros = {}) {
      let lista = Object.values(dados);
      if (filtros.categoria) {
        lista = lista.filter(p => p.categoria === filtros.categoria);
      }
      if (filtros.disponiveis) {
        lista = lista.filter(p => p.estoque > 0);
      }
      return lista;
    },
    async atualizar(id, dadosAtualizados) {
      if (!dados[id]) return null;
      dados[id] = { ...dados[id], ...dadosAtualizados };
      return dados[id];
    },
    _limpar() { Object.keys(dados).forEach(k => delete dados[k]); nextId = 1; },
  };
}

describe('Produto (Entity)', () => {
  test('cria produto com dados validos', () => {
    const p = new Produto({ id: '1', nome: 'Teclado', preco: 150, estoque: 10, categoria: 'hardware' });
    expect(p.nome).toBe('Teclado');
    expect(p.preco).toBe(150);
  });

  test('validar() lanca erro se nome vazio', () => {
    const p = new Produto({ nome: '', preco: 10, estoque: 5 });
    expect(() => p.validar()).toThrow();
  });

  test('validar() lanca erro se preco <= 0', () => {
    const p = new Produto({ nome: 'Mouse', preco: 0, estoque: 5 });
    expect(() => p.validar()).toThrow();
  });

  test('validar() lanca erro se estoque negativo', () => {
    const p = new Produto({ nome: 'Mouse', preco: 50, estoque: -1 });
    expect(() => p.validar()).toThrow();
  });

  test('validar() nao lanca erro para produto valido', () => {
    const p = new Produto({ nome: 'Monitor', preco: 999, estoque: 0 });
    expect(() => p.validar()).not.toThrow();
  });

  test('aplicarDesconto retorna novo preco sem mutar o objeto', () => {
    const p = new Produto({ nome: 'Mouse', preco: 100, estoque: 5 });
    const novoPreco = p.aplicarDesconto(10);
    expect(novoPreco).toBe(90);
    expect(p.preco).toBe(100); // nao mutou
  });

  test('aplicarDesconto lanca erro para percentual invalido', () => {
    const p = new Produto({ nome: 'Mouse', preco: 100, estoque: 5 });
    expect(() => p.aplicarDesconto(0)).toThrow();
    expect(() => p.aplicarDesconto(100)).toThrow();
    expect(() => p.aplicarDesconto(-5)).toThrow();
  });

  test('estaDisponivel retorna true se estoque > 0', () => {
    const p = new Produto({ nome: 'Mouse', preco: 50, estoque: 1 });
    expect(p.estaDisponivel()).toBe(true);
  });

  test('estaDisponivel retorna false se estoque = 0', () => {
    const p = new Produto({ nome: 'Mouse', preco: 50, estoque: 0 });
    expect(p.estaDisponivel()).toBe(false);
  });
});

describe('CriarProduto (Use Case)', () => {
  let repo, useCase;

  beforeEach(() => {
    repo = criarRepositorioFake();
    useCase = new CriarProduto(repo);
  });

  test('cria e retorna produto valido', async () => {
    const resultado = await useCase.executar({ nome: 'Teclado', preco: 150, estoque: 10, categoria: 'hardware' });
    expect(resultado).toHaveProperty('id');
    expect(resultado.nome).toBe('Teclado');
  });

  test('lanca erro para dados invalidos', async () => {
    await expect(useCase.executar({ nome: '', preco: 150, estoque: 10 })).rejects.toThrow();
  });
});

describe('BuscarProdutos (Use Case)', () => {
  let repo, useCase;

  beforeEach(async () => {
    repo = criarRepositorioFake();
    useCase = new BuscarProdutos(repo);
    const criar = new CriarProduto(repo);
    await criar.executar({ nome: 'Teclado', preco: 150, estoque: 10, categoria: 'hardware' });
    await criar.executar({ nome: 'Mouse', preco: 80, estoque: 0, categoria: 'hardware' });
    await criar.executar({ nome: 'Mesa', preco: 500, estoque: 5, categoria: 'moveis' });
  });

  test('retorna todos os produtos sem filtro', async () => {
    const lista = await useCase.executar();
    expect(lista).toHaveLength(3);
  });

  test('filtra por categoria', async () => {
    const lista = await useCase.executar({ categoria: 'hardware' });
    expect(lista).toHaveLength(2);
  });

  test('filtra produtos disponiveis', async () => {
    const lista = await useCase.executar({ disponiveis: true });
    expect(lista.every(p => p.estoque > 0)).toBe(true);
  });
});

describe('AtualizarEstoque (Use Case)', () => {
  let repo, useCase, produtoId;

  beforeEach(async () => {
    repo = criarRepositorioFake();
    useCase = new AtualizarEstoque(repo);
    const criar = new CriarProduto(repo);
    const p = await criar.executar({ nome: 'Notebook', preco: 3000, estoque: 5, categoria: 'hardware' });
    produtoId = p.id;
  });

  test('atualiza estoque corretamente', async () => {
    const resultado = await useCase.executar(produtoId, 10);
    expect(resultado.estoque).toBe(10);
  });

  test('lanca erro para produto nao encontrado', async () => {
    await expect(useCase.executar('id-inexistente', 5)).rejects.toThrow();
  });

  test('lanca erro se novo estoque for negativo', async () => {
    await expect(useCase.executar(produtoId, -1)).rejects.toThrow();
  });
});

describe('apresentadorProduto (Adapter)', () => {
  test('formata preco como string monetaria', () => {
    const p = { id: '1', nome: 'Mouse', preco: 19.9, estoque: 5, categoria: 'hardware' };
    const resultado = apresentadorProduto(p);
    expect(resultado.preco_formatado).toMatch(/R\$/);
    expect(resultado.preco_formatado).toContain('19');
  });

  test('adiciona campo disponivel', () => {
    const pDisp = apresentadorProduto({ id: '1', nome: 'x', preco: 10, estoque: 1, categoria: 'a' });
    const pIndsp = apresentadorProduto({ id: '2', nome: 'y', preco: 10, estoque: 0, categoria: 'b' });
    expect(pDisp.disponivel).toBe(true);
    expect(pIndsp.disponivel).toBe(false);
  });
});

describe('parsearEntradaProduto (Adapter)', () => {
  test('converte preco string para number', () => {
    const resultado = parsearEntradaProduto({ nome: 'Mouse', preco: '99.90', estoque: '5', categoria: 'hardware' });
    expect(typeof resultado.preco).toBe('number');
    expect(resultado.preco).toBe(99.90);
  });

  test('faz trim no nome e categoria', () => {
    const resultado = parsearEntradaProduto({ nome: '  Mouse  ', preco: 50, estoque: 5, categoria: '  hardware  ' });
    expect(resultado.nome).toBe('Mouse');
    expect(resultado.categoria).toBe('hardware');
  });

  test('remove campos desconhecidos', () => {
    const resultado = parsearEntradaProduto({ nome: 'Mouse', preco: 50, estoque: 5, categoria: 'hw', campoExtra: 'xss' });
    expect(resultado).not.toHaveProperty('campoExtra');
  });
});
