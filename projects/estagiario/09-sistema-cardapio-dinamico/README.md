# DEVTECH SISTEMAS S.A.
## Feature: Sistema de pedidos do totem de autoatendimento

> Restaurante parceiro trocou o atendente por um totem digital — o sistema precisa
> calcular o preço de cada opção do cardápio sozinho.

---

### Contexto

O totem de autoatendimento do restaurante parceiro tem um cardápio com várias opções fixas
(tamanhos de lanche, tipos de bebida). Em vez de uma cadeia enorme de `if/else`, esse é o
caso perfeito pra usar `switch` — várias opções para uma mesma variável.

**Nível:** Estagiário  
**Sprint:** Estagiário — Cardápio do Totem  
**Estimativa:** 0h 50m  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Estruturas condicionais (if, else, switch) (3/3)

---

### O que fazer

- [ ] Criar o arquivo `cardapio.js` na raiz deste projeto
- [ ] Implementar `precoLanche(tamanho)`
- [ ] Implementar `precoBebida(tipo)`
- [ ] Implementar `precoTotal(tamanhoLanche, tipoBebida)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`cardapio.js`

---

### Especificação das funções

**`precoLanche(tamanho)`** — use `switch`
- `'pequeno'` → `12`
- `'medio'` → `18`
- `'grande'` → `24`
- qualquer outro valor → `0`

**`precoBebida(tipo)`** — use `switch`
- `'suco'` → `7`
- `'refrigerante'` → `6`
- `'agua'` → `4`
- qualquer outro valor → `0`

**`precoTotal(tamanhoLanche, tipoBebida)`**
- Retorna a soma de `precoLanche(tamanhoLanche)` com `precoBebida(tipoBebida)`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`precoLanche` / `precoBebida`** — Um `switch (tamanho) { case 'pequeno': return 12; ... }`
resolve. Não esquece do `default` pra cobrir qualquer outra opção não prevista — sem ele,
a função pode devolver `undefined` em vez de `0`.

**`precoTotal`** — Você já tem as duas funções prontas, é só somar os retornos delas.

---

### Tarefas sugeridas para o Sprint

```
add Criar cardapio.js
add Implementar precoLanche
add Implementar precoBebida
add Implementar precoTotal
add Passar em todos os testes
```
