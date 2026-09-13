# DEVTECH SISTEMAS S.A.
## Feature: Sistema de avaliação de desempenho de funcionários

> RH pediu módulo de classificação de notas para o ciclo de avaliação Q3.

---

### Contexto

O setor de RH precisa lançar o sistema de avaliação trimestral até sexta. Cada funcionário
tem 3 notas de avaliação (técnica, comportamental e entregas). O sistema deve calcular a
média e classificar automaticamente. PM Marcos já confirmou com o cliente — sem atraso.

**Nível:** Estagiário  
**Sprint:** Estagiário — Classificador de Notas  
**Estimativa:** 1h 30m  
**Prioridade:** Alta  
**Tópico da trilha:** Fase 1 — Fundamentos › Objetos: propriedades, métodos e referências (2/3)

---

### O que fazer

- [ ] Criar o arquivo `avaliacao.js` na raiz deste projeto
- [ ] Implementar `classificarNota(nota)`
- [ ] Implementar `calcularMedia(notas)`
- [ ] Implementar `avaliarFuncionario(funcionario)`
- [ ] Implementar `listarAprovados(funcionarios)`
- [ ] Implementar `melhorFuncionario(funcionarios)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`avaliacao.js`

---

### Especificação das funções

**`classificarNota(nota)`** — nota de 0 a 10
- `0 a 4.9` → `'reprovado'`
- `5 a 5.9` → `'recuperacao'`
- `6 a 7.9` → `'aprovado'`
- `8 a 10`  → `'destaque'`

**`calcularMedia(notas)`** — array de números
- Retorna a média arredondada para 2 casas decimais
- Array vazio → retorna `0`

**`avaliarFuncionario(funcionario)`**
- Entrada: `{ nome, notas: [n1, n2, n3] }`
- Retorna: `{ nome, notas, media, classificacao, aprovado }`
- `aprovado` é `true` se classificacao for `'aprovado'` ou `'destaque'`

**`listarAprovados(funcionarios)`**
- Recebe um array de funcionários **crus** (só `{ nome, notas }`, sem `media`/`aprovado`
  calculados ainda) — a função chama `avaliarFuncionario` em cada um internamente
- Retorna os funcionários **já avaliados** (no formato de `avaliarFuncionario`, com
  `media`, `classificacao` e `aprovado`) cujo `aprovado` for `true`

**`melhorFuncionario(funcionarios)`**
- Recebe o mesmo formato **cru** — também usa `avaliarFuncionario` (ou `calcularMedia`)
  internamente pra descobrir a média de cada um
- Retorna o funcionário (no formato original, `{ nome, notas }`) com a maior média
- Em caso de empate, retorna o primeiro da lista

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`classificarNota`** — Cuidado com os limites: 5.0 é `'recuperacao'` ou `'aprovado'`? Verifique os intervalos da especificação com atenção.

**`calcularMedia`** — Você precisa de dois valores: a soma total e a quantidade de elementos. E quando o array está vazio?

**`avaliarFuncionario`** — Você já tem `calcularMedia` e `classificarNota`. A função precisa chamar as duas e montar o objeto de retorno. O que define se `aprovado` é `true`?

**`listarAprovados`** — Os funcionários chegam crus (sem `aprovado` calculado). Primeiro
transforme cada um com `avaliarFuncionario` (ex: usando `.map()`), depois filtre pelo
campo `aprovado` do resultado — a função devolve os objetos já avaliados, não os crus.

**`melhorFuncionario`** — Como você encontra o maior valor num array sem usar `.sort()`?
Pense num acumulador que guarda o "campeão atual" — só que aqui a comparação é pela média
calculada (`calcularMedia(f.notas)`), já que o funcionário cru não vem com ela pronta.

---

### Tarefas sugeridas para o Sprint

```
add Criar avaliacao.js
add Implementar classificarNota
add Implementar calcularMedia
add Implementar avaliarFuncionario
add Implementar listarAprovados e melhorFuncionario
add Passar em todos os testes
```
