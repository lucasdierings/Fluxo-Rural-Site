'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react'
import { OptionCard } from './OptionCard'
import { DiagnosticSuccessScreen } from './DiagnosticSuccessScreen'
import { UfCitySelector } from '@/components/ui/UfCitySelector'
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
  step9Schema,
  calculateLeadScore,
} from '@/lib/schema-diagnostico'
import type {
  DiagnosticoFormData,
  ScoreCalculationResult,
  AtividadePrincipal,
  AreaHectares,
  GestaoAtual,
  DesafioPrincipal,
  FaturamentoAnual,
  UrgenciaAcao,
} from '@/types/diagnostico'
import { trackLead, readAttribution } from '@/lib/track'
import { cn } from '@/lib/utils'

export interface DiagnosticModalProps {
  isOpen: boolean
  onClose: () => void
  initialStep?: number
}

const TOTAL_STEPS = 9
const AUTO_ADVANCE_DELAY_MS = 140

const STEP_NAMES = [
  'atividade_principal',
  'area_produtiva',
  'gestao_atual',
  'desafio_principal',
  'detalhe_desafio',
  'faturamento_anual',
  'urgencia',
  'localizacao',
  'identificacao_final',
]

const INITIAL_FORM_DATA: DiagnosticoFormData = {
  atividade: '',
  area_ha: '',
  gestao_atual: '',
  desafio_principal: '',
  detalhe_desafio: '',
  faturamento_anual: '',
  urgencia: '',
  estado: '',
  cidade: '',
  nome_propriedade: '',
  nome: '',
  whatsapp: '',
  email: '',
  consent_lgpd: false,
}

