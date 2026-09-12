# 06 — DevOps Integrador

**Nível:** Sênior I
**Fase:** 11+12 — Testes Avancados + DevOps Patterns (Integrador)
**Estimativa:** 2h 30m

---

## Contexto

Este e o projeto integrador do Senor I. Voce ja implementou TDD, testes de integracao, analisador de cobertura, pipeline de CI e monitoramento. Agora e hora de unir tudo em uma plataforma DevOps coesa.

A DevTech quer uma ferramenta interna que automatize o ciclo completo: rodar testes → verificar cobertura → fazer deploy → registrar metricas de observabilidade. O Tech Lead Pedro chama isso de "inner loop automatizado" — tudo que o dev faz antes de abrir o PR, agora e automatico.

---

## O que fazer

Implemente o arquivo `devops.js` com a `class SistemaDevOps` que integra pipeline, monitoramento e cobertura.

---

## Arquivo a criar

**`devops.js`** na raiz deste projeto.

---

## Especificacao

### `class SistemaDevOps`

#### `constructor()`
Inicializa internamente:
- Pipeline de CI (ou logica equivalente)
- Logger
- ColetorMetricas
- Tracer
- Historico de execucoes e deploys

#### `async executarPipeline(codigo, testes)`
Parametros:
- `codigo`: string (nome/conteudo do codigo a ser "verificado")
- `testes`: array de funcoes `() => boolean` (suite de testes)

Operacoes:
1. Inicia span de trace para o pipeline
2. Executa os testes, contando passaram/falharam
3. Calcula percentual de cobertura
4. Registra metricas: `pipeline.execucao` (contador), `pipeline.cobertura` (histograma), `pipeline.duracao` (histograma)
5. Loga resultado
6. Finaliza span
7. Retorna `{ aprovado: boolean, relatorio: string, metricas: { total, passaram, falharam, cobertura } }`

#### `async deployar(versao, ambiente)`
Parametros: `versao` (ex: '1.2.3'), `ambiente` (ex: 'producao' | 'staging')

Operacoes:
1. Cria span de trace para o deploy
2. Verifica se o ultimo pipeline foi aprovado (se nao: lanca `Error('Deploy bloqueado: pipeline nao aprovado')`)
3. Simula deploy (aguarda 0ms, apenas registra)
4. Registra metrica `deploy.total` (contador) e `deploy.sucesso` ou `deploy.falha`
5. Loga o deploy
6. Retorna `{ sucesso: true, versao, ambiente, duracao: number }`

#### `dashboard()`
Retorna string formatada com estado atual:
```
=== DevTech DevOps Dashboard ===
Pipelines executados: 3
Taxa de sucesso: 66.7%
Ultimos deploys:
  - v1.0.0 -> staging (sucesso)
  - v1.1.0 -> producao (sucesso)
```

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

Antes de codar, pense:

1. **Como o `executarPipeline` sabe se o pipeline foi aprovado?** Armazene o ultimo resultado em `this.ultimoPipeline` para que `deployar` possa verificar.

2. **O trace conecta pipeline e deploy:** Se voce criar um span para o pipeline e outro para o deploy, como voce os conecta em um mesmo trace? Precisa de um traceId global?

3. **`dashboard()` e um agregador:** Ele le metricas, historico de deploys e status. Como voce estrutura `this` para que `dashboard` possa acessar tudo?

4. **`executarPipeline` nao recebe codigo real** — `codigo` e apenas um identificador. Os `testes` sao funcoes que retornam boolean. Como voce calcula "cobertura" a partir disso?

5. **Taxa de sucesso no dashboard:** Voce precisa registrar cada resultado de pipeline. Array? Contador separado para aprovados/reprovados?

---

## Tarefas para o Sprint

- [ ] Implementar `constructor` inicializando todos os subsistemas
- [ ] Implementar `executarPipeline` com trace, metricas e logs
- [ ] Implementar verificacao de "ultimo pipeline aprovado" em `deployar`
- [ ] Implementar `deployar` com trace, metricas e logs
- [ ] Implementar `dashboard` como string formatada
- [ ] Garantir que todos os testes passam com `npm test`
