# DEVTECH SISTEMAS S.A.
## Documentação: Sistema de Architecture Decision Records (ADR)

> URGENTE: O novo CTO auditou o histórico técnico e descobriu que 8 decisões críticas de arquitetura foram tomadas sem registro algum. Ele deu 48h para implementar rastreabilidade total de decisões.

---
### Contexto

A DevTech cresceu de 5 para 40 engenheiros em 18 meses. Nesse período, decisões como "mudar de REST para GraphQL", "adotar microsserviços" e "trocar o banco de dados" foram tomadas em reuniões informais sem documentação. Novos engenheiros não sabem o porquê de nada. O novo CTO, vindo de uma cultura de engenharia rigorosa, exigiu rastreabilidade imediata de todas as decisões de arquitetura usando o padrão ADR.

**Nível:** Sênior III
**Sprint:** Sênior III — Sistema ADR
**Estimativa:** 1h 30m
**Prioridade:** Alta

---
### O que fazer
- [ ] Criar o arquivo `adr.js`
- [ ] Implementar `criarSistemaADR()` retornando objeto com todos os métodos
- [ ] Implementar `criar` com ID sequencial e timestamp
- [ ] Implementar `atualizar` com histórico de mudanças
- [ ] Implementar `buscar` e `listar` com filtros
- [ ] Implementar `superseder` para encadear decisões
- [ ] Implementar `exportarMarkdown` e `historico`
- [ ] Fazer todos os testes passarem (`npm test`)

---
### Arquivo a criar
`adr.js`

---
### Especificação das funções

#### `criarSistemaADR()`
Retorna um objeto com todos os métodos abaixo. Cada instância tem seu próprio estado isolado.

#### `criar({ titulo, contexto, decisao, consequencias, alternativas, autor, status })`
```js
const sistema = criarSistemaADR();
const adr = sistema.criar({
  titulo: 'Adotar PostgreSQL',
  contexto: 'Precisamos de ACID e JSON nativo',
  decisao: 'Usar PostgreSQL 15',
  consequencias: 'Curva de aprendizado para time NoSQL',
  alternativas: ['MongoDB', 'MySQL'],
  autor: 'Maria Silva'
});
// adr = {
//   id: 'ADR-001',
//   titulo: 'Adotar PostgreSQL',
//   status: 'proposta',
//   criadoEm: '2024-01-15T10:00:00.000Z',
//   historico: [],
//   ...
// }
```

- IDs sequenciais: ADR-001, ADR-002, ..., ADR-010, ADR-011...
- `status` padrão: `'proposta'`

#### `atualizar(id, dados)`
```js
sistema.atualizar('ADR-001', { status: 'aceita' });
// historico da ADR terá: [{ campo: 'status', valorAnterior: 'proposta', valorNovo: 'aceita', atualizadoEm: '...' }]
```

#### `buscar(id)` / `listar(filtros)`
```js
sistema.buscar('ADR-001');   // retorna a ADR ou null
sistema.listar();             // todas as ADRs
sistema.listar({ status: 'aceita' });  // filtra por status
sistema.listar({ autor: 'Maria Silva' }); // filtra por autor
```

#### `superseder(idAntigo, idNovo)`
```js
sistema.superseder('ADR-001', 'ADR-002');
// ADR-001: status='supersedida', supersededBy='ADR-002'
// ADR-002: supersedes='ADR-001'
```

#### `exportarMarkdown(id)`
Retorna string markdown com todos os campos formatados:
```markdown
# ADR-001: Adotar PostgreSQL

**Status:** proposta
**Autor:** Maria Silva
**Criado em:** 2024-01-15T10:00:00.000Z

## Contexto
Precisamos de ACID e JSON nativo

## Decisão
Usar PostgreSQL 15

## Consequências
Curva de aprendizado para time NoSQL

## Alternativas consideradas
- MongoDB
- MySQL
```

#### `historico(id)`
Retorna o array de mudanças registradas na ADR (pode ser vazio).

---
### Como testar
```bash
npm install
npm test
```

---
### Dicas (tente sozinho antes de usar)

**criar:**
- Como você garante que o ID seja sempre formatado com 3 dígitos (ADR-001 e não ADR-1)?
- Onde você armazena o contador de IDs para que cada chamada gere o próximo?

**atualizar:**
- Como você registra o valor anterior de um campo antes de sobrescrevê-lo?
- Object.assign ou spread — qual a diferença e qual usar aqui?

**exportarMarkdown:**
- Como você itera sobre um array (alternativas) para gerar uma lista markdown?
- Template literals com múltiplas linhas podem ser sua melhor amiga aqui.

---
### Tarefas sugeridas para o Sprint
```
add Criar adr.js com criarSistemaADR
add Implementar criar com ID sequencial
add Implementar atualizar com histórico
add Implementar buscar e listar com filtros
add Implementar superseder
add Implementar exportarMarkdown
add Implementar historico
add Fazer todos os testes passarem
```
