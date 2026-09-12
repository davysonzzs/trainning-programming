const { SistemaSeguro } = require('../sistema');

describe('SistemaSeguro', () => {
  let sistema;

  beforeEach(() => {
    sistema = new SistemaSeguro();
  });

  describe('registrarUsuario', () => {
    test('registra usuario e retorna dados sem senha', async () => {
      const resultado = await sistema.registrarUsuario({
        nome: 'Ana Silva',
        email: 'ana@devtech.com',
        senha: 'senha123',
      });
      expect(resultado).toHaveProperty('id');
      expect(resultado).toHaveProperty('nome', 'Ana Silva');
      expect(resultado).toHaveProperty('email', 'ana@devtech.com');
      expect(resultado).not.toHaveProperty('senha');
    });

    test('lanca erro se email ja cadastrado', async () => {
      await sistema.registrarUsuario({ nome: 'Ana', email: 'ana@devtech.com', senha: '123' });
      await expect(
        sistema.registrarUsuario({ nome: 'Ana 2', email: 'ana@devtech.com', senha: '456' })
      ).rejects.toThrow(/cadastrado/i);
    });

    test('registra multiplos usuarios com emails diferentes', async () => {
      await sistema.registrarUsuario({ nome: 'Ana', email: 'ana@devtech.com', senha: '123' });
      await expect(
        sistema.registrarUsuario({ nome: 'Bob', email: 'bob@devtech.com', senha: '456' })
      ).resolves.toHaveProperty('email', 'bob@devtech.com');
    });
  });

  describe('autenticar', () => {
    beforeEach(async () => {
      await sistema.registrarUsuario({ nome: 'Ana', email: 'ana@devtech.com', senha: 'senha-correta' });
    });

    test('retorna token e dados do usuario para credenciais corretas', async () => {
      const resultado = await sistema.autenticar('ana@devtech.com', 'senha-correta');
      expect(resultado).toHaveProperty('token');
      expect(resultado).toHaveProperty('usuario');
      expect(resultado.usuario).toHaveProperty('email', 'ana@devtech.com');
      expect(resultado.usuario).not.toHaveProperty('senha');
    });

    test('lanca erro para email nao encontrado', async () => {
      await expect(sistema.autenticar('ninguem@devtech.com', 'senha')).rejects.toThrow(/credenciais/i);
    });

    test('lanca erro para senha incorreta', async () => {
      await expect(sistema.autenticar('ana@devtech.com', 'senha-errada')).rejects.toThrow(/credenciais/i);
    });

    test('token gerado e valido (pode ser verificado)', async () => {
      const { token } = await sistema.autenticar('ana@devtech.com', 'senha-correta');
      const temAcesso = await sistema.verificarAcesso(token, 'ler:perfil');
      expect(temAcesso).toBe(true);
    });
  });

  describe('verificarAcesso', () => {
    let tokenUsuario;

    beforeEach(async () => {
      await sistema.registrarUsuario({ nome: 'Bob', email: 'bob@devtech.com', senha: 'bob123' });
      const auth = await sistema.autenticar('bob@devtech.com', 'bob123');
      tokenUsuario = auth.token;
    });

    test('retorna true para permissao que usuario tem', async () => {
      expect(await sistema.verificarAcesso(tokenUsuario, 'ler:perfil')).toBe(true);
    });

    test('retorna false para permissao que usuario nao tem', async () => {
      expect(await sistema.verificarAcesso(tokenUsuario, 'admin:tudo')).toBe(false);
    });

    test('lanca erro para token invalido', async () => {
      await expect(sistema.verificarAcesso('token.invalido.aqui', 'ler:perfil')).rejects.toThrow();
    });
  });

  describe('promoverAdmin', () => {
    let tokenAdmin, tokenUsuario, usuarioId;

    beforeEach(async () => {
      // Registra e autentica admin
      await sistema.registrarUsuario({ nome: 'Admin', email: 'admin@devtech.com', senha: 'admin123' });
      // Promove manualmente para admin (hack direto no sistema para bootstrap)
      const authAdmin = await sistema.autenticar('admin@devtech.com', 'admin123');
      // Para o teste funcionar, precisamos de um admin inicial — o sistema deve ter forma de criar o primeiro admin
      // Voce pode implementar um metodo 'bootstrapAdmin' ou usar uma flag no registrar
      // Por simplicidade, use sistema._promoverDireto('admin@devtech.com') ou similar
      // OU o primeiro usuario registrado vira admin
      // Verifique o README para a abordagem escolhida

      // Registra usuario comum
      const u = await sistema.registrarUsuario({ nome: 'Carlos', email: 'carlos@devtech.com', senha: 'carlos123' });
      usuarioId = u.id;
      const authUsuario = await sistema.autenticar('carlos@devtech.com', 'carlos123');
      tokenUsuario = authUsuario.token;

      // Usa token admin (veja nota acima)
      tokenAdmin = authAdmin.token;
    });

    test('usuario comum nao pode promover outros', async () => {
      await expect(sistema.promoverAdmin(tokenUsuario, usuarioId)).rejects.toThrow();
    });
  });

  describe('listarUsuarios', () => {
    let tokenComum;

    beforeEach(async () => {
      await sistema.registrarUsuario({ nome: 'Ana', email: 'ana@devtech.com', senha: '123' });
      await sistema.registrarUsuario({ nome: 'Bob', email: 'bob@devtech.com', senha: '456' });
      const auth = await sistema.autenticar('ana@devtech.com', '123');
      tokenComum = auth.token;
    });

    test('usuario comum nao pode listar usuarios', async () => {
      await expect(sistema.listarUsuarios(tokenComum)).rejects.toThrow();
    });

    test('lista retornada nao contem senhas', async () => {
      // Se o sistema tiver metodo de bootstrap de admin, use aqui
      // Senao, valide que a funcao existe e lanca erro para usuario sem permissao
      try {
        const lista = await sistema.listarUsuarios(tokenComum);
        lista.forEach(u => expect(u).not.toHaveProperty('senha'));
      } catch (e) {
        expect(e.message).toMatch(/permissao|acesso|autorizacao/i);
      }
    });
  });
});
