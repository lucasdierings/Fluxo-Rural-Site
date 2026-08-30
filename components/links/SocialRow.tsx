'use client'

import { Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react'
import { trackCta } from '@/lib/track'

const socials = [
  {
    href: 'https://www.instagram.com/lucasdierings.agro/',
    label: 'Instagram de Lucas Dierings',
    cta: 'social_instagram',
    Icon: Instagram,
  },
  {
    href: 'https://www.linkedin.com/in/lucas-dierings/',
    label: 'LinkedIn de Lucas Dierings',
    cta: 'social_linkedin',
    Icon: Linkedin,
  },
  {
    href: 'https://www.youtube.com/@agrojovempodcast',
    label: 'YouTube - Agro Jovem Podcast',
    cta: 'social_youtube',
    Icon: Youtube,
  },
  {
    href: 'https://wa.me/5545991447004',
    label: 'WhatsApp de Lucas Dierings',
    cta: 'social_whatsapp',
    Icon: MessageCircle,
  },
]

export function SocialRow() {
  return (
    <div className="flex items-center justify-center gap-3">
      {socials.map(({ href, label, cta, Icon }) => (
        <a
          key={cta}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          onClick={() => trackCta({ cta, local: 'bio' })}
          className="flex items-center justify-center w-12 h-12 min-w-[44px] min-h-[44px] rounded-xl bg-[#112240] border border-white/15 text-white hover:border-[#E8B84B]/60 hover:bg-[#162a4d] hover:text-[#E8B84B] transition-all duration-300 shadow-sm"
        >
          <Icon size={20} />
        </a>
      ))}
    </div>
  )
}
