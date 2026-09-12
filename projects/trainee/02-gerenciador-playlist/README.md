# DEVTECH SISTEMAS S.A.
## Feature: Módulo de Playlist para App de Treino Interno

> PRAZO: PM Marcos quer demo até sexta — módulo de playlist ainda não existe no repositório.

---

### Contexto
O time de produto da DevTech está desenvolvendo um app de treino físico para uso interno dos funcionários. A funcionalidade de playlist de músicas precisa ser implementada do zero. Marcos, o Product Manager, agendou uma demo com a diretoria para sexta-feira e o módulo `playlist.js` precisa estar pronto e testado antes disso.

**Nível:** Trainee
**Sprint:** Trainee — Gerenciador de Playlist
**Estimativa:** 1h 30m
**Prioridade:** Alta

---

### O que fazer
- [ ] Criar o arquivo `playlist.js` na raiz deste projeto
- [ ] Implementar a classe `Musica`
- [ ] Implementar a classe `Playlist` com todos os métodos
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar
`playlist.js`

---

### Especificação das funções

**`class Musica`**
- `constructor(titulo, artista, duracao)` — `duracao` em segundos (número)
- Propriedades acessíveis: `titulo`, `artista`, `duracao`

**`class Playlist`**
- `constructor(nome)` — guarda o nome da playlist; inicializa array interno `musicas = []`
- `adicionar(musica)` — recebe instância de `Musica` e adiciona ao array interno; sem retorno especificado
- `remover(titulo)` — remove a música com título exato; retorna `true` se removeu, `false` se não encontrou
- `duracaoTotal()` — retorna a soma das durações (em segundos) de todas as músicas
- `listar()` — retorna uma cópia do array de músicas (não a referência original)
- `contemArtista(artista)` — retorna `true` se há alguma música do artista (comparação case-insensitive), `false` caso contrário
- Ex: após `p.adicionar(new Musica('Bohemian Rhapsody', 'Queen', 354))`, `p.duracaoTotal()` → `354`

---

### Como testar
```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`class Musica`** — Em uma classe ES6, onde você declara as propriedades que receberá no construtor? O `constructor` é o único método especial obrigatório para inicializar?

**`adicionar`** — Que método de array adiciona um elemento ao final? A instância de `Playlist` precisa de um array interno — onde e como você o declara no constructor?

**`remover`** — Você precisa encontrar o índice da música pelo título e depois removê-la. Que métodos de array ajudam a encontrar índices e a remover elementos em uma posição específica?

**`duracaoTotal`** — Como o método `.reduce()` funciona para acumular um valor a partir de um array? Qual é o valor inicial do acumulador quando a playlist está vazia?

**`listar`** — Como você faz uma cópia rasa de um array sem retornar a referência original? O spread operator pode ajudar aqui?

**`contemArtista`** — Como você compara strings ignorando maiúsculas/minúsculas? Que método de array retorna `true` se pelo menos um elemento satisfaz uma condição?

---

### Tarefas sugeridas para o Sprint
```
add Criar playlist.js
add Implementar class Musica com constructor
add Implementar class Playlist com constructor e array interno
add Implementar método adicionar
add Implementar método remover com retorno booleano
add Implementar método duracaoTotal com reduce
add Implementar método listar retornando cópia
add Implementar método contemArtista case-insensitive
```
