# DEVTECH SISTEMAS S.A.
## Feature: Validador de dados do formulário de cadastro

> RH está recebendo cadastros de funcionários com dados de tipos misturados (idade como
> texto, nome vazio) e o sistema quebra ao processar. Precisa validar antes de salvar.

---

### Contexto

O formulário de cadastro de novos funcionários aceita qualquer coisa digitada, e isso está
causando erro no sistema de folha de pagamento. Você vai criar funções que checam o **tipo**
de cada dado recebido antes de aceitar o cadastro — é aqui que entram os tipos de dados
(`string`, `number`, `boolean`) e os operadores de comparação.

**Nível:** Estagiário  
**Sprint:** Estagiário — Validador de Cadastro  
**Estimativa:** 1h  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Variáveis, tipos de dados e operadores (1/3)

---

### O que fazer

- [ ] Criar o arquivo `cadastro.js` na raiz deste projeto
- [ ] Implementar `tipoDe(valor)`
- [ ] Implementar `nomeValido(nome)`
- [ ] Implementar `idadeValida(idade)`
- [ ] Implementar `cadastroValido(nome, idade, ativo)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`cadastro.js`

---

### Especificação das funções

**`tipoDe(valor)`**
- Retorna o tipo do valor recebido como string: `'string'`, `'number'`, `'boolean'`,
  `'object'`, `'undefined'` etc — use o operador que o próprio JavaScript oferece pra isso

**`nomeValido(nome)`**
- Retorna `true` se `nome` for do tipo `string` **e** não estiver vazio (`''`)
- Qualquer outro caso (número, `undefined`, string vazia) retorna `false`

**`idadeValida(idade)`**
- Retorna `true` se `idade` for do tipo `number`, for maior ou igual a `18` e menor que `120`
- Qualquer outro caso retorna `false` — inclusive se vier como texto (`'25'` não vale)

**`cadastroValido(nome, idade, ativo)`**
- Retorna `true` somente se: `nome` passar em `nomeValido`, `idade` passar em
  `idadeValida`, e `ativo` for exatamente do tipo `boolean`
- Caso contrário retorna `false`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 2 — Variáveis, tipos de dados e operadores**
> em [`02-variaveis-tipos-operadores.md`](../../../aulas/fase-01-fundamentos-de-programacao/02-variaveis-tipos-operadores.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`tipoDe`** — Existe uma palavra-chave do JavaScript que devolve o tipo de qualquer
valor como string, sem precisar escrever nenhum `if`.

**`nomeValido`** — Você precisa combinar duas condições com o operador lógico "E"
(`&&`) — as duas do lado precisam ser `true` pro resultado ser `true`. Exemplo
genérico (checando se um produto pode ser vendido, não é o seu caso, é só pra
ver o `&&` funcionando):

```js
function podeVender(preco, estoque) {
  return preco > 0 && estoque > 0;
}
podeVender(10, 5);  // true  — as duas condições passaram
podeVender(10, 0);  // false — a segunda falhou
```
Lembre que comparar tipo usa o resultado de `tipoDe` (ou o mesmo operador direto).

**`idadeValida`** — Cuidado: `'25' >= 18` funciona em JavaScript porque ele converte o
texto pra número sozinho — mas a regra aqui é mais rígida, o tipo **também** precisa ser
`number`, senão `'25'` teria que ser aceito e não pode.

**`cadastroValido`** — Reaproveite as três funções anteriores. Você já validou cada
parte, agora é só combinar os resultados.

---

### Tarefas sugeridas para o Sprint

```
add Criar cadastro.js
add Implementar tipoDe
add Implementar nomeValido
add Implementar idadeValida
add Implementar cadastroValido
add Passar em todos os testes
```
