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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto items-stretch">
          {/* CNA Jovem */}
          <motion.a
            href="https://cnabrasil.org.br/noticias/cna-jovem-anuncia-vencedores-da-quarta-edicao"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden group bg-white shadow-lg block flex flex-col"
          >
            <div className="relative h-48 overflow-hidden flex-shrink-0">
              <Image
                src="/images/cna-jovem-senar.jpeg"
                alt="Lucas Dierings — Destaque Nacional CNA Jovem 2021"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-white flex-1">
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
          <motion.a
            href="https://www.youtube.com/watch?v=Dt3m-VGw8zo&list=PLd-Myf-teNs_TrmvHpNkxS_BjpQl5BdCl"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-xl overflow-hidden group bg-white shadow-lg block flex flex-col"
          >
            <div className="relative h-48 overflow-hidden flex-shrink-0 bg-white flex items-center justify-center p-6">
              <Image
                src="/images/nh-cast-logo-azul-fundo-branco.png"
                alt="NHCast — New Holland Brasil"
                width={200}
                height={200}
                className="object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-white flex-1">
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
            className="rounded-xl overflow-hidden group bg-white shadow-lg block flex flex-col"
          >
            <div className="relative h-48 overflow-hidden flex-shrink-0">
              <Image
                src="/images/lucas-podcast.jpg"
                alt="Lucas Dierings no Agrojovem Podcast"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-white flex-1">
              <div className="mb-2">
                <Image
                  src="/images/logo-agrojovem.png"
                  alt="AgroJovem Podcast"
                  width={100}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h3 className="font-heading text-navy font-bold text-lg">
                Agrojovem Podcast
              </h3>
              <p className="text-carvao/70 text-sm">
                Compartilhando conhecimento com produtores de todo o Brasil
              </p>
            </div>
          </motion.a>

          {/* JCI */}
          <motion.a
            href="https://www.jci.cc/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-xl overflow-hidden group bg-white shadow-lg block flex flex-col"
          >
            <div className="relative h-48 overflow-hidden flex-shrink-0">
              <Image
                src="/images/Lucas discurso JCI.JPG"
                alt="Lucas Dierings — JCI"
                fill
                className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-white flex-1">
              <span className="bg-navy text-white text-xs font-semibold px-3 py-1 rounded-full">
                Liderança
              </span>
              <h3 className="font-heading text-navy font-bold text-lg mt-2">
                JCI — Junior Chamber International
              </h3>
              <p className="text-carvao/70 text-sm">
                Membro da JCI, organização presente em mais de 120 países para desenvolvimento de jovens líderes.
              </p>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
