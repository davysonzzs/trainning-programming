# DEVTECH SISTEMAS S.A.
## Planejamento: Estimador de Sprints Baseado em Histórico

> URGENTE: O time está errando estimativas em 40% toda sprint, causando atrasos que já custaram dois contratos. O gerente de produto exigiu uma ferramenta de estimativa baseada em dados históricos para o próximo planejamento.

---
### Contexto

A DevTech tem 18 sprints de dados históricos arquivados em planilhas que ninguém analisa. O time continua estimando "no feeling", ignorando que historicamente leva 1.4x mais tempo do que estima. Um engenheiro sênior propôs automatizar a análise desses dados para calibrar estimativas futuras e sinalizar risco de sobrecarga de capacidade.

**Nível:** Sênior III
**Sprint:** Sênior III — Estimador de Sprints
**Estimativa:** 2h
**Prioridade:** Alta

---
### O que fazer
- [ ] Criar o arquivo `estimador.js`
- [ ] Implementar `class HistoricoSprints` com `registrar`, `velocidadeMedia`, `precisaoMedia` e `tendencia`
- [ ] Implementar `class Estimador` com `estimarTarefa`, `estimarSprint` e `sugerirCapacidade`
- [ ] Fazer todos os testes passarem (`npm test`)

---
### Arquivo a criar
`estimador.js`

---
### Especificação das funções

#### `class HistoricoSprints`

```js
const historico = new HistoricoSprints();
historico.registrar({ nome: 'Sprint 1', estimativaH: 40, realH: 56, tarefas: 10, concluidas: 8 });
historico.registrar({ nome: 'Sprint 2', estimativaH: 40, realH: 44, tarefas: 10, concluidas: 9 });

historico.velocidadeMedia(5);   // média de concluidas nas últimas 5 (ou todas se menos)
// (8 + 9) / 2 = 8.5

historico.precisaoMedia(5);     // média de realH/estimativaH
// (56/40 + 44/40) / 2 = (1.4 + 1.1) / 2 = 1.25 → arredondado a 2 casas

historico.tendencia();
// 'melhorando' | 'piorando' | 'estavel'
```

**tendencia():**
- Compara `precisaoMedia(3)` com `precisaoMedia(6)`
- Se `precisaoMedia(3) < precisaoMedia(6) * 0.9` → `'melhorando'` (erros menores recentemente)
- Se `precisaoMedia(3) > precisaoMedia(6) * 1.1` → `'piorando'`
- Senão → `'estavel'`

#### `class Estimador`

```js
const estimador = new Estimador(historico);

estimador.estimarTarefa(3, 'media');
// horasBase = 3 * 1.0 = 3.0
// ajustado = 3.0 * precisaoMedia = 3.0 * 1.25 = 3.8 (arredondado a 1 casa)
```

Fatores por complexidade:
- `'baixa'` → 0.5
- `'media'` → 1.0
- `'alta'` → 2.0

```js
estimador.estimarSprint([
  { titulo: 'Login', pontos: 2, complexidade: 'baixa' },
  { titulo: 'Dashboard', pontos: 5, complexidade: 'alta' }
], 20);
// {
//   estimativaH: <soma das tarefas>,
//   capacidadeH: 20,
//   risco: 'alto' | 'normal',  // alto se estimativaH > capacidadeH * 0.9
//   tarefasQueCabem: [...],
//   tarefasQueNaoCabem: [...]
// }
```

```js
estimador.sugerirCapacidade(40);
// {
//   horasRecomendadas: 32,          // 80% de 40
//   tarefasBaixa: 12,               // horasRecomendadas / estimarTarefa(1, 'baixa')
//   tarefasMedia: 6,                // horasRecomendadas / estimarTarefa(1, 'media')
//   tarefasAlta: 3                  // horasRecomendadas / estimarTarefa(1, 'alta')
// }
```
Use `Math.floor` para quantidades de tarefas.

---
### Como testar
```bash
npm install
npm test
```

---
### Dicas (tente sozinho antes de usar)

**velocidadeMedia e precisaoMedia:**
- Como você pega apenas os últimos N elementos de um array? Pense em `slice` com índice negativo.
- Como você calcula a média de um array? Reduza com soma e divida pelo length.

**tendencia:**
- E se o histórico tiver menos de 6 sprints? O que `precisaoMedia(6)` retornaria com poucos dados?
- Precisa tratar o caso onde o divisor (precisaoMedia de 6) é 0?

**estimarSprint:**
- Como você vai acumulando as tarefas em `tarefasQueCabem` até atingir a capacidade?
- O risco é calculado com base na estimativa total, não nas tarefas que couberam.

---
### Tarefas sugeridas para o Sprint
```
add Criar estimador.js
add Implementar HistoricoSprints.registrar
add Implementar velocidadeMedia e precisaoMedia
add Implementar tendencia
add Implementar Estimador.estimarTarefa
add Implementar estimarSprint com separação de tarefas
add Implementar sugerirCapacidade
add Fazer todos os testes passarem
```
