const SITUACOES = {
  ABERTO: { nome: "Aberto", classe: "aberto" },
  RECEBIDO: { nome: "Recebido pelo órgão", classe: "andamento" },
  EM_EXECUCAO: { nome: "Em execução", classe: "andamento" },
  AGUARDANDO_CONFIRMACAO: { nome: "Aguardando confirmação do cidadão", classe: "aguardando" },
  RESOLVIDO: { nome: "Resolvido", classe: "resolvido" },
  CONTESTADO: { nome: "Contestado pelo cidadão", classe: "contestado" },
  CANCELADO: { nome: "Cancelado", classe: "cancelado" }
};

const CHAVE_DADOS = "prefeituraAtende.dados";
const UM_DIA = 24 * 60 * 60 * 1000;

let cidadaos = [];
let chamados = [];
let podeGuardar = true;

function copiar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function carregarDados() {
  cidadaos = copiar(cidadaosIniciais);
  chamados = copiar(chamadosIniciais);
  try {
    localStorage.setItem(CHAVE_DADOS + ".teste", "1");
    localStorage.removeItem(CHAVE_DADOS + ".teste");
    const salvo = localStorage.getItem(CHAVE_DADOS);
    if (salvo) {
      const dados = JSON.parse(salvo);
      if (Array.isArray(dados.cidadaos) && Array.isArray(dados.chamados)) {
        cidadaos = dados.cidadaos;
        chamados = dados.chamados;
      }
    }
  } catch (erro) {
    podeGuardar = false;
  }
}

function salvarDados() {
  try {
    localStorage.setItem(CHAVE_DADOS, JSON.stringify({ cidadaos: cidadaos, chamados: chamados }));
    return true;
  } catch (erro) {
    podeGuardar = false;
    return false;
  }
}

function restaurarDados() {
  try {
    localStorage.removeItem(CHAVE_DADOS);
  } catch (erro) {
    podeGuardar = false;
  }
  cidadaos = copiar(cidadaosIniciais);
  chamados = copiar(chamadosIniciais);
}

function iniciarRodape() {
  const aviso = document.getElementById("aviso-armazenamento");
  if (aviso && !podeGuardar) {
    aviso.textContent = "Este navegador não deixou guardar dados. As alterações valem só até a página ser recarregada.";
    aviso.hidden = false;
  }
  const botao = document.getElementById("botao-restaurar");
  if (botao) {
    botao.addEventListener("click", function () {
      restaurarDados();
      window.location.reload();
    });
  }
}

function buscarOrgao(id) {
  return orgaos.find(function (o) { return o.id === id; });
}

function buscarCategoria(id) {
  return categorias.find(function (c) { return c.id === id; });
}

function buscarBairro(id) {
  return bairros.find(function (b) { return b.id === id; });
}

function buscarCidadao(id) {
  return cidadaos.find(function (c) { return c.id === id; });
}

function buscarChamado(protocolo) {
  return chamados.find(function (c) { return c.protocolo === protocolo; });
}

function orgaoDoChamado(chamado) {
  return buscarOrgao(buscarCategoria(chamado.categoriaId).orgaoId);
}

function doisDigitos(numero) {
  return numero < 10 ? "0" + numero : String(numero);
}

function numeroDoDia(ano, mes, dia) {
  return Math.round(Date.UTC(ano, mes - 1, dia) / UM_DIA);
}

function diaDoTexto(texto) {
  const partes = texto.substring(0, 10).split("-");
  return numeroDoDia(Number(partes[0]), Number(partes[1]), Number(partes[2]));
}

function diaDeHoje() {
  const agora = new Date();
  return numeroDoDia(agora.getFullYear(), agora.getMonth() + 1, agora.getDate());
}

function agoraEmTexto() {
  const agora = new Date();
  return agora.getFullYear() + "-" + doisDigitos(agora.getMonth() + 1) + "-" + doisDigitos(agora.getDate())
    + "T" + doisDigitos(agora.getHours()) + ":" + doisDigitos(agora.getMinutes());
}

