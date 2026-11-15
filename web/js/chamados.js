carregarDados();
iniciarRodape();

const hoje = diaDeHoje();
const formFiltros = document.getElementById("form-filtros");
const campoBusca = document.getElementById("filtro-busca");
const campoSituacao = document.getElementById("filtro-situacao");
const campoCategoria = document.getElementById("filtro-categoria");
const campoBairro = document.getElementById("filtro-bairro");
const lista = document.getElementById("lista-chamados");
const listaVazia = document.getElementById("lista-vazia");
const contagem = document.getElementById("contagem");
const tituloDetalhe = document.getElementById("titulo-detalhe");
const conteudoDetalhe = document.getElementById("conteudo-detalhe");

let protocoloEscolhido = "";

function adicionarOpcao(select, valor, texto) {
  const opcao = document.createElement("option");
  opcao.value = valor;
  opcao.textContent = texto;
  select.appendChild(opcao);
}

Object.keys(SITUACOES).forEach(function (situacao) {
  adicionarOpcao(campoSituacao, situacao, SITUACOES[situacao].nome);
});

categorias.forEach(function (categoria) {
  adicionarOpcao(campoCategoria, categoria.id, categoria.nome);
});

bairros.forEach(function (bairro) {
  adicionarOpcao(campoBairro, bairro.id, bairro.nome + " (" + bairro.regiao + ")");
});

function semAcento(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function chamadosFiltrados() {
  const busca = semAcento(campoBusca.value.trim());
  const situacao = campoSituacao.value;
  const categoriaId = Number(campoCategoria.value);
  const bairroId = Number(campoBairro.value);

  const resultado = chamadosMaisRecentes().filter(function (c) {
    if (situacao && c.situacao !== situacao) {
      return false;
    }
    if (categoriaId && c.categoriaId !== categoriaId) {
      return false;
    }
    if (bairroId && c.bairroId !== bairroId) {
      return false;
    }
    if (busca && c.protocolo.indexOf(busca) === -1 && semAcento(c.endereco).indexOf(busca) === -1) {
      return false;
    }
    return true;
  });

  return resultado;
}

function desenharLista() {
  const resultado = chamadosFiltrados();
  lista.innerHTML = "";

  resultado.forEach(function (c) {
    const item = document.createElement("li");
    item.appendChild(criarCartaoDeChamado(c, hoje, "#" + c.protocolo, c.protocolo === protocoloEscolhido));
    lista.appendChild(item);
  });

  if (resultado.length === 0) {
    contagem.textContent = "Nenhum chamado encontrado.";
  } else {
    contagem.textContent = plural(resultado.length, "chamado encontrado", "chamados encontrados")
      + " de " + chamados.length + ".";
  }
  lista.hidden = resultado.length === 0;
  listaVazia.hidden = resultado.length > 0;
}

function adicionarDado(listaDados, termo, valor) {
  listaDados.appendChild(criarElemento("dt", null, termo));
  const definicao = criarElemento("dd");
  if (typeof valor === "string") {
    definicao.textContent = valor;
  } else {
    definicao.appendChild(valor);
  }
  listaDados.appendChild(definicao);
}

function textoDosDias(chamado) {
  const dias = plural(diasCorridos(chamado, hoje), "dia", "dias");
  if (chamado.situacao === "RESOLVIDO" || chamado.situacao === "AGUARDANDO_CONFIRMACAO") {
    return dias + " (da abertura até o encerramento pelo órgão)";
  }
  if (chamado.situacao === "CANCELADO") {
    return dias + " (da abertura até o cancelamento)";
  }
  return dias + " (da abertura até hoje)";
}

function situacaoDoPrazo(chamado) {
  if (chamado.situacao === "CANCELADO") {
    return criarElemento("span", null, "Não se aplica a chamado cancelado");
  }
  if (estaForaDoPrazo(chamado, hoje)) {
    return criarElemento("span", "etiqueta-prazo", "Fora do prazo");
  }
  return criarElemento("span", null, "Dentro do prazo");
}

function mostrarErroNoCampo(campo, erro, mensagem) {
  erro.textContent = mensagem;
  campo.setAttribute("aria-invalid", "true");
  campo.focus();
}

function concluirAcao(chamado, mensagem) {
  if (!salvarDados()) {
    mensagem += " Atenção: este navegador não deixou guardar a alteração, ela some ao recarregar a página.";
  }
  mostrarDetalhe(chamado.protocolo, mensagem, true);
}

function criarFormularioMotivo(idCampo, rotulo, dica, textoBotao, classeBotao, aoEnviar) {
  const form = document.createElement("form");
  form.noValidate = true;

  const campo = criarElemento("div", "campo");
  const label = criarElemento("label", null, rotulo);
  label.htmlFor = idCampo;
  const textarea = document.createElement("textarea");
  textarea.id = idCampo;
  textarea.name = idCampo;
  textarea.required = true;
  textarea.rows = 3;
  textarea.setAttribute("aria-describedby", "dica-" + idCampo + " erro-" + idCampo);
  const textoDica = criarElemento("p", "dica", dica);
  textoDica.id = "dica-" + idCampo;
  const erro = criarElemento("p", "erro-campo");
  erro.id = "erro-" + idCampo;

  campo.appendChild(label);
  campo.appendChild(textoDica);
  campo.appendChild(textarea);
  campo.appendChild(erro);
  form.appendChild(campo);

  const foto = criarCampoDeFoto("foto-" + idCampo, "Foto para acompanhar o motivo");
  form.appendChild(foto.elemento);

  const botao = criarElemento("button", "botao " + classeBotao, textoBotao);
  botao.type = "submit";
  form.appendChild(botao);

  textarea.addEventListener("input", function () {
    if (erro.textContent) {
      erro.textContent = "";
      textarea.removeAttribute("aria-invalid");
    }
  });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    try {
      aoEnviar(textarea.value, foto.nomeDaFoto());
    } catch (falha) {
      mostrarErroNoCampo(textarea, erro, falha.message);
    }
  });
  return form;
}

