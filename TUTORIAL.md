# Tutorial — Seu Primeiro Projeto na DevTech

Vamos do zero até entregar o projeto `01-calculadora-financeira`.
Siga cada passo na ordem.

---

## Passo 1 — Registre seu nome

```bash
node dev.js --name "Seu Nome"
```

Abra `node dev.js` para ver sua ficha. Você está em **Estagiário**, XP 0.

---

## Passo 2 — Leia o projeto

Abra `projects/estagiario/01-calculadora-financeira/README.md`.

Leia o cenário, o que precisa implementar e a especificação de cada função.
Não pule essa etapa — o README é o seu "ticket" de trabalho.

---

## Passo 3 — Abra o sprint

```bash
node sprint.js
```

Configure a sprint para este projeto:

```
> projeto estagiario/01-calculadora-financeira
> sprint "Estágio — Calculadora Financeira"
> estimativa 1.5
```

O timer começa. A tela mostra o projeto ativo e o tempo decorrido.

---

## Passo 4 — Adicione as tarefas

Baseado no README, adicione as tarefas ao backlog:

```
> add Criar financeiro.js
> add Implementar calcularJuros
> add Implementar calcularDesconto e calcularParcelas
> add Implementar calcularImposto
> add Implementar resumoCompra
> add Passar em todos os testes
```

---

## Passo 5 — Comece a trabalhar

Inicie a primeira tarefa no sprint:

```
> start 1
```

Abra um segundo terminal e vá até a pasta do projeto:

```bash
cd projects/estagiario/01-calculadora-financeira
npm install
```

Rode os testes para ver o que está falhando:

```bash
npm test
```

Você vai ver erros de `Cannot find module '../financeiro'` — esperado. O arquivo não existe ainda.

---

## Passo 6 — Implemente

Crie o arquivo `financeiro.js` dentro de `projects/estagiario/01-calculadora-financeira/`:

```js
function calcularJuros(valor, taxa, meses) {
  // sua implementação aqui
}

function calcularDesconto(valor, percentual) {
  // sua implementação aqui
}

// ... demais funções ...

module.exports = {
  calcularJuros,
  calcularDesconto,
  calcularParcelas,
  calcularImposto,
  resumoCompra,
};
```

Rode `npm test` após cada função implementada para ver o progresso.

---

## Passo 7 — Acompanhe no sprint

Conforme for concluindo partes, marque no sprint:

```
> done 1
> start 2
```

Cada `done` dá **+25 XP**. Veja o XP subir no header do painel.

---

## Passo 8 — Todos os testes passando?

```bash
npm test
# PASS test/financeiro.test.js
# Tests: 15 passed, 15 total
```

Volte ao sprint e conclua as tarefas restantes:

```
> done 5
> done 6
```

---

## Passo 9 — Entregue o projeto

```
> concluir
```

O time reage. O projeto vira `[ENTREGUE]` no painel de projetos.

```bash
node projetos.js
```

---

## Passo 10 — Veja sua evolução

```bash
node dev.js
```

Você vai ver o XP acumulado e o contador de projetos atualizado.

---

## Dicas

**Travou numa função?**
Use o **GitHub Copilot Chat** como seu QA. Ele está configurado neste repositório
para agir como a QA Ana — explica conceitos e aponta o que está errado,
mas **nunca escreve o código por você**.

Exemplos de perguntas úteis:
- "O que significa esse erro do Jest?"
- "Como funciona juros composto mês a mês?"
- "Meu loop está percorrendo o array certo?"

Se ele tentar te dar o código pronto, diga: *"Não escreve código, só me explica."*

**Sprint estourou?**
Sem problema na primeira vez. Anote quanto tempo levou.
O objetivo é ir reduzindo com a prática até caber no estimado.

**Ordem dos projetos**
Faça na ordem: 01 → 02 → 03 → 04 → 05 → 06.
O 06 é o projeto final e usa conceitos de todos os anteriores.

---

Boa sorte, Dev. O time está esperando sua primeira entrega.
