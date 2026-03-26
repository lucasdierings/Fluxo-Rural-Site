'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// ID do formulário Typeform de newsletter
const NEWSLETTER_TYPEFORM_ID = 'mOomZZiC'

interface NewsletterFormProps {
  variant?: 'default' | 'footer' | 'inline'
}

export function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // Abre o Typeform em nova aba, passando o e-mail como parâmetro oculto
    const url = `https://form.typeform.com/to/${NEWSLETTER_TYPEFORM_ID}?email=${encodeURIComponent(email)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
    setEmail('')
  }

  if (submitted) {
    return (
      <p className={variant === 'footer' ? 'text-verde-folha text-sm' : 'text-verde-folha font-semibold'}>
        ✓ Formulário aberto! Complete sua inscrição na nova aba.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={
          variant === 'footer'
            ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10'
            : variant === 'inline'
            ? 'h-10'
            : ''
        }
        aria-label="E-mail para newsletter"
      />
      <Button
        type="submit"
        size="sm"
        className={variant === 'footer' ? 'h-10' : ''}
      >
        Inscrever
      </Button>
    </form>
  )
}
