const { RepositorioPedidos, ServicoPagamento, ServicoEmail, ProcessadorPedidos } = require('../integracao');

describe('ProcessadorPedidos — Testes de Integracao', () => {
  let repo;
  let pagamentoMock;
  let emailMock;
  let processador;

  const pedidoValido = {
    clienteId: 'cli-1',
    itens: [
      { produtoId: 'p1', quantidade: 2, preco: 100 },
      { produtoId: 'p2', quantidade: 1, preco: 50 },
    ],
    metodoPagamento: 'cartao',
    emailCliente: 'cliente@devtech.com',
  };

  beforeEach(() => {
    repo = new RepositorioPedidos();

    // Mocks das dependencias externas
    pagamentoMock = {
      cobrar: jest.fn().mockResolvedValue({ transacaoId: 'txn-123', status: 'aprovado' }),
      estornar: jest.fn().mockResolvedValue({ status: 'estornado' }),
    };

    emailMock = {
      enviar: jest.fn().mockResolvedValue({ enviado: true }),
    };

    processador = new ProcessadorPedidos(repo, pagamentoMock, emailMock);
  });

  describe('criar', () => {
    test('cria pedido e retorna com id e status aprovado', async () => {
      const resultado = await processador.criar(pedidoValido);
      expect(resultado).toHaveProperty('id');
      expect(resultado.status).toBe('aprovado');
    });

    test('calcula valor total corretamente', async () => {
      const resultado = await processador.criar(pedidoValido);
      expect(resultado.total).toBe(250); // 2*100 + 1*50
    });

    test('chama pagamento.cobrar com valor correto', async () => {
      await processador.criar(pedidoValido);
      expect(pagamentoMock.cobrar).toHaveBeenCalledWith(
        expect.any(String), // pedidoId
        250,                // total
        'cartao'            // metodoPagamento
      );
    });

    test('salva transacaoId no pedido', async () => {
      const resultado = await processador.criar(pedidoValido);
      expect(resultado.transacaoId).toBe('txn-123');
    });

    test('envia email de confirmacao apos aprovacao', async () => {
      await processador.criar(pedidoValido);
      expect(emailMock.enviar).toHaveBeenCalledWith(
        pedidoValido.emailCliente,
        expect.stringMatching(/confirmad/i),
        expect.any(String)
      );
    });

    test('lanca erro se pedido sem itens', async () => {
      const pedidoInvalido = { ...pedidoValido, itens: [] };
      await expect(processador.criar(pedidoInvalido)).rejects.toThrow();
    });

    test('lanca erro se pedido sem clienteId', async () => {
      const pedidoInvalido = { ...pedidoValido, clienteId: undefined };
      await expect(processador.criar(pedidoInvalido)).rejects.toThrow();
    });

    test('nao salva pedido se pagamento falha', async () => {
      pagamentoMock.cobrar.mockRejectedValueOnce(new Error('Cartao recusado'));
      await expect(processador.criar(pedidoValido)).rejects.toThrow('Cartao recusado');
      const lista = await processador.listar({});
      expect(lista).toHaveLength(0);
    });

    test('nao envia email se pagamento falha', async () => {
      pagamentoMock.cobrar.mockRejectedValueOnce(new Error('Cartao recusado'));
      try { await processador.criar(pedidoValido); } catch {}
      expect(emailMock.enviar).not.toHaveBeenCalled();
    });
  });

  describe('cancelar', () => {
    let pedidoCriado;

    beforeEach(async () => {
      pedidoCriado = await processador.criar(pedidoValido);
    });

    test('cancela pedido e atualiza status', async () => {
      const resultado = await processador.cancelar(pedidoCriado.id, 'Cliente desistiu');
      expect(resultado.status).toBe('cancelado');
    });

    test('chama estornar com transacaoId correto', async () => {
      await processador.cancelar(pedidoCriado.id, 'Motivo qualquer');
      expect(pagamentoMock.estornar).toHaveBeenCalledWith('txn-123');
    });

    test('envia email de cancelamento', async () => {
      emailMock.enviar.mockClear();
      await processador.cancelar(pedidoCriado.id, 'Teste');
      expect(emailMock.enviar).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringMatching(/cancel/i),
        expect.any(String)
      );
    });

    test('lanca erro para pedido inexistente', async () => {
      await expect(processador.cancelar('id-invalido', 'motivo')).rejects.toThrow();
    });
  });

  describe('listar', () => {
    beforeEach(async () => {
      await processador.criar(pedidoValido);
      await processador.criar({ ...pedidoValido, clienteId: 'cli-2' });
    });

    test('lista todos os pedidos sem filtro', async () => {
      const lista = await processador.listar({});
      expect(lista).toHaveLength(2);
    });

    test('filtra pedidos por status', async () => {
      const aprovados = await processador.listar({ status: 'aprovado' });
      expect(aprovados.length).toBeGreaterThan(0);
      aprovados.forEach(p => expect(p.status).toBe('aprovado'));
    });
  });
});
