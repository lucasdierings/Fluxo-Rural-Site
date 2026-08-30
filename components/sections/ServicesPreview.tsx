'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart3, GraduationCap, Mic2, Headphones, ArrowRight, CheckCircle2 } from 'lucide-react'
import { trackCta } from '@/lib/track'

const services = [
  {
    icon: BarChart3,
    iconColor: 'text-gold',
    iconBg: 'bg-gold/10 border-gold/20',
    targetAudience: 'Para Produtores Rurais',
    badgeClass: 'bg-agro-green-neon/10 text-agro-green-neon border-agro-green-neon/25',
    title: 'Consultoria em Gestão Rural',
    description:
      'Gestão integrada da propriedade: controle financeiro, custos reais, padronização de processos, rotinas de equipe e modernização tecnológica orientada a lucro.',
    deliverables: [
      'Diagnóstico de gargalos e plano de 90 dias',
      'Controle financeiro, custos e fluxo de caixa',
      'Processos, pessoas e modernização tecnológica',
    ],
    href: '/diagnostico',
    ctaText: 'Começar pelo Diagnóstico',
    ctaTracking: 'diagnostico_services_preview',
  },
  {
    icon: GraduationCap,
    iconColor: 'text-agro-green-neon',
    iconBg: 'bg-agro-green-neon/10 border-agro-green-neon/20',
    targetAudience: 'Para Cooperativas & Empresas',
    badgeClass: 'bg-gold/10 text-gold border-gold/25',
    title: 'Capacitação Profissional',
    description:
      'Cursos e workshops imersivos de 4h ou 8h para capacitar equipes comerciais, técnicas e lideranças do agronegócio.',
    deliverables: [
      'Finanças para quem não é de finanças',
      'Planejamento Estratégico e Gestão',
      'Metodologia prática aplicada ao campo',
    ],
    href: '/servicos/treinamentos',
    ctaText: 'Ver Treinamentos',
    ctaTracking: 'treinamentos_services_preview',
  },
  {
    icon: Mic2,
    iconColor: 'text-gold',
    iconBg: 'bg-gold/10 border-gold/20',
    targetAudience: 'Para Eventos & Empresas',
    badgeClass: 'bg-blue-400/10 text-blue-400 border-blue-400/25',
    title: 'Palestras de Alto Impacto',
    description:
      'Palestras dinâmicas sobre gestão, liderança, sucessão familiar, inovação e Inteligência Artificial no agro, na linguagem direta de quem vive o setor.',
    deliverables: [
      'Liderança e Sucessão no Agro',
      'Inovação & IA no Campo',
      'Gestão Financeira Sem Complicação',
    ],
    href: '/palestras',
    ctaText: 'Contratar Palestra',
    ctaTracking: 'palestras_services_preview',
  },
  {
    icon: Headphones,
    iconColor: 'text-agro-green-neon',
    iconBg: 'bg-agro-green-neon/10 border-agro-green-neon/20',
    targetAudience: 'Projeto de Conteúdo',
    badgeClass: 'bg-purple-400/10 text-purple-400 border-purple-400/25',
    title: 'Agro Jovem Podcast',
    description:
      'Diálogos estratégicos com produtores, executivos e pesquisadores que lideram a transformação do agro brasileiro. Indique convidados ou patrocine.',
    deliverables: [
      'Entrevistas exclusivas com produtores',
      'Debates sobre mercado e novas tecnologias',
      'Disponível no YouTube e Spotify',
    ],
    href: '/agrojovem',
    ctaText: 'Conhecer o Podcast',
    ctaTracking: 'agrojovem_services_preview',
  },
]

export default function ServicesPreview() {
  return (
    <section id="servicos" className="relative bg-navy-950 py-20 sm:py-28 lg:py-36 overflow-hidden">
      {/* Textura de Fundo Agro-Tech Topografia & Telemetria */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/agrotech-contour.jpg"
          alt="Textura topográfica e telemetria agro"
          fill
          sizes="100vw"
          className="object-cover opacity-35 mix-blend-screen"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/80 to-navy-950" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-navy-950/60 to-navy-950" />
      </div>

      {/* Luz ambiente tecnológica de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-navy-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-agro-green-dark/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho da seção */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-agro-green-neon/10 text-agro-green-neon border border-agro-green-neon/25 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-agro-green-neon animate-pulse" />
            <span>Soluções Estratégicas</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-50 leading-[1.15] mb-5 tracking-tight">
            Como Fortalecemos o Seu Agronegócio
          </h2>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            O resultado da sua terra não é refém do clima nem do mercado: começa nas suas decisões.
            Quatro frentes de trabalho estruturadas para transformar números em lucro e equipes em líderes.
          </p>
        </motion.div>

        {/* Grid de 4 frentes de serviço */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: 'easeOut' }}
              className="group relative flex flex-col justify-between rounded-2xl bg-navy-800/80 hover:bg-navy-800 border border-white/10 hover:border-agro-green-neon/40 p-6 sm:p-7 transition-all duration-300 shadow-dark-md hover:shadow-[0_0_30px_rgba(74,222,128,0.12)] hover:-translate-y-1"
            >
              {/* Top Accent Highlight */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-white/10 group-hover:via-agro-green-neon/40 to-transparent transition-all duration-500" />

              <div>
                {/* Header do Card: Ícone e Badge de Público */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${service.iconBg} ${service.iconColor} transition-transform duration-300 group-hover:scale-105`}
                  >
                    <service.icon size={24} aria-hidden="true" />
                  </div>
                  <span
                    className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${service.badgeClass}`}
                  >
                    {service.targetAudience}
                  </span>
                </div>

                {/* Título e Descrição */}
                <h3 className="font-heading text-xl font-bold text-slate-50 mb-3 group-hover:text-gold transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>

                {/* Lista de Entregáveis */}
                <div className="space-y-2 mb-6 pt-2 border-t border-white/5">
                  {service.deliverables.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={14} className="text-agro-green-neon mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de Ação com Touch Target >= 44px */}
              <div className="pt-4 border-t border-white/10 mt-auto">
                <Link
                  href={service.href}
                  onClick={() => trackCta({ cta: service.ctaTracking, local: 'services_preview' })}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-navy-900/90 group-hover:bg-agro-green-action text-slate-200 group-hover:text-white border border-white/10 group-hover:border-agro-green-neon/30 text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm"
                >
                  <span>{service.ctaText}</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

