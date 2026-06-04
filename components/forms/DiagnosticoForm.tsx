'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
]

// ─────────── Produtor Rural ───────────
const ATIVIDADES = [
  'Grãos (soja, milho, trigo)',
  'Pecuária (gado corte/leite)',
  'Frutas/hortaliças',
  'Café',
  'Cana-de-açúcar',
  'Múltiplas atividades',
  'Outra',
]

const FATURAMENTO_OPTIONS = [
  { label: 'Menos de R$ 100 mil', value: '<100k' },
  { label: 'R$ 100 mil – 500 mil', value: '100k-500k' },
  { label: 'R$ 500 mil – 1 milhão', value: '500k-1M' },
  { label: 'R$ 1 milhão – 5 milhões', value: '1M-5M' },
  { label: 'Mais de R$ 5 milhões', value: '>5M' },
]

const HECTARES_OPTIONS = [
  { label: 'Menos de 50 ha', value: '<50ha' },
  { label: '50 – 200 ha', value: '50-200ha' },
  { label: '200 – 500 ha', value: '200-500ha' },
  { label: 'Mais de 500 ha', value: '>500ha' },
]

const DESAFIOS_OPTIONS = [
  'Gestão financeira',
  'Fluxo de caixa',
  'Dívidas',
  'Crescimento',
  'Sucessão familiar',
  'Inovação',
  'Não sei por onde começar',
]

const GESTAO_OPTIONS = [
  'Sim, estruturada',
  'Parcialmente (planilhas)',
  'Básico',
  'Nenhuma',
]

const FILHOS_OPTIONS = [
  'Sim, 1 filho',
  'Sim, 2+ filhos',
  'Não tem',
  'Não sei',
]

const SITUACAO_FILHOS_OPTIONS = [
  'Já trabalham na propriedade',
  'Querem entrar',
  'Interesse mas outra área',
  'Não tenho certeza',
]

const CONFLITO_OPTIONS = [
  'Não, alinhados',
  'Algumas discussões',
  'Brigas sérias',
  'Prefiro não comentar',
]

const DIVIDAS_OPTIONS = [
  { label: 'Nenhuma', value: 'Nenhuma' },
  { label: 'Pequenas (< 20% do faturamento)', value: 'Pequenas (<20%)' },
  { label: 'Moderadas (20–50%)', value: 'Moderadas (20-50%)' },
  { label: 'Altas (> 50%)', value: 'Altas (>50%)' },
]

const INVESTIMENTO_OPTIONS = [
  { label: 'Nada', value: 'Nada' },
  { label: 'Menos de R$ 10 mil', value: '<10k' },
  { label: 'R$ 10 mil – 50 mil', value: '10k-50k' },
  { label: 'R$ 50 mil – 200 mil', value: '50k-200k' },
  { label: 'Mais de R$ 200 mil', value: '>200k' },
]

const URGENCIA_OPTIONS = [
  'Próximos 30 dias',
  'Próximos 3 meses',
  'Até fim do ano',
  'Sem pressa',
]

const CONSULTOR_OPTIONS = [
  'Sim, recomendaria',
  'Sim, não funcionou',
  'Nunca',
  'Não tenho certeza',
]

const EXPECTATIVA_OPTIONS = [
  'Entender meus números',
  'Ter um plano de ação',
  'Saber como preparar sucessão',
  'Descobrir se preciso ajuda',
  'Apenas conversar',
]

// ─────────── Empresa do Agro (B2B) ───────────
const SEGMENTOS_EMPRESA = [
  'Revenda / distribuidora de insumos',
  'Cooperativa',
  'Agtech / startup',
  'Indústria / processamento',
  'Prestador de serviço ao agro',
  'Comércio agro (loja/varejo)',
  'Outro',
]

const FATURAMENTO_EMPRESA_OPTIONS = [
  { label: 'Até R$ 500 mil', value: '<500k' },
  { label: 'R$ 500 mil – 2 milhões', value: '500k-2M' },
  { label: 'R$ 2 milhões – 10 milhões', value: '2M-10M' },
  { label: 'R$ 10 milhões – 50 milhões', value: '10M-50M' },
  { label: 'Mais de R$ 50 milhões', value: '>50M' },
]

const FUNCIONARIOS_OPTIONS = [
  'Só eu / sócios',
  '1 a 10',
  '11 a 50',
  '51 a 200',
  'Mais de 200',
]

