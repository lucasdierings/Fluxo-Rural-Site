import { CURSOS, TEMAS_PALESTRA } from '@/lib/catalogo'

// Roteiro de perguntas do /proposta.
//
// Regra de ouro: uma pergunta por tela, e SÓ o que muda a conversa. O
// /diagnostico antigo pedia saúde financeira, urgência, expectativa e maior
// desafio antes de saber quem era a pessoa, e a maior parte disso o Lucas
// descobre na primeira ligação de qualquer jeito.
//
// A qualificação vem ANTES do contato de propósito: quem responde quatro
// cartões já investiu na conversa e preenche o contato com mais disposição.

export type Servico = 'consultoria' | 'palestra' | 'treinamento' | 'podcast' | 'parceria'

export interface Pergunta {
  /** Chave no payload enviado para /api/proposta. */
  campo: string
  titulo: string
  ajuda?: string
  opcoes: string[]
  /** Em quais serviços esta pergunta aparece. */
  servicos: Servico[]
  /** Uma coluna quando as opções são frases longas. */
  colunas?: 1 | 2
}

export const SERVICOS: { valor: Servico; titulo: string; sub: string }[] = [
  {
    valor: 'consultoria',
    titulo: 'Consultoria para a minha propriedade',
    sub: 'Sou produtor e quero organizar a gestão do meu negócio',
  },
  {
    valor: 'palestra',
    titulo: 'Palestra para um evento',
    sub: 'Quero levar um tema ao palco do meu evento',
  },
  {
    valor: 'treinamento',
    titulo: 'Treinamento para um grupo',
    sub: 'Quero capacitar uma turma, com material de trabalho',
  },
  {
    valor: 'podcast',
    titulo: 'Agro Jovem Podcast',
    sub: 'Convidado, host, participação ou patrocínio',
  },
  {
    valor: 'parceria',
    titulo: 'Parceria',
    sub: 'Divulgação, gravação, captação ou outra ideia',
  },
]

const B2B: Servico[] = ['palestra', 'treinamento']

