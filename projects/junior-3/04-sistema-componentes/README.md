# 04 — Sistema de Componentes

**Nível:** Junior III
**Sprint:** Junior III — Sistema de Componentes
**Estimativa:** 1h 30m

---

## Contexto

No React, componentes são funções que recebem `props` e retornam JSX. Como o simulador da DevTech é 100% terminal, componentes retornam **strings** em vez de HTML. O sistema de relatórios CLI precisa de componentes reutilizáveis para gerar outputs formatados — uma tabela de métricas, uma lista de alertas, textos em destaque.

Este projeto implementa o padrão de componentes do React em JS puro, com o terminal como "tela".

---

## O que fazer

Crie o arquivo `componentes.js` exportando todas as funções especificadas abaixo.

---

## Arquivo a criar

```
componentes.js
```

---

## Especificação

### `criarComponente(renderFn)`

Retorna uma função que recebe `props` e chama `renderFn(props)`.

### `Texto({ conteudo, negrito = false })`

- Se `negrito` for `false`: retorna `conteudo` como string
- Se `negrito` for `true`: retorna `**conteudo**`

### `Lista({ itens, prefixo = '-' })`

Retorna string com cada item em uma linha, prefixado:
```
- Item 1
- Item 2
- Item 3
```

### `Tabela({ cabecalhos, linhas })`

Retorna string formatada com separador `|`:
```
Nome | Idade | Cidade
Ana | 25 | SP
Bruno | 30 | RJ
```
(cabeçalhos na primeira linha, dados nas demais)

### `compor(...componentes)`

Recebe funções de componente e um objeto de props compartilhadas (último argumento). Renderiza cada componente com as mesmas props e retorna tudo separado por `\n`.

**Assinatura sugerida:** `compor(comp1, comp2, ..., props)`

### `renderizarSe(condicao, componente, props)`

- Se `condicao` for truthy: retorna `componente(props)`
- Se falsy: retorna string vazia `''`

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- Componentes são apenas funções — `Texto` é uma função que recebe props e retorna string
- `criarComponente` parece trivial mas estabelece o padrão: toda função de componente tem a mesma "forma"
- Para `Lista`, use `itens.map(item => \`\${prefixo} \${item}\`).join('\n')`
- Para `Tabela`, junte cabeçalhos com ` | ` e cada linha de dados com ` | `, depois junte as linhas com `\n`
- `compor` pode receber qualquer número de componentes — use rest parameters e `arguments` ou separe o último argumento como props
- Por que componentes retornam string em vez de DOM? A abstração é a mesma — o "renderizador" (terminal vs browser) é que muda

---

## Tarefas para o Sprint

- [ ] Criar `componentes.js` com todas as funções
- [ ] Implementar `criarComponente`
- [ ] Implementar `Texto` com suporte a negrito
- [ ] Implementar `Lista` com prefixo configurável
- [ ] Implementar `Tabela` com cabeçalhos e linhas
- [ ] Implementar `compor` com props compartilhadas
- [ ] Implementar `renderizarSe`
- [ ] Rodar `npm test` e garantir que todos os testes passam
