const {
  classificarNota,
  calcularMedia,
  avaliarFuncionario,
  listarAprovados,
  melhorFuncionario,
} = require('../avaliacao');

describe('classificarNota', () => {
  test('nota 3 é reprovado', () => {
    expect(classificarNota(3)).toBe('reprovado');
  });

  test('nota 4.9 é reprovado', () => {
    expect(classificarNota(4.9)).toBe('reprovado');
  });

  test('nota 5 é recuperacao', () => {
    expect(classificarNota(5)).toBe('recuperacao');
  });

  test('nota 5.9 é recuperacao', () => {
    expect(classificarNota(5.9)).toBe('recuperacao');
  });

  test('nota 6 é aprovado', () => {
    expect(classificarNota(6)).toBe('aprovado');
  });

  test('nota 7.9 é aprovado', () => {
    expect(classificarNota(7.9)).toBe('aprovado');
  });

  test('nota 8 é destaque', () => {
    expect(classificarNota(8)).toBe('destaque');
  });

  test('nota 10 é destaque', () => {
    expect(classificarNota(10)).toBe('destaque');
  });
});

describe('calcularMedia', () => {
  test('calcula media de tres notas', () => {
    expect(calcularMedia([6, 8, 7])).toBe(7);
  });

  test('arredonda para 2 casas decimais', () => {
    expect(calcularMedia([5, 6, 7])).toBe(6);
  });

  test('array vazio retorna 0', () => {
    expect(calcularMedia([])).toBe(0);
  });
});

describe('avaliarFuncionario', () => {
  test('retorna todos os campos esperados', () => {
    const func = { nome: 'Ana', notas: [8, 9, 7] };
    const resultado = avaliarFuncionario(func);
    expect(resultado).toHaveProperty('nome', 'Ana');
    expect(resultado).toHaveProperty('media');
    expect(resultado).toHaveProperty('classificacao');
    expect(resultado).toHaveProperty('aprovado');
  });

  test('funcionario com media 8 é destaque e aprovado', () => {
    const func = { nome: 'Carlos', notas: [8, 8, 8] };
    const resultado = avaliarFuncionario(func);
    expect(resultado.classificacao).toBe('destaque');
    expect(resultado.aprovado).toBe(true);
  });

  test('funcionario com media 4 é reprovado', () => {
    const func = { nome: 'Pedro', notas: [3, 4, 5] };
    const resultado = avaliarFuncionario(func);
    expect(resultado.aprovado).toBe(false);
  });
});

describe('listarAprovados', () => {
  const funcionarios = [
    { nome: 'Ana',    notas: [8, 9, 7] },
    { nome: 'Bruno',  notas: [3, 4, 2] },
    { nome: 'Carla',  notas: [6, 7, 8] },
  ];

  test('retorna apenas aprovados e destaques', () => {
    const aprovados = listarAprovados(funcionarios);
    expect(aprovados.length).toBe(2);
    expect(aprovados.every(f => f.aprovado)).toBe(true);
  });
});

describe('melhorFuncionario', () => {
  test('retorna o funcionario com maior media', () => {
    const funcionarios = [
      { nome: 'Ana',   notas: [6, 7, 8] },
      { nome: 'Bruno', notas: [9, 9, 10] },
      { nome: 'Carla', notas: [7, 8, 7] },
    ];
    const melhor = melhorFuncionario(funcionarios);
    expect(melhor.nome).toBe('Bruno');
  });
});
