const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function toggleTransporte() {
  const transporte = document.getElementById('transporte').value;
  document.getElementById('carroFields').style.display = transporte === 'carro' ? 'block' : 'none';
  document.getElementById('publicoFields').style.display = transporte === 'publico' ? 'block' : 'none';
}

function toggleRefeicao() {
  const incluirRefeicao = document.getElementById('incluirRefeicao').checked;
  document.getElementById('refeicaoInput').style.display = incluirRefeicao ? 'block' : 'none';
}

function toggleTipoMaoObra() {
  const tipo = document.getElementById('tipoMaoObra').value;
  document.getElementById('maoObraM2').style.display = (tipo === 'm2') ? 'block' : 'none';
  document.getElementById('maoObraDiaria').style.display = (tipo === 'diaria') ? 'block' : 'none';
}

// Máscara de telefone brasileiro ao digitar
function mascaraTelefone(valor) {
  valor = valor.replace(/\D/g, '').slice(0, 11);
  if (valor.length > 10) {
    return valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (valor.length > 6) {
    return valor.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
  } else if (valor.length > 2) {
    return valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else if (valor.length > 0) {
    return valor.replace(/^(\d*)/, '($1');
  }
  return "";
}

// Funções separadas para o cálculo do transporte
function calcularTransportePublico() {
  return parseFloat(document.getElementById('custoPublico').value) || 0;
}
function calcularTransporteCarro() {
  const pedagio = parseFloat(document.getElementById("pedagio").value) || 0;
  const distancia = parseFloat(document.getElementById("distancia").value) || 0;
  const consumo = parseFloat(document.getElementById("consumo").value) || 10;
  const combustivel = parseFloat(document.getElementById("combustivel").value) || 0;
  return pedagio + ((distancia / consumo) * combustivel);
}

function calcular() {
  const tituloOrcamento = document.getElementById("tituloOrcamento").value || "";
  const nomeCliente = document.getElementById("nomeCliente").value || "";
  const telefoneCliente = document.getElementById("telefoneCliente").value || "";
  const contatoCliente = document.getElementById("contatoCliente").value || "";
  const transporte = document.getElementById('transporte').value;
  const areaTotal = parseFloat(document.getElementById("areaTotal").value) || 0;
  const demao = parseInt(document.getElementById("demao").value) || 0;
  const rendimento = parseFloat(document.getElementById("rendimento").value) || 0;
  const custoLitro = parseFloat(document.getElementById("custoLitro").value) || 0;
  const qtdTinta = rendimento > 0 ? (areaTotal * demao) / rendimento : 0;
  const custoTinta = qtdTinta * custoLitro;

  // MÃO DE OBRA
  let custoMaoObra = 0;
  let infoPrazo = '';
  const tipo = document.getElementById('tipoMaoObra').value;
  if (tipo === 'm2') {
    const precoM2 = parseFloat(document.getElementById("precoM2").value) || 0;
    custoMaoObra = areaTotal * precoM2;
    const prazoM2 = document.getElementById("prazoM2").value;
    infoPrazo = prazoM2 ? `<p>Prazo para execução: ${prazoM2} dia(s)</p>` : '';
  } else {
    const diariaPintorNovo = parseFloat(document.getElementById("diariaPintorNovo").value) || 0;
    const pintoresDiaria = parseInt(document.getElementById("pintoresDiaria").value) || 1;
    const diasDiaria = parseInt(document.getElementById("diasDiaria").value) || 1;
    custoMaoObra = pintoresDiaria * diasDiaria * diariaPintorNovo;
    infoPrazo = `<p>Prazo para execução: ${diasDiaria} dia(s)</p>`;
  }

  // Refeição
  let custoRefeicao = 0;
  let pintoresParaRefeicao = 1;
  let diasParaRefeicao = 1;
  if (tipo === "diaria") {
    pintoresParaRefeicao = parseInt(document.getElementById("pintoresDiaria").value) || 1;
    diasParaRefeicao = parseInt(document.getElementById("diasDiaria").value) || 1;
  } else {
    diasParaRefeicao = parseInt(document.getElementById("prazoM2").value) || 1;
  }
  if (document.getElementById('incluirRefeicao').checked) {
    const valorRefeicao = parseFloat(document.getElementById("valorRefeicao").value) || 0;
    custoRefeicao = pintoresParaRefeicao * diasParaRefeicao * valorRefeicao;
  }

  // Transporte
  let custoTransporte = 0;
  if (transporte === 'carro') {
    custoTransporte = calcularTransporteCarro();
  } else {
    custoTransporte = calcularTransportePublico();
  }

  const subtotal = custoTinta + custoMaoObra + custoTransporte + custoRefeicao;
  const comissaoPercent = parseFloat(document.getElementById("comissao").value) || 0;
  const comissao = subtotal * (comissaoPercent / 100);
  const impostoPercent = parseFloat(document.getElementById("imposto").value) || 0;
  const imposto = (subtotal + comissao) * (impostoPercent / 100);
  const totalGeral = subtotal + comissao + imposto;

  // Montar resultado
  let resultadoHTML = `<h3>Mão de Obra:</h3>`;
  if (tituloOrcamento) resultadoHTML += `<p><strong>Título do Orçamento:</strong> ${tituloOrcamento}</p>`;
  if (nomeCliente) resultadoHTML += `<p><strong>Cliente:</strong> ${nomeCliente}</p>`;
  if (telefoneCliente) resultadoHTML += `<p><strong>Telefone:</strong> ${telefoneCliente}</p>`;
  if (contatoCliente) resultadoHTML += `<p><strong>Contato:</strong> ${contatoCliente}</p>`;
  if (areaTotal > 0) resultadoHTML += `<p>Área total: ${areaTotal.toFixed(2)} m²</p>`;
  if (demao > 0) resultadoHTML += `<p>Demãos: ${demao}</p>`;
  if (qtdTinta > 0) resultadoHTML += `<p>Quantidade de tinta necessária: ${qtdTinta.toFixed(2)} litros (${Math.ceil(qtdTinta)} latas)</p>`;
  if (custoTinta > 0) resultadoHTML += `<p>Custo da tinta: ${formatter.format(custoTinta)}</p>`;
  if (custoMaoObra > 0) {
    resultadoHTML += `<p>Mão de obra: ${formatter.format(custoMaoObra)}</p>`;
    resultadoHTML += infoPrazo;
  }
  if (custoRefeicao > 0) resultadoHTML += `<p>Custo com refeição: ${formatter.format(custoRefeicao)}</p>`;
  if (custoTransporte > 0) resultadoHTML += `<p>Custo de transporte: ${formatter.format(custoTransporte)}</p>`;
  if (subtotal > 0 || (subtotal === 0 && totalGeral === 0)) resultadoHTML += `<p>Subtotal: ${formatter.format(subtotal)}</p>`;
  if (comissao > 0) resultadoHTML += `<p>Comissão (${comissaoPercent}%): ${formatter.format(comissao)}</p>`;
  if (imposto > 0) resultadoHTML += `<p>Imposto NF (${impostoPercent}%): ${formatter.format(imposto)}</p>`;
  resultadoHTML += `<h4>Total Geral: ${formatter.format(totalGeral)}</h4>`;

  document.getElementById("resultado").innerHTML = resultadoHTML;

  salvarHistorico({
    data: new Date().toLocaleString(),
    resultadoHTML: resultadoHTML
  });
  atualizarHistorico();

  // Atualiza o relatório ao calcular o orçamento
  atualizarRelatorio();
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("open");
}

document.addEventListener('click', function(event) {
  const menu = document.getElementById('menu');
  const toggleButton = document.querySelector('.menu-toggle');
  if (menu.classList.contains('open')) {
    const isClickInsideMenu = menu.contains(event.target);
    const isClickOnToggleButton = toggleButton.contains(event.target);
    if (!isClickInsideMenu && !isClickOnToggleButton) {
      menu.classList.remove('open');
    }
  }
});

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.getAttribute("data-theme") === "dark";
  root.setAttribute("data-theme", isDark ? "" : "dark");
}

function limpar() {
  document.getElementById("tituloOrcamento").value = "Serviço de Pintura";
  document.getElementById("nomeCliente").value = "";
  document.getElementById("telefoneCliente").value = "";
  document.getElementById("contatoCliente").value = "";
  document.getElementById("areaTotal").value = "0";
  document.getElementById("demao").value = "0";
  document.getElementById("rendimento").value = "0";
  document.getElementById("custoLitro").value = "0";
  document.getElementById("precoM2").value = "0";
  document.getElementById("prazoM2").value = "0";
  document.getElementById("diariaPintorNovo").value = "0";
  document.getElementById("pintoresDiaria").value = "0";
  document.getElementById("diasDiaria").value = "0";
  document.getElementById("comissao").value = "0";
  document.getElementById("imposto").value = "0";
  document.getElementById("custoPublico").value = "0";
  document.getElementById("distancia").value = "0";
  document.getElementById("consumo").value = "0";
  document.getElementById("combustivel").value = "0";
  document.getElementById("pedagio").value = "0";
  document.getElementById('incluirRefeicao').checked = false;
  document.getElementById('refeicaoInput').style.display = 'none';
  document.getElementById('valorRefeicao').value = '00.00';
  document.getElementById("resultado").innerHTML = "";
  document.getElementById('tipoMaoObra').value = 'm2';
  toggleTipoMaoObra();
}

function exportarPDF() {
  const resultadoHTML = document.getElementById("resultado").innerHTML;
  const win = window.open('', '', 'height=600,width=800');
  win.document.write(`
    <html><head>
      <title>Orçamento</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h2 { color: #004aad; }
        h4 { color: #333; }
      </style>
    </head><body>
    <h2>Orçamento - EG Pinturas</h2>
    ${resultadoHTML.replace(/<br>/g, "<br/>")}
    </body></html>
  `);
  setTimeout(() => {
    win.focus();
    win.print();
    win.close();
  }, 500);
}

function salvarHistorico(orcam) {
  let historico = JSON.parse(localStorage.getItem("orcamentos")) || [];
  historico.unshift(orcam);
  if (historico.length > 3) {
    historico.pop();
  }
  localStorage.setItem("orcamentos", JSON.stringify(historico));
}

function atualizarHistorico() {
  const historico = JSON.parse(localStorage.getItem("orcamentos")) || [];
  const divHistorico = document.getElementById("lista-historico");
  divHistorico.innerHTML = "";
  if (historico.length === 0) {
    divHistorico.innerHTML = "<em>Nenhum orçamento salvo.</em>";
    return;
  }
  historico.forEach((item, i) => {
    divHistorico.innerHTML += `
      <div style="margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
        <small>${item.data}</small><br>
        ${item.resultadoHTML}
      </div>
    `;
  });
}

function mostrarHistorico() {
  const historicoDiv = document.getElementById("historico");
  historicoDiv.style.display = historicoDiv.style.display === "none" ? "block" : "none";
}

window.onload = function () {
  toggleTransporte();
  toggleRefeicao();
  toggleTipoMaoObra();
  atualizarHistorico();

  const telefoneInput = document.getElementById('telefoneCliente');
  telefoneInput.addEventListener('input', function (e) {
    let cursor = telefoneInput.selectionStart;
    let valorAntigo = telefoneInput.value;
    telefoneInput.value = mascaraTelefone(telefoneInput.value);
    if (telefoneInput.value.length > valorAntigo.length) {
      telefoneInput.setSelectionRange(cursor + 1, cursor + 1);
    } else {
      telefoneInput.setSelectionRange(cursor, cursor);
    }
  });
};

// Script - Materiais
let materiais = [
  { descricao: "Tinta acrílica branca (18L)", und: "Latão", quant: 2, unit: 180.00, checked: false },
  { descricao: "Tinta esmalte sintético (3,6L)", und: "Latão", quant: 1, unit: 120.00, checked: false },
  { descricao: "Selador acrílico (3,6L)", und: "Latão", quant: 1, unit: 85.00, checked: false },
  { descricao: "Massa corrida (1kg)", und: "Pct", quant: 5, unit: 25.00, checked: false },
  { descricao: "Lixa parede (nº 120)", und: "Un", quant: 10, unit: 3.50, checked: false },
  { descricao: "Rolo de pintura (15cm)", und: "Un", quant: 3, unit: 12.00, checked: false },
  { descricao: "Pincel chato (2\")", und: "Un", quant: 2, unit: 8.00, checked: false },
  { descricao: "Fita crepe (48mm x 50m)", und: "Un", quant: 2, unit: 9.00, checked: false },
  { descricao: "Lona plástica (3x4m)", und: "Un", quant: 1, unit: 30.00, checked: false },
  { descricao: "Diluente para tinta (1L)", und: "Un", quant: 1, unit: 15.00, checked: false },
  { descricao: "Espátula (4\")", und: "Un", quant: 1, unit: 10.00, checked: false },
  { descricao: "Luva de proteção (par)", und: "Par", quant: 2, unit: 5.00, checked: false },
];

function renderTabelaMateriais() {
  const corpo = document.getElementById('corpoTabelaMateriais');
  corpo.innerHTML = '';
  materiais.forEach((mat, idx) => {
    corpo.innerHTML += `
      <tr>
        <td><input type="checkbox" ${mat.checked ? "checked" : ""} onchange="setChecked(${idx}, this.checked)"></td>
        <td>${idx + 1}</td>
        <td><input type="text" value="${mat.descricao.replace(/"/g,'&quot;')}" onchange="editarMaterial(${idx}, 'descricao', this.value)"></td>
        <td><input type="text" value="${mat.und.replace(/"/g,'&quot;')}" onchange="editarMaterial(${idx}, 'und', this.value)"></td>
        <td><input type="number" value="${mat.quant}" min="1" onchange="editarMaterial(${idx}, 'quant', this.value)"></td>
        <td><input type="number" value="${mat.unit}" step="0.01" min="0" onchange="editarMaterial(${idx}, 'unit', this.value)"></td>
        <td>R$ ${(mat.quant * mat.unit).toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
        <td><button class="minus-btn" onclick="removerMaterial(${idx})">-</button></td>
      </tr>
    `;
  });
  atualizarTotalMateriais();
  renderTabelaOrcamento();
}

function editarMaterial(idx, campo, valor) {
  if (campo === 'quant' || campo === 'unit') {
    materiais[idx][campo] = Number(valor);
  } else {
    materiais[idx][campo] = valor;
  }
  renderTabelaMateriais();
}

function setChecked(idx, checked) {
  materiais[idx].checked = checked;
  atualizarTotalMateriais();
  renderTabelaOrcamento();
}

function adicionarMaterial() {
  materiais.push({ descricao: "", und: "", quant: 1, unit: 0.00, checked: false });
  renderTabelaMateriais();
}

function removerMaterial(idx) {
  materiais.splice(idx, 1);
  renderTabelaMateriais();
}

function atualizarTotalMateriais() {
  let total = 0;
  materiais.forEach(mat => {
    if (mat.checked) total += mat.quant * mat.unit;
  });
  document.getElementById('totalMateriais').textContent = total.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

// ALTERAÇÃO: Atualiza tabela do relatório junto com orçamento
function renderTabelaOrcamento() {
  const corpo = document.getElementById('corpoTabelaOrcamento');
  corpo.innerHTML = '';
  let total = 0, cont = 1;
  materiais.forEach((mat) => {
    if (mat.checked) {
      const subtotal = mat.quant * mat.unit;
      total += subtotal;
      corpo.innerHTML += `
        <tr>
          <td>${cont++}</td>
          <td>${mat.descricao}</td>
          <td>${mat.und}</td>
          <td>${mat.quant}</td>
          <td>R$ ${Number(mat.unit).toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
          <td>R$ ${subtotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
        </tr>
      `;
    }
  });
  if ((cont - 1) === 0) {
    corpo.innerHTML = `<tr><td colspan="6" style="color:#888">Nenhum item selecionado.</td></tr>`;
  }
  document.getElementById('totalOrcamento').textContent = total.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});

  // Atualiza tabela de relatório de materiais sempre que a tabela do orçamento for atualizada
  atualizarRelatorio();
}

