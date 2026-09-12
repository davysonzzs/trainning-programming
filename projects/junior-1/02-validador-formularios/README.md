# DEVTECH SISTEMAS S.A.
## Bug Fix: Validador de Formulários de Cadastro

> **URGENTE — QA Ana Beatriz:** O formulário de cadastro do portal cliente está aceitando emails sem "@", senhas de 3 caracteres e CPFs com letras. O banco de dados está cheio de lixo e o time de dados está furioso. Precisamos de validação server-side agora.

---
### Contexto

O portal de cadastro de clientes da DevTech foi lançado sem validação robusta no backend. O frontend tinha validações, mas elas foram removidas durante uma refatoração e ninguém percebeu. Resultado: dados inválidos estão chegando no banco há três dias.

Você precisa criar um módulo de validação que lance erros descritivos para cada campo inválido. Assim o backend pode capturar, logar e retornar mensagens claras para o usuário.

**Nível:** Junior I
**Sprint:** Junior I — Validação e Erros
**Estimativa:** 1h 30m
**Prioridade:** Alta

---
### O que fazer

- [ ] Criar `validador.js`
- [ ] Implementar `validarEmail(email)`
- [ ] Implementar `validarSenha(senha)`
- [ ] Implementar `validarCPF(cpf)`
- [ ] Implementar `validarCampos(obj, camposObrigatorios)`
- [ ] Implementar `validarTudo(dados)`
- [ ] Fazer todos os testes passarem

---
### Arquivo a criar

`validador.js`

---
### Especificação das funções

#### `validarEmail(email)`
Verifica se o email tem formato válido:
- Deve conter `@`
- Deve ter domínio após o `@` (ex: `gmail.com`)
- Não pode ter espaços
- Lança `Error('Email inválido')` se inválido
- Retorna `true` se válido
- Exemplos válidos: `"user@email.com"`, `"nome.sobrenome@empresa.com.br"`
- Exemplos inválidos: `"semArroba"`, `"com espaço@email.com"`, `"@semdominio"`, `"sem@"`, `""`

#### `validarSenha(senha)`
Verifica requisitos mínimos de segurança:
- Mínimo 8 caracteres
- Pelo menos 1 número (0-9)
- Pelo menos 1 letra maiúscula (A-Z)
- Lança `Error('Senha fraca')` se não atender
- Retorna `true` se válida

#### `validarCPF(cpf)`
Aceita dois formatos:
- Com máscara: `"123.456.789-09"` (formato `NNN.NNN.NNN-NN`)
- Sem máscara: `"12345678909"` (exatamente 11 dígitos numéricos)
- Não precisa validar dígito verificador, apenas o formato
- Lança `Error('CPF inválido')` se formato errado
- Retorna `true` se formato correto

#### `validarCampos(obj, camposObrigatorios)`
Verifica se o objeto possui todos os campos listados no array, e que nenhum seja vazio (`""`, `null`, `undefined`).
- Lança `Error('Campo obrigatório: <nome>')` para o **primeiro** campo faltando ou vazio
- Retorna `true` se todos os campos existem e têm valor
- Exemplo: `validarCampos({ nome: 'João', email: '' }, ['nome', 'email'])` → lança `Error('Campo obrigatório: email')`

#### `validarTudo(dados)`
Recebe `{ email, senha, cpf, nome }` e executa todas as validações.
- Valida que `nome` está presente (via `validarCampos`)
- Chama `validarEmail`, `validarSenha`, `validarCPF`
- Retorna `{ valido: true }` se tudo ok
- Lança o primeiro `Error` encontrado se algo falhar

---
### Como testar

```bash
npm install
npm test
```

---
### Dicas (tente sozinho antes de usar)

- Como você usa `throw new Error('mensagem')` para interromper a execução?
- Qual regex valida que uma string tem pelo menos um número? E pelo menos uma maiúscula?
- Para o CPF, você pode usar duas regex: uma para o formato com máscara e outra para apenas dígitos. Como combinar os dois testes com `||`?
- `validarCampos` precisa iterar sobre o array `camposObrigatorios` — um `for...of` ou `.find()` pode ajudar.
- Em `validarTudo`, tente usar um bloco `try/catch` simples ou deixe os erros subirem naturalmente.

---
### Tarefas sugeridas para o Sprint

```
node sprint.js add "02-validador: implementar validarEmail"
node sprint.js add "02-validador: implementar validarSenha"
node sprint.js add "02-validador: implementar validarCPF"
node sprint.js add "02-validador: implementar validarCampos"
node sprint.js add "02-validador: implementar validarTudo"
node sprint.js add "02-validador: fazer todos os testes passarem"
```
