import type { Metadata } from 'next'
import Image from 'next/image'
import { Youtube, UserPlus, Mic2, Handshake, Radio, Play } from 'lucide-react'
import Breadcrumbs from '@/components/ui/breadcrumbs'
import { PedidoCTA } from '@/components/palestras/PedidoCTA'

export const metadata: Metadata = {
  alternates: { canonical: '/agrojovem/' },
  title: 'Agro Jovem Podcast',
  description:
    'O podcast sobre gestão, liderança e inovação para o produtor rural, apresentado por Lucas Dierings. Indique convidados, contrate host para o seu podcast ou fale sobre patrocínio.',
  openGraph: {
    title: 'Agro Jovem Podcast | Lucas Dierings',
    description:
      'Conversas sobre gestão, liderança e inovação no campo. Com Lucas Dierings, host do NHCast da New Holland Brasil.',
    images: [{ url: '/images/agrojovem-estudio.jpg' }],
  },
}

const CANAL_URL = 'https://www.youtube.com/@agrojovempodcast'
const NHCAST_URL = 'https://www.youtube.com/playlist?list=PLdv5Ps8k7ij8UDT_9aOTuzs_G5uo6lNva'

// Quatro pedidos que chegam por esta página. O primeiro é o principal: o que a
// página existe para fazer é levar gente para o canal.
const frentes = [
  {
    icon: UserPlus,
    title: 'Indicar um convidado',
    desc: 'Conhece alguém com história boa para contar no agro? Produtor que virou o jogo, pesquisador, gente que fez diferente. As melhores pautas vêm de quem está no campo.',
    cta: 'Indicar convidado',
  },
  {
    icon: Mic2,
    title: 'Host para sua marca ou evento',
    desc: 'Além do canal próprio, o Lucas atua como entrevistador corporativo. Condução de videocast de empresa, série especial e cobertura de feiras com entrevistas no estande.',
    cta: 'Contratar host',
  },
  {
    icon: Radio,
    title: 'Convidar o Lucas',
    desc: 'Tem um podcast e quer um convidado que fale de gestão, finanças, sucessão e inovação no agro sem enrolação? É só chamar.',
    cta: 'Fazer o convite',
  },
  {
    icon: Handshake,
    title: 'Patrocinar',
    desc: 'Coloque a sua marca diante de uma audiência de produtores rurais, técnicos e jovens do agro. Cotas por temporada ou por episódio.',
    cta: 'Falar sobre patrocínio',
  },
]

const historico = [
  {
    title: 'NHCast, New Holland Brasil',
    desc: 'Host do podcast oficial da New Holland nas edições de 2025 e 2026 da Agrishow.',
    href: NHCAST_URL,
  },
  {
    title: 'Agrobit Brasil',
    desc: 'O podcast rodou durante todo o evento, conversando com empresários, visitantes e palestrantes.',
    href: null,
  },
  {
    title: 'Inovameat, Toledo/PR',
    desc: 'Entrevistas com os palestrantes do evento, gravadas dentro do caminhão da CNA.',
    href: null,
  },
]

const podcastJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'PodcastSeries',
  name: 'Agro Jovem Podcast',
  description:
    'Conversas sobre gestão, liderança e inovação no agronegócio para o produtor rural, apresentadas por Lucas Dierings.',
  url: 'https://fluxorural.com.br/agrojovem/',
  webFeed: CANAL_URL,
  inLanguage: 'pt-BR',
  author: {
    '@type': 'Person',
    name: 'Lucas Dierings',
    url: 'https://fluxorural.com.br/sobre',
  },
}

