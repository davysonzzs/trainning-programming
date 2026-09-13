const { ola, apresentar, boasVindas } = require('../mensagens');

describe('ola', () => {
  test('retorna a mensagem fixa', () => {
    expect(ola()).toBe('Ola, mundo!');
  });
});

describe('apresentar', () => {
  test('monta a apresentacao com o nome', () => {
    expect(apresentar('Ana')).toBe('Ola, meu nome e Ana');
  });

  test('funciona com outro nome', () => {
    expect(apresentar('Marcos')).toBe('Ola, meu nome e Marcos');
  });
});

describe('boasVindas', () => {
  test('monta a mensagem com nome e cargo', () => {
    expect(boasVindas('Ana', 'Estagiaria')).toBe('Bem-vindo(a), Ana! Seu cargo e: Estagiaria');
  });

  test('funciona com outro nome e cargo', () => {
    expect(boasVindas('Joao', 'Dev')).toBe('Bem-vindo(a), Joao! Seu cargo e: Dev');
  });
});
