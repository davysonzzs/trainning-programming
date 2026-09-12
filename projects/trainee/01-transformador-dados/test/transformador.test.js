const {
  formatarNome,
  somarTodos,
  combinarArrays,
  mapearPrecos,
  extrairDados,
} = require('../transformador');

describe('formatarNome', () => {
  test('formata nome e sobrenome no padrão "Sobrenome, Nome"', () => {
    expect(formatarNome({ nome: 'Ana', sobrenome: 'Lima' })).toBe('Lima, Ana');
  });

  test('funciona com nomes compostos', () => {
    expect(formatarNome({ nome: 'Carlos Eduardo', sobrenome: 'Souza' })).toBe(
      'Souza, Carlos Eduardo'
    );
  });

  test('preserva a capitalização original', () => {
    expect(formatarNome({ nome: 'joão', sobrenome: 'SILVA' })).toBe('SILVA, joão');
  });
});

describe('somarTodos', () => {
  test('soma múltiplos argumentos', () => {
    expect(somarTodos(1, 2, 3, 4)).toBe(10);
  });

  test('retorna 0 quando chamado sem argumentos', () => {
    expect(somarTodos()).toBe(0);
  });

  test('funciona com um único argumento', () => {
    expect(somarTodos(7)).toBe(7);
  });

  test('funciona com números negativos', () => {
    expect(somarTodos(-1, -2, 3)).toBe(0);
  });
});

describe('combinarArrays', () => {
  test('combina dois arrays removendo duplicatas', () => {
    const resultado = combinarArrays([1, 2, 3], [2, 3, 4]);
    expect(resultado).toEqual([1, 2, 3, 4]);
  });

  test('retorna todos os elementos quando não há duplicatas', () => {
    const resultado = combinarArrays([1, 2], [3, 4]);
    expect(resultado).toEqual([1, 2, 3, 4]);
  });

  test('não modifica os arrays originais', () => {
    const a = [1, 2];
    const b = [2, 3];
    combinarArrays(a, b);
    expect(a).toEqual([1, 2]);
    expect(b).toEqual([2, 3]);
  });

  test('funciona com strings', () => {
    const resultado = combinarArrays(['a', 'b'], ['b', 'c']);
    expect(resultado).toEqual(['a', 'b', 'c']);
  });

  test('funciona com arrays vazios', () => {
    expect(combinarArrays([], [1, 2])).toEqual([1, 2]);
    expect(combinarArrays([1, 2], [])).toEqual([1, 2]);
  });
});

describe('mapearPrecos', () => {
  const produtos = [
    { nome: 'Camiseta', preco: 100 },
    { nome: 'Calça', preco: 200 },
  ];

  test('aplica desconto e retorna estrutura correta', () => {
    const resultado = mapearPrecos(produtos, 10);
    expect(resultado[0]).toEqual({ nome: 'Camiseta', precoOriginal: 100, precoFinal: 90 });
    expect(resultado[1]).toEqual({ nome: 'Calça', precoOriginal: 200, precoFinal: 180 });
  });

  test('desconto 0 retorna preço original como precoFinal', () => {
    const resultado = mapearPrecos([{ nome: 'Tênis', preco: 150 }], 0);
    expect(resultado[0].precoFinal).toBe(150);
  });

  test('arredonda precoFinal para 2 casas decimais', () => {
    const resultado = mapearPrecos([{ nome: 'Meia', preco: 33.33 }], 10);
    expect(resultado[0].precoFinal).toBe(29.997 >= 30 ? 30 : parseFloat((33.33 * 0.9).toFixed(2)));
  });

  test('não modifica o array original de produtos', () => {
    const originais = [{ nome: 'Item', preco: 50 }];
    mapearPrecos(originais, 20);
    expect(originais[0]).toEqual({ nome: 'Item', preco: 50 });
  });
});

describe('extrairDados', () => {
  const pedido = {
    id: 42,
    cliente: { nome: 'Maria', email: 'maria@dev.com' },
    itens: [{ produto: 'X', qtd: 2 }],
    total: 199.9,
  };

  test('extrai id, nomeCliente e total do pedido', () => {
    expect(extrairDados(pedido)).toEqual({ id: 42, nomeCliente: 'Maria', total: 199.9 });
  });

  test('não inclui a propriedade cliente no retorno', () => {
    const resultado = extrairDados(pedido);
    expect(resultado).not.toHaveProperty('cliente');
  });

  test('não inclui a propriedade itens no retorno', () => {
    const resultado = extrairDados(pedido);
    expect(resultado).not.toHaveProperty('itens');
  });

  test('funciona com diferentes pedidos', () => {
    const outro = {
      id: 99,
      cliente: { nome: 'Pedro', email: 'p@p.com' },
      itens: [],
      total: 0,
    };
    expect(extrairDados(outro)).toEqual({ id: 99, nomeCliente: 'Pedro', total: 0 });
  });
});
