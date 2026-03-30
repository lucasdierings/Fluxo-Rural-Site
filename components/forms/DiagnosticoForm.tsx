'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf4afizws5cwq0vcPcc7LTaBxUERprs6Ahgy0QzwiYHOOakPWS9VdmBqM7YOHkiK0Iug/exec'

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
]

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

interface FormData {
  nome: string
  email: string
  whatsapp: string
  estado: string
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
}

type QualLevel = 'verde' | 'amarelo' | 'laranja' | 'vermelho'

function calculateScore(d: FormData): number {
  let score = 0

  // Faturamento (max 30)
  const fat: Record<string, number> = { '<100k': 0, '100k-500k': 10, '500k-1M': 20, '1M-5M': 25, '>5M': 30 }
  score += fat[d.faturamento] || 0

  // Hectares (max 10)
  const hec: Record<string, number> = { '<50ha': 0, '50-200ha': 5, '200-500ha': 7, '>500ha': 10 }
  score += hec[d.hectares] || 0

  // Desafios (max 25)
  let desafioScore = 0
  if (d.desafios.includes('Gestão financeira')) desafioScore += 10
  if (d.desafios.includes('Dívidas')) desafioScore += 8
  if (d.desafios.includes('Sucessão familiar')) desafioScore += 10
  if (d.desafios.includes('Fluxo de caixa')) desafioScore += 5
  if (d.desafios.includes('Crescimento')) desafioScore += 5
  if (d.desafios.includes('Não sei por onde começar')) desafioScore += 10
  if (d.desafios.includes('Inovação')) desafioScore += 3
  score += Math.min(desafioScore, 25)

  // Conflito (max 20)
  const conf: Record<string, number> = { 'Não, alinhados': 0, 'Algumas discussões': 8, 'Brigas sérias': 20, 'Prefiro não comentar': 5 }
  score += conf[d.conflito] || 0

  // Situação filhos (max 15)
  const sit: Record<string, number> = { 'Já trabalham na propriedade': 15, 'Querem entrar': 15, 'Interesse mas outra área': 5, 'Não tenho certeza': 3 }
  score += sit[d.situacaoFilhos] || 0

  // Dívidas (max 20)
  const div: Record<string, number> = { 'Nenhuma': 0, 'Pequenas (<20%)': 5, 'Moderadas (20-50%)': 15, 'Altas (>50%)': 20 }
  score += div[d.dividas] || 0

  // Investimento (max 10)
  const inv: Record<string, number> = { 'Nada': 0, '<10k': 2, '10k-50k': 5, '50k-200k': 7, '>200k': 10 }
  score += inv[d.investimento] || 0

  // Urgência (max 25)
  const urg: Record<string, number> = { 'Próximos 30 dias': 25, 'Próximos 3 meses': 15, 'Até fim do ano': 8, 'Sem pressa': 0 }
  score += urg[d.urgencia] || 0

  // Consultor (max 5)
  const con: Record<string, number> = { 'Sim, recomendaria': 5, 'Sim, não funcionou': 0, 'Nunca': 5, 'Não tenho certeza': 0 }
  score += con[d.consultor] || 0

  // Expectativa (max 10)
  const exp: Record<string, number> = { 'Entender meus números': 5, 'Ter um plano de ação': 10, 'Saber como preparar sucessão': 10, 'Descobrir se preciso ajuda': 5, 'Apenas conversar': 0 }
  score += exp[d.expectativa] || 0

  return score
}

function getQualLevel(score: number): QualLevel {
  if (score >= 100) return 'verde'
  if (score >= 70) return 'amarelo'
  if (score >= 40) return 'laranja'
  return 'vermelho'
}

const selectClass = 'w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-navy/30'

