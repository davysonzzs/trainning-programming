# 05 — Roteador

**Nível:** Junior III
**Sprint:** Junior III — Roteador
**Estimativa:** 2h

---

## Contexto

O React Router permite mapear URLs para componentes: `/usuario/:id` → `<PerfilUsuario>`. No simulador CLI da DevTech, o equivalente é mapear **comandos** a handlers: `usuario/42` → função que busca usuário 42. O módulo de navegação do dashboard precisa de um roteador que suporte parâmetros dinâmicos e middlewares (como logging e autenticação).

---

## O que fazer

Crie o arquivo `roteador.js` exportando a classe `Roteador`.

---

## Arquivo a criar

```
roteador.js
```

---

## Especificação

### Classe `Roteador`

**Constructor:** `constructor()`
- `rotas = Map()` — mapeia padrões de caminho para handlers
- `middlewares = []` — array de funções middleware

| Método | Comportamento |
|--------|--------------|
| `rota(caminho, handler)` | Registra handler para o padrão. Caminho pode ter parâmetros: `/usuario/:id` ou `/item/:categoria/:id` |
| `use(middleware)` | Registra middleware com assinatura `(contexto, proximo) => ...` |
| `navegar(caminho, dados = {})` | Encontra rota compatível com o caminho, extrai params, cria contexto, executa middlewares em sequência e chama handler. Retorna resultado do handler |
| `listarRotas()` | Retorna array com todos os padrões de caminho registrados |

### Contexto passado ao handler e middlewares

```js
{
  caminho: '/usuario/42',   // caminho real navegado
  params: { id: '42' },    // parâmetros extraídos
  dados: {},                // dados extras passados ao navegar()
}
```

### Middlewares

Funcionam em cadeia — cada middleware recebe `(contexto, proximo)` e deve chamar `proximo()` para continuar. Se não chamar `proximo()`, a navegação para.

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- Para fazer matching de `/usuario/:id` com `/usuario/42`: converta o padrão em regex substituindo `:param` por `([^/]+)`. Capture os nomes dos parâmetros antes de criar a regex
- Para extrair os valores: use `regex.exec(caminho)` e mapeie os grupos capturados para os nomes dos parâmetros
- Middlewares em cadeia: crie um índice `i = 0` e uma função `proximo()` que incrementa `i` e chama o próximo middleware. Quando `i >= middlewares.length`, chama o handler
- Lançar erro se nenhuma rota compatível for encontrada: `throw new Error('Rota não encontrada: ' + caminho)`
- Por que middlewares? Permitem adicionar logging, autenticação, validação sem misturar com a lógica do handler

---

## Tarefas para o Sprint

- [ ] Criar `roteador.js` com a classe `Roteador`
- [ ] Implementar `rota` para registrar handlers com suporte a parâmetros dinâmicos
- [ ] Implementar matching de rota com extração de parâmetros
- [ ] Implementar `use` para registrar middlewares
- [ ] Implementar `navegar` com execução de middlewares em cadeia
- [ ] Implementar `listarRotas`
- [ ] Lançar erro para rota não encontrada
- [ ] Rodar `npm test` e garantir que todos os testes passam
