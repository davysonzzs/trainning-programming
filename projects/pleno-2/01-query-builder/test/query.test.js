const QueryBuilder = require('../query');

describe('QueryBuilder — SELECT básico', () => {
  test('build() gera SELECT * FROM tabela por padrão', () => {
    const qb = new QueryBuilder('usuarios');
    const { sql, params } = qb.build();
    expect(sql).toContain('SELECT *');
    expect(sql).toContain('FROM usuarios');
    expect(params).toEqual([]);
  });

  test('select() define campos específicos', () => {
    const { sql } = new QueryBuilder('produtos').select('nome', 'preco').build();
    expect(sql).toContain('SELECT nome, preco');
    expect(sql).toContain('FROM produtos');
  });
});

describe('QueryBuilder — WHERE', () => {
  test('where() adiciona condição com operador =', () => {
    const { sql, params } = new QueryBuilder('usuarios')
      .where('ativo', '=', true)
      .build();
    expect(sql).toContain('WHERE');
    expect(sql).toContain('ativo = ?');
    expect(params).toContain(true);
  });

  test('múltiplos where() são combinados com AND', () => {
    const { sql, params } = new QueryBuilder('produtos')
      .where('categoria', '=', 'eletronicos')
      .where('preco', '>', 100)
      .build();
    expect(sql).toContain('AND');
    expect(params).toEqual(['eletronicos', 100]);
  });

  test('where() com operador LIKE', () => {
    const { sql, params } = new QueryBuilder('clientes')
      .where('nome', 'LIKE', '%Silva%')
      .build();
    expect(sql).toContain('LIKE');
    expect(params).toContain('%Silva%');
  });

  test('where() com operadores de comparação >=', () => {
    const { sql, params } = new QueryBuilder('pedidos')
      .where('valor', '>=', 500)
      .build();
    expect(sql).toContain('>=');
    expect(params).toContain(500);
  });
});

describe('QueryBuilder — ORDER BY, LIMIT, OFFSET', () => {
  test('orderBy() adiciona ORDER BY ASC por padrão', () => {
    const { sql } = new QueryBuilder('items').orderBy('nome').build();
    expect(sql).toContain('ORDER BY nome ASC');
  });

  test('orderBy() aceita DESC', () => {
    const { sql } = new QueryBuilder('items').orderBy('criado_em', 'DESC').build();
    expect(sql).toContain('ORDER BY criado_em DESC');
  });

  test('limit() adiciona LIMIT', () => {
    const { sql } = new QueryBuilder('items').limit(10).build();
    expect(sql).toContain('LIMIT 10');
  });

  test('offset() adiciona OFFSET', () => {
    const { sql } = new QueryBuilder('items').offset(20).build();
    expect(sql).toContain('OFFSET 20');
  });

  test('encadeamento completo', () => {
    const { sql, params } = new QueryBuilder('usuarios')
      .select('id', 'nome')
      .where('idade', '>', 18)
      .orderBy('nome', 'ASC')
      .limit(5)
      .offset(10)
      .build();
    expect(sql).toContain('SELECT id, nome');
    expect(sql).toContain('WHERE idade > ?');
    expect(sql).toContain('ORDER BY nome ASC');
    expect(sql).toContain('LIMIT 5');
    expect(sql).toContain('OFFSET 10');
    expect(params).toEqual([18]);
  });
});

describe('QueryBuilder — buildInsert', () => {
  test('gera SQL INSERT com colunas e placeholders', () => {
    const qb = new QueryBuilder('produtos');
    const { sql, params } = qb.buildInsert({ nome: 'Caneta', preco: 3.5 });
    expect(sql).toContain('INSERT INTO produtos');
    expect(sql).toContain('nome');
    expect(sql).toContain('preco');
    expect(sql).toContain('VALUES');
    expect(sql).toContain('?');
    expect(params).toContain('Caneta');
    expect(params).toContain(3.5);
  });

  test('número de ? corresponde ao número de campos', () => {
    const { sql, params } = new QueryBuilder('t').buildInsert({ a: 1, b: 2, c: 3 });
    const placeholders = (sql.match(/\?/g) || []).length;
    expect(placeholders).toBe(3);
    expect(params.length).toBe(3);
  });
});

describe('QueryBuilder — buildUpdate', () => {
  test('gera SQL UPDATE com SET e WHERE', () => {
    const qb = new QueryBuilder('usuarios');
    const { sql, params } = qb.buildUpdate({ nome: 'Carlos' }, { id: 5 });
    expect(sql).toContain('UPDATE usuarios');
    expect(sql).toContain('SET');
    expect(sql).toContain('nome = ?');
    expect(sql).toContain('WHERE id = ?');
    expect(params).toContain('Carlos');
    expect(params).toContain(5);
  });

  test('parâmetros do SET vêm antes do WHERE', () => {
    const { params } = new QueryBuilder('t').buildUpdate({ x: 10 }, { id: 99 });
    expect(params[0]).toBe(10);
    expect(params[1]).toBe(99);
  });
});
