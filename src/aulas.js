// aulas.js — DEVTECH SISTEMAS S.A. — Trilha de Estudos
const readline = require('readline');

// ── Dados ─────────────────────────────────────────────────────────────────────

const FASES = [
  {
    num: 1, nivel: 'Estagiário',
    titulo: 'Fundamentos de Programação',
    topicos: [
      'Lógica de programação: algoritmos e pseudocódigo',
      'Variáveis, tipos de dados e operadores',
      'Estruturas condicionais (if, else, switch)',
      'Estruturas de repetição (for, while, do-while)',
      'Funções: parâmetros, retorno e escopo',
      'Arrays: criação, iteração e métodos essenciais',
      'Objetos: propriedades, métodos e referências',
      'Recursão e casos base',
      'Algoritmos de ordenação (bubble sort, selection sort)',
      'Algoritmos de busca (linear e binária)',
    ],
  },
  {
    num: 2, nivel: 'Trainee',
    titulo: 'JavaScript Moderno (ES6+)',
    topicos: [
      'Arrow functions e diferenças com function',
      'Destructuring de arrays e objetos',
      'Spread e rest operators',
      'Template literals e strings avançadas',
      'Módulos: import e export',
      'Promises: criação, then e catch',
      'Async/await e tratamento de erros assíncronos',
      'Classes, herança e encapsulamento em JavaScript',
      'Closures, escopo léxico e hoisting',
      'Event Loop, call stack e microtasks',
      'Manipulação de erros: try, catch, throw, Error',
      'Iteradores, generators e Symbol',
    ],
  },
  {
    num: 3, nivel: 'Junior I',
    titulo: 'Ferramentas do Desenvolvedor',
    topicos: [
      'Terminal: navegação, comandos essenciais e scripts shell',
      'Git: init, add, commit, push e pull',
      'Git: branches, merge e resolução de conflitos',
      'Git: rebase, cherry-pick e boas práticas de commit',
      'npm: instalar, criar package.json e scripts',
      'Debugging: breakpoints, DevTools e Node inspector',
      'Testes unitários com Jest: estrutura e primeiros testes',
      'Testes: mocks, spies e cobertura de código',
    ],
  },
  {
    num: 4, nivel: 'Junior I',
    titulo: 'Frontend: HTML e CSS',
    topicos: [
      'HTML semântico: estrutura, tags e acessibilidade',
      'CSS: seletores, especificidade e cascata',
      'CSS: Box model, display e posicionamento',
      'Flexbox: alinhamento e distribuição',
      'CSS Grid: layout bidimensional',
      'Design responsivo e media queries',
      'Animações e transições CSS',
      'Variáveis CSS e temas',
    ],
  },
  {
    num: 5, nivel: 'Junior II',
    titulo: 'Frontend: JavaScript no Browser',
    topicos: [
      'DOM: seleção e manipulação de elementos',
      'Eventos: addEventListener, propagação e delegação',
      'Formulários: validação, submit e FormData',
      'Fetch API: requisições GET, POST e tratamento de erros',
      'LocalStorage, SessionStorage e Cookies',
      'Web APIs: Intersection Observer, Resize Observer',
      'Performance no browser: reflow, repaint e otimização',
    ],
  },
  {
    num: 6, nivel: 'Junior II / III',
    titulo: 'React',
    topicos: [
      'React: conceitos, JSX e primeiro componente',
      'Props: passagem de dados e tipos',
      'State com useState e re-renderização',
      'Efeitos colaterais com useEffect',
      'Renderização condicional e listas com key',
      'Formulários controlados em React',
      'Componentização e composição de UI',
      'useContext: estado global simples',
      'useReducer: gerenciamento de estado complexo',
      'useMemo, useCallback e otimização de performance',
      'Custom hooks: criação e reutilização',
      'React Router: rotas, parâmetros e navegação',
      'Gerenciamento de estado com Zustand',
      'Testes de componentes com Testing Library',
    ],
  },
  {
    num: 7, nivel: 'Pleno I',
    titulo: 'Node.js e Backend Fundamentals',
    topicos: [
      'Node.js: módulos nativos, fs, path e events',
      'HTTP: protocolo, métodos, status codes e headers',
      'Criando um servidor HTTP com Node puro',
      'Express.js: rotas, middlewares e request/response',
      'REST API: design, nomenclatura e boas práticas',
      'Validação de dados com Zod ou Joi',
      'Tratamento global de erros em APIs',
      'Upload de arquivos com Multer',
      'Variáveis de ambiente com dotenv',
      'CORS e configuração de segurança básica',
    ],
  },
  {
    num: 8, nivel: 'Pleno II',
    titulo: 'Banco de Dados',
    topicos: [
      'SQL: fundamentos, SELECT, INSERT, UPDATE, DELETE',
      'SQL: JOINs, subqueries e aggregations',
      'PostgreSQL: instalação, configuração e psql',
      'ORM com Prisma: schema, migrations e queries',
      'Relacionamentos: one-to-many e many-to-many com Prisma',
      'Transações e integridade de dados',
      'Índices e otimização de queries',
      'MongoDB: documentos, coleções e operações CRUD',
      'Mongoose: schemas, models e validações',
      'Redis: cache, expiração e filas simples',
    ],
  },
  {
    num: 9, nivel: 'Pleno III',
    titulo: 'Autenticação e Segurança',
    topicos: [
      'Autenticação: sessões vs tokens',
      'JWT: geração, validação e refresh tokens',
      'Bcrypt: hash de senhas e comparação',
      'OAuth2 e login social (Google, GitHub)',
      'OWASP Top 10: principais vulnerabilidades web',
      'Proteção contra XSS e injeção de código',
      'SQL Injection: como funciona e como prevenir',
      'Rate limiting e proteção contra força bruta',
      'HTTPS e certificados SSL/TLS',
    ],
  },
  {
    num: 10, nivel: 'Pleno III',
    titulo: 'Arquitetura e Boas Práticas',
    topicos: [
      'Clean Code: nomes, funções e comentários',
      'SOLID: os 5 princípios com exemplos em JavaScript',
      'Design Patterns: Factory, Singleton, Observer e Strategy',
      'MVC: separação de responsabilidades',
      'Arquitetura em camadas: controllers, services e repositories',
      'Clean Architecture: entities, use cases e adapters',
      'CQRS: separação de leitura e escrita',
      'API versioning e evolução de contratos',
      'Documentação de API com Swagger/OpenAPI',
    ],
  },
  {
    num: 11, nivel: 'Sênior I',
    titulo: 'Testes Avançados',
    topicos: [
      'Pirâmide de testes: unitários, integração e e2e',
      'Testes de integração com banco de dados real',
      'TDD: Red, Green, Refactor na prática',
      'Testes e2e com Playwright ou Cypress',
      'Testes de carga e stress com k6',
      'Contract testing com Pact',
    ],
  },
  {
    num: 12, nivel: 'Sênior I',
    titulo: 'DevOps e Infraestrutura',
    topicos: [
      'Docker: imagens, containers e Dockerfile',
      'Docker Compose: multi-container e volumes',
      'CI/CD: pipelines com GitHub Actions',
      'Deploy: Railway, Render ou VPS com PM2',
      'Nginx: proxy reverso e configuração básica',
      'Monitoramento com logs estruturados (Winston/Pino)',
      'Observabilidade: métricas, traces e alertas',
    ],
  },
  {
    num: 13, nivel: 'Sênior II',
    titulo: 'Sistemas Distribuídos e Escalabilidade',
    topicos: [
      'Filas de mensagem com BullMQ e Redis',
      'WebSockets com Socket.io: tempo real',
      'Microservices: conceitos, trade-offs e comunicação',
      'API Gateway e service discovery',
      'Event-driven architecture',
      'Caching avançado: estratégias e invalidação',
      'CDN, load balancer e escalabilidade horizontal',
      'Database sharding e replicação',
    ],
  },
  {
    num: 14, nivel: 'Sênior III',
    titulo: 'Liderança Técnica',
    topicos: [
      'System Design: como projetar sistemas escaláveis',
      'Decisões de arquitetura: trade-offs e documentação (ADR)',
      'Code Review: como dar e receber feedback técnico',
      'Mentoria: como ensinar e desenvolver outros devs',
      'Estimativas de prazo e planejamento técnico',
      'Débito técnico: identificação, priorização e pagamento',
      'Comunicação técnica: docs, RFCs e apresentações',
      'Segurança em nível de sistema e compliance',
    ],
  },
];