function formatarDia(numero) {
  const data = new Date(numero * UM_DIA);
  return doisDigitos(data.getUTCDate()) + "/" + doisDigitos(data.getUTCMonth() + 1) + "/" + data.getUTCFullYear();
}

function formatarDataHora(texto) {
  const data = texto.substring(0, 10).split("-");
  return data[2] + "/" + data[1] + "/" + data[0] + " às " + texto.substring(11, 16);
}

function formatarDecimal(numero) {
  return numero.toFixed(1).replace(".", ",");
}

function plural(quantidade, singular, varios) {
  return quantidade + " " + (quantidade === 1 ? singular : varios);
}

function situacaoFinal(situacao) {
  return situacao === "RESOLVIDO" || situacao === "CANCELADO";
}

function ultimaMovimentacao(chamado) {
  return chamado.movimentacoes[chamado.movimentacoes.length - 1];
}

function prazoDoChamado(chamado) {
  return diaDoTexto(chamado.abertura) + buscarCategoria(chamado.categoriaId).prazoDias;
}

function dataDaResolucao(chamado) {
  if (chamado.situacao !== "RESOLVIDO") {
    return null;
  }
  let dia = null;
  chamado.movimentacoes.forEach(function (m) {
    if (m.situacao === "AGUARDANDO_CONFIRMACAO") {
      dia = diaDoTexto(m.dataHora);
    }
  });
  return dia;
}

function dataDeReferencia(chamado, hoje) {
  if (chamado.situacao === "RESOLVIDO") {
    return dataDaResolucao(chamado);
  }
  if (chamado.situacao === "CANCELADO" || chamado.situacao === "AGUARDANDO_CONFIRMACAO") {
    return diaDoTexto(ultimaMovimentacao(chamado).dataHora);
  }
  return hoje;
}

function diasCorridos(chamado, hoje) {
  return dataDeReferencia(chamado, hoje) - diaDoTexto(chamado.abertura);
}

function estaForaDoPrazo(chamado, hoje) {
  if (chamado.situacao === "CANCELADO") {
    return false;
  }
  return dataDeReferencia(chamado, hoje) > prazoDoChamado(chamado);
}

function totalDeContestacoes(chamado) {
  return chamado.movimentacoes.filter(function (m) { return m.situacao === "CONTESTADO"; }).length;
}

function foiEncerradoPeloOrgao(chamado) {
  return chamado.movimentacoes.some(function (m) { return m.situacao === "AGUARDANDO_CONFIRMACAO"; });
}

function exigirSituacao(chamado, acao, permitidas) {
  if (permitidas.indexOf(chamado.situacao) === -1) {
    throw new Error("Não é possível " + acao + " o chamado " + chamado.protocolo + " na situação \""
      + SITUACOES[chamado.situacao].nome + "\".");
  }
}

function proximoIdDeMovimentacao() {
  let maior = 0;
  chamados.forEach(function (c) {
    c.movimentacoes.forEach(function (m) {
      if (m.id > maior) {
        maior = m.id;
      }
    });
  });
  return maior + 1;
}

function registrarMovimentacao(chamado, quando, situacao, responsavel, descricao, evidencia) {
  if (quando < ultimaMovimentacao(chamado).dataHora) {
    throw new Error("A data informada é anterior à última movimentação do chamado.");
  }
  chamado.movimentacoes.push({
    id: proximoIdDeMovimentacao(),
    dataHora: quando,
    situacao: situacao,
    responsavel: responsavel,
    descricao: descricao,
    evidencia: evidencia
  });
  chamado.situacao = situacao;
}

function confirmarChamado(chamado, foto) {
  exigirSituacao(chamado, "confirmar", ["AGUARDANDO_CONFIRMACAO"]);
  registrarMovimentacao(chamado, agoraEmTexto(), "RESOLVIDO", buscarCidadao(chamado.cidadaoId).nome,
    "O cidadão confirmou que o problema foi resolvido.", foto || null);
}

