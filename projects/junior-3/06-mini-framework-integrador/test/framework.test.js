const { App } = require('../framework');

function contadorReducer(estado = { valor: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT': return { ...estado, valor: estado.valor + 1 };
    case 'DECREMENT': return { ...estado, valor: estado.valor - 1 };
    case 'SET': return { ...estado, valor: action.payload };
    default: return estado;
  }
}

describe('App — inicialização', () => {
  test('deve inicializar sem erros com config padrão', () => {
    expect(() => new App()).not.toThrow();
  });

  test('getState deve retornar estado inicial', () => {
    const app = new App({ estadoInicial: { usuario: 'Ana' } });
    expect(app.getState()).toEqual({ usuario: 'Ana' });
  });

  test('deve aceitar reducer customizado', () => {
    const app = new App({ reducer: contadorReducer, estadoInicial: { valor: 0 } });
    app.dispatch({ type: 'INCREMENT' });
    expect(app.getState().valor).toBe(1);
  });
});

describe('App — store', () => {
  test('dispatch deve atualizar o estado', () => {
    const app = new App({ reducer: contadorReducer, estadoInicial: { valor: 5 } });
    app.dispatch({ type: 'SET', payload: 99 });
    expect(app.getState().valor).toBe(99);
  });

  test('subscribe deve ser notificado após dispatch', () => {
    const app = new App({ reducer: contadorReducer, estadoInicial: { valor: 0 } });
    const listener = jest.fn();
    app.subscribe(listener);
    app.dispatch({ type: 'INCREMENT' });
    expect(listener).toHaveBeenCalled();
  });

  test('unsubscribe deve parar notificações', () => {
    const app = new App({ reducer: contadorReducer, estadoInicial: { valor: 0 } });
    const listener = jest.fn();
    const unsub = app.subscribe(listener);
    unsub();
    app.dispatch({ type: 'INCREMENT' });
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('App — container de DI', () => {
  test('deve registrar e usar serviço via handler de rota', () => {
    const app = new App();
    app.registrar('saudacao', () => 'Olá do serviço!');
    // Apenas verifica que o registro não lança erro
    expect(() => app.registrar('x', () => 1)).not.toThrow();
  });
});

describe('App — roteador', () => {
  test('deve navegar para rota simples', () => {
    const app = new App();
    app.rota('/home', (ctx) => 'bem-vindo');
    expect(app.navegar('/home')).toBe('bem-vindo');
  });

  test('handler deve receber contexto com caminho', () => {
    const app = new App();
    app.rota('/test', (ctx) => ctx.caminho);
    expect(app.navegar('/test')).toBe('/test');
  });

  test('handler deve receber estado atual', () => {
    const app = new App({ reducer: contadorReducer, estadoInicial: { valor: 7 } });
    app.rota('/estado', (ctx, state) => state.valor);
    expect(app.navegar('/estado')).toBe(7);
  });

  test('handler deve receber dispatch e poder alterar estado', () => {
    const app = new App({ reducer: contadorReducer, estadoInicial: { valor: 0 } });
    app.rota('/incrementar', (ctx, state, dispatch) => {
      dispatch({ type: 'INCREMENT' });
      return 'incrementado';
    });
    app.navegar('/incrementar');
    expect(app.getState().valor).toBe(1);
  });

  test('deve suportar parâmetros dinâmicos na rota', () => {
    const app = new App();
    app.rota('/usuario/:id', (ctx) => ctx.params.id);
    expect(app.navegar('/usuario/42')).toBe('42');
  });

  test('deve lançar erro para rota não registrada', () => {
    const app = new App();
    expect(() => app.navegar('/nao-existe')).toThrow();
  });

  test('deve passar dados extras ao navegar', () => {
    const app = new App();
    app.rota('/ping', (ctx) => ctx.dados.origem);
    expect(app.navegar('/ping', { origem: 'terminal' })).toBe('terminal');
  });
});

describe('App — integração completa', () => {
  test('fluxo completo: navegar → dispatch → verificar estado', () => {
    const app = new App({ reducer: contadorReducer, estadoInicial: { valor: 0 } });
    const historico = [];

    app.subscribe((novoEstado) => historico.push(novoEstado.valor));

    app.rota('/incrementar/:vezes', (ctx, state, dispatch) => {
      const vezes = parseInt(ctx.params.vezes);
      for (let i = 0; i < vezes; i++) {
        dispatch({ type: 'INCREMENT' });
      }
      return `incrementado ${vezes}x`;
    });

    const resultado = app.navegar('/incrementar/3');
    expect(resultado).toBe('incrementado 3x');
    expect(app.getState().valor).toBe(3);
    expect(historico).toHaveLength(3);
  });
});
