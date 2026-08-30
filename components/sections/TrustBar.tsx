'use client'

import { motion } from 'framer-motion'
import { Sprout, BarChart3, Mic2, ShieldCheck, GraduationCap, MapPin } from 'lucide-react'

const items = [
  { icon: Sprout, label: 'Engenheiro Agrônomo', color: 'text-agro-green-neon' },
  { icon: GraduationCap, label: 'MBA USP/ESALQ & Professor', color: 'text-gold' },
  { icon: ShieldCheck, label: 'Senar, Sebrae & Sescoop', color: 'text-agro-green-neon' },
  { icon: BarChart3, label: 'Gestão Técnica & Gerencial', color: 'text-gold' },
  { icon: Mic2, label: 'Palestras & Capacitação', color: 'text-agro-green-neon' },
  { icon: MapPin, label: 'Atuação Nacional', color: 'text-gold' },
]

export default function TrustBar() {
  return (
    <section className="relative z-20 bg-navy-900/95 backdrop-blur-md py-4 sm:py-5 md:py-6 border-y border-white/10">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3"
        >
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-center sm:justify-start gap-2 bg-navy-800/80 border border-white/10 hover:border-agro-green-neon/30 hover:bg-navy-800 px-2.5 sm:px-3.5 py-2 rounded-xl text-slate-200 text-[11px] sm:text-xs md:text-sm font-medium shadow-dark-sm transition-all duration-300"
            >
              <item.icon size={15} className={`${item.color} flex-shrink-0`} aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

