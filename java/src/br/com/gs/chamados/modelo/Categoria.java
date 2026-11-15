package br.com.gs.chamados.modelo;

public class Categoria {

    private int id;
    private String nome;
    private int prazoDias;
    private Orgao orgao;

    public Categoria(int id, String nome, int prazoDias, Orgao orgao) {
        this.id = id;
        this.nome = nome;
        this.prazoDias = prazoDias;
        this.orgao = orgao;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getPrazoDias() {
        return prazoDias;
    }

    public void setPrazoDias(int prazoDias) {
        this.prazoDias = prazoDias;
    }

    public Orgao getOrgao() {
        return orgao;
    }

    public void setOrgao(Orgao orgao) {
        this.orgao = orgao;
    }

    @Override
    public String toString() {
        return nome + " (prazo de " + prazoDias + (prazoDias == 1 ? " dia, " : " dias, ") + orgao.getSigla() + ")";
    }
}
