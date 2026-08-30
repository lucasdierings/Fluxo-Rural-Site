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
  gold: 'bg-[#E8B84B] text-[#202522] border-[#E8B84B]/40 hover:bg-[#F0CD7A] shadow-[0_0_20px_rgba(232,184,75,0.15)]',
  green: 'bg-[#6AAF3D] text-white border-[#6AAF3D]/40 hover:bg-[#78BF45] shadow-[0_0_20px_rgba(106,175,61,0.2)]',
  navy: 'bg-[#112240]/90 text-white border-white/15 hover:border-[#4ADE80]/50 hover:bg-[#162a4d] shadow-md',
  plain: 'bg-[#112240]/75 text-white border-white/10 hover:border-[#4ADE80]/40 hover:bg-[#162a4d] shadow-sm',
}

const iconWrapClass: Record<Tone, string> = {
  gold: 'bg-[#202522]/15 text-[#202522]',
  green: 'bg-white/20 text-white',
  navy: 'bg-[#4ADE80]/15 text-[#4ADE80]',
  plain: 'bg-[#E8B84B]/15 text-[#E8B84B]',
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
        'group flex items-center gap-4 w-full rounded-2xl border px-4 py-3.5 min-h-[54px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] cursor-pointer',
        toneClass[tone]
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center w-11 h-11 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105',
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
              'block text-xs leading-tight truncate mt-1',
              tone === 'gold' ? 'text-[#202522]/70' : tone === 'green' ? 'text-white/85' : 'text-slate-300'
            )}
          >
            {sublabel}
          </span>
        )}
      </span>
      <ChevronRight
        size={18}
        className={cn(
          'shrink-0 transition-transform duration-300 group-hover:translate-x-1',
          tone === 'gold' ? 'text-[#202522]/50' : 'text-white/40'
        )}
      />
    </a>
  )
}
