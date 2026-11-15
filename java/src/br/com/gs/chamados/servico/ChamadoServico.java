package br.com.gs.chamados.servico;

import br.com.gs.chamados.modelo.Bairro;
import br.com.gs.chamados.modelo.Categoria;
import br.com.gs.chamados.modelo.Chamado;
import br.com.gs.chamados.modelo.Cidadao;
import br.com.gs.chamados.modelo.Movimentacao;
import br.com.gs.chamados.modelo.Situacao;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ChamadoServico {

    private List<Chamado> chamados = new ArrayList<>();
    private int proximoChamado = 1;
    private int proximaMovimentacao = 1;

    public Chamado abrir(Cidadao cidadao, Categoria categoria, Bairro bairro, String endereco,
                         String descricao, LocalDateTime quando) throws RegraException {
        return abrir(cidadao, categoria, bairro, endereco, descricao, null, quando);
    }

    public Chamado abrir(Cidadao cidadao, Categoria categoria, Bairro bairro, String endereco,
                         String descricao, String foto, LocalDateTime quando) throws RegraException {
        if (cidadao == null || categoria == null || bairro == null) {
            throw new RegraException("Cidadão, categoria e bairro são obrigatórios para abrir um chamado.");
        }
        String enderecoValido = validarEndereco(endereco);
        String descricaoValida = validarDescricao(descricao);
        String fotoValida = validarFoto(foto);
        for (Chamado c : chamados) {
            if (!c.getSituacao().isFinal() && c.getCategoria() == categoria && c.getBairro() == bairro
                    && c.getEndereco().equalsIgnoreCase(enderecoValido)) {
                throw new RegraException("Já existe um chamado em andamento para esse endereço e categoria: "
                        + c.getProtocolo() + ".");
            }
        }
        String protocolo = String.format("%d-%04d", quando.getYear(), proximoChamado);
        Chamado chamado = new Chamado(proximoChamado, protocolo, cidadao, categoria, bairro,
                enderecoValido, descricaoValida, quando);
        proximoChamado++;
        chamado.registrar(novaMovimentacao(quando, Situacao.ABERTO, cidadao.getNome(),
                "Chamado aberto pelo cidadão.", fotoValida));
        chamados.add(chamado);
        return chamado;
    }

    public void atualizar(Chamado chamado, String endereco, String descricao) throws RegraException {
        if (chamado.getSituacao() != Situacao.ABERTO) {
            throw new RegraException("Só é possível alterar o chamado enquanto ele está aberto. Situação atual: "
                    + chamado.getSituacao().getDescricao() + ".");
        }
        String enderecoValido = validarEndereco(endereco);
        String descricaoValida = validarDescricao(descricao);
        chamado.setEndereco(enderecoValido);
        chamado.setDescricao(descricaoValida);
    }

    public void receber(Chamado chamado, String responsavel, LocalDateTime quando) throws RegraException {
        exigirSituacao(chamado, "receber", Situacao.ABERTO);
        mover(chamado, quando, Situacao.RECEBIDO, validarResponsavel(responsavel),
                "Chamado recebido por " + chamado.getCategoria().getOrgao().getSigla() + ".", null);
    }

    public void iniciarExecucao(Chamado chamado, String responsavel, String descricao, LocalDateTime quando)
            throws RegraException {
        exigirSituacao(chamado, "iniciar a execução", Situacao.RECEBIDO, Situacao.CONTESTADO);
        mover(chamado, quando, Situacao.EM_EXECUCAO, validarResponsavel(responsavel),
                validarDescricao(descricao), null);
    }

    public void encerrar(Chamado chamado, String responsavel, String descricao, String evidencia,
                         LocalDateTime quando) throws RegraException {
        exigirSituacao(chamado, "encerrar", Situacao.EM_EXECUCAO);
        if (evidencia == null || evidencia.trim().length() < 5) {
            throw new RegraException("O órgão só pode encerrar o chamado informando a evidência do serviço "
                    + "(arquivo ou endereço da foto).");
        }
        mover(chamado, quando, Situacao.AGUARDANDO_CONFIRMACAO, validarResponsavel(responsavel),
                validarDescricao(descricao), evidencia.trim());
    }

    public void confirmar(Chamado chamado, LocalDateTime quando) throws RegraException {
        confirmar(chamado, null, quando);
    }

    public void confirmar(Chamado chamado, String foto, LocalDateTime quando) throws RegraException {
        exigirSituacao(chamado, "confirmar", Situacao.AGUARDANDO_CONFIRMACAO);
        mover(chamado, quando, Situacao.RESOLVIDO, chamado.getCidadao().getNome(),
                "O cidadão confirmou que o problema foi resolvido.", validarFoto(foto));
    }

    public void contestar(Chamado chamado, String motivo, LocalDateTime quando) throws RegraException {
        contestar(chamado, motivo, null, quando);
    }

    public void contestar(Chamado chamado, String motivo, String foto, LocalDateTime quando)
            throws RegraException {
        exigirSituacao(chamado, "contestar", Situacao.AGUARDANDO_CONFIRMACAO);
        if (motivo == null || motivo.trim().length() < 10) {
            throw new RegraException("Explique o motivo da contestação com pelo menos 10 caracteres.");
        }
        mover(chamado, quando, Situacao.CONTESTADO, chamado.getCidadao().getNome(), motivo.trim(),
                validarFoto(foto));
    }

    public void cancelar(Chamado chamado, String motivo, LocalDateTime quando) throws RegraException {
        exigirSituacao(chamado, "cancelar", Situacao.ABERTO);
        if (motivo == null || motivo.trim().length() < 5) {
            throw new RegraException("Informe o motivo do cancelamento com pelo menos 5 caracteres.");
        }
        mover(chamado, quando, Situacao.CANCELADO, chamado.getCidadao().getNome(), motivo.trim(), null);
    }

    public Chamado buscarPorProtocolo(String protocolo) throws RegraException {
        String procurado = protocolo == null ? "" : protocolo.trim();
        for (Chamado c : chamados) {
            if (c.getProtocolo().equals(procurado)) {
                return c;
            }
        }
        throw new RegraException("Não existe chamado com o protocolo \"" + procurado + "\".");
    }

    public List<Chamado> listar() {
        return chamados;
    }

    public List<Chamado> listarPorSituacao(Situacao situacao) {
        List<Chamado> filtrados = new ArrayList<>();
        for (Chamado c : chamados) {
            if (c.getSituacao() == situacao) {
                filtrados.add(c);
            }
        }
        return filtrados;
    }

    public List<Chamado> listarDoCidadao(Cidadao cidadao) {
        List<Chamado> filtrados = new ArrayList<>();
        for (Chamado c : chamados) {
            if (c.getCidadao() == cidadao) {
                filtrados.add(c);
            }
        }
        return filtrados;
    }

    private void mover(Chamado chamado, LocalDateTime quando, Situacao situacao, String responsavel,
                       String descricao, String evidencia) throws RegraException {
        if (quando.isBefore(chamado.getUltimaMovimentacao().getDataHora())) {
            throw new RegraException("A data informada é anterior à última movimentação do chamado.");
        }
        chamado.registrar(novaMovimentacao(quando, situacao, responsavel, descricao, evidencia));
    }

    private Movimentacao novaMovimentacao(LocalDateTime quando, Situacao situacao, String responsavel,
                                          String descricao, String evidencia) {
        Movimentacao movimentacao = new Movimentacao(proximaMovimentacao, quando, situacao, responsavel,
                descricao, evidencia);
        proximaMovimentacao++;
        return movimentacao;
    }

    private void exigirSituacao(Chamado chamado, String acao, Situacao... permitidas) throws RegraException {
        for (Situacao s : permitidas) {
            if (chamado.getSituacao() == s) {
                return;
            }
        }
        throw new RegraException("Não é possível " + acao + " o chamado " + chamado.getProtocolo()
                + " na situação \"" + chamado.getSituacao().getDescricao() + "\".");
    }

    private String validarEndereco(String endereco) throws RegraException {
        if (endereco == null || endereco.trim().length() < 5) {
            throw new RegraException("Informe o endereço com pelo menos 5 caracteres.");
        }
        return endereco.trim();
    }

    private String validarDescricao(String descricao) throws RegraException {
        if (descricao == null || descricao.trim().length() < 10) {
            throw new RegraException("A descrição precisa de pelo menos 10 caracteres.");
        }
        return descricao.trim();
    }

    private String validarFoto(String foto) throws RegraException {
        if (foto == null || foto.trim().isEmpty()) {
            return null;
        }
        String arquivo = foto.trim();
        String minusculo = arquivo.toLowerCase();
        if (arquivo.length() < 5 || !(minusculo.endsWith(".jpg") || minusculo.endsWith(".jpeg")
                || minusculo.endsWith(".png"))) {
            throw new RegraException("A foto deve ser um arquivo de imagem (.jpg, .jpeg ou .png).");
        }
        return arquivo;
    }

    private String validarResponsavel(String responsavel) throws RegraException {
        if (responsavel == null || responsavel.trim().length() < 3) {
            throw new RegraException("Informe o nome do responsável ou da equipe do órgão.");
        }
        return responsavel.trim();
    }
}