const TEMPO_OPERACAO_OPTIONS = [
  'Menos de 1 ano',
  '1 a 3 anos',
  '3 a 10 anos',
  'Mais de 10 anos',
]

const CARGO_OPTIONS = [
  'Dono / sócio',
  'Diretor / C-level',
  'Gerente',
  'Coordenador / analista',
  'Outro',
]

const GERA_CLIENTES_OPTIONS = [
  'Só indicação / boca a boca',
  'Vendedores na rua / prospecção ativa',
  'Redes sociais e conteúdo',
  'Tráfego pago / anúncios',
  'Mix de canais estruturado',
]

const PRESENCA_DIGITAL_OPTIONS = [
  'Não tem presença digital',
  'Só redes sociais, sem constância',
  'Posta com frequência, mas sem estratégia',
  'Estratégia definida e ativa',
]

const PROCESSO_VENDAS_OPTIONS = [
  'Não, cada venda é do jeito que dá',
  'Tem um básico, mas não é seguido',
  'Processo definido, sem ferramenta/CRM',
  'Processo + CRM funcionando',
]

const DESAFIOS_EMPRESA_OPTIONS = [
  'Gerar leads / novos clientes',
  'Estruturar marketing e vendas',
  'Presença digital fraca',
  'Gestão financeira',
  'Escalar / crescer',
  'Time e processos',
  'Dados e indicadores',
  'Não sei por onde começar',
]

const EXPECTATIVA_EMPRESA_OPTIONS = [
  'Vender mais / gerar clientes',
  'Organizar marketing e vendas',
  'Profissionalizar a gestão',
  'Ter um plano de crescimento',
  'Descobrir se preciso de ajuda',
  'Apenas conversar',
]

type Perfil = 'produtor' | 'empresa'
type Etapa = 'perfil' | 'contato' | 'gate' | 'perguntas'

interface FormData {
  perfil: Perfil | ''
  nome: string
  email: string
  whatsapp: string
  estado: string
  empresa: string
  // produtor
  atividade: string
  faturamento: string
  hectares: string
  desafios: string[]
  gestao: string
  filhos: string
  situacaoFilhos: string
  conflito: string
  dividas: string
  investimento: string
  urgencia: string
  consultor: string
  expectativa: string
  // empresa (B2B)
  cargo?: string
  segmento?: string
  faturamentoEmpresa?: string
  funcionarios?: string
  tempoOperacao?: string
  geraClientes?: string
  presencaDigital?: string
  processoVendas?: string
  expectativaEmpresa?: string
}

type QualLevel = 'verde' | 'amarelo' | 'laranja' | 'vermelho'

// Scoring do PRODUTOR — inalterado
function calculateScore(d: FormData): number {
  let score = 0

  const fat: Record<string, number> = { '<100k': 0, '100k-500k': 10, '500k-1M': 20, '1M-5M': 25, '>5M': 30 }
  score += fat[d.faturamento] || 0

  const hec: Record<string, number> = { '<50ha': 0, '50-200ha': 5, '200-500ha': 7, '>500ha': 10 }
  score += hec[d.hectares] || 0

  let desafioScore = 0
  if (d.desafios.includes('Gestão financeira')) desafioScore += 10
  if (d.desafios.includes('Dívidas')) desafioScore += 8
  if (d.desafios.includes('Sucessão familiar')) desafioScore += 10
  if (d.desafios.includes('Fluxo de caixa')) desafioScore += 5
  if (d.desafios.includes('Crescimento')) desafioScore += 5
  if (d.desafios.includes('Não sei por onde começar')) desafioScore += 10
  if (d.desafios.includes('Inovação')) desafioScore += 3
  score += Math.min(desafioScore, 25)

  const conf: Record<string, number> = { 'Não, alinhados': 0, 'Algumas discussões': 8, 'Brigas sérias': 20, 'Prefiro não comentar': 5 }
  score += conf[d.conflito] || 0

  const sit: Record<string, number> = { 'Já trabalham na propriedade': 15, 'Querem entrar': 15, 'Interesse mas outra área': 5, 'Não tenho certeza': 3 }
  score += sit[d.situacaoFilhos] || 0

  const div: Record<string, number> = { 'Nenhuma': 0, 'Pequenas (<20%)': 5, 'Moderadas (20-50%)': 15, 'Altas (>50%)': 20 }
  score += div[d.dividas] || 0

  const inv: Record<string, number> = { 'Nada': 0, '<10k': 2, '10k-50k': 5, '50k-200k': 7, '>200k': 10 }
  score += inv[d.investimento] || 0

  const urg: Record<string, number> = { 'Próximos 30 dias': 25, 'Próximos 3 meses': 15, 'Até fim do ano': 8, 'Sem pressa': 0 }
  score += urg[d.urgencia] || 0

  const con: Record<string, number> = { 'Sim, recomendaria': 5, 'Sim, não funcionou': 0, 'Nunca': 5, 'Não tenho certeza': 0 }
  score += con[d.consultor] || 0

  const exp: Record<string, number> = { 'Entender meus números': 5, 'Ter um plano de ação': 10, 'Saber como preparar sucessão': 10, 'Descobrir se preciso ajuda': 5, 'Apenas conversar': 0 }
  score += exp[d.expectativa] || 0

  return score
}

