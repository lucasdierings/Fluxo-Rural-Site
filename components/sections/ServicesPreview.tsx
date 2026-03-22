'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart2, DollarSign, Users, Mic2, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: BarChart2,
    title: 'Consultoria em Gestão e Inovação',
    description: 'Diagnóstico, planejamento estratégico e acompanhamento para propriedades e empresas do agronegócio.',
    href: '/servicos/consultoria',
  },
  {
    icon: DollarSign,
    title: 'Gestão Financeira Rural',
    description: 'Controle de fluxo de caixa, custos operacionais e análise de rentabilidade de safra para maximizar seus resultados.',
    href: '/servicos/financeiro',
  },
  {
    icon: Users,
    title: 'Mentoria para Sucessão Familiar',
    description: 'Programa estruturado para planejar e executar a transição geracional com segurança e clareza.',
    href: '/servicos/mentoria',
  },
  {
    icon: Mic2,
    title: 'Palestras e Workshops',
    description: 'Conteúdo aplicado sobre gestão, finanças, sucessão familiar e inteligência artificial no agronegócio.',
    href: '/servicos/palestras',
  },
]

export default function ServicesPreview() {
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
            Como Posso Ajudar
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Soluções estratégicas para propriedades e empresas do agronegócio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={service.href}
                className="group block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-dourado/40 rounded-xl p-6 h-full transition-all duration-300"
              >
                <service.icon className="text-dourado mb-4" size={36} />
                <h3 className="font-heading text-lg font-bold text-white mb-3 group-hover:text-dourado transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center text-dourado text-sm font-medium gap-1 group-hover:gap-2 transition-all">
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
