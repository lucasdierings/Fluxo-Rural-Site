'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf4afizws5cwq0vcPcc7LTaBxUERprs6Ahgy0QzwiYHOOakPWS9VdmBqM7YOHkiK0Iug/exec'

interface NewsletterFormProps {
  variant?: 'default' | 'footer' | 'inline'
}

export function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _tipo: 'newsletter',
          email,
          fonte: variant === 'footer' ? 'footer' : variant === 'inline' ? 'artigo' : 'página',
        }),
      })
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className={variant === 'footer' ? 'text-verde-folha text-sm' : 'text-verde-folha font-semibold text-sm'}>
        Inscrito com sucesso! Você receberá nosso conteúdo em breve.
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
        disabled={status === 'loading'}
        className={variant === 'footer' ? 'h-10' : ''}
      >
        {status === 'loading' ? '...' : 'Inscrever'}
      </Button>
    </form>
  )
}