// Scoring da EMPRESA (B2B) — prioriza dor de marketing/vendas + porte + urgência
function calculateScoreEmpresa(d: FormData): number {
  let score = 0

  const fat: Record<string, number> = { '<500k': 5, '500k-2M': 15, '2M-10M': 25, '10M-50M': 30, '>50M': 30 }
  score += fat[d.faturamentoEmpresa || ''] || 0

  const fun: Record<string, number> = { 'Só eu / sócios': 2, '1 a 10': 5, '11 a 50': 8, '51 a 200': 10, 'Mais de 200': 10 }
  score += fun[d.funcionarios || ''] || 0

  const tmp: Record<string, number> = { 'Menos de 1 ano': 2, '1 a 3 anos': 5, '3 a 10 anos': 5, 'Mais de 10 anos': 3 }
  score += tmp[d.tempoOperacao || ''] || 0

  const ges: Record<string, number> = { 'Sim, estruturada': 2, 'Parcialmente (planilhas)': 10, 'Básico': 13, 'Nenhuma': 15 }
  score += ges[d.gestao] || 0

  const ger: Record<string, number> = { 'Só indicação / boca a boca': 20, 'Vendedores na rua / prospecção ativa': 12, 'Redes sociais e conteúdo': 8, 'Tráfego pago / anúncios': 6, 'Mix de canais estruturado': 3 }
  score += ger[d.geraClientes || ''] || 0

  const pre: Record<string, number> = { 'Não tem presença digital': 15, 'Só redes sociais, sem constância': 12, 'Posta com frequência, mas sem estratégia': 8, 'Estratégia definida e ativa': 3 }
  score += pre[d.presencaDigital || ''] || 0

  const pro: Record<string, number> = { 'Não, cada venda é do jeito que dá': 15, 'Tem um básico, mas não é seguido': 11, 'Processo definido, sem ferramenta/CRM': 7, 'Processo + CRM funcionando': 3 }
  score += pro[d.processoVendas || ''] || 0

  let desafioScore = 0
  if (d.desafios.includes('Gerar leads / novos clientes')) desafioScore += 10
  if (d.desafios.includes('Estruturar marketing e vendas')) desafioScore += 10
  if (d.desafios.includes('Presença digital fraca')) desafioScore += 6
  if (d.desafios.includes('Gestão financeira')) desafioScore += 8
  if (d.desafios.includes('Escalar / crescer')) desafioScore += 6
  if (d.desafios.includes('Time e processos')) desafioScore += 5
  if (d.desafios.includes('Dados e indicadores')) desafioScore += 5
  if (d.desafios.includes('Não sei por onde começar')) desafioScore += 8
  score += Math.min(desafioScore, 25)

  const urg: Record<string, number> = { 'Próximos 30 dias': 25, 'Próximos 3 meses': 15, 'Até fim do ano': 8, 'Sem pressa': 0 }
  score += urg[d.urgencia] || 0

  const exp: Record<string, number> = { 'Vender mais / gerar clientes': 10, 'Organizar marketing e vendas': 10, 'Profissionalizar a gestão': 8, 'Ter um plano de crescimento': 8, 'Descobrir se preciso de ajuda': 5, 'Apenas conversar': 0 }
  score += exp[d.expectativaEmpresa || ''] || 0

  const car: Record<string, number> = { 'Dono / sócio': 5, 'Diretor / C-level': 5, 'Gerente': 3, 'Coordenador / analista': 1, 'Outro': 1 }
  score += car[d.cargo || ''] || 0

  return score
}

