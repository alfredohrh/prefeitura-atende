carregarDados();
iniciarRodape();

const hoje = diaDeHoje();

function porcentagem(parte, total) {
  if (total === 0) {
    return 0;
  }
  return 100 * parte / total;
}

function criarBarra(percentual, classeExtra) {
  const barra = criarElemento("span", classeExtra ? "barra " + classeExtra : "barra");
  barra.setAttribute("aria-hidden", "true");
  const cheia = criarElemento("span", "barra-cheia");
  cheia.style.width = Math.min(100, Math.max(0, percentual)) + "%";
  barra.appendChild(cheia);
  return barra;
}

const ROTULOS = ["Chamados", "Resolvidos", "Tempo médio", "Fora do prazo", "Taxa de contestação"];

function criarCelula(rotulo, texto, percentual, classeBarra) {
  const celula = criarElemento("td", "numero-tabela");
  celula.setAttribute("data-rotulo", rotulo);
  celula.appendChild(criarElemento("span", "valor-celula", texto));
  if (percentual !== null) {
    celula.appendChild(criarBarra(percentual, classeBarra));
  }
  return celula;
}

function preencherTabela(idCorpo, indicadores) {
  const corpo = document.getElementById(idCorpo);
  corpo.innerHTML = "";
  let maiorTempo = 0;
  indicadores.forEach(function (indicador) {
    if (tempoMedio(indicador) > maiorTempo) {
      maiorTempo = tempoMedio(indicador);
    }
  });

  indicadores.forEach(function (indicador) {
    const linha = document.createElement("tr");
    const cabecalho = criarElemento("th", null, indicador.nome);
    cabecalho.scope = "row";
    if (indicador.descricao) {
      cabecalho.appendChild(criarElemento("small", null, indicador.descricao));
    }
    linha.appendChild(cabecalho);

    linha.appendChild(criarCelula(ROTULOS[0], String(indicador.total), null));
    linha.appendChild(criarCelula(ROTULOS[1], indicador.resolvidos + " (" + formatarDecimal(porcentagem(indicador.resolvidos, indicador.total)) + "%)",
      porcentagem(indicador.resolvidos, indicador.total), ""));

    if (indicador.resolvidos === 0) {
      linha.appendChild(criarCelula(ROTULOS[2], "sem resolvidos", null));
    } else {
      linha.appendChild(criarCelula(ROTULOS[2], formatarDecimal(tempoMedio(indicador)) + " dias",
        porcentagem(tempoMedio(indicador), maiorTempo), ""));
    }

    linha.appendChild(criarCelula(ROTULOS[3], indicador.foraDoPrazo + " de " + indicador.total + " (" + formatarDecimal(porcentagem(indicador.foraDoPrazo, indicador.total)) + "%)",
      porcentagem(indicador.foraDoPrazo, indicador.total), "barra-alerta"));

    if (indicador.encerradosPeloOrgao === 0) {
      linha.appendChild(criarCelula(ROTULOS[4], "nenhum encerrado ainda", null));
    } else {
      linha.appendChild(criarCelula(ROTULOS[4], formatarDecimal(taxaDeContestacao(indicador)) + "% (" + indicador.contestados + " de "
        + indicador.encerradosPeloOrgao + ")", taxaDeContestacao(indicador), "barra-contestacao"));
    }
    corpo.appendChild(linha);
  });
}

const geral = indicadorGeral(hoje);
const cancelados = chamados.length - geral.total;

document.getElementById("data-painel").textContent = "Calculado em " + formatarDia(hoje) + ".";
document.getElementById("geral-total").textContent = geral.total;
document.getElementById("geral-total-detalhe").textContent = "de " + chamados.length + " registrados ("
  + plural(cancelados, "cancelado", "cancelados") + ")";
document.getElementById("geral-resolvidos").textContent = geral.resolvidos;
document.getElementById("geral-tempo").textContent = geral.resolvidos > 0 ? formatarDecimal(tempoMedio(geral)) : "-";
document.getElementById("geral-fora").textContent = geral.foraDoPrazo;
document.getElementById("geral-fora-detalhe").textContent = formatarDecimal(porcentagem(geral.foraDoPrazo, geral.total)) + "% dos considerados";
document.getElementById("geral-contestacao").textContent = formatarDecimal(taxaDeContestacao(geral)) + "%";
document.getElementById("geral-contestacao-detalhe").textContent = geral.contestados + " de "
  + plural(geral.encerradosPeloOrgao, "encerrado", "encerrados") + " pelo órgão";

preencherTabela("tabela-orgaos", indicadoresPorOrgao(hoje));
preencherTabela("tabela-categorias", indicadoresPorCategoria(hoje));

document.getElementById("legenda-prazos").textContent = categorias.map(function (categoria) {
  return categoria.nome + ": " + plural(categoria.prazoDias, "dia", "dias");
}).join("; ") + ". Prazos em dias corridos, conforme as categorias do Portal SP156.";
