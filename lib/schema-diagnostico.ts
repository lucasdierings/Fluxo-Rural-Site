import { z } from 'zod'
import type {
  AtividadePrincipal,
  AreaHectares,
  GestaoAtual,
  DesafioPrincipal,
  FaturamentoAnual,
  UrgenciaAcao,
  NivelQualificacao,
  DiagnosticoFormData,
  ScoreCalculationResult,
} from '@/types/diagnostico'

export const step1Schema = z.object({
  atividade: z.enum(
    ['graos', 'pecuaria_corte', 'pecuaria_leite', 'hortifruti_cafe', 'mista', 'outra'],
    {
      errorMap: () => ({ message: 'Selecione a atividade principal da propriedade' }),
    }
  ),
})

export const step2Schema = z.object({
  area_ha: z.enum(['<100ha', '100-500ha', '500-2000ha', '>2000ha', 'nao-aplica'], {
    errorMap: () => ({ message: 'Selecione o tamanho aproximado da operação' }),
  }),
})

export const step3Schema = z.object({
  gestao_atual: z.enum(['erp_software', 'planilhas', 'caderno_basico', 'nenhuma'], {
    errorMap: () => ({ message: 'Selecione o nível de gestão atual' }),
  }),
})

export const step4Schema = z.object({
  desafio_principal: z.enum(
    [
      'custos_margem',
      'fluxo_caixa',
      'endividamento',
      'sucessao',
      'investimentos',
      'nao_sei',
    ],
    {
      errorMap: () => ({ message: 'Selecione o principal desafio' }),
    }
  ),
})

export const step5Schema = z.object({
  detalhe_desafio: z.string().min(1, 'Selecione uma opção de detalhamento').optional(),
})

export const step6Schema = z.object({
  faturamento_anual: z.enum(
    ['<500k', '500k-2M', '2M-5M', '5M-20M', '>20M', 'prefiro_nao_informar'],
    {
      errorMap: () => ({ message: 'Selecione a faixa de faturamento bruto' }),
    }
  ),
})

export const step7Schema = z.object({
  urgencia: z.enum(['30_dias', '3_meses', 'ate_fim_ano', 'sem_pressa'], {
    errorMap: () => ({ message: 'Selecione quando pretende agir' }),
  }),
})

export const step8Schema = z.object({
  estado: z.string().length(2, 'Selecione a UF'),
  cidade: z.string().min(2, 'Informe o Município'),
  nome_propriedade: z.string().optional(),
})

export const step9Schema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome completo'),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => v.length >= 10 && v.length <= 11, 'Informe um WhatsApp válido com DDD'),
  email: z.string().trim().email('Informe um e-mail válido'),
  consent_lgpd: z.literal(true, {
    errorMap: () => ({ message: 'É obrigatório aceitar a Política de Privacidade' }),
  }),
})

// Schema de validação na Cloudflare Function /api/diagnostico e no cliente
export const diagnosticoPayloadSchema = z.object({
  etapa: z.literal('completo'),
  perfil: z.literal('produtor'),
  atividade: step1Schema.shape.atividade,
  area_ha: step2Schema.shape.area_ha,
  gestao_atual: step3Schema.shape.gestao_atual,
  desafio_principal: step4Schema.shape.desafio_principal,
  detalhe_desafio: z.string().optional(),
  faturamento_anual: step6Schema.shape.faturamento_anual,
  urgencia: step7Schema.shape.urgencia,
  estado: step8Schema.shape.estado,
  cidade: step8Schema.shape.cidade,
  nome_propriedade: z.string().optional(),
  nome: step9Schema.shape.nome,
  whatsapp: z.string().min(10),
  email: step9Schema.shape.email,
  consent_lgpd: z.boolean().optional(),
  score: z.number().min(0).max(100),
  scoreBruto: z.number(),
  scoreMax: z.number(),
  qualificationLevel: z.enum(['verde', 'amarelo', 'laranja', 'vermelho']),
  utm_source: z.string().nullable().optional(),
  utm_medium: z.string().nullable().optional(),
  utm_campaign: z.string().nullable().optional(),
  utm_term: z.string().nullable().optional(),
  utm_content: z.string().nullable().optional(),
  gclid: z.string().nullable().optional(),
  fbclid: z.string().nullable().optional(),
  origem: z.string(),
  page_url: z.string(),
})

// Pontuações por dimensão (diagnostic_plan.md §8.3)
const PONTOS_FATURAMENTO: Record<FaturamentoAnual, number> = {
  '>20M': 25,
  '5M-20M': 22,
  '2M-5M': 18,
  '500k-2M': 12,
  prefiro_nao_informar: 10,
  '<500k': 5,
}

const PONTOS_URGENCIA: Record<UrgenciaAcao, number> = {
  '30_dias': 25,
  '3_meses': 18,
  ate_fim_ano: 8,
  sem_pressa: 2,
}

const PONTOS_DESAFIO: Record<DesafioPrincipal, number> = {
  endividamento: 20,
  fluxo_caixa: 18,
  custos_margem: 17,
  sucessao: 16,
  investimentos: 14,
  nao_sei: 12,
}

const PONTOS_AREA: Record<AreaHectares, number> = {
  '>2000ha': 15,
  '500-2000ha': 13,
  '100-500ha': 10,
  'nao-aplica': 8,
  '<100ha': 5,
}

const PONTOS_GESTAO: Record<GestaoAtual, number> = {
  nenhuma: 15,
  caderno_basico: 12,
  planilhas: 8,
  erp_software: 5,
}

/**
 * Calcula a pontuação e qualificação térmica de um lead (0 a 100 pontos)
 * baseado no modelo de 5 dimensões especificado no plano mestre §8.3.
 */
export function calculateLeadScore(
  data: Partial<DiagnosticoFormData> | Record<string, unknown>
): ScoreCalculationResult {
  const record = data as Record<string, unknown>
  const fat = (record.faturamento_anual ?? record.faturamento) as FaturamentoAnual | undefined
  const urg = record.urgencia as UrgenciaAcao | undefined
  const des = (record.desafio_principal ?? record.desafios) as DesafioPrincipal | undefined
  const area = (record.area_ha ?? record.hectares) as AreaHectares | undefined
  const ges = (record.gestao_atual ?? record.gestao) as GestaoAtual | undefined

  const ptsFat = fat && fat in PONTOS_FATURAMENTO ? PONTOS_FATURAMENTO[fat] : 0
  const ptsUrg = urg && urg in PONTOS_URGENCIA ? PONTOS_URGENCIA[urg] : 0
  const ptsDes = des && des in PONTOS_DESAFIO ? PONTOS_DESAFIO[des] : 0
  const ptsArea = area && area in PONTOS_AREA ? PONTOS_AREA[area] : 0
  const ptsGes = ges && ges in PONTOS_GESTAO ? PONTOS_GESTAO[ges] : 0

  const scoreBruto = ptsFat + ptsUrg + ptsDes + ptsArea + ptsGes
  const scoreMax = 100
  const score = Math.min(100, Math.max(0, Math.round((scoreBruto / scoreMax) * 100)))

  let qualificationLevel: NivelQualificacao = 'vermelho'
  if (score >= 70) {
    qualificationLevel = 'verde'
  } else if (score >= 50) {
    qualificationLevel = 'amarelo'
  } else if (score >= 30) {
    qualificationLevel = 'laranja'
  } else {
    qualificationLevel = 'vermelho'
  }

  return {
    score,
    scoreBruto,
    scoreMax,
    qualificationLevel,
  }
}
