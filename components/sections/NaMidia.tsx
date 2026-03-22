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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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
            <div className="p-4 bg-white">
              <span className="bg-dourado text-carvao text-xs font-semibold px-3 py-1 rounded-full">
                Destaque Nacional
              </span>
              <h3 className="font-heading text-navy font-bold text-lg mt-2">
                CNA Jovem — Sistema CNA/SENAR
              </h3>
              <p className="text-carvao/70 text-sm">
                Um dos 5 vencedores nacionais entre 3.742 jovens do agronegócio em 2021
              </p>
            </div>
          </motion.a>

          {/* NHCast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-xl overflow-hidden group bg-white shadow-lg"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/nh-cast-estudio.jpg"
                alt="Lucas Dierings — Host do NHCast New Holland"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="mb-3">
                <Image
                  src="/images/nh-cast-logo-azul-fundo-branco.png"
                  alt="NH Cast"
                  width={120}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="bg-dourado text-carvao text-xs font-semibold px-3 py-1 rounded-full">
                Host
              </span>
              <h3 className="font-heading text-navy font-bold text-lg mt-2">
                NHCast — New Holland Brasil
              </h3>
              <p className="text-carvao/70 text-sm">
                Podcast oficial da maior fabricante de máquinas agrícolas
              </p>
            </div>
          </motion.div>

          {/* Agrojovem Podcast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-xl overflow-hidden group bg-white shadow-lg"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/lucas-podcast.jpg"
                alt="Lucas Dierings no Agrojovem Podcast"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="mb-3">
                <Image
                  src="/images/logo-agrojovem.png"
                  alt="AgroJovem Podcast"
                  width={120}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="bg-verde-folha text-white text-xs font-semibold px-3 py-1 rounded-full">
                Podcast
              </span>
              <h3 className="font-heading text-navy font-bold text-lg mt-2">
                Agrojovem Podcast
              </h3>
              <p className="text-carvao/70 text-sm mb-3">
                Compartilhando conhecimento com produtores de todo o Brasil
              </p>
              <a
                href="https://www.youtube.com/@agrojovempodcast"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium text-verde-folha hover:text-verde-escuro underline mr-3"
              >
                Ver Canal →
              </a>
              <a
                href="/midia-kit-agrojovem.pdf"
                download
                className="inline-flex items-center gap-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors"
              >
                ↓ Mídia Kit
              </a>
            </div>
          </motion.div>

          {/* JCI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative h-72 rounded-xl overflow-hidden group"
          >
            <Image
              src="/lucas-palestrante.JPG"
              alt="Lucas Dierings — JCI"
              fill
              className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="bg-navy text-white text-xs font-semibold px-3 py-1 rounded-full">
                Liderança
              </span>
              <h3 className="font-heading text-white font-bold text-lg mt-2">
                JCI — Junior Chamber International
              </h3>
              <p className="text-white/70 text-sm">
                Membro da JCI, organização presente em mais de 120 países para desenvolvimento de jovens líderes.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
