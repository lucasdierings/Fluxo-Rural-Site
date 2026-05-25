import type { Metadata } from 'next'
import Image from 'next/image'
import { FileText, Send, Sparkles, Mic2, Users, BarChart2, Sprout, Brain, Radio } from 'lucide-react'
import { PalestraForm } from '@/components/forms/PalestraForm'

export const metadata: Metadata = {
  title: 'Palestras, Podcast ao Vivo e Apresentação de Eventos do Agro',
  description: 'Lucas Dierings — palestrante do agronegócio, host do NHCast (New Holland) e AgroJovem Podcast. Palestras sobre gestão, sucessão, IA e inovação. Podcast gravado ao vivo no seu evento e cerimonialista pra premiações e congressos do agro.',
  alternates: { canonical: 'https://fluxorural.com.br/palestras' },
  openGraph: {
    title: 'Palestras e Podcaster pra Eventos do Agronegócio | Lucas Dierings',
    description: '+80 palestras pelo Brasil. Engenheiro agrônomo, vencedor CNA Jovem 2021, host do NHCast e AgroJovem Podcast.',
    url: 'https://fluxorural.com.br/palestras',
    images: [
      {
        url: '/images/og-palestras.jpg',
        width: 1200,
        height: 630,
        alt: 'Lucas Dierings palestrando em evento do agronegócio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Palestras e Podcaster pra Eventos do Agro | Lucas Dierings',
    description: '+80 palestras pelo Brasil. Engenheiro agrônomo e host do NHCast (New Holland).',
    images: ['/images/og-palestras.jpg'],
  },
}

const talks = [
  {
    icon: Users,
    title: 'Gestão financeira como ferramenta pra sucessão familiar',
    description: 'A maior briga em família de produtor não é por terra — é por número que ninguém sabe. Como gestão financeira clara prepara o filho pra assumir e protege o patrimônio que o pai construiu.',
  },
  {
    icon: Sprout,
    title: 'Inovação e empreendedorismo no agronegócio',
    description: 'O agro mudou mais nos últimos 5 anos do que nos 50 anteriores. Cases reais de quem inovou, quem ficou pra trás e o que cada produtor pode aplicar já na próxima safra.',
  },
  {
    icon: Brain,
    title: 'IA no agronegócio: o que já é realidade',
    description: 'ChatGPT no escritório, sensor no pivô, satélite na soja. Quais ferramentas de IA já estão dando resultado no campo brasileiro — e quais ainda são só promessa de vendedor de software.',
  },
  {
    icon: BarChart2,
    title: 'Gestão financeira rural na prática',
    description: 'Custo por hectare, margem por talhão e ponto de equilíbrio da safra. Os 5 indicadores que separam o produtor que cresce do que vive apagando incêndio no fim do mês.',
  },
  {
    icon: Radio,
    title: 'Podcaster pra empresas e eventos',
    description: 'Episódio gravado ao vivo no seu congresso, lançamento ou feira — com convidados do agro, audiência presencial e branding da sua marca. Distribuído depois nas plataformas do NHCast e AgroJovem.',
  },
  {
    icon: Mic2,
    title: 'Apresentador / Cerimonialista de eventos do agro',
    description: 'Host de premiações de cooperativa, palco de feira, lançamento de produto e assembleia. Linguagem do produtor, ritmo de evento corporativo, sem aquele engessamento institucional que faz a plateia olhar pro celular.',
  },
]

const steps = [
  { icon: FileText, title: 'Preencha o formulário', description: 'Conta a data, o público e o tema de interesse. Sem letra miúda.' },
  { icon: Send, title: 'Proposta em 24h', description: 'Mando proposta personalizada com formato, duração e investimento.' },
  { icon: Sparkles, title: 'Confirme e prepare-se', description: 'Aprovação, alinhamento de conteúdo e seu evento entra no calendário.' },
]

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lucas Dierings',
  jobTitle: 'Palestrante, Podcaster e Apresentador de Eventos do Agronegócio',
  description: 'Engenheiro agrônomo, MBA USP/ESALQ, vencedor nacional CNA Jovem 2021. Host do NHCast (New Holland) e AgroJovem Podcast. +80 palestras pelo Brasil sobre gestão, sucessão familiar, inovação e IA no agro.',
  url: 'https://fluxorural.com.br/palestras',
  image: 'https://fluxorural.com.br/images/og-palestras.jpg',
  email: 'contato@fluxorural.com.br',
  sameAs: [
    'https://linkedin.com/in/lucasdierings',
    'https://www.instagram.com/lucasdierings.agro/',
  ],
  knowsAbout: [
    'Gestão financeira rural',
    'Sucessão familiar no agronegócio',
    'Inovação no agro',
    'Inteligência artificial aplicada ao agronegócio',
    'Empreendedorismo rural',
    'Apresentação de eventos do agro',
    'Podcast ao vivo em eventos corporativos',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Fluxo Rural Consultoria',
    url: 'https://fluxorural.com.br',
  },
}

const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: talks.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: t.title,
      description: t.description,
      provider: {
        '@type': 'Person',
        name: 'Lucas Dierings',
      },
      areaServed: { '@type': 'Country', name: 'Brasil' },
    },
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://fluxorural.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Palestras', item: 'https://fluxorural.com.br/palestras' },
  ],
}

