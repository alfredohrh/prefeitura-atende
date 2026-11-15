package br.com.gs.chamados.modelo;

public enum Situacao {

    ABERTO("Aberto"),
    RECEBIDO("Recebido pelo órgão"),
    EM_EXECUCAO("Em execução"),
    AGUARDANDO_CONFIRMACAO("Aguardando confirmação do cidadão"),
    RESOLVIDO("Resolvido"),
    CONTESTADO("Contestado pelo cidadão"),
    CANCELADO("Cancelado");

    private final String descricao;

    Situacao(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public boolean isFinal() {
        return this == RESOLVIDO || this == CANCELADO;
    }
}
