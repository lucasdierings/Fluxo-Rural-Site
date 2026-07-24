'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trackLead, readAttribution } from '@/lib/track'

// Pages Function própria (functions/api/contato.js): manda e-mail pelo Resend e
// empurra o lead pro CRM. Substituiu o Google Apps Script, cuja planilha não
// existia mais — com `mode: 'no-cors'` o fetch resolvia mesmo em 404 e o lead
// sumia mostrando "Mensagem enviada!" na tela.
const ENDPOINT = '/api/contato'

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
]

const INTERESSES = [
  'Consultoria em Gestão Financeira',
  'Liderança e Empreendedorismo',
  'Palestra / Workshop',
  'Quero convidar para um novo projeto',
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
    nome: '', telefone: '', email: '', cidade: '', estado: '', interesse: '', detalhes: '',
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
      // Sem `no-cors`, erro volta a ser erro: só marca sucesso e só conta
      // conversão no Ads quando o lead realmente entrou.
      if (!resp.ok) {
        setStatus('error')
        return
      }
      setStatus('success')
      // Lead quente — só params não-PII vão pro GA4/GTM (nome/email ficam no fetch)
      trackLead('generate_lead', { form_location: 'contato', interesse: form.interesse, origem: attr.origem })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-verde-folha mb-2">Mensagem enviada!</h3>
        <p className="text-gray-600">
          Obrigado pelo contato, {form.nome.split(' ')[0]}. Retornarei em breve.
        </p>
      </div>
    )
  }

  const selectClass =
    'w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nome + Telefone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome completo *
          </label>
          <Input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone / WhatsApp *
          </label>
          <Input
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            required
            type="tel"
            placeholder="(XX) 9XXXX-XXXX"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
        <Input
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          type="email"
          placeholder="seu@email.com"
        />
      </div>

      {/* Cidade + Estado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
          <Input
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
            required
            placeholder="Sua cidade"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
            className={selectClass}
          >
            <option value="">Selecione...</option>
            {ESTADOS_BR.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interesse */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Qual seu interesse? *
        </label>
        <select
          name="interesse"
          value={form.interesse}
          onChange={handleChange}
          required
          className={selectClass}
        >
          <option value="">Selecione uma opção...</option>
          {INTERESSES.map(i => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      {/* Detalhes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Conta mais sobre o que precisa
        </label>
        <textarea
          name="detalhes"
          value={form.detalhes}
          onChange={handleChange}
          rows={4}
          placeholder="Descreva sua situação, dúvidas ou o que espera deste contato..."
          className={`${selectClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm">
          Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full"
        size="lg"
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
      </Button>
    </form>
  )
}
