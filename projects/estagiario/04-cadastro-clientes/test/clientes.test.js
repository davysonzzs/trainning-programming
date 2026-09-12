const {
  adicionar,
  buscar,
  atualizar,
  desativar,
  listarAtivos,
  buscarPorEmail,
} = require('../clientes');

const clienteBase = { id: 1, nome: 'Ana Lima', email: 'ana@devtech.com', ativo: true };
const listaBase   = [
  { id: 1, nome: 'Ana Lima',    email: 'ana@devtech.com',   ativo: true  },
  { id: 2, nome: 'Bruno Costa', email: 'bruno@devtech.com', ativo: true  },
  { id: 3, nome: 'Carla Melo',  email: 'carla@devtech.com', ativo: false },
];

describe('adicionar', () => {
  test('retorna novo array com o cliente adicionado', () => {
    const novo = { id: 4, nome: 'Diego', email: 'diego@test.com', ativo: true };
    const resultado = adicionar(listaBase, novo);
    expect(resultado.length).toBe(4);
    expect(resultado[3].nome).toBe('Diego');
  });

  test('nao modifica o array original (imutabilidade)', () => {
    const novo = { id: 4, nome: 'Diego', email: 'diego@test.com', ativo: true };
    adicionar(listaBase, novo);
    expect(listaBase.length).toBe(3);
  });
});

describe('buscar', () => {
  test('retorna o cliente com o id informado', () => {
    const cliente = buscar(listaBase, 1);
    expect(cliente.nome).toBe('Ana Lima');
  });

  test('retorna null para id inexistente', () => {
    expect(buscar(listaBase, 99)).toBeNull();
  });
});

describe('atualizar', () => {
  test('retorna novo array com cliente atualizado', () => {
    const resultado = atualizar(listaBase, 1, { nome: 'Ana Lima Silva' });
    const atualizado = resultado.find(c => c.id === 1);
    expect(atualizado.nome).toBe('Ana Lima Silva');
  });

  test('nao modifica o array original (imutabilidade)', () => {
    atualizar(listaBase, 1, { nome: 'Outro Nome' });
    expect(listaBase[0].nome).toBe('Ana Lima');
  });

  test('outros campos nao sao afetados', () => {
    const resultado = atualizar(listaBase, 1, { nome: 'Ana Nova' });
    const atualizado = resultado.find(c => c.id === 1);
    expect(atualizado.email).toBe('ana@devtech.com');
    expect(atualizado.ativo).toBe(true);
  });

  test('id inexistente retorna lista sem alteracao', () => {
    const resultado = atualizar(listaBase, 99, { nome: 'X' });
    expect(resultado.length).toBe(listaBase.length);
  });
});

describe('desativar', () => {
  test('define ativo como false para o cliente informado', () => {
    const resultado = desativar(listaBase, 1);
    const cliente   = resultado.find(c => c.id === 1);
    expect(cliente.ativo).toBe(false);
  });

  test('nao modifica o array original (imutabilidade)', () => {
    desativar(listaBase, 1);
    expect(listaBase[0].ativo).toBe(true);
  });

  test('outros clientes nao sao afetados', () => {
    const resultado = desativar(listaBase, 1);
    expect(resultado.find(c => c.id === 2).ativo).toBe(true);
  });
});

describe('listarAtivos', () => {
  test('retorna apenas clientes com ativo true', () => {
    const ativos = listarAtivos(listaBase);
    expect(ativos.length).toBe(2);
    expect(ativos.every(c => c.ativo)).toBe(true);
  });
});

describe('buscarPorEmail', () => {
  test('encontra cliente pelo email', () => {
    const cliente = buscarPorEmail(listaBase, 'ana@devtech.com');
    expect(cliente.nome).toBe('Ana Lima');
  });

  test('busca é case-insensitive', () => {
    const cliente = buscarPorEmail(listaBase, 'ANA@DEVTECH.COM');
    expect(cliente).not.toBeNull();
  });

  test('retorna null para email inexistente', () => {
    expect(buscarPorEmail(listaBase, 'naoexiste@test.com')).toBeNull();
  });
});
