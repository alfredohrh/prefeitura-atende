package br.com.gs.chamados.modelo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class Chamado {

    private int id;
    private String protocolo;
    private Cidadao cidadao;
    private Categoria categoria;
    private Bairro bairro;
    private String endereco;
    private String descricao;
    private LocalDateTime abertura;
    private Situacao situacao;
    private List<Movimentacao> movimentacoes = new ArrayList<>();

    public Chamado(int id, String protocolo, Cidadao cidadao, Categoria categoria, Bairro bairro,
                   String endereco, String descricao, LocalDateTime abertura) {
        this.id = id;
        this.protocolo = protocolo;
        this.cidadao = cidadao;
        this.categoria = categoria;
        this.bairro = bairro;
        this.endereco = endereco;
        this.descricao = descricao;
        this.abertura = abertura;
        this.situacao = Situacao.ABERTO;
    }

    public void registrar(Movimentacao movimentacao) {
        movimentacoes.add(movimentacao);
        situacao = movimentacao.getSituacao();
    }

    public Movimentacao getUltimaMovimentacao() {
        return movimentacoes.get(movimentacoes.size() - 1);
    }

    public LocalDate getPrazo() {
        return abertura.toLocalDate().plusDays(categoria.getPrazoDias());
    }

    public LocalDate getDataResolucao() {
        if (situacao != Situacao.RESOLVIDO) {
            return null;
        }
        LocalDate data = null;
        for (Movimentacao m : movimentacoes) {
            if (m.getSituacao() == Situacao.AGUARDANDO_CONFIRMACAO) {
                data = m.getDataHora().toLocalDate();
            }
        }
        return data;
    }

    private LocalDate getDataDeReferencia(LocalDate hoje) {
        if (situacao == Situacao.RESOLVIDO) {
            return getDataResolucao();
        }
        if (situacao == Situacao.CANCELADO || situacao == Situacao.AGUARDANDO_CONFIRMACAO) {
            return getUltimaMovimentacao().getDataHora().toLocalDate();
        }
        return hoje;
    }

    public long getDiasCorridos(LocalDate hoje) {
        return ChronoUnit.DAYS.between(abertura.toLocalDate(), getDataDeReferencia(hoje));
    }

    public boolean isForaDoPrazo(LocalDate hoje) {
        if (situacao == Situacao.CANCELADO) {
            return false;
        }
        return getDataDeReferencia(hoje).isAfter(getPrazo());
    }

    public int getContestacoes() {
        int total = 0;
        for (Movimentacao m : movimentacoes) {
            if (m.getSituacao() == Situacao.CONTESTADO) {
                total++;
            }
        }
        return total;
    }

    public boolean foiEncerradoPeloOrgao() {
        for (Movimentacao m : movimentacoes) {
            if (m.getSituacao() == Situacao.AGUARDANDO_CONFIRMACAO) {
                return true;
            }
        }
        return false;
    }

    public int getId() {
        return id;
    }

    public String getProtocolo() {
        return protocolo;
    }

    public Cidadao getCidadao() {
        return cidadao;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public Bairro getBairro() {
        return bairro;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getAbertura() {
        return abertura;
    }

    public Situacao getSituacao() {
        return situacao;
    }

    public List<Movimentacao> getMovimentacoes() {
        return movimentacoes;
    }
}
