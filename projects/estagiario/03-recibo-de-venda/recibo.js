function calcularSubtotal(precoUnitario, quantidade) {
    return precoUnitario * quantidade
}

function calcularDesconto(subtotal, percentualDesconto) {
    if (percentualDesconto === 0) {
        return 0
    }

    return parseInt(subtotal * percentualDesconto) / 100
}

function calcularTotal(subtotal, desconto) {
    return subtotal - desconto
}

function gerarRecibo(precoUnitario, quantidade, percentualDesconto) {
    const subtotal = calcularSubtotal(precoUnitario, quantidade)
    const desconto = calcularDesconto(subtotal, percentualDesconto)
    const total = subtotal - desconto
    
    return `Subtotal: R$ ${subtotal} | Desconto: R$ ${desconto} | Total: R$ ${total}`
}

module.exports = { calcularSubtotal, calcularDesconto, calcularTotal, gerarRecibo }