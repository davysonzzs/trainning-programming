const { criarFila } = require('../fila');

describe('criarFila', () => {
  let fila;

  beforeEach(() => {
    fila = criarFila();
  });

  describe('publicar e consumir', () => {
    test('publicar retorna id da mensagem', () => {
      const id = fila.publicar('pedidos', { pedidoId: 1 });
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    test('consumir retorna mensagem publicada', () => {
      fila.publicar('pedidos', { pedidoId: 1 });
      const msg = fila.consumir('pedidos');
      expect(msg).not.toBeNull();
      expect(msg.mensagem).toEqual({ pedidoId: 1 });
      expect(msg.topico).toBe('pedidos');
    });

    test('consumir retorna null para fila vazia', () => {
      expect(fila.consumir('topico-vazio')).toBeNull();
    });

    test('consumir remove a mensagem da fila', () => {
      fila.publicar('emails', { para: 'a@b.com' });
      fila.consumir('emails');
      expect(fila.consumir('emails')).toBeNull();
    });

    test('mensagens de alta prioridade sao consumidas primeiro', () => {
      fila.publicar('jobs', { tipo: 'baixa' }, 0);
      fila.publicar('jobs', { tipo: 'alta' }, 10);
      fila.publicar('jobs', { tipo: 'media' }, 5);
      const primeira = fila.consumir('jobs');
      expect(primeira.mensagem.tipo).toBe('alta');
    });

    test('topicos sao isolados entre si', () => {
      fila.publicar('topico-a', 'mensagem-a');
      expect(fila.consumir('topico-b')).toBeNull();
      const msg = fila.consumir('topico-a');
      expect(msg.mensagem).toBe('mensagem-a');
    });
  });

  describe('assinar e desassinar', () => {
    test('handler e chamado automaticamente ao publicar', () => {
      const handler = jest.fn();
      fila.assinar('notificacoes', handler);
      fila.publicar('notificacoes', { texto: 'ola' });
      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].mensagem).toEqual({ texto: 'ola' });
    });

    test('multiplos handlers sao chamados', () => {
      const h1 = jest.fn();
      const h2 = jest.fn();
      fila.assinar('eventos', h1);
      fila.assinar('eventos', h2);
      fila.publicar('eventos', 'dados');
      expect(h1).toHaveBeenCalled();
      expect(h2).toHaveBeenCalled();
    });

    test('handler desassinado nao e chamado', () => {
      const handler = jest.fn();
      fila.assinar('testes', handler);
      fila.desassinar('testes', handler);
      fila.publicar('testes', 'msg');
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('reprocessarFalhas', () => {
    test('reprocessa mensagens que falharam', () => {
      let chamadas = 0;
      fila.assinar('jobs', () => {
        chamadas++;
        if (chamadas === 1) throw new Error('falha temporaria');
      });
      fila.publicar('jobs', { tarefa: 'processar' });
      // Primeiro handler falhou — mensagem deve estar na lista de falhas
      const reprocessadas = fila.reprocessarFalhas();
      expect(reprocessadas).toBeGreaterThan(0);
    });

    test('nao reprocessa mensagens com 3 ou mais tentativas', () => {
      let chamadas = 0;
      fila.assinar('jobs', () => { throw new Error('falha'); });
      fila.publicar('jobs', { tarefa: 'x' });
      // Simula 3 tentativas
      fila.reprocessarFalhas();
      fila.reprocessarFalhas();
      const ultimaVez = fila.reprocessarFalhas();
      // Na 4a chamada, mensagem com 3 tentativas nao deve ser reprocessada
      const quarta = fila.reprocessarFalhas();
      expect(quarta).toBe(0);
    });
  });

  describe('estatisticas', () => {
    test('retorna estatisticas por topico', () => {
      fila.publicar('pedidos', { id: 1 });
      fila.publicar('pedidos', { id: 2 });
      fila.publicar('emails', { to: 'x' });
      const stats = fila.estatisticas();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('porTopico');
      expect(stats.porTopico).toHaveProperty('pedidos');
      expect(stats.porTopico).toHaveProperty('emails');
    });

    test('total reflete total de mensagens', () => {
      fila.publicar('a', 1);
      fila.publicar('a', 2);
      fila.publicar('b', 3);
      const stats = fila.estatisticas();
      expect(stats.total).toBeGreaterThanOrEqual(3);
    });

    test('pendentes decrementam apos consumir', () => {
      fila.publicar('fila-teste', 'msg1');
      fila.publicar('fila-teste', 'msg2');
      fila.consumir('fila-teste');
      const stats = fila.estatisticas();
      expect(stats.porTopico['fila-teste'].pendentes).toBe(1);
    });
  });
});