export const PERGUNTAS: Pergunta[] = [
  // ── Consultoria (produtor rural) ─────────────────────────────────────────
  {
    campo: 'motivo',
    titulo: 'O que te trouxe até aqui?',
    ajuda: 'Escolha o que mais pesa hoje. Dá para tratar do resto depois.',
    servicos: ['consultoria'],
    colunas: 1,
    opcoes: [
      'Não sei se estou tendo lucro de verdade',
      'Quero organizar os números e o caixa',
      'Preciso planejar a sucessão da família',
      'Estou avaliando um investimento',
      'Preciso montar um projeto para o banco',
      'Quero um olhar de fora no negócio',
    ],
  },
  {
    campo: 'atividade',
    titulo: 'Qual a atividade principal?',
    servicos: ['consultoria'],
    opcoes: [
      'Grãos',
      'Pecuária de corte',
      'Leite',
      'Café',
      'Hortaliças',
      'Mais de uma atividade',
    ],
  },
  {
    campo: 'area',
    titulo: 'Qual o tamanho da área?',
    ajuda: 'Serve uma faixa aproximada.',
    servicos: ['consultoria'],
    opcoes: [
      'Até 100 hectares',
      'De 100 a 500',
      'De 500 a 2.000',
      'Mais de 2.000',
      'Não trabalho com área (pecuária intensiva, agroindústria)',
    ],
  },
  {
    campo: 'gestao',
    titulo: 'Quem cuida da gestão hoje?',
    servicos: ['consultoria'],
    opcoes: [
      'Eu mesmo, no que dá',
      'Alguém da família',
      'Tenho equipe administrativa',
      'Um escritório de contabilidade',
      'Na prática, ninguém',
    ],
  },

  // ── Palestra e treinamento ───────────────────────────────────────────────
  {
    campo: 'tema',
    titulo: 'Qual tema te interessa?',
    ajuda: 'Se ainda não decidiu, sem problema.',
    servicos: ['palestra'],
    colunas: 1,
    opcoes: [...TEMAS_PALESTRA.map((t) => t.title), 'Ainda não sei, quero uma sugestão'],
  },
  {
    campo: 'tema',
    titulo: 'Qual treinamento te interessa?',
    ajuda: 'Se ainda não decidiu, sem problema.',
    servicos: ['treinamento'],
    colunas: 1,
    opcoes: [...CURSOS.map((c) => c.titulo), 'Ainda não sei, quero uma sugestão'],
  },
  {
    campo: 'publico',
    titulo: 'Quem vai estar na sala?',
    servicos: B2B,
    opcoes: [
      'Produtores rurais',
      'Equipe interna',
      'Lideranças e gestores',
      'Estudantes',
      'Público misto',
    ],
  },
  {
    campo: 'formato',
    titulo: 'Qual formato você imagina?',
    ajuda: 'Isso ajuda a avaliar deslocamento e desenho da entrega.',
    servicos: B2B,
    opcoes: ['Presencial', 'Online', 'Híbrido', 'Ainda não definido'],
  },
  {
    campo: 'contratante',
    titulo: 'Quem está organizando ou contratando?',
    servicos: B2B,
    colunas: 1,
    opcoes: [
      'Cooperativa ou sindicato',
      'Empresa privada',
      'Feira ou evento aberto',
      'Instituição de ensino',
      'Órgão público',
      'Outro tipo de organização',
    ],
  },
  {
    campo: 'objetivo',
    titulo: 'O que essa turma precisa levar de lá?',
    ajuda: 'É o que define a ênfase do conteúdo.',
    servicos: B2B,
    colunas: 1,
    opcoes: [
      'Entender os números do próprio negócio',
      'Sair com uma ferramenta pronta para usar',
      'Mudar postura e mentalidade',
      'Se atualizar sobre o que vem por aí',
      'Abrir ou fechar o evento com energia',
    ],
  },
  {
    campo: 'tamanho',
    titulo: 'Quantas pessoas, mais ou menos?',
    servicos: B2B,
    opcoes: ['Até 50', 'De 50 a 150', 'De 150 a 500', 'Mais de 500', 'Ainda não definido'],
  },
  {
    campo: 'quando',
    titulo: 'Para quando?',
    servicos: B2B,
    opcoes: ['Já tenho uma data definida', 'Nos próximos 30 dias', 'Em 2 a 3 meses', 'Mais para frente', 'Ainda definindo'],
  },

  // ── Podcast e parceria ───────────────────────────────────────────────────
  {
    campo: 'objetivo',
    titulo: 'O que você tem em mente?',
    servicos: ['podcast'],
    colunas: 1,
    opcoes: [
      'Indicar um convidado para o programa',
      'Contratar o Lucas como host do meu podcast',
      'Convidar o Lucas como entrevistado',
      'Gravar em um evento',
      'Patrocinar o programa',
    ],
  },
  {
    campo: 'objetivo',
    titulo: 'Que tipo de parceria?',
    servicos: ['parceria'],
    colunas: 1,
    opcoes: [
      'Divulgação e conteúdo',
      'Gravação ou captação',
      'Presença em evento',
      'Outra ideia (conto na observação)',
    ],
  },
  {
    campo: 'quando',
    titulo: 'Em que momento você quer tirar isso do papel?',
    servicos: ['podcast', 'parceria'],
    opcoes: ['Nos próximos 30 dias', 'Em 2 a 3 meses', 'Mais para frente', 'Ainda definindo'],
  },
]

/** As perguntas de um serviço, na ordem. */
export function perguntasDe(servico: Servico) {
  return PERGUNTAS.filter((p) => p.servicos.includes(servico))
}

/** Organização só faz sentido para quem contrata em nome de alguém. */
export function pedeOrganizacao(servico: Servico) {
  return servico !== 'consultoria'
}