// Máscara de telefone WhatsApp: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export function DiagnosticModal({ isOpen, onClose, initialStep = 1 }: DiagnosticModalProps) {
  const [step, setStep] = useState<number>(initialStep)
  const [direction, setDirection] = useState<number>(1)
  const [formData, setFormData] = useState<DiagnosticoFormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [scoreResult, setScoreResult] = useState<ScoreCalculationResult | null>(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [selectedPendingOption, setSelectedPendingOption] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Bloqueio do scroll do body enquanto o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Reset de estado quando reabre
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep)
      setDirection(1)
      setIsSuccess(false)
      setSubmitError(null)
      setShowExitConfirm(false)
      setSelectedPendingOption(null)
    }
  }, [isOpen, initialStep])

  // Rastreamento seguro de visualização de cada etapa (ZERO PII)
  useEffect(() => {
    if (isOpen && !isSuccess && step >= 1 && step <= TOTAL_STEPS) {
      trackLead('diagnostico_step_view', {
        step,
        total_steps: TOTAL_STEPS,
        step_name: STEP_NAMES[step - 1],
      })
    }
  }, [isOpen, step, isSuccess])

  // Progresso percentual
  const progressPercent = Math.round((step / TOTAL_STEPS) * 100)

  // Definição das opções para os passos 1 a 4 e 6 a 7
  const step1Options = useMemo(
    () => [
      {
        value: 'graos' as AtividadePrincipal,
        label: 'Grãos & Culturas Anuais',
        description: 'Soja, milho, trigo, algodão e outras culturas anuais',
      },
      {
        value: 'pecuaria_corte' as AtividadePrincipal,
        label: 'Pecuária de Corte',
        description: 'Cria, recria, engorda ou confinamento',
      },
      {
        value: 'pecuaria_leite' as AtividadePrincipal,
        label: 'Pecuária de Leite',
        description: 'Produção intensiva ou a pasto',
      },
      {
        value: 'hortifruti_cafe' as AtividadePrincipal,
        label: 'Café, Frutas ou Hortifrúti',
        description: 'Culturas perenes ou intensivas',
      },
      {
        value: 'mista' as AtividadePrincipal,
        label: 'Operação Mista / Diversificada',
        description: 'Mais de uma atividade de peso na fazenda',
      },
      {
        value: 'outra' as AtividadePrincipal,
        label: 'Outra Atividade Agro',
        description: 'Agroindústria, cana, granja ou integração',
      },
    ],
    []
  )

  const step2Options = useMemo(
    () => [
      {
        value: '<100ha' as AreaHectares,
        label: 'Até 100 hectares',
        description: 'Pequena propriedade / Produção intensiva',
      },
      {
        value: '100-500ha' as AreaHectares,
        label: 'De 100 a 500 hectares',
        description: 'Média operação familiar em consolidação',
      },
      {
        value: '500-2000ha' as AreaHectares,
        label: 'De 500 a 2.000 hectares',
        description: 'Médio a grande porte comercial',
      },
      {
        value: '>2000ha' as AreaHectares,
        label: 'Mais de 2.000 hectares',
        description: 'Grande escala / Grupo agropecuário',
      },
      {
        value: 'nao-aplica' as AreaHectares,
        label: 'Área não é a principal medida',
        description: 'Confinamento intensivo, granja ou agroindústria',
      },
    ],
    []
  )

  const step3Options = useMemo(
    () => [
      {
        value: 'erp_software' as GestaoAtual,
        label: 'Software de Gestão Rural / ERP',
        description: 'Dados centralizados, rotina e relatórios definidos',
      },
      {
        value: 'planilhas' as GestaoAtual,
        label: 'Planilhas Estruturadas',
        description: 'Controles em Excel/Google Sheets, mas descentralizados',
      },
      {
        value: 'caderno_basico' as GestaoAtual,
        label: 'Controles Básicos / Caderno / Bloco',
        description: 'Anoto entradas e saídas pontualmente sem rotina',
      },
      {
        value: 'nenhuma' as GestaoAtual,
        label: 'Sem Controles Formais',
        description: 'Decisões na memória, intuição ou extrato bancário',
      },
    ],
    []
  )

  const step4Options = useMemo(
    () => [
      {
        value: 'custos_margem' as DesafioPrincipal,
        label: 'Controle de Custos & Margem Real',
        description: 'Não sei exatamente o custo por saca/arroba ou se sobra lucro real',
      },
      {
        value: 'fluxo_caixa' as DesafioPrincipal,
        label: 'Previsibilidade de Fluxo de Caixa',
        description: 'O dinheiro entra na safra mas falta nos entressafras; falta visão anual',
      },
      {
        value: 'endividamento' as DesafioPrincipal,
        label: 'Gestão de Dívidas & Custeio Bancário',
        description: 'Parcelas de investimento e custeio estão sufocando a margem',
      },
      {
        value: 'sucessao' as DesafioPrincipal,
        label: 'Sucessão Familiar & Governança',
        description: 'Dificuldade em definir papéis, alinhar a família e planejar a continuidade',
      },
      {
        value: 'investimentos' as DesafioPrincipal,
        label: 'Decisão de Investimento / Expansão',
        description: 'Insegurança ao comprar terra, trocar maquinário ou investir em tecnologia',
      },
      {
        value: 'nao_sei' as DesafioPrincipal,
        label: 'Quero uma Avaliação Geral / Não sei por onde começar',
        description: 'Sei que precisamos profissionalizar, mas falta um plano de ação claro',
      },
    ],
    []
  )

  // Smart Branching para o Passo 5 baseado no Passo 4
  const step5Branch = useMemo(() => {
    const desafio = formData.desafio_principal

    if (desafio === 'custos_margem' || desafio === 'fluxo_caixa' || desafio === 'endividamento') {
      return {
        title: 'Qual é o nível de comprometimento da receita com dívidas e financiamentos?',
        subtitle: 'Uma estimativa nos ajuda a dimensionar a saúde financeira e capacidade de alavancagem.',
        options: [
          {
            value: 'Sem dívidas relevantes (operação com capital próprio)',
            label: 'Sem dívidas relevantes',
            description: 'Operação sustentada primordialmente por capital próprio',
          },
          {
            value: 'Leve — compromete até 20% do faturamento anual',
            label: 'Leve (até 20% da receita anual)',
            description: 'Financiamentos pontuais de custeio com folga no caixa',
          },
          {
            value: 'Moderada — compromete de 20% a 50% do faturamento',
            label: 'Moderada (20% a 50% da receita)',
            description: 'Parcelas de maquinário ou custeio exigem atenção no fluxo',
          },
          {
            value: 'Alta — compromete mais de 50% do faturamento',
            label: 'Alta (mais de 50% da receita)',
            description: 'Pressão crítica sobre o caixa e risco de refinanciamento',
          },
          {
            value: 'Prefiro conversar sobre isso na sessão de diagnóstico',
            label: 'Prefiro conversar na sessão',
            description: 'Apresentar os números detalhadamente com o consultor',
          },
        ],
      }
    }

    if (desafio === 'sucessao') {
      return {
        title: 'Como está o alinhamento familiar na tomada de decisões?',
        subtitle: 'A governança e o diálogo entre gerações são os pilares da continuidade do negócio.',
        options: [
          {
            value: 'Família alinhada e aberta para estruturar a sucessão',
            label: 'Família alinhada e aberta',
            description: 'Harmonia entre gerações com vontade de formalizar papéis',
          },
          {
            value: 'Algumas divergências entre gerações, mas diálogo aberto',
            label: 'Algumas divergências, mas com diálogo',
            description: 'Visões diferentes de investimento que precisam de mediação',
          },
          {
            value: 'Conflitos frequentes que já travam decisões na fazenda',
            label: 'Conflitos frequentes',
            description: 'Dificuldade de consenso que impacta a rotina e o futuro',
          },
          {
            value: 'Transição iminente acontecendo neste momento',
            label: 'Transição em andamento',
            description: 'Passagem de bastão ocorrendo na prática agora',
          },
        ],
      }
    }

    if (desafio === 'investimentos') {
      return {
        title: 'Qual é o foco principal dos investimentos em análise?',
        subtitle: 'Identifique onde a propriedade planeja alocar capital nos próximos ciclos.',
        options: [
          {
            value: 'Renovação de frota / Máquinas agrícolas',
            label: 'Máquinas & Frota Agrícola',
            description: 'Tratores, colheitadeiras, pulverizadores ou plantadeiras',
          },
          {
            value: 'Compra ou arrendamento de novas áreas',
            label: 'Expansão de Área',
            description: 'Aquisição de terras ou novos contratos de arrendamento',
          },
          {
            value: 'Infraestrutura (Armazenagem, Silos, Irrigação)',
            label: 'Infraestrutura de Fazenda',
            description: 'Armazéns, silos, pivôs de irrigação ou galpões',
          },
          {
            value: 'Tecnologia de precisão e sistemas de gestão',
            label: 'Tecnologia & Softwares',
            description: 'Agricultura de precisão, telemetria e gestão integrada',
          },
          {
            value: 'Correção de solo e reforma de pastagens',
            label: 'Solo & Pastagens',
            description: 'Calcário, adubação de base, curvas de nível e pastos',
          },
        ],
      }
    }

    // Default / nao_sei
    return {
      title: 'O que mais causa preocupação na rotina da fazenda?',
      subtitle: 'Entender a sua maior dor ajuda a direcionar a conversa técnica com o consultor.',
      options: [
        {
          value: 'Sensação de trabalhar muito e sobrar pouco no bolso',
          label: 'Sensação de pouco lucro',
          description: 'A safra produz bem, mas a margem líquida parece sumir',
        },
        {
          value: 'Falta de números claros para tomar decisões com segurança',
          label: 'Falta de clareza nos números',
          description: 'Insegurança na hora de negociar insumos ou travar venda',
        },
        {
          value: 'Tudo depende 100% do proprietário; sem tempo livre',
          label: 'Sobrecarga do gestor',
          description: 'Centralização excessiva e falta de processos delegáveis',
        },
        {
          value: 'Incerteza sobre a rentabilidade nos próximos anos',
          label: 'Incerteza do cenário futuro',
          description: 'Necessidade de planejar o negócio para resistir a oscilações',
        },
      ],
    }
  }, [formData.desafio_principal])

  const step6Options = useMemo(
    () => [
      {
        value: '<500k' as FaturamentoAnual,
        label: 'Até R$ 500 mil / ano',
        description: 'Operações de pequeno porte ou início de expansão',
      },
      {
        value: '500k-2M' as FaturamentoAnual,
        label: 'De R$ 500 mil a R$ 2 milhões / ano',
        description: 'Média operação em consolidação comercial',
      },
      {
        value: '2M-5M' as FaturamentoAnual,
        label: 'De R$ 2 milhões a R$ 5 milhões / ano',
        description: 'Médio porte com demanda forte por controle de caixa',
      },
      {
        value: '5M-20M' as FaturamentoAnual,
        label: 'De R$ 5 milhões a R$ 20 milhões / ano',
        description: 'Grande porte comercial com múltiplos centros de custo',
      },
      {
        value: '>20M' as FaturamentoAnual,
        label: 'Mais de R$ 20 milhões / ano',
        description: 'Operação corporativa / Grupo agrícola de grande escala',
      },
      {
        value: 'prefiro_nao_informar' as FaturamentoAnual,
        label: 'Prefiro não informar no momento',
        description: 'Avaliar o porte durante a sessão de diagnóstico',
      },
    ],
    []
  )

  const step7Options = useMemo(
    () => [
      {
        value: '30_dias' as UrgenciaAcao,
        label: 'Nos próximos 30 dias',
        description: 'Preciso agir imediatamente para a próxima safra ou fechamento',
      },
      {
        value: '3_meses' as UrgenciaAcao,
        label: 'Neste trimestre (próximos 3 meses)',
        description: 'Quero planejar e estruturar rotinas com calma',
      },
      {
        value: 'ate_fim_ano' as UrgenciaAcao,
        label: 'Até o final do ano / Próximo ciclo',
        description: 'Estou amadurecendo o momento ideal de profissionalização',
      },
      {
        value: 'sem_pressa' as UrgenciaAcao,
        label: 'Apenas conhecendo a consultoria',
        description: 'Sem prazo definido no momento',
      },
    ],
    []
  )

  // Manipulador de avanço de passo com validação
  const advanceStep = useCallback(() => {
    setErrors({})
    setSubmitError(null)

    if (step === 1) {
      const parsed = step1Schema.safeParse({ atividade: formData.atividade })
      if (!parsed.success) {
        setErrors({ atividade: parsed.error.issues[0]?.message || 'Selecione uma opção' })
        return
      }
    } else if (step === 2) {
      const parsed = step2Schema.safeParse({ area_ha: formData.area_ha })
      if (!parsed.success) {
        setErrors({ area_ha: parsed.error.issues[0]?.message || 'Selecione uma opção' })
        return
      }
    } else if (step === 3) {
      const parsed = step3Schema.safeParse({ gestao_atual: formData.gestao_atual })
      if (!parsed.success) {
        setErrors({ gestao_atual: parsed.error.issues[0]?.message || 'Selecione uma opção' })
        return
      }
    } else if (step === 4) {
      const parsed = step4Schema.safeParse({ desafio_principal: formData.desafio_principal })
      if (!parsed.success) {
        setErrors({ desafio_principal: parsed.error.issues[0]?.message || 'Selecione uma opção' })
        return
      }
    } else if (step === 5) {
      const parsed = step5Schema.safeParse({ detalhe_desafio: formData.detalhe_desafio })
      if (!parsed.success) {
        setErrors({ detalhe_desafio: parsed.error.issues[0]?.message || 'Selecione uma opção' })
        return
      }
    } else if (step === 6) {
      const parsed = step6Schema.safeParse({ faturamento_anual: formData.faturamento_anual })
      if (!parsed.success) {
        setErrors({ faturamento_anual: parsed.error.issues[0]?.message || 'Selecione uma opção' })
        return
      }
    } else if (step === 7) {
      const parsed = step7Schema.safeParse({ urgencia: formData.urgencia })
      if (!parsed.success) {
        setErrors({ urgencia: parsed.error.issues[0]?.message || 'Selecione uma opção' })
        return
      }
    } else if (step === 8) {
      const parsed = step8Schema.safeParse({
        estado: formData.estado,
        cidade: formData.cidade,
        nome_propriedade: formData.nome_propriedade,
      })
      if (!parsed.success) {
        const errMap: Record<string, string> = {}
        for (const issue of parsed.error.issues) {
          const path = issue.path[0] as string
          if (path && !errMap[path]) errMap[path] = issue.message
        }
        setErrors(errMap)
        return
      }
    }

    if (step < TOTAL_STEPS) {
      setDirection(1)
      setStep((prev) => prev + 1)
    }
  }, [step, formData])

  // Retorno de passo
  const goBack = useCallback(() => {
    if (step > 1) {
      setErrors({})
      setSubmitError(null)
      setDirection(-1)
      setStep((prev) => prev - 1)
    }
  }, [step])

  // Seleção com auto-avanço de 140ms
  const handleSelectOption = useCallback(
    (field: keyof DiagnosticoFormData, value: string) => {
      setSelectedPendingOption(value)
      setFormData((prev) => {
        const updated = { ...prev, [field]: value }
        if (field === 'desafio_principal') {
          updated.detalhe_desafio = ''
        }
        return updated
      })

      setTimeout(() => {
        setSelectedPendingOption(null)
        setDirection(1)
        setStep((s) => Math.min(s + 1, TOTAL_STEPS))
      }, AUTO_ADVANCE_DELAY_MS)
    },
    []
  )

  // Envio final no Passo 9
  const handleSubmitFinal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (isSubmitting) return

    setErrors({})
    setSubmitError(null)

    // Valida o passo 9
    const parsedStep9 = step9Schema.safeParse({
      nome: formData.nome,
      whatsapp: formData.whatsapp,
      email: formData.email,
      consent_lgpd: formData.consent_lgpd,
    })

    if (!parsedStep9.success) {
      const errMap: Record<string, string> = {}
      for (const issue of parsedStep9.error.issues) {
        const path = issue.path[0] as string
        if (path && !errMap[path]) errMap[path] = issue.message
      }
      setErrors(errMap)
      return
    }

    // Calcula pontuação de qualificação
    const calculated = calculateLeadScore(formData)
    setScoreResult(calculated)

    // Atribuição UTM / Canal
    const attr = readAttribution()
    const origem = attr.origem === 'site' ? 'diagnostico-gratis' : attr.origem

    const payload = {
      etapa: 'completo' as const,
      perfil: 'produtor' as const,
      atividade: formData.atividade,
      area_ha: formData.area_ha,
      gestao_atual: formData.gestao_atual,
      desafio_principal: formData.desafio_principal,
      detalhe_desafio: formData.detalhe_desafio || undefined,
      faturamento_anual: formData.faturamento_anual,
      urgencia: formData.urgencia,
      estado: formData.estado,
      cidade: formData.cidade,
      nome_propriedade: formData.nome_propriedade || undefined,
      nome: formData.nome.trim(),
      whatsapp: formData.whatsapp.replace(/\D/g, ''),
      email: formData.email.trim(),
      consent_lgpd: formData.consent_lgpd,
      score: calculated.score,
      scoreBruto: calculated.scoreBruto,
      scoreMax: calculated.scoreMax,
      qualificationLevel: calculated.qualificationLevel,
      utm_source: attr.utm_source || null,
      utm_medium: attr.utm_medium || null,
      utm_campaign: attr.utm_campaign || null,
      utm_term: attr.utm_term || null,
      utm_content: attr.utm_content || null,
      gclid: attr.gclid || null,
      fbclid: attr.fbclid || null,
      origem,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errJson = await response.json().catch(() => null)
        throw new Error(
          errJson?.error ||
            'Não foi possível salvar o seu diagnóstico. Por favor, verifique os dados e tente novamente.'
        )
      }

      // Telemetria apenas no HTTP 200 (ZERO PII)
      trackLead('diagnostico_submit', {
        form_location: 'diagnostico_modal',
        perfil: 'produtor',
        origem,
        score: calculated.score,
        qualification: calculated.qualificationLevel,
      })

      setIsSuccess(true)
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao enviar seu diagnóstico. Tente novamente.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Atalhos de teclado (1 a 6, Enter, Backspace, ArrowLeft, Escape)
  useEffect(() => {
    if (!isOpen || isSuccess) return

    function handleKeyDown(e: KeyboardEvent) {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase()
      const isInputFocused =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        activeTag === 'select' ||
        document.activeElement?.getAttribute('role') === 'combobox'

      // Escape sempre abre modal de confirmação de saída
      if (e.key === 'Escape') {
        e.preventDefault()
        if (showExitConfirm) {
          setShowExitConfirm(false)
        } else if (step === 1 && !formData.atividade) {
          onClose()
        } else {
          setShowExitConfirm(true)
        }
        return
      }

      // Se o modal de confirmação de saída estiver aberto
      if (showExitConfirm) return

      // Atalhos numéricos 1 a 6 apenas para etapas com seleção de cards
      if (!isInputFocused && (step >= 1 && step <= 7)) {
        const keyNum = parseInt(e.key, 10)
        if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 6) {
          e.preventDefault()
          const index = keyNum - 1

          if (step === 1 && step1Options[index]) {
            handleSelectOption('atividade', step1Options[index].value)
          } else if (step === 2 && step2Options[index]) {
            handleSelectOption('area_ha', step2Options[index].value)
          } else if (step === 3 && step3Options[index]) {
            handleSelectOption('gestao_atual', step3Options[index].value)
          } else if (step === 4 && step4Options[index]) {
            handleSelectOption('desafio_principal', step4Options[index].value)
          } else if (step === 5 && step5Branch.options[index]) {
            handleSelectOption('detalhe_desafio', step5Branch.options[index].value)
          } else if (step === 6 && step6Options[index]) {
            handleSelectOption('faturamento_anual', step6Options[index].value)
          } else if (step === 7 && step7Options[index]) {
            handleSelectOption('urgencia', step7Options[index].value)
          }
          return
        }
      }

      // Enter avança na etapa 8 ou submete na etapa 9
      if (e.key === 'Enter' && !e.shiftKey) {
        if (step === 8) {
          e.preventDefault()
          advanceStep()
        } else if (step === 9 && !isSubmitting) {
          e.preventDefault()
          handleSubmitFinal()
        }
      }

      // Backspace ou ArrowLeft para voltar (apenas se fora de input ou se input estiver vazio)
      if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
        if (!isInputFocused && step > 1) {
          e.preventDefault()
          goBack()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    isOpen,
    isSuccess,
    step,
    showExitConfirm,
    formData,
    step1Options,
    step2Options,
    step3Options,
    step4Options,
    step5Branch,
    step6Options,
    step7Options,
    handleSelectOption,
    advanceStep,
    goBack,
    onClose,
    isSubmitting,
  ])

  if (!isOpen) return null

  // Variantes de animação direcional
  const slideVariants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -30 : 30,
      opacity: 0,
    }),
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="diagnostic-dialog-title"
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#0A192F] text-white flex flex-col overflow-y-auto"
    >
      {/* Barra de Topo */}
      <header className="shrink-0 w-full border-b border-white/10 bg-[#0A192F]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-sm sm:text-base tracking-wider text-slate-100 uppercase">
            Fluxo Rural <span className="text-[#4ADE80] font-light">Consultoria</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-white/10 text-slate-300">
            <Sparkles size={11} className="text-[#E8B84B]" /> Diagnóstico Técnico
          </span>
        </div>

        {!isSuccess && (
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right">
              <span className="block text-xs font-semibold text-[#4ADE80]">
                Passo {step} de {TOTAL_STEPS}
              </span>
              <span className="block text-[11px] text-slate-400 font-mono">
                {progressPercent}% concluído
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (step === 1 && !formData.atividade) {
                  onClose()
                } else {
                  setShowExitConfirm(true)
                }
              }}
              aria-label="Fechar diagnóstico"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </header>

      {/* Barra de Progresso Animada */}
      {!isSuccess && (
        <div className="w-full h-1.5 bg-white/10 relative overflow-hidden shrink-0">
          <div
            className="h-full bg-gradient-to-r from-[#6AAF3D] to-[#4ADE80] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Conteúdo Central */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-6 sm:py-10 max-w-3xl w-full mx-auto relative">
        {isSuccess ? (
          <DiagnosticSuccessScreen
            data={formData}
            scoreResult={scoreResult || undefined}
            onClose={onClose}
          />
        ) : (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: shouldReduceMotion ? 0.15 : 0.22, ease: 'easeOut' }}
              className="w-full flex flex-col"
            >
              {/* Passo 1: Atividade Principal */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[#E8B84B] text-xs font-bold uppercase tracking-widest block mb-2">
                      01 · Atividade da Fazenda
                    </span>
                    <h1
                      id="diagnostic-dialog-title"
                      className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug"
                    >
                      Qual é a atividade principal da sua propriedade?
                    </h1>
                    <p className="mt-2 text-slate-300 text-sm sm:text-base font-light">
                      Selecione o carro-chefe da sua produção agropecuária.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {step1Options.map((opt, idx) => (
                      <OptionCard
                        key={opt.value}
                        index={idx}
                        label={opt.label}
                        description={opt.description}
                        active={formData.atividade === opt.value || selectedPendingOption === opt.value}
                        onClick={() => handleSelectOption('atividade', opt.value)}
                      />
                    ))}
                  </div>
                  {errors.atividade && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.atividade}</p>
                  )}
                </div>
              )}

              {/* Passo 2: Área Produtiva */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[#E8B84B] text-xs font-bold uppercase tracking-widest block mb-2">
                      02 · Dimensão da Operação
                    </span>
                    <h2
                      id="diagnostic-dialog-title"
                      className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug"
                    >
                      Qual é a área total trabalhada pela sua operação?
                    </h2>
                    <p className="mt-2 text-slate-300 text-sm sm:text-base font-light">
                      Considere a soma de áreas próprias e arrendadas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
                    {step2Options.map((opt, idx) => (
                      <OptionCard
                        key={opt.value}
                        index={idx}
                        label={opt.label}
                        description={opt.description}
                        active={formData.area_ha === opt.value || selectedPendingOption === opt.value}
                        onClick={() => handleSelectOption('area_ha', opt.value)}
                      />
                    ))}
                  </div>
                  {errors.area_ha && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.area_ha}</p>
                  )}
                </div>
              )}

              {/* Passo 3: Gestão Atual */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[#E8B84B] text-xs font-bold uppercase tracking-widest block mb-2">
                      03 · Organização e Controles
                    </span>
                    <h2
                      id="diagnostic-dialog-title"
                      className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug"
                    >
                      Como estão organizados os controles e finanças da fazenda hoje?
                    </h2>
                    <p className="mt-2 text-slate-300 text-sm sm:text-base font-light">
                      Seja sincero: essa informação calibra o ponto de partida do diagnóstico técnico.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
                    {step3Options.map((opt, idx) => (
                      <OptionCard
                        key={opt.value}
                        index={idx}
                        label={opt.label}
                        description={opt.description}
                        active={formData.gestao_atual === opt.value || selectedPendingOption === opt.value}
                        onClick={() => handleSelectOption('gestao_atual', opt.value)}
                      />
                    ))}
                  </div>
                  {errors.gestao_atual && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.gestao_atual}</p>
                  )}
                </div>
              )}

              {/* Passo 4: Gargalo Principal */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[#E8B84B] text-xs font-bold uppercase tracking-widest block mb-2">
                      04 · Principal Gargalo
                    </span>
                    <h2
                      id="diagnostic-dialog-title"
                      className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug"
                    >
                      Qual é o principal desafio que você quer destravar na gestão?
                    </h2>
                    <p className="mt-2 text-slate-300 text-sm sm:text-base font-light">
                      Escolha o ponto crítico que mais pressiona o negócio hoje.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
                    {step4Options.map((opt, idx) => (
                      <OptionCard
                        key={opt.value}
                        index={idx}
                        label={opt.label}
                        description={opt.description}
                        active={formData.desafio_principal === opt.value || selectedPendingOption === opt.value}
                        onClick={() => handleSelectOption('desafio_principal', opt.value)}
                      />
                    ))}
                  </div>
                  {errors.desafio_principal && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.desafio_principal}</p>
                  )}
                </div>
              )}

              {/* Passo 5: Detalhamento Dinâmico (Smart Branching) */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[#E8B84B] text-xs font-bold uppercase tracking-widest block mb-2">
                      05 · Aprofundamento do Desafio
                    </span>
                    <h2
                      id="diagnostic-dialog-title"
                      className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug"
                    >
                      {step5Branch.title}
                    </h2>
                    <p className="mt-2 text-slate-300 text-sm sm:text-base font-light">
                      {step5Branch.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
                    {step5Branch.options.map((opt, idx) => (
                      <OptionCard
                        key={opt.value}
                        index={idx}
                        label={opt.label}
                        description={opt.description}
                        active={formData.detalhe_desafio === opt.value || selectedPendingOption === opt.value}
                        onClick={() => handleSelectOption('detalhe_desafio', opt.value)}
                      />
                    ))}
                  </div>
                  {errors.detalhe_desafio && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.detalhe_desafio}</p>
                  )}
                </div>
              )}

              {/* Passo 6: Faturamento Bruto Anual */}
              {step === 6 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[#E8B84B] text-xs font-bold uppercase tracking-widest block mb-2">
                      06 · Porte Econômico
                    </span>
                    <h2
                      id="diagnostic-dialog-title"
                      className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug"
                    >
                      Qual é o faturamento bruto anual aproximado da operação?
                    </h2>
                    <p className="mt-2 text-slate-300 text-sm sm:text-base font-light">
                      Utilizado para calibrar a complexidade do diagnóstico. Você pode optar por não informar.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {step6Options.map((opt, idx) => (
                      <OptionCard
                        key={opt.value}
                        index={idx}
                        label={opt.label}
                        description={opt.description}
                        active={formData.faturamento_anual === opt.value || selectedPendingOption === opt.value}
                        onClick={() => handleSelectOption('faturamento_anual', opt.value)}
                      />
                    ))}
                  </div>
                  {errors.faturamento_anual && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.faturamento_anual}</p>
                  )}
                </div>
              )}

              {/* Passo 7: Urgência */}
              {step === 7 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[#E8B84B] text-xs font-bold uppercase tracking-widest block mb-2">
                      07 · Horizonte de Ação
                    </span>
                    <h2
                      id="diagnostic-dialog-title"
                      className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug"
                    >
                      Quando você pretende implementar melhorias na gestão da fazenda?
                    </h2>
                    <p className="mt-2 text-slate-300 text-sm sm:text-base font-light">
                      Ajuda a nossa equipe técnica a priorizar a sua agenda de atendimento.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
                    {step7Options.map((opt, idx) => (
                      <OptionCard
                        key={opt.value}
                        index={idx}
                        label={opt.label}
                        description={opt.description}
                        active={formData.urgencia === opt.value || selectedPendingOption === opt.value}
                        onClick={() => handleSelectOption('urgencia', opt.value)}
                      />
                    ))}
                  </div>
                  {errors.urgencia && (
                    <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.urgencia}</p>
                  )}
                </div>
              )}

              {/* Passo 8: Localização (UF -> Cidade IBGE) */}
              {step === 8 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[#E8B84B] text-xs font-bold uppercase tracking-widest block mb-2">
                      08 · Localização da Propriedade
                    </span>
                    <h2
                      id="diagnostic-dialog-title"
                      className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug"
                    >
                      Onde fica localizada a sua propriedade?
                    </h2>
                    <p className="mt-2 text-slate-300 text-sm sm:text-base font-light">
                      Atendemos produtores e empresas do agro em todo o Brasil.
                    </p>
                  </div>

                  <div className="space-y-5 bg-[#0D1F3C]/70 border border-white/10 rounded-2xl p-5 sm:p-7">
                    <UfCitySelector
                      uf={formData.estado}
                      cidade={formData.cidade}
                      onUfChange={(uf) => setFormData((prev) => ({ ...prev, estado: uf }))}
                      onCidadeChange={(cid) => setFormData((prev) => ({ ...prev, cidade: cid }))}
                      errorUf={errors.estado}
                      errorCidade={errors.cidade}
                    />

                    <div>
                      <label
                        htmlFor="nome_propriedade_input"
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                      >
                        Nome da Propriedade / Empresa <span className="text-slate-400 font-normal lowercase">(opcional)</span>
                      </label>
                      <input
                        id="nome_propriedade_input"
                        type="text"
                        value={formData.nome_propriedade}
                        onChange={(e) => setFormData({ ...formData, nome_propriedade: e.target.value })}
                        placeholder="Ex: Fazenda Santa Maria"
                        className="w-full h-14 px-4 rounded-xl bg-[#0A192F] border border-white/15 text-slate-100 text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={advanceStep}
                      disabled={!formData.estado || !formData.cidade}
                      className={cn(
                        'w-full min-h-[56px] h-14 px-6 rounded-xl font-bold text-base text-white shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2',
                        formData.estado && formData.cidade
                          ? 'bg-[#6AAF3D] hover:bg-[#6AAF3D]/90'
                          : 'bg-white/10 text-slate-400 cursor-not-allowed'
                      )}
                    >
                      <span>Avançar para a Identificação</span>
                      <ArrowRight size={18} />
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-2 font-mono">
                      Pressione Enter para prosseguir
                    </p>
                  </div>
                </div>
              )}

              {/* Passo 9: Identificação Final & Envio Seguro (Conversion Gate) */}
              {step === 9 && (
                <form onSubmit={handleSubmitFinal} className="space-y-6">
                  <div>
                    <span className="text-[#E8B84B] text-xs font-bold uppercase tracking-widest block mb-2">
                      09 · Finalização do Diagnóstico
                    </span>
                    <h2
                      id="diagnostic-dialog-title"
                      className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug"
                    >
                      Para onde devemos enviar a análise e agendar a sessão?
                    </h2>
                    <p className="mt-2 text-slate-300 text-sm sm:text-base font-light">
                      Nossa equipe técnica revisará os dados da sua propriedade e entrará em contato via WhatsApp em até 24 horas úteis.
                    </p>
                  </div>

                  {submitError && (
                    <div
                      className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-sm flex items-start gap-3"
                      role="alert"
                    >
                      <AlertCircle className="shrink-0 mt-0.5" size={18} />
                      <div>{submitError}</div>
                    </div>
                  )}

                  <div className="space-y-4 bg-[#0D1F3C]/70 border border-white/10 rounded-2xl p-5 sm:p-7">
                    {/* Nome Completo */}
                    <div>
                      <label
                        htmlFor="diag-nome-modal"
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                      >
                        Seu Nome Completo <span className="text-[#E8B84B]">*</span>
                      </label>
                      <input
                        id="diag-nome-modal"
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Ex: João da Silva"
                        autoComplete="name"
                        aria-invalid={!!errors.nome}
                        className={cn(
                          'w-full h-14 px-4 rounded-xl bg-[#0A192F] border text-slate-100 text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] transition-all',
                          errors.nome ? 'border-red-500' : 'border-white/15'
                        )}
                      />
                      {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome}</p>}
                    </div>

                    {/* WhatsApp & Email em Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="diag-whats-modal"
                          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                        >
                          WhatsApp com DDD <span className="text-[#E8B84B]">*</span>
                        </label>
                        <input
                          id="diag-whats-modal"
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) =>
                            setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })
                          }
                          placeholder="(11) 99999-9999"
                          autoComplete="tel"
                          aria-invalid={!!errors.whatsapp}
                          className={cn(
                            'w-full h-14 px-4 rounded-xl bg-[#0A192F] border text-slate-100 text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] transition-all font-mono',
                            errors.whatsapp ? 'border-red-500' : 'border-white/15'
                          )}
                        />
                        {errors.whatsapp && (
                          <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="diag-email-modal"
                          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                        >
                          Seu Melhor E-mail <span className="text-[#E8B84B]">*</span>
                        </label>
                        <input
                          id="diag-email-modal"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="joao@fazenda.com.br"
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          className={cn(
                            'w-full h-14 px-4 rounded-xl bg-[#0A192F] border text-slate-100 text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] transition-all',
                            errors.email ? 'border-red-500' : 'border-white/15'
                          )}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Consentimento LGPD */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.consent_lgpd}
                          onChange={(e) =>
                            setFormData({ ...formData, consent_lgpd: e.target.checked })
                          }
                          aria-invalid={!!errors.consent_lgpd}
                          className="w-5 h-5 mt-0.5 rounded border-white/20 bg-[#0A192F] text-[#6AAF3D] focus:ring-[#4ADE80] cursor-pointer"
                        />
                        <span className="text-xs text-slate-300 leading-relaxed font-light">
                          Concordo com a{' '}
                          <a
                            href="/politica-de-privacidade"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4ADE80] underline hover:text-white"
                          >
                            Política de Privacidade
                          </a>{' '}
                          e autorizo a equipe técnica da Fluxo Rural a entrar em contato sobre o diagnóstico.
                        </span>
                      </label>
                      {errors.consent_lgpd && (
                        <p className="text-red-400 text-xs mt-1.5">{errors.consent_lgpd}</p>
                      )}
                    </div>
                  </div>

                  {/* Botão de Envio Principal */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        'w-full min-h-[58px] h-14 sm:h-16 px-6 rounded-xl font-bold text-base sm:text-lg text-white shadow-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5',
                        'bg-[#6AAF3D] hover:bg-[#6AAF3D]/90 active:scale-[0.99] border border-[#6AAF3D]/50',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A192F]'
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Processando Análise...</span>
                        </>
                      ) : (
                        <>
                          <span>Concluir Diagnóstico e Agendar Sessão Gratuita</span>
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 pt-2">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#4ADE80]" /> Sigilo absoluto
                    </span>
                    <span>·</span>
                    <span>⏱️ Retorno técnico em até 24h úteis</span>
                    <span>·</span>
                    <span>🛡️ Sem custos</span>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Barra de Rodapé com Controles de Navegação */}
      {!isSuccess && (
        <footer className="shrink-0 w-full border-t border-white/10 bg-[#0A192F]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                aria-label="Voltar para o passo anterior"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-slate-200 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Voltar</span>
              </button>
            ) : (
              <div className="text-xs text-slate-400 font-light flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#4ADE80]" /> Dados 100% confidenciais
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
            {step <= 7 ? (
              <span>Pressione 1 a 6 no teclado para selecionar</span>
            ) : step === 8 ? (
              <span>Pressione Enter para avançar</span>
            ) : (
              <span>Preencha os dados e pressione Enter</span>
            )}
          </div>
        </footer>
      )}

      {/* Modal de Confirmação de Saída Não-Destrutivo */}
      {showExitConfirm && (
        <div
          role="alertdialog"
          aria-labelledby="exit-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-[#0D1F3C] border border-white/15 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 id="exit-modal-title" className="font-heading text-xl font-bold text-white mb-2">
              Deseja realmente sair?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
              Você já preencheu {step - 1} de {TOTAL_STEPS} etapas. Se sair agora, o seu progresso neste diagnóstico será descartado.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#6AAF3D] hover:bg-[#6AAF3D]/90 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Continuar Diagnóstico
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false)
                  onClose()
                }}
                className="py-3 px-4 rounded-xl border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 text-sm transition-colors cursor-pointer"
              >
                Sair Mesmo Assim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
