'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { readAttribution, trackLead } from '@/lib/track'

const API = '/api/diagnostico'

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR',
  'PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

const ATIVIDADES = [
  ['graos', 'Grãos', 'Soja, milho, trigo e outras culturas anuais'],
  ['pecuaria', 'Pecuária', 'Corte ou leite'],
  ['hortifruti', 'Hortaliças, frutas ou café', 'Produção intensiva ou perene'],
  ['mista', 'Mais de uma atividade', 'Propriedade diversificada'],
  ['outra', 'Outra atividade', 'Agroindústria, integração ou outro modelo'],
] as const

const AREAS = [
  ['<50ha', 'Até 50 hectares'],
  ['50-200ha', 'De 50 a 200 hectares'],
  ['200-500ha', 'De 200 a 500 hectares'],
  ['>500ha', 'Mais de 500 hectares'],
  ['nao-aplica', 'Área não é a melhor medida do negócio'],
] as const

const FATURAMENTOS = [
  ['<100k', 'Até R$ 100 mil por ano'],
  ['100k-500k', 'De R$ 100 mil a R$ 500 mil'],
  ['500k-1M', 'De R$ 500 mil a R$ 1 milhão'],
  ['1M-5M', 'De R$ 1 milhão a R$ 5 milhões'],
  ['>5M', 'Mais de R$ 5 milhões'],
  ['prefiro-nao-informar', 'Prefiro não informar'],
] as const

const DESAFIOS = [
  ['Gestão financeira', 'Não sei se a propriedade dá o resultado que deveria'],
  ['Fluxo de caixa', 'O dinheiro entra e sai sem previsibilidade'],
  ['Dívidas', 'As parcelas estão pressionando o caixa'],
  ['Sucessão familiar', 'Precisamos organizar família, papéis e continuidade'],
  ['Crescimento', 'Quero crescer ou investir com mais segurança'],
  ['Inovação', 'Quero decidir melhor sobre tecnologia e processos'],
  ['Não sei por onde começar', 'Sei que precisa mudar, mas ainda não identifiquei o foco'],
] as const

const GESTAO = [
  ['Sim, estruturada', 'Tenho números, rotina e decisões organizadas'],
  ['Parcialmente (planilhas)', 'Tenho controles, mas eles não orientam tudo'],
  ['Básico', 'Anoto parte das informações, sem rotina clara'],
  ['Nenhuma', 'As decisões ficam na memória e na urgência'],
] as const

const URGENCIA = [
  ['Próximos 30 dias', 'Preciso agir agora'],
  ['Próximos 3 meses', 'Quero organizar ainda neste trimestre'],
  ['Até fim do ano', 'Posso estruturar com mais calma'],
  ['Sem pressa', 'Estou entendendo as possibilidades'],
] as const

const DIVIDAS = [
  ['Nenhuma', 'Não tenho dívida relevante'],
  ['Pequenas (<20%)', 'Comprometem até 20% do faturamento anual'],
  ['Moderadas (20-50%)', 'Comprometem de 20% a 50%'],
  ['Altas (>50%)', 'Comprometem mais de 50%'],
  ['Prefiro não comentar', 'Prefiro conversar sobre isso depois'],
] as const

const CONFLITOS = [
  ['Não, alinhados', 'A família está alinhada'],
  ['Algumas discussões', 'Há diferenças, mas ainda conseguimos conversar'],
  ['Brigas sérias', 'O conflito já dificulta decisões'],
  ['Prefiro não comentar', 'Prefiro conversar sobre isso na sessão'],
] as const

const INVESTIMENTOS = [
  ['Nada', 'Ainda não invisto de forma planejada'],
  ['<10k', 'Até R$ 10 mil por ano'],
  ['10k-50k', 'De R$ 10 mil a R$ 50 mil'],
  ['50k-200k', 'De R$ 50 mil a R$ 200 mil'],
  ['>200k', 'Mais de R$ 200 mil'],
] as const

type Etapa = 'contato' | 'gate' | 'perguntas'
type Enviado = false | 'parcial' | 'completo'
type QuestionField = 'atividade' | 'hectares' | 'faturamento' | 'desafio' | 'gestao' | 'dividas' | 'conflito' | 'investimento' | 'urgencia'

