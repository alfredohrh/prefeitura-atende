package br.com.gs.chamados.modelo;

public class Bairro {

    private int id;
    private String nome;
    private String regiao;

    public Bairro(int id, String nome, String regiao) {
        this.id = id;
        this.nome = nome;
        this.regiao = regiao;
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

    public String getRegiao() {
        return regiao;
    }

    public void setRegiao(String regiao) {
        this.regiao = regiao;
    }

    @Override
    public String toString() {
        return nome + " (" + regiao + ")";
    }
}
