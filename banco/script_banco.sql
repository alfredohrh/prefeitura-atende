-- Global Solution 2026/2 - CitizenTech
-- Acompanhamento publico de chamados de zeladoria
-- Banco: Oracle

CREATE TABLE T_GS_ORGAO (
    id_orgao    NUMBER(4)      NOT NULL,
    nm_orgao    VARCHAR2(100)  NOT NULL,
    sg_orgao    VARCHAR2(15)   NOT NULL,
    CONSTRAINT PK_GS_ORGAO PRIMARY KEY (id_orgao),
    CONSTRAINT UN_GS_ORGAO_SIGLA UNIQUE (sg_orgao)
);

CREATE TABLE T_GS_BAIRRO (
    id_bairro   NUMBER(4)      NOT NULL,
    nm_bairro   VARCHAR2(60)   NOT NULL,
    ds_regiao   VARCHAR2(10)   NOT NULL,
    CONSTRAINT PK_GS_BAIRRO PRIMARY KEY (id_bairro),
    CONSTRAINT UN_GS_BAIRRO_NOME UNIQUE (nm_bairro),
    CONSTRAINT CK_GS_BAIRRO_REGIAO CHECK (ds_regiao IN ('Centro', 'Norte', 'Sul', 'Leste', 'Oeste'))
);

CREATE TABLE T_GS_CATEGORIA (
    id_categoria   NUMBER(4)     NOT NULL,
    nm_categoria   VARCHAR2(60)  NOT NULL,
    nr_prazo_dias  NUMBER(3)     NOT NULL,
    id_orgao       NUMBER(4)     NOT NULL,
    CONSTRAINT PK_GS_CATEGORIA PRIMARY KEY (id_categoria),
    CONSTRAINT UN_GS_CATEGORIA_NOME UNIQUE (nm_categoria),
    CONSTRAINT CK_GS_CATEGORIA_PRAZO CHECK (nr_prazo_dias >= 1),
    CONSTRAINT FK_GS_CATEGORIA_ORGAO FOREIGN KEY (id_orgao) REFERENCES T_GS_ORGAO (id_orgao)
);

CREATE TABLE T_GS_CIDADAO (
    id_cidadao   NUMBER(6)      NOT NULL,
    nm_cidadao   VARCHAR2(80)   NOT NULL,
    ds_email     VARCHAR2(80)   NOT NULL,
    nr_telefone  VARCHAR2(11)   NOT NULL,
    CONSTRAINT PK_GS_CIDADAO PRIMARY KEY (id_cidadao),
    CONSTRAINT UN_GS_CIDADAO_EMAIL UNIQUE (ds_email),
    CONSTRAINT CK_GS_CIDADAO_EMAIL CHECK (ds_email LIKE '%_@_%._%')
);

CREATE TABLE T_GS_CHAMADO (
    id_chamado    NUMBER(8)      NOT NULL,
    nr_protocolo  VARCHAR2(9)    NOT NULL,
    id_cidadao    NUMBER(6)      NOT NULL,
    id_categoria  NUMBER(4)      NOT NULL,
    id_bairro     NUMBER(4)      NOT NULL,
    ds_endereco   VARCHAR2(150)  NOT NULL,
    ds_problema   VARCHAR2(400)  NOT NULL,
    dt_abertura   DATE           NOT NULL,
    st_chamado    VARCHAR2(25)   NOT NULL,
    CONSTRAINT PK_GS_CHAMADO PRIMARY KEY (id_chamado),
    CONSTRAINT UN_GS_CHAMADO_PROTOCOLO UNIQUE (nr_protocolo),
    CONSTRAINT CK_GS_CHAMADO_SITUACAO CHECK (st_chamado IN ('ABERTO', 'RECEBIDO', 'EM_EXECUCAO',
        'AGUARDANDO_CONFIRMACAO', 'RESOLVIDO', 'CONTESTADO', 'CANCELADO')),
    CONSTRAINT FK_GS_CHAMADO_CIDADAO FOREIGN KEY (id_cidadao) REFERENCES T_GS_CIDADAO (id_cidadao),
    CONSTRAINT FK_GS_CHAMADO_CATEGORIA FOREIGN KEY (id_categoria) REFERENCES T_GS_CATEGORIA (id_categoria),
    CONSTRAINT FK_GS_CHAMADO_BAIRRO FOREIGN KEY (id_bairro) REFERENCES T_GS_BAIRRO (id_bairro)
);

