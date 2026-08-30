'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Send, AlertCircle } from 'lucide-react'
import { trackLead, readAttribution } from '@/lib/track'
import { UfCitySelector } from '@/components/ui/UfCitySelector'

const ENDPOINT = '/api/contato'

const INTERESSES = [
  'Consultoria em Gestão Rural & Finanças',
  'Sucessão Familiar & Governança',
  'Palestras para Eventos ou Convenções',
  'Capacitação Corporativa',
  'Agro Jovem Podcast / Videocasts',
  'Projetos Especiais & Parcerias',
]

interface FormData {
  nome: string
  telefone: string
  email: string
  cidade: string
  estado: string
  interesse: string
  detalhes: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [form, setForm] = useState<FormData>({
    nome: '',
    telefone: '',
    email: '',
    cidade: '',
    estado: '',
    interesse: '',
    detalhes: '',
  })
  const [formErrors, setFormErrors] = useState<{ estado?: string; cidade?: string }>({})
  const [status, setStatus] = useState<Status>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.estado || !form.cidade) {
      setFormErrors({
        estado: !form.estado ? 'Selecione o estado' : undefined,
        cidade: !form.cidade ? 'Informe o município' : undefined,
      })
      return
    }
    setFormErrors({})
    setStatus('loading')
    const attr = readAttribution()
    try {
      const resp = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          form: 'contato',
          ...attr,
          page_url: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      if (!resp.ok) {
        setStatus('error')
        return
      }
      setStatus('success')
      trackLead('generate_lead', { form_location: 'contato', interesse: form.interesse, origem: attr.origem })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10 space-y-4" aria-live="polite">
        <div className="w-16 h-16 rounded-full bg-[#4ADE80]/15 border border-[#4ADE80]/30 flex items-center justify-center mx-auto text-[#4ADE80]">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-bold text-white font-heading">Mensagem enviada com sucesso!</h3>
        <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto font-light">
          Obrigado pelo contato, <strong className="text-white">{form.nome.split(' ')[0]}</strong>. Retornaremos em até 24 horas úteis.
        </p>
      </div>
    )
  }

  const inputClass =
    'h-12 min-h-[48px] w-full rounded-xl border border-white/15 bg-[#0D1F3C] px-4 text-base text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:border-[#4ADE80]'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nome + Telefone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contato-nome" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Nome completo *
          </label>
          <Input
            id="contato-nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="Seu nome"
            className="h-12 min-h-[48px] bg-[#0D1F3C] border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-[#4ADE80] rounded-xl text-base"
          />
        </div>
        <div>
          <label htmlFor="contato-telefone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Telefone / WhatsApp *
          </label>
          <Input
            id="contato-telefone"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            required
            type="tel"
            autoComplete="tel"
            placeholder="(45) 99999-9999"
            className="h-12 min-h-[48px] bg-[#0D1F3C] border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-[#4ADE80] rounded-xl text-base"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contato-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          E-mail corporativo ou pessoal *
        </label>
        <Input
          id="contato-email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          className="h-12 min-h-[48px] bg-[#0D1F3C] border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-[#4ADE80] rounded-xl text-base"
        />
      </div>

      {/* Estado (UF) + Município via UfCitySelector */}
      <UfCitySelector
        uf={form.estado}
        cidade={form.cidade}
        onUfChange={(newUf) => {
          setForm(prev => ({ ...prev, estado: newUf, cidade: '' }))
          if (formErrors.estado) setFormErrors(prev => ({ ...prev, estado: undefined }))
        }}
        onCidadeChange={(newCidade) => {
          setForm(prev => ({ ...prev, cidade: newCidade }))
          if (formErrors.cidade) setFormErrors(prev => ({ ...prev, cidade: undefined }))
        }}
        disabled={status === 'loading'}
        errorUf={formErrors.estado}
        errorCidade={formErrors.cidade}
      />

      {/* Interesse */}
      <div>
        <label htmlFor="contato-interesse" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          Qual é o seu principal interesse? *
        </label>
        <select
          id="contato-interesse"
          name="interesse"
          value={form.interesse}
          onChange={handleChange}
          required
          className="h-12 min-h-[48px] w-full rounded-xl border border-white/15 bg-[#0D1F3C] px-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#4ADE80]"
        >
          <option value="" className="bg-[#0D1F3C] text-white">Selecione uma opção...</option>
          {INTERESSES.map(i => (
            <option key={i} value={i} className="bg-[#0D1F3C] text-white">{i}</option>
          ))}
        </select>
      </div>

      {/* Detalhes */}
      <div>
        <label htmlFor="contato-detalhes" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          Conte mais sobre sua necessidade <span className="text-slate-400 font-normal lowercase">(opcional)</span>
        </label>
        <textarea
          id="contato-detalhes"
          name="detalhes"
          value={form.detalhes}
          onChange={handleChange}
          rows={4}
          placeholder="Descreva sua propriedade, evento, equipe ou contexto do contato..."
          className={`${inputClass} h-auto py-3 resize-none`}
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <AlertCircle size={18} className="shrink-0" />
          <span>Não foi possível enviar a mensagem no momento. Tente novamente ou nos chame no WhatsApp.</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-[#6AAF3D] hover:bg-[#6AAF3D]/90 text-white min-h-[48px] h-12 rounded-xl font-semibold shadow-lg text-base"
      >
        {status === 'loading' ? (
          'Enviando mensagem...'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Send size={18} />
            Enviar Mensagem
          </span>
        )}
      </Button>
    </form>
  )
}
