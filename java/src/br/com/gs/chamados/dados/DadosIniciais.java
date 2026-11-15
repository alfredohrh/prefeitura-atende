package br.com.gs.chamados.dados;

import br.com.gs.chamados.modelo.Bairro;
import br.com.gs.chamados.modelo.Categoria;
import br.com.gs.chamados.modelo.Chamado;
import br.com.gs.chamados.modelo.Cidadao;
import br.com.gs.chamados.modelo.Orgao;
import br.com.gs.chamados.servico.CadastroServico;
import br.com.gs.chamados.servico.ChamadoServico;
import br.com.gs.chamados.servico.RegraException;

import java.time.LocalDateTime;

public class DadosIniciais {

    public static void carregar(CadastroServico cadastro, ChamadoServico chamados) throws RegraException {
        Orgao subprefeituras = cadastro.cadastrarOrgao("Secretaria Municipal das Subprefeituras", "SMSUB");
        Orgao spRegula = cadastro.cadastrarOrgao("Agência Reguladora de Serviços Públicos do Município", "SP Regula");

        Categoria buraco = cadastro.cadastrarCategoria("Tapa-buraco", 45, subprefeituras);
        Categoria lampada = cadastro.cadastrarCategoria("Lâmpada apagada", 1, spRegula);
        Categoria bueiro = cadastro.cadastrarCategoria("Limpeza de bueiro e boca de lobo", 5, subprefeituras);
        Categoria entulho = cadastro.cadastrarCategoria("Remoção de entulho em via pública", 5, subprefeituras);
        Categoria poda = cadastro.cadastrarCategoria("Poda de árvore em área pública", 120, subprefeituras);

        Bairro se = cadastro.cadastrarBairro("Sé", "Centro");
        Bairro butanta = cadastro.cadastrarBairro("Butantã", "Oeste");
        Bairro lapa = cadastro.cadastrarBairro("Lapa", "Oeste");
        Bairro vilaMariana = cadastro.cadastrarBairro("Vila Mariana", "Sul");
        Bairro casaVerde = cadastro.cadastrarBairro("Casa Verde", "Norte");
        Bairro santana = cadastro.cadastrarBairro("Santana", "Norte");

        Cidadao marina = cadastro.cadastrarCidadao("Marina Duarte Lopes", "marina.lopes@exemplo.com", "11 98888-0101");
        Cidadao caio = cadastro.cadastrarCidadao("Caio Henrique Prado", "caio.prado@exemplo.com", "11 97777-0202");
        Cidadao lucia = cadastro.cadastrarCidadao("Lúcia Ferraz Monteiro", "lucia.monteiro@exemplo.com", "11 96666-0303");
        Cidadao renato = cadastro.cadastrarCidadao("Renato Akira Sato", "renato.sato@exemplo.com", "11 95555-0404");
        Cidadao joana = cadastro.cadastrarCidadao("Joana Batista Reis", "joana.reis@exemplo.com", "11 94444-0505");
        cadastro.cadastrarCidadao("Otávio Nunes Barros", "otavio.barros@exemplo.com", "11 93333-0606");

        Chamado c;

        c = chamados.abrir(marina, buraco, butanta, "Rua Alvarenga, altura do 1200",
                "Buraco grande na faixa da direita, carros desviam para a contramão.", "fotos/2026-0001-antes.jpg", em(1, 10, 9, 10));
        chamados.receber(c, "Supervisão de Manutenção - Butantã", em(2, 10, 8, 30));
        chamados.iniciarExecucao(c, "Equipe de pavimentação - Butantã",
                "Serviço programado e equipe enviada ao local.", em(20, 10, 7, 45));
        chamados.encerrar(c, "Equipe de pavimentação - Butantã",
                "Buraco recortado e preenchido com massa asfáltica.", "fotos/2026-0001-depois.jpg", em(28, 10, 16, 20));
        chamados.confirmar(c, em(29, 10, 8, 5));

        c = chamados.abrir(caio, lampada, se, "Rua Tabatinguera, em frente ao 140",
                "Poste com a lâmpada apagada há três noites, trecho muito escuro.", "fotos/2026-0002-antes.jpg", em(3, 11, 19, 40));
        chamados.receber(c, "Central de iluminação pública", em(4, 11, 8, 0));
        chamados.iniciarExecucao(c, "Equipe de iluminação - Centro",
                "Equipe deslocada para troca da lâmpada.", em(4, 11, 14, 0));
        chamados.encerrar(c, "Equipe de iluminação - Centro",
                "Lâmpada substituída e poste testado.", "fotos/2026-0002-depois.jpg", em(4, 11, 21, 0));
        chamados.contestar(c, "A lâmpada acendeu por uma noite e voltou a apagar.", "fotos/2026-0002-contestacao.jpg", em(5, 11, 20, 15));
        chamados.iniciarExecucao(c, "Equipe de iluminação - Centro",
                "Retorno ao local para verificar o reator do poste.", em(6, 11, 10, 30));
        chamados.encerrar(c, "Equipe de iluminação - Centro",
                "Reator e lâmpada trocados, funcionamento conferido à noite.", "fotos/2026-0002-retorno.jpg",
                em(7, 11, 19, 30));
        chamados.confirmar(c, em(7, 11, 21, 10));

        c = chamados.abrir(lucia, bueiro, lapa, "Rua Guaicurus, esquina com Rua Faustolo",
                "Boca de lobo entupida com folhas e lixo, a esquina alaga quando chove.", em(20, 10, 11, 25));
        chamados.receber(c, "Supervisão de Manutenção - Lapa", em(21, 10, 9, 0));
        chamados.iniciarExecucao(c, "Equipe de drenagem - Lapa",
                "Limpeza programada com caminhão de hidrojato.", em(23, 10, 8, 15));
        chamados.encerrar(c, "Equipe de drenagem - Lapa",
                "Boca de lobo e ramal desobstruídos.", "fotos/2026-0003-depois.jpg", em(24, 10, 15, 40));
        chamados.confirmar(c, em(25, 10, 9, 30));

        c = chamados.abrir(renato, entulho, vilaMariana, "Rua Vergueiro, altura do 3100",
                "Monte de entulho de obra e um sofá velho ocupando a calçada inteira.", "fotos/2026-0004-antes.jpg", em(5, 11, 7, 50));
        chamados.receber(c, "Supervisão de Limpeza - Vila Mariana", em(6, 11, 10, 10));
        chamados.iniciarExecucao(c, "Equipe de remoção - Vila Mariana",
                "Remoção incluída na rota do caminhão da região.", em(12, 11, 8, 0));

        c = chamados.abrir(joana, poda, santana, "Rua Voluntários da Pátria, em frente ao 2500",
                "Galhos de uma árvore grande encostando na fiação e cobrindo a placa de trânsito.", em(15, 9, 14, 0));
        chamados.receber(c, "Supervisão de Áreas Verdes - Santana", em(18, 9, 9, 20));

        chamados.abrir(marina, buraco, casaVerde, "Avenida Casa Verde, altura do 1800",
                "Buraco perto do ponto de ônibus, os ônibus passam por cima e espirram água.", em(10, 11, 18, 5));

        c = chamados.abrir(caio, lampada, butanta, "Rua Camargo, em frente ao 300",
                "Duas lâmpadas apagadas em sequência na mesma quadra.", em(12, 11, 20, 15));
        chamados.receber(c, "Central de iluminação pública", em(13, 11, 7, 40));
        chamados.iniciarExecucao(c, "Equipe de iluminação - Oeste",
                "Equipe enviada para troca das duas lâmpadas.", em(13, 11, 15, 0));
        chamados.encerrar(c, "Equipe de iluminação - Oeste",
                "Duas lâmpadas substituídas.", "fotos/2026-0007-depois.jpg", em(13, 11, 22, 30));

        c = chamados.abrir(lucia, entulho, se, "Rua do Carmo, altura do 80",
                "Restos de reforma e sacos de cimento abandonados na calçada.", "fotos/2026-0008-antes.jpg", em(28, 10, 8, 30));
        chamados.receber(c, "Supervisão de Limpeza - Sé", em(28, 10, 13, 0));
        chamados.iniciarExecucao(c, "Equipe de remoção - Sé",
                "Caminhão enviado para a retirada do material.", em(30, 10, 9, 0));
        chamados.encerrar(c, "Equipe de remoção - Sé",
                "Entulho recolhido e calçada varrida.", "fotos/2026-0008-depois.jpg", em(31, 10, 11, 45));
        chamados.contestar(c, "Retiraram só os sacos, o entulho solto continua na calçada.", "fotos/2026-0008-contestacao.jpg", em(1, 11, 9, 10));

        c = chamados.abrir(renato, bueiro, vilaMariana, "Rua Domingos de Morais, altura do 2200",
                "Bueiro sem tampa e com mau cheiro forte perto da banca de jornal.", em(8, 11, 12, 0));
        chamados.cancelar(c, "Aberto em duplicidade, um vizinho já tinha registrado.", em(8, 11, 12, 40));

        c = chamados.abrir(joana, buraco, lapa, "Rua Clélia, altura do 900",
                "Asfalto cedendo ao lado do bueiro, o buraco aumenta a cada chuva.", em(5, 10, 10, 0));
        chamados.receber(c, "Supervisão de Manutenção - Lapa", em(7, 10, 9, 15));
        chamados.iniciarExecucao(c, "Equipe de pavimentação - Lapa",
                "Serviço programado após vistoria no local.", em(3, 11, 8, 0));
        chamados.encerrar(c, "Equipe de pavimentação - Lapa",
                "Base refeita e trecho recapeado.", "fotos/2026-0010-depois.jpg", em(10, 11, 17, 0));
        chamados.confirmar(c, em(11, 11, 7, 55));

        c = chamados.abrir(marina, lampada, santana, "Rua Alfredo Pujol, em frente ao 600",
                "Lâmpada piscando a noite toda em frente à escola.", em(20, 10, 18, 30));
        chamados.receber(c, "Central de iluminação pública", em(21, 10, 8, 10));
        chamados.iniciarExecucao(c, "Equipe de iluminação - Norte",
                "Equipe deslocada para troca da lâmpada.", em(21, 10, 13, 30));
        chamados.encerrar(c, "Equipe de iluminação - Norte",
                "Lâmpada e relé substituídos.", "fotos/2026-0011-depois.jpg", em(21, 10, 20, 0));
        chamados.confirmar(c, em(22, 10, 19, 45));

        c = chamados.abrir(caio, entulho, casaVerde, "Rua Zilda, altura do 450",
                "Entulho e galhos jogados na esquina, bloqueando a rampa de acessibilidade.", em(14, 10, 9, 0));
        chamados.receber(c, "Supervisão de Limpeza - Casa Verde", em(15, 10, 8, 30));
        chamados.iniciarExecucao(c, "Equipe de remoção - Casa Verde",
                "Retirada incluída na rota do dia.", em(16, 10, 7, 30));
        chamados.encerrar(c, "Equipe de remoção - Casa Verde",
                "Material recolhido e rampa liberada.", "fotos/2026-0012-depois.jpg", em(17, 10, 10, 15));
        chamados.confirmar(c, em(18, 10, 8, 0));
    }

    private static LocalDateTime em(int dia, int mes, int hora, int minuto) {
        return LocalDateTime.of(2026, mes, dia, hora, minuto);
    }
}
