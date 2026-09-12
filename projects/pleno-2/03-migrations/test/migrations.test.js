const { criarSistemaMigrations } = require('../migrations');

function criarBanco() {
  return { tabelas: {} };
}

describe('registrar e status', () => {
  test('migrations registradas aparecem como pendentes', () => {
    const banco = criarBanco();
    const sys = criarSistemaMigrations(banco);
    sys.registrar('001_criar_usuarios', (b) => { b.tabelas.usuarios = []; }, (b) => { delete b.tabelas.usuarios; });
    const { pendentes, executadas } = sys.status();
    expect(pendentes).toContain('001_criar_usuarios');
    expect(executadas).toHaveLength(0);
  });

  test('múltiplas migrations registradas aparecem como pendentes', () => {
    const banco = criarBanco();
    const sys = criarSistemaMigrations(banco);
    sys.registrar('001', () => {}, () => {});
    sys.registrar('002', () => {}, () => {});
    expect(sys.status().pendentes.length).toBe(2);
  });
});

describe('migrar()', () => {
  test('executa up das migrations pendentes', async () => {
    const banco = criarBanco();
    const sys = criarSistemaMigrations(banco);
    sys.registrar('001_criar_usuarios', (b) => { b.tabelas.usuarios = []; }, (b) => { delete b.tabelas.usuarios; });
    await sys.migrar();
    expect(banco.tabelas.usuarios).toBeDefined();
  });

  test('retorna array com nomes das migrations executadas', async () => {
    const banco = criarBanco();
    const sys = criarSistemaMigrations(banco);
    sys.registrar('001', () => {}, () => {});
    sys.registrar('002', () => {}, () => {});
    const executadas = await sys.migrar();
    expect(executadas).toContain('001');
    expect(executadas).toContain('002');
  });

  test('executa migrations em ordem de registro', async () => {
    const banco = criarBanco();
    const sys = criarSistemaMigrations(banco);
    const ordem = [];
    sys.registrar('001', () => ordem.push(1), () => {});
    sys.registrar('002', () => ordem.push(2), () => {});
    sys.registrar('003', () => ordem.push(3), () => {});
    await sys.migrar();
    expect(ordem).toEqual([1, 2, 3]);
  });

  test('segunda chamada a migrar() não reexecuta migrations já executadas', async () => {
    const banco = criarBanco();
    const sys = criarSistemaMigrations(banco);
    let contador = 0;
    sys.registrar('001', () => contador++, () => contador--);
    await sys.migrar();
    const novasExecutadas = await sys.migrar();
    expect(contador).toBe(1);
    expect(novasExecutadas).toHaveLength(0);
  });

  test('após migrar(), migrations ficam como executadas', async () => {
    const banco = criarBanco();
    const sys = criarSistemaMigrations(banco);
    sys.registrar('001', () => {}, () => {});
    await sys.migrar();
    const { executadas, pendentes } = sys.status();
    expect(executadas).toContain('001');
    expect(pendentes).not.toContain('001');
  });
});

describe('reverter()', () => {
  test('reverte a última migration executada', async () => {
    const banco = criarBanco();
    const sys = criarSistemaMigrations(banco);
    sys.registrar('001_criar_produtos', (b) => { b.tabelas.produtos = []; }, (b) => { delete b.tabelas.produtos; });
    await sys.migrar();
    await sys.reverter();
    expect(banco.tabelas.produtos).toBeUndefined();
  });

  test('retorna array com nomes das migrations revertidas', async () => {
    const banco = criarBanco();
    const sys = criarSistemaMigrations(banco);
    sys.registrar('001', () => {}, () => {});
    sys.registrar('002', () => {}, () => {});
    await sys.migrar();
    const revertidas = await sys.reverter(1);
    expect(revertidas).toContain('002');
    expect(revertidas.length).toBe(1);
  });

  test('reverter(2) reverte as 2 últimas na ordem inversa', async () => {
    const banco = criarBanco();
    const sys = criarSistemaMigrations(banco);
    const ordem = [];
    sys.registrar('001', () => ordem.push('up1'), () => ordem.push('down1'));
    sys.registrar('002', () => ordem.push('up2'), () => ordem.push('down2'));
    await sys.migrar();
    ordem.length = 0;
    await sys.reverter(2);
    expect(ordem).toEqual(['down2', 'down1']);
  });

  test('após reverter, migration volta a ser pendente', async () => {
    const banco = criarBanco();
    const sys = criarSistemaMigrations(banco);
    sys.registrar('001', () => {}, () => {});
    await sys.migrar();
    await sys.reverter();
    expect(sys.status().pendentes).toContain('001');
    expect(sys.status().executadas).not.toContain('001');
  });
});

describe('historico()', () => {
  test('retorna array vazio antes de migrar', () => {
    const sys = criarSistemaMigrations(criarBanco());
    sys.registrar('001', () => {}, () => {});
    expect(sys.historico()).toHaveLength(0);
  });

  test('retorna registros com nome e executadaEm após migrar', async () => {
    const sys = criarSistemaMigrations(criarBanco());
    sys.registrar('001', () => {}, () => {});
    await sys.migrar();
    const hist = sys.historico();
    expect(hist.length).toBe(1);
    expect(hist[0].nome).toBe('001');
    expect(hist[0].executadaEm).toBeDefined();
  });

  test('historico em ordem cronológica', async () => {
    const sys = criarSistemaMigrations(criarBanco());
    sys.registrar('001', () => {}, () => {});
    sys.registrar('002', () => {}, () => {});
    await sys.migrar();
    const hist = sys.historico();
    expect(hist[0].nome).toBe('001');
    expect(hist[1].nome).toBe('002');
  });
});
