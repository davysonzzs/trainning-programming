# 04 — Validador de Schema

**Nível:** Pleno I
**Sprint:** Pleno I — Node.js + API REST Patterns
**Estimativa:** 2h

---

## Contexto

A API da DevTech estava recebendo dados inválidos e causando erros em produção. O Tech Lead decidiu criar uma camada de validação declarativa em JS puro, inspirada em bibliotecas como Zod e Joi, mas sem dependências externas.

## O que fazer

Implemente validadores declarativos em `schema.js`. Cada função de tipo retorna um validator — uma função `(valor) => { valido, erros, valor }`. Componha-os com `object()` e use `validar()` como entry point.

## Arquivo a criar

`schema.js` na raiz deste projeto.

## Especificação

### Validators de tipo

Cada função retorna um validator `(valor) => { valido: boolean, erros: string[], valor: any }`.

**`string(opts = {})`**
- `opts.required` — falha se undefined/null/vazio
- `opts.minLength` — falha se comprimento < minLength
- `opts.maxLength` — falha se comprimento > maxLength
- `opts.pattern` — falha se RegExp não bate
- `opts.transform: 'trim'` — aplica trim antes de validar

**`number(opts = {})`**
- `opts.required` — falha se undefined/null
- `opts.min` — falha se valor < min
- `opts.max` — falha se valor > max
- `opts.integer` — falha se não for inteiro

**`boolean(opts = {})`**
- `opts.required` — falha se undefined/null

**`array(itemValidator, opts = {})`**
- `opts.required` — falha se undefined/null
- `opts.minLength` — tamanho mínimo do array
- `opts.maxLength` — tamanho máximo do array
- Valida cada item com `itemValidator`

**`object(shape)`**
- `shape` — objeto `{ campo: validator }`
- Retorna `{ valido, erros: { campo: [msgs] }, valor }`

**`validar(schema, dados)`**
- Aplica o schema (criado com `object()`) nos dados
- Retorna `{ valido, erros, valor }`

## Como testar

```bash
npm install
npm test
```

## Dicas

- Os validators são funções puras — recebem um valor e retornam o resultado.
- `object()` itera sobre o shape, chama cada validator com o campo correspondente dos dados, e agrega os erros.
- Para campos opcionais (sem `required`), undefined deve passar na validação.
- `transform: 'trim'` deve aplicar `.trim()` antes de qualquer outra validação.

## Tarefas

- [ ] Implementar `string(opts)` com required, minLength, maxLength, pattern, transform
- [ ] Implementar `number(opts)` com required, min, max, integer
- [ ] Implementar `boolean(opts)` com required
- [ ] Implementar `array(itemValidator, opts)` com required, minLength, maxLength
- [ ] Implementar `object(shape)` que compõe validators
- [ ] Implementar `validar(schema, dados)` como entry point
- [ ] Exportar todas as funções
- [ ] Passar nos testes com `npm test`
