# DEVTECH SISTEMAS S.A.
## Bug Fix: Contadores de acesso do painel misturando valores entre páginas

> Painel interno tem um contador de visualizações por página, mas todos os contadores
> estão compartilhando o mesmo valor — cada página devia ter o seu próprio.

---

### Contexto

O dev anterior criou o contador de visualizações usando uma variável **global**, e por
isso todas as páginas do painel acabam somando no mesmo número. Você precisa criar uma
função que gera um **contador independente** pra cada página — isso é escopo de função
(e um gostinho de closure): cada contador guarda seu próprio valor, isolado dos outros.

**Nível:** Estagiário  
**Sprint:** Estagiário — Contadores do Painel  
**Estimativa:** 1h 45m  
**Prioridade:** Média  
**Tópico da trilha:** Fase 1 — Fundamentos › Funções: parâmetros, retorno e escopo (2/3)

---

### O que fazer

- [ ] Criar o arquivo `contadores.js` na raiz deste projeto
- [ ] Implementar `criarContador()`
- [ ] Implementar `somarComEscopoLocal(a, b)`
- [ ] Implementar `criarContadorComInicio(valorInicial)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`contadores.js`

---

### Especificação das funções

**`criarContador()`**
- Retorna um **objeto** com dois métodos: `{ incrementar, valorAtual }`
- `incrementar()` aumenta o contador interno em 1 e retorna o novo valor
- `valorAtual()` retorna o valor atual sem alterar nada
- Cada chamada de `criarContador()` cria um contador **novo e independente** — dois
  contadores criados separadamente não podem influenciar um no outro

**`somarComEscopoLocal(a, b)`**
- Recebe dois números e retorna a soma
- Dentro da função, crie uma variável local chamada `resultado` pra guardar a soma antes
  de retornar — isso é só pra praticar que essa variável só existe dentro da função (não
  "vaza" pra fora)

**`criarContadorComInicio(valorInicial)`**
- Igual a `criarContador()`, mas o contador começa em `valorInicial` em vez de `0`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 5 — Funções: parâmetros, retorno e escopo**
> em [`05-funcoes-parametros-retorno-escopo.md`](../../../aulas/fase-01-fundamentos-de-programacao/05-funcoes-parametros-retorno-escopo.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`criarContador`** — Dentro da função, declare uma variável (`let contador = 0`) e
retorne um objeto cujos métodos usam essa variável. Como o objeto retornado "lembra" da
variável de dentro da função que o criou, cada chamada de `criarContador()` tem sua
própria cópia — isso é o começo do conceito de **closure**, que você vai aprofundar mais
pra frente. Mesmo padrão, num exemplo genérico (um cofre que guarda saldo, não um
contador):

```js
function criarCofre(saldoInicial) {
  let saldo = saldoInicial;
  return {
    depositar(valor) { saldo += valor; },
    consultar() { return saldo; },
  };
}
const cofreA = criarCofre(100);
const cofreB = criarCofre(0);
cofreA.depositar(50);
cofreA.consultar(); // 150 — só o cofreA mudou
cofreB.consultar(); // 0   — cofreB tem seu próprio "saldo", isolado do cofreA
```

**`somarComEscopoLocal`** — É só uma soma normal, mas usando uma variável declarada
dentro da função — o ponto é perceber que essa variável não existe fora dela.

**`criarContadorComInicio`** — Praticamente igual a `criarContador`, só que a variável
interna começa com o parâmetro recebido em vez de `0`.

---

### Tarefas sugeridas para o Sprint

```
add Criar contadores.js
add Implementar criarContador
add Implementar somarComEscopoLocal
add Implementar criarContadorComInicio
add Passar em todos os testes
```
