'use client'

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { trackLead } from '@/lib/track'
import type { VariantProps } from 'class-variance-authority'

// Número oficial Fluxo Rural (Lucas). Mantido em um só lugar.
const WHATSAPP_NUMERO = '5544991447004'

type Variant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
type Size = NonNullable<VariantProps<typeof buttonVariants>['size']>

interface WhatsappCTAProps {
  /** Texto pré-preenchido que abre no WhatsApp */
  message: string
  /** Rótulo visível do botão */
  label?: string
  variant?: Variant
  size?: Size
  className?: string
  /** Identifica a origem do clique no evento de conversão (ex.: nome do tema) */
  origem?: string
}

export function WhatsappCTA({
  message,
  label = 'Falar no WhatsApp',
  variant = 'default',
  size = 'lg',
  className,
  origem,
}: WhatsappCTAProps) {
  const href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(message)}`

  // Conversão "Lead - Palestra" via helper compartilhado (gtag→GA4 + dataLayer→GTM/Ads).
  const handleClick = () => {
    trackLead('palestra_whatsapp_click', { form_location: 'palestras', origem: origem || 'geral' })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(buttonVariants({ variant, size }), 'gap-2', className)}
    >
      <MessageCircle size={20} />
      {label}
    </a>
  )
}
