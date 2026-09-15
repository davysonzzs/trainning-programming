# DEVTECH SISTEMAS S.A.
## Projeto Integrador: Sistema de Relatório de Vendas

> PROJETO FINAL DO ESTÁGIO — Tech Lead vai revisar pessoalmente. Mostre tudo que aprendeu.

---

### Contexto

Este é seu projeto de conclusão de estágio. O Tech Lead Rafael pediu um sistema de relatório
de vendas que integre tudo que você praticou: funções, arrays, objetos, loops e condicionais.
QA Ana já preparou 12 casos de teste. PM Marcos deu prazo até o final da sprint.

Se você concluir dentro do tempo estimado e os testes passarem, o Tech Lead avalia sua
promoção para Trainee.

**Nível:** Estagiário (Projeto Final)  
**Sprint:** Estagiário — Relatório Integrador  
**Estimativa:** 4h  
**Prioridade:** Alta  
**Tópico da trilha:** Fase 1 — Fundamentos de Programação (projeto integrador — usa todos os 10 tópicos da fase)

---

### O que fazer

- [ ] Criar o arquivo `relatorio.js` na raiz deste projeto
- [ ] Implementar `calcularFaturamento(vendas)`
- [ ] Implementar `ticketMedio(vendas)`
- [ ] Implementar `calcularCrescimento(mesAtual, mesAnterior)`
- [ ] Implementar `top3Vendedores(vendas)`
- [ ] Implementar `relatorioCompleto(vendas)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`relatorio.js`

---

### Especificação das funções

**Estrutura de uma venda:** `{ id, vendedor, valor, produto, data }`

**`calcularFaturamento(vendas)`**
- Soma de todos os `valor`
- Array vazio → `0`

**`ticketMedio(vendas)`**
- Média dos valores, arredondado 2 casas
- Array vazio → `0`

**`calcularCrescimento(mesAtual, mesAnterior)`**
- Retorna percentual de crescimento: `((mesAtual - mesAnterior) / mesAnterior) * 100`
- Arredondado 2 casas decimais
- `mesAnterior = 0` → retorna `0` (evita divisão por zero)

**`top3Vendedores(vendas)`**
- Agrupa vendas por `vendedor`, soma os `valor` de cada um
- Retorna array dos 3 com maior total: `[{ vendedor, total }]`
- Ordenado do maior para o menor

**`relatorioCompleto(vendas)`**
- Retorna objeto com:
```js
{
  faturamento,      // calcularFaturamento
  ticketMedio,      // ticketMedio
  totalVendas,      // quantidade de vendas
  top3Vendedores,   // top3Vendedores
  melhorVendedor,   // nome do #1
}
```

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Travou? Esse projeto usa os 10 tópicos da Fase 1 juntos — revise
> qualquer um deles em [`README.md`](../../../aulas/fase-01-fundamentos-de-programacao/README.md) (ou tecla `[5]`
> no simulador, Trilha de Estudos) antes de chamar o Copilot.

**`calcularFaturamento`** — Soma de todos os `valor`. Você já fez isso antes em projetos anteriores. Array vazio deve retornar `0`.

**`ticketMedio`** — Faturamento total dividido pela quantidade de vendas. Atenção: se não houver vendas, não divida por zero.

**`calcularCrescimento`** — A fórmula está na especificação. Implemente exatamente como está. Caso especial: `mesAnterior = 0` retorna `0` (não tente dividir).

**`top3Vendedores`** — Este é o mais complexo. Pense em etapas: (1) como você agrupa vendas pelo nome do vendedor e soma os valores de cada um? (2) como converte esse agrupamento num array? (3) como ordena do maior para o menor? (4) como pega só os 3 primeiros?

**`relatorioCompleto`** — Monte o objeto usando as funções que você já implementou neste arquivo. `melhorVendedor` é o `vendedor` do primeiro elemento de `top3Vendedores`.

---

### Tarefas sugeridas para o Sprint

```
add Criar relatorio.js
add Implementar calcularFaturamento e ticketMedio
add Implementar calcularCrescimento
add Implementar top3Vendedores (mais complexo)
add Implementar relatorioCompleto
add Passar em todos os 12 testes
add Code review com Tech Lead
```
