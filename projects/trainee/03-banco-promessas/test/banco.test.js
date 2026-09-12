const {
  buscarConta,
  validarTransferencia,
  calcularTarifas,
  processarTransacoes,
  primeiraResposta,
} = require('../banco');

const contasMock = [
  { id: 1, titular: 'Ana', saldo: 500 },
  { id: 2, titular: 'Bruno', saldo: 200 },
];

describe('buscarConta', () => {
  test('resolve com a conta quando encontrada', () => {
    return buscarConta(1, contasMock).then((conta) => {
      expect(conta).toEqual({ id: 1, titular: 'Ana', saldo: 500 });
    });
  });

  test('rejeita com erro quando conta não encontrada', () => {
    return expect(buscarConta(99, contasMock)).rejects.toThrow('Conta não encontrada');
  });

  test('resolve com a conta correta pelo id', () => {
    return buscarConta(2, contasMock).then((conta) => {
      expect(conta.titular).toBe('Bruno');
    });
  });
});

describe('validarTransferencia', () => {
  test('resolve com o valor quando saldo é suficiente', () => {
    return expect(validarTransferencia(100, 500)).resolves.toBe(100);
  });

  test('resolve quando valor é igual ao saldo', () => {
    return expect(validarTransferencia(200, 200)).resolves.toBe(200);
  });

  test('rejeita com erro quando saldo é insuficiente', () => {
    return expect(validarTransferencia(300, 100)).rejects.toThrow('Saldo insuficiente');
  });
});

describe('calcularTarifas', () => {
  test('resolve com valor, tarifa e total corretos', () => {
    return calcularTarifas(200).then((resultado) => {
      expect(resultado.valor).toBe(200);
      expect(resultado.tarifa).toBe(2);
      expect(resultado.total).toBe(202);
    });
  });

  test('calcula 1% de tarifa sobre o valor', () => {
    return calcularTarifas(1000).then((resultado) => {
      expect(resultado.tarifa).toBe(10);
      expect(resultado.total).toBe(1010);
    });
  });

  test('funciona com valores pequenos', () => {
    return calcularTarifas(50).then((resultado) => {
      expect(resultado.tarifa).toBe(0.5);
      expect(resultado.total).toBe(50.5);
    });
  });
});

describe('processarTransacoes', () => {
  test('resolve com array de resultados quando todas resolvem', () => {
    const transacoes = [
      Promise.resolve('tx1'),
      Promise.resolve('tx2'),
      Promise.resolve('tx3'),
    ];
    return expect(processarTransacoes(transacoes)).resolves.toEqual(['tx1', 'tx2', 'tx3']);
  });

  test('rejeita se qualquer transação falhar', () => {
    const transacoes = [
      Promise.resolve('ok'),
      Promise.reject(new Error('falha na tx')),
      Promise.resolve('ok2'),
    ];
    return expect(processarTransacoes(transacoes)).rejects.toThrow('falha na tx');
  });

  test('funciona com array vazio', () => {
    return expect(processarTransacoes([])).resolves.toEqual([]);
  });
});

describe('primeiraResposta', () => {
  test('resolve com a primeira Promise que resolver', () => {
    const fontes = [
      new Promise((resolve) => setTimeout(() => resolve('lento'), 100)),
      Promise.resolve('rápido'),
    ];
    return expect(primeiraResposta(fontes)).resolves.toBe('rápido');
  });

  test('rejeita se a primeira a se estabelecer for uma rejeição', () => {
    const fontes = [
      new Promise((resolve) => setTimeout(() => resolve('tarde'), 100)),
      Promise.reject(new Error('primeira falha')),
    ];
    return expect(primeiraResposta(fontes)).rejects.toThrow('primeira falha');
  });
});
