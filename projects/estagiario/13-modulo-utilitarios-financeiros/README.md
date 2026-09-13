# DEVTECH SISTEMAS S.A.
## Feature: Módulo de utilitários matemáticos pro time de vendas

> Time de vendas está copiando e colando as mesmas contas em várias planilhas — pediu um
> conjunto de funções pequenas e reutilizáveis pra centralizar isso.

---

### Contexto

Antes de entrar em regras de negócio grandes, o Tech Lead pediu pra você praticar
**funções puras** — funções pequenas, que recebem parâmetros, devolvem um resultado com
`return`, e não dependem nem alteram nada fora delas (sem efeito colateral). É a base pra
qualquer função maior que você vai escrever daqui pra frente.

**Nível:** Estagiário  
**Sprint:** Estagiário — Utilitários Matemáticos  
**Estimativa:** 0h 50m  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Funções: parâmetros, retorno e escopo (1/3)

---

### O que fazer

- [ ] Criar o arquivo `utilitarios.js` na raiz deste projeto
- [ ] Implementar `dobrar(numero)`
- [ ] Implementar `quadrado(numero)`
- [ ] Implementar `ehPositivo(numero)`
- [ ] Implementar `arredondarPara(numero, casas)`
- [ ] Implementar `media(a, b, c)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`utilitarios.js`

---

### Especificação das funções

**`dobrar(numero)`** — retorna `numero * 2`

**`quadrado(numero)`** — retorna `numero * numero`

**`ehPositivo(numero)`** — retorna `true` se `numero > 0`, senão `false`

**`arredondarPara(numero, casas)`**
- Arredonda `numero` para a quantidade de `casas` decimais indicada
- Ex: `arredondarPara(3.14159, 2)` → `3.14`

**`media(a, b, c)`**
- Retorna a média aritmética dos três números, arredondada para 2 casas decimais
- Dica: você já tem `arredondarPara` — use ela aqui dentro

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`dobrar` / `quadrado` / `ehPositivo`** — Cada uma é uma única operação com `return`.
Não precisa de variável intermediária.

**`arredondarPara`** — `Math.round` só arredonda pra inteiro. Pra arredondar com casas
decimais, um truque comum é multiplicar por `10^casas`, arredondar, e dividir de volta.

**`media`** — Some os três, divida por três, e chame `arredondarPara` no resultado com
`2` casas — reaproveitar uma função dentro da outra é uma prática comum.

---

### Tarefas sugeridas para o Sprint

```
add Criar utilitarios.js
add Implementar dobrar, quadrado e ehPositivo
add Implementar arredondarPara
add Implementar media
add Passar em todos os testes
```
