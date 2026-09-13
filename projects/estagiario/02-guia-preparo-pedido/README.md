# DEVTECH SISTEMAS S.A.
## Feature: Simulador de passo a passo da cozinha do restaurante parceiro

> App de delivery quer mostrar ao cliente cada etapa do preparo do pedido, em ordem.

---

### Contexto

O app de delivery parceiro pediu uma função que descreve, passo a passo e **na ordem
certa**, como um lanche é montado — pão, carne, queijo, molho. Isso é puro raciocínio
lógico: pensar numa sequência de passos antes de "codar" é a base de qualquer algoritmo,
antes mesmo de aprender variáveis chiques ou estruturas complexas.

**Nível:** Estagiário  
**Sprint:** Estagiário — Passo a Passo da Cozinha  
**Estimativa:** 0h 30m  
**Prioridade:** Baixa  
**Tópico da trilha:** Fase 1 — Fundamentos › Lógica de programação: algoritmos e pseudocódigo (2/3)

---

### O que fazer

- [ ] Criar o arquivo `sanduiche.js` na raiz deste projeto
- [ ] Implementar `montarPasso(etapa, ingrediente)`
- [ ] Implementar `montarSanduiche(ingredientes)`
- [ ] Implementar `contarPassos(ingredientes)`
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

**`montarSanduiche(ingredientes)`**
- Recebe um array de strings, ex: `['pao', 'carne', 'queijo']`
- Retorna um array de strings, uma por ingrediente, cada uma usando o formato de
  `montarPasso` — o número do passo é a posição do ingrediente na lista, começando em 1
- Ex: `montarSanduiche(['pao', 'carne'])` → `['Passo 1: adicionar pao', 'Passo 2: adicionar carne']`

**`contarPassos(ingredientes)`**
- Recebe o mesmo array de ingredientes
- Retorna quantos passos o sanduíche tem (o tamanho do array)

---

### Como testar

```bash
npm install
npm test
```

---

### Dicas (tente sozinho antes de usar)

**`montarPasso`** — Igual à concatenação do projeto anterior, só que agora um dos
valores é um número. JavaScript converte o número pra texto sozinho quando você usa `+`
com uma string do lado.

**`montarSanduiche`** — Você precisa "andar" pelo array e, pra cada ingrediente, montar
o passo correspondente. Um `for` (`for (let i = 0; i < ingredientes.length; i++)`) resolve
— o índice `i` começa em `0`, mas o passo deve começar em `1`. Guarde cada resultado num
array novo e devolva ele no final.

**`contarPassos`** — Todo array em JavaScript tem uma propriedade que já diz o tamanho
dele. Não precisa percorrer nada.

---

### Tarefas sugeridas para o Sprint

```
add Criar sanduiche.js
add Implementar montarPasso
add Implementar montarSanduiche
add Implementar contarPassos
add Passar em todos os testes
```