CREATE TABLE T_GS_MOVIMENTACAO (
    id_movimentacao  NUMBER(10)     NOT NULL,
    id_chamado       NUMBER(8)      NOT NULL,
    dt_movimentacao  DATE           NOT NULL,
    st_chamado       VARCHAR2(25)   NOT NULL,
    nm_responsavel   VARCHAR2(80)   NOT NULL,
    ds_movimentacao  VARCHAR2(400)  NOT NULL,
    ds_evidencia     VARCHAR2(150),
    CONSTRAINT PK_GS_MOVIMENTACAO PRIMARY KEY (id_movimentacao),
    CONSTRAINT FK_GS_MOVIMENTACAO_CHAMADO FOREIGN KEY (id_chamado) REFERENCES T_GS_CHAMADO (id_chamado),
    CONSTRAINT CK_GS_MOVIMENTACAO_SITUACAO CHECK (st_chamado IN ('ABERTO', 'RECEBIDO', 'EM_EXECUCAO',
        'AGUARDANDO_CONFIRMACAO', 'RESOLVIDO', 'CONTESTADO', 'CANCELADO')),
    CONSTRAINT CK_GS_MOVIMENTACAO_EVIDENCIA CHECK (st_chamado <> 'AGUARDANDO_CONFIRMACAO' OR ds_evidencia IS NOT NULL)
);


INSERT INTO T_GS_ORGAO VALUES (1, 'Secretaria Municipal das Subprefeituras', 'SMSUB');
INSERT INTO T_GS_ORGAO VALUES (2, 'Agência Reguladora de Serviços Públicos do Município', 'SP Regula');

INSERT INTO T_GS_BAIRRO VALUES (1, 'Sé', 'Centro');
INSERT INTO T_GS_BAIRRO VALUES (2, 'Butantã', 'Oeste');
INSERT INTO T_GS_BAIRRO VALUES (3, 'Lapa', 'Oeste');
INSERT INTO T_GS_BAIRRO VALUES (4, 'Vila Mariana', 'Sul');
INSERT INTO T_GS_BAIRRO VALUES (5, 'Casa Verde', 'Norte');
INSERT INTO T_GS_BAIRRO VALUES (6, 'Santana', 'Norte');

INSERT INTO T_GS_CATEGORIA VALUES (1, 'Tapa-buraco', 45, 1);
INSERT INTO T_GS_CATEGORIA VALUES (2, 'Lâmpada apagada', 1, 2);
INSERT INTO T_GS_CATEGORIA VALUES (3, 'Limpeza de bueiro e boca de lobo', 5, 1);
INSERT INTO T_GS_CATEGORIA VALUES (4, 'Remoção de entulho em via pública', 5, 1);
INSERT INTO T_GS_CATEGORIA VALUES (5, 'Poda de árvore em área pública', 120, 1);

INSERT INTO T_GS_CIDADAO VALUES (1, 'Marina Duarte Lopes', 'marina.lopes@exemplo.com', '11988880101');
INSERT INTO T_GS_CIDADAO VALUES (2, 'Caio Henrique Prado', 'caio.prado@exemplo.com', '11977770202');
INSERT INTO T_GS_CIDADAO VALUES (3, 'Lúcia Ferraz Monteiro', 'lucia.monteiro@exemplo.com', '11966660303');
INSERT INTO T_GS_CIDADAO VALUES (4, 'Renato Akira Sato', 'renato.sato@exemplo.com', '11955550404');
INSERT INTO T_GS_CIDADAO VALUES (5, 'Joana Batista Reis', 'joana.reis@exemplo.com', '11944440505');
INSERT INTO T_GS_CIDADAO VALUES (6, 'Otávio Nunes Barros', 'otavio.barros@exemplo.com', '11933330606');

