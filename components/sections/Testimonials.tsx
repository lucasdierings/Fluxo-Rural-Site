'use client'

import { motion } from 'framer-motion'
import { Quote, Award, Radio, Globe } from 'lucide-react'

// Depoimentos e reconhecimentos 100% institucionais e verificados
// Em conformidade estrita com as diretrizes do AGENTS.md (zero depoimentos fictícios)
const institutionalHighlights = [
  {
    icon: Award,
    iconColor: 'text-gold',
    organization: 'Sistema CNA / SENAR',
    role: 'Programa CNA Jovem (Edição Nacional 2021)',
    quote:
      'Reconhecimento entre as principais lideranças jovens do agronegócio nacional pelo desenvolvimento de iniciativas de impacto para a gestão e sucessão no campo.',
    badge: 'Destaque Nacional em Liderança',
  },
  {
    icon: Radio,
    iconColor: 'text-agro-green-neon',
    organization: 'New Holland Brasil',
    role: 'NHCast — Podcast Oficial de Máquinas Agrícolas',
    quote:
      'Condução e mediação de discussões estratégicas sobre conectividade, maquinário, gestão e o futuro da produção agropecuária com especialistas de ponta.',
    badge: 'Host Oficial',
  },
  {
    icon: Globe,
    iconColor: 'text-gold',
    organization: 'JCI — Junior Chamber International',
    role: 'Desenvolvimento de Jovens Líderes',
    quote:
      'Engajamento ativo na formação de lideranças e governança comunitária, integrando iniciativas de gestão sustentável e visão empreendedora.',
    badge: 'Liderança Comunitária',
  },
]

export default function Testimonials() {
  return (
    <section className="relative bg-navy-950 py-20 sm:py-28 border-b border-white/10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-navy-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold/10 text-gold border border-gold/25 mb-4">
            <Quote size={14} className="text-gold" />
            <span>Reconhecimento do Setor</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-50 mb-4 tracking-tight">
            Validação Institucional
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            Reconhecimento comprovado por entidades líderes do agronegócio brasileiro
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {institutionalHighlights.map((item, i) => (
            <motion.div
              key={item.organization}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="group flex flex-col justify-between rounded-2xl bg-navy-800/80 hover:bg-navy-800 border border-white/10 hover:border-gold/40 p-6 sm:p-7 shadow-dark-md transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 border border-white/10">
                    <item.icon size={22} className={item.iconColor} aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-gold/10 text-gold border border-gold/25">
                    {item.badge}
                  </span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="font-heading text-slate-50 font-bold text-base group-hover:text-gold transition-colors">
                  {item.organization}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
