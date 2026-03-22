'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, BookOpen } from 'lucide-react'
import { NewsletterForm } from '@/components/forms/NewsletterForm'

const benefits = [
  'Fluxo de caixa simplificado para o agro',
  'Como calcular custo por hectare',
  'Análise de rentabilidade por safra',
  'Indicadores que bancos e investidores analisam',
]

export default function ContentCTA() {
  return (
    <section className="bg-verde-escuro py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <BookOpen className="mx-auto text-dourado mb-4" size={40} />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Leia Grátis: 5 Indicadores Financeiros que Todo Produtor Rural Precisa Monitorar
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Um guia prático para você ter clareza financeira na sua propriedade — sem precisar ser contador.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
          >
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <Check className="text-dourado mt-0.5 flex-shrink-0" size={20} />
                <span className="text-white/85">{benefit}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Button asChild size="lg" className="mb-8">
              <Link href="/blog/5-indicadores-financeiros-produtor-rural">
                Ler Artigo Completo
              </Link>
            </Button>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-white/80 text-sm mb-4">
                Quer receber mais conteúdo como esse?
              </p>
              <NewsletterForm variant="footer" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
