'use client'

import { motion } from 'framer-motion'
import { Award, ShieldCheck, MapPin, TrendingUp } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    iconColor: 'text-agro-green-neon',
    value: '+7 Anos',
    label: 'Experiência em Gestão e Tecnologia Rural',
    detail: 'Projetos financeiros e operacionais de safra',
  },
  {
    icon: MapPin,
    iconColor: 'text-gold',
    value: '24 Estados',
    label: 'Alcance Nacional no Agronegócio',
    detail: 'Produtores, cooperativas e revendas atendidos',
  },
  {
    icon: Award,
    iconColor: 'text-agro-green-neon',
    value: 'Top 5',
    label: 'Nacional no Programa CNA Jovem',
    detail: 'Reconhecimento em liderança no agro brasileiro',
  },
  {
    icon: ShieldCheck,
    iconColor: 'text-gold',
    value: 'CREA-PR',
    label: '179906/D · Eng. Agronômica UFPR',
    detail: 'MBA em Agronegócios pela USP/ESALQ',
  },
]

export default function StatsCounter() {
  return (
    <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 py-16 sm:py-20 border-y border-white/10 overflow-hidden">
      {/* Background Tech Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-navy-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="relative group rounded-2xl bg-navy-800/80 hover:bg-navy-800 border border-white/10 hover:border-agro-green-neon/40 p-6 sm:p-7 text-center transition-all duration-300 shadow-dark-md hover:-translate-y-1"
            >
              {/* Subtle top indicator */}
              <div className="flex justify-center mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900/90 border border-white/10 group-hover:border-agro-green-neon/30 transition-colors">
                  <item.icon size={22} className={item.iconColor} aria-hidden="true" />
                </div>
              </div>

              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight mb-2 group-hover:text-gold transition-colors">
                {item.value}
              </div>

              <div className="text-slate-200 text-sm font-semibold mb-1 leading-snug">
                {item.label}
              </div>

              <div className="text-slate-400 text-xs font-normal leading-relaxed">
                {item.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
