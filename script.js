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

  if (isNaN(frete) || frete <= 0) {
    alert("Informe o valor do frete.");
    return;
  }

  const valorModelo = parseFloat(modelo.valor);
  const totalAVista = valorModelo + frete;
  const totalParcelado = (valorModelo + frete) - entrada;
  const taxas = JSON.parse(localStorage.getItem("taxasJurosParcelas") || "{}");

  let html = `<h3>Parcelamento - ${modelo.nome}</h3>`;
  let mensagem = `*Orçamento de Piscina - ${modelo.nome}*

💰 Valor à vista: R$ ${totalAVista.toFixed(2).replace(".", ",")}
📦 Entrada: R$ ${entrada.toFixed(2).replace(".", ",")}
🚚 Frete: R$ ${frete.toFixed(2).replace(".", ",")}

📆 Parcelamento:
`;

  for (let i = 1; i <= 12; i++) {
    const taxa = (taxas[i] || 0) / 100;
    const totalComJuros = totalParcelado * (1 + taxa);
    const parcela = totalComJuros / i;
    html += `<p>${i}x de R$ ${parcela.toFixed(2).replace(".", ",")} (${(taxa * 100).toFixed(1)}%) Total com Juros: ${totalComJuros.toFixed(2).replace(".", ",")}</p>`;
    mensagem += `${i}x de R$ ${parcela.toFixed(2).replace(".", ",")}. Total com Juros: ${totalComJuros.toFixed(2).replace(".", ",")}
`;
  }

  html += `<p class="valor-vista">💵 Valor à vista total: R$ ${totalAVista.toFixed(2).replace(".", ",")}</p>`;
  const linkWhats = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  html += `<p><a href="${linkWhats}" target="_blank">📲 Enviar por WhatsApp</a></p>`;
  document.getElementById("resultado").innerHTML = html;
}

