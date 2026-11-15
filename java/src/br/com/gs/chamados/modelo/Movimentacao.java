package br.com.gs.chamados.modelo;

import java.time.LocalDateTime;

public class Movimentacao {

    private int id;
    private LocalDateTime dataHora;
    private Situacao situacao;
    private String responsavel;
    private String descricao;
    private String evidencia;

    public Movimentacao(int id, LocalDateTime dataHora, Situacao situacao, String responsavel,
                        String descricao, String evidencia) {
        this.id = id;
        this.dataHora = dataHora;
        this.situacao = situacao;
        this.responsavel = responsavel;
        this.descricao = descricao;
        this.evidencia = evidencia;
    }

    public int getId() {
        return id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public Situacao getSituacao() {
        return situacao;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getEvidencia() {
        return evidencia;
    }
}