// ── Layout ─────────────────────────────────────────────────────────────────────

const LINE = '═'.repeat(74);
const DIV  = '─'.repeat(74);
const W    = 42;

function pad(str, len) {
  return str.length >= len ? str.slice(0, len) : str + ' '.repeat(len - str.length);
}

// ── Telas ─────────────────────────────────────────────────────────────────────

function renderIndice() {
  console.clear();
  console.log('');
  console.log(LINE);
  console.log('  DEVTECH SISTEMAS S.A.                           Trilha de Estudos');
  console.log(LINE);

  for (const f of FASES) {
    const num    = `FASE ${f.num}`.padEnd(7);
    const titulo = pad(f.titulo, W);
    console.log(`  ${num}  ${titulo}  [${f.nivel}]`);
  }

  console.log(LINE);
  console.log('  fase <numero>  para ver os topicos  |  [Ctrl+C] para sair');
  console.log('');
}

function renderFase(num) {
  const fase = FASES.find(f => f.num === num);
  if (!fase) return renderIndice();

  console.clear();
  console.log('');
  console.log(LINE);
  console.log(`  FASE ${fase.num} — ${fase.titulo}`);
  console.log(`  Nivel: ${fase.nivel}`);
  console.log(DIV);

  for (const t of fase.topicos) {
    console.log(`  • ${t}`);
  }

  console.log(LINE);
  console.log('  fase <numero>  |  voltar  |  [Ctrl+C] para sair');
  console.log('');
}

// ── Loop ───────────────────────────────────────────────────────────────────────

let telaAtual = 'indice';

renderIndice();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.on('SIGINT', () => {
  console.log('\n\n  Saindo...\n');
  process.exit(0);
});

function prompt() {
  rl.question('  > ', (input) => {
    const parts = input.trim().toLowerCase().split(/\s+/);
    const cmd   = parts[0];
    const arg   = parts[1];

    if (cmd === 'fase' && arg) {
      const num = parseInt(arg);
      if (num >= 1 && num <= 14) {
        telaAtual = `fase-${num}`;
        renderFase(num);
      } else {
        renderIndice();
      }
    } else if (cmd === 'voltar' || cmd === '') {
      telaAtual = 'indice';
      renderIndice();
    } else {
      telaAtual === 'indice' ? renderIndice() : renderFase(parseInt(telaAtual.split('-')[1]));
    }

    prompt();
  });
}

prompt();
