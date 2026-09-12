# 05 — Balanceador de Carga

**Nível:** Sênior II
**Fase:** 13 — Sistemas Distribuidos
**Estimativa:** 2h

---

## Contexto

O servidor unico da API da DevTech esta chegando no limite: 95% de CPU, latencia de 2 segundos. A solucao e horizontal scaling: adicionar mais servidores identicos e distribuir o trafego entre eles com um load balancer.

O Tech Lead Pedro quer entender os trade-offs de cada algoritmo de balanceamento antes de configurar o NGINX. Voce foi designado para implementar e comparar os 4 algoritmos mais comuns.

---

## O que fazer

Implemente o arquivo `balanceador.js` com 4 algoritmos de balanceamento de carga.

---

## Arquivo a criar

**`balanceador.js`** na raiz deste projeto.

---

## Especificacao

### `criarBalanceador(algoritmo, servidores)`

`algoritmo`: `'round-robin'` | `'least-connections'` | `'weighted'` | `'ip-hash'`
`servidores`: `[{ id, host, peso = 1 }]`

Retorna objeto com:

#### `proximo(req = {})`
Seleciona servidor conforme algoritmo. `req.ip` disponivel para ip-hash.

#### `registrarConexao(servidorId)`
Incrementa conexoes ativas do servidor.

#### `liberarConexao(servidorId)`
Decrementa conexoes ativas (minimo 0).

#### `adicionarServidor(servidor)`
Adiciona novo servidor ao pool.

#### `removerServidor(id)`
Remove servidor do pool (graceful: nao remove se tiver conexoes ativas, ou remove e as conexoes sao redirecionadas).

#### `servidoresAtivos()`
Retorna array: `[{ id, host, conexoesAtivas, peso }]`

#### `estatisticas()`
```js
{ totalRequisicoes: number, porServidor: { [id]: number } }
```

### Algoritmos

**Round Robin:** Distribui em sequencia circular (s1 → s2 → s3 → s1 → ...).

**Least Connections:** Sempre escolhe o servidor com menos conexoes ativas no momento.

**Weighted:** Round Robin com pesos. Servidor com peso 3 recebe 3x mais requisicoes que peso 1.

**IP Hash:** `hash(req.ip) % numServidores` — mesmo IP sempre vai para o mesmo servidor (session affinity).

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

Antes de codar, pense:

1. **Round Robin precisa de estado:** Como voce sabe qual servidor e o "proximo"? Um contador de requisicoes total? Indice atual? O que acontece quando um servidor e removido?

2. **Least Connections e dinamico:** O servidor com menos conexoes muda a cada requisicao. Se dois servidores tem 0 conexoes, qual voce escolhe? (Qualquer um — desempate por indice e suficiente).

3. **Weighted Round Robin:** Como implementar? Uma abordagem: expanda o array de servidores de acordo com o peso (peso=3 aparece 3 vezes) e faca round robin normal. Outra: contador de creditos.

4. **IP Hash precisa ser deterministico:** Dado o mesmo IP, deve sempre retornar o mesmo servidor. Como voce implementa um hash simples de string em JS?

5. **`removerServidor` tem corner cases:** O que acontece com o round-robin index se o servidor removido era o "atual"? E se o servidor removido tem conexoes ativas?

---

## Tarefas para o Sprint

- [ ] Implementar estrutura base do balanceador com estado compartilhado
- [ ] Implementar Round Robin
- [ ] Implementar Least Connections
- [ ] Implementar Weighted Round Robin
- [ ] Implementar IP Hash (hash deterministico de string)
- [ ] Implementar registrarConexao, liberarConexao e estatisticas
- [ ] Implementar adicionarServidor e removerServidor
- [ ] Garantir que todos os testes passam com `npm test`
