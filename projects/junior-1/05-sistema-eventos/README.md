# DEVTECH SISTEMAS S.A.
## Feature: Sistema de Eventos Interno (Event Bus)

> **DECISÃO DE ARQUITETURA — Tech Lead Rafael:** Precisamos desacoplar os módulos do sistema de notificações. Cada vez que adicionamos um novo tipo de alerta temos que modificar 5 arquivos diferentes. Quero um event bus simples, sem dependência externa, implementado hoje.

---
### Contexto

O sistema de notificações da DevTech está fortemente acoplado: quando um pedido é confirmado, o código chama diretamente o módulo de email, o de SMS, o de log e o de analytics. Qualquer mudança requer tocar em tudo.

O Tech Lead quer implementar o padrão Observer: quem dispara o evento não precisa saber quem vai ouvir. A implementação deve ser manual — sem usar o `EventEmitter` do Node.js — para que o time entenda o padrão por dentro.

**Nível:** Junior I
**Sprint:** Junior I — Observer Pattern e Callbacks
**Estimativa:** 2h
**Prioridade:** Média

---
### O que fazer

- [ ] Criar `eventos.js`
- [ ] Implementar classe `EmissorEventos`
- [ ] Implementar `constructor()`
- [ ] Implementar `on(evento, callback)`
- [ ] Implementar `off(evento, callback)`
- [ ] Implementar `emit(evento, ...dados)`
- [ ] Implementar `once(evento, callback)`
- [ ] Implementar `listarEventos()`
- [ ] Fazer todos os testes passarem

---
### Arquivo a criar

`eventos.js`

---
### Especificação da classe

#### `constructor()`
Inicializa internamente um `Map` onde as chaves são nomes de eventos e os valores são arrays de callbacks.
- Não recebe parâmetros.

#### `on(evento, callback)`
Registra um callback para o evento especificado.
- Múltiplos callbacks podem ser registrados para o mesmo evento.
- Se o evento ainda não existe no Map, cria a entrada com array vazio antes de adicionar.

#### `off(evento, callback)`
Remove um callback específico de um evento.
- Retorna `true` se o callback foi encontrado e removido.
- Retorna `false` se o evento não existe ou o callback não estava registrado.
- Usa referência de função para identificar o callback (mesma referência passada ao `on`).

#### `emit(evento, ...dados)`
Chama todos os callbacks registrados para o evento, passando `...dados` como argumentos.
- Retorna o número de callbacks que foram chamados.
- Retorna `0` se não houver ouvintes para o evento.
- Os callbacks são chamados na ordem em que foram registrados.

#### `once(evento, callback)`
Registra um callback que é executado **apenas uma vez** e depois se remove automaticamente.
- Após ser chamado uma vez, o callback não deve ser invocado novamente em emissões futuras do mesmo evento.
- Internamente, você pode criar um wrapper que chama `off` antes ou depois de executar o callback original.

#### `listarEventos()`
Retorna um array com os nomes de todos os eventos que possuem pelo menos 1 ouvinte registrado.
- Eventos com 0 ouvintes (após `off`) não devem aparecer na lista.
- Ordem não é garantida.

---
### Como testar

```bash
npm install
npm test
```

---
### Dicas (tente sozinho antes de usar)

- Como o `Map` ajuda a guardar uma lista de callbacks por evento? Pense: `mapa.get('nomeEvento')` retorna um array de funções.
- Para `off`, como você usa `.indexOf()` ou `.findIndex()` para localizar o callback no array e depois `.splice()` para removê-lo?
- Para `once`, como você cria uma função "wrapper" que: (1) chama o callback original, (2) chama `this.off()` para se remover? Atenção com a referência do wrapper para o `off` funcionar.
- Para `listarEventos`, como você usa `Map.keys()` ou `Map.entries()` para filtrar apenas eventos com callbacks?
- Por que é importante usar a **mesma referência** de função no `on` e no `off`?

---
### Tarefas sugeridas para o Sprint

```
node sprint.js add "05-eventos: implementar constructor e on"
node sprint.js add "05-eventos: implementar emit"
node sprint.js add "05-eventos: implementar off"
node sprint.js add "05-eventos: implementar once"
node sprint.js add "05-eventos: implementar listarEventos"
node sprint.js add "05-eventos: fazer todos os testes passarem"
```
