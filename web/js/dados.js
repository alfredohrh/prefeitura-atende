const orgaos = [
  { id: 1, nome: "Secretaria Municipal das Subprefeituras", sigla: "SMSUB" },
  { id: 2, nome: "Agência Reguladora de Serviços Públicos do Município", sigla: "SP Regula" }
];

const categorias = [
  { id: 1, nome: "Tapa-buraco", prazoDias: 45, orgaoId: 1 },
  { id: 2, nome: "Lâmpada apagada", prazoDias: 1, orgaoId: 2 },
  { id: 3, nome: "Limpeza de bueiro e boca de lobo", prazoDias: 5, orgaoId: 1 },
  { id: 4, nome: "Remoção de entulho em via pública", prazoDias: 5, orgaoId: 1 },
  { id: 5, nome: "Poda de árvore em área pública", prazoDias: 120, orgaoId: 1 }
];

const bairros = [
  { id: 1, nome: "Sé", regiao: "Centro" },
  { id: 2, nome: "Butantã", regiao: "Oeste" },
  { id: 3, nome: "Lapa", regiao: "Oeste" },
  { id: 4, nome: "Vila Mariana", regiao: "Sul" },
  { id: 5, nome: "Casa Verde", regiao: "Norte" },
  { id: 6, nome: "Santana", regiao: "Norte" }
];

const cidadaosIniciais = [
  { id: 1, nome: "Marina Duarte Lopes", email: "marina.lopes@exemplo.com", telefone: "11988880101" },
  { id: 2, nome: "Caio Henrique Prado", email: "caio.prado@exemplo.com", telefone: "11977770202" },
  { id: 3, nome: "Lúcia Ferraz Monteiro", email: "lucia.monteiro@exemplo.com", telefone: "11966660303" },
  { id: 4, nome: "Renato Akira Sato", email: "renato.sato@exemplo.com", telefone: "11955550404" },
  { id: 5, nome: "Joana Batista Reis", email: "joana.reis@exemplo.com", telefone: "11944440505" },
  { id: 6, nome: "Otávio Nunes Barros", email: "otavio.barros@exemplo.com", telefone: "11933330606" }
];