// NOVA FUNÇÃO: Atualiza o conteúdo da aba Relatório dinamicamente
function atualizarRelatorio() {
  // 🔧 Garante que a tabela do orçamento esteja montada
  if (!document.getElementById("totalOrcamento")) {
    renderTabelaOrcamento();
  }

  const resultado = document.getElementById("resultado")?.innerHTML || "<em>Nenhum cálculo realizado ainda.</em>";
  const corpoOriginal = document.getElementById("corpoTabelaOrcamento");
  const totalOriginal = document.getElementById("totalOrcamento");

  // 🔒 Verificação de segurança
  if (!corpoOriginal || !totalOriginal) {
    document.getElementById("relatorio").innerHTML = `
      <h2>Relatório</h2>
      <p><em>Os dados ainda não foram gerados. Calcule o orçamento primeiro.</em></p>
    `;
    return;
  }

  // 🧾 Tabela de materiais selecionados
  let tabelaMateriaisHTML = `
    <table>
      <thead>
        <tr>
          <th>Nº</th>
          <th>Descrição</th>
          <th>Und</th>
          <th>Quant.</th>
          <th>Valor Unitário (R$)</th>
          <th>Subtotal (R$)</th>
        </tr>
      </thead>
      <tbody>
        ${corpoOriginal.innerHTML}
      </tbody>
    </table>
    <div class="total-geral" style="text-align:right;margin-top:8px;">TOTAL GERAL: R$ <span>${totalOriginal.textContent}</span></div>
  `;

  // 🖥️ Atualiza a aba Relatório
  document.getElementById("relatorio").innerHTML = `
    <h2>Relatório</h2>
    <h3>Resultado do Orçamento</h3>
    <div>${resultado}</div>
    <h3>Itens do Carrinho</h3>
    ${tabelaMateriaisHTML}
  `;
}

