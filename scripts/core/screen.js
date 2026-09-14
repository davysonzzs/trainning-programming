'use strict';

// Indireção pra quebrar dependência circular: cada tela (telas/*.js)
// precisa chamar render()/goTo() depois de tratar uma tecla, mas a
// implementação real de render() precisa conhecer TODAS as telas (importa
// cada build*). Se cada tela importasse render/goTo direto do devtech.js,
// viraria um ciclo (devtech -> tela -> devtech). Em vez disso, aqui só
// existe um ponto de indireção — devtech.js registra a implementação real
// com bind() depois que tudo já foi carregado; as telas importam render()/
// goTo() daqui e nunca sabem da diferença.

let _render = () => {};
let _goTo   = () => {};

function render(...args) { return _render(...args); }
function goTo(...args)   { return _goTo(...args); }

function bind(impl) {
  _render = impl.render;
  _goTo   = impl.goTo;
}

module.exports = { render, goTo, bind };
