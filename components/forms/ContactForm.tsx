'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '@/lib/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setStatus('success')
        reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-verde-folha/10 border border-verde-folha/30 rounded-xl p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 text-verde-folha" size={48} />
        <h3 className="font-heading text-xl font-bold text-verde-escuro mb-2">
          Mensagem enviada!
        </h3>
        <p className="text-carvao/70">
          Lucas retornará em até 24 horas úteis.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="nome">Nome *</Label>
        <Input id="nome" {...register('nome')} placeholder="Seu nome completo" className="mt-1.5" />
        {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="email">E-mail *</Label>
          <Input id="email" type="email" {...register('email')} placeholder="seu@email.com" className="mt-1.5" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="telefone">WhatsApp / Telefone *</Label>
          <Input id="telefone" {...register('telefone')} placeholder="(43) 99999-9999" className="mt-1.5" />
          {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="empresa">Propriedade / Empresa (ha ou membros da família)</Label>
        <Input id="empresa" {...register('empresa')} placeholder="ex: Propriedade com 500ha de soja" className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="tipo">Principal Interesse *</Label>
        <select
          id="tipo"
          {...register('tipo')}
          className="mt-1.5 flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
        >
          <option value="">Selecione uma opção...</option>
          <option value="Consultoria Estratégica">Consultoria Estratégica em Gestão</option>
          <option value="Gestão Financeira">Gestão Financeira e Análise de Rentabilidade</option>
          <option value="Sucessão Familiar">Mentoria para Sucessão Familiar</option>
          <option value="Palestra">Palestra ou Workshop para equipe</option>
          <option value="IA no Agro">Inteligência Artificial no Agronegócio</option>
          <option value="Outro">Outro</option>
        </select>
        {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>}
      </div>

      <div>
        <Label htmlFor="mensagem">Mensagem *</Label>
        <Textarea id="mensagem" {...register('mensagem')} placeholder="Como posso ajudar?" className="mt-1.5" />
        {errors.mensagem && <p className="text-red-500 text-sm mt-1">{errors.mensagem.message}</p>}
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="lgpd"
          {...register('lgpd')}
          className="mt-1 h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="lgpd" className="text-sm text-carvao/70 font-normal leading-relaxed">
          Li e concordo com a{' '}
          <a href="/politica-de-privacidade" className="text-navy underline hover:text-dourado" target="_blank">
            Política de Privacidade
          </a>{' '}
          *
        </Label>
      </div>
      {errors.lgpd && <p className="text-red-500 text-sm">{errors.lgpd.message}</p>}

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          <span>Algo deu errado. Tente pelo WhatsApp.</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? (
          'Enviando...'
        ) : (
          <>
            <Send className="mr-2" size={18} />
            Enviar e Receber Resposta Rápida
          </>
        )}
      </Button>

      <p className="text-center text-sm text-carvao/60 mt-3">
        ⚡ Resposta em até 24 horas úteis | Sem spam, sem comprometimento
      </p>
    </form>
  )
}
