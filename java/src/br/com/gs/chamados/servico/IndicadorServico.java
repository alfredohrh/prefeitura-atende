package br.com.gs.chamados.servico;

import br.com.gs.chamados.modelo.Categoria;
import br.com.gs.chamados.modelo.Chamado;
import br.com.gs.chamados.modelo.Orgao;
import br.com.gs.chamados.modelo.Situacao;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class IndicadorServico {

    private ChamadoServico chamadoServico;

    public IndicadorServico(ChamadoServico chamadoServico) {
        this.chamadoServico = chamadoServico;
    }

    public Indicador geral(LocalDate hoje) {
        Indicador indicador = new Indicador("Todos os chamados");
        for (Chamado c : chamadoServico.listar()) {
            somar(indicador, c, hoje);
        }
        return indicador;
    }

    public List<Indicador> porOrgao(List<Orgao> orgaos, LocalDate hoje) {
        List<Indicador> indicadores = new ArrayList<>();
        for (Orgao orgao : orgaos) {
            Indicador indicador = new Indicador(orgao.getSigla());
            for (Chamado c : chamadoServico.listar()) {
                if (c.getCategoria().getOrgao() == orgao) {
                    somar(indicador, c, hoje);
                }
            }
            indicadores.add(indicador);
        }
        return indicadores;
    }

    public List<Indicador> porCategoria(List<Categoria> categorias, LocalDate hoje) {
        List<Indicador> indicadores = new ArrayList<>();
        for (Categoria categoria : categorias) {
            Indicador indicador = new Indicador(categoria.getNome());
            for (Chamado c : chamadoServico.listar()) {
                if (c.getCategoria() == categoria) {
                    somar(indicador, c, hoje);
                }
            }
            indicadores.add(indicador);
        }
        return indicadores;
    }

    private void somar(Indicador indicador, Chamado chamado, LocalDate hoje) {
        if (chamado.getSituacao() == Situacao.CANCELADO) {
            return;
        }
        indicador.somarChamado(chamado.isForaDoPrazo(hoje), chamado.foiEncerradoPeloOrgao(),
                chamado.getContestacoes() > 0);
        if (chamado.getSituacao() == Situacao.RESOLVIDO) {
            indicador.somarResolucao(chamado.getDiasCorridos(hoje));
        }
    }
}
