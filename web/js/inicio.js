carregarDados();
iniciarRodape();

const hoje = diaDeHoje();
const geral = indicadorGeral(hoje);
const cancelados = chamados.filter(function (c) { return c.situacao === "CANCELADO"; }).length;

document.getElementById("numero-total").textContent = chamados.length;
document.getElementById("detalhe-total").textContent = cancelados > 0
  ? plural(cancelados, "cancelado fica", "cancelados ficam") + " fora dos indicadores"
  : "nenhum cancelado";

document.getElementById("numero-resolvidos").textContent = geral.resolvidos;
document.getElementById("detalhe-resolvidos").textContent = geral.resolvidos > 0
  ? "em média " + formatarDecimal(tempoMedio(geral)) + " dias da abertura ao encerramento"
  : "ainda sem resolução confirmada";

document.getElementById("numero-fora").textContent = geral.foraDoPrazo;
document.getElementById("detalhe-fora").textContent = "de " + plural(geral.total, "chamado considerado", "chamados considerados");

document.getElementById("numero-contestacao").textContent = formatarDecimal(taxaDeContestacao(geral)) + "%";
document.getElementById("detalhe-contestacao").textContent = geral.contestados + " de "
  + plural(geral.encerradosPeloOrgao, "chamado encerrado", "chamados encerrados") + " pelo órgão";

const listaCategorias = document.getElementById("categorias-inicio");
categorias.forEach(function (categoria) {
  const orgao = buscarOrgao(categoria.orgaoId);
  const quantidade = chamados.filter(function (c) { return c.categoriaId === categoria.id; }).length;

  const item = document.createElement("li");
  const link = criarElemento("a", "categoria-inicio");
  link.href = "chamados.html?categoria=" + categoria.id;
  link.appendChild(criarIconeDaCategoria(categoria));
  link.appendChild(criarElemento("strong", null, categoria.nome));
  link.appendChild(criarElemento("span", null, "Prazo de " + plural(categoria.prazoDias, "dia", "dias") + " · " + orgao.sigla));
  link.appendChild(criarElemento("span", "categoria-quantidade", plural(quantidade, "chamado", "chamados")));
  item.appendChild(link);
  listaCategorias.appendChild(item);
});

const listaRecentes = document.getElementById("chamados-recentes");
chamadosMaisRecentes().slice(0, 3).forEach(function (c) {
  const item = document.createElement("li");
  item.appendChild(criarCartaoDeChamado(c, hoje, "chamados.html#" + c.protocolo, false));
  listaRecentes.appendChild(item);
});

document.getElementById("data-calculo").textContent = "Calculado em " + formatarDia(hoje)
  + " a partir dos chamados guardados neste navegador. Detalhes no painel público.";
