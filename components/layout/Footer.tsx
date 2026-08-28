'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Instagram, MessageCircle } from 'lucide-react'
import { trackLead } from '@/lib/track'

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/beweather') || pathname?.startsWith('/links')) return null
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991447004'

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Logo e tagline */}
          <div className="lg:col-span-1">
            <Image
              src="/logo-fluxo-rural-horizontal-novo.png"
              alt="Fluxo Rural Consultoria"
              width={240}
              height={52}
              className="h-10 sm:h-12 w-auto mb-4"
              sizes="240px"
              loading="lazy"
            />
            <p className="text-white/70 text-sm leading-relaxed">
              Gestão e Inovação no Agronegócio. Consultoria, treinamentos e palestras.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.linkedin.com/in/lucas-dierings/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Lucas Dierings"
                className="bg-white/10 hover:bg-dourado/20 p-2.5 rounded-lg transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/lucasdierings.agro/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Lucas Dierings"
                className="bg-white/10 hover:bg-dourado/20 p-2.5 rounded-lg transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá Lucas! Vim pelo site fluxorural.com.br e gostaria de saber mais sobre seus serviços.')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de Lucas Dierings"
                onClick={() => trackLead('whatsapp_click', { form_location: 'footer', page: pathname || '/', origem: 'site' })}
                className="bg-white/10 hover:bg-verde-folha/20 p-2.5 rounded-lg transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Serviços</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/servicos/consultoria" className="hover:text-dourado transition-colors">Consultoria em Gestão Rural</Link></li>
              <li><Link href="/servicos/treinamentos" className="hover:text-dourado transition-colors">Treinamentos</Link></li>
              <li><Link href="/palestras" className="hover:text-dourado transition-colors">Palestras</Link></li>
              <li><Link href="/agrojovem" className="hover:text-dourado transition-colors">Agro Jovem Podcast</Link></li>
            </ul>
          </div>

          {/* Conteúdo */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Conteúdo</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/blog" className="hover:text-dourado transition-colors">Blog</Link></li>
              <li>
                <Link href="/servicos/treinamentos" className="hover:text-dourado transition-colors">
                  Portfólio
                </Link>
              </li>
              <li><Link href="/sobre" className="hover:text-dourado transition-colors">Sobre Lucas</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            &copy; 2026 Fluxo Rural Consultoria | Curitiba, PR - Brasil
          </p>
          <Link
            href="/politica-de-privacidade"
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  )
}
