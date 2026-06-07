'use client'

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { VariantProps } from 'class-variance-authority'

// Número oficial Fluxo Rural (Lucas). Mantido em um só lugar.
const WHATSAPP_NUMERO = '5545991447004'

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

  // Conversão: dispara no mesmo padrão gtag já usado no DiagnosticoForm.
  // Vira a ação "Lead - Palestra" quando o Google Ads estiver ligado.
  const handleClick = () => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      ;(window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
        'event',
        'palestra_whatsapp_click',
        { origem: origem || 'geral' }
      )
    }
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
