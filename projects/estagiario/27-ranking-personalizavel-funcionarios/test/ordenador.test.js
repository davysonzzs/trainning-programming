const { ordenarPorNota, ordenarPorNome, top3 } = require('../ordenador');

const funcionarios = [
  { nome: 'Carlos', nota: 7 },
  { nome: 'Ana', nota: 9 },
  { nome: 'Bruno', nota: 8 },
  { nome: 'Diana', nota: 6 },
];

describe('ordenarPorNota', () => {
  test('ordena do maior pro menor', () => {
    expect(ordenarPorNota(funcionarios).map(f => f.nome)).toEqual(['Ana', 'Bruno', 'Carlos', 'Diana']);
  });
  test('nao altera o array original', () => {
    const copia = [...funcionarios];
    ordenarPorNota(funcionarios);
    expect(funcionarios).toEqual(copia);
  });
});

describe('ordenarPorNome', () => {
  test('ordena alfabeticamente', () => {
    expect(ordenarPorNome(funcionarios).map(f => f.nome)).toEqual(['Ana', 'Bruno', 'Carlos', 'Diana']);
  });
});

describe('top3', () => {
  test('retorna os 3 melhores', () => {
    expect(top3(funcionarios).map(f => f.nome)).toEqual(['Ana', 'Bruno', 'Carlos']);
  });
  test('lista menor que 3 retorna todos', () => {
    expect(top3([{ nome: 'Ana', nota: 5 }]).length).toBe(1);
  });
});
