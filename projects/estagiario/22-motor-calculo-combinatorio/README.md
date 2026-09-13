# DEVTECH SISTEMAS S.A.
## Feature: Motor de cálculo combinatório do sistema de rifas

> Sistema de rifas internas precisa calcular de quantas formas os números podem ser
> sorteados — a fórmula depende de fatorial, calculado de um jeito novo: recursão.

---

### Contexto

Até agora todo loop era feito com `for`/`while`. Existe outro jeito de repetir uma
operação: uma função que **chama a si mesma**, até atingir um **caso base** que faz ela
parar. Isso se chama recursão. O sistema de rifas usa fatorial pra calcular
possibilidades de sorteio — o exemplo clássico pra aprender recursão.

**Nível:** Estagiário  
**Sprint:** Estagiário — Motor Combinatório  
**Estimativa:** 0h 50m  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Recursão e casos base (1/3)

---

### O que fazer

- [ ] Criar o arquivo `fatorial.js` na raiz deste projeto
- [ ] Implementar `fatorialRecursivo(n)`
- [ ] Implementar `potenciaRecursiva(base, expoente)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`fatorial.js`

---

### Especificação das funções

**`fatorialRecursivo(n)`**
- Calcula `n!` **usando recursão** (a função chama ela mesma), não loop
- Caso base: `fatorialRecursivo(0)` → `1`
- Ex: `fatorialRecursivo(5)` → `120`

**`potenciaRecursiva(base, expoente)`**
- Calcula `base` elevado a `expoente`, **usando recursão**
- Caso base: qualquer `base` elevado a `0` → `1`
- Ex: `potenciaRecursiva(2, 5)` → `32`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`fatorialRecursivo`** — Toda função recursiva tem duas partes: o **caso base** (quando
parar, sem chamar a função de novo) e o **caso recursivo** (onde ela chama ela mesma com
um valor "menor", se aproximando do caso base). Pra fatorial: `fatorialRecursivo(n)` é
`n * fatorialRecursivo(n - 1)`, até chegar em `n === 0`, que retorna `1` direto (sem
chamar a função de novo).

**`potenciaRecursiva`** — Mesma lógica: `potenciaRecursiva(base, expoente)` é
`base * potenciaRecursiva(base, expoente - 1)`, até `expoente === 0`, que retorna `1`.

**Cuidado:** se você esquecer o caso base, ou ele nunca for alcançado, a função chama a
si mesma pra sempre e o programa quebra com "Maximum call stack size exceeded".

---

### Tarefas sugeridas para o Sprint

```
add Criar fatorial.js
add Implementar fatorialRecursivo
add Implementar potenciaRecursiva
add Passar em todos os testes
```
