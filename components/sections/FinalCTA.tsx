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
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para transformar a gestão da sua propriedade?
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
            Vamos conversar sobre como levar mais organização, clareza financeira e inovação para o seu negócio no campo.
          </p>
          <Button asChild size="lg" className="bg-white text-verde-escuro hover:bg-white/90 hover:scale-105">
            <Link href="/contato">
              Fale com Lucas <ArrowRight className="ml-2" size={18} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
