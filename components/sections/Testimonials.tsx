'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Carlos M.',
    role: 'Produtor Rural — Maringá, PR',
    text: 'A consultoria do Lucas transformou a gestão financeira da minha propriedade. Hoje tenho clareza total dos meus números e consigo planejar as safras com segurança.',
  },
  {
    name: 'Ana Paula R.',
    role: 'Gestora — Fazenda Santa Rita, MT',
    text: 'O processo de mentoria para sucessão familiar foi essencial para alinhar as expectativas da família e criar um plano concreto de transição. Recomendo demais.',
  },
  {
    name: 'Roberto S.',
    role: 'Diretor de Cooperativa — Cascavel, PR',
    text: 'A palestra sobre inovação no agro trouxe insights práticos que já estamos aplicando na cooperativa. Lucas tem uma didática excelente e domina o conteúdo.',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-navy py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            O que Dizem
          </h2>
          <p className="text-white/60 text-lg">
            Feedback de clientes e parceiros
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <Quote className="text-dourado mb-4" size={28} />
              <p className="text-white/80 leading-relaxed mb-6 text-sm">
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <p className="text-white font-semibold">{t.name}</p>
                <p className="text-white/50 text-sm">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
