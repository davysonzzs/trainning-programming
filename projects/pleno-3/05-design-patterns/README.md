# 05 — Design Patterns

**Nível:** Pleno III
**Fase:** 10 — Arquitetura
**Estimativa:** 2h 30m

---

## Contexto

O codebase da DevTech esta sofrendo com codigo duplicado e dificil de estender. O sistema de notificacoes tem `if/else` gigantesco para cada tipo. As configuracoes sao carregadas em multiplos lugares criando inconsistencias. O sistema de eventos tem listeners espalhados sem controle. Os algoritmos de ordenacao sao copiados e colados em tres modulos diferentes.

O Tech Lead Pedro pediu uma refatoracao usando Design Patterns classicos para tornar o codigo extensivel, testavel e com responsabilidades claras.

---

## O que fazer

Implemente o arquivo `patterns.js` com quatro Design Patterns: Factory, Singleton, Observer e Strategy.

---

## Arquivo a criar

**`patterns.js`** na raiz deste projeto.

---

## Especificacao

### Factory — `criarNotificador(tipo)`

Tipos suportados: `'email'`, `'sms'`, `'push'`

Cada notificador retornado tem metodo:
```js
enviar(destinatario, mensagem)
// retorna: { tipo, destinatario, mensagem, enviadoEm: Date }
```

Lanca `Error('Tipo de notificador desconhecido: X')` para tipos invalidos.

### Singleton — `class ConfiguracaoGlobal`

```js
static getInstance()   // retorna sempre a mesma instancia
set(chave, valor)
get(chave)
getAll()               // retorna objeto com todas as configuracoes
```

**Regra:** Nao importa quantas vezes `getInstance()` for chamado, deve retornar a MESMA instancia (mesmos dados).

### Observer — `class Publicador`

```js
assinar(evento, fn)      // registra listener para o evento
publicar(evento, dados)  // chama todos os listeners do evento com dados
cancelar(evento, fn)     // remove listener especifico
```

### Strategy — Ordenadores

```js
criarOrdenador(estrategia)
// estrategia: 'bubble' | 'selection' | 'quick'
```

Retorna objeto com:
```js
ordenar(array)  // ordena e retorna novo array (nao muta o original)
```

Implemente os 3 algoritmos:

**Bubble Sort:** Compara pares adjacentes, troca se necessario, repete.

**Selection Sort:** Encontra o minimo, move para a posicao correta, repete.

**Quick Sort:** Escolhe pivot, particiona, ordena recursivamente.

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

Antes de codar, pense:

1. **Factory:** Como voce evita o `if/else` gigantesco? Voce poderia usar um objeto/mapa de `tipo -> funcao construtora`. Como isso facilita adicionar um novo tipo `'telegram'` no futuro?

2. **Singleton:** Como voce impede que `new ConfiguracaoGlobal()` crie uma segunda instancia? A instancia precisa ser armazenada em uma variavel fora da classe. O que e variavel de modulo em Node.js?

3. **Observer:** Qual estrutura de dados voce usa para armazenar `evento -> [listeners]`? Como `cancelar` remove apenas o listener especifico sem remover outros listeners do mesmo evento?

4. **Strategy:** Por que `ordenar` nao deve mutar o array original? O que `[...array]` faz? Como voce garantiria que todos os tres algoritmos seguem o mesmo contrato?

5. **Qual a diferenca entre Factory e Strategy?** Factory cria objetos de tipos diferentes. Strategy define algoritmos intercambiaveis. Quando usar cada um?

---

## Tarefas para o Sprint

- [ ] Implementar `criarNotificador` com Factory pattern para email, sms e push
- [ ] Implementar `ConfiguracaoGlobal` com Singleton (instancia unica garantida)
- [ ] Implementar `Publicador` com assinar, publicar e cancelar
- [ ] Implementar `criarOrdenador` com Bubble Sort
- [ ] Implementar Selection Sort e adicionar ao `criarOrdenador`
- [ ] Implementar Quick Sort e adicionar ao `criarOrdenador`
- [ ] Verificar que nenhum algoritmo muta o array original
- [ ] Garantir que todos os testes passam com `npm test`
