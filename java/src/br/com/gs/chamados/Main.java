package br.com.gs.chamados;

import br.com.gs.chamados.dados.DadosIniciais;
import br.com.gs.chamados.menu.Leitor;
import br.com.gs.chamados.menu.Menu;
import br.com.gs.chamados.servico.CadastroServico;
import br.com.gs.chamados.servico.ChamadoServico;
import br.com.gs.chamados.servico.IndicadorServico;
import br.com.gs.chamados.servico.RegraException;

import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        CadastroServico cadastro = new CadastroServico();
        ChamadoServico chamados = new ChamadoServico();
        IndicadorServico indicadores = new IndicadorServico(chamados);

        try {
            DadosIniciais.carregar(cadastro, chamados);
        } catch (RegraException e) {
            System.out.println("Erro ao carregar os dados de exemplo: " + e.getMessage());
            return;
        }

        Scanner scanner = new Scanner(System.in);
        Menu menu = new Menu(new Leitor(scanner), cadastro, chamados, indicadores);
        menu.iniciar();
        scanner.close();
    }
}
