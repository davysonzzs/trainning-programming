# DEVTECH SISTEMAS S.A.
## Feature: Gerador de gráficos em texto pro relatório do terminal

> Time de operações quer um "gráfico de barras" simples em texto puro pra ver no
> terminal, sem precisar abrir planilha — e também validações de texto repetitivas.

---

### Contexto

O relatório de vendas roda direto no terminal e o time pediu barras feitas de caracteres
(tipo `###`) representando quantidades — e também algumas checagens simples em texto que
precisam percorrer caractere por caractere. Isso reforça **loops aninhados** (um loop
dentro do outro) e loops sobre strings.

**Nível:** Estagiário  
**Sprint:** Estagiário — Relatório Visual  
**Estimativa:** 1h  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Estruturas de repetição (for, while, do-while) (3/3)

---

### O que fazer

- [ ] Criar o arquivo `padroes.js` na raiz deste projeto
- [ ] Implementar `barra(quantidade)`
- [ ] Implementar `graficoDeBarras(valores)`
- [ ] Implementar `contarVogais(texto)`
- [ ] Implementar `ehPalindromo(texto)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`padroes.js`

---

### Especificação das funções

**`barra(quantidade)`**
- Retorna uma string com `quantidade` caracteres `'#'`
- Ex: `barra(3)` → `'###'`, `barra(0)` → `''`

**`graficoDeBarras(valores)`**
- Recebe um array de números, ex: `[3, 1, 4]`
- Retorna um array de strings, uma barra por valor (usando `barra`)
- Ex: `graficoDeBarras([3, 1, 4])` → `['###', '#', '####']`

**`contarVogais(texto)`**
- Retorna quantas vogais (`a, e, i, o, u`, maiúsculas ou minúsculas) existem no texto
- Ex: `contarVogais('DevTech')` → `2`

**`ehPalindromo(texto)`**
- Retorna `true` se o texto for igual de trás pra frente (ignorando maiúsculas/minúsculas)
- Ex: `ehPalindromo('Ovo')` → `true`, `ehPalindromo('DevTech')` → `false`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`barra`** — Um `for` de `0` até `quantidade`, concatenando `'#'` a cada volta num
acumulador que começa como string vazia `''`.

**`graficoDeBarras`** — Este é o "loop dentro do loop" (mesmo que o de dentro esteja
escondido dentro de `barra`): percorra o array de valores, e pra cada um chame `barra`.

**`contarVogais`** — Strings podem ser percorridas por índice, tipo array:
`texto[i]`. Compare cada caractere (em minúsculo, com `.toLowerCase()`) contra a lista de
vogais.

**`ehPalindromo`** — Compare o texto (em minúsculo) com ele mesmo invertido. Existe um
jeito de inverter uma string transformando ela em array primeiro (`.split('')`),
invertendo o array (`.reverse()`) e juntando de novo (`.join('')`) — mas você também pode
resolver comparando caractere a caractere com um loop.

---

### Tarefas sugeridas para o Sprint

```
add Criar padroes.js
add Implementar barra
add Implementar graficoDeBarras
add Implementar contarVogais
add Implementar ehPalindromo
add Passar em todos os testes
```
