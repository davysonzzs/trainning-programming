# DEVTECH SISTEMAS S.A.
## Bug Fix: Formulário salvando número como texto no banco

> Sistema de estoque está salvando quantidade `"10"` (texto) em vez de `10` (número),
> quebrando os cálculos de relatório.

---

### Contexto

Todo dado que vem de um formulário HTML chega como **string**, mesmo quando parece um
número. Isso já causou um bug feio no relatório de estoque, que somava `"10" + "5"` e
virava `"105"` em vez de `15`. Você vai criar funções que convertem tipos de forma segura
e comparam valores do jeito certo.

**Nível:** Estagiário  
**Sprint:** Estagiário — Conversor de Tipos  
**Estimativa:** 1h 15m  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Variáveis, tipos de dados e operadores (3/3)

---

### O que fazer

- [ ] Criar o arquivo `conversor.js` na raiz deste projeto
- [ ] Implementar `paraNumero(texto)`
- [ ] Implementar `paraTexto(valor)`
- [ ] Implementar `paraBooleano(valor)`
- [ ] Implementar `saoIguais(a, b)`
- [ ] Implementar `saoIdenticos(a, b)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`conversor.js`

---

### Especificação das funções

**`paraNumero(texto)`**
- Converte uma string numérica pra número (ex: `'10'` → `10`)
- Se não for possível converter (ex: `'abc'`), retorna `null`

**`paraTexto(valor)`**
- Converte qualquer valor (número, boolean) pra string
- Ex: `paraTexto(10)` → `'10'`, `paraTexto(true)` → `'true'`

**`paraBooleano(valor)`**
- Retorna `false` para: `0`, `''`, `null`, `undefined`, `NaN`
- Retorna `true` para qualquer outro valor

**`saoIguais(a, b)`**
- Compara os valores **sem** considerar o tipo (operador `==`)
- Ex: `saoIguais(10, '10')` → `true`

**`saoIdenticos(a, b)`**
- Compara os valores **considerando** o tipo (operador `===`)
- Ex: `saoIdenticos(10, '10')` → `false`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 2 — Variáveis, tipos de dados e operadores**
> em [`02-variaveis-tipos-operadores.md`](../../../aulas/fase-01-fundamentos-de-programacao/02-variaveis-tipos-operadores.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`paraNumero`** — Existe uma função global do JavaScript que converte texto pra
número. Quando a conversão falha, ela devolve um valor especial chamado `NaN` — e você
pode checar isso com `Number.isNaN(...)`.

```js
Number('42');       // 42
Number('quarenta'); // NaN
Number.isNaN(Number('quarenta')); // true
```

**`paraTexto`** — Existe uma função global que converte qualquer coisa pra texto
(`String(123)` → `'123'`).

**`paraBooleano`** — Existe uma função global que converte qualquer valor pro
"equivalente" em `true`/`false` — os valores que viram `false` são chamados de "falsy"
(`Boolean(0)`, `Boolean('')` e `Boolean(null)` são exemplos de valores falsy;
praticamente tudo o resto é "truthy").

**`saoIguais` / `saoIdenticos`** — A diferença entre `==` e `===` é exatamente essa: um
converte tipos antes de comparar, o outro não. Use o operador certo em cada função.

---

### Tarefas sugeridas para o Sprint

```
add Criar conversor.js
add Implementar paraNumero e paraTexto
add Implementar paraBooleano
add Implementar saoIguais e saoIdenticos
add Passar em todos os testes
```
