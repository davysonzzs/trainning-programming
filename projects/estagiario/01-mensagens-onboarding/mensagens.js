function ola() {
    return 'Ola, mundo!'
}

function apresentar(nome) {
    return `Ola, meu nome e ${nome}`
}

function boasVindas(nome, cargo) {
    return `Bem-vindo(a), ${nome}! Seu cargo e: ${cargo}`
}

module.exports = { ola, apresentar, boasVindas }