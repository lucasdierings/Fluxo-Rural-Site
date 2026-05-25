'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2 } from 'lucide-react'
import { trackEvent, getUtmParams } from '@/lib/analytics'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf4afizws5cwq0vcPcc7LTaBxUERprs6Ahgy0QzwiYHOOakPWS9VdmBqM7YOHkiK0Iug/exec'

const TEMAS = [
  'Gestão financeira como ferramenta pra sucessão familiar',
  'Inovação e empreendedorismo no agronegócio',
  'IA no agronegócio: o que já é realidade',
  'Gestão financeira rural na prática',
  'Podcaster pra empresas e eventos',
  'Apresentador / Cerimonialista de eventos do agro',
  'Outro / quero conversar antes',
]

const PUBLICOS = [
  'Até 100 pessoas',
  '100 a 500 pessoas',
  '500 a 1.000 pessoas',
  'Mais de 1.000 pessoas',
  'Ainda não sei',
]

interface FormData {
  nome: string
  empresa: string
  email: string
  telefone: string
  cidade: string
  data: string
  tema: string
  publico: string
  mensagem: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const selectClass =
  'w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring'

export function PalestraForm() {
  const [form, setForm] = useState<FormData>({
    nome: '', empresa: '', email: '', telefone: '',
    cidade: '', data: '', tema: '', publico: '', mensagem: '',
  })
  const [status, setStatus] = useState<Status>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const utm = getUtmParams()
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _tipo: 'palestra', ...utm }),
      })
      trackEvent('form_submit', {
        form_name: 'palestra',
        tema: form.tema,
        publico: form.publico,
        ...utm,
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10 space-y-4">
        <CheckCircle2 className="mx-auto text-verde-folha" size={64} />
        <h3 className="text-2xl font-heading font-bold text-navy">
          Recebi sua solicitação!
        </h3>
        <p className="text-carvao/70 max-w-md mx-auto">
          Obrigado, {form.nome.split(' ')[0]}. Em até 24h te mando proposta personalizada com formato, duração e investimento.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
          <Input name="nome" value={form.nome} onChange={handleChange} required placeholder="Seu nome" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Empresa / Cooperativa *</label>
          <Input name="empresa" value={form.empresa} onChange={handleChange} required placeholder="Quem está organizando o evento" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
          <Input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="seu@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp *</label>
          <Input name="telefone" value={form.telefone} onChange={handleChange} required type="tel" placeholder="(XX) 9XXXX-XXXX" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cidade do evento *</label>
          <Input name="cidade" value={form.cidade} onChange={handleChange} required placeholder="Cidade / Estado" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data prevista</label>
          <Input name="data" value={form.data} onChange={handleChange} type="date" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tema / formato de interesse *</label>
        <select name="tema" value={form.tema} onChange={handleChange} required className={selectClass}>
          <option value="">Selecione...</option>
          {TEMAS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Público estimado *</label>
        <select name="publico" value={form.publico} onChange={handleChange} required className={selectClass}>
          <option value="">Selecione...</option>
          {PUBLICOS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conta mais sobre o evento</label>
        <textarea
          name="mensagem"
          value={form.mensagem}
          onChange={handleChange}
          rows={4}
          placeholder="Tipo de evento, perfil do público, duração esperada, formato presencial/online..."
          className={`${selectClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm">
          Erro ao enviar. Tenta novamente ou chama no WhatsApp.
        </p>
      )}

      <Button type="submit" disabled={status === 'loading'} className="w-full" size="lg">
        {status === 'loading' ? 'Enviando...' : 'Solicitar Proposta'}
      </Button>
    </form>
  )
}
