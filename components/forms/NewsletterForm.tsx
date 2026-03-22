'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

    // Simular delay para melhor UX
    setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 800)
  }

  if (status === 'success') {
    return (
      <p className={variant === 'footer' ? 'text-verde-folha text-sm' : 'text-verde-folha font-semibold'}>
        ✓ Obrigado! Em breve você receberá nossos conteúdos.
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
