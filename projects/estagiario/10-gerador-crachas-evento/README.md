# DEVTECH SISTEMAS S.A.
## Feature: Painel de boas-vindas do evento anual da DevTech

> Recepção do evento anual da empresa precisa gerar os números dos crachás dos
> convidados e preencher o telão de entrada com uma mensagem repetida.

---

### Contexto

Esse é o seu primeiro contato com **loop** (estrutura de repetição) — o motivo dele
existir é simples: até agora, toda vez que você precisava repetir uma ação, escrevia a
linha de novo à mão (como fez em `02-guia-preparo-pedido`, chamando `montarPasso` três
vezes seguidas). Isso funciona quando o número de vezes é pequeno e fixo, mas quebra na
hora em que esse número só é conhecido na hora de rodar o programa — tipo "gerar um
crachá pra cada convidado confirmado", sem saber de antemão quantos serão.

Um loop repete um bloco de código um número de vezes **já conhecido** — é o caso mais
simples de `for`, antes de complicar com contadores, somas ou condições dentro dele.

**Nível:** Estagiário  
**Sprint:** Estagiário — Painel do Evento  
**Estimativa:** 1h  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Estruturas de repetição (for, while, do-while) (1/5)

---

### O que fazer

- [ ] Criar o arquivo `evento.js` na raiz deste projeto
- [ ] Implementar `numerosDosCrachas(quantidade)`
- [ ] Implementar `repetirMensagem(mensagem, vezes)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`evento.js`

---

### Especificação das funções

**`numerosDosCrachas(quantidade)`**
- Retorna um array com os números de `1` até `quantidade`, nessa ordem
- Ex: `numerosDosCrachas(4)` → `[1, 2, 3, 4]`
- `quantidade` igual a `0` ou negativa retorna `[]`

**`repetirMensagem(mensagem, vezes)`**
- Retorna um array com `mensagem` repetida `vezes` vezes (a mesma string, copiada)
- Ex: `repetirMensagem('Bem-vindo!', 3)` → `['Bem-vindo!', 'Bem-vindo!', 'Bem-vindo!']`
- `vezes` igual a `0` ou negativo retorna `[]`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 4 — Estruturas de repetição (for, while, do-while)**
> em [`04-estruturas-de-repeticao.md`](../../../aulas/fase-01-fundamentos-de-programacao/04-estruturas-de-repeticao.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**A estrutura do `for`**, pra quem nunca escreveu uma:

```js
for (let i = 0; i < 5; i++) {
  // esse bloco roda 5 vezes: com i valendo 0, 1, 2, 3 e depois 4
}
```
`let i = 0` cria o contador. `i < 5` é a condição — enquanto for verdadeira, o loop
continua. `i++` soma 1 ao contador a cada volta. Quando `i < 5` vira falsa (`i` chega a
`5`), o loop para sozinho.

**`numerosDosCrachas`** — Comece um array vazio (`const numeros = []`) antes do loop, e
a cada volta empurre o número atual nele com `.push(...)`. Como o primeiro crachá é `1`,
não `0`, ajuste o ponto de partida (ou o que você guarda a cada volta). Exemplo genérico
do mesmo padrão (numerando fileiras de um estacionamento, não é o seu caso):

```js
function numerarFileiras(quantidade) {
  const fileiras = [];
  for (let i = 1; i <= quantidade; i++) {
    fileiras.push(i);
  }
  return fileiras; // numerarFileiras(3) → [1, 2, 3]
}
```

**`repetirMensagem`** — Muito parecido, só que em vez de guardar o número da volta, você
guarda sempre o mesmo `mensagem` recebido — o loop aqui não muda o que é guardado, só
quantas vezes.

---

### Tarefas sugeridas para o Sprint

```
add Criar evento.js
add Implementar numerosDosCrachas
add Implementar repetirMensagem
add Passar em todos os testes
```
