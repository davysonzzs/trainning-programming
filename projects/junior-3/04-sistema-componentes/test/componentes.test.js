const {
  criarComponente,
  Texto,
  Lista,
  Tabela,
  compor,
  renderizarSe,
} = require('../componentes');

describe('criarComponente', () => {
  test('deve retornar função que chama renderFn com props', () => {
    const MeuComp = criarComponente(({ nome }) => `Olá, ${nome}!`);
    expect(MeuComp({ nome: 'Ana' })).toBe('Olá, Ana!');
  });

  test('componente criado deve ser função', () => {
    const Comp = criarComponente(() => 'ok');
    expect(typeof Comp).toBe('function');
  });
});

describe('Texto', () => {
  test('deve retornar o conteúdo sem modificação por padrão', () => {
    expect(Texto({ conteudo: 'Olá mundo' })).toBe('Olá mundo');
  });

  test('deve retornar conteúdo em negrito quando negrito=true', () => {
    expect(Texto({ conteudo: 'Alerta', negrito: true })).toBe('**Alerta**');
  });

  test('deve retornar conteúdo sem negrito quando negrito=false explícito', () => {
    expect(Texto({ conteudo: 'Normal', negrito: false })).toBe('Normal');
  });
});

describe('Lista', () => {
  test('deve renderizar itens com prefixo padrão "-"', () => {
    const resultado = Lista({ itens: ['a', 'b', 'c'] });
    expect(resultado).toBe('- a\n- b\n- c');
  });

  test('deve usar prefixo customizado', () => {
    const resultado = Lista({ itens: ['x', 'y'], prefixo: '*' });
    expect(resultado).toBe('* x\n* y');
  });

  test('lista vazia deve retornar string vazia', () => {
    expect(Lista({ itens: [] })).toBe('');
  });

  test('lista com um item não deve ter newline extra', () => {
    expect(Lista({ itens: ['único'] })).toBe('- único');
  });
});

describe('Tabela', () => {
  const cabecalhos = ['Nome', 'Idade'];
  const linhas = [['Ana', '25'], ['Bruno', '30']];

  test('deve incluir cabeçalhos na primeira linha', () => {
    const resultado = Tabela({ cabecalhos, linhas });
    const primeiraLinha = resultado.split('\n')[0];
    expect(primeiraLinha).toContain('Nome');
    expect(primeiraLinha).toContain('Idade');
  });

  test('deve usar separador "|" entre colunas', () => {
    const resultado = Tabela({ cabecalhos, linhas });
    expect(resultado).toContain('|');
  });

  test('deve incluir dados das linhas', () => {
    const resultado = Tabela({ cabecalhos, linhas });
    expect(resultado).toContain('Ana');
    expect(resultado).toContain('Bruno');
    expect(resultado).toContain('30');
  });

  test('deve ter número correto de linhas (1 cabeçalho + N dados)', () => {
    const resultado = Tabela({ cabecalhos, linhas });
    expect(resultado.split('\n')).toHaveLength(3);
  });
});

describe('compor', () => {
  test('deve renderizar múltiplos componentes com mesmas props', () => {
    const A = ({ x }) => `A:${x}`;
    const B = ({ x }) => `B:${x}`;
    const resultado = compor(A, B, { x: 1 });
    expect(resultado).toContain('A:1');
    expect(resultado).toContain('B:1');
  });

  test('resultado deve separar componentes com newline', () => {
    const A = () => 'linha1';
    const B = () => 'linha2';
    const resultado = compor(A, B, {});
    expect(resultado).toBe('linha1\nlinha2');
  });
});

describe('renderizarSe', () => {
  const Aviso = ({ msg }) => `AVISO: ${msg}`;

  test('deve renderizar componente se condição for verdadeira', () => {
    expect(renderizarSe(true, Aviso, { msg: 'erro!' })).toBe('AVISO: erro!');
  });

  test('deve retornar string vazia se condição for falsa', () => {
    expect(renderizarSe(false, Aviso, { msg: 'erro!' })).toBe('');
  });

  test('deve tratar valores truthy corretamente', () => {
    expect(renderizarSe(1, Aviso, { msg: 'ok' })).toBe('AVISO: ok');
  });

  test('deve tratar valores falsy corretamente (null)', () => {
    expect(renderizarSe(null, Aviso, { msg: 'nunca' })).toBe('');
  });
});
