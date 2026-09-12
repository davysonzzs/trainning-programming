# 02 — Sistema JWT

**Nível:** Pleno III
**Fase:** 9 — Segurança
**Estimativa:** 2h

---

## Contexto

A API da DevTech usa sessoes armazenadas em banco de dados. Com o crescimento, o time de infra quer escalar horizontalmente (multiplos servidores), mas sessoes em banco criam um gargalo: todos os servidores precisam acessar o mesmo banco para validar cada requisicao.

O Tech Lead Pedro quer migrar para JWT (JSON Web Tokens) — tokens stateless que carregam suas proprias informacoes e podem ser verificados por qualquer servidor sem consulta ao banco. Voce foi designado para implementar o mecanismo em JS puro (sem bibliotecas como `jsonwebtoken`).

---

## O que fazer

Implemente o arquivo `jwt.js` com encode/decode de JWT usando Base64 e uma assinatura HMAC simplificada (deterministica, sem crypto real).

---

## Arquivo a criar

**`jwt.js`** na raiz deste projeto.

---

## Especificacao

### `codificarBase64(str)`
Codifica string para Base64 usando `Buffer.from(str).toString('base64')`.

### `decodificarBase64(str)`
Decodifica Base64 para string usando `Buffer.from(str, 'base64').toString('utf8')`.

### `assinar(payload, segredo)`
Retorna JWT no formato: `<header_b64>.<payload_b64>.<assinatura>`

- Header fixo: `{ "alg": "DevHS256", "typ": "JWT" }`
- Payload: objeto JS convertido para JSON
- Assinatura: hash determinístico de `"<header_b64>.<payload_b64>" + segredo`

Algoritmo de assinatura sugerido: some os charCodes de cada caractere, aplique operacoes matematicas, converta para hex string.

### `verificar(token, segredo)`
- Separa o token em 3 partes por `.`
- Recalcula a assinatura e compara com a do token
- Se assinatura invalida: lanca `Error('Token invalido')`
- Decodifica o payload
- Se `payload.exp` existe e `payload.exp < Date.now() / 1000`: lanca `Error('Token expirado')`
- Retorna o payload decodificado

### `criarToken(dados, segredo, expiracaoSeg = 3600)`
Cria token com campos extras:
- `iat` (issued at): `Math.floor(Date.now() / 1000)`
- `exp` (expiration): `iat + expiracaoSeg`

```js
criarToken({ userId: 1, papel: 'admin' }, 'segredo')
// retorna JWT com exp em 1 hora
```

### `extrairPayload(token)`
Extrai e retorna o payload SEM verificar assinatura (util para debugging e inspecao).

---

## Como testar

```bash
npm install
npm test
```

Os testes verificam:
- Encode/decode Base64 sao operacoes inversas
- `assinar` gera token com 3 partes separadas por `.`
- `verificar` retorna payload correto para token valido
- `verificar` lanca erro para assinatura invalida
- `verificar` lanca erro para token expirado
- `criarToken` inclui campos `iat` e `exp` no payload
- `extrairPayload` funciona sem verificar assinatura

---

## Dicas

Antes de codar, pense:

1. **Por que JWT e "stateless"?** Quais informacoes ficam no token? O servidor precisa de banco para validar?

2. **Como a assinatura garante integridade?** Se alguem mudar o payload (ex: trocar `papel: 'usuario'` para `papel: 'admin'`), o que acontece na verificacao?

3. **Base64 e criptografia?** Qualquer um pode decodificar o payload de um JWT. O que o JWT garante que criptografia NAO garante, e vice-versa?

4. **O que e `iat` e `exp`?** Por que tokens com expiracao sao importantes? O que acontece se um JWT for roubado?

5. **`extrairPayload` sem verificar assinatura** — quando isso seria util em producao real?

---

## Tarefas para o Sprint

- [ ] Implementar `codificarBase64` e `decodificarBase64`
- [ ] Implementar a funcao de assinatura deterministica
- [ ] Implementar `assinar(payload, segredo)` gerando JWT completo
- [ ] Implementar `verificar(token, segredo)` com validacoes de assinatura e expiracao
- [ ] Implementar `criarToken(dados, segredo, expiracaoSeg)`
- [ ] Implementar `extrairPayload(token)`
- [ ] Garantir que todos os testes passam com `npm test`
