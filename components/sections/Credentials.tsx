'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { GraduationCap, ShieldCheck, MapPin, Award, BookOpen } from 'lucide-react'

const credentials = [
  {
    icon: GraduationCap,
    iconColor: 'text-gold',
    iconBg: 'bg-gold/10 border-gold/25',
    title: 'Eng. Agrônomo & MBA USP/ESALQ',
  },
  {
    icon: ShieldCheck,
    iconColor: 'text-agro-green-neon',
    iconBg: 'bg-agro-green-neon/10 border-agro-green-neon/25',
    title: 'Consultor Credenciado Senar, Sebrae e Sescoop',
  },
  {
    icon: BookOpen,
    iconColor: 'text-gold',
    iconBg: 'bg-gold/10 border-gold/25',
    title: 'Professor no Agronegócio',
  },
  {
    icon: Award,
    iconColor: 'text-agro-green-neon',
    iconBg: 'bg-agro-green-neon/10 border-agro-green-neon/25',
    title: 'Liderança (CNA Jovem & JCI)',
  },
  {
    icon: MapPin,
    iconColor: 'text-gold',
    iconBg: 'bg-gold/10 border-gold/25',
    title: 'Consultor em Várias Cadeias de Produção',
  },
]

export default function Credentials() {
  return (
    <section className="relative bg-navy-900 py-20 sm:py-24 border-b border-white/10 overflow-hidden">
      {/* Textura sutil Agro-Tech de topografia */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/agrotech-contour.jpg"
          alt="Textura topográfica"
          fill
          sizes="100vw"
          className="object-cover opacity-15 mix-blend-screen"
          quality={75}
        />
        <div className="absolute inset-0 bg-navy-900/80" />
      </div>

      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[300px] bg-navy-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold/10 text-gold border border-gold/25 mb-4">
            <ShieldCheck size={14} className="text-gold" />
            <span>Autoridade & Experiência</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-50 mb-3 tracking-tight">
            Por que Lucas Dierings
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            Credenciais técnicas, acadêmicas e de liderança que sustentam a prática no campo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
          {credentials.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group rounded-2xl bg-navy-800/80 hover:bg-navy-800 border border-white/10 hover:border-gold/40 p-6 text-center transition-all duration-300 shadow-dark-sm hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${c.iconBg} ${c.iconColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <c.icon size={24} aria-hidden="true" />
                </div>
              </div>

              <h3 className="font-heading font-bold text-slate-50 text-base group-hover:text-gold transition-colors leading-snug">
                {c.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

