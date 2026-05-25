'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart2, DollarSign, Users, Mic2, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Mic2,
    title: 'Palestras e Podcast ao Vivo',
    description: 'Palestras, podcast gravado ao vivo e apresentação em eventos do agro. Conteúdo que faz a plateia tirar foto do slide e levar pra fazenda.',
    href: '/palestras',
  },
  {
    icon: Users,
    title: 'Mentoria pra Sucessão Familiar',
    description: 'Programa estruturado pra transição geracional acontecer sem brigas, sem perda de patrimônio e com o filho preparado pra assumir.',
    href: '/servicos/mentoria',
  },
  {
    icon: BarChart2,
    title: 'Consultoria em Gestão e Inovação',
    description: 'Diagnóstico, plano estratégico e acompanhamento contínuo pra propriedades e cooperativas que querem profissionalizar a gestão.',
    href: '/servicos/consultoria',
  },
  {
    icon: DollarSign,
    title: 'Gestão Financeira Rural',
    description: 'Fluxo de caixa, custo por hectare e margem por safra organizados — pra você decidir baseado em número, não em achismo.',
    href: '/servicos/financeiro',
  },
]

export default function ServicesPreview() {
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
            Como Posso Ajudar
          </h2>
          <p className="text-white/80 text-base md:text-lg lg:text-xl font-light max-w-2xl mx-auto">
            Palco, mentoria e consultoria pra quem leva o agronegócio a sério
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
            >
              <Link
                href={service.href}
                className="group block glass-card-dark hover:bg-white/20 rounded-3xl p-8 h-full transition-smooth hover:scale-105 shadow-apple-sm hover:shadow-apple-lg"
              >
                <service.icon className="text-dourado mb-6" size={42} />
                <h3 className="font-heading text-lg md:text-xl font-bold text-white mb-4 group-hover:text-dourado transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base font-light leading-relaxed mb-6">
                  {service.description}
                </p>
                <span className="inline-flex items-center text-dourado text-sm font-medium gap-1 group-hover:gap-3 transition-all duration-300">
                  Saiba mais <ArrowRight size={16} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