// ALTERAÇÃO: Garante que ao trocar de aba, o relatório esteja sempre atualizado
function mostrarAba(aba) {
  document.getElementById('orcamento').classList.remove('active');
  document.getElementById('materiais').classList.remove('active');
  document.getElementById('relatorio').classList.remove('active');

  document.getElementById(aba).classList.add('active');

  document.querySelectorAll('.tab-button').forEach((el, i) => {
    el.classList.toggle('active',
      (aba === 'orcamento' && i === 0) ||
      (aba === 'materiais' && i === 1) ||
      (aba === 'relatorio' && i === 2)
    );
  });

  if (aba === 'orcamento') {
    renderTabelaOrcamento();
  } else if (aba === 'relatorio') {
    atualizarRelatorio();
  }
}

// function exportarPDFRelatorio() {
//   const conteudo = document.getElementById("relatorio").innerHTML;
//   const win = window.open('', '', 'height=600,width=800');
//   win.document.write(`
//     <html><head>
//       <title>Relatório do Orçamento</title>
//       <style>
//         body { font-family: Arial, sans-serif; margin: 20px; }
//         h2, h3 { color: #004aad; }
//         table { border-collapse: collapse; width: 100%; margin-top: 10px; }
//         th, td { border: 1px solid #aaa; padding: 6px; text-align: center; }
//       </style>
//     </head><body>
//     <h2>Relatório do Orçamento</h2>
//     ${conteudo.replace(/<br>/g, "<br/>")}
//     </body></html>
//   `);
//   setTimeout(() => {
//     win.focus();
//     win.print();
//     win.close();
//   }, 500);
// }
//************************************** */
async function exportarPDFRelatorio() {
  const { jsPDF } = window.jspdf;

  // Capturar o conteúdo da div #relatorio
  const relatorioDiv = document.getElementById("relatorio");

  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.left = '-9999px';
  document.body.appendChild(iframe);

  const doc = new jsPDF();

  const styles = `
    <style>
      body { font-family: Arial, sans-serif; padding: 10px; }
      h2, h3 { color: #004aad; }
      table { border-collapse: collapse; width: 100%; margin-top: 10px; }
      th, td { border: 1px solid #aaa; padding: 6px; text-align: center; }
    </style>
  `;

  const htmlContent = `
    <h2>Relatório Final - EG Pinturas</h2>
    ${relatorioDiv.innerHTML}
  `;

  iframe.contentDocument.open();
  iframe.contentDocument.write(styles + htmlContent);
  iframe.contentDocument.close();

  await new Promise(resolve => iframe.onload = resolve);

  const canvas = await html2canvas(iframe.contentDocument.body, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  const pdfWidth = doc.internal.pageSize.getWidth();
  const imgProps = doc.getImageProperties(imgData);
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let heightLeft = pdfHeight;
  let position = 0;
  const pageHeight = doc.internal.pageSize.height;

  doc.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - pdfHeight + 10;
    doc.addPage();
    doc.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
  }

  doc.save("Relatorio_Orcamento_EG_Pinturas.pdf");

  document.body.removeChild(iframe);
}
//*********************************************** */
// Inicialização
renderTabelaMateriais();
mostrarAba('orcamento');

