carregarDados();
iniciarRodape();

const form = document.getElementById("form-chamado");
const campoCategoria = document.getElementById("categoria");
const campoBairro = document.getElementById("bairro");
const infoCategoria = document.getElementById("info-categoria");
const resumoErros = document.getElementById("resumo-erros");
const listaErros = document.getElementById("lista-erros");
const confirmacao = document.getElementById("confirmacao");
const textoInicialCategoria = infoCategoria.textContent;

const CAMPOS = ["nome", "email", "telefone", "categoria", "bairro", "endereco", "descricao"];

categorias.forEach(function (categoria) {
  const opcao = document.createElement("option");
  opcao.value = categoria.id;
  opcao.textContent = categoria.nome;
  campoCategoria.appendChild(opcao);
});

bairros.forEach(function (bairro) {
  const opcao = document.createElement("option");
  opcao.value = bairro.id;
  opcao.textContent = bairro.nome + " (" + bairro.regiao + ")";
  campoBairro.appendChild(opcao);
});

const fotoDoProblema = criarCampoDeFoto("foto-problema", "Foto do problema");
document.getElementById("lugar-da-foto").appendChild(fotoDoProblema.elemento);

function mostrarInfoCategoria() {
  const categoria = buscarCategoria(Number(campoCategoria.value));
  if (!categoria) {
    infoCategoria.textContent = textoInicialCategoria;
    return;
  }
  const orgao = buscarOrgao(categoria.orgaoId);
  infoCategoria.textContent = "Órgão responsável: " + orgao.sigla + " (" + orgao.nome + "). Prazo: "
    + plural(categoria.prazoDias, "dia corrido", "dias corridos") + " a partir da abertura, até "
    + formatarDia(diaDeHoje() + categoria.prazoDias) + " se aberto hoje.";
}

function limparErro(nomeCampo) {
  document.getElementById("erro-" + nomeCampo).textContent = "";
  document.getElementById(nomeCampo).removeAttribute("aria-invalid");
}

function marcarErro(nomeCampo, mensagem, erros) {
  document.getElementById("erro-" + nomeCampo).textContent = mensagem;
  document.getElementById(nomeCampo).setAttribute("aria-invalid", "true");
  erros.push({ campo: nomeCampo, mensagem: mensagem });
}

function mostrarResumo(erros) {
  listaErros.innerHTML = "";
  erros.forEach(function (erro) {
    const item = document.createElement("li");
    const link = criarElemento("a", null, erro.mensagem);
    link.href = "#" + erro.campo;
    link.addEventListener("click", function (evento) {
      evento.preventDefault();
      document.getElementById(erro.campo).focus();
    });
    item.appendChild(link);
    listaErros.appendChild(item);
  });
  resumoErros.hidden = false;
  resumoErros.focus();
}

function validarFormulario() {
  const erros = [];
  CAMPOS.forEach(limparErro);

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const endereco = document.getElementById("endereco").value;
  const descricao = document.getElementById("descricao").value;

  let mensagem = validarNome(nome);
  if (mensagem) {
    marcarErro("nome", mensagem, erros);
  }
  mensagem = validarEmail(email);
  if (mensagem) {
    marcarErro("email", mensagem, erros);
  }
  mensagem = validarTelefone(telefone);
  if (mensagem) {
    marcarErro("telefone", mensagem, erros);
  }
  if (!buscarCategoria(Number(campoCategoria.value))) {
    marcarErro("categoria", "Escolha a categoria do problema.", erros);
  }
  if (!buscarBairro(Number(campoBairro.value))) {
    marcarErro("bairro", "Escolha o bairro.", erros);
  }
  mensagem = validarEndereco(endereco);
  if (mensagem) {
    marcarErro("endereco", mensagem, erros);
  }
  mensagem = validarDescricao(descricao);
  if (mensagem) {
    marcarErro("descricao", mensagem, erros);
  }

  if (erros.length === 0) {
    const duplicado = procurarDuplicado(Number(campoCategoria.value), Number(campoBairro.value), endereco);
    if (duplicado) {
      marcarErro("endereco", "Já existe um chamado em andamento para esse endereço e categoria: "
        + duplicado.protocolo + ". Acompanhe por ele em vez de abrir outro.", erros);
    }
  }
  return erros;
}

