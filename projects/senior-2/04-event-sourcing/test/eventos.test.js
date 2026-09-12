const { EventStore, criarAgregado } = require('../eventos');

describe('EventStore', () => {
  let store;

  beforeEach(() => {
    store = new EventStore();
  });

  test('publica e retorna evento com campos corretos', () => {
    const evento = store.publicar('conta-1', 'CONTA_CRIADA', { titular: 'Ana' }, 0);
    expect(evento).toHaveProperty('id');
    expect(evento).toHaveProperty('streamId', 'conta-1');
    expect(evento).toHaveProperty('tipo', 'CONTA_CRIADA');
    expect(evento).toHaveProperty('dados', { titular: 'Ana' });
    expect(evento).toHaveProperty('versao', 1);
    expect(evento).toHaveProperty('timestamp');
  });

  test('versao auto-incrementada por stream', () => {
    store.publicar('conta-1', 'CONTA_CRIADA', {}, 0);
    const ev2 = store.publicar('conta-1', 'DEPOSITO', { valor: 100 }, 1);
    expect(ev2.versao).toBe(2);
  });

  test('lanca erro em conflito de versao', () => {
    store.publicar('conta-1', 'CONTA_CRIADA', {}, 0);
    // Tenta publicar versao errada (0 em vez de 1)
    expect(() => store.publicar('conta-1', 'DEPOSITO', {}, 0)).toThrow(/conflito/i);
  });

  test('ler retorna eventos do stream', () => {
    store.publicar('conta-1', 'CONTA_CRIADA', {}, 0);
    store.publicar('conta-1', 'DEPOSITO', { valor: 100 }, 1);
    const eventos = store.ler('conta-1');
    expect(eventos).toHaveLength(2);
  });

  test('ler com desdeVersao filtra eventos antigos', () => {
    store.publicar('conta-1', 'CONTA_CRIADA', {}, 0);
    store.publicar('conta-1', 'DEPOSITO', { valor: 100 }, 1);
    store.publicar('conta-1', 'SAQUE', { valor: 50 }, 2);
    const eventos = store.ler('conta-1', 2);
    expect(eventos).toHaveLength(2); // versoes 2 e 3
  });

  test('streams diferentes sao isolados', () => {
    store.publicar('conta-1', 'CONTA_CRIADA', {}, 0);
    store.publicar('conta-2', 'CONTA_CRIADA', {}, 0);
    expect(store.ler('conta-1')).toHaveLength(1);
    expect(store.ler('conta-2')).toHaveLength(1);
  });

  test('lerTodos retorna todos os eventos', () => {
    store.publicar('conta-1', 'CONTA_CRIADA', {}, 0);
    store.publicar('conta-2', 'CONTA_CRIADA', {}, 0);
    store.publicar('conta-1', 'DEPOSITO', { valor: 100 }, 1);
    expect(store.lerTodos()).toHaveLength(3);
  });

  test('lerTodos com tipo filtra por tipo', () => {
    store.publicar('conta-1', 'CONTA_CRIADA', {}, 0);
    store.publicar('conta-2', 'CONTA_CRIADA', {}, 0);
    store.publicar('conta-1', 'DEPOSITO', { valor: 50 }, 1);
    const depositos = store.lerTodos('DEPOSITO');
    expect(depositos).toHaveLength(1);
    expect(depositos[0].tipo).toBe('DEPOSITO');
  });
});

describe('criarAgregado — Conta Bancaria', () => {
  const Conta = criarAgregado('Conta', {
    CONTA_CRIADA: (estado, evento) => ({
      ...estado,
      titular: evento.dados.titular,
      saldo: evento.dados.saldoInicial || 0,
    }),
    DEPOSITO: (estado, evento) => ({
      ...estado,
      saldo: estado.saldo + evento.dados.valor,
    }),
    SAQUE: (estado, evento) => {
      if (evento.dados.valor > estado.saldo) throw new Error('Saldo insuficiente');
      return { ...estado, saldo: estado.saldo - evento.dados.valor };
    },
  });

  let store;

  beforeEach(() => {
    store = new EventStore();
  });

  test('estado inicial e vazio antes de carregar', () => {
    const conta = new Conta('conta-1');
    expect(conta.estado()).toEqual({});
  });

  test('estado e reconstruido a partir de eventos', () => {
    const eventos = [
      { tipo: 'CONTA_CRIADA', dados: { titular: 'Ana', saldoInicial: 1000 }, versao: 1 },
      { tipo: 'DEPOSITO', dados: { valor: 500 }, versao: 2 },
      { tipo: 'SAQUE', dados: { valor: 200 }, versao: 3 },
    ];
    const conta = new Conta('conta-1');
    conta.carregar(eventos);
    expect(conta.estado().saldo).toBe(1300);
    expect(conta.estado().titular).toBe('Ana');
  });

  test('aplicar publica evento no store e atualiza estado', async () => {
    const conta = new Conta('conta-1');
    await conta.aplicar('CONTA_CRIADA', { titular: 'Bob', saldoInicial: 500 }, store);
    expect(conta.estado().saldo).toBe(500);
    expect(store.ler('conta-1')).toHaveLength(1);
  });

  test('multiplas operacoes via aplicar', async () => {
    const conta = new Conta('conta-1');
    await conta.aplicar('CONTA_CRIADA', { titular: 'Carlos', saldoInicial: 0 }, store);
    await conta.aplicar('DEPOSITO', { valor: 1000 }, store);
    await conta.aplicar('SAQUE', { valor: 300 }, store);
    expect(conta.estado().saldo).toBe(700);
    expect(store.ler('conta-1')).toHaveLength(3);
  });

  test('versaoAtual e atualizada apos cada evento', async () => {
    const conta = new Conta('conta-1');
    await conta.aplicar('CONTA_CRIADA', { titular: 'Ana', saldoInicial: 0 }, store);
    await conta.aplicar('DEPOSITO', { valor: 100 }, store);
    expect(conta.versaoAtual()).toBe(2);
  });

  test('conflito de versao ao tentar aplicar em paralelo', async () => {
    const conta1 = new Conta('conta-1');
    const conta2 = new Conta('conta-1');

    await conta1.aplicar('CONTA_CRIADA', { titular: 'Ana', saldoInicial: 1000 }, store);

    // conta2 nao sabe da versao de conta1 — deve falhar
    await expect(conta2.aplicar('CONTA_CRIADA', { titular: 'Ana', saldoInicial: 1000 }, store))
      .rejects.toThrow(/conflito/i);
  });
});
