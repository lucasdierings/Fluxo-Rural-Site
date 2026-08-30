'use client'

import { motion } from 'framer-motion'
import { Sprout, BarChart3, Mic2, ShieldCheck, GraduationCap, MapPin } from 'lucide-react'

const items = [
  { icon: Sprout, label: 'Eng. Agrônomo (CREA-PR 179906/D)', color: 'text-agro-green-neon' },
  { icon: BarChart3, label: 'Gestão Técnica & Gerencial', color: 'text-gold' },
  { icon: ShieldCheck, label: 'Consultor Senar & Sebrae', color: 'text-agro-green-neon' },
  { icon: GraduationCap, label: 'MBA USP/ESALQ & Professor', color: 'text-gold' },
  { icon: Mic2, label: 'Palestrante & Capacitação', color: 'text-agro-green-neon' },
  { icon: MapPin, label: 'Atuação em 24 Estados', color: 'text-gold' },
]

export default function TrustBar() {
  return (
    <section className="relative z-20 bg-navy-900/95 backdrop-blur-md py-6 md:py-7 border-y border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6"
        >
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 bg-navy-800/80 border border-white/10 hover:border-agro-green-neon/30 hover:bg-navy-800 px-3.5 sm:px-4 py-2 rounded-xl text-slate-200 text-xs sm:text-sm font-medium shadow-dark-sm transition-all duration-300"
            >
              <item.icon size={18} className={`${item.color} flex-shrink-0`} aria-hidden="true" />
              <span className="whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

