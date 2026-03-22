'use client'

import { motion } from 'framer-motion'
import { Trophy, GraduationCap, Radio, MapPin, Smartphone } from 'lucide-react'

const credentials = [
  {
    icon: Trophy,
    title: 'Destaque Nacional CNA Jovem 2021',
    subtitle: 'Entre os 5 melhores de 3.742 jovens do Brasil',
  },
  {
    icon: GraduationCap,
    title: 'MBA USP/ESALQ',
    subtitle: 'A melhor escola de agronegócio do Brasil',
  },
  {
    icon: Radio,
    title: 'Host NHCast — New Holland Brasil',
    subtitle: 'Podcast oficial da maior fabricante de máquinas agro',
  },
  {
    icon: MapPin,
    title: 'Palestras em 5 estados',
    subtitle: 'PR, MS, SC, RS e PI',
  },
  {
    icon: Smartphone,
    title: '7 anos em tecnologia rural',
    subtitle: 'eProdutor — 24 estados brasileiros',
  },
]

export default function Credentials() {
  return (
    <section className="bg-navy py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
            Por que Lucas Dierings
          </h2>
          <p className="text-white/60">
            Credenciais que sustentam a prática
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto"
        >
          {credentials.map((c) => (
            <div
              key={c.title}
              className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:bg-white/10 transition-colors"
            >
              <c.icon className="mx-auto text-dourado mb-3" size={28} />
              <h3 className="font-heading font-bold text-white text-sm mb-1 leading-tight">
                {c.title}
              </h3>
              <p className="text-white/60 text-xs">{c.subtitle}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
