function getAcessorios() {
    return JSON.parse(localStorage.getItem("acessorios") || "[]");
}

function salvarAcessorios(lista) {
    localStorage.setItem("acessorios", JSON.stringify(lista));
}

function renderTabela() {
    const tbody = document.querySelector("#tabela-acessorios tbody");
    tbody.innerHTML = "";
    const lista = getAcessorios();
    lista.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
  <td>${item.nome}</td>
  <td>R$ ${parseFloat(item.preco).toFixed(2)}</td>
  <td>${item.descricao || ""}</td>
  <td class="actions">
    <button onclick="editarAcessorio(${index})">Editar</button>
    <button onclick="excluirAcessorio(${index})">Excluir</button>
  </td>
`;
        tbody.appendChild(tr);
    });
}

function limparFormulario() {
    document.getElementById("index").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("descricao").value = "";
}

function editarAcessorio(index) {
    const acessorio = getAcessorios()[index];
    document.getElementById("index").value = index;
    document.getElementById("nome").value = acessorio.nome;
    document.getElementById("preco").value = acessorio.preco;
    document.getElementById("descricao").value = acessorio.descricao || "";
}

function excluirAcessorio(index) {
    if (!confirm("Deseja realmente excluir este acessório?")) return;
    const lista = getAcessorios();
    lista.splice(index, 1);
    salvarAcessorios(lista);
    renderTabela();
}

document.getElementById("acessorio-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const preco = parseFloat(document.getElementById("preco").value);
    const descricao = document.getElementById("descricao").value.trim();
    const index = document.getElementById("index").value;

    if (!nome || isNaN(preco)) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const lista = getAcessorios();
    const novoAcessorio = { nome, preco, descricao };

    if (index === "") {
        lista.push(novoAcessorio);
    } else {
        lista[index] = novoAcessorio;
    }

    salvarAcessorios(lista);
    limparFormulario();
    renderTabela();
});

// Renderiza ao carregar
renderTabela();