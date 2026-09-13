# Tutorial — Primeiro Projeto

Bem-vindo à **DevTech Sistemas S.A.**

Você acabou de ser contratado como Estagiário. Seu primeiro projeto está esperando.
Este tutorial mostra o fluxo completo do início ao fim.

---

## 1. Inicie o sistema

```bash
node devtech.js
```

Uma tela de boot animada carrega o sistema corporativo.
Você chega ao menu principal com 5 opções navegáveis por ↑↓ + Enter.

---

## 2. Registre seu nome

No menu, acesse **[3] Ficha do Desenvolvedor**.
Digite `name Seu Nome` e pressione Enter.
Pressione Esc para voltar ao menu.

---

## 3. Veja o projeto disponível

No menu, acesse **[4] Quadro de Projetos**.
Você verá os projetos do nível Estagiário, todos como `○ PENDENTE`.
O primeiro é `01-calculadora-financeira`.

Leia o README antes de começar:
```bash
cat projects/estagiario/01-calculadora-financeira/README.md
```

O README tem:
- **Contexto** — por que o arquivo precisa ser criado
- **O que fazer** — lista de funções para implementar
- **Especificação** — como cada função deve se comportar
- **Dicas** — perguntas guiadas (use se travar, antes do Copilot)

---

## 4. Configure a sprint

No menu, acesse **[2] Painel de Sprint**.

```
> projeto estagiario/01-calculadora-financeira
> sprint "Estagiário — Calculadora Financeira"
> estimativa 1.5
```

Adicione as tarefas do README (seção "Tarefas sugeridas"):
```
> add Criar financeiro.js
> add Implementar calcularJuros
> add Implementar calcularDesconto
> add Implementar calcularParcelas
> add Implementar calcularImposto
> add Implementar resumoCompra
```

---

## 5. Trabalhe no projeto

Marque a primeira tarefa como em andamento:
```
> start 1
```

Em outro terminal, crie o arquivo de implementação:
```bash
# Na pasta do projeto
cd projects/estagiario/01-calculadora-financeira
npm install
npm test    # vai falhar — é esperado, o arquivo ainda não existe
```

Crie `financeiro.js` e implemente as funções uma por uma.
A cada função implementada, rode `npm test` para ver o progresso.

Quando uma tarefa estiver pronta, volte ao painel e marque como concluída:
```
> done 1
> start 2
```

Cada `done` dá **+25 XP**.

---

## 6. Timer e sprint

O timer mostra o tempo ativo real da sprint:

| Estado | Exibição |
|---|---|
| Normal (< 80%) | `▶ 45m / 1.5h  (faltam 45m)` |
| Atenção (80%+) | `⚡ 1h 15m / 1.5h  (faltam 15m)` |
| Estourada | `⚠ ESTOURADA: 1h 35m / 1.5h  (+5m)` |

Se precisar pausar e voltar depois:
```
> pausar
```
Feche o terminal. O tempo salvo fica registrado.
Na próxima vez que abrir, o timer continua de onde parou.

---

## 7. Entregue o projeto

Quando todos os testes passarem (`npm test` → all passed):

```
> concluir
```

O sistema vai:
1. Rodar `npm test` automaticamente
2. Se passou: marcar como `[ENTREGUE]` e notificar os NPCs
3. Se a sprint estourou: aplicar penalidade de XP na entrega

---

## 8. Consequências de atraso

| Situação | Penalidade |
|---|---|
| Entrega no prazo | Sem penalidade |
| Sprint estourada 100–200% | -10 XP na entrega |
| Sprint estourada 200%+ | -20 XP + Aviso de desempenho |

Avisos ficam registrados na sua **Ficha do Desenvolvedor**.
O objetivo é ir ajustando as estimativas com a prática.

---

## 9. Peça ajuda se travar

Antes de travar por muito tempo, use o **GitHub Copilot Chat** como QA.
Ele está configurado para agir como **QA Ana** — explica conceitos e aponta
o que está errado, mas **nunca escreve o código por você**.

Exemplos de perguntas úteis:
- "O que significa esse erro do Jest?"
- "Como funciona a fórmula de juros compostos?"
- "Meu reduce está retornando undefined, o que pode ser?"

---

## 10. Faça os 6 projetos

```
01 → 02 → 03 → 04 → 05 → 06
```

O projeto `06-relatorio-integrador` usa conceitos de todos os anteriores.
Quando todos estiverem `[ENTREGUE]`, você terá XP suficiente para o próximo nível.

---

## Dicas

**Sprint estourou?**
Normal na primeira vez. Anote quanto levou. O objetivo é calibrar estimativas
com a prática até caber no tempo estimado.

**Esc sempre volta ao menu.**
Você não precisa fechar e reabrir nada. Navegue entre as telas livremente.

**Ctrl+C salva automaticamente.**
A sprint é pausada e o tempo ativo é preservado.

---

Boa sorte, Dev. O time está esperando sua primeira entrega.
