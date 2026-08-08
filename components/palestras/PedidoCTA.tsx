'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { trackLead } from '@/lib/track'
import type { VariantProps } from 'class-variance-authority'
import type { Servico } from '@/lib/proposta'

// Substituiu o WhatsappCTA nos botões de página em ago/2026. Antes, os 8 CTAs
// da /palestras mandavam direto pro wa.me: o lead chegava sem registro no CRM e
// sem qualificação nenhuma. Agora leva ao /proposta, e o WhatsApp aparece na
// tela de sucesso, depois do lead já estar gravado.
//
// Serviço e tema viajam na query string porque o site é static export: a
// /proposta não consegue ler estado no servidor, então lê a URL no cliente.

type Variant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
type Size = NonNullable<VariantProps<typeof buttonVariants>['size']>

interface PedidoCTAProps {
  label?: string
  servico?: Servico
  tema?: string
  variant?: Variant
  size?: Size
  className?: string
  /** Identifica de onde partiu o clique no evento de micro-conversão. */
  origem?: string
}

export function PedidoCTA({
  label = 'Solicitar proposta',
  servico,
  tema,
  variant = 'default',
  size = 'lg',
  className,
  origem,
}: PedidoCTAProps) {
  const q = new URLSearchParams()
  if (servico) q.set('servico', servico)
  if (tema) q.set('tema', tema)
  const href = `/proposta/${q.toString() ? `?${q}` : ''}`

  return (
    <Link
      href={href}
      onClick={() =>
        trackLead('cta_pedido', {
          form_location: 'site',
          origem: origem || 'geral',
          tipo_pedido: servico || null,
        })
      }
      className={cn(buttonVariants({ variant, size }), 'gap-2', className)}
    >
      {label}
      <ArrowRight size={18} />
    </Link>
  )
}