const chamadosIniciais = [
  {
    id: 1, protocolo: "2026-0001", cidadaoId: 1, categoriaId: 1, bairroId: 2,
    endereco: "Rua Alvarenga, altura do 1200",
    descricao: "Buraco grande na faixa da direita, carros desviam para a contramão.",
    abertura: "2026-10-01T09:10", situacao: "RESOLVIDO",
    movimentacoes: [
      { id: 1, dataHora: "2026-10-01T09:10", situacao: "ABERTO", responsavel: "Marina Duarte Lopes", descricao: "Chamado aberto pelo cidadão.", evidencia: "fotos/2026-0001-antes.jpg" },
      { id: 2, dataHora: "2026-10-02T08:30", situacao: "RECEBIDO", responsavel: "Supervisão de Manutenção - Butantã", descricao: "Chamado recebido por SMSUB.", evidencia: null },
      { id: 3, dataHora: "2026-10-20T07:45", situacao: "EM_EXECUCAO", responsavel: "Equipe de pavimentação - Butantã", descricao: "Serviço programado e equipe enviada ao local.", evidencia: null },
      { id: 4, dataHora: "2026-10-28T16:20", situacao: "AGUARDANDO_CONFIRMACAO", responsavel: "Equipe de pavimentação - Butantã", descricao: "Buraco recortado e preenchido com massa asfáltica.", evidencia: "fotos/2026-0001-depois.jpg" },
      { id: 5, dataHora: "2026-10-29T08:05", situacao: "RESOLVIDO", responsavel: "Marina Duarte Lopes", descricao: "O cidadão confirmou que o problema foi resolvido.", evidencia: null }
    ]
  },
  {
    id: 2, protocolo: "2026-0002", cidadaoId: 2, categoriaId: 2, bairroId: 1,
    endereco: "Rua Tabatinguera, em frente ao 140",
    descricao: "Poste com a lâmpada apagada há três noites, trecho muito escuro.",
    abertura: "2026-11-03T19:40", situacao: "RESOLVIDO",
    movimentacoes: [
      { id: 6, dataHora: "2026-11-03T19:40", situacao: "ABERTO", responsavel: "Caio Henrique Prado", descricao: "Chamado aberto pelo cidadão.", evidencia: "fotos/2026-0002-antes.jpg" },
      { id: 7, dataHora: "2026-11-04T08:00", situacao: "RECEBIDO", responsavel: "Central de iluminação pública", descricao: "Chamado recebido por SP Regula.", evidencia: null },
      { id: 8, dataHora: "2026-11-04T14:00", situacao: "EM_EXECUCAO", responsavel: "Equipe de iluminação - Centro", descricao: "Equipe deslocada para troca da lâmpada.", evidencia: null },
      { id: 9, dataHora: "2026-11-04T21:00", situacao: "AGUARDANDO_CONFIRMACAO", responsavel: "Equipe de iluminação - Centro", descricao: "Lâmpada substituída e poste testado.", evidencia: "fotos/2026-0002-depois.jpg" },
      { id: 10, dataHora: "2026-11-05T20:15", situacao: "CONTESTADO", responsavel: "Caio Henrique Prado", descricao: "A lâmpada acendeu por uma noite e voltou a apagar.", evidencia: "fotos/2026-0002-contestacao.jpg" },
      { id: 11, dataHora: "2026-11-06T10:30", situacao: "EM_EXECUCAO", responsavel: "Equipe de iluminação - Centro", descricao: "Retorno ao local para verificar o reator do poste.", evidencia: null },
      { id: 12, dataHora: "2026-11-07T19:30", situacao: "AGUARDANDO_CONFIRMACAO", responsavel: "Equipe de iluminação - Centro", descricao: "Reator e lâmpada trocados, funcionamento conferido à noite.", evidencia: "fotos/2026-0002-retorno.jpg" },
      { id: 13, dataHora: "2026-11-07T21:10", situacao: "RESOLVIDO", responsavel: "Caio Henrique Prado", descricao: "O cidadão confirmou que o problema foi resolvido.", evidencia: null }
    ]
  },
  {
    id: 3, protocolo: "2026-0003", cidadaoId: 3, categoriaId: 3, bairroId: 3,
    endereco: "Rua Guaicurus, esquina com Rua Faustolo",
    descricao: "Boca de lobo entupida com folhas e lixo, a esquina alaga quando chove.",
    abertura: "2026-10-20T11:25", situacao: "RESOLVIDO",
    movimentacoes: [
      { id: 14, dataHora: "2026-10-20T11:25", situacao: "ABERTO", responsavel: "Lúcia Ferraz Monteiro", descricao: "Chamado aberto pelo cidadão.", evidencia: null },
      { id: 15, dataHora: "2026-10-21T09:00", situacao: "RECEBIDO", responsavel: "Supervisão de Manutenção - Lapa", descricao: "Chamado recebido por SMSUB.", evidencia: null },
      { id: 16, dataHora: "2026-10-23T08:15", situacao: "EM_EXECUCAO", responsavel: "Equipe de drenagem - Lapa", descricao: "Limpeza programada com caminhão de hidrojato.", evidencia: null },
      { id: 17, dataHora: "2026-10-24T15:40", situacao: "AGUARDANDO_CONFIRMACAO", responsavel: "Equipe de drenagem - Lapa", descricao: "Boca de lobo e ramal desobstruídos.", evidencia: "fotos/2026-0003-depois.jpg" },
      { id: 18, dataHora: "2026-10-25T09:30", situacao: "RESOLVIDO", responsavel: "Lúcia Ferraz Monteiro", descricao: "O cidadão confirmou que o problema foi resolvido.", evidencia: null }
    ]
  },
  {
    id: 4, protocolo: "2026-0004", cidadaoId: 4, categoriaId: 4, bairroId: 4,
    endereco: "Rua Vergueiro, altura do 3100",
    descricao: "Monte de entulho de obra e um sofá velho ocupando a calçada inteira.",
    abertura: "2026-11-05T07:50", situacao: "EM_EXECUCAO",
    movimentacoes: [
      { id: 19, dataHora: "2026-11-05T07:50", situacao: "ABERTO", responsavel: "Renato Akira Sato", descricao: "Chamado aberto pelo cidadão.", evidencia: "fotos/2026-0004-antes.jpg" },
      { id: 20, dataHora: "2026-11-06T10:10", situacao: "RECEBIDO", responsavel: "Supervisão de Limpeza - Vila Mariana", descricao: "Chamado recebido por SMSUB.", evidencia: null },
      { id: 21, dataHora: "2026-11-12T08:00", situacao: "EM_EXECUCAO", responsavel: "Equipe de remoção - Vila Mariana", descricao: "Remoção incluída na rota do caminhão da região.", evidencia: null }
    ]
  },
  {
    id: 5, protocolo: "2026-0005", cidadaoId: 5, categoriaId: 5, bairroId: 6,
    endereco: "Rua Voluntários da Pátria, em frente ao 2500",
    descricao: "Galhos de uma árvore grande encostando na fiação e cobrindo a placa de trânsito.",
    abertura: "2026-09-15T14:00", situacao: "RECEBIDO",
    movimentacoes: [
      { id: 22, dataHora: "2026-09-15T14:00", situacao: "ABERTO", responsavel: "Joana Batista Reis", descricao: "Chamado aberto pelo cidadão.", evidencia: null },
      { id: 23, dataHora: "2026-09-18T09:20", situacao: "RECEBIDO", responsavel: "Supervisão de Áreas Verdes - Santana", descricao: "Chamado recebido por SMSUB.", evidencia: null }
    ]
  },
  {
    id: 6, protocolo: "2026-0006", cidadaoId: 1, categoriaId: 1, bairroId: 5,
    endereco: "Avenida Casa Verde, altura do 1800",
    descricao: "Buraco perto do ponto de ônibus, os ônibus passam por cima e espirram água.",
    abertura: "2026-11-10T18:05", situacao: "ABERTO",
    movimentacoes: [
      { id: 24, dataHora: "2026-11-10T18:05", situacao: "ABERTO", responsavel: "Marina Duarte Lopes", descricao: "Chamado aberto pelo cidadão.", evidencia: null }
    ]
  },
  {
    id: 7, protocolo: "2026-0007", cidadaoId: 2, categoriaId: 2, bairroId: 2,
    endereco: "Rua Camargo, em frente ao 300",
    descricao: "Duas lâmpadas apagadas em sequência na mesma quadra.",
    abertura: "2026-11-12T20:15", situacao: "AGUARDANDO_CONFIRMACAO",
    movimentacoes: [
      { id: 25, dataHora: "2026-11-12T20:15", situacao: "ABERTO", responsavel: "Caio Henrique Prado", descricao: "Chamado aberto pelo cidadão.", evidencia: null },
      { id: 26, dataHora: "2026-11-13T07:40", situacao: "RECEBIDO", responsavel: "Central de iluminação pública", descricao: "Chamado recebido por SP Regula.", evidencia: null },
      { id: 27, dataHora: "2026-11-13T15:00", situacao: "EM_EXECUCAO", responsavel: "Equipe de iluminação - Oeste", descricao: "Equipe enviada para troca das duas lâmpadas.", evidencia: null },
      { id: 28, dataHora: "2026-11-13T22:30", situacao: "AGUARDANDO_CONFIRMACAO", responsavel: "Equipe de iluminação - Oeste", descricao: "Duas lâmpadas substituídas.", evidencia: "fotos/2026-0007-depois.jpg" }
    ]
  },
  {
    id: 8, protocolo: "2026-0008", cidadaoId: 3, categoriaId: 4, bairroId: 1,
    endereco: "Rua do Carmo, altura do 80",
    descricao: "Restos de reforma e sacos de cimento abandonados na calçada.",
    abertura: "2026-10-28T08:30", situacao: "CONTESTADO",
    movimentacoes: [
      { id: 29, dataHora: "2026-10-28T08:30", situacao: "ABERTO", responsavel: "Lúcia Ferraz Monteiro", descricao: "Chamado aberto pelo cidadão.", evidencia: "fotos/2026-0008-antes.jpg" },
      { id: 30, dataHora: "2026-10-28T13:00", situacao: "RECEBIDO", responsavel: "Supervisão de Limpeza - Sé", descricao: "Chamado recebido por SMSUB.", evidencia: null },
      { id: 31, dataHora: "2026-10-30T09:00", situacao: "EM_EXECUCAO", responsavel: "Equipe de remoção - Sé", descricao: "Caminhão enviado para a retirada do material.", evidencia: null },
      { id: 32, dataHora: "2026-10-31T11:45", situacao: "AGUARDANDO_CONFIRMACAO", responsavel: "Equipe de remoção - Sé", descricao: "Entulho recolhido e calçada varrida.", evidencia: "fotos/2026-0008-depois.jpg" },
      { id: 33, dataHora: "2026-11-01T09:10", situacao: "CONTESTADO", responsavel: "Lúcia Ferraz Monteiro", descricao: "Retiraram só os sacos, o entulho solto continua na calçada.", evidencia: "fotos/2026-0008-contestacao.jpg" }
    ]
  },
  {
    id: 9, protocolo: "2026-0009", cidadaoId: 4, categoriaId: 3, bairroId: 4,
    endereco: "Rua Domingos de Morais, altura do 2200",
    descricao: "Bueiro sem tampa e com mau cheiro forte perto da banca de jornal.",
    abertura: "2026-11-08T12:00", situacao: "CANCELADO",
    movimentacoes: [
      { id: 34, dataHora: "2026-11-08T12:00", situacao: "ABERTO", responsavel: "Renato Akira Sato", descricao: "Chamado aberto pelo cidadão.", evidencia: null },
      { id: 35, dataHora: "2026-11-08T12:40", situacao: "CANCELADO", responsavel: "Renato Akira Sato", descricao: "Aberto em duplicidade, um vizinho já tinha registrado.", evidencia: null }
    ]
  },
  {
    id: 10, protocolo: "2026-0010", cidadaoId: 5, categoriaId: 1, bairroId: 3,
    endereco: "Rua Clélia, altura do 900",
    descricao: "Asfalto cedendo ao lado do bueiro, o buraco aumenta a cada chuva.",
    abertura: "2026-10-05T10:00", situacao: "RESOLVIDO",
    movimentacoes: [
      { id: 36, dataHora: "2026-10-05T10:00", situacao: "ABERTO", responsavel: "Joana Batista Reis", descricao: "Chamado aberto pelo cidadão.", evidencia: null },
      { id: 37, dataHora: "2026-10-07T09:15", situacao: "RECEBIDO", responsavel: "Supervisão de Manutenção - Lapa", descricao: "Chamado recebido por SMSUB.", evidencia: null },
      { id: 38, dataHora: "2026-11-03T08:00", situacao: "EM_EXECUCAO", responsavel: "Equipe de pavimentação - Lapa", descricao: "Serviço programado após vistoria no local.", evidencia: null },
      { id: 39, dataHora: "2026-11-10T17:00", situacao: "AGUARDANDO_CONFIRMACAO", responsavel: "Equipe de pavimentação - Lapa", descricao: "Base refeita e trecho recapeado.", evidencia: "fotos/2026-0010-depois.jpg" },
      { id: 40, dataHora: "2026-11-11T07:55", situacao: "RESOLVIDO", responsavel: "Joana Batista Reis", descricao: "O cidadão confirmou que o problema foi resolvido.", evidencia: null }
    ]
  },
  {
    id: 11, protocolo: "2026-0011", cidadaoId: 1, categoriaId: 2, bairroId: 6,
    endereco: "Rua Alfredo Pujol, em frente ao 600",
    descricao: "Lâmpada piscando a noite toda em frente à escola.",
    abertura: "2026-10-20T18:30", situacao: "RESOLVIDO",
    movimentacoes: [
      { id: 41, dataHora: "2026-10-20T18:30", situacao: "ABERTO", responsavel: "Marina Duarte Lopes", descricao: "Chamado aberto pelo cidadão.", evidencia: null },
      { id: 42, dataHora: "2026-10-21T08:10", situacao: "RECEBIDO", responsavel: "Central de iluminação pública", descricao: "Chamado recebido por SP Regula.", evidencia: null },
      { id: 43, dataHora: "2026-10-21T13:30", situacao: "EM_EXECUCAO", responsavel: "Equipe de iluminação - Norte", descricao: "Equipe deslocada para troca da lâmpada.", evidencia: null },
      { id: 44, dataHora: "2026-10-21T20:00", situacao: "AGUARDANDO_CONFIRMACAO", responsavel: "Equipe de iluminação - Norte", descricao: "Lâmpada e relé substituídos.", evidencia: "fotos/2026-0011-depois.jpg" },
      { id: 45, dataHora: "2026-10-22T19:45", situacao: "RESOLVIDO", responsavel: "Marina Duarte Lopes", descricao: "O cidadão confirmou que o problema foi resolvido.", evidencia: null }
    ]
  },
  {
    id: 12, protocolo: "2026-0012", cidadaoId: 2, categoriaId: 4, bairroId: 5,
    endereco: "Rua Zilda, altura do 450",
    descricao: "Entulho e galhos jogados na esquina, bloqueando a rampa de acessibilidade.",
    abertura: "2026-10-14T09:00", situacao: "RESOLVIDO",
    movimentacoes: [
      { id: 46, dataHora: "2026-10-14T09:00", situacao: "ABERTO", responsavel: "Caio Henrique Prado", descricao: "Chamado aberto pelo cidadão.", evidencia: null },
      { id: 47, dataHora: "2026-10-15T08:30", situacao: "RECEBIDO", responsavel: "Supervisão de Limpeza - Casa Verde", descricao: "Chamado recebido por SMSUB.", evidencia: null },
      { id: 48, dataHora: "2026-10-16T07:30", situacao: "EM_EXECUCAO", responsavel: "Equipe de remoção - Casa Verde", descricao: "Retirada incluída na rota do dia.", evidencia: null },
      { id: 49, dataHora: "2026-10-17T10:15", situacao: "AGUARDANDO_CONFIRMACAO", responsavel: "Equipe de remoção - Casa Verde", descricao: "Material recolhido e rampa liberada.", evidencia: "fotos/2026-0012-depois.jpg" },
      { id: 50, dataHora: "2026-10-18T08:00", situacao: "RESOLVIDO", responsavel: "Caio Henrique Prado", descricao: "O cidadão confirmou que o problema foi resolvido.", evidencia: null }
    ]
  }
];
