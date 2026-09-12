const {
  extrairNivel,
  contarPorNivel,
  filtrarPorNivel,
  extrairTimestamp,
  resumoLogs,
} = require('../logs');

// ─── extrairNivel ────────────────────────────────────────────────────────────

describe('extrairNivel', () => {
  test('extrai "ERROR" de linha com [ERROR]', () => {
    expect(extrairNivel('[ERROR] servidor caiu')).toBe('ERROR');
  });

  test('extrai "INFO" de linha com [INFO]', () => {
    expect(extrairNivel('[INFO] sistema inicializado')).toBe('INFO');
  });

  test('extrai "WARN" de linha com [WARN]', () => {
    expect(extrairNivel('[WARN] memória alta')).toBe('WARN');
  });

  test('retorna null para linha sem colchetes', () => {
    expect(extrairNivel('mensagem sem nivel')).toBeNull();
  });

  test('retorna null para string vazia', () => {
    expect(extrairNivel('')).toBeNull();
  });

  test('retorna null para null/undefined', () => {
    expect(extrairNivel(null)).toBeNull();
    expect(extrairNivel(undefined)).toBeNull();
  });

  test('extrai nível mesmo com timestamp na frente', () => {
    expect(extrairNivel('2024-01-15 10:30:45 [INFO] mensagem')).toBe('INFO');
  });
});

// ─── contarPorNivel ──────────────────────────────────────────────────────────

describe('contarPorNivel', () => {
  test('conta corretamente INFO, WARN e ERROR', () => {
    const linhas = [
      '[INFO] ok',
      '[ERROR] falha',
      '[INFO] ok2',
      '[WARN] alerta',
      '[ERROR] crash',
    ];
    expect(contarPorNivel(linhas)).toEqual({ INFO: 2, WARN: 1, ERROR: 2 });
  });

  test('retorna zeros para array vazio', () => {
    expect(contarPorNivel([])).toEqual({ INFO: 0, WARN: 0, ERROR: 0 });
  });

  test('ignora linhas sem nível reconhecido', () => {
    const linhas = ['[INFO] ok', 'linha solta sem nivel', '[ERROR] erro'];
    expect(contarPorNivel(linhas)).toEqual({ INFO: 1, WARN: 0, ERROR: 1 });
  });

  test('retorna INFO:0 e ERROR:0 quando só há WARN', () => {
    const linhas = ['[WARN] alerta1', '[WARN] alerta2'];
    expect(contarPorNivel(linhas)).toEqual({ INFO: 0, WARN: 2, ERROR: 0 });
  });
});

// ─── filtrarPorNivel ─────────────────────────────────────────────────────────

describe('filtrarPorNivel', () => {
  const linhas = [
    '[INFO] sistema ok',
    '[ERROR] falha crítica',
    '[WARN] uso alto de CPU',
    '[ERROR] timeout na conexão',
    '[INFO] heartbeat ok',
  ];

  test('filtra apenas linhas ERROR', () => {
    const resultado = filtrarPorNivel(linhas, 'ERROR');
    expect(resultado).toHaveLength(2);
    expect(resultado).toContain('[ERROR] falha crítica');
    expect(resultado).toContain('[ERROR] timeout na conexão');
  });

  test('filtra apenas linhas INFO', () => {
    const resultado = filtrarPorNivel(linhas, 'INFO');
    expect(resultado).toHaveLength(2);
  });

  test('filtragem é case-insensitive', () => {
    expect(filtrarPorNivel(linhas, 'error')).toHaveLength(2);
    expect(filtrarPorNivel(linhas, 'Error')).toHaveLength(2);
  });

  test('retorna array vazio quando nível não existe', () => {
    expect(filtrarPorNivel(linhas, 'DEBUG')).toEqual([]);
  });

  test('retorna array vazio para array de linhas vazio', () => {
    expect(filtrarPorNivel([], 'ERROR')).toEqual([]);
  });
});

// ─── extrairTimestamp ────────────────────────────────────────────────────────

describe('extrairTimestamp', () => {
  test('extrai timestamp do início da linha', () => {
    expect(extrairTimestamp('2024-01-15 10:30:45 [INFO] mensagem')).toBe(
      '2024-01-15 10:30:45'
    );
  });

  test('extrai timestamp com ERROR', () => {
    expect(extrairTimestamp('2023-12-31 23:59:59 [ERROR] virada do ano falhou')).toBe(
      '2023-12-31 23:59:59'
    );
  });

  test('retorna null para linha sem timestamp', () => {
    expect(extrairTimestamp('[INFO] sem timestamp')).toBeNull();
  });

  test('retorna null para string vazia', () => {
    expect(extrairTimestamp('')).toBeNull();
  });

  test('retorna null para null', () => {
    expect(extrairTimestamp(null)).toBeNull();
  });
});

// ─── resumoLogs ──────────────────────────────────────────────────────────────

describe('resumoLogs', () => {
  const linhas = [
    '[INFO] sistema iniciado',
    '[WARN] memória em 80%',
    '[ERROR] conexão recusada',
    '[INFO] request processado',
    '[ERROR] timeout',
  ];

  test('retorna total correto', () => {
    expect(resumoLogs(linhas).total).toBe(5);
  });

  test('retorna contagem por nível correta', () => {
    expect(resumoLogs(linhas).porNivel).toEqual({ INFO: 2, WARN: 1, ERROR: 2 });
  });

  test('retorna array de linhas com ERROR', () => {
    const { erros } = resumoLogs(linhas);
    expect(erros).toHaveLength(2);
    expect(erros).toContain('[ERROR] conexão recusada');
    expect(erros).toContain('[ERROR] timeout');
  });

  test('array erros vazio quando não há ERRORs', () => {
    const semErros = ['[INFO] ok', '[WARN] aviso'];
    expect(resumoLogs(semErros).erros).toEqual([]);
  });

  test('total zero para array vazio', () => {
    const resultado = resumoLogs([]);
    expect(resultado.total).toBe(0);
    expect(resultado.erros).toEqual([]);
    expect(resultado.porNivel).toEqual({ INFO: 0, WARN: 0, ERROR: 0 });
  });
});
