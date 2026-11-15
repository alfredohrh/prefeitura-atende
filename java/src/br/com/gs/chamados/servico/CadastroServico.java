package br.com.gs.chamados.servico;

import br.com.gs.chamados.modelo.Bairro;
import br.com.gs.chamados.modelo.Categoria;
import br.com.gs.chamados.modelo.Chamado;
import br.com.gs.chamados.modelo.Cidadao;
import br.com.gs.chamados.modelo.Orgao;

import java.util.ArrayList;
import java.util.List;

public class CadastroServico {

    private List<Bairro> bairros = new ArrayList<>();
    private List<Orgao> orgaos = new ArrayList<>();
    private List<Categoria> categorias = new ArrayList<>();
    private List<Cidadao> cidadaos = new ArrayList<>();
    private int proximoCidadao = 1;

    public Bairro cadastrarBairro(String nome, String regiao) throws RegraException {
        exigirTexto(nome, "nome do bairro", 2);
        exigirTexto(regiao, "região", 2);
        Bairro bairro = new Bairro(bairros.size() + 1, nome.trim(), regiao.trim());
        bairros.add(bairro);
        return bairro;
    }

    public Orgao cadastrarOrgao(String nome, String sigla) throws RegraException {
        exigirTexto(nome, "nome do órgão", 3);
        exigirTexto(sigla, "sigla", 2);
        Orgao orgao = new Orgao(orgaos.size() + 1, nome.trim(), sigla.trim());
        orgaos.add(orgao);
        return orgao;
    }

    public Categoria cadastrarCategoria(String nome, int prazoDias, Orgao orgao) throws RegraException {
        exigirTexto(nome, "nome da categoria", 3);
        if (prazoDias < 1) {
            throw new RegraException("O prazo da categoria deve ser de pelo menos 1 dia.");
        }
        if (orgao == null) {
            throw new RegraException("Toda categoria precisa de um órgão responsável.");
        }
        Categoria categoria = new Categoria(categorias.size() + 1, nome.trim(), prazoDias, orgao);
        categorias.add(categoria);
        return categoria;
    }

    public Cidadao cadastrarCidadao(String nome, String email, String telefone) throws RegraException {
        String emailValido = validarEmail(email);
        if (buscarCidadaoPorEmail(emailValido) != null) {
            throw new RegraException("Já existe um cidadão com o e-mail " + emailValido + ".");
        }
        Cidadao cidadao = new Cidadao(proximoCidadao, validarNome(nome), emailValido, validarTelefone(telefone));
        proximoCidadao++;
        cidadaos.add(cidadao);
        return cidadao;
    }

    public void atualizarCidadao(Cidadao cidadao, String nome, String email, String telefone) throws RegraException {
        String nomeValido = validarNome(nome);
        String emailValido = validarEmail(email);
        String telefoneValido = validarTelefone(telefone);
        Cidadao outro = buscarCidadaoPorEmail(emailValido);
        if (outro != null && outro != cidadao) {
            throw new RegraException("O e-mail " + emailValido + " já está em uso por outro cidadão.");
        }
        cidadao.setNome(nomeValido);
        cidadao.setEmail(emailValido);
        cidadao.setTelefone(telefoneValido);
    }

    public void removerCidadao(Cidadao cidadao, List<Chamado> chamadosDoCidadao) throws RegraException {
        if (!chamadosDoCidadao.isEmpty()) {
            throw new RegraException("Não é possível remover: o cidadão tem " + chamadosDoCidadao.size()
                    + " chamado(s) registrado(s) e o histórico não pode ser apagado.");
        }
        cidadaos.remove(cidadao);
    }

    public Cidadao buscarCidadao(int id) throws RegraException {
        for (Cidadao c : cidadaos) {
            if (c.getId() == id) {
                return c;
            }
        }
        throw new RegraException("Não existe cidadão com o código " + id + ".");
    }

    public List<Cidadao> buscarCidadaosPorNome(String trecho) {
        List<Cidadao> encontrados = new ArrayList<>();
        String procurado = trecho == null ? "" : trecho.trim().toLowerCase();
        for (Cidadao c : cidadaos) {
            if (c.getNome().toLowerCase().contains(procurado)) {
                encontrados.add(c);
            }
        }
        return encontrados;
    }

    public Categoria buscarCategoria(int id) throws RegraException {
        for (Categoria c : categorias) {
            if (c.getId() == id) {
                return c;
            }
        }
        throw new RegraException("Não existe categoria com o código " + id + ".");
    }

    public Bairro buscarBairro(int id) throws RegraException {
        for (Bairro b : bairros) {
            if (b.getId() == id) {
                return b;
            }
        }
        throw new RegraException("Não existe bairro com o código " + id + ".");
    }

    private Cidadao buscarCidadaoPorEmail(String email) {
        for (Cidadao c : cidadaos) {
            if (c.getEmail().equals(email)) {
                return c;
            }
        }
        return null;
    }

    private String validarNome(String nome) throws RegraException {
        exigirTexto(nome, "nome", 3);
        return nome.trim();
    }

    private String validarEmail(String email) throws RegraException {
        if (email == null || !email.trim().matches("[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+")) {
            throw new RegraException("E-mail inválido. Use o formato nome@dominio.com.");
        }
        return email.trim().toLowerCase();
    }

    private String validarTelefone(String telefone) throws RegraException {
        String digitos = telefone == null ? "" : telefone.replaceAll("\\D", "");
        if (digitos.length() < 10 || digitos.length() > 11) {
            throw new RegraException("Telefone inválido. Informe o DDD e o número (10 ou 11 dígitos).");
        }
        return digitos;
    }

    private void exigirTexto(String valor, String campo, int minimo) throws RegraException {
        if (valor == null || valor.trim().length() < minimo) {
            throw new RegraException("O campo " + campo + " precisa de pelo menos " + minimo + " caracteres.");
        }
    }

    public List<Bairro> getBairros() {
        return bairros;
    }

    public List<Orgao> getOrgaos() {
        return orgaos;
    }

    public List<Categoria> getCategorias() {
        return categorias;
    }

    public List<Cidadao> getCidadaos() {
        return cidadaos;
    }
}
