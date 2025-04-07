document.getElementById('menuToggle')?.addEventListener('click', () => {
  document.getElementById('navLinks')?.classList.toggle('active');
});

const modelos = JSON.parse(localStorage.getItem("modelosPiscina") || "[]");
const selectModelo = document.getElementById("modelo");
modelos.forEach((m, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = `${m.nome} - R$ ${parseFloat(m.valor).toFixed(2).replace(".", ",")}`;
  selectModelo.appendChild(opt);
});

function calcularParcelas() {
  const index = parseInt(selectModelo.value);
  const modelo = modelos[index];
  const frete = parseFloat(document.getElementById("frete").value) || 0;
  const entrada = parseFloat(document.getElementById("entrada").value) || 0;
  const totalAcessorios = calcularTotalAcessorios();
  if (isNaN(frete) || frete <= 0) {
    alert("Informe o valor do frete.");
    return;
  }

  const valorModelo = parseFloat(modelo.valor);
  const totalAVista = valorModelo + frete + totalAcessorios;
  const totalParcelado = (valorModelo + frete + totalAcessorios) - entrada;
  const taxas = JSON.parse(localStorage.getItem("taxasJurosParcelas") || "{}");

  let html = `<h3>Parcelamento - ${modelo.nome}</h3>`;
  let mensagem = `*Orçamento - ${modelo.nome}*

    Valor Piscina: R$ ${valorModelo}
    Acessorios: R$ ${totalAcessorios}
🚚 Frete: R$ ${frete.toFixed(2).replace(".", ",")}
💰 Total à vista: R$ ${totalAVista.toFixed(2).replace(".", ",")}
📦 Entrada: R$ ${entrada.toFixed(2).replace(".", ",")}


📆 Parcelamento:
`;
  html += `<p class="valor-vista">💵 Valor à vista total: R$ ${totalAVista.toFixed(2).replace(".", ",")}</p>`;
  
  for (let i = 1; i <= 12; i++) {
    const taxa = (taxas[i] || 0) / 100;
    const totalComJuros = totalParcelado * (1 + taxa);
    const parcela = totalComJuros / i;
    html += `<p>${i}x de R$ ${parcela.toFixed(2).replace(".", ",")} (${(taxa * 100).toFixed(1)}%) Total com Juros: ${totalComJuros.toFixed(2).replace(".", ",")}</p>`;
    mensagem += `${i}x de R$ ${parcela.toFixed(2).replace(".", ",")}. Total com Juros: ${totalComJuros.toFixed(2).replace(".", ",")}
`;
  }


  const linkWhats = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
 // html += `<p><a href="${linkWhats}" target="_blank">📲 Enviar por WhatsApp</a></p>`;
  html += `<a href="${linkWhats}" id="btn-whatsapp" class="btn-whatsapp" target="_blank">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" class="icon" />
  Enviar por WhatsApp
</a>`
  document.getElementById("resultado").innerHTML = html;
}

function carregarAcessorios() {
  const lista = JSON.parse(localStorage.getItem("acessorios") || "[]");
  const container = document.getElementById("lista-acessorios");
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum acessório cadastrado.</p>";
    return;
  }

  lista.forEach((item, index) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `acessorio-${index}`;
    checkbox.value = index;
    checkbox.dataset.preco = item.preco;

    const label = document.createElement("label");
    label.classList.add('acessorio-item')
    label.innerHTML = `<span>${item.nome} - R$ ${parseFloat(item.preco).toFixed(2)} </span>`;

    const div = document.createElement("div");
    label.appendChild(checkbox)
    div.appendChild(label);

    container.appendChild(div);
  });
}

// Chamar ao carregar a página
window.addEventListener("DOMContentLoaded", carregarAcessorios);

function calcularTotalAcessorios() {
  const checkboxes = document.querySelectorAll("#lista-acessorios input[type=checkbox]");
  let total = 0;
  checkboxes.forEach(cb => {
    if (cb.checked) {
      total += parseFloat(cb.dataset.preco || 0);
    }
  });
  return total;
}