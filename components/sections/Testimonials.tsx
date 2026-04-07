'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Carlos M.',
    role: 'Produtor Rural — Maringá, PR',
    service: 'Gestão Financeira',
    text: 'A consultoria do Lucas transformou a gestão financeira da minha propriedade. Hoje tenho clareza total dos meus números e consigo planejar as safras com segurança.',
  },
  {
    name: 'Ana Paula R.',
    role: 'Gestora — Fazenda Santa Rita, MT',
    service: 'Mentoria Sucessão',
    text: 'O processo de mentoria para sucessão familiar foi essencial para alinhar as expectativas da família e criar um plano concreto de transição. Recomendo demais.',
  },
  {
    name: 'Roberto S.',
    role: 'Diretor de Cooperativa — Cascavel, PR',
    service: 'Palestra',
    text: 'A palestra sobre inovação no agro trouxe insights práticos que já estamos aplicando na cooperativa. Lucas tem uma didática excelente e domina o conteúdo.',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-navy py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6">
            O que Dizem
          </h2>
          <p className="text-white/70 text-base md:text-lg font-light">
            Feedback de clientes e parceiros
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              className="glass-card-dark rounded-3xl p-8 hover:bg-white/15 transition-smooth hover:scale-105 shadow-apple-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <Quote className="text-dourado" size={36} />
                <span className="text-xs font-medium text-dourado/80 bg-dourado/10 px-3 py-1 rounded-full">
                  {t.service}
                </span>
              </div>
              <p className="text-white/85 leading-relaxed mb-8 text-base md:text-lg font-light">
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <p className="text-white font-semibold text-base">{t.name}</p>
                <p className="text-white/60 text-sm font-light mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
