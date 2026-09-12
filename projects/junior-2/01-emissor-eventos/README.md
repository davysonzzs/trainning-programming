# 01 — Emissor de Eventos

**Nível:** Junior II
**Sprint:** Junior II — Emissor de Eventos
**Estimativa:** 1h 30m

---

## Contexto

A DevTech Sistemas está construindo um sistema de notificações em tempo real para o painel interno. O time de backend percebeu que precisa de um emissor de eventos com rastreamento de histórico — o EventEmitter nativo do Node.js emite e pronto, mas não guarda registro do que foi disparado. Você foi designado para criar um `EmissorPersonalizado` que extende o EventEmitter e adiciona essa capacidade.

---

## O que fazer

Crie o arquivo `emissor.js` exportando a classe `EmissorPersonalizado` e a função auxiliar `criarPipeline`.

---

## Arquivo a criar

```
emissor.js
```

---

## Especificação

### Classe `EmissorPersonalizado extends EventEmitter`

| Método | Descrição |
|--------|-----------|
| `constructor()` | Inicializa `this._historico = []` e chama `super()` |
| `emitirComHistorico(evento, dados)` | Faz `emit(evento, dados)` normal + empurra `{ evento, dados, timestamp: new Date().toISOString() }` para o histórico |
| `historico(evento = null)` | Retorna histórico filtrado pelo evento se fornecido, senão retorna completo |
| `limparHistorico()` | Esvazia o array de histórico |
| `contarEmissoes(evento)` | Retorna quantas vezes o evento aparece no histórico |

### Função auxiliar `criarPipeline(emissor, eventos)`

Recebe um emissor e um array de nomes de eventos `['a', 'b', 'c']`.

Registra listeners de forma que ao receber o evento `eventos[i]`, o emissor automaticamente emite `eventos[i+1]` com os mesmos dados. Assim `'a'` aciona `'b'`, `'b'` aciona `'c'`, etc.

Retorna uma função `destruir()` que remove todos os listeners criados pelo pipeline.

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- `EventEmitter` fica em `require('events')` — não precisa instalar nada
- Ao estender EventEmitter, lembre-se de chamar `super()` no constructor
- O método `emit` retorna `true` se havia listeners — mas você não precisa verificar isso aqui
- Para `criarPipeline`, guarde as funções de listener em variáveis para poder removê-las com `removeListener` depois
- Como remover um listener específico do EventEmitter? Pesquise `emitter.removeListener(event, listener)`
- Por que guardar o timestamp como ISO string em vez de objeto Date? Pense em serialização

---

## Tarefas para o Sprint

- [ ] Criar `emissor.js` com a classe `EmissorPersonalizado`
- [ ] Implementar `emitirComHistorico` registrando no histórico com timestamp
- [ ] Implementar `historico(evento)` com filtragem opcional
- [ ] Implementar `limparHistorico`
- [ ] Implementar `contarEmissoes`
- [ ] Implementar `criarPipeline` que encadeia eventos automaticamente
- [ ] Garantir que `destruir()` remove todos os listeners do pipeline
- [ ] Rodar `npm test` e garantir que todos os testes passam
