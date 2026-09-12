# 03 — Injeção de Dependência

**Nível:** Junior III
**Sprint:** Junior III — Injeção de Dependência
**Estimativa:** 2h

---

## Contexto

O `Context` do React resolve o problema de "prop drilling" — passar props por muitos níveis de componentes. No mundo Node.js, o padrão equivalente é **Injeção de Dependência (DI)**: um container centralizado sabe como criar e fornecer qualquer serviço que um módulo precise. A base de código da DevTech cresceu e os módulos estão acoplados demais — hora de criar um container de DI.

---

## O que fazer

Crie o arquivo `container.js` exportando a classe `Container` e a função `criarEscopo`.

---

## Arquivo a criar

```
container.js
```

---

## Especificação

### Classe `Container`

**Constructor:** `constructor()`
- Inicializa dois Maps internos: `_registros` (factories) e `_instancias` (cache singleton)

| Método | Comportamento |
|--------|--------------|
| `register(nome, factory, singleton = true)` | Registra a factory function para o nome. `factory` recebe o próprio container como argumento (para resolver dependências) |
| `resolve(nome)` | Se singleton e instância existe em cache: retorna do cache. Senão chama `factory(this)`, armazena (se singleton) e retorna. Lança `Error('Dependência não registrada: nome')` se nome não existe |
| `registerValue(nome, valor)` | Atalho para registrar valor direto (equivale a `register(nome, () => valor)`) |
| `has(nome)` | Retorna `true` se o nome está registrado |
| `reset()` | Limpa `_instancias` (mantém `_registros`) — útil para testes |

### Função `criarEscopo(parent)`

Retorna novo `Container` que:
- Herda todos os registros do container pai
- Tem suas próprias instâncias (isolado do pai)
- Se um nome não está no escopo filho, delega ao pai

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- A factory recebe o container: `container.register('servico', (c) => new Servico(c.resolve('dep')))` — assim o container resolve as dependências em cascata
- Singleton: na primeira chamada, cria e armazena em `_instancias`. Nas seguintes, retorna do cache
- Não-singleton: toda chamada cria nova instância (não armazena)
- Para `criarEscopo`, você pode fazer o filho verificar se tem o registro localmente; se não, chamar `parent.resolve(nome)`
- Por que `reset()` mantém os registros? Para poder resetar instâncias em testes sem precisar re-registrar tudo
- Analogia com React Context: `criarEscopo` é como um `Provider` que sobrescreve valores para uma subárvore

---

## Tarefas para o Sprint

- [ ] Criar `container.js` com a classe `Container`
- [ ] Implementar `register` com suporte a singleton e não-singleton
- [ ] Implementar `resolve` com cache singleton e erro para não-registrado
- [ ] Implementar `registerValue` como atalho
- [ ] Implementar `has` para verificar existência
- [ ] Implementar `reset` limpando instâncias
- [ ] Implementar `criarEscopo` com herança do pai
- [ ] Rodar `npm test` e garantir que todos os testes passam
