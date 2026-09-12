# 06 — Dashboard Integrador

**Nível:** Junior II
**Sprint:** Junior II — Dashboard Integrador
**Estimativa:** 2h 30m

---

## Contexto

Chegou a hora de juntar tudo. O sistema de monitoramento interno da DevTech precisa de um `Dashboard` que integra os conceitos aprendidos nos projetos anteriores:

- **Storage** para persistir métricas em memória com namespace
- **EventEmitter** para notificar outros módulos quando uma nova métrica é registrada
- **Stream** para calcular estatísticas de forma encadeada

Este é o projeto integrador do nível Junior II — você vai usar os padrões em conjunto pela primeira vez.

---

## O que fazer

Crie o arquivo `dashboard.js` exportando a classe `Dashboard`. Você pode (e deve) implementar `Storage` e `Stream` diretamente neste arquivo ou replicar a lógica necessária.

---

## Arquivo a criar

```
dashboard.js
```

---

## Especificação

### Classe `Dashboard`

**Constructor:** `constructor(namespace)`
- Usa um Storage com o namespace fornecido para persistir métricas
- Usa um EventEmitter para notificações de novas métricas
- Estrutura de uma métrica armazenada: `{ nome, valor, timestamp: new Date().toISOString() }`

| Método | Comportamento |
|--------|--------------|
| `registrarMetrica(nome, valor)` | Salva métrica no storage (chave pode ser algo como `metrica_<nome>_<timestamp>` ou um array por nome) e emite evento `'metrica'` com `{ nome, valor, timestamp }` |
| `obterMetricas(nome = null)` | Retorna array de todas as métricas (filtrado por nome se fornecido) |
| `calcularEstatisticas(nome)` | Usa Stream internamente. Filtra métricas por nome e calcula `{ min, max, media, total }`. Retorna `null` se não há métricas para o nome |
| `onMetrica(callback)` | Registra listener para o evento `'metrica'` |
| `exportar()` | Retorna objeto `{ [nome]: [metricas...] }` agrupando todas as métricas por nome |

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- Para armazenar múltiplas métricas com o mesmo nome, considere salvar um array no storage: `storage.getItem(nome) || []`, depois push, depois `storage.setItem(nome, array)`
- Para `calcularEstatisticas`, use `Stream.from(metricas).reduce(...)` para calcular min, max e soma
- `media = total / quantidade` — cuidado com divisão por zero
- O evento emitido pelo EventEmitter deve carregar o objeto `{ nome, valor, timestamp }`
- `exportar()` pode iterar sobre `storage.keys()` e agrupar — ou você pode manter um registro dos nomes únicos
- Por que integrar os padrões? No mundo real, sistemas raramente usam apenas um padrão — a habilidade de compor soluções é o que diferencia um bom desenvolvedor

---

## Tarefas para o Sprint

- [ ] Criar `dashboard.js` com a classe `Dashboard`
- [ ] Implementar persistência de métricas via Storage (com namespace)
- [ ] Implementar emissão de evento `'metrica'` ao registrar
- [ ] Implementar `obterMetricas` com filtro opcional por nome
- [ ] Implementar `calcularEstatisticas` usando Stream (min, max, media, total)
- [ ] Implementar `onMetrica` para registrar listeners
- [ ] Implementar `exportar` agrupando por nome
- [ ] Rodar `npm test` e garantir que todos os testes passam
