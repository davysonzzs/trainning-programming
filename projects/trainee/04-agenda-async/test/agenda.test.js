const {
  buscarContato,
  adicionarContato,
  removerContato,
  sincronizarAgendas,
} = require('../agenda');

const agendaMock = [
  { nome: 'Ana Paula', email: 'ana@devtech.com' },
  { nome: 'Bruno Santos', email: 'bruno@devtech.com' },
  { nome: 'Carla Melo', email: 'carla@devtech.com' },
];

describe('buscarContato', () => {
  test('retorna contato quando encontrado (case-insensitive)', async () => {
    const contato = await buscarContato('ana paula', agendaMock);
    expect(contato.email).toBe('ana@devtech.com');
  });

  test('busca com capitalização diferente', async () => {
    const contato = await buscarContato('BRUNO SANTOS', agendaMock);
    expect(contato.nome).toBe('Bruno Santos');
  });

  test('lança erro quando contato não encontrado', async () => {
    await expect(buscarContato('Fantasma', agendaMock)).rejects.toThrow('Contato não encontrado');
  });
});

describe('adicionarContato', () => {
  test('adiciona contato válido e retorna novo array', async () => {
    const novo = { nome: 'Diego', email: 'diego@devtech.com' };
    const resultado = await adicionarContato(novo, agendaMock);
    expect(resultado).toHaveLength(agendaMock.length + 1);
    expect(resultado.find((c) => c.email === 'diego@devtech.com')).toBeTruthy();
  });

  test('não modifica o array original', async () => {
    const original = [{ nome: 'X', email: 'x@x.com' }];
    const copia = [...original];
    await adicionarContato({ nome: 'Y', email: 'y@y.com' }, original);
    expect(original).toEqual(copia);
  });

  test('lança erro se nome estiver ausente', async () => {
    await expect(adicionarContato({ email: 'sem@nome.com' }, [])).rejects.toThrow('Dados inválidos');
  });

  test('lança erro se email estiver ausente', async () => {
    await expect(adicionarContato({ nome: 'Sem Email' }, [])).rejects.toThrow('Dados inválidos');
  });

  test('lança erro se nome for string vazia', async () => {
    await expect(adicionarContato({ nome: '', email: 'a@a.com' }, [])).rejects.toThrow(
      'Dados inválidos'
    );
  });
});

describe('removerContato', () => {
  test('remove contato pelo email e retorna novo array', async () => {
    const resultado = await removerContato('ana@devtech.com', agendaMock);
    expect(resultado).toHaveLength(agendaMock.length - 1);
    expect(resultado.find((c) => c.email === 'ana@devtech.com')).toBeUndefined();
  });

  test('comparação de email é case-insensitive', async () => {
    const resultado = await removerContato('BRUNO@DEVTECH.COM', agendaMock);
    expect(resultado.find((c) => c.nome === 'Bruno Santos')).toBeUndefined();
  });

  test('lança erro se contato não encontrado', async () => {
    await expect(removerContato('inexistente@devtech.com', agendaMock)).rejects.toThrow(
      'Contato não encontrado'
    );
  });

  test('não modifica o array original', async () => {
    const original = [{ nome: 'A', email: 'a@a.com' }];
    await removerContato('a@a.com', original);
    expect(original).toHaveLength(1);
  });
});

describe('sincronizarAgendas', () => {
  test('combina duas agendas sem duplicatas', async () => {
    const a1 = [{ nome: 'Ana', email: 'ana@a.com' }];
    const a2 = [{ nome: 'Bruno', email: 'bruno@b.com' }];
    const resultado = await sincronizarAgendas(a1, a2);
    expect(resultado).toHaveLength(2);
  });

  test('em conflito de email, mantém contato da agenda1', async () => {
    const a1 = [{ nome: 'Ana Original', email: 'shared@email.com' }];
    const a2 = [{ nome: 'Ana Duplicada', email: 'shared@email.com' }];
    const resultado = await sincronizarAgendas(a1, a2);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nome).toBe('Ana Original');
  });

  test('resultado está ordenado por nome', async () => {
    const a1 = [{ nome: 'Zara', email: 'z@z.com' }, { nome: 'Ana', email: 'a@a.com' }];
    const a2 = [{ nome: 'Miguel', email: 'm@m.com' }];
    const resultado = await sincronizarAgendas(a1, a2);
    expect(resultado[0].nome).toBe('Ana');
    expect(resultado[1].nome).toBe('Miguel');
    expect(resultado[2].nome).toBe('Zara');
  });

  test('funciona quando uma das agendas está vazia', async () => {
    const a1 = [{ nome: 'Carlos', email: 'c@c.com' }];
    const resultado = await sincronizarAgendas(a1, []);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nome).toBe('Carlos');
  });
});
