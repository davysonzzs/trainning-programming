const { parsearComando, GerenciadorTarefas } = require('../cli');

// ─── parsearComando ───────────────────────────────────────────────────────────

describe('parsearComando', () => {
  test('parseia comando simples sem args', () => {
    expect(parsearComando('list')).toEqual({ comando: 'list', args: [] });
  });

  test('parseia comando com um argumento', () => {
    expect(parsearComando('done 3')).toEqual({ comando: 'done', args: ['3'] });
  });

  test('parseia comando add com múltiplos args', () => {
    expect(parsearComando('add comprar pão')).toEqual({
      comando: 'add',
      args: ['comprar', 'pão'],
    });
  });

  test('retorna null para string vazia', () => {
    expect(parsearComando('')).toBeNull();
  });

  test('retorna null para string com apenas espaços', () => {
    expect(parsearComando('   ')).toBeNull();
  });

  test('ignora espaços extras entre tokens', () => {
    const resultado = parsearComando('add   tarefa   importante');
    expect(resultado.comando).toBe('add');
    expect(resultado.args).toEqual(['tarefa', 'importante']);
  });
});

// ─── GerenciadorTarefas — adicionar ─────────────────────────────────────────

describe('GerenciadorTarefas.adicionar', () => {
  test('adiciona tarefa e retorna objeto com id 1', () => {
    const gm = new GerenciadorTarefas();
    const tarefa = gm.adicionar('Criar tela de login');
    expect(tarefa.id).toBe(1);
    expect(tarefa.titulo).toBe('Criar tela de login');
    expect(tarefa.concluida).toBe(false);
  });

  test('id incrementa a cada tarefa adicionada', () => {
    const gm = new GerenciadorTarefas();
    const t1 = gm.adicionar('Tarefa 1');
    const t2 = gm.adicionar('Tarefa 2');
    expect(t1.id).toBe(1);
    expect(t2.id).toBe(2);
  });

  test('remove espaços extras do título com trim', () => {
    const gm = new GerenciadorTarefas();
    const tarefa = gm.adicionar('  tarefa com espaços  ');
    expect(tarefa.titulo).toBe('tarefa com espaços');
  });

  test('lança erro para título vazio', () => {
    const gm = new GerenciadorTarefas();
    expect(() => gm.adicionar('')).toThrow('Título obrigatório');
  });

  test('lança erro para título só com espaços', () => {
    const gm = new GerenciadorTarefas();
    expect(() => gm.adicionar('   ')).toThrow('Título obrigatório');
  });

  test('tarefa criada tem campo criadoEm', () => {
    const gm = new GerenciadorTarefas();
    const tarefa = gm.adicionar('Teste');
    expect(tarefa).toHaveProperty('criadoEm');
    expect(typeof tarefa.criadoEm).toBe('string');
  });
});

// ─── GerenciadorTarefas — concluir ──────────────────────────────────────────

describe('GerenciadorTarefas.concluir', () => {
  test('marca tarefa como concluída e a retorna', () => {
    const gm = new GerenciadorTarefas();
    gm.adicionar('Tarefa A');
    const tarefa = gm.concluir(1);
    expect(tarefa.concluida).toBe(true);
    expect(tarefa.id).toBe(1);
  });

  test('lança erro para id inexistente', () => {
    const gm = new GerenciadorTarefas();
    expect(() => gm.concluir(99)).toThrow('Tarefa não encontrada');
  });

  test('não afeta outras tarefas', () => {
    const gm = new GerenciadorTarefas();
    gm.adicionar('A');
    gm.adicionar('B');
    gm.concluir(1);
    expect(gm.listar('pendentes')[0].id).toBe(2);
  });
});

// ─── GerenciadorTarefas — remover ────────────────────────────────────────────

describe('GerenciadorTarefas.remover', () => {
  test('remove tarefa existente e retorna true', () => {
    const gm = new GerenciadorTarefas();
    gm.adicionar('Remover essa');
    expect(gm.remover(1)).toBe(true);
    expect(gm.listar()).toHaveLength(0);
  });

  test('lança erro para id inexistente', () => {
    const gm = new GerenciadorTarefas();
    expect(() => gm.remover(42)).toThrow('Tarefa não encontrada');
  });
});

// ─── GerenciadorTarefas — listar ─────────────────────────────────────────────

describe('GerenciadorTarefas.listar', () => {
  function criarGmComTarefas() {
    const gm = new GerenciadorTarefas();
    gm.adicionar('Pendente 1');
    gm.adicionar('Pendente 2');
    gm.adicionar('Para concluir');
    gm.concluir(3);
    return gm;
  }

  test('listar todas retorna todas as tarefas', () => {
    expect(criarGmComTarefas().listar('todas')).toHaveLength(3);
  });

  test('filtro padrão é "todas"', () => {
    expect(criarGmComTarefas().listar()).toHaveLength(3);
  });

  test('listar pendentes retorna apenas não concluídas', () => {
    const pendentes = criarGmComTarefas().listar('pendentes');
    expect(pendentes).toHaveLength(2);
    expect(pendentes.every((t) => !t.concluida)).toBe(true);
  });

  test('listar concluidas retorna apenas concluídas', () => {
    const concluidas = criarGmComTarefas().listar('concluidas');
    expect(concluidas).toHaveLength(1);
    expect(concluidas[0].concluida).toBe(true);
  });

  test('retorna array vazio quando não há tarefas', () => {
    const gm = new GerenciadorTarefas();
    expect(gm.listar()).toEqual([]);
  });
});

// ─── GerenciadorTarefas — estatisticas ───────────────────────────────────────

describe('GerenciadorTarefas.estatisticas', () => {
  test('retorna zeros para gerenciador vazio', () => {
    const gm = new GerenciadorTarefas();
    expect(gm.estatisticas()).toEqual({
      total: 0,
      concluidas: 0,
      pendentes: 0,
      percentualConcluido: 0,
    });
  });

  test('calcula percentual corretamente', () => {
    const gm = new GerenciadorTarefas();
    gm.adicionar('A');
    gm.adicionar('B');
    gm.adicionar('C');
    gm.adicionar('D');
    gm.concluir(1);
    gm.concluir(2);
    const stats = gm.estatisticas();
    expect(stats.total).toBe(4);
    expect(stats.concluidas).toBe(2);
    expect(stats.pendentes).toBe(2);
    expect(stats.percentualConcluido).toBe(50);
  });

  test('percentual arredondado para 100 quando todas concluídas', () => {
    const gm = new GerenciadorTarefas();
    gm.adicionar('Única');
    gm.concluir(1);
    expect(gm.estatisticas().percentualConcluido).toBe(100);
  });

  test('arredonda percentuais não inteiros', () => {
    const gm = new GerenciadorTarefas();
    gm.adicionar('A');
    gm.adicionar('B');
    gm.adicionar('C');
    gm.concluir(1); // 1/3 = 33.33...
    expect(gm.estatisticas().percentualConcluido).toBe(33);
  });
});
