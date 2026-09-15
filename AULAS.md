# Trilha: Engenheiro de Software Fullstack JavaScript
# Estagiário → Sênior III

> Isto é documentação de verdade, não um índice de assuntos — dá pra ler direto
> aqui (neste arquivo, `AULAS.md`, na raiz do repositório) em qualquer editor ou
> no GitHub, sem precisar abrir o simulador.

**Como usar:**
- Travou num projeto e a seção "Dicas" do README não foi suficiente? Confira a
  linha **"Tópico da trilha"** no topo do README dele e leia o tópico
  correspondente *antes* de chamar o GitHub Copilot.
- Dentro do simulador, **[5] Trilha de Estudos** mostra este mesmo conteúdo,
  com a fase que você está cursando marcada com `▶` e as já concluídas com `✓`.
- Cada fase corresponde a um nível de carreira (ver tabela no `README.md`) — a
  Fase 1 inteira é o nível Estagiário.
- A Fase 1 tem um documento por tópico, dentro de `aulas/fase-01-.../` — cada
  um com explicação, exemplo, um segundo exemplo num cenário parecido com o
  dos projetos da DevTech, exercício e erros comuns. As fases 2 em diante ainda
  são só a lista de assuntos (os projetos desses níveis ainda não foram
  construídos — ver `docs/plan.md`) e ganham o mesmo tratamento assim que os
  projetos daquele nível forem criados.

---

## FASE 1 — Fundamentos de Programação

Nível: **Estagiário**. Do "Hello World" até ordenação e busca — os 10 tópicos que os
33 projetos de `projects/estagiario/` praticam. Cada um é um documento próprio, em
[`aulas/fase-01-fundamentos-de-programacao/`](aulas/fase-01-fundamentos-de-programacao/README.md):

1. [Lógica de programação: algoritmos e pseudocódigo](aulas/fase-01-fundamentos-de-programacao/01-logica-algoritmos-pseudocodigo.md)
2. [Variáveis, tipos de dados e operadores](aulas/fase-01-fundamentos-de-programacao/02-variaveis-tipos-operadores.md)
3. [Estruturas condicionais (if, else, switch)](aulas/fase-01-fundamentos-de-programacao/03-estruturas-condicionais.md)
4. [Estruturas de repetição (for, while, do-while)](aulas/fase-01-fundamentos-de-programacao/04-estruturas-de-repeticao.md)
5. [Funções: parâmetros, retorno e escopo](aulas/fase-01-fundamentos-de-programacao/05-funcoes-parametros-retorno-escopo.md)
6. [Arrays: criação, iteração e métodos essenciais](aulas/fase-01-fundamentos-de-programacao/06-arrays.md)
7. [Objetos: propriedades, métodos e referências](aulas/fase-01-fundamentos-de-programacao/07-objetos.md)
8. [Recursão e casos base](aulas/fase-01-fundamentos-de-programacao/08-recursao.md)
9. [Algoritmos de ordenação (bubble sort, selection sort)](aulas/fase-01-fundamentos-de-programacao/09-algoritmos-de-ordenacao.md)
10. [Algoritmos de busca (linear e binária)](aulas/fase-01-fundamentos-de-programacao/10-algoritmos-de-busca.md)

---

## FASE 2 — JavaScript Moderno (ES6+)

- Arrow functions e diferenças com function
- Destructuring de arrays e objetos
- Spread e rest operators
- Template literals e strings avançadas
- Módulos: import e export
- Promises: criação, then e catch
- Async/await e tratamento de erros assíncronos
- Closures, escopo léxico e hoisting
- Event Loop, call stack e microtasks
- Manipulação de erros: try, catch, throw, Error
- Iteradores, generators e Symbol
- Programação Orientada a Objetos em JS: os 4 pilares (abstração, encapsulamento,
  herança, polimorfismo) aplicados com `class`
- Herança com `extends`/`super`, campos privados (`#campo`), getters/setters
- Composição vs. herança: quando montar objetos a partir de peças em vez de estender uma
  classe pai

---

## FASE 3 — Ferramentas do Desenvolvedor

- Terminal: navegação, comandos essenciais e scripts shell
- Git: init, add, commit, push e pull
- Git: branches, merge e resolução de conflitos
- Git: rebase, cherry-pick e boas práticas de commit
- npm: instalar, criar package.json e scripts
- Debugging: breakpoints, DevTools e Node inspector
- Testes unitários com Jest: estrutura e primeiros testes
- Testes: mocks, spies e cobertura de código
- Qualidade de software: o que é um bug, como escrever um bom relatório de bug e
  mentalidade de QA
- Planejamento de carreira: currículo e portfólio de dev júnior — o que um time técnico
  avalia num candidato
- GitHub e LinkedIn como vitrine profissional: perfil, README de projeto, o que destacar
- Entrevista técnica júnior: o que costuma cair e como praticar

---

## FASE 4 — Frontend: HTML e CSS

- HTML semântico: estrutura, tags e acessibilidade
- CSS: seletores, especificidade e cascata
- CSS: Box model, display e posicionamento
- Flexbox: alinhamento e distribuição
- CSS Grid: layout bidimensional
- Design responsivo e media queries
- Animações e transições CSS
- Variáveis CSS e temas
- Fundamentos de UX: heurísticas de usabilidade e fluxo do usuário
- Fundamentos de UI: hierarquia visual, tipografia, cor e contraste
- Prototipação: wireframes e mockups antes de codar (Figma ou papel)
- Design systems: tokens, componentes reutilizáveis e consistência visual

