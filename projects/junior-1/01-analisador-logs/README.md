# DEVTECH SISTEMAS S.A.
## Bug Fix: Analisador de Logs do Sistema de Monitoramento

> **P1 ABERTO — Cliente Banco Meridional:** O sistema de monitoramento parou de parsear logs às 03h47. Alertas de ERROR não estão sendo disparados. Equipe de operações está cega. Precisamos do parser restaurado agora.

---
### Contexto

O sistema de monitoramento da DevTech coleta logs de dezenas de serviços e dispara alertas automáticos quando detecta ERRORs. O módulo responsável pelo parsing foi sobrescrito durante um deploy mal feito. Sem ele, os logs chegam como texto puro e ninguém sabe o que está acontecendo nos servidores.

Você é o dev de plantão. Seu trabalho é reescrever o parser de logs antes que o próximo relatório de SLA seja gerado.

**Nível:** Junior I
**Sprint:** Junior I — Strings e Regex
**Estimativa:** 1h 30m
**Prioridade:** Alta

---
### O que fazer

- [ ] Criar `logs.js`
- [ ] Implementar `extrairNivel(linha)`
- [ ] Implementar `contarPorNivel(linhas)`
- [ ] Implementar `filtrarPorNivel(linhas, nivel)`
- [ ] Implementar `extrairTimestamp(linha)`
- [ ] Implementar `resumoLogs(linhas)`
- [ ] Fazer todos os testes passarem

---
### Arquivo a criar

`logs.js`

---
### Especificação das funções

#### `extrairNivel(linha)`
Recebe uma linha de log como `"[ERROR] servidor caiu"` e extrai o nível entre colchetes.
- Retorna a string do nível: `"ERROR"`, `"INFO"`, `"WARN"`, etc.
- Retorna `null` se o formato for inválido (sem colchetes, linha vazia, etc.)
- Exemplos:
  - `"[ERROR] servidor caiu"` → `"ERROR"`
  - `"[INFO] sistema ok"` → `"INFO"`
  - `"mensagem sem nivel"` → `null`
  - `""` → `null`

#### `contarPorNivel(linhas)`
Recebe um array de strings (linhas de log) e retorna um objeto com a contagem de cada nível.
- Sempre retorna os três campos: `{ INFO: N, WARN: N, ERROR: N }`
- Linhas sem nível reconhecido são ignoradas
- Exemplo:
  - `["[INFO] ok", "[ERROR] falha", "[INFO] ok2"]` → `{ INFO: 2, WARN: 0, ERROR: 1 }`

#### `filtrarPorNivel(linhas, nivel)`
Retorna apenas as linhas do array cujo nível corresponde ao `nivel` informado.
- Comparação case-insensitive: `"error"` e `"ERROR"` filtram o mesmo conjunto
- Exemplo:
  - `filtrarPorNivel(["[INFO] ok", "[ERROR] falha"], "error")` → `["[ERROR] falha"]`

#### `extrairTimestamp(linha)`
Linha no formato `"2024-01-15 10:30:45 [INFO] mensagem"` → extrai `"2024-01-15 10:30:45"`.
- Retorna `null` se o timestamp não for encontrado
- O formato esperado é `AAAA-MM-DD HH:MM:SS` no início da linha

#### `resumoLogs(linhas)`
Retorna um objeto com:
```js
{
  total: <número total de linhas>,
  porNivel: { INFO: N, WARN: N, ERROR: N },
  erros: [<linhas que contêm nível ERROR>]
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

- Como você usa regex para capturar o conteúdo entre `[` e `]`?
- O método `.match()` retorna `null` quando não há correspondência — como você usa isso?
- Para contar por nível, como você inicializa o objeto com zeros antes de percorrer o array?
- `filtrarPorNivel` precisa comparar strings sem diferenciar maiúsculas/minúsculas — qual método de string ajuda nisso?
- `resumoLogs` pode reusar funções já implementadas — não reescreva lógica desnecessariamente.

---
### Tarefas sugeridas para o Sprint

```
node sprint.js add "01-logs: implementar extrairNivel"
node sprint.js add "01-logs: implementar contarPorNivel"
node sprint.js add "01-logs: implementar filtrarPorNivel"
node sprint.js add "01-logs: implementar extrairTimestamp"
node sprint.js add "01-logs: implementar resumoLogs"
node sprint.js add "01-logs: fazer todos os testes passarem"
```
