# DEVTECH SISTEMAS S.A.
## Feature: Monitor de eventos do servidor de produção

> Infra pediu um contador que roda enquanto o servidor recebe eventos, sem saber de
> antemão quantos vão chegar — a condição de parada só é conhecida em tempo real.

---

### Contexto

Diferente do `for` (que sabe quantas voltas vai dar), o monitor de eventos do servidor
precisa continuar contando **enquanto** uma condição for verdadeira — por exemplo, até o
contador de erros bater um limite, ou até processar uma fila que muda de tamanho a cada
volta. Isso é a cara do `while` e do `do-while`.

**Nível:** Estagiário  
**Sprint:** Estagiário — Monitor de Eventos  
**Estimativa:** 1h 30m  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Estruturas de repetição (for, while, do-while) (2/3)

---

### O que fazer

- [ ] Criar o arquivo `contador.js` na raiz deste projeto
- [ ] Implementar `contarAteLimite(limite)`
- [ ] Implementar `fatorial(n)`
- [ ] Implementar `processarFila(fila)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`contador.js`

---

### Especificação das funções

**`contarAteLimite(limite)`**
- Retorna um array com todos os números de `1` até `limite`, gerado com `while`
- Ex: `contarAteLimite(4)` → `[1, 2, 3, 4]`
- `limite` igual a `0` ou negativo retorna `[]`

**`fatorial(n)`**
- Calcula o fatorial de `n` (`n! = n * (n-1) * (n-2) * ... * 1`) usando um loop (não use
  recursão ainda — isso vem num tópico futuro)
- Ex: `fatorial(5)` → `120`
- `fatorial(0)` → `1`

**`processarFila(fila)`**
- Recebe um array de strings representando uma fila de tarefas
- Usa `do-while` (ou qualquer loop) pra "processar" cada item — retorna um novo array
  onde cada item virou `'processado: ' + item`
- Fila vazia retorna `[]`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 4 — Estruturas de repetição (for, while, do-while)**
> em [`04-estruturas-de-repeticao.md`](../../../aulas/fase-01-fundamentos-de-programacao/04-estruturas-de-repeticao.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`contarAteLimite`** — `let i = 1; while (i <= limite) { ... i++ }`. Lembre de tratar o
caso de `limite` ser `0` ou negativo antes do loop (senão ele nunca entra e retorna certo
sozinho — mas confirme isso testando).

**`fatorial`** — Comece um acumulador com `1` (nunca `0`, senão tudo vira `0`!) e vá
multiplicando pelos números de `1` até `n`.

**`processarFila`** — `.length` do array te diz até onde ir. Não precisa
necessariamente de `do-while` — qualquer loop que percorra a fila item a item funciona,
desde que trate array vazio sem quebrar.

---

### Tarefas sugeridas para o Sprint

```
add Criar contador.js
add Implementar contarAteLimite
add Implementar fatorial
add Implementar processarFila
add Passar em todos os testes
```
