function calcularJuros(valor, taxa, meses) {
    return valor * (1 + taxa / 100) ^ meses
}

function calcularDesconto(valor, percentual) {
    return valor - (valor * percentual / 100)
}

module.exports = { calcularJuros, calcularDesconto }