const {
  buscaLinear,
  buscaPorFaixaDePreco,
  ordenarPorPreco,
  ordenarPorNome,
  filtrarComEstoque,
} = require('../buscador');

const produtos = [
  { id: 1, nome: 'Caderno',   preco: 15.90, estoque: 50  },
  { id: 2, nome: 'Caneta',    preco: 2.50,  estoque: 0   },
  { id: 3, nome: 'Mochila',   preco: 89.90, estoque: 10  },
  { id: 4, nome: 'Borracha',  preco: 1.20,  estoque: 100 },
  { id: 5, nome: 'Regua',     preco: 3.00,  estoque: 30  },
];

describe('buscaLinear', () => {
  test('encontra produto por nome exato', () => {
    const resultado = buscaLinear(produtos, 'Caderno');
    expect(resultado.id).toBe(1);
  });

  test('busca é case-insensitive', () => {
    const resultado = buscaLinear(produtos, 'caderno');
    expect(resultado).not.toBeNull();
  });

  test('retorna null para produto inexistente', () => {
    expect(buscaLinear(produtos, 'Tablet')).toBeNull();
  });

  test('nao usa .find() — percorre o array manualmente', () => {
    // Este teste verifica que a funcao retorna o resultado correto
    // Implemente usando for ou while, nao .find()
    expect(buscaLinear(produtos, 'Mochila').preco).toBe(89.90);
  });
});

describe('buscaPorFaixaDePreco', () => {
  test('retorna produtos dentro da faixa de preco', () => {
    const resultado = buscaPorFaixaDePreco(produtos, 2, 20);
    expect(resultado.length).toBe(3); // Caderno, Caneta, Regua
  });

  test('inclui os limites da faixa', () => {
    const resultado = buscaPorFaixaDePreco(produtos, 2.50, 2.50);
    expect(resultado.length).toBe(1);
    expect(resultado[0].nome).toBe('Caneta');
  });

  test('retorna array vazio se nenhum produto na faixa', () => {
    expect(buscaPorFaixaDePreco(produtos, 200, 300).length).toBe(0);
  });
});

describe('ordenarPorPreco', () => {
  test('retorna produtos ordenados por preco crescente', () => {
    const resultado = ordenarPorPreco(produtos);
    expect(resultado[0].nome).toBe('Borracha'); // 1.20
    expect(resultado[resultado.length - 1].nome).toBe('Mochila'); // 89.90
  });

  test('nao modifica o array original', () => {
    const primeiroOriginal = produtos[0].nome;
    ordenarPorPreco(produtos);
    expect(produtos[0].nome).toBe(primeiroOriginal);
  });
});

describe('ordenarPorNome', () => {
  test('retorna produtos em ordem alfabetica', () => {
    const resultado = ordenarPorNome(produtos);
    expect(resultado[0].nome).toBe('Borracha');
    expect(resultado[resultado.length - 1].nome).toBe('Regua');
  });

  test('nao modifica o array original', () => {
    const primeiroOriginal = produtos[0].nome;
    ordenarPorNome(produtos);
    expect(produtos[0].nome).toBe(primeiroOriginal);
  });
});

describe('filtrarComEstoque', () => {
  test('retorna apenas produtos com estoque maior que 0', () => {
    const resultado = filtrarComEstoque(produtos);
    expect(resultado.length).toBe(4);
    expect(resultado.every(p => p.estoque > 0)).toBe(true);
  });

  test('nao inclui produtos com estoque zero', () => {
    const resultado = filtrarComEstoque(produtos);
    expect(resultado.find(p => p.nome === 'Caneta')).toBeUndefined();
  });
});
