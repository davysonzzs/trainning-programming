const { ClienteHTTP, tratarResposta } = require('../cliente');

const dadosIniciais = () => ({
  usuarios: [
    { id: 1, nome: 'Ana' },
    { id: 2, nome: 'Bruno' },
  ],
  produtos: [
    { id: 10, nome: 'Notebook' },
  ],
});

describe('ClienteHTTP — GET', () => {
  test('get deve retornar dados existentes com status 200', async () => {
    const cliente = new ClienteHTTP('http://api.local', { dados: dadosIniciais() });
    const res = await cliente.get('/usuarios');
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
    expect(res.dados).toHaveLength(2);
  });

  test('get deve retornar 404 para endpoint inexistente', async () => {
    const cliente = new ClienteHTTP('http://api.local', { dados: dadosIniciais() });
    const res = await cliente.get('/pedidos');
    expect(res.status).toBe(404);
    expect(res.ok).toBe(false);
    expect(res.dados).toBeNull();
  });

  test('get deve funcionar com diferentes endpoints', async () => {
    const cliente = new ClienteHTTP('http://api.local', { dados: dadosIniciais() });
    const res = await cliente.get('/produtos');
    expect(res.status).toBe(200);
    expect(res.dados[0].nome).toBe('Notebook');
  });
});

describe('ClienteHTTP — POST', () => {
  test('post deve adicionar item e retornar 201', async () => {
    const dados = dadosIniciais();
    const cliente = new ClienteHTTP('http://api.local', { dados });
    const novoUsuario = { id: 3, nome: 'Carlos' };
    const res = await cliente.post('/usuarios', novoUsuario);
    expect(res.status).toBe(201);
    expect(res.ok).toBe(true);
    expect(res.dados).toEqual(novoUsuario);
  });

  test('post deve persistir o item nos dados', async () => {
    const dados = dadosIniciais();
    const cliente = new ClienteHTTP('http://api.local', { dados });
    await cliente.post('/usuarios', { id: 3, nome: 'Carlos' });
    const res = await cliente.get('/usuarios');
    expect(res.dados).toHaveLength(3);
  });

  test('post com corpo null deve retornar 400', async () => {
    const cliente = new ClienteHTTP('http://api.local', { dados: dadosIniciais() });
    const res = await cliente.post('/usuarios', null);
    expect(res.status).toBe(400);
    expect(res.ok).toBe(false);
  });

  test('post com objeto vazio deve retornar 400', async () => {
    const cliente = new ClienteHTTP('http://api.local', { dados: dadosIniciais() });
    const res = await cliente.post('/usuarios', {});
    expect(res.status).toBe(400);
    expect(res.ok).toBe(false);
  });
});

describe('ClienteHTTP — DELETE', () => {
  test('delete deve remover item existente com status 200', async () => {
    const dados = dadosIniciais();
    const cliente = new ClienteHTTP('http://api.local', { dados });
    const res = await cliente.delete('/usuarios', 1);
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });

  test('delete deve efetivamente remover o item', async () => {
    const dados = dadosIniciais();
    const cliente = new ClienteHTTP('http://api.local', { dados });
    await cliente.delete('/usuarios', 1);
    const res = await cliente.get('/usuarios');
    expect(res.dados).toHaveLength(1);
    expect(res.dados[0].id).toBe(2);
  });

  test('delete com id inexistente deve retornar 404', async () => {
    const dados = dadosIniciais();
    const cliente = new ClienteHTTP('http://api.local', { dados });
    const res = await cliente.delete('/usuarios', 999);
    expect(res.status).toBe(404);
    expect(res.ok).toBe(false);
  });
});

describe('tratarResposta', () => {
  test('deve retornar dados quando ok é true', () => {
    const resposta = { ok: true, status: 200, dados: [1, 2, 3] };
    expect(tratarResposta(resposta)).toEqual([1, 2, 3]);
  });

  test('deve lançar erro quando ok é false', () => {
    const resposta = { ok: false, status: 404, dados: null };
    expect(() => tratarResposta(resposta)).toThrow('HTTP 404');
  });

  test('deve lançar erro com o status correto na mensagem', () => {
    const resposta = { ok: false, status: 400, dados: null };
    expect(() => tratarResposta(resposta)).toThrow('HTTP 400');
  });
});
