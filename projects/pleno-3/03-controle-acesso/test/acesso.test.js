const { criarSistemaACL } = require('../acesso');

describe('criarSistemaACL', () => {
  let acl;

  beforeEach(() => {
    acl = criarSistemaACL();
    acl.definirPermissoes('leitor', ['ler:artigo', 'ler:comentario']);
    acl.definirPermissoes('editor', ['criar:artigo', 'editar:artigo']);
    acl.definirPermissoes('admin', ['deletar:artigo', 'gerenciar:usuario', 'ler:artigo']);
    acl.atribuirPapel('user-1', 'leitor');
    acl.atribuirPapel('user-2', 'editor');
    acl.atribuirPapel('user-3', 'admin');
  });

  describe('verificar', () => {
    test('retorna true quando usuario tem a permissao', () => {
      expect(acl.verificar('user-1', 'ler:artigo')).toBe(true);
    });

    test('retorna false quando usuario nao tem a permissao', () => {
      expect(acl.verificar('user-1', 'deletar:artigo')).toBe(false);
    });

    test('retorna false para usuario sem papel atribuido', () => {
      expect(acl.verificar('user-sem-papel', 'ler:artigo')).toBe(false);
    });

    test('permissoes sao especificas por papel', () => {
      expect(acl.verificar('user-2', 'criar:artigo')).toBe(true);
      expect(acl.verificar('user-2', 'ler:comentario')).toBe(false);
    });
  });

  describe('verificarTodos', () => {
    test('retorna true se usuario tem todas as permissoes', () => {
      expect(acl.verificarTodos('user-1', ['ler:artigo', 'ler:comentario'])).toBe(true);
    });

    test('retorna false se usuario nao tem alguma das permissoes', () => {
      expect(acl.verificarTodos('user-1', ['ler:artigo', 'criar:artigo'])).toBe(false);
    });

    test('retorna true para lista vazia de permissoes', () => {
      expect(acl.verificarTodos('user-1', [])).toBe(true);
    });
  });

  describe('verificarAlgum', () => {
    test('retorna true se usuario tem pelo menos uma permissao', () => {
      expect(acl.verificarAlgum('user-1', ['ler:artigo', 'criar:artigo'])).toBe(true);
    });

    test('retorna false se usuario nao tem nenhuma das permissoes', () => {
      expect(acl.verificarAlgum('user-1', ['criar:artigo', 'deletar:artigo'])).toBe(false);
    });

    test('retorna false para lista vazia', () => {
      expect(acl.verificarAlgum('user-1', [])).toBe(false);
    });
  });

  describe('herdar', () => {
    test('papel filho herda permissoes do pai', () => {
      acl.herdar('editor', 'leitor');
      expect(acl.verificar('user-2', 'ler:artigo')).toBe(true);
      expect(acl.verificar('user-2', 'ler:comentario')).toBe(true);
    });

    test('papel filho mantem suas proprias permissoes alem das herdadas', () => {
      acl.herdar('editor', 'leitor');
      expect(acl.verificar('user-2', 'criar:artigo')).toBe(true);
    });

    test('novas permissoes adicionadas ao pai sao herdadas automaticamente', () => {
      acl.herdar('editor', 'leitor');
      acl.definirPermissoes('leitor', ['ler:artigo', 'ler:comentario', 'ler:perfil']);
      expect(acl.verificar('user-2', 'ler:perfil')).toBe(true);
    });

    test('heranca em cadeia funciona', () => {
      acl.definirPermissoes('superadmin', ['tudo:sistema']);
      acl.herdar('admin', 'editor');
      acl.herdar('superadmin', 'admin');
      acl.atribuirPapel('user-sa', 'superadmin');
      expect(acl.verificar('user-sa', 'tudo:sistema')).toBe(true);
      expect(acl.verificar('user-sa', 'criar:artigo')).toBe(true);
    });
  });

  describe('listarPermissoes', () => {
    test('lista todas as permissoes do usuario', () => {
      const perms = acl.listarPermissoes('user-1');
      expect(perms).toContain('ler:artigo');
      expect(perms).toContain('ler:comentario');
    });

    test('nao contem duplicatas', () => {
      acl.herdar('editor', 'leitor');
      acl.definirPermissoes('editor', ['ler:artigo', 'criar:artigo']); // ler:artigo duplicado com leitor
      const perms = acl.listarPermissoes('user-2');
      const counts = {};
      perms.forEach(p => { counts[p] = (counts[p] || 0) + 1; });
      Object.values(counts).forEach(c => expect(c).toBe(1));
    });

    test('retorna array vazio para usuario sem papel', () => {
      expect(acl.listarPermissoes('ninguem')).toEqual([]);
    });
  });

  describe('middleware', () => {
    test('chama next() quando usuario tem permissao', () => {
      const mw = acl.middleware('ler:artigo');
      const req = { usuario: { id: 'user-1' } };
      const next = jest.fn();
      mw(req, {}, next);
      expect(next).toHaveBeenCalledWith();
    });

    test('chama next com erro quando usuario nao tem permissao', () => {
      const mw = acl.middleware('deletar:artigo');
      const req = { usuario: { id: 'user-1' } };
      const next = jest.fn();
      mw(req, {}, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test('erro passado ao next contem mensagem de acesso negado', () => {
      const mw = acl.middleware('criar:artigo');
      const req = { usuario: { id: 'user-1' } };
      const next = jest.fn();
      mw(req, {}, next);
      const erro = next.mock.calls[0][0];
      expect(erro.message).toMatch(/acesso negado/i);
    });
  });
});
