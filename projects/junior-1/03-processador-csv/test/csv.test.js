const {
  parsearLinha,
  parsearCSV,
  filtrarRegistros,
  ordenarRegistros,
  gerarCSV,
} = require('../csv');

// ─── parsearLinha ────────────────────────────────────────────────────────────

describe('parsearLinha', () => {
  test('divide linha simples por vírgula', () => {
    expect(parsearLinha('João,25,SP')).toEqual(['João', '25', 'SP']);
  });

  test('remove aspas de campos entre aspas', () => {
    expect(parsearLinha('"João Silva",25,SP')).toEqual(['João Silva', '25', 'SP']);
  });

  test('preserva vírgula interna de campo entre aspas', () => {
    expect(parsearLinha('"Rua das Flores, 123",SP')).toEqual([
      'Rua das Flores, 123',
      'SP',
    ]);
  });

  test('suporta separador customizado ponto-e-vírgula', () => {
    expect(parsearLinha('a;b;c', ';')).toEqual(['a', 'b', 'c']);
  });

  test('retorna array vazio para linha vazia', () => {
    expect(parsearLinha('')).toEqual([]);
  });

  test('lida com campo único sem separador', () => {
    expect(parsearLinha('somente')).toEqual(['somente']);
  });
});

// ─── parsearCSV ──────────────────────────────────────────────────────────────

describe('parsearCSV', () => {
  test('converte CSV simples para array de objetos', () => {
    const texto = 'nome,idade\nJoão,25\nMaria,30';
    expect(parsearCSV(texto)).toEqual([
      { nome: 'João', idade: '25' },
      { nome: 'Maria', idade: '30' },
    ]);
  });

  test('usa primeira linha como cabeçalho', () => {
    const texto = 'produto,preco,estoque\nCamisa,49.90,100';
    const resultado = parsearCSV(texto);
    expect(resultado[0]).toHaveProperty('produto', 'Camisa');
    expect(resultado[0]).toHaveProperty('preco', '49.90');
    expect(resultado[0]).toHaveProperty('estoque', '100');
  });

  test('ignora linhas vazias', () => {
    const texto = 'nome,idade\nJoão,25\n\nMaria,30\n';
    expect(parsearCSV(texto)).toHaveLength(2);
  });

  test('retorna array vazio para texto só com cabeçalho', () => {
    expect(parsearCSV('nome,idade')).toEqual([]);
  });

  test('retorna array vazio para texto vazio', () => {
    expect(parsearCSV('')).toEqual([]);
  });

  test('processa múltiplas colunas corretamente', () => {
    const texto = 'a,b,c,d\n1,2,3,4';
    const [linha] = parsearCSV(texto);
    expect(Object.keys(linha)).toEqual(['a', 'b', 'c', 'd']);
  });
});

// ─── filtrarRegistros ────────────────────────────────────────────────────────

describe('filtrarRegistros', () => {
  const registros = [
    { nome: 'João', estado: 'SP', ativo: 'true' },
    { nome: 'Maria', estado: 'RJ', ativo: 'false' },
    { nome: 'Carlos', estado: 'SP', ativo: 'true' },
    { nome: 'Ana', estado: 'MG', ativo: 'true' },
  ];

  test('filtra por estado exato', () => {
    expect(filtrarRegistros(registros, 'estado', 'SP')).toHaveLength(2);
  });

  test('filtragem é case-insensitive', () => {
    expect(filtrarRegistros(registros, 'estado', 'sp')).toHaveLength(2);
    expect(filtrarRegistros(registros, 'estado', 'Sp')).toHaveLength(2);
  });

  test('retorna array vazio quando nenhum registro bate', () => {
    expect(filtrarRegistros(registros, 'estado', 'RS')).toEqual([]);
  });

  test('filtra por campo booleano como string', () => {
    expect(filtrarRegistros(registros, 'ativo', 'false')).toHaveLength(1);
  });

  test('retorna array vazio para registros vazio', () => {
    expect(filtrarRegistros([], 'estado', 'SP')).toEqual([]);
  });
});

// ─── ordenarRegistros ────────────────────────────────────────────────────────

describe('ordenarRegistros', () => {
  const registros = [
    { nome: 'Carlos', idade: '30' },
    { nome: 'Ana', idade: '25' },
    { nome: 'Maria', idade: '35' },
    { nome: 'Bruno', idade: '28' },
  ];

  test('ordena por nome em ordem crescente (asc)', () => {
    const resultado = ordenarRegistros(registros, 'nome', 'asc');
    expect(resultado.map((r) => r.nome)).toEqual(['Ana', 'Bruno', 'Carlos', 'Maria']);
  });

  test('ordena por nome em ordem decrescente (desc)', () => {
    const resultado = ordenarRegistros(registros, 'nome', 'desc');
    expect(resultado.map((r) => r.nome)).toEqual(['Maria', 'Carlos', 'Bruno', 'Ana']);
  });

  test('direção padrão é asc', () => {
    const resultado = ordenarRegistros(registros, 'nome');
    expect(resultado[0].nome).toBe('Ana');
  });

  test('não modifica o array original', () => {
    const copia = [...registros];
    ordenarRegistros(registros, 'nome', 'asc');
    expect(registros).toEqual(copia);
  });

  test('retorna array vazio para entrada vazia', () => {
    expect(ordenarRegistros([], 'nome')).toEqual([]);
  });
});

// ─── gerarCSV ────────────────────────────────────────────────────────────────

describe('gerarCSV', () => {
  test('gera CSV com cabeçalho e linha de dados', () => {
    const registros = [{ nome: 'João', idade: '25' }];
    const resultado = gerarCSV(registros);
    const linhas = resultado.split('\n');
    expect(linhas[0]).toBe('nome,idade');
    expect(linhas[1]).toBe('João,25');
  });

  test('gera CSV com múltiplos registros', () => {
    const registros = [
      { nome: 'João', estado: 'SP' },
      { nome: 'Maria', estado: 'RJ' },
    ];
    const linhas = gerarCSV(registros).split('\n');
    expect(linhas).toHaveLength(3);
    expect(linhas[0]).toBe('nome,estado');
  });

  test('retorna string vazia para array vazio', () => {
    expect(gerarCSV([])).toBe('');
  });

  test('ida e volta: parsearCSV → gerarCSV preserva os dados', () => {
    const csvOriginal = 'nome,cidade\nAna,Recife\nBruno,Natal';
    const registros = parsearCSV(csvOriginal);
    const csvGerado = gerarCSV(registros);
    expect(csvGerado).toBe(csvOriginal);
  });
});