export default function PalestrasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[460px] max-h-[620px] flex items-end">
        <Image
          src="/lucas-palestrante.jpg"
          alt="Lucas Dierings palestrando em evento do agronegócio"
          fill
          className="object-cover object-[center_20%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-14">
          <span className="inline-block bg-dourado/95 text-carvao text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Palestras • Podcast ao Vivo • Apresentação
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-3xl leading-tight">
            Conteúdo que sai do palco e vira decisão na fazenda.
          </h1>
          <p className="text-white/85 text-lg md:text-xl max-w-2xl">
            +80 palestras em cooperativas, congressos e eventos do agro. Engenheiro agrônomo, vencedor nacional CNA Jovem 2021 e host do NHCast (New Holland).
          </p>
        </div>
      </section>

      {/* Temas */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
              Pra qual desses formatos seu evento precisa?
            </h2>
            <p className="text-carvao/70">
              Cada tema é adaptado pra duração, perfil do público e formato — keynote, painel, mediação ou podcast ao vivo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {talks.map((talk) => (
              <div
                key={talk.title}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-shadow border border-transparent hover:border-dourado/30"
              >
                <div className="bg-dourado/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <talk.icon className="text-dourado" size={24} />
                </div>
                <h3 className="font-heading font-bold text-navy text-lg mb-3 leading-snug">{talk.title}</h3>
                <p className="text-carvao/70 text-sm leading-relaxed">{talk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibilidade Podcast */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image src="/images/lucas-podcast.jpg" alt="Lucas no Agrojovem Podcast" fill className="object-cover" />
            </div>
            <div>
              <span className="bg-verde-folha/15 text-verde-folha text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                Host de podcast desde 2022
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mt-4 mb-4">
                NHCast (New Holland) e AgroJovem Podcast
              </h2>
              <p className="text-carvao/70 leading-relaxed mb-4">
                Já entrevistei produtores, executivos e pesquisadores do agronegócio brasileiro nos dois projetos. Sei conduzir conversa que prende a audiência — presencial ou nas plataformas.
              </p>
              <p className="text-carvao/70 leading-relaxed">
                Se sua empresa quer levar essa pegada pro próximo congresso, lançamento ou feira: gravo episódio ao vivo, com convidados do seu setor e a marca do patrocinador no palco.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como contratar */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-14">Como contratar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="bg-dourado/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="text-dourado" size={28} />
                </div>
                <span className="text-verde-folha font-bold text-sm">Passo {i + 1}</span>
                <h3 className="font-heading font-bold text-navy text-lg mt-1 mb-2">{step.title}</h3>
                <p className="text-carvao/60 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="solicitar" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
              Solicitar proposta
            </h2>
            <p className="text-carvao/70 max-w-xl mx-auto">
              Preenche os campos abaixo e em até 24h te mando proposta com formato, duração e investimento.
            </p>
          </div>
          <div className="bg-off-white rounded-2xl p-6 md:p-10 shadow-sm">
            <PalestraForm />
          </div>
        </div>
      </section>
    </>
  )
}