//--------------------
function exportarPDFOrcamentoComMateriais() {
  // Pega HTML do orçamento calculado
  const resultadoHTML = document.getElementById("resultado").innerHTML;

  // Gera a tabela com os materiais selecionados
  const selecionados = materiais.filter(m => m.checked);
  let materiaisHTML = `
    <h3>Lista deMateriais</h3>
    <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
      <thead>
        <tr>
          <th style="border: 1px solid #ccc;">Descrição</th>
          <th style="border: 1px solid #ccc;">Und</th>
          <th style="border: 1px solid #ccc;">Quant.</th>
          <th style="border: 1px solid #ccc;">Valor Unit.</th>
          <th style="border: 1px solid #ccc;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
  `;

  let total = 0;
  selecionados.forEach(item => {
    const subtotal = item.quant * item.unit;
    total += subtotal;
    materiaisHTML += `
      <tr>
        <td style="border: 1px solid #ccc;">${item.descricao}</td>
        <td style="border: 1px solid #ccc;">${item.und}</td>
        <td style="border: 1px solid #ccc;">${item.quant}</td>
        <td style="border: 1px solid #ccc;">R$ ${item.unit.toFixed(2)}</td>
        <td style="border: 1px solid #ccc;">R$ ${subtotal.toFixed(2)}</td>
      </tr>
    `;
  });

  if (selecionados.length === 0) {
    materiaisHTML += `<tr><td colspan="5" style="text-align:center;color:#888"><em>Nenhum material selecionado.</em></td></tr>`;
  }

  materiaisHTML += `
      </tbody>
    </table>
    <div style="text-align: right; margin-top: 10px;"><strong>Total dos Materiais:</strong> R$ ${total.toFixed(2)}</div>
  `;

  // Gera o PDF
  const win = window.open('', '', 'width=800,height=700');
  win.document.write(`
    <html><head>
      <title>Orçamento Completo</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { padding: 6px; border: 1px solid #aaa; text-align: center; }
        h2, h3 { color: #004aad; }
      </style>
    </head><body>
      <h2>EG Pinturas - Orçamento Completo</h2>
      ${resultadoHTML}
      ${materiaisHTML}
    </body></html>
  `);
  setTimeout(() => {
    win.focus();
    win.print();
    win.close();
  }, 500);
}