function getQualLevel(score: number): QualLevel {
  if (score >= 100) return 'verde'
  if (score >= 70) return 'amarelo'
  if (score >= 40) return 'laranja'
  return 'vermelho'
}

const SCRIPT_URL = '/api/diagnostico'
const selectClass = 'w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-navy/30'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

export function DiagnosticoForm() {
  const [etapa, setEtapa] = useState<Etapa>('perfil')
  const [form, setForm] = useState<FormData>({
    perfil: '',
    nome: '', email: '', whatsapp: '', estado: '', empresa: '',
    atividade: '', faturamento: '', hectares: '',
    desafios: [], gestao: '', filhos: '', situacaoFilhos: '',
    conflito: '', dividas: '', investimento: '',
    urgencia: '', consultor: '', expectativa: '',
    cargo: '', segmento: '', faturamentoEmpresa: '',
    funcionarios: '', tempoOperacao: '', geraClientes: '',
    presencaDigital: '', processoVendas: '', expectativaEmpresa: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<false | 'parcial' | 'completo'>(false)
  const [error, setError] = useState(false)
  const [utmParams, setUtmParams] = useState({ utm_source: '', utm_medium: '', utm_campaign: '' })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setUtmParams({
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
      })
    }
  }, [])

  const isEmpresa = form.perfil === 'empresa'
  const score = useMemo(() => (isEmpresa ? calculateScoreEmpresa(form) : calculateScore(form)), [form, isEmpresa])
  const qualLevel = useMemo(() => getQualLevel(score), [score])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const gtagEvent = (name: string, params?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', name, params || {})
    }
  }

  // Seleciona perfil e zera os campos ramificados (caso volte e troque)
  const escolherPerfil = (p: Perfil) => {
    setForm(prev => ({
      ...prev,
      perfil: p,
      atividade: '', faturamento: '', hectares: '',
      gestao: '', filhos: '', situacaoFilhos: '', conflito: '',
      dividas: '', investimento: '', consultor: '', expectativa: '',
      desafios: [],
      cargo: '', segmento: '', faturamentoEmpresa: '',
      funcionarios: '', tempoOperacao: '', geraClientes: '',
      presencaDigital: '', processoVendas: '', expectativaEmpresa: '',
    }))
  }

  const toggleDesafio = (desafio: string) => {
    setForm(prev => {
      const has = prev.desafios.includes(desafio)
      if (has) return { ...prev, desafios: prev.desafios.filter(d => d !== desafio) }
      if (prev.desafios.length >= 3) return prev
      return { ...prev, desafios: [...prev.desafios, desafio] }
    })
  }

  const origem = utmParams.utm_source ? `ads-${utmParams.utm_source}` : 'diagnostico-gratis'

  const contatoValido = !!(form.nome && form.whatsapp && form.email && form.empresa && form.estado)
  const perguntasValidas = isEmpresa
    ? !!(form.segmento && form.faturamentoEmpresa && form.funcionarios && form.tempoOperacao &&
         form.gestao && form.geraClientes && form.presencaDigital && form.processoVendas &&
         form.desafios.length > 0 && form.urgencia && form.expectativaEmpresa)
    : !!(form.atividade && form.faturamento && form.hectares && form.desafios.length > 0 &&
         form.gestao && form.urgencia && form.expectativa)

  // Etapa 2 → envia o LEAD PARCIAL (contato) e segue pro gate
  const handleContato = async () => {
    if (!contatoValido) return
    setSubmitting(true)
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          etapa: 'contato',
          perfil: form.perfil,
          nome: form.nome,
          email: form.email,
          whatsapp: form.whatsapp,
          empresa: form.empresa,
          estado: form.estado,
          origem,
          ...utmParams,
        }),
      })
    } catch {
      // segue mesmo se falhar — o envio completo no fim é o backup
    }
    gtagEvent('diagnostico_contato', { perfil: form.perfil })
    setSubmitting(false)
    setEtapa('gate')
  }

  // Etapa final → envia o DIAGNÓSTICO COMPLETO + dispara e-mail rico pro Lucas
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!perguntasValidas) return
    setSubmitting(true)
    setError(false)

    const common = {
      etapa: 'completo',
      perfil: form.perfil,
      nome: form.nome,
      email: form.email,
      whatsapp: form.whatsapp,
      empresa: form.empresa,
      estado: form.estado,
      desafios: form.desafios.join(', '),
      urgencia: form.urgencia,
      origem,
      score,
      qualificationLevel: qualLevel,
      ...utmParams,
    }

    const payload = isEmpresa
      ? {
          ...common,
          cargo: form.cargo,
          segmento: form.segmento,
          faturamentoEmpresa: form.faturamentoEmpresa,
          funcionarios: form.funcionarios,
          tempoOperacao: form.tempoOperacao,
          gestao: form.gestao,
          geraClientes: form.geraClientes,
          presencaDigital: form.presencaDigital,
          processoVendas: form.processoVendas,
          expectativa: form.expectativaEmpresa,
        }
      : {
          ...common,
          atividade: form.atividade,
          faturamento: form.faturamento,
          hectares: form.hectares,
          gestao: form.gestao,
          filhos: form.filhos,
          situacaoFilhos: form.situacaoFilhos,
          conflito: form.conflito,
          dividas: form.dividas,
          investimento: form.investimento,
          consultor: form.consultor,
          expectativa: form.expectativa,
        }

    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Falha no envio')
      gtagEvent('diagnostico_scored', { score, level: qualLevel, perfil: form.perfil })
      gtagEvent('diagnostico_submit', { perfil: form.perfil })
      setSubmitted('completo')
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const primeiroNome = (form.nome || '').split(' ')[0]

  // ── Telas finais ──
  if (submitted === 'completo') {
    return (
      <div className="text-center py-10 space-y-4">
        <CheckCircle2 className="mx-auto text-verde-folha" size={64} />
        <h3 className="text-2xl font-heading font-bold text-navy">Diagnóstico recebido! 📋</h3>
        <p className="text-carvao/60 max-w-md mx-auto">
          Obrigado, {primeiroNome}! Recebemos suas respostas e entraremos em contato em breve para agendar sua sessão.
        </p>
      </div>
    )
  }

  if (submitted === 'parcial') {
    return (
      <div className="text-center py-10 space-y-4">
        <CheckCircle2 className="mx-auto text-verde-folha" size={64} />
        <h3 className="text-2xl font-heading font-bold text-navy">Recebemos seu contato! 👍</h3>
        <p className="text-carvao/60 max-w-md mx-auto">
          Obrigado, {primeiroNome}! Já estamos com seus dados e entraremos em contato em breve. Quando quiser, é só voltar para responder o diagnóstico completo.
        </p>
      </div>
    )
  }

  // Progresso (3 etapas; gate compartilha com contato)
  const passo = etapa === 'perfil' ? 1 : etapa === 'perguntas' ? 3 : 2
  const pct = passo === 1 ? 33 : passo === 2 ? 66 : 100

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-medium text-navy whitespace-nowrap">{passo} de 3</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-verde-folha rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* ── ETAPA 1: PERFIL (sem default) ── */}
      {etapa === 'perfil' && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Este diagnóstico é pra... *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                ['produtor', 'Produtor Rural', 'Tenho propriedade / faço a gestão da fazenda'],
                ['empresa', 'Empresa do Agro', 'Revenda, cooperativa, agtech, indústria, serviços ou comércio'],
              ] as const).map(([val, titulo, sub]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => escolherPerfil(val)}
                  className={`text-left p-4 rounded-xl border-2 transition-colors ${
                    form.perfil === val
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-carvao/70 border-gray-300 hover:border-navy/50'
                  }`}
                >
                  <span className="block font-bold text-sm">{titulo}</span>
                  <span className={`block text-xs mt-0.5 ${form.perfil === val ? 'text-white/70' : 'text-carvao/50'}`}>{sub}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-carvao/50 mt-2">Escolha uma opção para continuar.</p>
          </div>

          <Button type="button" onClick={() => setEtapa('contato')} disabled={form.perfil === ''} className="w-full" size="lg">
            Próximo <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      )}

      {/* ── ETAPA 2: CONTATO (envia lead parcial) ── */}
      {etapa === 'contato' && (
        <div className="space-y-5">
          <p className="text-sm text-carvao/50">Leva menos de 30 segundos</p>

          <div>
            <label className={labelClass}>Nome completo *</label>
            <Input name="nome" value={form.nome} onChange={handleChange} required placeholder="Seu nome" />
          </div>

          <div>
            <label className={labelClass}>WhatsApp *</label>
            <Input name="whatsapp" value={form.whatsapp} onChange={handleChange} required type="tel" placeholder="(XX) 9XXXX-XXXX" />
          </div>

          <div>
            <label className={labelClass}>E-mail *</label>
            <Input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="seu@email.com" />
          </div>

          <div>
            <label className={labelClass}>Empresa / Propriedade *</label>
            <Input name="empresa" value={form.empresa} onChange={handleChange} required placeholder="Nome da empresa ou propriedade" />
          </div>

          <div>
            <label className={labelClass}>Estado *</label>
            <select name="estado" value={form.estado} onChange={handleChange} required className={selectClass}>
              <option value="">Selecione...</option>
              {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setEtapa('perfil')} className="flex-1" size="lg">
              <ArrowLeft className="mr-2" size={18} /> Voltar
            </Button>
            <Button type="button" onClick={handleContato} disabled={submitting || !contatoValido} className="flex-1" size="lg">
              {submitting ? 'Enviando...' : <>Continuar <ArrowRight className="ml-2" size={18} /></>}
            </Button>
          </div>
        </div>
      )}

      {/* ── ETAPA 3: GATE ── */}
      {etapa === 'gate' && (
        <div className="space-y-6 text-center py-4">
          <h3 className="font-heading text-2xl font-bold text-navy">Tudo certo, {primeiroNome}! 🎉</h3>
          <p className="text-carvao/70 max-w-md mx-auto">
            Pra gente já chegar com um diagnóstico de verdade, dá pra responder algumas perguntas rápidas agora? Leva cerca de 3 minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button type="button" onClick={() => setEtapa('perguntas')} size="lg" className="sm:px-8">
              Sim, vamos lá <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button type="button" variant="outline" onClick={() => setSubmitted('parcial')} size="lg">
              Agora não
            </Button>
          </div>
          <p className="text-xs text-carvao/40 pt-2">Seus dados já foram recebidos. Sem compromisso.</p>
        </div>
      )}

      {/* ── ETAPA 4: PERGUNTAS (diagnóstico completo) ── */}
      {etapa === 'perguntas' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-carvao/50">Responda com calma — leva cerca de 3 minutos</p>

          {isEmpresa ? (
            /* ===== EMPRESA DO AGRO ===== */
            <>
              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-navy uppercase tracking-wide">A Empresa</legend>

                <div>
                  <label className={labelClass}>Segmento da empresa *</label>
                  <select name="segmento" value={form.segmento || ''} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {SEGMENTOS_EMPRESA.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Faturamento anual *</label>
                  <select name="faturamentoEmpresa" value={form.faturamentoEmpresa || ''} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {FATURAMENTO_EMPRESA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Número de funcionários *</label>
                  <select name="funcionarios" value={form.funcionarios || ''} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {FUNCIONARIOS_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Há quanto tempo a empresa opera? *</label>
                  <select name="tempoOperacao" value={form.tempoOperacao || ''} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {TEMPO_OPERACAO_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Seu cargo</label>
                  <select name="cargo" value={form.cargo || ''} onChange={handleChange} className={selectClass}>
                    <option value="">Selecione...</option>
                    {CARGO_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-navy uppercase tracking-wide">Gestão</legend>
                <div>
                  <label className={labelClass}>A gestão da empresa é estruturada? *</label>
                  <select name="gestao" value={form.gestao} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {GESTAO_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-navy uppercase tracking-wide">Marketing &amp; Vendas</legend>

                <div>
                  <label className={labelClass}>Como a empresa consegue clientes hoje? *</label>
                  <select name="geraClientes" value={form.geraClientes || ''} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {GERA_CLIENTES_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Como está a presença digital da empresa? *</label>
                  <select name="presencaDigital" value={form.presencaDigital || ''} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {PRESENCA_DIGITAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Existe um processo de vendas estruturado? *</label>
                  <select name="processoVendas" value={form.processoVendas || ''} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {PROCESSO_VENDAS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-navy uppercase tracking-wide">Desafios &amp; Urgência</legend>

                <div>
                  <label className={labelClass}>Maior desafio AGORA (máx. 3) *</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DESAFIOS_EMPRESA_OPTIONS.map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDesafio(d)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          form.desafios.includes(d) ? 'bg-navy text-white border-navy' : 'bg-white text-carvao/70 border-gray-300 hover:border-navy/50'
                        } ${!form.desafios.includes(d) && form.desafios.length >= 3 ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Urgência para resolver? *</label>
                  <select name="urgencia" value={form.urgencia} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {URGENCIA_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>O que espera do diagnóstico? *</label>
                  <select name="expectativaEmpresa" value={form.expectativaEmpresa || ''} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {EXPECTATIVA_EMPRESA_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </fieldset>
            </>
          ) : (
            /* ===== PRODUTOR RURAL ===== */
            <>
              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-navy uppercase tracking-wide">Atividade Rural</legend>

                <div>
                  <label className={labelClass}>Principal atividade *</label>
                  <select name="atividade" value={form.atividade} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {ATIVIDADES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Faturamento anual *</label>
                  <select name="faturamento" value={form.faturamento} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {FATURAMENTO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Hectares aproximados *</label>
                  <select name="hectares" value={form.hectares} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {HECTARES_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-navy uppercase tracking-wide">Gestão Financeira</legend>

                <div>
                  <label className={labelClass}>Maior desafio AGORA (máx. 3) *</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DESAFIOS_OPTIONS.map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDesafio(d)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          form.desafios.includes(d) ? 'bg-navy text-white border-navy' : 'bg-white text-carvao/70 border-gray-300 hover:border-navy/50'
                        } ${!form.desafios.includes(d) && form.desafios.length >= 3 ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Gestão estruturada? *</label>
                  <select name="gestao" value={form.gestao} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {GESTAO_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-navy uppercase tracking-wide">Sucessão &amp; Família</legend>

                <div>
                  <label className={labelClass}>Filhos/herdeiros interessados?</label>
                  <select name="filhos" value={form.filhos} onChange={handleChange} className={selectClass}>
                    <option value="">Selecione...</option>
                    {FILHOS_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Situação dos filhos</label>
                  <select name="situacaoFilhos" value={form.situacaoFilhos} onChange={handleChange} className={selectClass}>
                    <option value="">Selecione...</option>
                    {SITUACAO_FILHOS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Existe conflito familiar?</label>
                  <select name="conflito" value={form.conflito} onChange={handleChange} className={selectClass}>
                    <option value="">Selecione...</option>
                    {CONFLITO_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-navy uppercase tracking-wide">Saúde Financeira</legend>

                <div>
                  <label className={labelClass}>Dívidas (financiamentos/empréstimos)?</label>
                  <select name="dividas" value={form.dividas} onChange={handleChange} className={selectClass}>
                    <option value="">Selecione...</option>
                    {DIVIDAS_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Investimento em tecnologia/ano?</label>
                  <select name="investimento" value={form.investimento} onChange={handleChange} className={selectClass}>
                    <option value="">Selecione...</option>
                    {INVESTIMENTO_OPTIONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                  </select>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-sm font-bold text-navy uppercase tracking-wide">Urgência &amp; Expectativa</legend>

                <div>
                  <label className={labelClass}>Urgência para resolver? *</label>
                  <select name="urgencia" value={form.urgencia} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {URGENCIA_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Já trabalhou com consultor?</label>
                  <select name="consultor" value={form.consultor} onChange={handleChange} className={selectClass}>
                    <option value="">Selecione...</option>
                    {CONSULTOR_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>O que espera do diagnóstico? *</label>
                  <select name="expectativa" value={form.expectativa} onChange={handleChange} required className={selectClass}>
                    <option value="">Selecione...</option>
                    {EXPECTATIVA_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </fieldset>
            </>
          )}

          {error && (
            <p className="text-red-500 text-sm">
              Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.
            </p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setEtapa('gate')} className="flex-1" size="lg">
              <ArrowLeft className="mr-2" size={18} /> Voltar
            </Button>
            <Button type="submit" disabled={submitting || !perguntasValidas} className="flex-1" size="lg">
              {submitting ? 'Enviando...' : 'Enviar Diagnóstico'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
