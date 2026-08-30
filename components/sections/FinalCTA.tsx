'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, PhoneCall } from 'lucide-react'
import { trackCta } from '@/lib/track'

export default function FinalCTA() {
  return (
    <section className="relative bg-navy-950 py-20 sm:py-28 lg:py-32 overflow-hidden border-t border-white/10">
      {/* Background Agro-Tech Image com Telemetria e Conectividade */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/agrotech-cta.jpg"
          alt="Tecnologia e inovação no campo à noite com telemetria"
          fill
          sizes="100vw"
          className="object-cover opacity-55 lg:opacity-70"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/30 to-navy-950/85" />
      </div>

      {/* Decorative ambient lighting */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-agro-green-neon/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-[400px] h-[250px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-agro-green-neon/10 text-agro-green-neon border border-agro-green-neon/25 mb-6">
            <Sparkles size={14} className="text-agro-green-neon" />
            <span>Próximo Passo Estratégico</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-50 mb-6 leading-tight tracking-tight">
            Pronto para transformar a gestão da sua propriedade?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal mb-10 max-w-2xl mx-auto leading-relaxed">
            Identifique gargalos operacionais e financeiros da sua fazenda com clareza técnica agronômica e plano de ação estruturado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto min-h-[48px] bg-agro-green-action hover:bg-agro-green-action/90 text-white font-semibold shadow-[0_0_25px_rgba(106,175,61,0.35)] hover:shadow-[0_0_35px_rgba(74,222,128,0.5)] border border-agro-green-neon/30 transition-all duration-300"
            >
              <Link
                href="/diagnostico"
                onClick={() => trackCta({ cta: 'diagnostico', local: 'final-cta-home' })}
              >
                Fazer Diagnóstico Gratuito <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto min-h-[48px] border-slate-700 bg-navy-900/80 hover:bg-navy-800 text-slate-200 hover:text-white hover:border-slate-500 backdrop-blur-sm transition-all duration-300"
            >
              <Link
                href="/proposta"
                onClick={() => trackCta({ cta: 'proposta', local: 'final-cta-home' })}
              >
                <PhoneCall className="mr-2" size={18} /> Solicitar Proposta Comercial
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