function criarAcoes(chamado) {
  const cidadao = buscarCidadao(chamado.cidadaoId);
  const caixa = criarElemento("section", "acoes");
  caixa.setAttribute("aria-labelledby", "titulo-acoes");

  if (chamado.situacao === "AGUARDANDO_CONFIRMACAO") {
    const encerramento = ultimaMovimentacao(chamado);
    const titulo = criarElemento("h3", null, "O problema foi resolvido?");
    titulo.id = "titulo-acoes";
    caixa.appendChild(titulo);

    const explicacao = criarElemento("p", null, "O órgão encerrou o chamado em " + formatarDataHora(encerramento.dataHora)
      + " e deixou a evidência ");
    explicacao.appendChild(criarElemento("code", null, encerramento.evidencia));
    explicacao.appendChild(document.createTextNode(". Ele só conta como resolvido depois da sua confirmação."));
    caixa.appendChild(explicacao);
    caixa.appendChild(criarElemento("p", "dica", "Neste protótipo não há login: a resposta fica registrada em nome de quem abriu o chamado ("
      + cidadao.nome + ")."));

    const erroConfirmar = criarElemento("p", "mensagem mensagem-erro");
    erroConfirmar.hidden = true;
    const fotoConfirmacao = criarCampoDeFoto("foto-confirmacao", "Foto de como ficou");
    caixa.appendChild(fotoConfirmacao.elemento);
    const botoes = criarElemento("div", "botoes");
    const botaoConfirmar = criarElemento("button", "botao", "Confirmar que foi resolvido");
    botaoConfirmar.type = "button";
    botaoConfirmar.addEventListener("click", function () {
      try {
        confirmarChamado(chamado, fotoConfirmacao.nomeDaFoto());
        concluirAcao(chamado, "Confirmação registrada. O chamado agora está resolvido.");
      } catch (falha) {
        erroConfirmar.textContent = falha.message;
        erroConfirmar.hidden = false;
      }
    });
    botoes.appendChild(botaoConfirmar);
    caixa.appendChild(botoes);
    caixa.appendChild(erroConfirmar);

    caixa.appendChild(criarFormularioMotivo("motivo-contestacao", "Não foi resolvido? Explique o que continua errado",
      "Pelo menos 10 caracteres. O chamado volta para o órgão e a contestação entra na taxa dele.",
      "Contestar", "botao-perigo", function (motivo, foto) {
        contestarChamado(chamado, motivo, foto);
        concluirAcao(chamado, "Contestação registrada. O chamado voltou para o órgão.");
      }));
    return caixa;
  }

  if (chamado.situacao === "ABERTO") {
    const titulo = criarElemento("h3", null, "Cancelar chamado");
    titulo.id = "titulo-acoes";
    caixa.appendChild(titulo);
    caixa.appendChild(criarElemento("p", null, "Enquanto o órgão ainda não recebeu o chamado, quem abriu pode cancelar. Chamados cancelados não entram nos indicadores."));
    caixa.appendChild(criarElemento("p", "dica", "Neste protótipo não há login: o cancelamento fica registrado em nome de "
      + cidadao.nome + "."));
    caixa.appendChild(criarFormularioMotivo("motivo-cancelamento", "Motivo do cancelamento",
      "Pelo menos 5 caracteres.", "Cancelar chamado", "botao-perigo", function (motivo) {
        cancelarChamado(chamado, motivo);
        concluirAcao(chamado, "Chamado cancelado.");
      }));
    return caixa;
  }

  return null;
}

