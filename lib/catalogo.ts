// Catálogo de conteúdo das frentes de Treinamentos e Palestras.
//
// FONTE DE VERDADE: `00_CATALOGO/portfolio-treinamentos-palestras.html` do
// workspace Instrutoria. O `.md` da mesma pasta está DESATUALIZADO, não usar.
//
// Por que este arquivo existe: os temas de palestra eram declarados dentro de
// `app/palestras/page.tsx`, e a página de treinamentos e os formulários de
// captação precisam da mesma lista. Duas cópias divergem na primeira edição, e
// aí o formulário oferece um tema que a página não mostra (ou o contrário).
//
// A redação aqui é GENÉRICA: sem nome de cliente, sem linguagem de cooperativa.
// Detalhe de módulo e entregável NÃO entra aqui de propósito. Isso vive no PDF
// do portfólio, que é o CTA da página de treinamentos.

export interface Curso {
  /** Slug estável, usado como `value` no formulário e como âncora na página. */
  id: string
  titulo: string
  subtitulo: string
  /** 4h é a versão enxuta; 8h é a mesma coisa com oficinas e exercícios
   *  práticos. Nem todo curso tem os dois: alguns só rodam em 4h. */
  formatos: string[]
  publico: string
  /** Títulos dos módulos. O detalhe de cada um vive no PDF do portfólio. */
  modulos: string[]
}

export interface TemaPalestra {
  id: string
  title: string
  promise: string
  bullets: string[]
  /** Alguns temas têm página de aprofundamento própria. Hoje só liderança. */
  paginaPropria?: { href: string; label: string }
}

/** Os 7 cursos estruturados, na ordem do portfólio. */
export const CURSOS: Curso[] = [
  {
    id: 'agrometeorologia',
    titulo: 'Agrometeorologia Agrícola Prática & Gestão de Riscos Climáticos',
    subtitulo:
      'Interpretação prática de dados climáticos, balanço hídrico, mitigação de perdas por eventos extremos e enquadramento no ZARC',
    formatos: ['4h', '8h'],
    publico:
      'Engenheiros agrônomos, produtores, analistas de crédito, alunos de graduação e colégios agrícolas',
    modulos: [
      'Fenômenos climáticos e riscos no campo',
      'Clima x patógenos e pragas',
      'Balanço hídrico climatológico',
      'Produtividade, ZARC e irrigação',
      'Onde buscar os dados do clima',
    ],
  },
  {
    id: 'comunicacao',
    titulo: 'Comunicação Eficaz',
    subtitulo:
      'Da ideia à influência: domínio da expressão, narrativas com storytelling e apresentações de alto impacto',
    formatos: ['4h', '8h'],
    publico: 'Produtores, técnicos, administrativo e gestores',
    modulos: [
      'O custo do ruído',
      "Os 3 C's e linguagem corporal",
      'Storytelling',
      'Investigação estratégica e escuta ativa',
      'Design visual e IA generativa',
      'Arena prática de oratória',
    ],
  },
  {
    id: 'financeiro',
    titulo: 'Gestão Financeira e Análise de Custos na Agropecuária',
    subtitulo:
      'Do diagnóstico do agro às 5 regras de ouro do capital de giro e à apuração real de margens',
    formatos: ['4h', '8h'],
    publico: 'Produtores, gerentes de fazenda e analistas de crédito',
    modulos: [
      'Diagnóstico do agro e benchmark',
      'Metodologias de custeio (COE, COT e CT)',
      'O custo real do crédito',
      'Vencimentos em 30/04 e estocagem',
      'Análise de investimentos rurais',
      'As 5 regras de ouro do giro',
    ],
  },
  {
    id: 'tempo',
    titulo: 'Maestria do Tempo & Execução de Alto Impacto',
    subtitulo:
      'Produtividade executiva, eliminação de gargalos e frameworks ágeis para equipes do agro',
    formatos: ['4h'],
    publico: 'Produtores, gestores, empresários e equipe técnica',
    modulos: [
      'Diagnóstico do desperdício e filosofia executiva',
      'Os 5 pilares e a alocação de recursos',
      'Frameworks de eventos e projetos',
      'Projeto em uma folha e IA na produtividade',
    ],
  },
  {
    id: 'ia',
    titulo: 'Inteligência Artificial de Alta Performance',
    subtitulo:
      'Da organização dos arquivos ao desenho de agentes, leitura automática de planilhas e contratos e apresentações interativas',
    formatos: ['4h'],
    publico:
      'Empresários, administrativo, financeiro, marketing, alunos de graduação e público geral',
    modulos: [
      'O cenário global da IA',
      'Organização dos arquivos e instruções iniciais',
      'Ambientes de trabalho avançados',
      'Rotinas automatizadas e agentes',
      'Conexões com os sistemas que você já usa',
      'Apresentações interativas',
      'Geração visual, custos e casos reais',
    ],
  },
  {
    id: 'lideranca',
    titulo: 'Liderança Eficaz: Propósito, Empreendedorismo e Gestão Humana',
    subtitulo:
      'Atitude de liderança empreendedora, autoconhecimento e formação de equipes de alto desempenho',
    formatos: ['4h'],
    publico: 'Produtores rurais, jovens lideranças, empreendedores e gestores',
    modulos: [
      'O indivíduo, o propósito e o servir',
      'O despertar da liderança empreendedora',
      'Perfis de liderança e leitura de cenários',
      'Comunicação e a armadilha dos achismos',
      'Segurança, confiança e delegação',
      'Engajamento e o legado do líder',
    ],
  },
  {
    id: 'sucessao',
    titulo: 'Sucessão Familiar e Governança na Propriedade Rural',
    subtitulo:
      'Como transformar a propriedade familiar em família empresária antes que a divisão aconteça',
    formatos: ['4h', '8h'],
    publico: 'Produtores rurais e famílias',
    modulos: [
      'O retrato e a conta do tempo',
      'Os três círculos: família, sociedade e trabalho',
      'Justa ou equânime, a conversa mais difícil',
      'Viabilidade econômica antes da divisão',
      'Gestão como ferramenta de sucessão',
      'Plano de transição e acordo de família',
    ],
  },
]

