'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Tv, ExternalLink } from 'lucide-react'

export default function NaMidia() {
  return (
    <section className="relative bg-navy-900 py-20 sm:py-28 lg:py-32 border-b border-white/10 overflow-hidden">
      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-navy-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold/10 text-gold border border-gold/25 mb-4">
            <Tv size={14} className="text-gold" />
            <span>Presença & Reconhecimento</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-50 mb-4 tracking-tight">
            Na Mídia e Reconhecimento
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            Premiações nacionais, podcasts oficiais e representação no agronegócio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {/* CNA Jovem */}
          <motion.a
            href="https://cnabrasil.org.br/noticias/cna-jovem-anuncia-vencedores-da-quarta-edicao"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-navy-800/80 hover:bg-navy-800 border border-white/10 hover:border-gold/40 shadow-dark-md hover:shadow-[0_0_30px_rgba(232,184,75,0.12)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative h-48 overflow-hidden flex-shrink-0 bg-navy-950">
              <Image
                src="/images/cna-jovem-senar.jpeg"
                alt="Lucas Dierings - Destaque Nacional CNA Jovem 2021"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-60" />
              <span className="absolute top-3 left-3 bg-gold text-carvao text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                Destaque Nacional
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-slate-50 font-bold text-lg group-hover:text-gold transition-colors">
                  CNA Jovem - Sistema CNA/SENAR
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Um dos 5 vencedores nacionais em 2021 pelo desenvolvimento de liderança rural.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-gold group-hover:text-agro-green-neon transition-colors">
                <span>Ver matéria</span>
                <ExternalLink size={13} />
              </div>
            </div>
          </motion.a>

          {/* NHCast */}
          <motion.a
            href="https://www.youtube.com/playlist?list=PLdv5Ps8k7ij8UDT_9aOTuzs_G5uo6lNva"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: 0.1 }}
            className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-navy-800/80 hover:bg-navy-800 border border-white/10 hover:border-gold/40 shadow-dark-md hover:shadow-[0_0_30px_rgba(232,184,75,0.12)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative h-48 overflow-hidden flex-shrink-0 bg-navy-950">
              <Image
                src="/images/lucas-nhcast.jpg"
                alt="Lucas Dierings - Host do NHCast, podcast da New Holland Brasil"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-60" />
              <span className="absolute top-3 left-3 bg-gold text-carvao text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                Host Oficial
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-slate-50 font-bold text-lg group-hover:text-gold transition-colors">
                  NHCast - New Holland Brasil
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Podcast oficial da maior fabricante global de máquinas e tecnologia agrícola.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-gold group-hover:text-agro-green-neon transition-colors">
                <span>Ouvir episódios</span>
                <ExternalLink size={13} />
              </div>
            </div>
          </motion.a>

          {/* Agrojovem Podcast */}
          <motion.a
            href="https://www.youtube.com/@agrojovempodcast"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: 0.2 }}
            className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-navy-800/80 hover:bg-navy-800 border border-white/10 hover:border-gold/40 shadow-dark-md hover:shadow-[0_0_30px_rgba(232,184,75,0.12)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative h-48 overflow-hidden flex-shrink-0 bg-navy-950">
              <Image
                src="/images/lucas-podcast.jpg"
                alt="Lucas Dierings no Agrojovem Podcast"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-60" />
              <span className="absolute top-3 left-3 bg-agro-green-action text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                Podcast Próprio
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-slate-50 font-bold text-lg group-hover:text-gold transition-colors">
                  Agrojovem Podcast
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Entrevistas e inteligência estratégica com produtores e lideranças de todo o país.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-gold group-hover:text-agro-green-neon transition-colors">
                <span>Canal no YouTube</span>
                <ExternalLink size={13} />
              </div>
            </div>
          </motion.a>

          {/* JCI */}
          <motion.a
            href="https://www.jci.cc/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: 0.3 }}
            className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-navy-800/80 hover:bg-navy-800 border border-white/10 hover:border-gold/40 shadow-dark-md hover:shadow-[0_0_30px_rgba(232,184,75,0.12)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative h-48 overflow-hidden flex-shrink-0 bg-navy-950">
              <Image
                src="/images/lucas-discurso-jci.jpg"
                alt="Lucas Dierings - JCI"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-60" />
              <span className="absolute top-3 left-3 bg-navy-700 text-slate-200 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm border border-white/10">
                Liderança Global
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-slate-50 font-bold text-lg group-hover:text-gold transition-colors">
                  JCI - Junior Chamber International
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Organização internacional em mais de 120 países para formação de jovens líderes e impacto comunitário.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-gold group-hover:text-agro-green-neon transition-colors">
                <span>Conhecer JCI</span>
                <ExternalLink size={13} />
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  )
}

