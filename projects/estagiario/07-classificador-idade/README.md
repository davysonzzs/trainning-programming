# DEVTECH SISTEMAS S.A.
## Feature: Classificador de faixa etária pro sistema de ingressos

> Cinema parceiro precisa aplicar preços diferentes por faixa etária e bloquear filmes
> com classificação indicativa incompatível.

---

### Contexto

O sistema de venda de ingressos precisa decidir, na hora da compra, qual faixa etária o
cliente se encaixa (pra aplicar o preço certo) e se ele pode ou não assistir a um filme
com determinada classificação indicativa. Isso é decisão pura: `if`, `else if`, `else`.

**Nível:** Estagiário  
**Sprint:** Estagiário — Classificador de Ingressos  
**Estimativa:** 1h 15m  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Estruturas condicionais (if, else, switch) (1/3)

---

### O que fazer

- [ ] Criar o arquivo `idade.js` na raiz deste projeto
- [ ] Implementar `faixaEtaria(idade)`
- [ ] Implementar `precoIngresso(idade)`
- [ ] Implementar `podeAssistir(idade, classificacao)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`idade.js`

---

### Especificação das funções

**`faixaEtaria(idade)`**
- `0 a 11` → `'crianca'`
- `12 a 17` → `'adolescente'`
- `18 a 59` → `'adulto'`
- `60 ou mais` → `'idoso'`

**`precoIngresso(idade)`**
- Criança ou idoso → `10`
- Adolescente → `16`
- Adulto → `24`

**`podeAssistir(idade, classificacao)`**
- `classificacao` é um número: `0`, `10`, `12`, `14`, `16` ou `18` (idade mínima)
- Retorna `true` se `idade >= classificacao`, `false` caso contrário

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 3 — Estruturas condicionais (if, else, switch)**
> em [`03-estruturas-condicionais.md`](../../../aulas/fase-01-fundamentos-de-programacao/03-estruturas-condicionais.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`faixaEtaria`** — Uma cadeia de `if / else if / else` resolve, testando os limites de
cima pra baixo (ou de baixo pra cima) — cuidado com os limites exatos (ex: `11` é criança,
`12` já é adolescente). O mesmo padrão, num exemplo genérico (classificando temperatura,
não idade):

```js
function classificarTemperatura(graus) {
  if (graus < 15)       return 'frio';
  else if (graus < 28)  return 'ameno';
  else                  return 'quente';
}
```

**`precoIngresso`** — Você pode chamar `faixaEtaria` de dentro dessa função e decidir o
preço com base no resultado, em vez de repetir toda a lógica de novo.

**`podeAssistir`** — É uma comparação direta, nem precisa de `if` — o resultado da
comparação **é** o `true`/`false` que a função deve devolver.

---

### Tarefas sugeridas para o Sprint

```
add Criar idade.js
add Implementar faixaEtaria
add Implementar precoIngresso
add Implementar podeAssistir
add Passar em todos os testes
```
