import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/ui/breadcrumbs'
import {
  Award,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Trophy,
  GraduationCap,
  Radio,
  MapPin,
  Smartphone,
  ExternalLink,
  BookOpen,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  alternates: { canonical: '/sobre/' },
  title: 'Sobre Lucas Dierings | Eng. Agrônomo CREA-PR 179906/D',
  description:
    'Conheça Lucas Dierings: Engenheiro Agrônomo (CREA-PR 179906/D, UFPR), MBA USP/ESALQ, Top 5 CNA Jovem Brasil, host do NHCast (New Holland) e fundador da Fluxo Rural.',
  openGraph: {
    title: 'Sobre Lucas Dierings | Fluxo Rural Consultoria',
    description:
      'Engenheiro Agrônomo (CREA-PR 179906/D), MBA USP/ESALQ, destaque nacional CNA Jovem, professor de MBA e fundador da Fluxo Rural Consultoria.',
    images: [{ url: '/images/lucas-agronomo.jpg', width: 1200, height: 630, alt: 'Lucas Dierings na lavoura' }],
  },
}

const timeline = [
  {
    year: '2019',
    title: 'Graduação em Engenharia Agronômica',
    institution: 'UFPR — Universidade Federal do Paraná (Campus Palotina)',
    text: 'Formação sólida em agronomia de campo, manejo de culturas e gestão rural. Registro profissional ativo no CREA-PR sob nº 179906/D.',
    highlight: false,
  },
  {
    year: '2018–2025',
    title: 'Software de Gestão Rural — Analista a Diretor Comercial',
    institution: 'ERP & Tecnologia Agro',
    text: '7 anos na vanguarda da transformação digital no campo, estruturando processos financeiros, operacionais e agronômicos em propriedades de 24 estados brasileiros.',
    highlight: false,
  },
  {
    year: '2021',
    title: 'Destaque Nacional — Prêmio CNA Jovem',
    institution: 'Sistema CNA/SENAR',
    text: 'Um dos 5 vencedores nacionais com o projeto "Gestão Familiar Rural através de Informação e Tecnologia". Representou o Paraná em missão técnica pelas principais regiões produtoras do Brasil.',
    highlight: true,
  },
  {
    year: '2023',
    title: 'MBA em Agronegócios',
    institution: 'USP/ESALQ — Escola Superior de Agricultura Luiz de Queiroz',
    text: 'Especialização executiva na principal referência acadêmica e mercadológica do agronegócio na América Latina.',
    highlight: false,
  },
  {
    year: '2023–2024',
    title: 'Professor de Graduação em Agronomia',
    institution: 'ISEPE Rondon — Marechal Cândido Rondon/PR',
    text: 'Docência e formação da nova geração de engenheiros agrônomos em matérias de gestão e economia rural.',
    highlight: false,
  },
  {
    year: '2025',
    title: 'Professor de Pós-Graduação & MBA Executivo',
    institution: 'PUCPR — Pontifícia Universidade Católica do Paraná',
    text: 'Ministrando módulos de gestão estratégica, inovação e inteligência de negócios no agronegócio.',
    highlight: false,
  },
  {
    year: '2025–atual',
    title: 'Consultor Técnico e Gerencial Credenciado',
    institution: 'SENAR/PR — Norte do Paraná',
    text: 'Atendimento direto a produtores rurais em gestão de custos, eficiência operacional e planejamento de safra.',
    highlight: false,
  },
  {
    year: 'Atual',
    title: 'Fundador & Consultor Principal',
    institution: 'Fluxo Rural Consultoria — Londrina e Curitiba/PR',
    text: 'Liderando a Fluxo Rural em consultoria financeira, governança familiar, capacitação corporativa e palestras para produtores, empresas e cooperativas em todo o país.',
    highlight: true,
  },
]

const credentials = [
  {
    icon: GraduationCap,
    title: 'Eng. Agrônomo & MBA USP/ESALQ',
    subtitle: 'UFPR · CREA-PR 179906/D · ESALQ',
  },
  {
    icon: ShieldCheck,
    title: 'Consultor Senar, Sebrae e Sescoop',
    subtitle: 'Credenciamento técnico e gerencial',
  },
  {
    icon: BookOpen,
    title: 'Professor no Agronegócio',
    subtitle: 'Docência em MBA e graduação',
  },
  {
    icon: Trophy,
    title: 'Liderança no Agro (CNA & JCI)',
    subtitle: 'Reconhecimento nacional em liderança',
  },
  {
    icon: MapPin,
    title: 'Várias Cadeias de Produção',
    subtitle: 'Atendimento consultivo pelo Brasil',
  },
]

