package br.com.gs.chamados.menu;

import br.com.gs.chamados.modelo.Bairro;
import br.com.gs.chamados.modelo.Categoria;
import br.com.gs.chamados.modelo.Chamado;
import br.com.gs.chamados.modelo.Cidadao;
import br.com.gs.chamados.modelo.Movimentacao;
import br.com.gs.chamados.modelo.Situacao;
import br.com.gs.chamados.servico.CadastroServico;
import br.com.gs.chamados.servico.ChamadoServico;
import br.com.gs.chamados.servico.Indicador;
import br.com.gs.chamados.servico.IndicadorServico;
import br.com.gs.chamados.servico.RegraException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class Menu {

    private static final DateTimeFormatter DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATA_HORA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private Leitor leitor;
    private CadastroServico cadastro;
    private ChamadoServico chamados;
    private IndicadorServico indicadores;

    public Menu(Leitor leitor, CadastroServico cadastro, ChamadoServico chamados, IndicadorServico indicadores) {
        this.leitor = leitor;
        this.cadastro = cadastro;
        this.chamados = chamados;
        this.indicadores = indicadores;
    }

    public void iniciar() {
        int opcao = -1;
        while (opcao != 0) {
            System.out.println();
            System.out.println("=========== PREFEITURA ATENDE? ===========");
            System.out.println(" 1 - Abrir chamado");
            System.out.println(" 2 - Listar chamados");
            System.out.println(" 3 - Buscar chamado por protocolo");
            System.out.println(" 4 - Atualizar chamado");
            System.out.println(" 5 - Registrar andamento (órgão)");
            System.out.println(" 6 - Confirmar ou contestar (cidadão)");
            System.out.println(" 7 - Cancelar chamado");
            System.out.println(" 8 - Cidadãos");
            System.out.println(" 9 - Indicadores públicos");
            System.out.println(" 0 - Sair");
            opcao = leitor.inteiro("Opção");
            try {
                switch (opcao) {
                    case 1:
                        abrirChamado();
                        break;
                    case 2:
                        listarChamados();
                        break;
                    case 3:
                        mostrarChamado(pedirChamado());
                        break;
                    case 4:
                        atualizarChamado();
                        break;
                    case 5:
                        registrarAndamento();
                        break;
                    case 6:
                        confirmarOuContestar();
                        break;
                    case 7:
                        cancelarChamado();
                        break;
                    case 8:
                        menuCidadaos();
                        break;
                    case 9:
                        mostrarIndicadores();
                        break;
                    case 0:
                        System.out.println("Até logo.");
                        break;
                    default:
                        System.out.println("  Opção inexistente. Escolha um número do menu.");
                }
            } catch (RegraException e) {
                System.out.println("  Não foi possível concluir: " + e.getMessage());
            }
        }
    }

    private void abrirChamado() throws RegraException {
        System.out.println();
        System.out.println("--- Abrir chamado ---");
        listarCidadaos(cadastro.getCidadaos());
        Cidadao cidadao = cadastro.buscarCidadao(leitor.inteiro("Código do cidadão"));
        for (Categoria c : cadastro.getCategorias()) {
            System.out.println("  " + c.getId() + " - " + c);
        }
        Categoria categoria = cadastro.buscarCategoria(leitor.inteiro("Código da categoria"));
        for (Bairro b : cadastro.getBairros()) {
            System.out.println("  " + b.getId() + " - " + b);
        }
        Bairro bairro = cadastro.buscarBairro(leitor.inteiro("Código do bairro"));
        String endereco = leitor.texto("Endereço do problema");
        String descricao = leitor.texto("Descrição do problema");
        String foto = leitor.texto("Foto do problema, arquivo .jpg ou .png (opcional, Enter para pular)");
        Chamado chamado = chamados.abrir(cidadao, categoria, bairro, endereco, descricao, foto, LocalDateTime.now());
        System.out.println("  Chamado aberto. Protocolo: " + chamado.getProtocolo()
                + " | Órgão responsável: " + categoria.getOrgao().getSigla()
                + " | Prazo: " + chamado.getPrazo().format(DATA));
    }

    private void listarChamados() {
        System.out.println();
        System.out.println("--- Listar chamados ---");
        System.out.println("  0 - Todos");
        Situacao[] situacoes = Situacao.values();
        for (int i = 0; i < situacoes.length; i++) {
            System.out.println("  " + (i + 1) + " - " + situacoes[i].getDescricao());
        }
        int filtro = leitor.inteiro("Filtrar por situação");
        List<Chamado> lista;
        if (filtro == 0) {
            lista = chamados.listar();
        } else if (filtro >= 1 && filtro <= situacoes.length) {
            lista = chamados.listarPorSituacao(situacoes[filtro - 1]);
        } else {
            System.out.println("  Filtro inexistente.");
            return;
        }
        if (lista.isEmpty()) {
            System.out.println("  Nenhum chamado encontrado.");
            return;
        }
        LocalDate hoje = LocalDate.now();
        System.out.printf("  %-10s %-34s %-13s %-34s %5s  %s%n",
                "Protocolo", "Categoria", "Bairro", "Situação", "Dias", "Prazo");
        for (Chamado c : lista) {
            System.out.printf("  %-10s %-34s %-13s %-34s %5d  %s%s%n",
                    c.getProtocolo(), c.getCategoria().getNome(), c.getBairro().getNome(),
                    c.getSituacao().getDescricao(), c.getDiasCorridos(hoje), c.getPrazo().format(DATA),
                    c.isForaDoPrazo(hoje) ? "  FORA DO PRAZO" : "");
        }
        System.out.println("  " + lista.size() + " chamado(s).");
    }

    private void mostrarChamado(Chamado c) {
        LocalDate hoje = LocalDate.now();
        System.out.println();
        System.out.println("  Protocolo:  " + c.getProtocolo());
        System.out.println("  Situação:   " + c.getSituacao().getDescricao());
        System.out.println("  Categoria:  " + c.getCategoria().getNome());
        System.out.println("  Órgão:      " + c.getCategoria().getOrgao());
        System.out.println("  Cidadão:    " + c.getCidadao().getNome());
        System.out.println("  Local:      " + c.getEndereco() + " - " + c.getBairro());
        System.out.println("  Descrição:  " + c.getDescricao());
        System.out.println("  Abertura:   " + c.getAbertura().format(DATA_HORA));
        System.out.println("  Prazo:      " + c.getPrazo().format(DATA)
                + (c.isForaDoPrazo(hoje) ? "  (FORA DO PRAZO)" : "  (dentro do prazo)"));
        System.out.println("  Dias:       " + c.getDiasCorridos(hoje) + " | Contestações: " + c.getContestacoes());
        System.out.println("  Linha do tempo:");
        for (Movimentacao m : c.getMovimentacoes()) {
            System.out.println("    " + m.getDataHora().format(DATA_HORA) + " | " + m.getSituacao().getDescricao()
                    + " | " + m.getResponsavel());
            System.out.println("        " + m.getDescricao());
            if (m.getEvidencia() != null) {
                System.out.println((m.getSituacao() == Situacao.AGUARDANDO_CONFIRMACAO
                        ? "        Evidência do órgão: " : "        Foto enviada pelo cidadão: ") + m.getEvidencia());
            }
        }
    }

    private void atualizarChamado() throws RegraException {
        System.out.println();
        System.out.println("--- Atualizar chamado ---");
        Chamado chamado = pedirChamado();
        System.out.println("  Deixe em branco para manter o valor atual.");
        String endereco = leitor.textoOuAtual("Endereço", chamado.getEndereco());
        String descricao = leitor.textoOuAtual("Descrição", chamado.getDescricao());
        chamados.atualizar(chamado, endereco, descricao);
        System.out.println("  Chamado " + chamado.getProtocolo() + " atualizado.");
    }

    private void registrarAndamento() throws RegraException {
        System.out.println();
        System.out.println("--- Registrar andamento (órgão) ---");
        Chamado chamado = pedirChamado();
        Situacao situacao = chamado.getSituacao();
        System.out.println("  Situação atual: " + situacao.getDescricao());
        if (situacao == Situacao.ABERTO) {
            String responsavel = leitor.texto("Equipe ou servidor que recebeu");
            chamados.receber(chamado, responsavel, LocalDateTime.now());
        } else if (situacao == Situacao.RECEBIDO || situacao == Situacao.CONTESTADO) {
            String responsavel = leitor.texto("Equipe ou servidor responsável");
            String descricao = leitor.texto("O que será feito");
            chamados.iniciarExecucao(chamado, responsavel, descricao, LocalDateTime.now());
        } else if (situacao == Situacao.EM_EXECUCAO) {
            String responsavel = leitor.texto("Equipe ou servidor responsável");
            String descricao = leitor.texto("O que foi feito");
            String evidencia = leitor.texto("Evidência (arquivo ou endereço da foto do depois)");
            chamados.encerrar(chamado, responsavel, descricao, evidencia, LocalDateTime.now());
        } else {
            throw new RegraException("não há andamento do órgão para registrar nessa situação.");
        }
        System.out.println("  Nova situação: " + chamado.getSituacao().getDescricao());
    }

    private void confirmarOuContestar() throws RegraException {
        System.out.println();
        System.out.println("--- Confirmar ou contestar (cidadão) ---");
        Chamado chamado = pedirChamado();
        Movimentacao ultima = chamado.getUltimaMovimentacao();
        if (chamado.getSituacao() == Situacao.AGUARDANDO_CONFIRMACAO) {
            System.out.println("  O órgão informou: " + ultima.getDescricao());
            System.out.println("  Evidência: " + ultima.getEvidencia());
        }
        if (leitor.confirma("O problema foi realmente resolvido?")) {
            String foto = leitor.texto("Foto de como ficou, arquivo .jpg ou .png (opcional, Enter para pular)");
            chamados.confirmar(chamado, foto, LocalDateTime.now());
        } else {
            String motivo = leitor.texto("Motivo da contestação");
            String foto = leitor.texto("Foto do problema que continua, arquivo .jpg ou .png (opcional, Enter para pular)");
            chamados.contestar(chamado, motivo, foto, LocalDateTime.now());
        }
        System.out.println("  Nova situação: " + chamado.getSituacao().getDescricao());
    }

    private void cancelarChamado() throws RegraException {
        System.out.println();
        System.out.println("--- Cancelar chamado ---");
        Chamado chamado = pedirChamado();
        String motivo = leitor.texto("Motivo do cancelamento");
        chamados.cancelar(chamado, motivo, LocalDateTime.now());
        System.out.println("  Chamado " + chamado.getProtocolo() + " cancelado. O registro continua no histórico.");
    }

    private void menuCidadaos() {
        int opcao = -1;
        while (opcao != 0) {
            System.out.println();
            System.out.println("--- Cidadãos ---");
            System.out.println(" 1 - Cadastrar");
            System.out.println(" 2 - Listar");
            System.out.println(" 3 - Buscar por nome");
            System.out.println(" 4 - Atualizar");
            System.out.println(" 5 - Remover");
            System.out.println(" 0 - Voltar");
            opcao = leitor.inteiro("Opção");
            try {
                switch (opcao) {
                    case 1:
                        Cidadao novo = cadastro.cadastrarCidadao(leitor.texto("Nome"), leitor.texto("E-mail"),
                                leitor.texto("Telefone com DDD"));
                        System.out.println("  Cidadão cadastrado com o código " + novo.getId() + ".");
                        break;
                    case 2:
                        listarCidadaos(cadastro.getCidadaos());
                        break;
                    case 3:
                        listarCidadaos(cadastro.buscarCidadaosPorNome(leitor.texto("Parte do nome")));
                        break;
                    case 4:
                        Cidadao cidadao = cadastro.buscarCidadao(leitor.inteiro("Código do cidadão"));
                        System.out.println("  Deixe em branco para manter o valor atual.");
                        cadastro.atualizarCidadao(cidadao,
                                leitor.textoOuAtual("Nome", cidadao.getNome()),
                                leitor.textoOuAtual("E-mail", cidadao.getEmail()),
                                leitor.textoOuAtual("Telefone com DDD", cidadao.getTelefone()));
                        System.out.println("  Cadastro atualizado.");
                        break;
                    case 5:
                        Cidadao removido = cadastro.buscarCidadao(leitor.inteiro("Código do cidadão"));
                        cadastro.removerCidadao(removido, chamados.listarDoCidadao(removido));
                        System.out.println("  Cidadão " + removido.getNome() + " removido.");
                        break;
                    case 0:
                        break;
                    default:
                        System.out.println("  Opção inexistente. Escolha um número do menu.");
                }
            } catch (RegraException e) {
                System.out.println("  Não foi possível concluir: " + e.getMessage());
            }
        }
    }

    private void listarCidadaos(List<Cidadao> lista) {
        if (lista.isEmpty()) {
            System.out.println("  Nenhum cidadão encontrado.");
            return;
        }
        for (Cidadao c : lista) {
            System.out.println("  " + c);
        }
    }

    private void mostrarIndicadores() {
        LocalDate hoje = LocalDate.now();
        System.out.println();
        System.out.println("--- Indicadores públicos em " + hoje.format(DATA) + " ---");
        imprimirCabecalho("Geral");
        imprimirIndicador(indicadores.geral(hoje));
        imprimirCabecalho("Por órgão");
        for (Indicador i : indicadores.porOrgao(cadastro.getOrgaos(), hoje)) {
            imprimirIndicador(i);
        }
        imprimirCabecalho("Por categoria");
        for (Indicador i : indicadores.porCategoria(cadastro.getCategorias(), hoje)) {
            imprimirIndicador(i);
        }
        System.out.println();
        System.out.println("  Tempo médio: dias entre a abertura e o encerramento confirmado pelo cidadão.");
        System.out.println("  Contestação: chamados encerrados pelo órgão que o cidadão contestou ao menos uma vez.");
        System.out.println("  Chamados cancelados não entram nos indicadores.");
    }

    private void imprimirCabecalho(String titulo) {
        System.out.println();
        System.out.printf("  %-36s %6s %10s %12s %11s %12s%n",
                titulo, "Total", "Resolvidos", "Tempo médio", "Fora prazo", "Contestação");
    }

    private void imprimirIndicador(Indicador i) {
        String tempo = i.getResolvidos() == 0 ? "-" : String.format("%.1f dias", i.getTempoMedio());
        String taxa = i.getEncerradosPeloOrgao() == 0 ? "-" : String.format("%.0f%%", i.getTaxaContestacao());
        System.out.printf("  %-36s %6d %10d %12s %11d %12s%n",
                i.getNome(), i.getTotal(), i.getResolvidos(), tempo, i.getForaDoPrazo(), taxa);
    }

    private Chamado pedirChamado() throws RegraException {
        return chamados.buscarPorProtocolo(leitor.texto("Protocolo (ex.: 2026-0001)"));
    }
}
