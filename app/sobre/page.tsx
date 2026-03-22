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
    text: 'eProdutor — ERP para Gestão de Propriedades Rurais. Atuação em 24 estados brasileiros.',
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
    text: 'Fluxo Rural Consultoria — Londrina, PR',
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
    subtitle: 'eProdutor — 24 estados brasileiros',
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
          className="object-cover object-center"
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/lucas-hero.jpg"
                alt="Lucas Dierings — Engenheiro Agrônomo"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-5 text-carvao/80 leading-relaxed text-lg">
              <p>
                Lucas Dierings é engenheiro agrônomo graduado pela UFPR, com MBA em Agronegócios pela USP/ESALQ — a mais reconhecida escola de agronegócio do Brasil.
              </p>
              <p>
                Vencedor nacional do Programa CNA Jovem 2021, promovido pelo Sistema CNA/SENAR, foi selecionado entre 3.742 jovens de todo o Brasil pelo seu projeto de Gestão Familiar Rural com foco em informação e tecnologia.
              </p>
              <p>
                Com passagem de 7 anos no eProdutor — software de gestão rural com atuação em 24 estados —, de analista à direção comercial, Lucas acumulou experiência única na intersecção entre tecnologia e gestão no campo.
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
      <section className="py-20 bg-navy">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white text-center mb-14">
            Credenciais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {credentials.map((c) => (
              <div
                key={c.title}
                className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:bg-white/10 transition-colors"
              >
                <c.icon className="mx-auto text-dourado mb-3" size={32} />
                <h3 className="font-heading font-bold text-white text-sm mb-1 leading-tight">
                  {c.title}
                </h3>
                <p className="text-white/60 text-xs">{c.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trajetória */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy text-center mb-14">
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
          <div className="mt-14 relative h-64 rounded-2xl overflow-hidden max-w-4xl mx-auto">
            <Image
              src="/images/lucas-banner.png"
              alt="Lucas Dierings em diferentes contextos profissionais"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy text-center mb-14">
            Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <v.icon className="mx-auto text-dourado mb-4" size={40} />
                <h3 className="font-heading font-bold text-navy text-xl mb-2">{v.title}</h3>
                <p className="text-carvao/60">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Na Mídia */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy text-center mb-14">
            Na Mídia e Reconhecimento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* CNA Jovem */}
            <a
              href="https://cnabrasil.org.br/noticias/cna-jovem-anuncia-vencedores-da-quarta-edicao"
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-72 rounded-xl overflow-hidden group block"
            >
              <Image
                src="/images/lucas-posse.jpg"
                alt="Lucas Dierings — Destaque Nacional CNA Jovem"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-dourado text-carvao text-xs font-semibold px-3 py-1 rounded-full">Destaque Nacional</span>
                <h3 className="font-heading text-white font-bold text-lg mt-2">CNA Jovem — Sistema CNA/SENAR</h3>
                <p className="text-white/70 text-sm">Um dos 5 vencedores nacionais entre 3.742 jovens do agronegócio em 2021</p>
              </div>
            </a>
            {/* NHCast */}
            <div className="relative h-72 rounded-xl overflow-hidden group">
              <Image
                src="/images/lucas-podcast.jpg"
                alt="Lucas Dierings — Host do NHCast New Holland"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-dourado text-carvao text-xs font-semibold px-3 py-1 rounded-full">Host</span>
                <h3 className="font-heading text-white font-bold text-lg mt-2">NHCast — New Holland Brasil</h3>
                <p className="text-white/70 text-sm">Podcast oficial da maior fabricante de máquinas agrícolas</p>
              </div>
            </div>
            {/* Agrojovem Podcast */}
            <div className="relative h-72 rounded-xl overflow-hidden group">
              <Image
                src="/images/lucas-podcast.jpg"
                alt="Lucas Dierings no Agrojovem Podcast"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-verde-folha text-white text-xs font-semibold px-3 py-1 rounded-full">Podcast</span>
                <h3 className="font-heading text-white font-bold text-lg mt-2">Agrojovem Podcast</h3>
                <p className="text-white/70 text-sm">Compartilhando conhecimento com produtores de todo o Brasil</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-verde-folha py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-6">
            Vamos trabalhar juntos?
          </h2>
          <Button asChild size="lg" className="bg-white text-verde-escuro hover:bg-white/90">
            <Link href="/contato">Fale com Lucas <ArrowRight className="ml-2" size={18} /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