function contestarChamado(chamado, motivo, foto) {
  exigirSituacao(chamado, "contestar", ["AGUARDANDO_CONFIRMACAO"]);
  if (!motivo || motivo.trim().length < 10) {
    throw new Error("Explique o motivo da contestação com pelo menos 10 caracteres.");
  }
  registrarMovimentacao(chamado, agoraEmTexto(), "CONTESTADO", buscarCidadao(chamado.cidadaoId).nome,
    motivo.trim(), foto || null);
}

function cancelarChamado(chamado, motivo) {
  exigirSituacao(chamado, "cancelar", ["ABERTO"]);
  if (!motivo || motivo.trim().length < 5) {
    throw new Error("Informe o motivo do cancelamento com pelo menos 5 caracteres.");
  }
  registrarMovimentacao(chamado, agoraEmTexto(), "CANCELADO", buscarCidadao(chamado.cidadaoId).nome,
    motivo.trim(), null);
}

function validarNome(nome) {
  if (nome.trim().length < 3) {
    return "Informe o nome com pelo menos 3 caracteres.";
  }
  return "";
}

function validarEmail(email) {
  if (!/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(email.trim())) {
    return "E-mail inválido. Use o formato nome@dominio.com.";
  }
  return "";
}

function validarTelefone(telefone) {
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.length < 10 || digitos.length > 11) {
    return "Telefone inválido. Informe o DDD e o número (10 ou 11 dígitos).";
  }
  return "";
}

function validarEndereco(endereco) {
  if (endereco.trim().length < 5) {
    return "Informe o endereço com pelo menos 5 caracteres.";
  }
  return "";
}

function validarDescricao(descricao) {
  if (descricao.trim().length < 10) {
    return "A descrição precisa de pelo menos 10 caracteres.";
  }
  return "";
}

function procurarDuplicado(categoriaId, bairroId, endereco) {
  const procurado = endereco.trim().toLowerCase();
  return chamados.find(function (c) {
    return !situacaoFinal(c.situacao) && c.categoriaId === categoriaId && c.bairroId === bairroId
      && c.endereco.toLowerCase() === procurado;
  });
}

function cidadaoDoFormulario(nome, email, telefone) {
  const emailLimpo = email.trim().toLowerCase();
  const existente = cidadaos.find(function (c) { return c.email === emailLimpo; });
  if (existente) {
    return existente;
  }
  let maior = 0;
  cidadaos.forEach(function (c) {
    if (c.id > maior) {
      maior = c.id;
    }
  });
  const novo = { id: maior + 1, nome: nome.trim(), email: emailLimpo, telefone: telefone.replace(/\D/g, "") };
  cidadaos.push(novo);
  return novo;
}

function abrirChamado(dados) {
  const duplicado = procurarDuplicado(dados.categoriaId, dados.bairroId, dados.endereco);
  if (duplicado) {
    throw new Error("Já existe um chamado em andamento para esse endereço e categoria: " + duplicado.protocolo + ".");
  }
  const cidadao = cidadaoDoFormulario(dados.nome, dados.email, dados.telefone);
  const quando = agoraEmTexto();
  let maior = 0;
  chamados.forEach(function (c) {
    if (c.id > maior) {
      maior = c.id;
    }
  });
  const id = maior + 1;
  const chamado = {
    id: id,
    protocolo: quando.substring(0, 4) + "-" + String(id).padStart(4, "0"),
    cidadaoId: cidadao.id,
    categoriaId: dados.categoriaId,
    bairroId: dados.bairroId,
    endereco: dados.endereco.trim(),
    descricao: dados.descricao.trim(),
    abertura: quando,
    situacao: "ABERTO",
    movimentacoes: [{
      id: proximoIdDeMovimentacao(),
      dataHora: quando,
      situacao: "ABERTO",
      responsavel: cidadao.nome,
      descricao: "Chamado aberto pelo cidadão.",
      evidencia: dados.foto || null
    }]
  };
  chamados.push(chamado);
  return chamado;
}

