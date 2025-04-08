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
  const frete = parseValorMonetario(document.getElementById("frete").value) || 0;
  const entrada = parseValorMonetario(document.getElementById("entrada").value) || 0;
  const totalAcessorios = calcularTotalAcessorios();
  const desconto = parseValorMonetario(document.getElementById("desconto").value) || 0;

  if (isNaN(frete) || frete <= 0) {
    alert("Informe o valor do frete.");
    return;
  }

  const valorModelo = modelo.valor;
  const totalAVista = valorModelo + frete + totalAcessorios - desconto;
  const totalParcelado = totalAVista - entrada;
  const taxas = JSON.parse(localStorage.getItem("taxasJurosParcelas") || "{}");

  let html = `<h3>Parcelamento - ${modelo.nome}</h3>`;
  let mensagem = `*Orçamento - ${modelo.nome}*

    Valor Piscina: R$ ${moedaMarkara(valorModelo)}
    Acessorios: R$ ${moedaMarkara(totalAcessorios)}
    Desconto: R$ ${moedaMarkara(desconto)}
🚚 Frete: R$ ${moedaMarkara(frete)}
💰 Total à vista: R$ ${moedaMarkara(totalAVista)}
📦 Entrada: R$ ${moedaMarkara(entrada)}

📆 Parcelamento:
`;
  html += `<p class="valor-vista">💵 Valor à vista: R$ ${moedaMarkara(totalAVista)}</p>`;

  for (let i = 1; i <= 12; i++) {
    const taxa = (taxas[i] || 0) / 100;
    const totalComJuros = totalParcelado * (1 + taxa);
    const parcela = totalComJuros / i;
    html += `<p>${i}x de R$ ${moedaMarkara(parcela)} = ${moedaMarkara(totalComJuros)}</p>`;
    mensagem += `${i}x de R$ ${moedaMarkara(parcela)} = ${moedaMarkara(totalComJuros)}
`;
  }


  const linkWhats = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;

  document.getElementById("resultado").innerHTML = html;
  document.getElementById("botoes").innerHTML = `
    <a href="${linkWhats}" id="btn-whatsapp" class="btn-acao" target="_blank">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" class="btn-icon" />
          Enviar por WhatsApp
    </a>
    <a class="btn-acao" onclick="gerarPDF()">
    <img src="logopdf.webp" alt="PDF" class="btn-icon" />
    Baixar Orçamento em PDF</a>`;
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

function gerarPDF() {
  const element = document.querySelector('.orcamento-resultado');

  if (!element) {
    alert("Resumo do orçamento não encontrado!");
    return;
  }

  const options = {
    margin: 5,
    filename: 'orcamento-piscina.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 1.5 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(options).from(element).save();
}