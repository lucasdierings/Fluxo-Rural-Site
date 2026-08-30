'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { trackCta } from '@/lib/track'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-navy-950">
      {/* Fundo com prioridade exclusiva de LCP e overlay Agro-Tech */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-graos.jpg"
          alt="Fazenda ao entardecer vista aérea da produção agrícola"
          fill
          sizes="100vw"
          className="object-cover"
          priority
          quality={85}
        />
        {/* Camada base leve para garantir leitura */}
        <div className="absolute inset-0 bg-navy-950/30" />
        {/* Gradiente protegendo o texto na esquerda */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/60 via-60% to-transparent" />
        {/* Gradiente inferior para integrar com a próxima seção */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 md:pt-28 pb-16 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Conteúdo com visibilidade imediata no SSR e animação CSS pura (Zero LCP Render Delay) */}
          <div className="lg:col-span-7 text-center lg:text-left animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both">
            {/* Glowing Tech Badge */}
            <div className="inline-flex items-center gap-2 border border-agro-green-neon/30 bg-agro-green-neon/10 text-agro-green-neon text-xs sm:text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(74,222,128,0.15)]">
              <span className="inline-block w-2 h-2 rounded-full bg-agro-green-neon animate-pulse" />
              <span>Engenheiro Agrônomo | Consultor | Palestrante</span>
            </div>

            <p className="text-gold font-heading text-lg sm:text-xl md:text-2xl font-bold tracking-wide mb-2 flex items-center justify-center lg:justify-start gap-2">
              Lucas Dierings
            </p>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-50 tracking-tight leading-[1.1] mb-6">
              Gestão e Inovação no{' '}
              <span className="bg-gradient-to-r from-agro-green-neon via-agro-green-action to-gold bg-clip-text text-transparent">
                Agronegócio
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Consultoria estratégica, treinamentos e palestras com foco em resultado prático no campo.
            </p>

            {/* CTAs com touch target ergonômico >= 44px */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto min-h-[48px] bg-agro-green-action hover:bg-agro-green-action/90 text-white font-semibold shadow-[0_0_20px_rgba(106,175,61,0.35)] hover:shadow-[0_0_30px_rgba(74,222,128,0.5)] transition-all duration-300 border border-agro-green-neon/30"
              >
                <Link href="/servicos" onClick={() => trackCta({ cta: 'servicos', local: 'hero' })}>
                  Conheça os Serviços
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-h-[48px] border-slate-700 bg-navy-900/80 hover:bg-navy-800 text-slate-200 hover:text-white hover:border-slate-500 backdrop-blur-sm transition-all duration-300"
              >
                <Link href="/diagnostico" onClick={() => trackCta({ cta: 'diagnostico', local: 'hero' })}>
                  Diagnóstico Gratuito
                </Link>
              </Button>
            </div>
          </div>

          {/* Foto com halo Agro-Tech (Sem priority para evitar disputa com o background de LCP) */}
          <div className="lg:col-span-5 hidden lg:flex justify-center animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
            <div className="relative w-72 h-72 xl:w-96 xl:h-96">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-agro-green-neon/30 via-gold/25 to-navy-600/30 blur-md opacity-70 animate-pulse-glow" />
              <div className="relative w-full h-full rounded-full border-4 border-gold/60 shadow-dark-lg overflow-hidden bg-navy-900 transition-all duration-500 hover:scale-105 hover:border-gold">
                <Image
                  src="/images/lucas-hero.jpg"
                  alt="Lucas Dierings, engenheiro agrônomo CREA-PR 179906/D e consultor"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seta de scroll com acessibilidade e animação CSS pura */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 animate-in fade-in duration-1000 delay-500 fill-mode-both">
        <a
          href="#servicos"
          aria-label="Rolar para ver mais conteúdos"
          className="inline-flex flex-col items-center text-slate-400 hover:text-agro-green-neon transition-colors p-2 min-h-[44px] min-w-[44px] justify-center"
        >
          <ChevronDown className="animate-bounce-down text-slate-400/80 hover:text-agro-green-neon" size={28} />
        </a>
      </div>
    </section>
  )
}