function novoIndicador(nome) {
  return { nome: nome, total: 0, resolvidos: 0, foraDoPrazo: 0, encerradosPeloOrgao: 0, contestados: 0, diasParaResolver: 0 };
}

function somarNoIndicador(indicador, chamado, hoje) {
  if (chamado.situacao === "CANCELADO") {
    return;
  }
  indicador.total++;
  if (estaForaDoPrazo(chamado, hoje)) {
    indicador.foraDoPrazo++;
  }
  if (foiEncerradoPeloOrgao(chamado)) {
    indicador.encerradosPeloOrgao++;
  }
  if (totalDeContestacoes(chamado) > 0) {
    indicador.contestados++;
  }
  if (chamado.situacao === "RESOLVIDO") {
    indicador.resolvidos++;
    indicador.diasParaResolver += diasCorridos(chamado, hoje);
  }
}

function tempoMedio(indicador) {
  if (indicador.resolvidos === 0) {
    return 0;
  }
  return indicador.diasParaResolver / indicador.resolvidos;
}

function taxaDeContestacao(indicador) {
  if (indicador.encerradosPeloOrgao === 0) {
    return 0;
  }
  return 100 * indicador.contestados / indicador.encerradosPeloOrgao;
}

function indicadorGeral(hoje) {
  const indicador = novoIndicador("Todos os chamados");
  chamados.forEach(function (c) {
    somarNoIndicador(indicador, c, hoje);
  });
  return indicador;
}

function indicadoresPorOrgao(hoje) {
  return orgaos.map(function (orgao) {
    const indicador = novoIndicador(orgao.sigla);
    indicador.descricao = orgao.nome;
    chamados.forEach(function (c) {
      if (buscarCategoria(c.categoriaId).orgaoId === orgao.id) {
        somarNoIndicador(indicador, c, hoje);
      }
    });
    return indicador;
  });
}

function indicadoresPorCategoria(hoje) {
  return categorias.map(function (categoria) {
    const indicador = novoIndicador(categoria.nome);
    indicador.descricao = buscarOrgao(categoria.orgaoId).sigla + " · prazo de " + plural(categoria.prazoDias, "dia", "dias");
    chamados.forEach(function (c) {
      if (c.categoriaId === categoria.id) {
        somarNoIndicador(indicador, c, hoje);
      }
    });
    return indicador;
  });
}

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) {
    elemento.className = classe;
  }
  if (texto !== undefined && texto !== null) {
    elemento.textContent = texto;
  }
  return elemento;
}

function criarSelo(situacao) {
  return criarElemento("span", "selo selo-" + SITUACOES[situacao].classe, SITUACOES[situacao].nome);
}

function validarFoto(arquivo) {
  if (!arquivo) {
    return "";
  }
  if (arquivo.type.indexOf("image/") !== 0) {
    return "Escolha um arquivo de imagem, como JPG ou PNG.";
  }
  if (arquivo.size > 5 * 1024 * 1024) {
    return "A foto precisa ter no máximo 5 MB.";
  }
  return "";
}

