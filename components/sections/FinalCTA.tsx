'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="bg-verde-folha py-20 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-2">
            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full">
              Decisão que vale a pena
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Está perdendo oportunidades de crescimento na sua propriedade?
          </h2>
          <p className="text-white/85 text-lg mb-2 max-w-2xl mx-auto">
            Produtores rurais que trabalham com Lucas aumentam rentabilidade, organizam a sucessão e implementam inovações com segurança.
          </p>
          <p className="text-white/70 text-sm mb-8 max-w-2xl mx-auto">
            Primeira conversa é gratuita. Resposta em até 24 horas.
          </p>
          <Button asChild size="lg" className="bg-white text-verde-escuro hover:bg-white/90 hover:scale-105">
            <Link href="/contato">
              Agendar Conversa Estratégica <ArrowRight className="ml-2" size={18} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
