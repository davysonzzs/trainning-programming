// eslint.config.js — DEVTECH SISTEMAS S.A.
// Config compartilhada, na raiz do repo, pra não precisar instalar o
// ESLint dentro de cada um dos 30+ projetos. O "concluir" do sprint.js
// roda `npx eslint <pasta-do-projeto>` a partir daqui.
//
// Regras escolhidas pra pegar bug de verdade (var não definida, código
// morto, etc.) — não é sobre estilo/formatação, então nada de regra tipo
// aspas/ponto-e-vírgula que só geraria ruído pra quem tá aprendendo.
'use strict';

module.exports = [
  {
    ignores: ['**/node_modules/**', '**/test/**', '**/*.test.js'],
  },
  {
    files: ['projects/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly', module: 'writable', exports: 'writable',
        __dirname: 'readonly', __filename: 'readonly', process: 'readonly',
        console: 'readonly', Buffer: 'readonly', global: 'readonly',
      },
    },
    rules: {
      'no-undef':             'error',  // usar variavel/funcao que nao existe
      'no-unused-vars':       'warn',   // declarou e nunca usou
      'no-unreachable':       'error',  // codigo depois de um return/throw
      'no-dupe-keys':         'error',  // chave repetida no mesmo objeto
      'no-dupe-args':         'error',  // parametro repetido na funcao
      'no-const-assign':      'error',  // reatribuir uma const
      'no-self-compare':      'warn',   // x === x
      'no-fallthrough':       'warn',   // case sem break/return por engano
      'no-dupe-else-if':      'warn',
      'no-compare-neg-zero':  'warn',
      'use-isnan':            'error',  // comparar com NaN direto nunca funciona
      'valid-typeof':         'error',
      'no-func-assign':       'error',
      'eqeqeq':                ['warn', 'smart'], // == vs === (exceto null-check)
    },
  },
];
