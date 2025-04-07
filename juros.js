document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('navLinks')?.classList.toggle('active');
  });

  const parcelasForm = document.getElementById('parcelasForm');
  for (let i = 1; i <= 12; i++) {
    const label = document.createElement('label');
    label.innerText = `${i}x (%):`;
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.step = '0.01';
    input.id = `parcela_${i}`;
    parcelasForm.appendChild(label);
    parcelasForm.appendChild(input);
  }

  function salvarJuros() {
    const taxas = {
      debito: parseFloat(document.getElementById("debito").value) || 0
    };
    for (let i = 1; i <= 12; i++) {
      const valor = parseFloat(document.getElementById(`parcela_${i}`).value) || 0;
      taxas[i] = valor;
    }
    localStorage.setItem('taxasJurosParcelas', JSON.stringify(taxas));
    alert('Taxas salvas com sucesso!');
  }

  window.onload = () => {
    const taxas = JSON.parse(localStorage.getItem('taxasJurosParcelas') || '{}');
    if (taxas.debito !== undefined) {
      document.getElementById("debito").value = taxas.debito;
    }
    for (let i = 1; i <= 12; i++) {
      if (taxas[i] !== undefined) {
        document.getElementById(`parcela_${i}`).value = taxas[i];
      }
    }
  };