'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, BarChart2, Sprout, Users, TrendingUp } from 'lucide-react'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf4afizws5cwq0vcPcc7LTaBxUERprs6Ahgy0QzwiYHOOakPWS9VdmBqM7YOHkiK0Iug/exec'

const schema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  lgpd: z.literal(true, {
    errorMap: () => ({ message: 'Você precisa concordar com a Política de Privacidade' }),
  }),
})

type FormData = z.infer<typeof schema>

const benefits = [
  { icon: BarChart2, text: 'Gestão financeira e rentabilidade rural' },
  { icon: Sprout, text: 'Tendências de inovação e tecnologia no campo' },
  { icon: Users, text: 'Insights sobre sucessão familiar e liderança' },
  { icon: TrendingUp, text: 'Estratégias de gestão aplicadas ao agronegócio' },
]

export default function NewsletterPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [submittedName, setSubmittedName] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setSubmittedName(data.nome.split(' ')[0])
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _tipo: 'newsletter',
          nome: data.nome,
          email: data.email,
          fonte: 'pagina-newsletter',
        }),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="pt-32 pb-20 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy mb-4">
            Crescimento Estratégico no Agro — Toda Semana
          </h1>
          <p className="text-carvao/60 text-lg">
            Toda sexta-feira, conteúdo prático sobre gestão e inovação no agronegócio direto no seu e-mail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Benefícios */}
          <div>
            <h2 className="font-heading text-xl font-bold text-navy mb-6">O que você vai receber:</h2>
            <div className="space-y-4">
              {benefits.map((b) => (
                <div key={b.text} className="flex items-start gap-3">
                  <div className="bg-verde-folha/10 p-2 rounded-lg">
                    <b.icon className="text-verde-folha" size={20} />
                  </div>
                  <span className="text-carvao/70 pt-1">{b.text}</span>
                </div>
              ))}
            </div>
            <p className="text-carvao/50 text-sm mt-6">
              Frequência: toda sexta-feira. Sem spam. Cancele quando quiser.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {status === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle2 className="mx-auto text-verde-folha mb-4" size={48} />
                <h3 className="font-heading text-xl font-bold text-navy mb-2">Inscrição confirmada!</h3>
                <p className="text-carvao/60">
                  Obrigado, {submittedName}! Você receberá o próximo conteúdo na sua caixa de entrada.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input id="nome" {...register('nome')} placeholder="Seu nome" className="mt-1.5" />
                  {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" {...register('email')} placeholder="seu@email.com" className="mt-1.5" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="lgpd" {...register('lgpd')} className="mt-1 h-4 w-4" />
                  <Label htmlFor="lgpd" className="text-sm text-carvao/70 font-normal leading-relaxed">
                    Li e concordo com a{' '}
                    <a href="/politica-de-privacidade" className="text-navy underline" target="_blank">
                      Política de Privacidade
                    </a>{' '}
                    *
                  </Label>
                </div>
                {errors.lgpd && <p className="text-red-500 text-sm">{errors.lgpd.message}</p>}
                {status === 'error' && (
                  <p className="text-red-500 text-sm">Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.</p>
                )}
                <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Enviando...' : 'Quero Receber'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
