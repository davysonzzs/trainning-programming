# DEVTECH SISTEMAS S.A.
## Feature: Simulador de passo a passo da cozinha do restaurante parceiro

> App de delivery quer mostrar ao cliente cada etapa do preparo do pedido, em ordem.

---

### Contexto

O app de delivery parceiro pediu uma função que descreve, passo a passo e **na ordem
certa**, como um lanche é montado — pão, recheio, molho, sempre nessa ordem (o cardápio
desse restaurante só tem lanche de 3 camadas). Isso é puro raciocínio lógico: pensar
numa sequência de passos antes de "codar" é a base de qualquer algoritmo, antes mesmo de
aprender variáveis chiques ou estruturas complexas.

**Nível:** Estagiário  
**Sprint:** Estagiário — Passo a Passo da Cozinha  
**Estimativa:** 1h  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Lógica de programação: algoritmos e pseudocódigo (2/3)

---

### O que fazer

- [ ] Criar o arquivo `sanduiche.js` na raiz deste projeto
- [ ] Implementar `montarPasso(etapa, ingrediente)`
- [ ] Implementar `montarSanduiche(pao, recheio, molho)`
- [ ] Implementar `resumoDoPedido(nomeCliente, pao, recheio, molho)`
- [ ] Fazer todos os testes passarem (`npm test`)

---

### Arquivo a criar

`sanduiche.js`

---

### Especificação das funções

**`montarPasso(etapa, ingrediente)`**
- `etapa` é um número (1, 2, 3...), `ingrediente` é uma string
- Retorna: `'Passo ' + etapa + ': adicionar ' + ingrediente`
- Ex: `montarPasso(1, 'pao')` → `'Passo 1: adicionar pao'`

**`montarSanduiche(pao, recheio, molho)`**
- Recebe os três ingredientes, sempre nessa ordem (pão é sempre o passo 1, recheio o
  passo 2, molho o passo 3)
- Retorna um array com os três passos, cada um usando `montarPasso`
- Ex: `montarSanduiche('pao', 'carne', 'maionese')` →
  `['Passo 1: adicionar pao', 'Passo 2: adicionar carne', 'Passo 3: adicionar maionese']`

**`resumoDoPedido(nomeCliente, pao, recheio, molho)`**
- Retorna: `'Pedido de ' + nomeCliente + ': ' + pao + ', ' + recheio + ' e ' + molho`
- Ex: `resumoDoPedido('Ana', 'pao', 'carne', 'maionese')` →
  `'Pedido de Ana: pao, carne e maionese'`

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

> 📘 Ainda sem noção de por onde começar? Revise o **Tópico 1 — Lógica de programação: algoritmos e pseudocódigo**
> em [`01-logica-algoritmos-pseudocodigo.md`](../../../aulas/fase-01-fundamentos-de-programacao/01-logica-algoritmos-pseudocodigo.md) — tem explicação, exemplo e um
> exercício pra treinar antes de tentar aqui. Também dá pra ler dentro
> do simulador, tecla `[5]` (Trilha de Estudos).

**`montarPasso`** — Igual à concatenação do projeto anterior, só que agora um dos
valores é um número. JavaScript converte o número pra texto sozinho quando você usa `+`
com uma string do lado.

**`montarSanduiche`** — Como o sanduíche desse restaurante é sempre de 3 camadas, na
ordem certa, você já sabe de antemão que vai chamar `montarPasso` exatamente 3 vezes —
uma pra cada ingrediente recebido, com o número do passo fixo (`1`, `2` e `3`). Monte o
array na mão, um item por chamada:

```js
function montarSanduiche(pao, recheio, molho) {
  return [
    montarPasso(1, pao),
    montarPasso(2, recheio),
    montarPasso(3, molho),
  ];
}
```
Repare que não precisou de nenhum jeito especial de "repetir" — são só 3 linhas na ordem
certa. Quando o número de passos não for sempre o mesmo (imagine um sanduíche com uma
lista de ingredientes de tamanho variável), aí sim vai precisar de uma estrutura de
repetição — isso é o Tópico 4, mais pra frente na trilha.

**`resumoDoPedido`** — Mesma ideia de concatenar várias partes numa string só, só que
juntando mais pedaços dessa vez. Cuidado com os espaços e a vírgula entre as palavras.

---

### Tarefas sugeridas para o Sprint

```
add Criar sanduiche.js
add Implementar montarPasso
add Implementar montarSanduiche
add Implementar resumoDoPedido
add Passar em todos os testes
```
