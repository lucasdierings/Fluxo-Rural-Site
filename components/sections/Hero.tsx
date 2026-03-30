'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/60 via-60% to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 md:pt-24 pb-16 md:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.span
              className="inline-block bg-verde-folha/90 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Engenheiro Agrônomo | Consultor | Palestrante
            </motion.span>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              Gestão, Inovação e Sucessão no Agronegócio
            </h1>

            <p className="text-white/90 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Consultoria, Mentoria e Palestras para quem transforma o campo em resultado.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button asChild size="lg">
                <Link href="/servicos">Conheça os Serviços</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/diagnostico">Diagnostico Gratis</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Foto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-72 h-72 xl:w-96 xl:h-96">
              <div className="absolute inset-0 rounded-full border-4 border-dourado/60 shadow-apple-lg overflow-hidden transition-smooth hover:scale-105">
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
      <motion.div
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <ChevronDown className="text-white/60 animate-bounce-down" size={32} />
      </motion.div>
    </section>
  )
}
