const { criarReativo, ObservadorProfundo } = require('../observador');

describe('criarReativo', () => {
  test('deve retornar um objeto com os mesmos valores', () => {
    const reativo = criarReativo({ nome: 'Ana' }, () => {});
    expect(reativo.nome).toBe('Ana');
  });

  test('deve chamar onChange ao alterar propriedade', () => {
    const onChange = jest.fn();
    const reativo = criarReativo({ nome: 'Ana' }, onChange);
    reativo.nome = 'Bruno';
    expect(onChange).toHaveBeenCalledWith('nome', 'Bruno', 'Ana');
  });

  test('deve chamar onChange com valor anterior correto', () => {
    const onChange = jest.fn();
    const reativo = criarReativo({ count: 0 }, onChange);
    reativo.count = 1;
    reativo.count = 2;
    expect(onChange).toHaveBeenNthCalledWith(1, 'count', 1, 0);
    expect(onChange).toHaveBeenNthCalledWith(2, 'count', 2, 1);
  });

  test('deve atualizar o valor no objeto', () => {
    const reativo = criarReativo({ x: 10 }, () => {});
    reativo.x = 99;
    expect(reativo.x).toBe(99);
  });

  test('onChange não deve ser chamado na leitura', () => {
    const onChange = jest.fn();
    const reativo = criarReativo({ a: 1 }, onChange);
    const _ = reativo.a;
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('ObservadorProfundo', () => {
  let obs;

  beforeEach(() => {
    obs = new ObservadorProfundo({
      usuario: { nome: 'Ana', idade: 25 },
      config: { tema: 'claro' },
    });
  });

  test('get deve acessar propriedade simples', () => {
    expect(obs.get('config.tema')).toBe('claro');
  });

  test('get deve acessar propriedade aninhada', () => {
    expect(obs.get('usuario.nome')).toBe('Ana');
  });

  test('set deve atualizar valor aninhado', () => {
    obs.set('usuario.nome', 'Carlos');
    expect(obs.get('usuario.nome')).toBe('Carlos');
  });

  test('set deve chamar callbacks registrados', () => {
    const cb = jest.fn();
    obs.onChange(cb);
    obs.set('usuario.idade', 30);
    expect(cb).toHaveBeenCalledWith('usuario.idade', 30);
  });

  test('múltiplos callbacks devem ser chamados', () => {
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    obs.onChange(cb1);
    obs.onChange(cb2);
    obs.set('config.tema', 'escuro');
    expect(cb1).toHaveBeenCalled();
    expect(cb2).toHaveBeenCalled();
  });

  test('snapshot deve retornar cópia do estado', () => {
    const snap = obs.snapshot();
    expect(snap).toEqual({ usuario: { nome: 'Ana', idade: 25 }, config: { tema: 'claro' } });
  });

  test('snapshot não deve ser referência ao estado interno', () => {
    const snap = obs.snapshot();
    snap.usuario.nome = 'Mutado';
    expect(obs.get('usuario.nome')).toBe('Ana');
  });

  test('set não deve afetar snapshots anteriores', () => {
    const snap = obs.snapshot();
    obs.set('usuario.nome', 'Novo');
    expect(snap.usuario.nome).toBe('Ana');
  });
});
