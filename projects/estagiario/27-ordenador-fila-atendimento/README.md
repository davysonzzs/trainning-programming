# DEVTECH SISTEMAS S.A.
## Feature: Ordenador da fila de atendimento por prioridade

> Central de atendimento quer reordenar a fila de senhas por tempo de espera, do maior
> pro menor — sem usar o `.sort()` pronto, pra você entender como ordenação funciona por
> baixo dos panos.

---

### Contexto

Antes de usar `.sort()` (que você vai aprender a usar de verdade num projeto futuro), o
Tech Lead pediu pra você implementar o algoritmo de ordenação mais simples que existe: o
**bubble sort**. A ideia: percorrer a lista várias vezes, comparando pares vizinhos e
trocando quando estão fora de ordem — como "bolhas" que sobem até a posição certa.

**Nível:** Estagiário  
**Sprint:** Estagiário — Ordenador da Fila  
**Estimativa:** 2h 15m  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Algoritmos de ordenação (bubble sort, selection sort) (1/3)

---

### O que fazer

- [ ] Criar o arquivo `bubbleSort.js` na raiz deste projeto
- [ ] Implementar `bubbleSortCrescente(numeros)`
- [ ] Implementar `bubbleSortDecrescente(numeros)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`bubbleSort.js`

---

### Especificação das funções

**`bubbleSortCrescente(numeros)`**
- Recebe um array de números e retorna um **novo** array ordenado do menor pro maior
- **Não use `.sort()`** — implemente o algoritmo manualmente
- Não altere o array recebido
- Ex: `bubbleSortCrescente([5, 2, 8, 1])` → `[1, 2, 5, 8]`

**`bubbleSortDecrescente(numeros)`**
- Igual à anterior, mas do maior pro menor
- Ex: `bubbleSortDecrescente([5, 2, 8, 1])` → `[8, 5, 2, 1]`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 9 — Algoritmos de ordenação (bubble sort, selection sort)**
> em [`09-algoritmos-de-ordenacao.md`](../../../aulas/fase-01-fundamentos-de-programacao/09-algoritmos-de-ordenacao.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**Antes de tudo:** copie o array recebido pra uma variável nova (`[...numeros]`) e
trabalhe nessa cópia — assim você não altera o array original.

**`bubbleSortCrescente`** — Dois loops `for` aninhados: o de fora repete várias vezes
(uma "passada" completa), o de dentro percorre pares vizinhos (posição `i` e `i + 1`),
comparando `array[i]` com `array[i + 1]`. Se `array[i]` for maior, troque os dois de
posição. Repita até uma passada inteira não precisar trocar nada.

**`bubbleSortDecrescente`** — Exatamente igual, só invertendo a condição da troca
(trocar quando `array[i]` for **menor** que `array[i + 1]`).

---

### Tarefas sugeridas para o Sprint

```
add Criar bubbleSort.js
add Implementar bubbleSortCrescente
add Implementar bubbleSortDecrescente
add Passar em todos os testes
```