/** Os 6 temas de palestra. Movidos de `app/palestras/page.tsx` sem alteração de copy. */
export const TEMAS_PALESTRA: TemaPalestra[] = [
  {
    id: 'gestao-inovacao',
    title: 'Gestão e Inovação no Agronegócio',
    promise:
      'Como aplicar gestão profissional e inovação para aumentar a eficiência e a rentabilidade no campo.',
    bullets: [
      'Os indicadores que todo gestor rural precisa acompanhar, e os que só dão trabalho',
      'Como transformar os dados da fazenda em decisão, sem virar refém de planilha',
      'Casos reais de propriedades que profissionalizaram a gestão e o que mudou no bolso',
    ],
  },
  {
    id: 'financeira-pratica',
    title: 'Gestão Financeira Rural na Prática',
    promise:
      'A evolução da gestão no campo: do modelo tradicional às facilidades tecnológicas para dominar números, prever caixa e avaliar a rentabilidade real da fazenda.',
    bullets: [
      'A importância da gestão: como o mercado funciona hoje e os riscos de não profissionalizar a fazenda',
      'O novo perfil do Produtor Rural: habilidades essenciais para a tomada de decisão segura',
      'Estratégia financeira: como ler os números, prever o fluxo de caixa e avaliar investimentos e rentabilidade',
      'Facilidades da tecnologia: usando ferramentas práticas para descomplicar a gestão diária',
    ],
  },
  {
    id: 'sucessao-familiar',
    title: 'Gestão como Ferramenta para a Sucessão Familiar',
    promise:
      'Como a gestão profissional destrava a transição entre gerações sem brigar a família.',
    bullets: [
      'Por que a maioria das sucessões trava na falta de gestão, não na falta de herdeiro',
      'Combinados, papéis e governança: o mínimo para empresa e família não se misturarem',
      'O caminho para a próxima geração assumir com número na mão, não no achismo',
    ],
  },
  {
    id: 'ia-agro',
    title: 'Inteligência Artificial no Agronegócio',
    promise:
      'O que já é realidade em IA no agro, quais ferramentas usar e como começar a aplicar amanhã.',
    bullets: [
      'O que a IA já faz hoje no agro, e o que ainda é promessa de palco',
      'Ferramentas práticas que um produtor ou empresa pode usar essa semana',
      'Como usar IA para ganhar tempo em gestão e decisão, sem ser técnico',
    ],
  },
  {
    id: 'empreendedorismo',
    title: 'Empreendedorismo e Inovação no Agronegócio',
    promise:
      'Mentalidade empreendedora aplicada ao campo: identificar oportunidades, tirar ideias do papel e inovar sem apostar a fazenda.',
    bullets: [
      'Como enxergar oportunidades onde a maioria só vê rotina de safra',
      'Inovação de verdade: testar pequeno, errar barato e escalar o que funciona',
      'Casos de quem empreendeu dentro da porteira, e o que dá pra copiar amanhã',
    ],
  },
  {
    id: 'lideranca-agro',
    title: 'Liderança Eficaz no Agronegócio',
    promise:
      'O novo modelo de liderança do agro: por que o comando-e-controle da porteira não segura mais ninguém, e o que fazer no lugar.',
    bullets: [
      'Não é apagão de mão de obra, é apagão de liderança: como atrair e manter gente boa',
      'Comunicação, propósito e inteligência emocional na linguagem do campo',
      'Se nem os filhos querem ficar na propriedade, imagina os funcionários: liderança e sucessão',
    ],
    paginaPropria: {
      href: '/servicos/lideranca',
      label: 'Conheça o novo modelo de liderança no agro',
    },
  },
]

/** Como um treinamento sai do primeiro contato até a sala. Três passos, e nada
 *  de prometer customização de material que nem sempre acontece. */
export const ETAPAS_IMPLANTACAO = [
  {
    num: 1,
    title: 'Entendo a demanda',
    desc: 'Conversamos sobre o que motivou o treinamento, quem vai estar na sala e quanto tempo você tem.',
  },
  {
    num: 2,
    title: 'Mostro o conteúdo',
    desc: 'Você vê o que será dado antes de fechar, e não depois. Sem surpresa no dia.',
  },
  {
    num: 3,
    title: 'Ajusto o que precisar',
    desc: 'Se algum ponto não fizer sentido para o seu público, a gente afina antes de aplicar.',
  },
]

/** Portfólio em PDF, oferecido tanto em /servicos/treinamentos quanto em
 *  /palestras. É peça única: contém os 7 treinamentos E as 6 palestras, e
 *  aposentou o antigo mídia kit. Gerado a partir do HTML do catálogo pelo
 *  `gerar_pdf.mjs`; trocar o arquivo neste caminho não exige mexer no código. */
export const PORTFOLIO_PDF = '/portfolio-treinamentos-palestras-lucas-dierings.pdf'
