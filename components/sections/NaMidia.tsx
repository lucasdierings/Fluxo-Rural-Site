'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function NaMidia() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            Na Mídia e Reconhecimento
          </h2>
          <p className="text-carvao/60 text-lg">
            Premiações, podcasts e participações no setor
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* CNA Jovem */}
          <motion.a
            href="https://cnabrasil.org.br/noticias/cna-jovem-anuncia-vencedores-da-quarta-edicao"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden group bg-white shadow-lg block"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/cna-jovem-senar.jpeg"
                alt="Lucas Dierings — Destaque Nacional CNA Jovem 2021"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <span className="bg-dourado text-carvao text-xs font-semibold px-3 py-1 rounded-full">
                Destaque Nacional
              </span>
              <h3 className="font-heading text-navy font-bold text-base mt-2 leading-snug">
                CNA Jovem — Sistema CNA/SENAR
              </h3>
              <p className="text-carvao/70 text-sm mt-1">
                Um dos 5 vencedores nacionais entre 3.742 jovens do agronegócio em 2021
              </p>
            </div>
          </motion.a>

          {/* NHCast */}
          <motion.a
            href="https://www.youtube.com/watch?v=Dt3m-VGw8zo&list=PLd-Myf-teNs_TrmvHpNkxS_BjpQl5BdCl"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-xl overflow-hidden group bg-white shadow-lg block"
          >
            <div className="relative h-48 overflow-hidden bg-white flex items-center justify-center">
              <Image
                src="/images/nh-cast-logo-azul-fundo-branco.png"
                alt="NHCast — New Holland Brasil"
                width={200}
                height={200}
                className="object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <span className="bg-dourado text-carvao text-xs font-semibold px-3 py-1 rounded-full">
                Host
              </span>
              <h3 className="font-heading text-navy font-bold text-base mt-2 leading-snug">
                NHCast — New Holland Brasil
              </h3>
              <p className="text-carvao/70 text-sm mt-1">
                Podcast oficial da maior fabricante de máquinas agrícolas
              </p>
            </div>
          </motion.a>

          {/* Agrojovem Podcast */}
          <motion.a
            href="https://www.youtube.com/@agrojovempodcast"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-xl overflow-hidden group bg-white shadow-lg block"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/lucas-podcast.jpg"
                alt="Lucas Dierings no Agrojovem Podcast"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <div className="mb-2">
                <Image
                  src="/images/logo-agrojovem.png"
                  alt="AgroJovem Podcast"
                  width={100}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="bg-verde-folha text-white text-xs font-semibold px-3 py-1 rounded-full">
                Podcast
              </span>
              <h3 className="font-heading text-navy font-bold text-base mt-2 leading-snug">
                Agrojovem Podcast
              </h3>
              <p className="text-carvao/70 text-sm mt-1">
                Compartilhando conhecimento com produtores de todo o Brasil
              </p>
            </div>
          </motion.a>

          {/* JCI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative rounded-xl overflow-hidden group"
          >
            <div className="relative h-full min-h-[320px]">
              <Image
                src="/images/lucas-discurso-jci.jpg"
                alt="Lucas Dierings — JCI Junior Chamber International"
                fill
                className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-navy text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Liderança
                </span>
                <h3 className="font-heading text-white font-bold text-base mt-2 leading-snug">
                  JCI — Junior Chamber International
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mt-1">
                  Membro da JCI, organização presente em mais de 120 países para desenvolvimento de jovens líderes.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
