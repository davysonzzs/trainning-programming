# 01 — TDD: Carrinho de Compras

**Nível:** Sênior I
**Fase:** 11 — Testes Avancados
**Estimativa:** 2h

---

## Contexto

Este projeto e diferente de todos os outros. O arquivo `carrinho.js` JA EXISTE, mas esta INCOMPLETO — todos os metodos lancam `Error('Nao implementado')`. Voce nao comeca do zero. Voce comeca dos testes.

Esta e a essencia do TDD (Test-Driven Development): os testes descrevem o comportamento esperado antes de qualquer implementacao. Eles sao a documentacao viva do sistema. Seu trabalho e fazer os testes passarem, um por vez, usando o ciclo Red → Green → Refactor.

O modulo de carrinho da DevTech precisou ser reescrito do zero apos um bug critico em producao. O Tech Lead Pedro insistiu: "Desta vez, nenhuma linha de codigo de producao entra sem teste."

---

## O que fazer

Implemente os metodos em `carrinho.js` guiado pelos testes em `test/carrinho.test.js`.

**REGRAS TDD — siga rigorosamente:**
1. Rode `npm test` — todos os testes devem falhar (Red)
2. Implemente **apenas o suficiente** para fazer **um teste** passar
3. Rode `npm test` — aquele teste deve passar (Green)
4. Refatore o codigo se necessario, mantendo tudo verde (Refactor)
5. Repita para o proximo teste

---

## Arquivo a editar

**`carrinho.js`** — ja existe com o esqueleto. Implemente os metodos.

---

## Especificacao (revelada pelos testes)

Os testes descrevem exatamente o que cada metodo deve fazer. Leia os testes antes de implementar.

Resumo do que voce vai descobrir nos testes:

- `adicionar(produto, quantidade)` — acumula quantidade se produto ja existe; lanca erro para quantidade <= 0
- `remover(produtoId)` — remove pelo id; lanca erro se nao encontrado
- `aplicarCupom(codigo, desconto)` — aplica desconto percentual; lanca erro para desconto invalido
- `calcularSubtotal()` — soma de preco × quantidade (sem desconto)
- `calcularDesconto()` — valor em reais do cupom aplicado (0 se sem cupom)
- `calcularTotal()` — subtotal - desconto
- `limpar()` — zera itens e cupom
- `quantidadeItens()` — soma total de unidades

---

## Como testar

```bash
npm install
npm test
```

Acompanhe os testes falhando e passando um a um.

---

## Dicas

Antes de codar, pense:

1. **Por que TDD primeiro e mais dificil mas vale a pena?** O que voce ganha ao ter os testes antes da implementacao?

2. **O que significa "apenas o suficiente para passar"?** Se voce pudesse fazer `calcularTotal() { return 0; }` para passar um teste, seria valido? Por quanto tempo?

3. **Como voce armazenaria os itens?** Array de `{ produto, quantidade }`? O que voce precisa saber ao adicionar um produto que ja existe?

4. **`calcularDesconto` depende de `calcularSubtotal`** — como voce evita duplicar logica? Pode uma funcao chamar a outra?

5. **Na fase Refactor:** Apos fazer os testes passarem, o que voce mudaria no codigo para tornar mais legivel? Nomes melhores? Funcoes auxiliares?

---

## Tarefas para o Sprint (ciclos TDD)

- [ ] Ciclo 1: `adicionar` basico (produto novo)
- [ ] Ciclo 2: `adicionar` acumulando quantidade (produto existente)
- [ ] Ciclo 3: `adicionar` com quantidade invalida (erro)
- [ ] Ciclo 4: `remover` produto existente
- [ ] Ciclo 5: `remover` produto inexistente (erro)
- [ ] Ciclo 6: `calcularSubtotal` com varios itens
- [ ] Ciclo 7: `aplicarCupom` e `calcularDesconto`
- [ ] Ciclo 8: `calcularTotal` com e sem cupom
- [ ] Ciclo 9: `limpar` o carrinho
- [ ] Ciclo 10: `quantidadeItens` somando unidades
