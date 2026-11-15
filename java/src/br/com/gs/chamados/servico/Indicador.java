package br.com.gs.chamados.servico;

public class Indicador {

    private String nome;
    private int total;
    private int resolvidos;
    private int foraDoPrazo;
    private int encerradosPeloOrgao;
    private int contestados;
    private long diasParaResolver;

    public Indicador(String nome) {
        this.nome = nome;
    }

    void somarChamado(boolean foraDoPrazo, boolean encerradoPeloOrgao, boolean contestado) {
        total++;
        if (foraDoPrazo) {
            this.foraDoPrazo++;
        }
        if (encerradoPeloOrgao) {
            encerradosPeloOrgao++;
        }
        if (contestado) {
            contestados++;
        }
    }

    void somarResolucao(long dias) {
        resolvidos++;
        diasParaResolver += dias;
    }

    public double getTempoMedio() {
        if (resolvidos == 0) {
            return 0;
        }
        return (double) diasParaResolver / resolvidos;
    }

    public double getTaxaContestacao() {
        if (encerradosPeloOrgao == 0) {
            return 0;
        }
        return 100.0 * contestados / encerradosPeloOrgao;
    }

    public String getNome() {
        return nome;
    }

    public int getTotal() {
        return total;
    }

    public int getResolvidos() {
        return resolvidos;
    }

    public int getForaDoPrazo() {
        return foraDoPrazo;
    }

    public int getEncerradosPeloOrgao() {
        return encerradosPeloOrgao;
    }

    public int getContestados() {
        return contestados;
    }
}
