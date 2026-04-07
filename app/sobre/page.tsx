import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Target, TrendingUp, Heart, ArrowRight, Trophy, GraduationCap, Radio, MapPin, Smartphone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Lucas Dierings',
  description: 'Conheça Lucas Dierings — destaque nacional CNA/SENAR, professor de MBA, host do NHCast New Holland e fundador da Fluxo Rural Consultoria.',
  openGraph: {
    title: 'Sobre Lucas Dierings | Fluxo Rural',
    description: 'Destaque nacional CNA/SENAR, professor de MBA, host do NHCast New Holland e fundador da Fluxo Rural Consultoria.',
    images: [{ url: '/images/lucas-agronomo.jpg' }],
  },
}

const timeline = [
  {
    year: '2019',
    title: 'Graduação em Agronomia',
    text: 'UFPR — Universidade Federal do Paraná, Campus Palotina',
  },
  {
    year: '2018–2025',
    title: 'Analista de Negócios → Diretor de Marketing e Vendas',
    text: 'Software de Gestão Rural — ERP para Propriedades Rurais. Atuação em 24 estados brasileiros.',
  },
  {
    year: '2021',
    title: 'Destaque Nacional — CNA Jovem / Sistema CNA-SENAR',
    text: 'Um dos 5 vencedores nacionais entre 3.742 jovens inscritos. Projeto: Gestão Familiar Rural através de informação e tecnologia. Representou o Paraná na missão técnica pelas principais regiões do agronegócio brasileiro.',
    highlight: true,
  },
  {
    year: '2023',
    title: 'MBA em Agronegócios',
    text: 'USP/ESALQ — Escola Superior de Agricultura Luiz de Queiroz',
  },
  {
    year: '2023–2024',
    title: 'Professor — Graduação em Agronomia',
    text: 'ISEPE Rondon — Marechal Cândido Rondon/PR',
  },
  {
    year: '2025',
    title: 'Professor — MBA Executivo em Agronegócio',
    text: 'PUCPR — Pontifícia Universidade Católica do Paraná',
  },
  {
    year: '2025–atual',
    title: 'Consultor Técnico e Gerencial',
    text: 'SENAR/PR — Norte do Paraná',
  },
  {
    year: 'Atual',
    title: 'Fundador e Consultor Principal',
    text: 'Fluxo Rural Consultoria — Londrina e Curitiba, PR',
  },
]

const credentials = [
  {
    icon: Trophy,
    title: 'Destaque Nacional CNA Jovem 2021',
    subtitle: 'Entre os 5 melhores de 3.742 jovens do Brasil',
  },
  {
    icon: GraduationCap,
    title: 'MBA USP/ESALQ',
    subtitle: 'A melhor escola de agronegócio do Brasil',
  },
  {
    icon: Radio,
    title: 'Host NHCast — New Holland Brasil',
    subtitle: 'Podcast oficial da maior fabricante de máquinas agro',
  },
  {
    icon: MapPin,
    title: 'Palestras em 5 estados',
    subtitle: 'PR, MS, SC, RS e PI',
  },
  {
    icon: Smartphone,
    title: '7 anos em tecnologia rural',
    subtitle: 'Gestão financeira e agronômica — 24 estados',
  },
]