export default function AgroJovemPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Serviços', href: '/servicos' },
          { label: 'Agro Jovem Podcast' },
        ]}
      />

      {/* Hero */}
      <section className="relative min-h-[52vh] flex items-end">
        <Image
          src="/images/agrojovem-estudio.jpg"
          alt="Estúdio do Agro Jovem Podcast durante uma gravação, com a marca do programa na tela"
          fill
          className="object-cover object-[center_40%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/70 to-navy/30" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20 pb-12">
          <span className="inline-block bg-verde-folha/90 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
            Agro Jovem Podcast
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3 max-w-3xl leading-tight">
            Conversa boa sobre o agro, com quem vive o agro
          </h1>
          <p className="text-white/85 text-lg md:text-xl max-w-2xl font-light mb-8">
            Gestão, liderança e inovação na linguagem de quem está na propriedade. Sem palco
            corporativo e sem promessa de palestra motivacional.
          </p>
          <a
            href={CANAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-[52px] gap-3 rounded-full bg-dourado text-carvao px-8 text-base font-semibold hover:bg-dourado/90 transition-colors shadow-lg shadow-dourado/20"
          >
            <Youtube size={22} /> Assistir no YouTube
          </a>
        </div>
      </section>

      {/* O canal */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            Feito para o produtor rural
          </h2>
          <p className="text-carvao/70 text-lg leading-relaxed mb-8">
            O Agro Jovem nasceu de uma pergunta simples: por que tanta conversa boa sobre o agro
            acontece longe de quem produz? Cada episódio traz alguém que viveu na prática o que
            está contando, e o assunto é sempre o que muda a rotina dentro da porteira.
          </p>
          <a
            href={CANAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-[52px] gap-3 rounded-full bg-navy text-white px-8 text-base font-semibold hover:bg-navy/90 transition-colors"
          >
            <Play size={20} /> Ver os episódios
          </a>
        </div>
      </section>

      {/* As frentes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
              Quer participar?
            </h2>
            <p className="text-carvao/70">
              Tem quatro caminhos, e nenhum deles depende de você ter podcast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {frentes.map((f) => (
              <div
                key={f.title}
                className="bg-off-white rounded-2xl border border-navy/5 hover:border-dourado/30 hover:shadow-sm transition-all p-7 flex flex-col"
              >
                <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-sm">
                  <f.icon className="text-dourado" size={26} />
                </div>
                <h3 className="font-heading font-bold text-navy text-xl mb-3">{f.title}</h3>
                <p className="text-carvao/70 text-sm leading-relaxed mb-6 flex-1">{f.desc}</p>
                <PedidoCTA
                  label={f.cta}
                  servico="podcast"
                  tema={f.title}
                  origem={f.title}
                  size="default"
                  className="w-full justify-center"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Histórico */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-navy mb-4">Host para marcas e eventos do agronegócio</h2>
            <p className="text-carvao/70">
              O Agro Jovem é um canal próprio, mas o Lucas também leva a experiência de gravação e condução de entrevistas para marcas e feiras do setor.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {historico.map((h) =>
              h.href ? (
                <a
                  key={h.title}
                  href={h.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-navy/10 rounded-xl p-6 hover:border-dourado/40 hover:shadow-sm transition-all block"
                >
                  <h3 className="font-heading font-bold text-navy text-base mb-2">{h.title}</h3>
                  <p className="text-carvao/65 text-sm leading-relaxed">{h.desc}</p>
                </a>
              ) : (
                <div key={h.title} className="bg-white border border-navy/10 rounded-xl p-6">
                  <h3 className="font-heading font-bold text-navy text-base mb-2">{h.title}</h3>
                  <p className="text-carvao/65 text-sm leading-relaxed">{h.desc}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-navy py-16">
        <div className="container mx-auto px-4 text-center">
          <Mic2 className="mx-auto text-dourado mb-5" size={40} />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Vamos gravar juntos?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Conte o que você tem em mente: episódio, série de empresa, gravação em evento,
            indicação de convidado ou patrocínio. A partir daí a gente desenha o formato.
          </p>
          <PedidoCTA
            label="Falar sobre o projeto"
            servico="podcast"
            origem="cta-final"
            className="bg-dourado text-carvao hover:bg-dourado/90"
          />
        </div>
      </section>
    </>
  )
}
