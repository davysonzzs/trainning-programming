// legado.js — modulo de desconto por nivel de cliente
// Escrito faz tempo, ninguem mexe. Cuidado.

function calcularDesconto(nivel, valor) {
  if (nivel === 'bronze') {
    if (valor >= 100) {
      return valor * 0.05;
    } else {
      return 0;
    }
  }
  if (nivel === 'prata') {
    if (valor >= 100) {
      return valor * 0.10;
    } else if (valor >= 50) {
      return valor * 0.05;
    } else {
      return 0;
    }
  }
  if (nivel === 'ouro') {
    if (valor >= 100) {
      return valor * 0.10;
    } else if (valor >= 50) {
      return valor * 0.10;
    } else {
      return valor * 0.05;
    }
  }
  return 0;
}

function valorComDesconto(nivel, valor) {
  return valor - calcularDesconto(nivel, valor);
}

module.exports = { calcularDesconto, valorComDesconto };
