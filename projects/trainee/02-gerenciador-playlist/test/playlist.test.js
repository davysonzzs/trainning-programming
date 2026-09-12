const { Musica, Playlist } = require('../playlist');

describe('Musica', () => {
  test('cria instância com titulo, artista e duracao', () => {
    const m = new Musica('Bohemian Rhapsody', 'Queen', 354);
    expect(m.titulo).toBe('Bohemian Rhapsody');
    expect(m.artista).toBe('Queen');
    expect(m.duracao).toBe(354);
  });
});

describe('Playlist - constructor', () => {
  test('cria playlist com nome', () => {
    const p = new Playlist('Rock Classics');
    expect(p.nome).toBe('Rock Classics');
  });

  test('inicia com lista vazia', () => {
    const p = new Playlist('Vazia');
    expect(p.listar()).toHaveLength(0);
  });
});

describe('Playlist - adicionar e listar', () => {
  test('adiciona músicas à playlist', () => {
    const p = new Playlist('Favoritas');
    const m = new Musica('Song A', 'Artist A', 180);
    p.adicionar(m);
    expect(p.listar()).toHaveLength(1);
    expect(p.listar()[0].titulo).toBe('Song A');
  });

  test('listar retorna cópia — modificar retorno não afeta a playlist', () => {
    const p = new Playlist('Test');
    p.adicionar(new Musica('X', 'Y', 100));
    const lista = p.listar();
    lista.push(new Musica('Fantasma', 'Z', 200));
    expect(p.listar()).toHaveLength(1);
  });
});

describe('Playlist - remover', () => {
  test('remove música existente e retorna true', () => {
    const p = new Playlist('Mix');
    p.adicionar(new Musica('Track 1', 'DJ A', 200));
    p.adicionar(new Musica('Track 2', 'DJ B', 300));
    expect(p.remover('Track 1')).toBe(true);
    expect(p.listar()).toHaveLength(1);
  });

  test('retorna false se música não encontrada', () => {
    const p = new Playlist('Vazia');
    expect(p.remover('Inexistente')).toBe(false);
  });

  test('remove apenas a música com título exato', () => {
    const p = new Playlist('Mix');
    p.adicionar(new Musica('Track 1', 'A', 100));
    p.adicionar(new Musica('track 1', 'B', 100));
    p.remover('Track 1');
    expect(p.listar()).toHaveLength(1);
    expect(p.listar()[0].titulo).toBe('track 1');
  });
});

describe('Playlist - duracaoTotal', () => {
  test('retorna 0 para playlist vazia', () => {
    const p = new Playlist('Vazia');
    expect(p.duracaoTotal()).toBe(0);
  });

  test('soma corretamente as durações', () => {
    const p = new Playlist('Soma');
    p.adicionar(new Musica('A', 'X', 120));
    p.adicionar(new Musica('B', 'Y', 240));
    p.adicionar(new Musica('C', 'Z', 60));
    expect(p.duracaoTotal()).toBe(420);
  });
});

describe('Playlist - contemArtista', () => {
  test('retorna true se artista existe (case-insensitive)', () => {
    const p = new Playlist('Rock');
    p.adicionar(new Musica('Song', 'Queen', 200));
    expect(p.contemArtista('queen')).toBe(true);
    expect(p.contemArtista('QUEEN')).toBe(true);
    expect(p.contemArtista('Queen')).toBe(true);
  });

  test('retorna false se artista não existe', () => {
    const p = new Playlist('Jazz');
    p.adicionar(new Musica('Song', 'Miles Davis', 300));
    expect(p.contemArtista('Coltrane')).toBe(false);
  });

  test('retorna false em playlist vazia', () => {
    const p = new Playlist('Vazia');
    expect(p.contemArtista('Qualquer')).toBe(false);
  });
});
