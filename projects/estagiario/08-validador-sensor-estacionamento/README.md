# DEVTECH SISTEMAS S.A.
## Feature: Validador de números do sistema de estacionamento

> Sensor do estacionamento manda números de vagas e o sistema precisa checar coisas
> básicas antes de liberar a cancela.

---

### Contexto

O sistema de estacionamento recebe números de sensores (vagas livres, código de ticket) e
precisa validar algumas propriedades matemáticas simples antes de decidir o que fazer —
se é par ou ímpar (vagas alternadas por andar), se é positivo, negativo ou zero, e qual o
maior entre dois valores. Mais uma rodada de condicionais, agora sobre números.

**Nível:** Estagiário  
**Sprint:** Estagiário — Verificador de Vagas  
**Estimativa:** 0h 45m  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Estruturas condicionais (if, else, switch) (2/3)

---

### O que fazer

- [ ] Criar o arquivo `numeros.js` na raiz deste projeto
- [ ] Implementar `ehParOuImpar(numero)`
- [ ] Implementar `sinalDoNumero(numero)`
- [ ] Implementar `maiorEntre(a, b)`
- [ ] Implementar `estaNoIntervalo(numero, min, max)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`numeros.js`

---

### Especificação das funções

**`ehParOuImpar(numero)`** — retorna a string `'par'` ou `'impar'`

**`sinalDoNumero(numero)`**
- Retorna `'positivo'`, `'negativo'` ou `'zero'`

**`maiorEntre(a, b)`**
- Retorna o maior dos dois números
- Se forem iguais, retorna qualquer um dos dois (o valor é o mesmo)

**`estaNoIntervalo(numero, min, max)`**
- Retorna `true` se `numero` estiver entre `min` e `max`, **incluindo** os limites
- Caso contrário, `false`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`ehParOuImpar`** — Reaproveita a mesma ideia do operador `%` que você já usou no
projeto da calculadora.

**`sinalDoNumero`** — Três casos, três comparações: maior que zero, menor que zero, ou
nem um nem outro.

**`maiorEntre`** — Um `if` simples comparando `a > b` já decide qual devolver.

**`estaNoIntervalo`** — Você precisa de duas condições combinadas com `&&`: o número
tem que ser maior ou igual ao mínimo **e** menor ou igual ao máximo.

---

### Tarefas sugeridas para o Sprint

```
add Criar numeros.js
add Implementar ehParOuImpar
add Implementar sinalDoNumero
add Implementar maiorEntre
add Implementar estaNoIntervalo
add Passar em todos os testes
```