function criarLinhaDoTempo(chamado) {
  const linha = criarElemento("ol", "linha-do-tempo");
  chamado.movimentacoes.forEach(function (m) {
    const item = document.createElement("li");
    const quando = criarElemento("time", null, formatarDataHora(m.dataHora));
    quando.setAttribute("datetime", m.dataHora);
    item.appendChild(quando);
    item.appendChild(criarSelo(m.situacao));
    item.appendChild(criarElemento("p", null, m.descricao));
    item.appendChild(criarElemento("p", "responsavel", "Responsável: " + m.responsavel));
    if (m.evidencia) {
      const evidencia = criarElemento("p", "anexo", m.situacao === "AGUARDANDO_CONFIRMACAO"
        ? "Evidência do órgão: " : "Foto enviada pelo cidadão: ");
      evidencia.appendChild(criarElemento("code", null, m.evidencia));
      item.appendChild(evidencia);
    }
    linha.appendChild(item);
  });
  return linha;
}

function mostrarDetalhe(protocolo, mensagem, focar) {
  const chamado = buscarChamado(protocolo);
  conteudoDetalhe.innerHTML = "";

  if (!chamado) {
    protocoloEscolhido = "";
    tituloDetalhe.textContent = "Detalhe do chamado";
    conteudoDetalhe.appendChild(criarElemento("p", "detalhe-vazio", protocolo
      ? "Não existe chamado com o protocolo \"" + protocolo + "\"."
      : "Escolha um chamado na lista para ver a linha do tempo."));
    desenharLista();
    return;
  }

  protocoloEscolhido = protocolo;
  const categoria = buscarCategoria(chamado.categoriaId);
  const orgao = orgaoDoChamado(chamado);
  const bairro = buscarBairro(chamado.bairroId);

  tituloDetalhe.textContent = "Chamado " + chamado.protocolo;

  if (mensagem) {
    const aviso = criarElemento("p", "mensagem mensagem-sucesso", mensagem);
    aviso.setAttribute("role", "status");
    conteudoDetalhe.appendChild(aviso);
  }

  const cabecalho = criarElemento("div", "cabecalho-detalhe");
  cabecalho.appendChild(criarSelo(chamado.situacao));
  if (estaForaDoPrazo(chamado, hoje)) {
    cabecalho.appendChild(criarElemento("span", "etiqueta-prazo", "Fora do prazo"));
  }
  conteudoDetalhe.appendChild(cabecalho);

  const dados = criarElemento("dl", "dados-chamado");
  adicionarDado(dados, "Categoria", categoria.nome);
  adicionarDado(dados, "Órgão responsável", orgao.sigla + " – " + orgao.nome);
  adicionarDado(dados, "Bairro", bairro.nome + " (região " + bairro.regiao + ")");
  adicionarDado(dados, "Endereço", chamado.endereco);
  adicionarDado(dados, "Descrição", chamado.descricao);
  adicionarDado(dados, "Aberto em", formatarDataHora(chamado.abertura));
  adicionarDado(dados, "Prazo", formatarDia(prazoDoChamado(chamado)) + " (" + plural(categoria.prazoDias, "dia corrido", "dias corridos") + " para a categoria)");
  adicionarDado(dados, "Dias corridos", textoDosDias(chamado));
  adicionarDado(dados, "Situação do prazo", situacaoDoPrazo(chamado));
  adicionarDado(dados, "Contestações", String(totalDeContestacoes(chamado)));
  conteudoDetalhe.appendChild(dados);

  const acoes = criarAcoes(chamado);
  if (acoes) {
    conteudoDetalhe.appendChild(acoes);
  }

  conteudoDetalhe.appendChild(criarElemento("h3", null, "Linha do tempo"));
  conteudoDetalhe.appendChild(criarLinhaDoTempo(chamado));

  desenharLista();
  if (focar) {
    tituloDetalhe.focus();
  }
}

function protocoloDoEndereco() {
  try {
    return decodeURIComponent(window.location.hash.replace("#", "")).trim();
  } catch (erro) {
    return "";
  }
}

campoBusca.addEventListener("input", desenharLista);
campoSituacao.addEventListener("change", desenharLista);
campoCategoria.addEventListener("change", desenharLista);
campoBairro.addEventListener("change", desenharLista);

formFiltros.addEventListener("submit", function (evento) {
  evento.preventDefault();
  desenharLista();
});

formFiltros.addEventListener("reset", function () {
  setTimeout(desenharLista, 0);
});

document.getElementById("botao-limpar-vazio").addEventListener("click", function () {
  formFiltros.reset();
  campoBusca.focus();
});

window.addEventListener("hashchange", function () {
  mostrarDetalhe(protocoloDoEndereco(), "", true);
});

const categoriaDoEndereco = new URLSearchParams(window.location.search).get("categoria");
if (buscarCategoria(Number(categoriaDoEndereco))) {
  campoCategoria.value = categoriaDoEndereco;
}

desenharLista();
if (protocoloDoEndereco()) {
  mostrarDetalhe(protocoloDoEndereco(), "", true);
}
