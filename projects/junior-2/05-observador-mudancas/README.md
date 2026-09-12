# 05 — Observador de Mudanças

**Nível:** Junior II
**Sprint:** Junior II — Observador de Mudanças
**Estimativa:** 2h

---

## Contexto

O sistema de formulários da DevTech precisa detectar quando qualquer campo de um objeto foi alterado para habilitar o botão "Salvar". O time quer duas abordagens: uma simples usando `Proxy` do JavaScript para objetos planos, e outra mais robusta (`ObservadorProfundo`) para objetos com propriedades aninhadas como `{ usuario: { nome: 'Ana', endereco: { cidade: 'SP' } } }`.

---

## O que fazer

Crie o arquivo `observador.js` exportando a função `criarReativo` e a classe `ObservadorProfundo`.

---

## Arquivo a criar

```
observador.js
```

---

## Especificação

### Função `criarReativo(obj, onChange)`

Retorna um `Proxy` do objeto `obj`.

Sempre que uma propriedade for **alterada** (via `proxy.chave = valor`), deve chamar `onChange(chave, valorNovo, valorAntigo)`.

### Classe `ObservadorProfundo`

Suporta objetos aninhados com acesso via caminho string (`"usuario.nome"`).

**Constructor:** `constructor(obj)`
- Armazena uma cópia profunda do objeto inicial
- Inicializa array de callbacks `[]`

| Método | Comportamento |
|--------|--------------|
| `onChange(callback)` | Registra listener chamado com `(caminho, valor)` quando algo muda |
| `set(caminho, valor)` | Atualiza propriedade no caminho `"a.b.c"` e dispara todos os callbacks com `(caminho, valor)` |
| `get(caminho)` | Retorna valor no caminho `"a.b.c"` |
| `snapshot()` | Retorna cópia profunda do estado atual |

**Exemplo de caminho:**
```js
obs.set('usuario.nome', 'Carlos');
obs.get('usuario.nome'); // 'Carlos'
```

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- `Proxy` recebe dois parâmetros: o objeto alvo e um "handler" com traps. Use o trap `set(target, chave, valor)` — lembre de retornar `true` no final ou o JS lança TypeError
- Para `ObservadorProfundo.get(caminho)`: `caminho.split('.')` gera `['usuario', 'nome']`, então itere reduzindo: `partes.reduce((obj, chave) => obj[chave], this._estado)`
- Para `ObservadorProfundo.set(caminho)`: divida o caminho, navegue até o penúltimo nível e atribua na última chave
- `snapshot()` deve retornar cópia profunda — `JSON.parse(JSON.stringify(this._estado))` é suficiente para objetos simples
- Por que `snapshot()` retorna cópia e não o objeto direto? Para evitar mutação acidental do estado interno

---

## Tarefas para o Sprint

- [ ] Criar `observador.js` com a função `criarReativo`
- [ ] Implementar Proxy com trap `set` chamando `onChange`
- [ ] Criar classe `ObservadorProfundo`
- [ ] Implementar `onChange` para registrar múltiplos callbacks
- [ ] Implementar `get(caminho)` com navegação por caminho string
- [ ] Implementar `set(caminho, valor)` com notificação
- [ ] Implementar `snapshot()` retornando cópia profunda
- [ ] Rodar `npm test` e garantir que todos os testes passam
