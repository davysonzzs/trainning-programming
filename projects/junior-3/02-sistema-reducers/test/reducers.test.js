const {
  criarStore,
  combinarReducers,
  contadorReducer,
  listaReducer,
} = require('../reducers');

describe('contadorReducer', () => {
  test('estado inicial deve ter valor 0', () => {
    expect(contadorReducer(undefined, { type: '@@INIT' })).toEqual({ valor: 0 });
  });

  test('INCREMENT deve incrementar valor', () => {
    const estado = contadorReducer({ valor: 5 }, { type: 'INCREMENT' });
    expect(estado.valor).toBe(6);
  });

  test('DECREMENT deve decrementar valor', () => {
    const estado = contadorReducer({ valor: 5 }, { type: 'DECREMENT' });
    expect(estado.valor).toBe(4);
  });

  test('RESET deve zerar o valor', () => {
    const estado = contadorReducer({ valor: 99 }, { type: 'RESET' });
    expect(estado.valor).toBe(0);
  });

  test('SET deve definir valor via payload', () => {
    const estado = contadorReducer({ valor: 0 }, { type: 'SET', payload: 42 });
    expect(estado.valor).toBe(42);
  });

  test('action desconhecida deve retornar estado sem mudança', () => {
    const estadoOriginal = { valor: 10 };
    expect(contadorReducer(estadoOriginal, { type: 'NOOP' })).toEqual(estadoOriginal);
  });

  test('reducer deve ser puro — não deve mutar o estado original', () => {
    const original = { valor: 3 };
    contadorReducer(original, { type: 'INCREMENT' });
    expect(original.valor).toBe(3);
  });
});

describe('listaReducer', () => {
  test('estado inicial deve ter itens vazio', () => {
    expect(listaReducer(undefined, { type: '@@INIT' })).toEqual({ itens: [] });
  });

  test('ADD_ITEM deve adicionar item', () => {
    const estado = listaReducer({ itens: [] }, { type: 'ADD_ITEM', payload: { id: 1, nome: 'A' } });
    expect(estado.itens).toHaveLength(1);
    expect(estado.itens[0]).toEqual({ id: 1, nome: 'A' });
  });

  test('REMOVE_ITEM deve remover item pelo id', () => {
    const estado = listaReducer(
      { itens: [{ id: 1 }, { id: 2 }] },
      { type: 'REMOVE_ITEM', payload: 1 }
    );
    expect(estado.itens).toHaveLength(1);
    expect(estado.itens[0].id).toBe(2);
  });

  test('CLEAR deve esvaziar a lista', () => {
    const estado = listaReducer(
      { itens: [{ id: 1 }, { id: 2 }] },
      { type: 'CLEAR' }
    );
    expect(estado.itens).toHaveLength(0);
  });

  test('reducer deve ser puro — não deve mutar o estado original', () => {
    const original = { itens: [{ id: 1 }] };
    listaReducer(original, { type: 'ADD_ITEM', payload: { id: 2 } });
    expect(original.itens).toHaveLength(1);
  });
});

describe('criarStore', () => {
  test('getState deve retornar estado inicial', () => {
    const store = criarStore(contadorReducer, { valor: 5 });
    expect(store.getState()).toEqual({ valor: 5 });
  });

  test('dispatch deve atualizar o estado', () => {
    const store = criarStore(contadorReducer, { valor: 0 });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState().valor).toBe(1);
  });

  test('subscribe deve ser notificado após dispatch', () => {
    const store = criarStore(contadorReducer, { valor: 0 });
    const listener = jest.fn();
    store.subscribe(listener);
    store.dispatch({ type: 'INCREMENT' });
    expect(listener).toHaveBeenCalledWith({ valor: 1 });
  });

  test('unsubscribe deve parar as notificações', () => {
    const store = criarStore(contadorReducer, { valor: 0 });
    const listener = jest.fn();
    const unsub = store.subscribe(listener);
    unsub();
    store.dispatch({ type: 'INCREMENT' });
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('combinarReducers', () => {
  const rootReducer = combinarReducers({
    contador: contadorReducer,
    lista: listaReducer,
  });

  test('deve criar estado combinado inicial', () => {
    const estado = rootReducer(undefined, { type: '@@INIT' });
    expect(estado).toHaveProperty('contador');
    expect(estado).toHaveProperty('lista');
    expect(estado.contador.valor).toBe(0);
    expect(estado.lista.itens).toEqual([]);
  });

  test('dispatch de INCREMENT deve afetar apenas contador', () => {
    const store = criarStore(rootReducer);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState().contador.valor).toBe(1);
    expect(store.getState().lista.itens).toEqual([]);
  });

  test('dispatch de ADD_ITEM deve afetar apenas lista', () => {
    const store = criarStore(rootReducer);
    store.dispatch({ type: 'ADD_ITEM', payload: { id: 1, nome: 'X' } });
    expect(store.getState().lista.itens).toHaveLength(1);
    expect(store.getState().contador.valor).toBe(0);
  });
});
