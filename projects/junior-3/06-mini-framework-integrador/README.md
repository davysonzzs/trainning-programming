# 06 — Mini Framework Integrador

**Nível:** Junior III
**Sprint:** Junior III — Mini Framework Integrador
**Estimativa:** 2h 30m

---

## Contexto

Este é o projeto final do nível Junior III. Você vai construir um mini framework que integra todos os padrões aprendidos no nível:

- **Estado** (como Redux/Zustand): store centralizado com dispatch e subscribe
- **Injeção de Dependência** (como React Context): container para serviços
- **Roteador** (como React Router): navegação com parâmetros
- **Componentes** (como React): handlers que recebem contexto e retornam strings

O framework completo permite criar uma "aplicação" CLI estruturada com separação de responsabilidades clara. Este é o padrão que frameworks reais como Next.js implementam internamente.

---

## O que fazer

Crie o arquivo `framework.js` exportando a classe `App`. Implemente os padrões necessários diretamente neste arquivo (store, container e roteador em classes auxiliares internas ou replicando a lógica).

---

## Arquivo a criar

```
framework.js
```

---

## Especificação

### Classe `App`

**Constructor:** `constructor(config = {})`
- Inicializa container de DI interno
- Inicializa store com reducer fornecido em `config.reducer` (ou reducer identidade por padrão) e estado inicial `config.estadoInicial || {}`
- Inicializa roteador interno

| Método | Comportamento |
|--------|--------------|
| `registrar(nome, factory)` | Registra serviço no container de DI |
| `rota(caminho, handler)` | Registra rota. Handler recebe `(contexto, state, dispatch)` |
| `dispatch(action)` | Dispatcha action para o store |
| `getState()` | Retorna estado global atual |
| `navegar(caminho, dados = {})` | Navega para a rota. Handler é chamado com `(contexto, this.getState(), this.dispatch.bind(this))` |
| `subscribe(fn)` | Assina mudanças de estado. Retorna `unsubscribe` |

---

## Como testar

```bash
npm install
npm test
```

---

## Dicas

- Implemente versões simplificadas do Store, Container e Roteador diretamente no `framework.js` — você já sabe como construí-los
- O handler de rota recebe três argumentos: `(contexto, state, dispatch)`. Isso permite que o handler leia o estado e dispache actions — padrão idêntico ao `connect` do Redux com React
- O reducer identidade (padrão) simplesmente retorna o estado sem modificar: `(estado, action) => estado`
- `config.reducer` permite que quem usa o framework injete seu próprio reducer — padrão de inversão de controle
- Por que integrar tudo em uma classe `App`? Simplifica o setup — em vez de instanciar e conectar tudo manualmente, o framework faz isso por você

---

## Tarefas para o Sprint

- [ ] Criar `framework.js` com a classe `App`
- [ ] Implementar store interno com `dispatch`, `getState` e `subscribe`
- [ ] Implementar container de DI interno com `registrar` e `resolve`
- [ ] Implementar roteador interno com suporte a parâmetros
- [ ] Implementar `rota` passando `(contexto, state, dispatch)` ao handler
- [ ] Implementar `navegar` invocando middlewares e handler
- [ ] Garantir que mudanças de estado via `dispatch` notificam subscribers
- [ ] Rodar `npm test` e garantir que todos os testes passam
