'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="bg-verde-folha py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-8">
            Pronto para transformar a gestão da sua propriedade?
          </h2>
          <p className="text-white/90 text-base md:text-lg lg:text-xl font-light mb-10 max-w-3xl mx-auto leading-relaxed">
            Vamos conversar sobre como levar mais organização, clareza financeira e inovação para o seu negócio no campo.
          </p>
          <Button asChild size="lg" className="bg-white text-verde-escuro hover:bg-white/90 hover:shadow-apple-lg">
            <Link href="/diagnostico">
              Agendar Diagnóstico Grátis <ArrowRight className="ml-2" size={18} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