function criarCampoDeFoto(id, rotulo) {
  const elemento = criarElemento("div", "campo campo-foto");
  const label = criarElemento("label", null, rotulo);
  label.htmlFor = id;
  const dica = criarElemento("p", "dica", "Opcional. Imagem de até 5 MB. Neste protótipo a foto não sai do seu aparelho: fica registrado só o nome do arquivo.");
  dica.id = "dica-" + id;
  const entrada = document.createElement("input");
  entrada.type = "file";
  entrada.id = id;
  entrada.name = id;
  entrada.accept = "image/*";
  entrada.setAttribute("aria-describedby", "dica-" + id + " erro-" + id);
  const erro = criarElemento("p", "erro-campo");
  erro.id = "erro-" + id;

  const previa = criarElemento("figure", "previa-foto");
  previa.hidden = true;
  const imagem = document.createElement("img");
  imagem.alt = "Prévia da foto escolhida";
  const legenda = criarElemento("figcaption");
  const remover = criarElemento("button", "botao-remover", "Remover foto");
  remover.type = "button";
  previa.appendChild(imagem);
  previa.appendChild(legenda);
  previa.appendChild(remover);

  function limpar() {
    entrada.value = "";
    erro.textContent = "";
    entrada.removeAttribute("aria-invalid");
    if (imagem.src) {
      URL.revokeObjectURL(imagem.src);
      imagem.removeAttribute("src");
    }
    previa.hidden = true;
  }

  entrada.addEventListener("change", function () {
    const arquivo = entrada.files[0];
    const mensagem = validarFoto(arquivo);
    if (!arquivo || mensagem) {
      limpar();
      erro.textContent = mensagem;
      if (mensagem) {
        entrada.setAttribute("aria-invalid", "true");
      }
      return;
    }
    erro.textContent = "";
    entrada.removeAttribute("aria-invalid");
    if (imagem.src) {
      URL.revokeObjectURL(imagem.src);
    }
    imagem.src = URL.createObjectURL(arquivo);
    legenda.textContent = arquivo.name + " (" + Math.max(1, Math.round(arquivo.size / 1024)) + " KB)";
    previa.hidden = false;
  });

  remover.addEventListener("click", function () {
    limpar();
    entrada.focus();
  });

  elemento.appendChild(label);
  elemento.appendChild(dica);
  elemento.appendChild(entrada);
  elemento.appendChild(erro);
  elemento.appendChild(previa);

  return {
    elemento: elemento,
    limpar: limpar,
    nomeDaFoto: function () {
      return entrada.files[0] ? entrada.files[0].name : null;
    }
  };
}

function criarIconeDaCategoria(categoria) {
  const icone = document.createElement("img");
  icone.className = "icone-categoria";
  icone.src = "img/categoria-" + categoria.id + ".svg";
  icone.alt = "";
  icone.width = 48;
  icone.height = 48;
  return icone;
}

function criarCartaoDeChamado(chamado, hoje, endereco, escolhido) {
  const categoria = buscarCategoria(chamado.categoriaId);
  const bairro = buscarBairro(chamado.bairroId);

  const artigo = criarElemento("article", escolhido ? "item-chamado escolhido" : "item-chamado");
  artigo.appendChild(criarIconeDaCategoria(categoria));

  const corpo = criarElemento("div", "item-corpo");
  const titulo = criarElemento("h3");
  const link = criarElemento("a", "item-link", categoria.nome);
  link.href = endereco;
  if (escolhido) {
    link.setAttribute("aria-current", "true");
  }
  titulo.appendChild(link);
  corpo.appendChild(titulo);

  const selos = criarElemento("p", "item-selos");
  selos.appendChild(criarSelo(chamado.situacao));
  if (estaForaDoPrazo(chamado, hoje)) {
    selos.appendChild(criarElemento("span", "etiqueta-prazo", "Fora do prazo"));
  }
  corpo.appendChild(selos);

  corpo.appendChild(criarElemento("p", null, chamado.endereco + " · " + bairro.nome));
  const meta = criarElemento("p", "meta");
  meta.appendChild(criarElemento("span", "protocolo", chamado.protocolo));
  meta.appendChild(document.createTextNode(" · aberto em " + formatarDataHora(chamado.abertura) + " · "
    + plural(diasCorridos(chamado, hoje), "dia corrido", "dias corridos")));
  corpo.appendChild(meta);

  artigo.appendChild(corpo);
  const seta = criarElemento("span", "item-seta");
  seta.setAttribute("aria-hidden", "true");
  artigo.appendChild(seta);
  return artigo;
}

function chamadosMaisRecentes() {
  const ordenados = chamados.slice();
  ordenados.sort(function (a, b) {
    if (a.abertura === b.abertura) {
      return b.id - a.id;
    }
    return a.abertura < b.abertura ? 1 : -1;
  });
  return ordenados;
}
