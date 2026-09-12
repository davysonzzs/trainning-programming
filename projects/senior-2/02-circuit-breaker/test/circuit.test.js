const { CircuitBreaker } = require('../circuit');

describe('CircuitBreaker', () => {
  const fnSucesso = jest.fn().mockResolvedValue('ok');
  const fnFalha = jest.fn().mockRejectedValue(new Error('servico indisponivel'));

  beforeEach(() => {
    fnSucesso.mockClear();
    fnFalha.mockClear();
  });

  describe('estado FECHADO (normal)', () => {
    test('inicia no estado FECHADO', () => {
      const cb = new CircuitBreaker(fnSucesso);
      expect(cb.estado()).toBe('FECHADO');
    });

    test('executa funcao e retorna resultado no estado FECHADO', async () => {
      const cb = new CircuitBreaker(fnSucesso);
      const resultado = await cb.executar();
      expect(resultado).toBe('ok');
    });

    test('propaga erro sem abrir circuito (abaixo do limiar)', async () => {
      const cb = new CircuitBreaker(fnFalha, { limiarFalhas: 3 });
      try { await cb.executar(); } catch {}
      try { await cb.executar(); } catch {}
      expect(cb.estado()).toBe('FECHADO');
    });

    test('abre circuito apos atingir limiarFalhas', async () => {
      const cb = new CircuitBreaker(fnFalha, { limiarFalhas: 3 });
      for (let i = 0; i < 3; i++) {
        try { await cb.executar(); } catch {}
      }
      expect(cb.estado()).toBe('ABERTO');
    });

    test('sucesso zera contagem de falhas consecutivas', async () => {
      const cb = new CircuitBreaker(jest.fn()
        .mockRejectedValueOnce(new Error('err'))
        .mockRejectedValueOnce(new Error('err'))
        .mockResolvedValue('ok'),
        { limiarFalhas: 3 }
      );
      try { await cb.executar(); } catch {}
      try { await cb.executar(); } catch {}
      await cb.executar(); // sucesso — reseta contagem
      expect(cb.estado()).toBe('FECHADO');
      expect(cb.estatisticas().falhas).toBe(0);
    });
  });

  describe('estado ABERTO', () => {
    let cb;

    beforeEach(async () => {
      cb = new CircuitBreaker(fnFalha, { limiarFalhas: 2, timeoutMs: 1000 });
      for (let i = 0; i < 2; i++) {
        try { await cb.executar(); } catch {}
      }
    });

    test('lanca erro imediatamente sem chamar fn', async () => {
      fnFalha.mockClear();
      await expect(cb.executar()).rejects.toThrow('Circuito aberto');
      expect(fnFalha).not.toHaveBeenCalled();
    });

    test('transita para MEIO_ABERTO apos timeout', async () => {
      // Usa parametro agora para simular passagem de tempo
      const cbComAgora = new CircuitBreaker(fnFalha, {
        limiarFalhas: 2,
        timeoutMs: 1000,
        agora: () => Date.now() + 2000, // simula 2s no futuro
      });
      for (let i = 0; i < 2; i++) {
        try { await cbComAgora.executar(); } catch {}
      }
      try { await cbComAgora.executar(); } catch {}
      expect(cbComAgora.estado()).toBe('MEIO_ABERTO');
    });
  });

  describe('estado MEIO_ABERTO', () => {
    function criarCbMeioAberto(fnInterna) {
      const cb = new CircuitBreaker(fnInterna, {
        limiarFalhas: 1,
        timeoutMs: 100,
        limiarSucesso: 2,
        agora: () => Date.now() + 200,
      });
      return cb;
    }

    test('sucesso suficiente fecha o circuito', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('abre'))
        .mockResolvedValue('ok');
      const cb = criarCbMeioAberto(fn);
      try { await cb.executar(); } catch {} // abre
      await cb.executar(); // MEIO_ABERTO, sucesso 1
      await cb.executar(); // MEIO_ABERTO, sucesso 2 -> FECHADO
      expect(cb.estado()).toBe('FECHADO');
    });

    test('falha em MEIO_ABERTO volta para ABERTO', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('abre'))
        .mockRejectedValueOnce(new Error('falha em meio-aberto'));
      const cb = criarCbMeioAberto(fn);
      try { await cb.executar(); } catch {} // abre
      try { await cb.executar(); } catch {} // meio-aberto, falha -> aberto
      expect(cb.estado()).toBe('ABERTO');
    });
  });

  describe('estatisticas e resetar', () => {
    test('estatisticas retorna campos corretos', () => {
      const cb = new CircuitBreaker(fnSucesso);
      const stats = cb.estatisticas();
      expect(stats).toHaveProperty('estado');
      expect(stats).toHaveProperty('falhas');
      expect(stats).toHaveProperty('sucessos');
      expect(stats).toHaveProperty('totalChamadas');
    });

    test('totalChamadas incrementa a cada executar', async () => {
      const cb = new CircuitBreaker(fnSucesso);
      await cb.executar();
      await cb.executar();
      expect(cb.estatisticas().totalChamadas).toBe(2);
    });

    test('resetar volta para FECHADO', async () => {
      const cb = new CircuitBreaker(fnFalha, { limiarFalhas: 1 });
      try { await cb.executar(); } catch {}
      expect(cb.estado()).toBe('ABERTO');
      cb.resetar();
      expect(cb.estado()).toBe('FECHADO');
      expect(cb.estatisticas().falhas).toBe(0);
    });
  });
});
