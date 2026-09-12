const { criarNotificador, ConfiguracaoGlobal, Publicador, criarOrdenador } = require('../patterns');

describe('Factory — criarNotificador', () => {
  test('cria notificador de email', () => {
    const n = criarNotificador('email');
    expect(n).toHaveProperty('enviar');
  });

  test('cria notificador de sms', () => {
    const n = criarNotificador('sms');
    expect(n).toHaveProperty('enviar');
  });

  test('cria notificador de push', () => {
    const n = criarNotificador('push');
    expect(n).toHaveProperty('enviar');
  });

  test('enviar retorna objeto com campos corretos', () => {
    const n = criarNotificador('email');
    const resultado = n.enviar('usuario@teste.com', 'Bem-vindo!');
    expect(resultado).toMatchObject({
      tipo: 'email',
      destinatario: 'usuario@teste.com',
      mensagem: 'Bem-vindo!',
    });
    expect(resultado).toHaveProperty('enviadoEm');
  });

  test('tipo do resultado e o tipo criado', () => {
    const r1 = criarNotificador('sms').enviar('+5511999', 'msg');
    const r2 = criarNotificador('push').enviar('device-token', 'msg');
    expect(r1.tipo).toBe('sms');
    expect(r2.tipo).toBe('push');
  });

  test('lanca erro para tipo desconhecido', () => {
    expect(() => criarNotificador('telegram')).toThrow(/desconhecido/i);
  });
});

describe('Singleton — ConfiguracaoGlobal', () => {
  beforeEach(() => {
    // Limpa estado entre testes acessando a instancia
    const cfg = ConfiguracaoGlobal.getInstance();
    // Reseta limpando via getAll e removendo chaves (se implementar reset)
    // Para testes funcionar, trabalhamos com chaves unicas por teste
  });

  test('getInstance retorna a mesma instancia', () => {
    const i1 = ConfiguracaoGlobal.getInstance();
    const i2 = ConfiguracaoGlobal.getInstance();
    expect(i1).toBe(i2);
  });

  test('set e get funcionam', () => {
    const cfg = ConfiguracaoGlobal.getInstance();
    cfg.set('porta', 3000);
    expect(cfg.get('porta')).toBe(3000);
  });

  test('alteracoes em uma instancia refletem em todas', () => {
    const i1 = ConfiguracaoGlobal.getInstance();
    const i2 = ConfiguracaoGlobal.getInstance();
    i1.set('ambiente-singleton', 'producao');
    expect(i2.get('ambiente-singleton')).toBe('producao');
  });

  test('getAll retorna objeto com todas as configuracoes', () => {
    const cfg = ConfiguracaoGlobal.getInstance();
    cfg.set('app-name', 'DevTech');
    const tudo = cfg.getAll();
    expect(tudo).toHaveProperty('app-name', 'DevTech');
  });

  test('get retorna undefined para chave inexistente', () => {
    const cfg = ConfiguracaoGlobal.getInstance();
    expect(cfg.get('chave-que-nao-existe-xyz')).toBeUndefined();
  });
});

describe('Observer — Publicador', () => {
  let pub;

  beforeEach(() => {
    pub = new Publicador();
  });

  test('listener e chamado ao publicar evento', () => {
    const fn = jest.fn();
    pub.assinar('login', fn);
    pub.publicar('login', { userId: 1 });
    expect(fn).toHaveBeenCalledWith({ userId: 1 });
  });

  test('multiplos listeners sao chamados', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    pub.assinar('login', fn1);
    pub.assinar('login', fn2);
    pub.publicar('login', { userId: 2 });
    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
  });

  test('listener cancelado nao e chamado', () => {
    const fn = jest.fn();
    pub.assinar('logout', fn);
    pub.cancelar('logout', fn);
    pub.publicar('logout', {});
    expect(fn).not.toHaveBeenCalled();
  });

  test('cancelar remove apenas o listener especifico', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    pub.assinar('pedido', fn1);
    pub.assinar('pedido', fn2);
    pub.cancelar('pedido', fn1);
    pub.publicar('pedido', { id: 1 });
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
  });

  test('publicar evento sem listeners nao lanca erro', () => {
    expect(() => pub.publicar('evento-sem-listeners', {})).not.toThrow();
  });

  test('listeners de eventos diferentes nao interferem', () => {
    const fn1 = jest.fn();
    pub.assinar('evento-a', fn1);
    pub.publicar('evento-b', { x: 1 });
    expect(fn1).not.toHaveBeenCalled();
  });
});

describe('Strategy — criarOrdenador', () => {
  const arrayDesordenado = [5, 3, 8, 1, 9, 2, 7, 4, 6];
  const arrayOrdenado = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  test('bubble sort ordena corretamente', () => {
    const ord = criarOrdenador('bubble');
    expect(ord.ordenar([...arrayDesordenado])).toEqual(arrayOrdenado);
  });

  test('selection sort ordena corretamente', () => {
    const ord = criarOrdenador('selection');
    expect(ord.ordenar([...arrayDesordenado])).toEqual(arrayOrdenado);
  });

  test('quick sort ordena corretamente', () => {
    const ord = criarOrdenador('quick');
    expect(ord.ordenar([...arrayDesordenado])).toEqual(arrayOrdenado);
  });

  test('nenhum algoritmo muta o array original', () => {
    const original = [3, 1, 2];
    const copia = [...original];
    criarOrdenador('bubble').ordenar(original);
    criarOrdenador('selection').ordenar(original);
    criarOrdenador('quick').ordenar(original);
    expect(original).toEqual(copia);
  });

  test('todos os algoritmos ordenam array vazio sem erro', () => {
    expect(criarOrdenador('bubble').ordenar([])).toEqual([]);
    expect(criarOrdenador('selection').ordenar([])).toEqual([]);
    expect(criarOrdenador('quick').ordenar([])).toEqual([]);
  });

  test('todos os algoritmos ordenam array com um elemento', () => {
    expect(criarOrdenador('bubble').ordenar([42])).toEqual([42]);
    expect(criarOrdenador('selection').ordenar([42])).toEqual([42]);
    expect(criarOrdenador('quick').ordenar([42])).toEqual([42]);
  });

  test('lanca erro para estrategia desconhecida', () => {
    expect(() => criarOrdenador('merge')).toThrow();
  });
});
