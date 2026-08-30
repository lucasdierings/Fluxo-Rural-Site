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
    <footer className="bg-[#0A192F] text-slate-300 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo e tagline */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="Fluxo Rural — Página inicial" className="inline-block">
              <Image
                src="/logo-fluxo-rural-horizontal-novo.png"
                alt="Fluxo Rural Consultoria"
                width={240}
                height={52}
                className="h-10 sm:h-12 w-auto mb-4 object-contain"
                sizes="240px"
                loading="lazy"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Gestão estratégica, inteligência financeira e inovação tecnológica para o agronegócio brasileiro. Consultoria, treinamentos e palestras de alto impacto.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.linkedin.com/in/lucas-dierings/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Lucas Dierings"
                className="bg-white/5 hover:bg-white/15 hover:text-dourado text-slate-300 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/lucasdierings.agro/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Lucas Dierings"
                className="bg-white/5 hover:bg-white/15 hover:text-dourado text-slate-300 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá Lucas! Vim pelo site fluxorural.com.br e gostaria de saber mais sobre seus serviços.')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de Lucas Dierings"
                onClick={() => trackLead('whatsapp_click', { form_location: 'footer', page: pathname || '/', origem: 'site' })}
                className="bg-white/5 hover:bg-verde-folha/20 hover:text-[#4ADE80] text-slate-300 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase text-xs text-[#4ADE80]">
              Serviços
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/servicos/consultoria" className="hover:text-dourado transition-colors">
                  Consultoria em Gestão Rural
                </Link>
              </li>
              <li>
                <Link href="/servicos/treinamentos" className="hover:text-dourado transition-colors">
                  Treinamentos & Workshops
                </Link>
              </li>
              <li>
                <Link href="/palestras" className="hover:text-dourado transition-colors">
                  Palestras & Keynotes
                </Link>
              </li>
              <li>
                <Link href="/agrojovem" className="hover:text-dourado transition-colors">
                  Agro Jovem Podcast
                </Link>
              </li>
            </ul>
          </div>

          {/* Institucional & Ferramentas */}
          <div>
            <h3 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase text-xs text-[#4ADE80]">
              Conteúdo & Hub
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/blog" className="hover:text-dourado transition-colors">
                  Blog do Agro
                </Link>
              </li>
              <li>
                <Link href="/calculadora" className="hover:text-dourado transition-colors">
                  Calculadora de Safra
                </Link>
              </li>
              <li>
                <Link href="/diagnostico" className="hover:text-dourado transition-colors">
                  Diagnóstico de Gestão
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-dourado transition-colors">
                  Sobre Lucas Dierings
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-dourado transition-colors">
                  Contato Direto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé inferior com credencial de autoridade técnica CREA-PR */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-400 text-sm text-center md:text-left space-y-1">
            <p>
              &copy; {new Date().getFullYear()} Fluxo Rural Consultoria · <span className="text-slate-200 font-medium">Lucas Dierings — Engenheiro Agrônomo CREA-PR 179906/D</span>
            </p>
            <p className="text-xs text-slate-400">
              Londrina, PR · Atendimento em todo o território nacional
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/politica-de-privacidade"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