const values = [
  {
    icon: Award,
    title: 'Ir além do combinado',
    description: 'Entregar mais do que foi contratado é o que constrói relações de longo prazo e separa quem cresce de quem estaciona.',
  },
  {
    icon: HeartHandshake,
    title: 'Respeito a quem é do campo',
    description: 'Ninguém conhece a terra melhor do que quem vive nela. A boa consultoria soma técnica à vivência do produtor — nunca passa por cima.',
  },
  {
    icon: ShieldCheck,
    title: 'Verdade antes de agradar',
    description: 'Apresentar os números reais e diagnósticos honestos, mesmo quando desconfortáveis. A verdade com clareza é o que viabiliza decisões lucrativas.',
  },
]

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://fluxorural.com.br/sobre/#webpage',
  url: 'https://fluxorural.com.br/sobre/',
  name: 'Sobre Lucas Dierings | Fluxo Rural Consultoria',
  description:
    'Biografia, credenciais acadêmicas e trajetória profissional de Lucas Dierings — Engenheiro Agrônomo (CREA-PR 179906/D), MBA USP/ESALQ e consultor.',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://fluxorural.com.br/#lucas-dierings',
    name: 'Lucas Dierings',
    jobTitle: 'Engenheiro Agrônomo, Consultor e Palestrante',
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'CREA-PR',
      value: '179906/D',
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Universidade Federal do Paraná (UFPR - Campus Palotina)',
        description: 'Graduação em Engenharia Agronômica',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Escola Superior de Agricultura Luiz de Queiroz (USP/ESALQ)',
        description: 'MBA em Agronegócios',
      },
    ],
    award: 'Top 5 Nacional - Programa CNA Jovem (2021)',
    worksFor: {
      '@type': 'Organization',
      name: 'Fluxo Rural Consultoria',
      url: 'https://fluxorural.com.br/',
    },
    sameAs: [
      'https://www.linkedin.com/in/lucas-dierings/',
      'https://www.instagram.com/lucasdierings.agro/',
      'https://www.youtube.com/@agrojovempodcast',
    ],
  },
}

