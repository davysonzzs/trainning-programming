const { ServicoUsuarios } = require('../servico');

describe('ServicoUsuarios - criar', () => {
  test('cria um usuário com id auto-incrementado', async () => {
    const servico = new ServicoUsuarios();
    const usuario = await servico.criar({ nome: 'Ana', email: 'ana@devtech.com' });
    expect(usuario.id).toBe(1);
    expect(usuario.nome).toBe('Ana');
    expect(usuario.email).toBe('ana@devtech.com');
  });

  test('incrementa o id a cada novo usuário', async () => {
    const servico = new ServicoUsuarios();
    const u1 = await servico.criar({ nome: 'Ana', email: 'ana@devtech.com' });
    const u2 = await servico.criar({ nome: 'Bruno', email: 'bruno@devtech.com' });
    expect(u1.id).toBe(1);
    expect(u2.id).toBe(2);
  });

  test('lança erro se nome estiver ausente', async () => {
    const servico = new ServicoUsuarios();
    await expect(servico.criar({ email: 'sem@nome.com' })).rejects.toThrow('Dados obrigatórios');
  });

  test('lança erro se email estiver ausente', async () => {
    const servico = new ServicoUsuarios();
    await expect(servico.criar({ nome: 'Sem Email' })).rejects.toThrow('Dados obrigatórios');
  });

  test('lança erro se email já estiver cadastrado', async () => {
    const servico = new ServicoUsuarios();
    await servico.criar({ nome: 'Ana', email: 'ana@devtech.com' });
    await expect(
      servico.criar({ nome: 'Ana Duplicada', email: 'ana@devtech.com' })
    ).rejects.toThrow('Email já cadastrado');
  });
});

describe('ServicoUsuarios - buscar', () => {
  test('retorna usuário existente pelo id', async () => {
    const servico = new ServicoUsuarios();
    await servico.criar({ nome: 'Carlos', email: 'carlos@devtech.com' });
    const usuario = await servico.buscar(1);
    expect(usuario.nome).toBe('Carlos');
  });

  test('lança erro se usuário não existir', async () => {
    const servico = new ServicoUsuarios();
    await expect(servico.buscar(999)).rejects.toThrow('Usuário não encontrado');
  });
});

describe('ServicoUsuarios - atualizar', () => {
  test('atualiza os dados do usuário com spread', async () => {
    const servico = new ServicoUsuarios();
    await servico.criar({ nome: 'Diego', email: 'diego@devtech.com' });
    const atualizado = await servico.atualizar(1, { nome: 'Diego Silva' });
    expect(atualizado.nome).toBe('Diego Silva');
    expect(atualizado.email).toBe('diego@devtech.com');
  });

  test('lança erro se usuário não existir', async () => {
    const servico = new ServicoUsuarios();
    await expect(servico.atualizar(999, { nome: 'X' })).rejects.toThrow('Usuário não encontrado');
  });
});

describe('ServicoUsuarios - listar', () => {
  test('retorna array com todos os usuários', async () => {
    const servico = new ServicoUsuarios();
    await servico.criar({ nome: 'Ana', email: 'ana@devtech.com' });
    await servico.criar({ nome: 'Bruno', email: 'bruno@devtech.com' });
    const lista = await servico.listar();
    expect(lista).toHaveLength(2);
  });

  test('retorna array vazio quando não há usuários', async () => {
    const servico = new ServicoUsuarios();
    const lista = await servico.listar();
    expect(lista).toEqual([]);
  });
});

describe('ServicoUsuarios - remover', () => {
  test('remove usuário e retorna true', async () => {
    const servico = new ServicoUsuarios();
    await servico.criar({ nome: 'Eva', email: 'eva@devtech.com' });
    const resultado = await servico.remover(1);
    expect(resultado).toBe(true);
    expect(await servico.listar()).toHaveLength(0);
  });

  test('lança erro se usuário não existir', async () => {
    const servico = new ServicoUsuarios();
    await expect(servico.remover(999)).rejects.toThrow('Usuário não encontrado');
  });
});

describe('ServicoUsuarios - total', () => {
  test('retorna 0 quando não há usuários', () => {
    const servico = new ServicoUsuarios();
    expect(servico.total()).toBe(0);
  });

  test('retorna a contagem correta após criações', async () => {
    const servico = new ServicoUsuarios();
    await servico.criar({ nome: 'A', email: 'a@devtech.com' });
    await servico.criar({ nome: 'B', email: 'b@devtech.com' });
    await servico.criar({ nome: 'C', email: 'c@devtech.com' });
    expect(servico.total()).toBe(3);
  });

  test('atualiza após remoção', async () => {
    const servico = new ServicoUsuarios();
    await servico.criar({ nome: 'A', email: 'a@devtech.com' });
    await servico.criar({ nome: 'B', email: 'b@devtech.com' });
    await servico.remover(1);
    expect(servico.total()).toBe(1);
  });
});