---

## FASE 5 — Frontend: JavaScript no Browser

- DOM: seleção e manipulação de elementos
- Eventos: addEventListener, propagação e delegação
- Formulários: validação, submit e FormData
- Fetch API: requisições GET, POST e tratamento de erros
- LocalStorage, SessionStorage e Cookies
- Web APIs: Intersection Observer, Resize Observer
- Performance no browser: reflow, repaint e otimização

---

## FASE 6 — React

- React: conceitos, JSX e primeiro componente
- Props: passagem de dados e tipos
- State com useState e re-renderização
- Efeitos colaterais com useEffect
- Renderização condicional e listas com key
- Formulários controlados em React
- Componentização e composição de UI
- useContext: estado global simples
- useReducer: gerenciamento de estado complexo
- useMemo, useCallback e otimização de performance
- Custom hooks: criação e reutilização
- React Router: rotas, parâmetros e navegação
- Gerenciamento de estado com Zustand
- Testes de componentes com Testing Library

---

## FASE 7 — Node.js e Backend Fundamentals

- Node.js: módulos nativos, fs, path e events
- HTTP: protocolo, métodos, status codes e headers
- Criando um servidor HTTP com Node puro
- Express.js: rotas, middlewares e request/response
- REST API: design, nomenclatura e boas práticas
- Validação de dados com Zod ou Joi
- Tratamento global de erros em APIs
- Upload de arquivos com Multer
- Variáveis de ambiente com dotenv
- CORS e configuração de segurança básica

---

## FASE 8 — Banco de Dados

- Modelagem de dados: Diagrama Entidade-Relacionamento (DER) e normalização
- SQL: fundamentos, SELECT, INSERT, UPDATE, DELETE
- SQL: JOINs, subqueries e aggregations
- PostgreSQL: instalação, configuração e psql
- ORM com Prisma: schema, migrations e queries
- Relacionamentos: one-to-many e many-to-many com Prisma
- Transações e integridade de dados
- Índices e otimização de queries
- MongoDB: documentos, coleções e operações CRUD
- Mongoose: schemas, models e validações
- Redis: cache, expiração e filas simples

---

## FASE 9 — Autenticação e Segurança

- Autenticação: sessões vs tokens
- JWT: geração, validação e refresh tokens
- Bcrypt: hash de senhas e comparação
- OAuth2 e login social (Google, GitHub)
- OWASP Top 10: principais vulnerabilidades web
- Proteção contra XSS e injeção de código
- SQL Injection: como funciona e como prevenir
- Rate limiting e proteção contra força bruta
- HTTPS e certificados SSL/TLS

---

## FASE 10 — Arquitetura e Boas Práticas

- Levantamento de requisitos: user stories, critérios de aceite e escopo
- Modelagem com UML (visão geral): diagrama de classes e diagrama de sequência
- Clean Code: nomes, funções e comentários
- SOLID: os 5 princípios com exemplos em JavaScript
- Design Patterns: Factory, Singleton, Observer e Strategy
- MVC: separação de responsabilidades
- Arquitetura em camadas: controllers, services e repositories
- Clean Architecture: entities, use cases e adapters
- CQRS: separação de leitura e escrita
- API versioning e evolução de contratos
- Documentação de API com Swagger/OpenAPI

---

## FASE 11 — Testes Avançados

- Pirâmide de testes: unitários, integração e e2e
- Testes de integração com banco de dados real
- TDD: Red, Green, Refactor na prática
- Testes e2e com Playwright ou Cypress
- Testes de carga e stress com k6
- Contract testing com Pact

---

## FASE 12 — DevOps e Infraestrutura

- Docker: imagens, containers e Dockerfile
- Docker Compose: multi-container e volumes
- CI/CD: pipelines com GitHub Actions
- Deploy: Railway, Render ou VPS com PM2
- Nginx: proxy reverso e configuração básica
- Monitoramento com logs estruturados (Winston/Pino)
- Observabilidade: métricas, traces e alertas

---

## FASE 13 — Sistemas Distribuídos e Escalabilidade

- Filas de mensagem com BullMQ e Redis
- WebSockets com Socket.io: tempo real
- Microservices: conceitos, trade-offs e comunicação
- API Gateway e service discovery
- Event-driven architecture
- Caching avançado: estratégias e invalidação
- CDN, load balancer e escalabilidade horizontal
- Database sharding e replicação

---

## FASE 14 — Liderança Técnica (Sênior)

- System Design: como projetar sistemas escaláveis
- Decisões de arquitetura: trade-offs e documentação (ADR)
- Code Review: como dar e receber feedback técnico
- Mentoria: como ensinar e desenvolver outros devs
- Estimativas de prazo e planejamento técnico
- Débito técnico: identificação, priorização e pagamento
- Comunicação técnica: docs, RFCs e apresentações
- Segurança em nível de sistema e compliance
- Mentalidade de produto: MVP, validação de hipóteses e feedback de usuário
- Métricas de produto para devs: funil, retenção, LTV/CAC (visão geral)
- Do projeto pessoal ao primeiro usuário: lançando um side project / startup enxuta