export default function SobrePage() {
  return (
    <div className="bg-[#0A192F] text-slate-100 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Sobre Lucas Dierings' }]} />

      {/* Hero Section */}
      <section className="relative min-h-[480px] lg:min-h-[540px] flex items-end overflow-hidden">
        <Image
          src="/images/lucas-agronomo.jpg"
          alt="Lucas Dierings na lavoura - vista aérea com drone"
          fill
          className="object-cover object-[center_55%]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/75 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A192F]/40 to-[#0A192F]/90 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-12 sm:pb-16 max-w-6xl">
          <div className="inline-flex items-center gap-2 bg-[#112240]/90 border border-[#4ADE80]/30 text-[#4ADE80] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4 shadow-sm backdrop-blur-md">
            <GraduationCap size={16} className="text-[#4ADE80]" />
            <span>Engenheiro Agrônomo · CREA-PR 179906/D</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
            Lucas Dierings
          </h1>

          <p className="text-slate-200 text-lg sm:text-xl md:text-2xl font-light max-w-2xl leading-relaxed">
            Do campo para a estratégia de negócios — e da estratégia de volta ao campo.
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 sm:py-28 bg-[#0D1F3C] border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Foto de Perfil em Card Dark Tech */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#112240] group">
                <Image
                  src="/images/lucas-hero.jpg"
                  alt="Lucas Dierings — Engenheiro Agrônomo e Consultor no Agronegócio"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(min-width: 1024px) 420px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0A192F]/80 backdrop-blur-md border border-white/10">
                  <p className="text-white font-bold text-base">Lucas Dierings</p>
                  <p className="text-[#E8B84B] text-xs font-medium">
                    Eng. Agrônomo (CREA-PR 179906/D) · MBA USP/ESALQ
                  </p>
                </div>
              </div>
            </div>

            {/* Texto de Apresentação */}
            <div className="lg:col-span-7 space-y-5 text-slate-300 leading-relaxed text-base sm:text-lg">
              <div className="inline-block">
                <span className="text-[#E8B84B] font-semibold text-xs uppercase tracking-widest">
                  Autoridade e Experiência de Campo
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1">
                  Gestão rural com respaldo técnico e rigor analítico
                </h2>
              </div>

              <p>
                <strong className="text-white font-medium">Lucas Dierings</strong> é Engenheiro Agrônomo formado pela <strong className="text-white font-medium">Universidade Federal do Paraná (UFPR - Campus Palotina)</strong> e especialista com <strong className="text-white font-medium">MBA em Agronegócios pela USP/ESALQ</strong> — o principal polo de inteligência agro do país.
              </p>

              <p>
                Eleito <strong className="text-[#4ADE80] font-medium">Top 5 Nacional do Programa CNA Jovem (Sistema CNA/SENAR)</strong> e com trajetória ativa na <strong className="text-white font-medium">JCI</strong>, destacou-se pela liderança em projetos de governança, pessoas e gestão rural orientada a processos e tecnologia.
              </p>

              <p>
                Com sólida experiência em gestão e inovação no agronegócio — atuando desde a análise técnica de processos até a liderança estratégica —, acompanhou de perto a rotina gerencial de propriedades em diversas regiões produtoras do país.
              </p>

              <p>
                Atualmente é <strong className="text-white font-medium">Professor no Agronegócio</strong> (em nível de pós-graduação e graduação), consultor técnico e gerencial credenciado pelo <strong className="text-white font-medium">SENAR, SEBRAE e SESCOOP</strong> e fundador da <strong className="text-[#E8B84B] font-medium">Fluxo Rural Consultoria</strong>, empresa voltada a transformar números de campo em decisões estratégicas de alta rentabilidade.
              </p>

              <p>
                Como palestrante e consultor, leva conhecimento prático a eventos do setor, cooperativas, sindicatos rurais e empresas do agronegócio por todo o Brasil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credenciais em Cards Agro-Tech */}
      <section className="relative py-20 sm:py-24 bg-[#0A192F] overflow-hidden border-t border-white/10">
        {/* Textura Agro-Tech de Fundo */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/images/agrotech-contour.jpg"
            alt="Textura topográfica agro-tech"
            fill
            sizes="100vw"
            className="object-cover opacity-20 mix-blend-screen"
            quality={75}
          />
          <div className="absolute inset-0 bg-[#0A192F]/85" />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-navy-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="text-center mb-14">
            <span className="text-[#4ADE80] text-xs uppercase font-semibold tracking-widest">
              Reconhecimento & Formação
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Credenciais Oficiais
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {credentials.map((c) => (
              <div
                key={c.title}
                className="bg-[#112240]/90 border border-white/10 rounded-2xl p-6 text-center hover:border-[#4ADE80]/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_0_20px_rgba(74,222,128,0.1)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#E8B84B]/10 border border-[#E8B84B]/20 flex items-center justify-center mx-auto mb-4">
                    <c.icon className="text-[#E8B84B]" size={24} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base mb-2 leading-tight">
                    {c.title}
                  </h3>
                </div>
                <p className="text-slate-400 text-xs mt-2">{c.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trajetória / Timeline */}
      <section className="py-20 sm:py-28 bg-[#0D1F3C] border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-[#E8B84B] text-xs uppercase font-semibold tracking-widest">
              Passo a Passo
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Trajetória Profissional
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Uma linha do tempo construída entre as ciências agronômicas, o mercado de tecnologia e a gestão estratégica no campo.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8">
            <div className="absolute left-[11px] sm:left-[15px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-[#4ADE80] via-[#E8B84B] to-[#1B4F7A]" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-8 sm:pl-10 group">
                  {/* Dot */}
                  <div
                    className={`absolute -left-[14px] sm:-left-[18px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      item.highlight
                        ? 'border-[#4ADE80] bg-[#0A192F] shadow-[0_0_12px_rgba(74,222,128,0.5)]'
                        : 'border-[#E8B84B] bg-[#0A192F]'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.highlight ? 'bg-[#4ADE80]' : 'bg-[#E8B84B]'
                      }`}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className={`bg-[#112240]/90 border rounded-2xl p-6 transition-all duration-300 hover:border-white/20 shadow-md ${
                      item.highlight
                        ? 'border-[#4ADE80]/30 shadow-[0_0_20px_rgba(74,222,128,0.06)]'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-[#4ADE80] font-bold text-xs sm:text-sm uppercase tracking-wider">
                        {item.year}
                      </span>
                      {item.highlight && (
                        <span className="bg-[#E8B84B]/20 text-[#E8B84B] border border-[#E8B84B]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          Destaque Nacional
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-white text-lg sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="text-[#E8B84B] text-xs sm:text-sm font-medium mt-0.5">
                      {item.institution}
                    </p>
                    <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banner de Contextos Profissionais */}
          <div className="mt-16 bg-[#112240]/80 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="relative h-48 sm:h-64 md:h-80 rounded-xl overflow-hidden">
              <Image
                src="/images/lucas-banner.png"
                alt="Lucas Dierings em diferentes contextos profissionais no agronegócio"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Valores e Princípios */}
      <section className="py-20 bg-[#0A192F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[#4ADE80] text-xs uppercase font-semibold tracking-widest">
              Fundamentos
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Valores Inegociáveis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-[#112240]/90 border border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-all duration-300 shadow-lg flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#E8B84B]/10 border border-[#E8B84B]/20 flex items-center justify-center mb-6">
                  <v.icon className="text-[#E8B84B]" size={32} />
                </div>
                <h3 className="font-heading font-bold text-white text-xl mb-3">
                  {v.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Na Mídia e Reconhecimento */}
      <section className="py-20 sm:py-28 bg-[#0D1F3C] border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[#E8B84B] text-xs uppercase font-semibold tracking-widest">
              Presença e Repercussão
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Na Mídia e Reconhecimento
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* CNA Jovem */}
            <a
              href="https://cnabrasil.org.br/noticias/cna-jovem-anuncia-vencedores-da-quarta-edicao"
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-96 rounded-2xl overflow-hidden group block border border-white/10 hover:border-[#E8B84B]/50 transition-all duration-300 shadow-xl bg-[#112240]"
            >
              <Image
                src="/images/lucas-posse.jpg"
                alt="Lucas Dierings - Destaque Nacional CNA Jovem"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-[#E8B84B] text-[#202522] text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                  <Trophy size={14} /> Destaque Nacional
                </span>
                <h3 className="font-heading text-white font-bold text-lg mt-3 group-hover:text-[#E8B84B] transition-colors">
                  CNA Jovem — Sistema CNA/SENAR
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-light mt-1">
                  Um dos 5 vencedores nacionais da edição 2021
                </p>
              </div>
            </a>

            {/* NHCast */}
            <a
              href="https://www.youtube.com/playlist?list=PLdv5Ps8k7ij8UDT_9aOTuzs_G5uo6lNva"
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-96 rounded-2xl overflow-hidden group block border border-white/10 hover:border-[#4ADE80]/50 transition-all duration-300 shadow-xl bg-[#112240]"
            >
              <Image
                src="/images/lucas-podcast.jpg"
                alt="Lucas Dierings - Host do NHCast New Holland"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-[#E8B84B] text-[#202522] text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                  <Radio size={14} /> Host Oficial
                </span>
                <h3 className="font-heading text-white font-bold text-lg mt-3 group-hover:text-[#4ADE80] transition-colors">
                  NHCast — New Holland Brasil
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-light mt-1">
                  Podcast oficial da maior fabricante de máquinas do agro
                </p>
              </div>
            </a>

            {/* Agrojovem Podcast */}
            <a
              href="https://www.youtube.com/@agrojovempodcast"
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-96 rounded-2xl overflow-hidden group block border border-white/10 hover:border-[#4ADE80]/50 transition-all duration-300 shadow-xl bg-[#112240]"
            >
              <Image
                src="/images/lucas-podcast.jpg"
                alt="Lucas Dierings no Agrojovem Podcast"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-[#6AAF3D] text-white text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                  <Radio size={14} /> Podcast Semanal
                </span>
                <h3 className="font-heading text-white font-bold text-lg mt-3 group-hover:text-[#4ADE80] transition-colors">
                  Agro Jovem Podcast
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-light mt-1">
                  Compartilhando gestão e inovação com produtores de todo o país
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Livro e Autoria */}
      <section className="py-20 sm:py-28 bg-[#0A192F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="bg-[#112240]/90 border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[260px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                  <Image
                    src="/images/livro-os-jovens-brasil-agro.jpg"
                    alt="Capa do livro Os Jovens, o Brasil e o Agro — coautoria de Lucas Dierings"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 260px, 280px"
                  />
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#E8B84B]/15 border border-[#E8B84B]/30 text-[#E8B84B] text-xs font-semibold px-3 py-1 rounded-full">
                  <BookOpen size={14} /> Coautor da Obra
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  Os Jovens, o Brasil e o Agro
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                  Mais do que reunir histórias de jovens que constroem o agronegócio brasileiro, a obra dá voz, vez e luz a trajetórias de quem escolheu dedicar sua vida produtiva à terra. Histórias reais de superação, sucessão familiar e inovação no campo brasileiro.
                </p>

                <p className="text-slate-400 text-xs">
                  Projeto editorial coordenado por Laura Meireles (Ler o Agro), reunindo líderes da nova geração do agronegócio nacional.
                </p>

                <div className="pt-2">
                  <a
                    href="https://loja.uiclap.com/titulo/ua163654"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#E8B84B] hover:text-[#F0CD7A] text-sm font-semibold transition-colors"
                  >
                    Conhecer e adquirir o livro na UICLAP <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-[#1B4F7A] via-[#0D1F3C] to-[#153C24] border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Vamos estruturar a gestão do seu agro?
          </h2>
          <p className="text-slate-200 text-base sm:text-lg font-light mb-8 max-w-xl mx-auto leading-relaxed">
            Seja para consultoria personalizada em sua propriedade rural ou palestras e treinamentos em seu evento, conte com respaldo técnico de verdade.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#6AAF3D] hover:bg-[#6AAF3D]/90 text-white font-semibold shadow-lg min-h-[48px] h-12 px-8 rounded-xl"
            >
              <Link href="/diagnostico">
                Diagnóstico Gratuito <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 min-h-[48px] h-12 px-8 rounded-xl"
            >
              <Link href="/contato">
                Falar com Lucas Dierings
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