const values = [
  {
    icon: Target,
    title: 'Clareza',
    description: 'Diagnósticos honestos e planos de ação objetivos.',
  },
  {
    icon: TrendingUp,
    title: 'Resultado',
    description: 'Estratégias que se traduzem em números reais.',
  },
  {
    icon: Heart,
    title: 'Propósito',
    description: 'O campo como legado para as próximas gerações.',
  },
]

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image
          src="/images/lucas-agronomo.jpg"
          alt="Lucas Dierings na lavoura — vista aérea"
          fill
          className="object-cover object-[center_60%]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Sobre Lucas Dierings
          </h1>
          <p className="text-white/80 text-xl">
            Do campo para a estratégia — e de volta ao campo.
          </p>
        </div>
      </section>

      {/* Bio */}
      <section className="py-24 md:py-32 lg:py-40 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-apple-lg transition-smooth hover:shadow-apple-lg hover:scale-[1.02]">
              <Image
                src="/images/lucas-hero.jpg"
                alt="Lucas Dierings — Engenheiro Agrônomo"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-5 md:space-y-6 text-carvao/80 leading-relaxed text-base md:text-lg font-light">
              <p>
                Lucas Dierings é engenheiro agrônomo graduado pela UFPR, com MBA em Agronegócios pela USP/ESALQ — a mais reconhecida escola de agronegócio do Brasil.
              </p>
              <p>
                Vencedor nacional do Programa CNA Jovem 2021, promovido pelo Sistema CNA/SENAR, foi selecionado entre 3.742 jovens de todo o Brasil pelo seu projeto de Gestão Familiar Rural com foco em informação e tecnologia.
              </p>
              <p>
                Com 7 anos de experiência em software de gestão rural com atuação em 24 estados —, de analista à direção comercial, Lucas acumulou experiência única na intersecção entre tecnologia e gestão no campo.
              </p>
              <p>
                Professor de MBA em Agronegócios na PUCPR e consultor do SENAR/PR, fundou a Fluxo Rural Consultoria com um propósito claro: levar gestão estratégica, clareza financeira e planejamento sucessório para propriedades e empresas rurais de todo o Brasil.
              </p>
              <p>
                Palestrante nos estados do PR, MS, SC, RS e PI, é também host do Agrojovem Podcast e do NHCast — podcast oficial da New Holland Brasil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credenciais */}
      <section className="py-24 md:py-32 lg:py-40 bg-navy">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white text-center mb-12 md:mb-16 lg:mb-20">
            Credenciais
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
            {credentials.map((c) => (
              <div
                key={c.title}
                className="glass-card-dark rounded-2xl p-6 text-center hover:bg-white/20 transition-smooth hover:scale-105 shadow-apple-sm"
              >
                <c.icon className="mx-auto text-dourado mb-4" size={36} />
                <h3 className="font-heading font-bold text-white text-sm md:text-base mb-2 leading-tight">
                  {c.title}
                </h3>
                <p className="text-white/60 text-xs md:text-sm">{c.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trajetória */}
      <section className="py-24 md:py-32 lg:py-40 bg-off-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-navy text-center mb-12 md:mb-16 lg:mb-20">
            Trajetória
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-navy/20" />
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-12 pb-10 last:pb-0">
                  <div className={`absolute left-2 top-1 w-5 h-5 rounded-full border-4 border-white shadow ${item.highlight ? 'bg-verde-folha' : 'bg-dourado'}`} />
                  <span className="text-verde-folha font-bold text-sm uppercase tracking-wide">
                    {item.year}
                  </span>
                  <h3 className="font-heading font-bold text-navy text-lg mt-1">{item.title}</h3>
                  <p className="text-carvao/70 mt-1">{item.text}</p>
                  {item.highlight && (
                    <span className="inline-block mt-2 bg-dourado/15 text-dourado text-xs font-semibold px-3 py-1 rounded-full">
                      Destaque Nacional
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 md:mt-16 relative h-48 md:h-64 lg:h-80 rounded-3xl overflow-hidden max-w-4xl mx-auto shadow-apple-lg">
            <Image
              src="/images/lucas-banner.png"
              alt="Lucas Dierings em diferentes contextos profissionais"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 md:py-32 lg:py-40 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-navy text-center mb-12 md:mb-16 lg:mb-20">
            Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {values.map((v) => (
              <div key={v.title} className="text-center p-8 rounded-3xl glass-card hover:shadow-apple-lg transition-smooth hover:scale-105">
                <v.icon className="mx-auto text-dourado mb-6" size={48} />
                <h3 className="font-heading font-bold text-navy text-xl md:text-2xl mb-3">{v.title}</h3>
                <p className="text-carvao/60 text-base font-light leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Na Mídia */}
      <section className="py-24 md:py-32 lg:py-40 bg-off-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-navy text-center mb-12 md:mb-16 lg:mb-20">
            Na Mídia e Reconhecimento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* CNA Jovem */}
            <a
              href="https://cnabrasil.org.br/noticias/cna-jovem-anuncia-vencedores-da-quarta-edicao"
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-80 md:h-96 rounded-3xl overflow-hidden group block shadow-apple-lg hover:shadow-apple-lg transition-smooth"
            >
              <Image
                src="/images/lucas-posse.jpg"
                alt="Lucas Dierings — Destaque Nacional CNA Jovem"
                fill
                className="object-cover object-top group-hover:scale-110 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 via-60% to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-dourado text-carvao text-xs md:text-sm font-semibold px-4 py-2 rounded-full inline-block">Destaque Nacional</span>
                <h3 className="font-heading text-white font-bold text-lg md:text-xl mt-3">CNA Jovem — Sistema CNA/SENAR</h3>
                <p className="text-white/80 text-sm md:text-base font-light mt-1">Um dos 5 vencedores nacionais entre 3.742 jovens do agronegócio em 2021</p>
              </div>
            </a>
            {/* NHCast */}
            <a
              href="https://www.youtube.com/watch?v=Dt3m-VGw8zo&list=PLd-Myf-teNs_TrmvHpNkxS_BjpQl5BdCl"
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-80 md:h-96 rounded-3xl overflow-hidden group shadow-apple-lg hover:shadow-apple-lg transition-smooth block"
            >
              <Image
                src="/images/lucas-podcast.jpg"
                alt="Lucas Dierings — Host do NHCast New Holland"
                fill
                className="object-cover group-hover:scale-110 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 via-60% to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-dourado text-carvao text-xs md:text-sm font-semibold px-4 py-2 rounded-full inline-block">Host</span>
                <h3 className="font-heading text-white font-bold text-lg md:text-xl mt-3">NHCast — New Holland Brasil</h3>
                <p className="text-white/80 text-sm md:text-base font-light mt-1">Podcast oficial da maior fabricante de máquinas agrícolas</p>
              </div>
            </a>
            {/* Agrojovem Podcast */}
            <a
              href="https://www.youtube.com/@agrojovempodcast"
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-80 md:h-96 rounded-3xl overflow-hidden group shadow-apple-lg hover:shadow-apple-lg transition-smooth block"
            >
              <Image
                src="/images/lucas-podcast.jpg"
                alt="Lucas Dierings no Agrojovem Podcast"
                fill
                className="object-cover group-hover:scale-110 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 via-60% to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-verde-folha text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full inline-block">Podcast</span>
                <h3 className="font-heading text-white font-bold text-lg md:text-xl mt-3">Agrojovem Podcast</h3>
                <p className="text-white/80 text-sm md:text-base font-light mt-1">Compartilhando conhecimento com produtores de todo o Brasil</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-verde-folha py-20 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-8">
            Vamos trabalhar juntos?
          </h2>
          <Button asChild size="lg" className="bg-white text-verde-escuro hover:bg-white/90 hover:shadow-apple-lg">
            <Link href="/contato">Fale com Lucas <ArrowRight className="ml-2" size={18} /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
