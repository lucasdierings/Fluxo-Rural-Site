'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Instagram, MessageCircle } from 'lucide-react'
import { NewsletterForm } from '@/components/forms/NewsletterForm'

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991447004'

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo e tagline */}
          <div className="lg:col-span-1">
            <Image
              src="/logo_fluxo_rural_branco.png"
              alt="Fluxo Rural Consultoria"
              width={160}
              height={48}
              className="h-12 w-auto mb-4"
              sizes="160px"
              loading="lazy"
            />
            <p className="text-white/70 text-sm leading-relaxed">
              Gestão, Inovação e Sucessão no Agronegócio. Consultoria, Mentoria e Palestras para quem transforma o campo em resultado.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.linkedin.com/in/lucasdierings"
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
              <li><Link href="/servicos/consultoria" className="hover:text-dourado transition-colors">Consultoria em Gestão</Link></li>
              <li><Link href="/servicos/financeiro" className="hover:text-dourado transition-colors">Gestão Financeira Rural</Link></li>
              <li><Link href="/servicos/mentoria" className="hover:text-dourado transition-colors">Mentoria para Sucessão</Link></li>
              <li><Link href="/servicos/palestras" className="hover:text-dourado transition-colors">Palestras e Workshops</Link></li>
            </ul>
          </div>

          {/* Conteúdo */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Conteúdo</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/blog" className="hover:text-dourado transition-colors">Blog</Link></li>
              <li><Link href="/newsletter" className="hover:text-dourado transition-colors">Newsletter</Link></li>
              <li><Link href="/palestras" className="hover:text-dourado transition-colors">Palestras</Link></li>
              <li><Link href="/sobre" className="hover:text-dourado transition-colors">Sobre Lucas</Link></li>
              <li><Link href="/diagnostico" className="hover:text-dourado transition-colors">Diagnóstico Gratuito</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-white/70 text-sm mb-4">
              Receba conteúdo sobre gestão e inovação no agro toda semana.
            </p>
            <NewsletterForm variant="footer" />
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            &copy; 2026 Fluxo Rural Consultoria | Curitiba, PR — Brasil
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
