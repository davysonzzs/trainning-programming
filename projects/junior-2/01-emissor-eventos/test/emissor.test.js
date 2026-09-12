const { EmissorPersonalizado, criarPipeline } = require('../emissor');
const EventEmitter = require('events');

describe('EmissorPersonalizado', () => {
  let emissor;

  beforeEach(() => {
    emissor = new EmissorPersonalizado();
  });

  test('deve ser instância de EventEmitter', () => {
    expect(emissor).toBeInstanceOf(EventEmitter);
  });

  test('deve inicializar com histórico vazio', () => {
    expect(emissor.historico()).toEqual([]);
  });

  test('emitirComHistorico deve disparar o evento', () => {
    const listener = jest.fn();
    emissor.on('teste', listener);
    emissor.emitirComHistorico('teste', { msg: 'oi' });
    expect(listener).toHaveBeenCalledWith({ msg: 'oi' });
  });

  test('emitirComHistorico deve registrar no histórico', () => {
    emissor.emitirComHistorico('login', { usuario: 'ana' });
    const hist = emissor.historico();
    expect(hist).toHaveLength(1);
    expect(hist[0].evento).toBe('login');
    expect(hist[0].dados).toEqual({ usuario: 'ana' });
    expect(hist[0].timestamp).toBeDefined();
  });

  test('timestamp deve ser string ISO válida', () => {
    emissor.emitirComHistorico('ping', null);
    const { timestamp } = emissor.historico()[0];
    expect(typeof timestamp).toBe('string');
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
  });

  test('historico(evento) deve filtrar por evento', () => {
    emissor.emitirComHistorico('a', 1);
    emissor.emitirComHistorico('b', 2);
    emissor.emitirComHistorico('a', 3);
    expect(emissor.historico('a')).toHaveLength(2);
    expect(emissor.historico('b')).toHaveLength(1);
  });

  test('historico() sem argumento retorna tudo', () => {
    emissor.emitirComHistorico('x', 1);
    emissor.emitirComHistorico('y', 2);
    expect(emissor.historico()).toHaveLength(2);
  });

  test('limparHistorico deve esvaziar o histórico', () => {
    emissor.emitirComHistorico('ev', 'dado');
    emissor.limparHistorico();
    expect(emissor.historico()).toHaveLength(0);
  });

  test('contarEmissoes deve retornar contagem correta', () => {
    emissor.emitirComHistorico('clique', null);
    emissor.emitirComHistorico('clique', null);
    emissor.emitirComHistorico('hover', null);
    expect(emissor.contarEmissoes('clique')).toBe(2);
    expect(emissor.contarEmissoes('hover')).toBe(1);
    expect(emissor.contarEmissoes('inexistente')).toBe(0);
  });

  test('múltiplos eventos ficam no histórico em ordem', () => {
    emissor.emitirComHistorico('e1', 'a');
    emissor.emitirComHistorico('e2', 'b');
    emissor.emitirComHistorico('e3', 'c');
    const h = emissor.historico();
    expect(h[0].evento).toBe('e1');
    expect(h[1].evento).toBe('e2');
    expect(h[2].evento).toBe('e3');
  });
});

describe('criarPipeline', () => {
  test('deve encadear eventos em sequência', () => {
    const e = new EmissorPersonalizado();
    const resultados = [];
    e.on('c', (dados) => resultados.push(dados));
    criarPipeline(e, ['a', 'b', 'c']);
    e.emitirComHistorico('a', 'inicio');
    expect(resultados).toEqual(['inicio']);
  });

  test('destruir deve remover os listeners do pipeline', () => {
    const e = new EmissorPersonalizado();
    const resultados = [];
    e.on('b', (dados) => resultados.push(dados));
    const { destruir } = criarPipeline(e, ['a', 'b']);
    destruir();
    e.emitirComHistorico('a', 'teste');
    expect(resultados).toHaveLength(0);
  });

  test('pipeline com três etapas deve propagar dados', () => {
    const e = new EmissorPersonalizado();
    let ultimo = null;
    e.on('step3', (d) => { ultimo = d; });
    criarPipeline(e, ['step1', 'step2', 'step3']);
    e.emit('step1', 42);
    expect(ultimo).toBe(42);
  });
});
