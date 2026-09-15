function montarPasso(etapa, ingrediente) {
    return `Passo ${etapa}: adicionar ${ingrediente}`
}

function montarSanduiche(pao, recheio, molho) {
    return [
        montarPasso(1, pao),
        montarPasso(2, recheio),
        montarPasso(3, molho)
    ]
}

function resumoDoPedido(nomeCliente, pao, recheio, molho) {
    return `Pedido de ${nomeCliente}: ${pao}, ${recheio} e ${molho}`
}

module.exports = { montarPasso, montarSanduiche, resumoDoPedido }