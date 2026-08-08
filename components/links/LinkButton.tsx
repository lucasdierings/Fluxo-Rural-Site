'use client'

import {
  ChevronRight,
  Sparkles,
  MessageCircle,
  Download,
  Mic,
  Briefcase,
  User,
  BookOpen,
  Mail,
  Radio,
  Headphones,
  Phone,
  Newspaper,
  Contact,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackCta, trackLead } from '@/lib/track'

// Registro de ícones - server components não podem passar funções (componentes)
// como prop para client components, então o nome chega como string e é resolvido aqui.
const icons = {
  sparkles: Sparkles,
  whatsapp: MessageCircle,
  download: Download,
  mic: Mic,
  briefcase: Briefcase,
  user: User,
  book: BookOpen,
  mail: Mail,
  radio: Radio,
  headphones: Headphones,
  phone: Phone,
  newspaper: Newspaper,
  contact: Contact,
} as const

export type LinkIcon = keyof typeof icons

type Tone = 'gold' | 'green' | 'navy' | 'plain'

interface LinkButtonProps {
  href: string
  label: string
  sublabel?: string
  icon: LinkIcon
  tone?: Tone
  /** download de arquivo (PDF/vCard) */
  download?: boolean
  /** dispara conversão de lead (WhatsApp/diagnóstico), não só micro-CTA */
  lead?: boolean
  /** identificador do clique para o analytics */
  cta: string
}

const toneClass: Record<Tone, string> = {
  gold: 'bg-dourado text-carvao border-transparent hover:bg-dourado/90',
  green: 'bg-verde-folha text-white border-transparent hover:bg-verde-folha/90',
  navy: 'bg-white/10 text-white border-white/15 hover:bg-white/15',
  plain: 'bg-white/[0.06] text-white border-white/10 hover:bg-white/10',
}

const iconWrapClass: Record<Tone, string> = {
  gold: 'bg-carvao/10 text-carvao',
  green: 'bg-white/20 text-white',
  navy: 'bg-dourado/20 text-dourado',
  plain: 'bg-dourado/15 text-dourado',
}

export function LinkButton({
  href,
  label,
  sublabel,
  icon,
  tone = 'plain',
  download = false,
  lead = false,
  cta,
}: LinkButtonProps) {
  const Icon = icons[icon]
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')

  const handleClick = () => {
    if (lead) {
      trackLead('bio_lead_click', { form_location: 'bio', cta })
    } else {
      trackCta({ cta, local: 'bio' })
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      {...(download ? { download: true } : {})}
      {...(isExternal || download ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'group flex items-center gap-4 w-full rounded-2xl border px-4 py-3.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] shadow-sm',
        toneClass[tone]
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl shrink-0',
          iconWrapClass[tone]
        )}
      >
        <Icon size={20} />
      </span>
      <span className="flex-1 text-left min-w-0">
        <span className="block font-heading font-semibold text-[15px] leading-tight truncate">
          {label}
        </span>
        {sublabel && (
          <span
            className={cn(
              'block text-xs leading-tight truncate mt-0.5',
              tone === 'gold' ? 'text-carvao/60' : tone === 'green' ? 'text-white/80' : 'text-white/55'
            )}
          >
            {sublabel}
          </span>
        )}
      </span>
      <ChevronRight
        size={18}
        className={cn(
          'shrink-0 transition-transform group-hover:translate-x-0.5',
          tone === 'gold' ? 'text-carvao/40' : 'text-white/40'
        )}
      />
    </a>
  )
}
