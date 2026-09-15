# DEVTECH SISTEMAS S.A.
## Feature: Motor de busca rápida do catálogo (já ordenado)

> Catálogo de produtos cresceu tanto que a busca linear ficou lenta — Tech Lead pediu uma
> versão mais rápida, aproveitando que a lista já vem ordenada.

---

### Contexto

Você já fez busca linear (percorrer item a item). Ela funciona, mas fica lenta com listas
grandes. Quando a lista **já está ordenada**, existe um truque muito mais rápido: a
**busca binária** — a cada tentativa, você elimina metade da lista, olhando sempre o
elemento do meio e decidindo pra qual lado continuar procurando.

**Nível:** Estagiário  
**Sprint:** Estagiário — Motor de Busca Rápida  
**Estimativa:** 2h 45m  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Algoritmos de busca (linear e binária) (2/2)

---

### O que fazer

- [ ] Criar o arquivo `buscaBinaria.js` na raiz deste projeto
- [ ] Implementar `buscaBinaria(numerosOrdenados, alvo)`
- [ ] Implementar `contarTentativas(numerosOrdenados, alvo)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`buscaBinaria.js`

---

### Especificação das funções

**`buscaBinaria(numerosOrdenados, alvo)`**
- Recebe um array de números **já ordenado** (do menor pro maior) e um valor alvo
- Retorna o **índice** (posição) do `alvo` no array, ou `-1` se não existir
- **Precisa ser busca binária** — não vale percorrer item a item (`buscaLinear` já existe
  no outro projeto, essa aqui é uma técnica diferente)
- Ex: `buscaBinaria([1, 3, 5, 7, 9, 11], 7)` → `3`

**`contarTentativas(numerosOrdenados, alvo)`**
- Retorna quantas comparações (tentativas) a busca binária precisou fazer até achar (ou
  concluir que não existe) o `alvo`
- Serve pra você enxergar na prática como a busca binária precisa de bem menos
  tentativas que a busca linear numa lista grande

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 10 — Algoritmos de busca (linear e binária)**
> em [`10-algoritmos-de-busca.md`](../../../aulas/fase-01-fundamentos-de-programacao/10-algoritmos-de-busca.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`buscaBinaria`** — Guarde um `inicio = 0` e um `fim = numerosOrdenados.length - 1`.
Enquanto `inicio <= fim`: calcule o `meio` (`Math.floor((inicio + fim) / 2)`), compare
`numerosOrdenados[meio]` com o `alvo` — se forem iguais, achou; se o alvo for maior, a
busca continua só na metade de cima (`inicio = meio + 1`); se for menor, só na metade de
baixo (`fim = meio - 1`). Se o loop terminar sem achar, retorna `-1`.

**`contarTentativas`** — Praticamente o mesmo código de `buscaBinaria`, mas em vez de
retornar o índice no final, você conta quantas vezes o loop rodou (quantas vezes comparou
o `meio`) e retorna esse número.

---

### Tarefas sugeridas para o Sprint

```
add Criar buscaBinaria.js
add Implementar buscaBinaria
add Implementar contarTentativas
add Passar em todos os testes
```
