# DEVTECH SISTEMAS S.A.
## Feature: Processador CSV para Integração com ERP

> **BLOQUEIO DE SPRINT — Time de Integração:** O importador de dados do ERP do cliente Grupo Alfa parou de funcionar após atualização do fornecedor. Nenhum dado de produto está entrando no sistema. Precisamos de um parser CSV confiável até amanhã de manhã.

---
### Contexto

O sistema do Grupo Alfa exporta dados de produtos, clientes e pedidos em formato CSV. O módulo de parsing que existia foi feito para um formato antigo e não consegue lidar com campos entre aspas (que contêm vírgulas internas). O time de integração está bloqueado esperando esse módulo.

Você vai criar um processador CSV do zero, capaz de parsear, filtrar, ordenar e regenerar arquivos CSV.

**Nível:** Junior I
**Sprint:** Junior I — Manipulação de Strings
**Estimativa:** 2h
**Prioridade:** Alta

---
### O que fazer

- [ ] Criar `csv.js`
- [ ] Implementar `parsearLinha(linha, separador)`
- [ ] Implementar `parsearCSV(texto)`
- [ ] Implementar `filtrarRegistros(registros, campo, valor)`
- [ ] Implementar `ordenarRegistros(registros, campo, direcao)`
- [ ] Implementar `gerarCSV(registros)`
- [ ] Fazer todos os testes passarem

---
### Arquivo a criar

`csv.js`

---
### Especificação das funções

#### `parsearLinha(linha, separador = ',')`
Divide uma linha CSV respeitando campos entre aspas duplas.
- `"João,25,SP"` → `["João", "25", "SP"]`
- `'"João Silva",25,SP'` → `["João Silva", "25", "SP"]` (aspas removidas)
- `'"Rua das Flores, 123",SP'` → `["Rua das Flores, 123", "SP"]` (vírgula interna preservada)
- Suporta separador customizado: `parsearLinha("a;b;c", ";")` → `["a", "b", "c"]`
- Linha vazia → `[]`

#### `parsearCSV(texto)`
Processa texto multi-linha com cabeçalho na primeira linha.
- Retorna array de objetos usando os nomes da primeira linha como chaves
- Ignora linhas completamente vazias
- Exemplo:
```
"nome,idade,estado\nJoão,25,SP\nMaria,30,RJ"
→ [{ nome: 'João', idade: '25', estado: 'SP' }, { nome: 'Maria', idade: '30', estado: 'RJ' }]
```

#### `filtrarRegistros(registros, campo, valor)`
Filtra o array de registros onde `registro[campo] === valor`.
- Comparação case-insensitive para valores string
- Retorna array vazio se nenhum registro bater
- Exemplo: `filtrarRegistros(registros, 'estado', 'sp')` encontra registros com `estado: 'SP'`

#### `ordenarRegistros(registros, campo, direcao = 'asc')`
Ordena o array de registros pelo campo especificado.
- `direcao = 'asc'` → ordem crescente (A→Z, 0→9)
- `direcao = 'desc'` → ordem decrescente (Z→A, 9→0)
- Não modifica o array original, retorna novo array
- Comparação alfabética para strings

#### `gerarCSV(registros)`
Inverso de `parsearCSV`: converte array de objetos de volta para string CSV.
- Primeira linha: cabeçalho com os nomes dos campos (baseado nas chaves do primeiro objeto)
- Linhas seguintes: valores separados por vírgula
- Retorna string vazia para array vazio
- Exemplo: `[{ nome: 'João', idade: '25' }]` → `"nome,idade\nJoão,25"`

---
### Como testar

```bash
npm install
npm test
```

---
### Dicas (tente sozinho antes de usar)

- Para `parsearLinha`, como você detecta que está "dentro" de aspas e ignora o separador nessa situação? Um estado booleano `dentroAspas` pode ajudar.
- Para `parsearCSV`, você pode usar `.split('\n')` para separar as linhas e `.map()` para transformar cada uma.
- Para `filtrarRegistros`, `.filter()` com `.toLowerCase()` resolve a comparação case-insensitive.
- Para `ordenarRegistros`, lembre que `.sort()` modifica o array original — use `[...registros].sort(...)`.
- Para `gerarCSV`, `Object.keys()` retorna os nomes dos campos e `.join(',')` gera a linha.

---
### Tarefas sugeridas para o Sprint

```
node sprint.js add "03-csv: implementar parsearLinha com suporte a aspas"
node sprint.js add "03-csv: implementar parsearCSV"
node sprint.js add "03-csv: implementar filtrarRegistros"
node sprint.js add "03-csv: implementar ordenarRegistros"
node sprint.js add "03-csv: implementar gerarCSV"
node sprint.js add "03-csv: fazer todos os testes passarem"
```
