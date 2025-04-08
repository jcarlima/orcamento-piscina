function aplicarMascaraMoeda(input) {
    input.addEventListener("input", function (e) {
      let value = input.value.replace(/\D/g, "");
      value = (parseInt(value, 10) / 100).toFixed(2) + "";
      value = value.replace(".", ",");
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      input.value = value;
    });
  }

  function aplicarMascaraEmTodos() {
    const inputs = document.querySelectorAll(".dinheiro");
    inputs.forEach(input => aplicarMascaraMoeda(input));
  }

  window.addEventListener("DOMContentLoaded", aplicarMascaraEmTodos);


 function moedaMarkara(value) {
  value = value.toFixed(2).replace(".", ",")
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
 }

 function parseValorMonetario(valor) {
    return parseFloat(valor.replace(/\./g, "").replace(",", "."));
  }
  