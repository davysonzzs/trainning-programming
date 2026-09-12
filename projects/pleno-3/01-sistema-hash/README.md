# 01 — Sistema de Hash de Senhas

**Nível:** Pleno III
**Fase:** 9 — Segurança
**Estimativa:** 2h

---

## Contexto

A auditoria de segurança da DevTech Sistemas S.A. descobriu que o banco de dados armazena senhas em texto puro. O relatório foi severo: qualquer vazamento de dados expõe todos os usuários imediatamente. O Tech Lead Pedro designou você para implementar um sistema de hash de senhas antes que o incidente seja escalado para a diretoria.

Você não pode usar bibliotecas externas (o ambiente de produção tem restrições). Precisa implementar o mecanismo algoritmicamente em JS puro, seguindo o mesmo conceito do bcrypt: salt aleatório + múltiplas rodadas de transformação.

---

## O que fazer

Implemente o arquivo `hash.js` com um sistema de hash de senhas que:

- Gera um salt aleatório para cada senha
- Aplica múltiplas rodadas de transformação (work factor)
- Produz um hash no formato `$devhash$<rounds>$<salt><hash>`
- Permite verificar senhas sem armazenar a original

---

## Arquivo a criar

**`hash.js`** na raiz deste projeto.

---

## Especificacao

### `gerarSalt(tamanho = 16)`
Gera uma string aleatória de `tamanho` caracteres alfanuméricos (letras maiúsculas, minúsculas e dígitos).

```js
gerarSalt()      // ex: "aB3xK9mZpQ1rL7nY"
gerarSalt(8)     // ex: "xK9mZpQ1"
```

### `transformar(texto, rounds)`
Funcao deterministica: mesma entrada + mesmo rounds = mesmo resultado sempre.

Algoritmo sugerido:
1. Converta cada caractere para seu charCode
2. Para cada round, aplique uma operacao matematica (ex: `(charCode * 31 + i) % 256` onde `i` e o indice do round)
3. Converta o array de numeros resultante para hex string

```js
transformar('abc', 1)   // sempre retorna a mesma string hex
transformar('abc', 10)  // sempre retorna a mesma string hex (diferente da anterior)
```

### `hash(senha, rounds = 10)`
Retorna string no formato: `$devhash$<rounds>$<salt><hashHex>`

```js
hash('minhasenha')       // "$devhash$10$aB3xK9mZpQ1rL7nY<hex64chars...>"
hash('minhasenha', 5)    // "$devhash$5$..."
```

### `comparar(senha, hashArmazenado)`
Extrai rounds e salt do hash armazenado, aplica a mesma transformacao sobre `salt + senha`, compara com o hash extraido. Retorna boolean.

```js
const h = hash('minha123')
comparar('minha123', h)   // true
comparar('errada',   h)   // false
```

---

## Como testar

```bash
npm install
npm test
```

Os testes verificam:
- `gerarSalt` gera strings do tamanho correto e com chars validos
- `gerarSalt` gera valores diferentes a cada chamada (aleatorio)
- `transformar` e deterministica (mesma entrada = mesmo resultado)
- `transformar` produz resultados diferentes para rounds diferentes
- `hash` retorna string no formato correto
- `hash` com mesma senha gera hashes diferentes (salt aleatorio)
- `comparar` retorna true para senha correta
- `comparar` retorna false para senha errada
- `comparar` funciona com diferentes valores de rounds

---

## Dicas

Antes de codar, pense:

1. **Como o bcrypt funciona de verdade?** Por que ele e mais seguro que MD5/SHA? O que o "work factor" (rounds) adiciona?

2. **Por que o salt e necessario?** O que sao "rainbow tables"? Como o salt impede esse ataque?

3. **Como voce extrairia rounds e salt de `"$devhash$10$aB3xK..."`?** Qual metodo de string voce usaria para separar as partes?

4. **Por que `transformar` precisa ser deterministica?** O que aconteceria se ela fosse aleatoria?

5. **O formato `$devhash$10$<salt><hash>` tem um problema:** como voce sabe onde o salt termina e o hash comeca? Como voce vai resolver isso na hora de comparar?

---

## Tarefas para o Sprint

- [ ] Implementar `gerarSalt(tamanho)` com chars alfanumericos
- [ ] Implementar `transformar(texto, rounds)` de forma deterministica
- [ ] Implementar `hash(senha, rounds)` gerando salt + aplicando transformar
- [ ] Implementar `comparar(senha, hashArmazenado)` parseando o formato e verificando
- [ ] Garantir que todos os testes passam com `npm test`
- [ ] Responder: por que nao usamos `Math.random()` para o salt em producao real?
