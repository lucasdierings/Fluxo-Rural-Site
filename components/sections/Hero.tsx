'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Fundo */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.png"
          alt="Fazenda ao entardecer vista aérea"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/40" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-dourado text-sm font-semibold mb-3 tracking-wide">
              Lucas Dierings
            </span>

            <span className="inline-block bg-verde-folha/90 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              Engenheiro Agrônomo | Consultor | Palestrante
            </span>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Gestão, Inovação e Sucessão no Agronegócio
            </h1>

            <p className="text-white/85 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Consultoria, Mentoria e Palestras para quem transforma o campo em resultado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/servicos">Conheça os Serviços</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contato">Fale Comigo</Link>
              </Button>
            </div>
          </motion.div>

          {/* Foto */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-80 h-80 xl:w-96 xl:h-96">
              <div className="absolute inset-0 rounded-full border-4 border-dourado/60 shadow-2xl overflow-hidden">
                <Image
                  src="/images/lucas-hero.jpg"
                  alt="Lucas Dierings — Engenheiro Agrônomo e Consultor"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Seta de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="text-white/60 animate-bounce-down" size={32} />
      </div>
    </section>
  )
}
