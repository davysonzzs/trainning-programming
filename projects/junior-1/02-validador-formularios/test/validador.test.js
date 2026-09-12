const {
  validarEmail,
  validarSenha,
  validarCPF,
  validarCampos,
  validarTudo,
} = require('../validador');

// ─── validarEmail ────────────────────────────────────────────────────────────

describe('validarEmail', () => {
  test('aceita email válido simples', () => {
    expect(validarEmail('usuario@email.com')).toBe(true);
  });

  test('aceita email com subdomínio', () => {
    expect(validarEmail('nome.sobrenome@empresa.com.br')).toBe(true);
  });

  test('lança erro para email sem @', () => {
    expect(() => validarEmail('semArroba.com')).toThrow('Email inválido');
  });

  test('lança erro para email com espaço', () => {
    expect(() => validarEmail('com espaco@email.com')).toThrow('Email inválido');
  });

  test('lança erro para email sem domínio após @', () => {
    expect(() => validarEmail('nome@')).toThrow('Email inválido');
  });

  test('lança erro para email apenas com @', () => {
    expect(() => validarEmail('@semdominio')).toThrow('Email inválido');
  });

  test('lança erro para string vazia', () => {
    expect(() => validarEmail('')).toThrow('Email inválido');
  });

  test('lança erro para email sem ponto no domínio', () => {
    expect(() => validarEmail('user@semPonto')).toThrow('Email inválido');
  });
});

// ─── validarSenha ────────────────────────────────────────────────────────────

describe('validarSenha', () => {
  test('aceita senha válida', () => {
    expect(validarSenha('Senha123')).toBe(true);
  });

  test('aceita senha longa com múltiplos números e maiúsculas', () => {
    expect(validarSenha('MinhaSenha2024!')).toBe(true);
  });

  test('lança erro para senha com menos de 8 caracteres', () => {
    expect(() => validarSenha('Ab1')).toThrow('Senha fraca');
  });

  test('lança erro para senha sem número', () => {
    expect(() => validarSenha('SenhaSemNumero')).toThrow('Senha fraca');
  });

  test('lança erro para senha sem maiúscula', () => {
    expect(() => validarSenha('senha123')).toThrow('Senha fraca');
  });

  test('lança erro para string vazia', () => {
    expect(() => validarSenha('')).toThrow('Senha fraca');
  });

  test('lança erro quando tem exatamente 8 chars mas só minúsculas e números', () => {
    expect(() => validarSenha('senha123')).toThrow('Senha fraca');
  });
});

// ─── validarCPF ──────────────────────────────────────────────────────────────

describe('validarCPF', () => {
  test('aceita CPF com máscara', () => {
    expect(validarCPF('123.456.789-09')).toBe(true);
  });

  test('aceita CPF sem máscara com 11 dígitos', () => {
    expect(validarCPF('12345678909')).toBe(true);
  });

  test('lança erro para CPF com letras', () => {
    expect(() => validarCPF('123.456.abc-09')).toThrow('CPF inválido');
  });

  test('lança erro para CPF com menos de 11 dígitos sem máscara', () => {
    expect(() => validarCPF('1234567890')).toThrow('CPF inválido');
  });

  test('lança erro para CPF com mais de 11 dígitos', () => {
    expect(() => validarCPF('123456789099')).toThrow('CPF inválido');
  });

  test('lança erro para string vazia', () => {
    expect(() => validarCPF('')).toThrow('CPF inválido');
  });

  test('lança erro para máscara errada', () => {
    expect(() => validarCPF('123-456.789-09')).toThrow('CPF inválido');
  });
});

// ─── validarCampos ───────────────────────────────────────────────────────────

describe('validarCampos', () => {
  test('retorna true quando todos os campos existem e têm valor', () => {
    const obj = { nome: 'João', email: 'j@j.com', idade: '25' };
    expect(validarCampos(obj, ['nome', 'email', 'idade'])).toBe(true);
  });

  test('lança erro para campo ausente no objeto', () => {
    const obj = { nome: 'João' };
    expect(() => validarCampos(obj, ['nome', 'email'])).toThrow('Campo obrigatório: email');
  });

  test('lança erro para campo com valor vazio ""', () => {
    const obj = { nome: 'João', email: '' };
    expect(() => validarCampos(obj, ['nome', 'email'])).toThrow('Campo obrigatório: email');
  });

  test('lança erro para campo com valor null', () => {
    const obj = { nome: 'João', email: null };
    expect(() => validarCampos(obj, ['nome', 'email'])).toThrow('Campo obrigatório: email');
  });

  test('indica o primeiro campo faltante', () => {
    const obj = { cpf: '123' };
    expect(() => validarCampos(obj, ['nome', 'email', 'cpf'])).toThrow('Campo obrigatório: nome');
  });

  test('retorna true para array de campos vazio', () => {
    expect(validarCampos({}, [])).toBe(true);
  });
});

// ─── validarTudo ─────────────────────────────────────────────────────────────

describe('validarTudo', () => {
  const dadosValidos = {
    nome: 'João Silva',
    email: 'joao@empresa.com',
    senha: 'Senha123',
    cpf: '123.456.789-09',
  };

  test('retorna { valido: true } para dados completamente válidos', () => {
    expect(validarTudo(dadosValidos)).toEqual({ valido: true });
  });

  test('lança erro quando email é inválido', () => {
    const dados = { ...dadosValidos, email: 'invalido' };
    expect(() => validarTudo(dados)).toThrow('Email inválido');
  });

  test('lança erro quando senha é fraca', () => {
    const dados = { ...dadosValidos, senha: '123' };
    expect(() => validarTudo(dados)).toThrow('Senha fraca');
  });

  test('lança erro quando CPF é inválido', () => {
    const dados = { ...dadosValidos, cpf: 'abc' };
    expect(() => validarTudo(dados)).toThrow('CPF inválido');
  });

  test('lança erro quando nome está ausente', () => {
    const dados = { ...dadosValidos, nome: '' };
    expect(() => validarTudo(dados)).toThrow('Campo obrigatório: nome');
  });
});