INSERT INTO T_GS_CHAMADO VALUES (1, '2026-0001', 1, 1, 2, 'Rua Alvarenga, altura do 1200', 'Buraco grande na faixa da direita, carros desviam para a contramão.', TO_DATE('01/10/2026 09:10', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO');
INSERT INTO T_GS_CHAMADO VALUES (2, '2026-0002', 2, 2, 1, 'Rua Tabatinguera, em frente ao 140', 'Poste com a lâmpada apagada há três noites, trecho muito escuro.', TO_DATE('03/11/2026 19:40', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO');
INSERT INTO T_GS_CHAMADO VALUES (3, '2026-0003', 3, 3, 3, 'Rua Guaicurus, esquina com Rua Faustolo', 'Boca de lobo entupida com folhas e lixo, a esquina alaga quando chove.', TO_DATE('20/10/2026 11:25', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO');
INSERT INTO T_GS_CHAMADO VALUES (4, '2026-0004', 4, 4, 4, 'Rua Vergueiro, altura do 3100', 'Monte de entulho de obra e um sofá velho ocupando a calçada inteira.', TO_DATE('05/11/2026 07:50', 'DD/MM/YYYY HH24:MI'), 'EM_EXECUCAO');
INSERT INTO T_GS_CHAMADO VALUES (5, '2026-0005', 5, 5, 6, 'Rua Voluntários da Pátria, em frente ao 2500', 'Galhos de uma árvore grande encostando na fiação e cobrindo a placa de trânsito.', TO_DATE('15/09/2026 14:00', 'DD/MM/YYYY HH24:MI'), 'RECEBIDO');
INSERT INTO T_GS_CHAMADO VALUES (6, '2026-0006', 1, 1, 5, 'Avenida Casa Verde, altura do 1800', 'Buraco perto do ponto de ônibus, os ônibus passam por cima e espirram água.', TO_DATE('10/11/2026 18:05', 'DD/MM/YYYY HH24:MI'), 'ABERTO');
INSERT INTO T_GS_CHAMADO VALUES (7, '2026-0007', 2, 2, 2, 'Rua Camargo, em frente ao 300', 'Duas lâmpadas apagadas em sequência na mesma quadra.', TO_DATE('12/11/2026 20:15', 'DD/MM/YYYY HH24:MI'), 'AGUARDANDO_CONFIRMACAO');
INSERT INTO T_GS_CHAMADO VALUES (8, '2026-0008', 3, 4, 1, 'Rua do Carmo, altura do 80', 'Restos de reforma e sacos de cimento abandonados na calçada.', TO_DATE('28/10/2026 08:30', 'DD/MM/YYYY HH24:MI'), 'CONTESTADO');
INSERT INTO T_GS_CHAMADO VALUES (9, '2026-0009', 4, 3, 4, 'Rua Domingos de Morais, altura do 2200', 'Bueiro sem tampa e com mau cheiro forte perto da banca de jornal.', TO_DATE('08/11/2026 12:00', 'DD/MM/YYYY HH24:MI'), 'CANCELADO');
INSERT INTO T_GS_CHAMADO VALUES (10, '2026-0010', 5, 1, 3, 'Rua Clélia, altura do 900', 'Asfalto cedendo ao lado do bueiro, o buraco aumenta a cada chuva.', TO_DATE('05/10/2026 10:00', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO');
INSERT INTO T_GS_CHAMADO VALUES (11, '2026-0011', 1, 2, 6, 'Rua Alfredo Pujol, em frente ao 600', 'Lâmpada piscando a noite toda em frente à escola.', TO_DATE('20/10/2026 18:30', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO');
INSERT INTO T_GS_CHAMADO VALUES (12, '2026-0012', 2, 4, 5, 'Rua Zilda, altura do 450', 'Entulho e galhos jogados na esquina, bloqueando a rampa de acessibilidade.', TO_DATE('14/10/2026 09:00', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO');

INSERT INTO T_GS_MOVIMENTACAO VALUES (1, 1, TO_DATE('01/10/2026 09:10', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Marina Duarte Lopes', 'Chamado aberto pelo cidadão.', 'fotos/2026-0001-antes.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (2, 1, TO_DATE('02/10/2026 08:30', 'DD/MM/YYYY HH24:MI'), 'RECEBIDO', 'Supervisão de Manutenção - Butantã', 'Chamado recebido por SMSUB.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (3, 1, TO_DATE('20/10/2026 07:45', 'DD/MM/YYYY HH24:MI'), 'EM_EXECUCAO', 'Equipe de pavimentação - Butantã', 'Serviço programado e equipe enviada ao local.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (4, 1, TO_DATE('28/10/2026 16:20', 'DD/MM/YYYY HH24:MI'), 'AGUARDANDO_CONFIRMACAO', 'Equipe de pavimentação - Butantã', 'Buraco recortado e preenchido com massa asfáltica.', 'fotos/2026-0001-depois.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (5, 1, TO_DATE('29/10/2026 08:05', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO', 'Marina Duarte Lopes', 'O cidadão confirmou que o problema foi resolvido.', NULL);

INSERT INTO T_GS_MOVIMENTACAO VALUES (6, 2, TO_DATE('03/11/2026 19:40', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Caio Henrique Prado', 'Chamado aberto pelo cidadão.', 'fotos/2026-0002-antes.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (7, 2, TO_DATE('04/11/2026 08:00', 'DD/MM/YYYY HH24:MI'), 'RECEBIDO', 'Central de iluminação pública', 'Chamado recebido por SP Regula.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (8, 2, TO_DATE('04/11/2026 14:00', 'DD/MM/YYYY HH24:MI'), 'EM_EXECUCAO', 'Equipe de iluminação - Centro', 'Equipe deslocada para troca da lâmpada.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (9, 2, TO_DATE('04/11/2026 21:00', 'DD/MM/YYYY HH24:MI'), 'AGUARDANDO_CONFIRMACAO', 'Equipe de iluminação - Centro', 'Lâmpada substituída e poste testado.', 'fotos/2026-0002-depois.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (10, 2, TO_DATE('05/11/2026 20:15', 'DD/MM/YYYY HH24:MI'), 'CONTESTADO', 'Caio Henrique Prado', 'A lâmpada acendeu por uma noite e voltou a apagar.', 'fotos/2026-0002-contestacao.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (11, 2, TO_DATE('06/11/2026 10:30', 'DD/MM/YYYY HH24:MI'), 'EM_EXECUCAO', 'Equipe de iluminação - Centro', 'Retorno ao local para verificar o reator do poste.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (12, 2, TO_DATE('07/11/2026 19:30', 'DD/MM/YYYY HH24:MI'), 'AGUARDANDO_CONFIRMACAO', 'Equipe de iluminação - Centro', 'Reator e lâmpada trocados, funcionamento conferido à noite.', 'fotos/2026-0002-retorno.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (13, 2, TO_DATE('07/11/2026 21:10', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO', 'Caio Henrique Prado', 'O cidadão confirmou que o problema foi resolvido.', NULL);

INSERT INTO T_GS_MOVIMENTACAO VALUES (14, 3, TO_DATE('20/10/2026 11:25', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Lúcia Ferraz Monteiro', 'Chamado aberto pelo cidadão.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (15, 3, TO_DATE('21/10/2026 09:00', 'DD/MM/YYYY HH24:MI'), 'RECEBIDO', 'Supervisão de Manutenção - Lapa', 'Chamado recebido por SMSUB.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (16, 3, TO_DATE('23/10/2026 08:15', 'DD/MM/YYYY HH24:MI'), 'EM_EXECUCAO', 'Equipe de drenagem - Lapa', 'Limpeza programada com caminhão de hidrojato.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (17, 3, TO_DATE('24/10/2026 15:40', 'DD/MM/YYYY HH24:MI'), 'AGUARDANDO_CONFIRMACAO', 'Equipe de drenagem - Lapa', 'Boca de lobo e ramal desobstruídos.', 'fotos/2026-0003-depois.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (18, 3, TO_DATE('25/10/2026 09:30', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO', 'Lúcia Ferraz Monteiro', 'O cidadão confirmou que o problema foi resolvido.', NULL);

INSERT INTO T_GS_MOVIMENTACAO VALUES (19, 4, TO_DATE('05/11/2026 07:50', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Renato Akira Sato', 'Chamado aberto pelo cidadão.', 'fotos/2026-0004-antes.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (20, 4, TO_DATE('06/11/2026 10:10', 'DD/MM/YYYY HH24:MI'), 'RECEBIDO', 'Supervisão de Limpeza - Vila Mariana', 'Chamado recebido por SMSUB.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (21, 4, TO_DATE('12/11/2026 08:00', 'DD/MM/YYYY HH24:MI'), 'EM_EXECUCAO', 'Equipe de remoção - Vila Mariana', 'Remoção incluída na rota do caminhão da região.', NULL);

INSERT INTO T_GS_MOVIMENTACAO VALUES (22, 5, TO_DATE('15/09/2026 14:00', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Joana Batista Reis', 'Chamado aberto pelo cidadão.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (23, 5, TO_DATE('18/09/2026 09:20', 'DD/MM/YYYY HH24:MI'), 'RECEBIDO', 'Supervisão de Áreas Verdes - Santana', 'Chamado recebido por SMSUB.', NULL);

INSERT INTO T_GS_MOVIMENTACAO VALUES (24, 6, TO_DATE('10/11/2026 18:05', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Marina Duarte Lopes', 'Chamado aberto pelo cidadão.', NULL);

INSERT INTO T_GS_MOVIMENTACAO VALUES (25, 7, TO_DATE('12/11/2026 20:15', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Caio Henrique Prado', 'Chamado aberto pelo cidadão.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (26, 7, TO_DATE('13/11/2026 07:40', 'DD/MM/YYYY HH24:MI'), 'RECEBIDO', 'Central de iluminação pública', 'Chamado recebido por SP Regula.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (27, 7, TO_DATE('13/11/2026 15:00', 'DD/MM/YYYY HH24:MI'), 'EM_EXECUCAO', 'Equipe de iluminação - Oeste', 'Equipe enviada para troca das duas lâmpadas.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (28, 7, TO_DATE('13/11/2026 22:30', 'DD/MM/YYYY HH24:MI'), 'AGUARDANDO_CONFIRMACAO', 'Equipe de iluminação - Oeste', 'Duas lâmpadas substituídas.', 'fotos/2026-0007-depois.jpg');

INSERT INTO T_GS_MOVIMENTACAO VALUES (29, 8, TO_DATE('28/10/2026 08:30', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Lúcia Ferraz Monteiro', 'Chamado aberto pelo cidadão.', 'fotos/2026-0008-antes.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (30, 8, TO_DATE('28/10/2026 13:00', 'DD/MM/YYYY HH24:MI'), 'RECEBIDO', 'Supervisão de Limpeza - Sé', 'Chamado recebido por SMSUB.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (31, 8, TO_DATE('30/10/2026 09:00', 'DD/MM/YYYY HH24:MI'), 'EM_EXECUCAO', 'Equipe de remoção - Sé', 'Caminhão enviado para a retirada do material.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (32, 8, TO_DATE('31/10/2026 11:45', 'DD/MM/YYYY HH24:MI'), 'AGUARDANDO_CONFIRMACAO', 'Equipe de remoção - Sé', 'Entulho recolhido e calçada varrida.', 'fotos/2026-0008-depois.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (33, 8, TO_DATE('01/11/2026 09:10', 'DD/MM/YYYY HH24:MI'), 'CONTESTADO', 'Lúcia Ferraz Monteiro', 'Retiraram só os sacos, o entulho solto continua na calçada.', 'fotos/2026-0008-contestacao.jpg');

INSERT INTO T_GS_MOVIMENTACAO VALUES (34, 9, TO_DATE('08/11/2026 12:00', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Renato Akira Sato', 'Chamado aberto pelo cidadão.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (35, 9, TO_DATE('08/11/2026 12:40', 'DD/MM/YYYY HH24:MI'), 'CANCELADO', 'Renato Akira Sato', 'Aberto em duplicidade, um vizinho já tinha registrado.', NULL);

INSERT INTO T_GS_MOVIMENTACAO VALUES (36, 10, TO_DATE('05/10/2026 10:00', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Joana Batista Reis', 'Chamado aberto pelo cidadão.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (37, 10, TO_DATE('07/10/2026 09:15', 'DD/MM/YYYY HH24:MI'), 'RECEBIDO', 'Supervisão de Manutenção - Lapa', 'Chamado recebido por SMSUB.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (38, 10, TO_DATE('03/11/2026 08:00', 'DD/MM/YYYY HH24:MI'), 'EM_EXECUCAO', 'Equipe de pavimentação - Lapa', 'Serviço programado após vistoria no local.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (39, 10, TO_DATE('10/11/2026 17:00', 'DD/MM/YYYY HH24:MI'), 'AGUARDANDO_CONFIRMACAO', 'Equipe de pavimentação - Lapa', 'Base refeita e trecho recapeado.', 'fotos/2026-0010-depois.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (40, 10, TO_DATE('11/11/2026 07:55', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO', 'Joana Batista Reis', 'O cidadão confirmou que o problema foi resolvido.', NULL);

INSERT INTO T_GS_MOVIMENTACAO VALUES (41, 11, TO_DATE('20/10/2026 18:30', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Marina Duarte Lopes', 'Chamado aberto pelo cidadão.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (42, 11, TO_DATE('21/10/2026 08:10', 'DD/MM/YYYY HH24:MI'), 'RECEBIDO', 'Central de iluminação pública', 'Chamado recebido por SP Regula.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (43, 11, TO_DATE('21/10/2026 13:30', 'DD/MM/YYYY HH24:MI'), 'EM_EXECUCAO', 'Equipe de iluminação - Norte', 'Equipe deslocada para troca da lâmpada.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (44, 11, TO_DATE('21/10/2026 20:00', 'DD/MM/YYYY HH24:MI'), 'AGUARDANDO_CONFIRMACAO', 'Equipe de iluminação - Norte', 'Lâmpada e relé substituídos.', 'fotos/2026-0011-depois.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (45, 11, TO_DATE('22/10/2026 19:45', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO', 'Marina Duarte Lopes', 'O cidadão confirmou que o problema foi resolvido.', NULL);

INSERT INTO T_GS_MOVIMENTACAO VALUES (46, 12, TO_DATE('14/10/2026 09:00', 'DD/MM/YYYY HH24:MI'), 'ABERTO', 'Caio Henrique Prado', 'Chamado aberto pelo cidadão.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (47, 12, TO_DATE('15/10/2026 08:30', 'DD/MM/YYYY HH24:MI'), 'RECEBIDO', 'Supervisão de Limpeza - Casa Verde', 'Chamado recebido por SMSUB.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (48, 12, TO_DATE('16/10/2026 07:30', 'DD/MM/YYYY HH24:MI'), 'EM_EXECUCAO', 'Equipe de remoção - Casa Verde', 'Retirada incluída na rota do dia.', NULL);
INSERT INTO T_GS_MOVIMENTACAO VALUES (49, 12, TO_DATE('17/10/2026 10:15', 'DD/MM/YYYY HH24:MI'), 'AGUARDANDO_CONFIRMACAO', 'Equipe de remoção - Casa Verde', 'Material recolhido e rampa liberada.', 'fotos/2026-0012-depois.jpg');
INSERT INTO T_GS_MOVIMENTACAO VALUES (50, 12, TO_DATE('18/10/2026 08:00', 'DD/MM/YYYY HH24:MI'), 'RESOLVIDO', 'Caio Henrique Prado', 'O cidadão confirmou que o problema foi resolvido.', NULL);

COMMIT;


-- Consulta 1: linha do tempo de um chamado, com o orgao responsavel
SELECT c.nr_protocolo,
       o.sg_orgao,
       TO_CHAR(m.dt_movimentacao, 'DD/MM/YYYY HH24:MI') AS dt_movimentacao,
       m.st_chamado,
       m.nm_responsavel,
       m.ds_movimentacao,
       m.ds_evidencia
  FROM T_GS_CHAMADO c
  JOIN T_GS_CATEGORIA cat ON cat.id_categoria = c.id_categoria
  JOIN T_GS_ORGAO o ON o.id_orgao = cat.id_orgao
  JOIN T_GS_MOVIMENTACAO m ON m.id_chamado = c.id_chamado
 WHERE c.nr_protocolo = '2026-0002'
 ORDER BY m.dt_movimentacao;

-- Consulta 2: chamados em andamento que ja passaram do prazo da categoria
SELECT c.nr_protocolo,
       cat.nm_categoria,
       b.nm_bairro,
       o.sg_orgao,
       c.st_chamado,
       TRUNC(SYSDATE) - TRUNC(c.dt_abertura) AS dias_em_aberto,
       cat.nr_prazo_dias
  FROM T_GS_CHAMADO c
  JOIN T_GS_CATEGORIA cat ON cat.id_categoria = c.id_categoria
  JOIN T_GS_ORGAO o ON o.id_orgao = cat.id_orgao
  JOIN T_GS_BAIRRO b ON b.id_bairro = c.id_bairro
 WHERE c.st_chamado IN ('ABERTO', 'RECEBIDO', 'EM_EXECUCAO', 'CONTESTADO')
   AND TRUNC(SYSDATE) > TRUNC(c.dt_abertura) + cat.nr_prazo_dias
 ORDER BY dias_em_aberto DESC;

-- Consulta 3: tempo medio de resolucao por categoria (da abertura ao encerramento confirmado)
SELECT cat.nm_categoria,
       cat.nr_prazo_dias,
       COUNT(DISTINCT c.id_chamado) AS resolvidos,
       ROUND(AVG(TRUNC(m.dt_movimentacao) - TRUNC(c.dt_abertura)), 1) AS media_dias
  FROM T_GS_CHAMADO c
  JOIN T_GS_CATEGORIA cat ON cat.id_categoria = c.id_categoria
  JOIN T_GS_MOVIMENTACAO m ON m.id_chamado = c.id_chamado
 WHERE c.st_chamado = 'RESOLVIDO'
   AND m.st_chamado = 'AGUARDANDO_CONFIRMACAO'
   AND m.dt_movimentacao = (SELECT MAX(m2.dt_movimentacao)
                              FROM T_GS_MOVIMENTACAO m2
                             WHERE m2.id_chamado = c.id_chamado
                               AND m2.st_chamado = 'AGUARDANDO_CONFIRMACAO')
 GROUP BY cat.nm_categoria, cat.nr_prazo_dias
 ORDER BY media_dias DESC;

-- Consulta 4: taxa de contestacao por orgao
SELECT o.sg_orgao,
       COUNT(DISTINCT CASE WHEN m.st_chamado = 'AGUARDANDO_CONFIRMACAO' THEN c.id_chamado END) AS encerrados_pelo_orgao,
       COUNT(DISTINCT CASE WHEN m.st_chamado = 'CONTESTADO' THEN c.id_chamado END) AS contestados,
       ROUND(100 * COUNT(DISTINCT CASE WHEN m.st_chamado = 'CONTESTADO' THEN c.id_chamado END)
             / NULLIF(COUNT(DISTINCT CASE WHEN m.st_chamado = 'AGUARDANDO_CONFIRMACAO' THEN c.id_chamado END), 0), 0) AS taxa_contestacao
  FROM T_GS_ORGAO o
  JOIN T_GS_CATEGORIA cat ON cat.id_orgao = o.id_orgao
  JOIN T_GS_CHAMADO c ON c.id_categoria = cat.id_categoria
  JOIN T_GS_MOVIMENTACAO m ON m.id_chamado = c.id_chamado
 GROUP BY o.sg_orgao
 ORDER BY taxa_contestacao DESC;

-- Consulta 5: quantidade de chamados por bairro e situacao
SELECT b.nm_bairro,
       c.st_chamado,
       COUNT(*) AS quantidade
  FROM T_GS_CHAMADO c
  JOIN T_GS_BAIRRO b ON b.id_bairro = c.id_bairro
 GROUP BY b.nm_bairro, c.st_chamado
 ORDER BY b.nm_bairro, c.st_chamado;
