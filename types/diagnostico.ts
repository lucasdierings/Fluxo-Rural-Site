export type AtividadePrincipal =
  | 'graos'
  | 'pecuaria_corte'
  | 'pecuaria_leite'
  | 'hortifruti_cafe'
  | 'mista'
  | 'outra'

export type AreaHectares =
  | '<100ha'
  | '100-500ha'
  | '500-2000ha'
  | '>2000ha'
  | 'nao-aplica'

export type GestaoAtual =
  | 'erp_software'
  | 'planilhas'
  | 'caderno_basico'
  | 'nenhuma'

export type DesafioPrincipal =
  | 'custos_margem'
  | 'fluxo_caixa'
  | 'endividamento'
  | 'sucessao'
  | 'investimentos'
  | 'nao_sei'

export type FaturamentoAnual =
  | '<500k'
  | '500k-2M'
  | '2M-5M'
  | '5M-20M'
  | '>20M'
  | 'prefiro_nao_informar'

export type UrgenciaAcao =
  | '30_dias'
  | '3_meses'
  | 'ate_fim_ano'
  | 'sem_pressa'

export type NivelQualificacao = 'verde' | 'amarelo' | 'laranja' | 'vermelho'

export interface DiagnosticoFormData {
  atividade: AtividadePrincipal | ''
  area_ha: AreaHectares | ''
  gestao_atual: GestaoAtual | ''
  desafio_principal: DesafioPrincipal | ''
  detalhe_desafio?: string
  faturamento_anual: FaturamentoAnual | ''
  urgencia: UrgenciaAcao | ''
  estado: string
  cidade: string
  nome_propriedade?: string
  nome: string
  whatsapp: string
  email: string
  consent_lgpd: boolean
}

export interface DiagnosticoPayload extends DiagnosticoFormData {
  etapa: 'completo'
  perfil: 'produtor'
  score: number
  scoreBruto: number
  scoreMax: number
  qualificationLevel: NivelQualificacao
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
  gclid?: string | null
  fbclid?: string | null
  origem: string
  page_url: string
}

export interface ScoreCalculationResult {
  score: number
  scoreBruto: number
  scoreMax: number
  qualificationLevel: NivelQualificacao
}