export function DiagnosticoForm() {
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<FormData>({
    nome: '', email: '', whatsapp: '', estado: '',
    atividade: '', faturamento: '', hectares: '',
    desafios: [], gestao: '', filhos: '', situacaoFilhos: '',
    conflito: '', dividas: '', investimento: '',
    urgencia: '', consultor: '', expectativa: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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

  const score = useMemo(() => calculateScore(form), [form])
  const qualLevel = useMemo(() => getQualLevel(score), [score])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleDesafio = (desafio: string) => {
    setForm(prev => {
      const has = prev.desafios.includes(desafio)
      if (has) return { ...prev, desafios: prev.desafios.filter(d => d !== desafio) }
      if (prev.desafios.length >= 3) return prev
      return { ...prev, desafios: [...prev.desafios, desafio] }
    })
  }

  const step1Valid = form.nome && form.email && form.whatsapp && form.estado
  const step2Valid = form.atividade && form.faturamento && form.hectares && form.desafios.length > 0 && form.gestao && form.urgencia && form.expectativa

  const handleNext = () => {
    if (!step1Valid) return
    setStep(2)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'diagnostico_step1_complete')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!step2Valid) return
    setSubmitting(true)
    setError(false)

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          desafios: form.desafios.join(', '),
          origem: utmParams.utm_source ? `ads-${utmParams.utm_source}` : 'diagnostico-gratis',
          score,
          qualificationLevel: qualLevel,
          ...utmParams,
        }),
      })

      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
        gtag('event', 'diagnostico_scored', { score, level: qualLevel })
        gtag('event', 'diagnostico_submit')
      }

      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-4">
        <CheckCircle2 className="mx-auto text-verde-folha" size={64} />
        <h3 className="text-2xl font-heading font-bold text-navy">
          Diagnóstico recebido! 📋
        </h3>
        <p className="text-carvao/60 max-w-md mx-auto">
          Obrigado, {form.nome.split(' ')[0]}! Entraremos em contato em breve para agendar sua sessão.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-medium text-navy">{step} de 2</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-verde-folha rounded-full transition-all duration-500"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>
      </div>

      {step === 1 ? (
        /* ── STEP 1: Identificacao ── */
        <div className="space-y-5">
          <p className="text-sm text-carvao/50">Leva menos de 30 segundos</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
            <Input name="nome" value={form.nome} onChange={handleChange} required placeholder="Seu nome" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
            <Input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="seu@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
            <Input name="whatsapp" value={form.whatsapp} onChange={handleChange} required type="tel" placeholder="(XX) 9XXXX-XXXX" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
            <select name="estado" value={form.estado} onChange={handleChange} required className={selectClass}>
              <option value="">Selecione...</option>
              {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>

          <Button type="button" onClick={handleNext} disabled={!step1Valid} className="w-full" size="lg">
            Próximo <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      ) : (
        /* ── STEP 2: Diagnóstico Estratégico ── */
        <div className="space-y-6">
          <p className="text-sm text-carvao/50">Responda com calma — leva cerca de 3 minutos</p>

          {/* Secao A: Atividade Rural */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-navy uppercase tracking-wide">Atividade Rural</legend>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal atividade *</label>
              <select name="atividade" value={form.atividade} onChange={handleChange} required className={selectClass}>
                <option value="">Selecione...</option>
                {ATIVIDADES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faturamento anual *</label>
              <select name="faturamento" value={form.faturamento} onChange={handleChange} required className={selectClass}>
                <option value="">Selecione...</option>
                {FATURAMENTO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hectares aproximados *</label>
              <select name="hectares" value={form.hectares} onChange={handleChange} required className={selectClass}>
                <option value="">Selecione...</option>
                {HECTARES_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </fieldset>

          {/* Secao B: Gestao */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-navy uppercase tracking-wide">Gestão Financeira</legend>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maior desafio AGORA (máx. 3) *</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {DESAFIOS_OPTIONS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDesafio(d)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      form.desafios.includes(d)
                        ? 'bg-navy text-white border-navy'
                        : 'bg-white text-carvao/70 border-gray-300 hover:border-navy/50'
                    } ${!form.desafios.includes(d) && form.desafios.length >= 3 ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gestão estruturada? *</label>
              <select name="gestao" value={form.gestao} onChange={handleChange} required className={selectClass}>
                <option value="">Selecione...</option>
                {GESTAO_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </fieldset>

          {/* Secao C: Sucessao */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-navy uppercase tracking-wide">Sucessão & Família</legend>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filhos/herdeiros interessados?</label>
              <select name="filhos" value={form.filhos} onChange={handleChange} className={selectClass}>
                <option value="">Selecione...</option>
                {FILHOS_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Situação dos filhos</label>
              <select name="situacaoFilhos" value={form.situacaoFilhos} onChange={handleChange} className={selectClass}>
                <option value="">Selecione...</option>
                {SITUACAO_FILHOS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Existe conflito familiar?</label>
              <select name="conflito" value={form.conflito} onChange={handleChange} className={selectClass}>
                <option value="">Selecione...</option>
                {CONFLITO_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </fieldset>

          {/* Secao D: Saude Financeira */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-navy uppercase tracking-wide">Saúde Financeira</legend>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dívidas (financiamentos/empréstimos)?</label>
              <select name="dividas" value={form.dividas} onChange={handleChange} className={selectClass}>
                <option value="">Selecione...</option>
                {DIVIDAS_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investimento em tecnologia/ano?</label>
              <select name="investimento" value={form.investimento} onChange={handleChange} className={selectClass}>
                <option value="">Selecione...</option>
                {INVESTIMENTO_OPTIONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>
          </fieldset>

          {/* Secao E: Urgencia & Expectativa */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-navy uppercase tracking-wide">Urgência & Expectativa</legend>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgência para resolver? *</label>
              <select name="urgencia" value={form.urgencia} onChange={handleChange} required className={selectClass}>
                <option value="">Selecione...</option>
                {URGENCIA_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Já trabalhou com consultor?</label>
              <select name="consultor" value={form.consultor} onChange={handleChange} className={selectClass}>
                <option value="">Selecione...</option>
                {CONSULTOR_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">O que espera do diagnóstico? *</label>
              <select name="expectativa" value={form.expectativa} onChange={handleChange} required className={selectClass}>
                <option value="">Selecione...</option>
                {EXPECTATIVA_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </fieldset>

          {error && (
            <p className="text-red-500 text-sm">
              Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.
            </p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1" size="lg">
              <ArrowLeft className="mr-2" size={18} /> Voltar
            </Button>
            <Button type="submit" disabled={submitting || !step2Valid} className="flex-1" size="lg">
              {submitting ? 'Enviando...' : 'Enviar Diagnóstico'}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