interface DiagnosticoData {
  nome: string
  email: string
  whatsapp: string
  estado: string
  empresa: string
  atividade: string
  hectares: string
  faturamento: string
  desafio: string
  gestao: string
  dividas: string
  conflito: string
  investimento: string
  urgencia: string
}

interface Question {
  campo: QuestionField
  titulo: string
  ajuda?: string
  opcoes: readonly (readonly [string, string, string?])[]
}

function perguntasPara(form: DiagnosticoData): Question[] {
  const perguntas: Question[] = [
    { campo: 'atividade', titulo: 'Qual é a atividade principal da propriedade?', opcoes: ATIVIDADES },
    { campo: 'hectares', titulo: 'Qual é o tamanho aproximado da operação?', ajuda: 'Uma faixa já é suficiente.', opcoes: AREAS },
    { campo: 'faturamento', titulo: 'Qual é o faturamento bruto anual aproximado?', ajuda: 'Usamos apenas para entender o porte. Você pode não informar.', opcoes: FATURAMENTOS },
    { campo: 'desafio', titulo: 'O que mais pesa na gestão hoje?', ajuda: 'Escolha o principal. O restante pode aparecer na conversa.', opcoes: DESAFIOS },
    { campo: 'gestao', titulo: 'Como a gestão funciona hoje?', opcoes: GESTAO },
  ]

  if (form.desafio === 'Sucessão familiar') {
    perguntas.push({ campo: 'conflito', titulo: 'Como está o alinhamento da família?', opcoes: CONFLITOS })
  }
  if (form.desafio === 'Dívidas' || form.desafio === 'Fluxo de caixa') {
    perguntas.push({ campo: 'dividas', titulo: 'Quanto as dívidas pressionam o faturamento?', ajuda: 'Pode ser uma estimativa.', opcoes: DIVIDAS })
  }
  if (form.desafio === 'Inovação') {
    perguntas.push({ campo: 'investimento', titulo: 'Quanto a propriedade investe em tecnologia por ano?', opcoes: INVESTIMENTOS })
  }

  perguntas.push({ campo: 'urgencia', titulo: 'Quando você quer começar a resolver isso?', opcoes: URGENCIA })
  return perguntas
}

function calcularScore(form: DiagnosticoData) {
  const faturamento: Record<string, number> = {
    '<100k': 2, '100k-500k': 8, '500k-1M': 13, '1M-5M': 18, '>5M': 20,
    'prefiro-nao-informar': 5,
  }
  const area: Record<string, number> = {
    '<50ha': 2, '50-200ha': 5, '200-500ha': 8, '>500ha': 10, 'nao-aplica': 5,
  }
  const desafio: Record<string, number> = {
    'Gestão financeira': 18, 'Fluxo de caixa': 18, 'Dívidas': 20,
    'Sucessão familiar': 18, Crescimento: 12, Inovação: 10,
    'Não sei por onde começar': 16,
  }
  const gestao: Record<string, number> = {
    'Sim, estruturada': 2, 'Parcialmente (planilhas)': 7, Básico: 11, Nenhuma: 15,
  }
  const urgencia: Record<string, number> = {
    'Próximos 30 dias': 20, 'Próximos 3 meses': 14, 'Até fim do ano': 7, 'Sem pressa': 0,
  }
  const condicional: Record<string, number> = {
    Nenhuma: 0, 'Pequenas (<20%)': 4, 'Moderadas (20-50%)': 10, 'Altas (>50%)': 15,
    'Não, alinhados': 2, 'Algumas discussões': 8, 'Brigas sérias': 15,
    Nada: 5, '<10k': 4, '10k-50k': 3, '50k-200k': 2, '>200k': 1,
    'Prefiro não comentar': 5,
  }

  const scoreBruto =
    (faturamento[form.faturamento] || 0) +
    (area[form.hectares] || 0) +
    (desafio[form.desafio] || 0) +
    (gestao[form.gestao] || 0) +
    (urgencia[form.urgencia] || 0) +
    (condicional[form.dividas || form.conflito || form.investimento] || 0)
  const scoreMax = form.dividas || form.conflito || form.investimento ? 100 : 85
  const score = Math.round((scoreBruto / scoreMax) * 100)
  const qualificationLevel = score >= 65 ? 'verde' : score >= 45 ? 'amarelo' : score >= 25 ? 'laranja' : 'vermelho'
  return { score, scoreBruto, scoreMax, qualificationLevel }
}