function mostrarConfirmacao(chamado, cidadaoJaExistia, guardou) {
  const categoria = buscarCategoria(chamado.categoriaId);
  const orgao = buscarOrgao(categoria.orgaoId);
  const cidadao = buscarCidadao(chamado.cidadaoId);

  document.getElementById("confirmacao-protocolo").textContent = chamado.protocolo;
  document.getElementById("confirmacao-orgao").textContent = orgao.sigla + " – " + orgao.nome;
  document.getElementById("confirmacao-categoria").textContent = categoria.nome;
  document.getElementById("confirmacao-prazo").textContent = formatarDia(prazoDoChamado(chamado)) + " ("
    + plural(categoria.prazoDias, "dia corrido", "dias corridos") + ")";
  document.getElementById("confirmacao-endereco").textContent = chamado.endereco + " – " + buscarBairro(chamado.bairroId).nome;
  document.getElementById("confirmacao-cidadao").textContent = cidadaoJaExistia
    ? "Este e-mail já tinha cadastro, então o chamado entrou no mesmo cadastro, em nome de " + cidadao.nome + "."
    : "Chamado registrado em nome de " + cidadao.nome + ".";
  document.getElementById("link-acompanhar").href = "chamados.html#" + chamado.protocolo;

  const aviso = document.getElementById("confirmacao-aviso");
  if (guardou) {
    aviso.hidden = true;
  } else {
    aviso.textContent = "Este navegador não deixou guardar dados, então o chamado não vai aparecer nas outras páginas.";
    aviso.hidden = false;
  }

  resumoErros.hidden = true;
  form.hidden = true;
  confirmacao.hidden = false;
  confirmacao.focus();
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const erros = validarFormulario();
  if (erros.length > 0) {
    mostrarResumo(erros);
    return;
  }

  const email = document.getElementById("email").value.trim().toLowerCase();
  const cidadaoJaExistia = cidadaos.some(function (c) { return c.email === email; });

  let chamado;
  try {
    chamado = abrirChamado({
      nome: document.getElementById("nome").value,
      email: email,
      telefone: document.getElementById("telefone").value,
      categoriaId: Number(campoCategoria.value),
      bairroId: Number(campoBairro.value),
      endereco: document.getElementById("endereco").value,
      descricao: document.getElementById("descricao").value,
      foto: fotoDoProblema.nomeDaFoto()
    });
  } catch (falha) {
    const lista = [];
    marcarErro("endereco", falha.message, lista);
    mostrarResumo(lista);
    return;
  }

  const guardou = salvarDados();
  mostrarConfirmacao(chamado, cidadaoJaExistia, guardou);
});

form.addEventListener("reset", function () {
  CAMPOS.forEach(limparErro);
  fotoDoProblema.limpar();
  resumoErros.hidden = true;
  setTimeout(mostrarInfoCategoria, 0);
});

CAMPOS.forEach(function (nomeCampo) {
  const campo = document.getElementById(nomeCampo);
  const tipoDeEvento = campo.tagName === "SELECT" ? "change" : "input";
  campo.addEventListener(tipoDeEvento, function () {
    if (campo.getAttribute("aria-invalid") === "true") {
      limparErro(nomeCampo);
    }
  });
});

campoCategoria.addEventListener("change", mostrarInfoCategoria);

document.getElementById("botao-novo").addEventListener("click", function () {
  form.reset();
  confirmacao.hidden = true;
  form.hidden = false;
  document.getElementById("nome").focus();
});
