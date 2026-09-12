const { Stream } = require('../stream');

describe('Stream — map', () => {
  test('deve aplicar função a cada elemento', () => {
    const resultado = Stream.from([1, 2, 3]).map(x => x * 2).toArray();
    expect(resultado).toEqual([2, 4, 6]);
  });

  test('deve encadear múltiplos maps', () => {
    const resultado = Stream.from([1, 2, 3])
      .map(x => x + 1)
      .map(x => x * 10)
      .toArray();
    expect(resultado).toEqual([20, 30, 40]);
  });
});

describe('Stream — filter', () => {
  test('deve manter apenas elementos que satisfazem a condição', () => {
    const resultado = Stream.from([1, 2, 3, 4, 5]).filter(x => x % 2 === 0).toArray();
    expect(resultado).toEqual([2, 4]);
  });

  test('deve encadear filter e map', () => {
    const resultado = Stream.from([1, 2, 3, 4, 5])
      .filter(x => x > 2)
      .map(x => x * 2)
      .toArray();
    expect(resultado).toEqual([6, 8, 10]);
  });
});

describe('Stream — take', () => {
  test('deve limitar a quantidade de elementos', () => {
    const resultado = Stream.from([1, 2, 3, 4, 5]).take(3).toArray();
    expect(resultado).toEqual([1, 2, 3]);
  });

  test('take maior que o array deve retornar tudo', () => {
    const resultado = Stream.from([1, 2]).take(10).toArray();
    expect(resultado).toEqual([1, 2]);
  });

  test('deve funcionar com pipeline', () => {
    const resultado = Stream.from([1, 2, 3, 4, 5])
      .filter(x => x % 2 !== 0)
      .take(2)
      .toArray();
    expect(resultado).toEqual([1, 3]);
  });
});

describe('Stream — reduce', () => {
  test('deve somar os elementos', () => {
    const soma = Stream.from([1, 2, 3, 4]).reduce((acc, x) => acc + x, 0);
    expect(soma).toBe(10);
  });

  test('deve concatenar strings', () => {
    const resultado = Stream.from(['a', 'b', 'c']).reduce((acc, x) => acc + x, '');
    expect(resultado).toBe('abc');
  });
});

describe('Stream — forEach', () => {
  test('deve chamar a função para cada elemento', () => {
    const resultado = [];
    Stream.from([10, 20, 30]).forEach(x => resultado.push(x));
    expect(resultado).toEqual([10, 20, 30]);
  });
});

describe('Stream — range', () => {
  test('deve criar stream com intervalo inclusivo', () => {
    expect(Stream.range(1, 5).toArray()).toEqual([1, 2, 3, 4, 5]);
  });

  test('deve funcionar com operações encadeadas', () => {
    const resultado = Stream.range(1, 10).filter(x => x % 3 === 0).toArray();
    expect(resultado).toEqual([3, 6, 9]);
  });

  test('range com mesmo inicio e fim deve retornar array com um elemento', () => {
    expect(Stream.range(5, 5).toArray()).toEqual([5]);
  });
});

describe('Stream — imutabilidade', () => {
  test('operações não devem modificar a stream original', () => {
    const original = Stream.from([1, 2, 3]);
    original.map(x => x * 2);
    expect(original.toArray()).toEqual([1, 2, 3]);
  });
});
