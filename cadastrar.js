document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('navLinks')?.classList.toggle('active');
  });

  function carregarModelos() {
    const lista = document.getElementById("listaModelos");
    lista.innerHTML = "";
    const modelos = JSON.parse(localStorage.getItem("modelosPiscina") || "[]");
    modelos.forEach((modelo, i) => {
      const item = document.createElement("li");
      item.innerHTML = `${modelo.nome} - R$ ${parseFloat(modelo.valor).toFixed(2).replace(".", ",")} 
        <button onclick="editarModelo(${i})">Editar</button> 
        <button onclick="excluirModelo(${i})">Excluir</button>`;
      lista.appendChild(item);
    });
  }

  function salvarModelo() {
    const nome = document.getElementById("nome").value;
    const valor = parseValorMonetario(document.getElementById("valor").value );
    const editIndex = parseInt(document.getElementById("editIndex").value);
    if (!nome || isNaN(valor) || valor <= 0) {
      alert("Preencha nome e valor corretamente.");
      return;
    }
    const modelos = JSON.parse(localStorage.getItem("modelosPiscina") || "[]");
    if (editIndex >= 0) {
      modelos[editIndex] = { nome, valor };
      document.getElementById("editIndex").value = -1;
    } else {
      modelos.push({ nome, valor });
    }
    localStorage.setItem("modelosPiscina", JSON.stringify(modelos));
    document.getElementById("nome").value = "";
    document.getElementById("valor").value = "";
    carregarModelos();
  }

  function editarModelo(index) {
    const modelos = JSON.parse(localStorage.getItem("modelosPiscina") || "[]");
    document.getElementById("nome").value = modelos[index].nome;
    document.getElementById("valor").value = modelos[index].valor;
    document.getElementById("editIndex").value = index;
  }

  function excluirModelo(index) {
    const modelos = JSON.parse(localStorage.getItem("modelosPiscina") || "[]");
    modelos.splice(index, 1);
    localStorage.setItem("modelosPiscina", JSON.stringify(modelos));
    carregarModelos();
  }

  carregarModelos();