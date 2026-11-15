# Prefeitura Atende?

Global Solution 2026/2 da FIAP, tema **CitizenTech**. Turma 2ESOR, Engenharia de Software.

Acompanhamento público de chamados de zeladoria urbana: buraco na rua, lâmpada apagada, bueiro entupido, entulho na calçada e poda de árvore. O cidadão abre o chamado, vê com quem ele está e só ele pode dizer que o problema foi resolvido.

- Site publicado: (preencher com o endereço da Vercel)
- Vídeo pitch: (preencher com o link do vídeo)

## O problema

Quem pede um reparo à prefeitura hoje recebe, no máximo, um número de protocolo. Depois disso não sabe se o pedido chegou, qual órgão ficou responsável, há quanto tempo está parado nem se o prazo já passou. E quando o chamado aparece como "finalizado", ninguém pergunta ao morador se o serviço foi feito de verdade.

O cidadão beneficiado é o morador que depende do serviço público de zeladoria e não tem como cobrar.

## A solução

Cada chamado segue um caminho que fica registrado e é público:

1. **Aberto**: o cidadão informa categoria, bairro, endereço e descrição, e pode anexar uma foto. O protocolo sai com o órgão responsável e o prazo.
2. **Recebido** e **em execução**: cada passo do órgão entra na linha do tempo com data, hora e equipe responsável.
3. **Aguardando confirmação**: o órgão só consegue encerrar informando a evidência do serviço.
4. **Resolvido**: o chamado só passa a contar como resolvido quando o cidadão confirma.
5. **Contestado**: se o cidadão disser que não foi resolvido, o chamado volta para o órgão e a contestação entra na taxa dele.

Com isso o painel público mostra três números por órgão e por categoria: tempo médio de resolução, chamados fora do prazo e taxa de contestação.

## ODS

- **ODS 11, cidades e comunidades sustentáveis**: melhora a conservação dos espaços públicos e a resposta da cidade a quem mora nela.
- **ODS 10, redução das desigualdades**: dá o mesmo poder de cobrança a qualquer morador, de qualquer bairro, e deixa visível onde o atendimento demora mais.

## As três partes

O mesmo domínio aparece no Java, no banco e na web: Cidadão, Bairro, Órgão, Categoria, Chamado e Movimentação. As partes não são integradas entre si, como pede o enunciado.

### Java (pasta `java`)

Sistema no console, com menu e dados em listas.

- `modelo`: as entidades.
- `servico`: regras e validações (`CadastroServico`, `ChamadoServico`, `IndicadorServico`).
- `menu`: leitura do teclado e telas do console.
- `dados`: dados de exemplo carregados ao iniciar.

Para compilar e rodar, com o JDK 17 ou mais novo, dentro da pasta `java`:

```
javac -encoding UTF-8 -d out src/br/com/gs/chamados/*.java src/br/com/gs/chamados/dados/*.java src/br/com/gs/chamados/menu/*.java src/br/com/gs/chamados/modelo/*.java src/br/com/gs/chamados/servico/*.java
java -cp out br.com.gs.chamados.Main
```

Também dá para abrir a pasta `java` em uma IDE e executar a classe `Main`.

O menu permite abrir, listar, buscar, atualizar e cancelar chamados, registrar o andamento do órgão, confirmar ou contestar, cadastrar, atualizar e remover cidadãos e ver os indicadores.

### Banco de dados (pasta `banco`)

`script_banco.sql`, para Oracle. Cria as seis tabelas com chaves primárias, chaves estrangeiras, NOT NULL, UNIQUE e CHECK, insere os dados de exemplo e termina com cinco consultas com JOIN:

1. linha do tempo de um chamado, com o órgão responsável;
2. chamados em andamento que já passaram do prazo;
3. tempo médio de resolução por categoria;
4. taxa de contestação por órgão;
5. quantidade de chamados por bairro e situação.

A regra "o órgão não encerra sem evidência" também está no banco, como CHECK na tabela de movimentações.

### Web (pasta `web`)

Protótipo em HTML, CSS e JavaScript, sem biblioteca nem framework. Basta abrir o `index.html` no navegador.

- `index.html`: apresentação, números do dia, categorias e chamados recentes.
- `chamados.html`: lista com filtros por situação, categoria e bairro, busca por protocolo ou endereço e a linha do tempo de cada chamado. É aqui que o cidadão confirma, contesta ou cancela.
- `abrir.html`: formulário para abrir chamado, com validação dos campos.
- `painel.html`: indicadores gerais, por órgão e por categoria.

Os dados ficam em arrays de objetos em `js/dados.js`. O que for alterado no navegador é guardado no próprio navegador, e o botão "Restaurar dados de exemplo", no rodapé, volta ao estado inicial. A foto anexada é só ilustrativa: o protótipo guarda o nome do arquivo e não envia nada.

## Diagramas (pasta `diagramas`)

- `diagrama_classes.pdf` e `.png`: diagrama de classes UML do projeto Java.
- `diagrama_er.pdf` e `.png`: diagrama entidade-relacionamento do banco.

## Soluções existentes

Antes de definir a proposta, pesquisamos o que já existe:

- **Centrais 156** das prefeituras, como o [Portal SP156](https://sp156.prefeitura.sp.gov.br/portal/servicos) de São Paulo: recebem o pedido e permitem consultar a situação pelo protocolo.
- **[Colab](https://www.colab.com.br/)**: plataforma contratada por prefeituras para receber e organizar demandas dos cidadãos.
- **[Reclame Aqui](https://www.reclameaqui.com.br/)**: tem páginas de prefeituras com reclamações e nota de reputação.
- **[Fiscaliza Aí!](https://github.com/FoundersTech/fiscaliza-ai)**: projeto acadêmico em que o cidadão reporta problemas urbanos e a prefeitura recebe uma nota pública.

Nenhum código, tela ou texto dessas soluções foi usado. O que a nossa proposta acrescenta é o encerramento só com evidência, a confirmação pelo cidadão e a taxa de contestação pública por órgão e por categoria.

## Dados usados

- **Categorias e prazos**: Portal SP156 da Prefeitura de São Paulo e página de manutenção da iluminação pública da SP Regula. Tapa-buraco 45 dias, lâmpada apagada 24 horas, limpeza de bueiro e boca de lobo 5 dias, remoção de entulho em via pública 120 horas e poda de árvore em área pública 120 dias.
- **Prazo de resposta ao cidadão**: Lei 13.460/2017, que dá ao órgão público até 30 dias para responder, prorrogáveis por mais 30.
- **Cidadãos, endereços e chamados**: fictícios, criados para o exemplo.

## Uso de IA generativa

Usamos ferramentas de IA generativa como apoio na pesquisa de fontes, na discussão da ideia, na escrita e revisão do código, das páginas web e dos diagramas e na revisão dos textos. Tudo o que está no repositório foi lido, executado e testado pelo grupo.

## Integrantes

| Nome | RM |
|---|---|
| Alfredo Henrique Roeder Hilário | RM568450 |
| Alvaro Javam Cesar de Toledo Piza | RM567943 |
| Gabriel Baseggio | RM567806 |
