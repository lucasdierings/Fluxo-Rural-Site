'use client'

import { motion } from 'framer-motion'
import { Sprout, BarChart2, Mic2, DollarSign, Wheat, MapPin } from 'lucide-react'

const items = [
  { icon: Sprout, label: 'Eng. Agrônomo' },
  { icon: BarChart2, label: 'Consultor' },
  { icon: Mic2, label: 'Palestrante' },
  { icon: DollarSign, label: 'Gestão Financeira' },
  { icon: Wheat, label: 'Agronegócio' },
  { icon: MapPin, label: 'Londrina, PR' },
]

export default function TrustBar() {
  return (
    <section className="bg-white py-8 border-b">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-navy/80">
              <item.icon size={20} className="text-verde-folha" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
