'use client'

import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { trackLead } from '@/lib/track'
import type { VariantProps } from 'class-variance-authority'

// Caminho do mídia kit em PDF (arquivo autocontido em /public).
const MIDIA_KIT_URL = '/midia-kit-palestras-lucas-dierings.pdf'

type Variant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
type Size = NonNullable<VariantProps<typeof buttonVariants>['size']>

interface MidiaKitDownloadProps {
  label?: string
  variant?: Variant
  size?: Size
  className?: string
  /** Identifica de onde partiu o download no evento de conversão */
  origem?: string
}

export function MidiaKitDownload({
  label = 'Baixar mídia kit (PDF)',
  variant = 'default',
  size = 'lg',
  className,
  origem,
}: MidiaKitDownloadProps) {
  const handleClick = () => {
    trackLead('midia_kit_download', { form_location: 'palestras', origem: origem || 'geral' })
  }

  return (
    <a
      href={MIDIA_KIT_URL}
      download
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(buttonVariants({ variant, size }), 'gap-2', className)}
    >
      <Download size={20} />
      {label}
    </a>
  )
}
