# DEVTECH SISTEMAS S.A.
## Onboarding: seu primeiro deploy na DevTech

> Bem-vindo(a) ao time! Antes de mexer em sistema de verdade, o Tech Lead pede uma tarefa
> de aquecimento — só pra confirmar que seu ambiente e seu editor estão funcionando.

---

### Contexto

Todo mundo que entra na DevTech começa por aqui: escrever as primeiras funções que só
devolvem uma mensagem fixa. Parece bobo, mas é assim que se confirma que você sabe criar
um arquivo `.js`, escrever uma função e exportá-la pra outros arquivos usarem — é a base de
tudo o que vem depois.

**Nível:** Estagiário  
**Sprint:** Estagiário — Primeiro Deploy  
**Estimativa:** 0h 20m  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Lógica de programação: algoritmos e pseudocódigo (1/3)

---

### O que fazer

- [ ] Criar o arquivo `mensagens.js` na raiz deste projeto
- [ ] Implementar `ola()`
- [ ] Implementar `apresentar(nome)`
- [ ] Implementar `boasVindas(nome, cargo)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`mensagens.js` — módulo CommonJS com todas as funções exportadas.

```js
// Exemplo de estrutura esperada
function ola() { ... }

module.exports = { ola, apresentar, boasVindas };
```

---

### Especificação das funções

**`ola()`**
- Não recebe nenhum parâmetro
- Retorna exatamente a string `'Ola, mundo!'`

**`apresentar(nome)`**
- Recebe um nome (string)
- Retorna a string `'Ola, meu nome e ' + nome`
- Ex: `apresentar('Ana')` → `'Ola, meu nome e Ana'`

**`boasVindas(nome, cargo)`**
- Recebe nome e cargo (ambos string)
- Retorna: `'Bem-vindo(a), ' + nome + '! Seu cargo e: ' + cargo`
- Ex: `boasVindas('Ana', 'Estagiaria')` → `'Bem-vindo(a), Ana! Seu cargo e: Estagiaria'`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`ola`** — É a função mais simples possível: não recebe nada, sempre devolve o mesmo
texto. O `return` de uma função é o valor que ela "entrega" pra quem chamou.

**`apresentar`** — Como você junta duas strings em JavaScript? O operador `+` faz
concatenação quando usado entre textos.

**`boasVindas`** — Mesma ideia da anterior, só que juntando mais pedaços. Cuidado com os
espaços entre as palavras ao concatenar.

---

### Tarefas sugeridas para o Sprint

```
add Criar mensagens.js
add Implementar ola
add Implementar apresentar
add Implementar boasVindas
add Passar em todos os testes
```
