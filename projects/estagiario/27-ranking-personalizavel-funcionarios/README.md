# DEVTECH SISTEMAS S.A.
## Feature: Ranking configurável de funcionários do RH

> RH quer poder ordenar a lista de funcionários por diferentes critérios (nota, nome,
> tempo de casa) sem precisar de uma função de ordenação pra cada critério.

---

### Contexto

Você já implementou bubble sort e selection sort ordenando números simples. Agora o
desafio é ordenar uma lista de **objetos** por um critério que muda — às vezes por nota,
às vezes por nome. Você vai adaptar o que já sabe pra funcionar com qualquer critério de
comparação.

**Nível:** Estagiário  
**Sprint:** Estagiário — Ranking de Funcionários  
**Estimativa:** 1h 15m  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Algoritmos de ordenação (bubble sort, selection sort) (3/3)

---

### O que fazer

- [ ] Criar o arquivo `ordenador.js` na raiz deste projeto
- [ ] Implementar `ordenarPorNota(funcionarios)`
- [ ] Implementar `ordenarPorNome(funcionarios)`
- [ ] Implementar `top3(funcionarios)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`ordenador.js`

---

### Especificação das funções

**Estrutura de um funcionário:** `{ nome, nota }`

**`ordenarPorNota(funcionarios)`**
- Retorna um **novo** array ordenado pela `nota`, do maior pro menor
- **Implemente manualmente** (bubble sort ou selection sort — a sua escolha), sem usar
  `.sort()`
- Não altere o array recebido

**`ordenarPorNome(funcionarios)`**
- Retorna um **novo** array ordenado pelo `nome`, em ordem alfabética (A → Z)
- Também implementado manualmente, sem `.sort()`
- Dica: strings podem ser comparadas com `<` e `>` diretamente em JavaScript

**`top3(funcionarios)`**
- Retorna os 3 funcionários com maior `nota` (reaproveite `ordenarPorNota`)
- Se houver menos de 3 funcionários, retorna todos que existirem

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`ordenarPorNota`** — É o mesmo algoritmo que você já fez, mudando só o que é
comparado: em vez de `numeros[i]` você compara `funcionarios[i].nota`, e a troca de
posição envolve o objeto inteiro, não só o número.

**`ordenarPorNome`** — Mesma ideia, comparando `funcionarios[i].nome` — mas com `<`/`>`
em vez de subtração, já que são strings.

**`top3`** — Ordene primeiro com `ordenarPorNota`, depois use `.slice(0, 3)` pra pegar
só os 3 primeiros do array já ordenado.

---

### Tarefas sugeridas para o Sprint

```
add Criar ordenador.js
add Implementar ordenarPorNota
add Implementar ordenarPorNome
add Implementar top3
add Passar em todos os testes
```