function OptionCard({ active, label, description, onClick }: {
  active: boolean
  label: string
  description?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-[56px] rounded-xl border-2 px-5 py-4 text-left transition-colors ${
        active
          ? 'border-navy bg-navy text-white'
          : 'border-gray-300 bg-white text-carvao/80 hover:border-navy/60 hover:bg-navy/[0.02]'
      }`}
    >
      <span className="block text-[15px] font-semibold leading-snug">{label}</span>
      {description && (
        <span className={`mt-1 block text-xs ${active ? 'text-white/75' : 'text-carvao/55'}`}>
          {description}
        </span>
      )}
    </button>
  )
}

export function DiagnosticoForm() {
  const [etapa, setEtapa] = useState<Etapa>('contato')
  const [indice, setIndice] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [enviado, setEnviado] = useState<Enviado>(false)
  const [erro, setErro] = useState<string | null>(null)
  const [form, setForm] = useState<DiagnosticoData>({
    nome: '', email: '', whatsapp: '', estado: '', empresa: '',
    atividade: '', hectares: '', faturamento: '', desafio: '', gestao: '',
    dividas: '', conflito: '', investimento: '', urgencia: '',
  })

  const perguntas = useMemo(() => perguntasPara(form), [form])
  const pergunta = perguntas[Math.min(indice, perguntas.length - 1)]
  const primeiroNome = form.nome.trim().split(' ')[0]
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  const telefoneValido = form.whatsapp.replace(/\D/g, '').length >= 10
  const contatoValido = form.nome.trim().length >= 2 && emailValido && telefoneValido && !!form.estado

  const atribuicao = () => {
    const attr = readAttribution()
    return { attr, origem: attr.origem === 'site' ? 'diagnostico-gratis' : attr.origem }
  }

  const handleContato = async () => {
    if (!contatoValido || submitting) return
    setSubmitting(true)
    setErro(null)
    const { attr, origem } = atribuicao()
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          etapa: 'contato', perfil: 'produtor', nome: form.nome, email: form.email,
          whatsapp: form.whatsapp, empresa: form.empresa, estado: form.estado,
          ...attr, origem, page_url: window.location.href,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Não foi possível salvar seu contato. Tente novamente.')
      }
      trackLead('diagnostico_contato', { form_location: 'diagnostico', perfil: 'produtor', origem })
      setEtapa('gate')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível salvar seu contato. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const responder = (campo: QuestionField, valor: string) => {
    setForm((atual) => {
      const proximo = { ...atual, [campo]: valor }
      if (campo === 'desafio') {
        proximo.dividas = ''
        proximo.conflito = ''
        proximo.investimento = ''
      }
      return proximo
    })
    setTimeout(() => setIndice((atual) => Math.min(atual + 1, perguntasPara({ ...form, [campo]: valor }).length - 1)), 120)
  }

  const voltarPergunta = () => {
    if (indice === 0) {
      setEtapa('gate')
      return
    }
    setIndice((atual) => atual - 1)
  }

  const handleSubmit = async () => {
    if (submitting || !perguntas.every((item) => !!form[item.campo])) return
    setSubmitting(true)
    setErro(null)
    const { attr, origem } = atribuicao()
    const pontuacao = calcularScore(form)
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          etapa: 'completo', perfil: 'produtor', nome: form.nome, email: form.email,
          whatsapp: form.whatsapp, empresa: form.empresa, estado: form.estado,
          atividade: form.atividade, faturamento: form.faturamento, hectares: form.hectares,
          desafios: form.desafio, gestao: form.gestao, dividas: form.dividas,
          conflito: form.conflito, investimento: form.investimento, urgencia: form.urgencia,
          ...pontuacao, ...attr, origem, page_url: window.location.href,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Não foi possível enviar o diagnóstico. Tente novamente.')
      }
      trackLead('diagnostico_submit', { form_location: 'diagnostico', perfil: 'produtor', origem })
      setEnviado('completo')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível enviar o diagnóstico. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (enviado) {
    return (
      <div className="space-y-4 py-10 text-center" aria-live="polite">
        <CheckCircle2 className="mx-auto text-verde-folha" size={64} />
        <h3 className="font-heading text-2xl font-bold text-navy">
          {enviado === 'completo' ? 'Diagnóstico recebido!' : 'Contato recebido!'}
        </h3>
        <p className="mx-auto max-w-md text-carvao/65">
          {enviado === 'completo'
            ? `Obrigado, ${primeiroNome}. Vou analisar suas respostas antes de retornar.`
            : `Obrigado, ${primeiroNome}. Seu contato ficou salvo e você pode voltar para completar o diagnóstico quando quiser.`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="whitespace-nowrap text-sm font-medium text-navy">
          {etapa === 'contato' ? '1 de 3' : etapa === 'gate' ? '2 de 3' : '3 de 3'}
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-verde-folha transition-all"
            style={{ width: etapa === 'contato' ? '33%' : etapa === 'gate' ? '66%' : '100%' }}
          />
        </div>
      </div>

      {erro && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {erro}
        </p>
      )}

      {etapa === 'contato' && (
        <div className="space-y-5">
          <div>
            <h3 className="font-heading text-2xl font-bold text-navy">Primeiro, como posso falar com você?</h3>
            <p className="mt-1 text-sm text-carvao/60">Salvamos o contato antes das perguntas para você não perder o que começou.</p>
          </div>
          <div>
            <label htmlFor="diag-nome" className="mb-1 block text-sm font-medium text-gray-700">Nome completo *</label>
            <Input id="diag-nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} autoComplete="name" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="diag-whatsapp" className="mb-1 block text-sm font-medium text-gray-700">WhatsApp *</label>
              <Input id="diag-whatsapp" type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} autoComplete="tel" placeholder="(XX) 9XXXX-XXXX" />
            </div>
            <div>
              <label htmlFor="diag-email" className="mb-1 block text-sm font-medium text-gray-700">E-mail *</label>
              <Input id="diag-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" placeholder="seu@email.com" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
            <div>
              <label htmlFor="diag-propriedade" className="mb-1 block text-sm font-medium text-gray-700">Nome da propriedade <span className="text-carvao/40">(opcional)</span></label>
              <Input id="diag-propriedade" value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} placeholder="Fazenda, sítio ou propriedade" />
            </div>
            <div>
              <label htmlFor="diag-uf" className="mb-1 block text-sm font-medium text-gray-700">UF *</label>
              <select id="diag-uf" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">--</option>
                {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>
          <Button type="button" onClick={handleContato} disabled={!contatoValido || submitting} className="w-full" size="lg">
            {submitting ? 'Salvando...' : <>Continuar <ArrowRight className="ml-2" size={18} /></>}
          </Button>
        </div>
      )}

      {etapa === 'gate' && (
        <div className="space-y-6 py-4 text-center">
          <CheckCircle2 className="mx-auto text-verde-folha" size={52} />
          <div>
            <h3 className="font-heading text-2xl font-bold text-navy">Contato salvo, {primeiroNome}.</h3>
            <p className="mx-auto mt-2 max-w-md text-carvao/65">Agora são de 6 a 7 perguntas objetivas. Elas ajudam a chegar na conversa sabendo onde está o principal gargalo.</p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button type="button" onClick={() => { setIndice(0); setEtapa('perguntas') }} size="lg">
              Completar diagnóstico <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button type="button" variant="outline" onClick={() => setEnviado('parcial')} size="lg">Continuar depois</Button>
          </div>
        </div>
      )}

      {etapa === 'perguntas' && pergunta && (
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-verde-escuro">Pergunta {indice + 1} de {perguntas.length}</p>
            <h3 className="font-heading text-2xl font-bold text-navy">{pergunta.titulo}</h3>
            {pergunta.ajuda && <p className="mt-1 text-sm text-carvao/60">{pergunta.ajuda}</p>}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pergunta.opcoes.map(([valor, label, description]) => (
              <OptionCard
                key={valor}
                active={form[pergunta.campo] === valor}
                label={label}
                description={description}
                onClick={() => responder(pergunta.campo, valor)}
              />
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button type="button" variant="outline" onClick={voltarPergunta} size="lg">
              <ArrowLeft className="mr-2" size={18} /> Voltar
            </Button>
            {indice === perguntas.length - 1 && (
              <Button type="button" onClick={handleSubmit} disabled={!form[pergunta.campo] || submitting} size="lg">
                {submitting ? 'Enviando...' : 'Enviar diagnóstico'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
