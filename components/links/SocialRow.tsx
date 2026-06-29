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
    href: 'https://www.linkedin.com/in/lucasdierings',
    label: 'LinkedIn de Lucas Dierings',
    cta: 'social_linkedin',
    Icon: Linkedin,
  },
  {
    href: 'https://www.youtube.com/@agrojovempodcast',
    label: 'YouTube — Agro Jovem Podcast',
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
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/15 text-white hover:bg-dourado/20 hover:text-dourado transition-colors"
        >
          <Icon size={20} />
        </a>
      ))}
    </div>
  )
}
