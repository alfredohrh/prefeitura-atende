package br.com.gs.chamados.menu;

import java.util.Scanner;

public class Leitor {

    private Scanner scanner;

    public Leitor(Scanner scanner) {
        this.scanner = scanner;
    }

    public String texto(String pergunta) {
        System.out.print(pergunta + ": ");
        if (!scanner.hasNextLine()) {
            return "";
        }
        return scanner.nextLine().trim();
    }

    public String textoOuAtual(String pergunta, String atual) {
        String digitado = texto(pergunta + " [" + atual + "]");
        if (digitado.isEmpty()) {
            return atual;
        }
        return digitado;
    }

    public int inteiro(String pergunta) {
        while (true) {
            String digitado = texto(pergunta);
            try {
                return Integer.parseInt(digitado);
            } catch (NumberFormatException e) {
                System.out.println("  Valor inválido: \"" + digitado + "\". Digite apenas números.");
                if (!scanner.hasNextLine()) {
                    return 0;
                }
            }
        }
    }

    public boolean confirma(String pergunta) {
        String resposta = texto(pergunta + " (s/n)").toLowerCase();
        return resposta.equals("s") || resposta.equals("sim");
    }
}
