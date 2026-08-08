import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Trophy,
  GraduationCap,
  Radio,
  MapPin,
  CheckCircle2,
  Clock,
  Monitor,
  Users,
  MessageCircle,
  FileText,
} from 'lucide-react'
import { PedidoCTA } from '@/components/palestras/PedidoCTA'
import { PortfolioDownload } from '@/components/palestras/PortfolioDownload'
import { TEMAS_PALESTRA } from '@/lib/catalogo'

export const metadata: Metadata = {
  title: 'Palestrante para Agronegócio | Gestão, Liderança e IA no Agro',
  description:
    'Contrate Lucas Dierings, palestrante de gestão, finanças, liderança e IA no agronegócio. Host do NHCast (New Holland), Top 5 CNA Jovem do Brasil. Proposta em 24h.',
  alternates: { canonical: '/palestras/' },
  openGraph: {
    title: 'Palestrante para Agronegócio | Lucas Dierings',
    description:
      'Palestras de gestão, finanças, liderança e IA no agro. Conteúdo aplicado, linguagem do campo. Para cooperativas, sindicatos, empresas e eventos.',
  },
}

// Os temas vivem em lib/catalogo.ts porque a página de treinamentos e os
// formulários de captação precisam da mesma lista.
const temas = TEMAS_PALESTRA

const credenciais = [
  { icon: Trophy, title: 'Top 5 CNA Jovem 2021', subtitle: 'Entre os 5 melhores de 3.742 do Brasil' },
  { icon: Radio, title: 'Host do NHCast', subtitle: 'Podcast oficial da New Holland Brasil' },
  { icon: GraduationCap, title: 'MBA USP/ESALQ', subtitle: 'A melhor escola de agro do país' },
  { icon: MapPin, title: 'Palestras em 5 estados', subtitle: 'PR, MS, SC, RS e PI' },
]

// Três eventos diferentes de propósito. A galeria antiga tinha três ângulos da
// mesma sala, o que passava a impressão de uma agenda de um dia só.
const galeria = [
  {
    src: '/palestra-somave.jpg',
    alt: 'Lucas Dierings palestrando sobre gestão em palco de evento do agronegócio',
  },
  {
    src: '/palestra-sindicato-mcr.jpg',
    alt: 'Lucas Dierings ao microfone durante palestra em sindicato rural',
  },
  {
    src: '/palestra-teixeira-soares.jpg',
    alt: 'Lucas Dierings apresentando números de gestão financeira para produtores em sindicato rural',
  },
]

const formatos = [
  { icon: Clock, title: 'Palestra principal (45 a 60 min)', desc: 'Para abrir ou fechar o seu evento com energia.' },
  { icon: Users, title: 'Painel ou mesa redonda', desc: 'Participação em debate ou mediação de painel com outros convidados.' },
  { icon: Monitor, title: 'Presencial ou online', desc: 'Atendimento em todo o Brasil presencialmente ou por chamada de vídeo.' },
]

// PÚBLICO-ALVO. Quem CONTRATA não entra no front de propósito: quem quer
// contratar contrata, e a lista de instituições vive no llms.txt, onde serve
// para buscador e para IA encontrarem a página.
const plateias = [
  'Produtores rurais e famílias',
  'Empresários e lideranças do setor',
  'Equipes técnicas e comerciais',
  'Jovens sucessores',
  'Estudantes de ciências agrárias',
  'Público misto de feira e congresso',
]

const passos = [
  { num: 1, title: 'Preencha o pedido', desc: 'Conte o evento, quem vai assistir e o tema de interesse.' },
  { num: 2, title: 'Receba proposta em 24h', desc: 'Formato, duração e investimento adaptados ao seu evento.' },
  { num: 3, title: 'Confirme e prepare-se', desc: 'Alinhamos o conteúdo ao perfil da sua plateia.' },
]

const faqs = [
  {
    q: 'Quais são os formatos de palestra?',
    a: 'Palestra principal de 45 a 60 minutos, ou participação em painel e mesa redonda, presencial ou online. Para conteúdo aplicado de meio período ou dia inteiro, com exercícios e material de trabalho, o formato é treinamento.',
  },
  {
    q: 'Atende em todo o Brasil?',
    a: 'Sim. As palestras já passaram por 5 estados (PR, MS, SC, RS e PI) presencialmente, e também são realizadas online por chamada de vídeo.',
  },
  {
    q: 'Como funciona o investimento?',
    a: 'Varia conforme formato, duração e deslocamento. Depois que você preenche o pedido aqui no site, o retorno com a proposta personalizada vem em até 24h.',
  },
  {
    q: 'Dá para adaptar o tema ao meu público?',
    a: 'Sim. Todo o conteúdo é adaptado ao perfil da plateia, seja ela de produtores, de equipe interna, de estudantes ou mista, como costuma ser em feira e congresso.',
  },
  {
    q: 'Com quanto tempo de antecedência preciso contratar?',
    a: 'Quanto antes melhor para garantir a agenda, mas também organizamos palestras com prazos curtos quando há disponibilidade.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Palestras sobre agronegócio',
  name: 'Palestras de Lucas Dierings sobre Agronegócio',
  description:
    'Palestras e painéis sobre gestão, finanças, sucessão, liderança, empreendedorismo e inteligência artificial no agronegócio, para cooperativas, sindicatos, empresas e eventos do agro.',
  url: 'https://fluxorural.com.br/palestras',
  areaServed: { '@type': 'Country', name: 'Brasil' },
  provider: {
    '@type': 'Person',
    name: 'Lucas Dierings',
    jobTitle: 'Engenheiro Agrônomo, Consultor e Palestrante',
    url: 'https://fluxorural.com.br/sobre',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function PalestrasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-end">
        <Image
          src="/lucas-palestrante-chapeu.jpg"
          alt="Lucas Dierings palestrando para uma plateia do agronegócio"
          fill
          className="object-cover object-[center_25%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/60 to-navy/30" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-14 md:pb-20">
          <span className="inline-block bg-verde-folha/90 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full mb-5 backdrop-blur-sm">
            Palestrante para Agronegócio
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-4 max-w-3xl">
            Palestras para o Agronegócio
          </h1>
          <p className="text-white/85 text-lg md:text-xl font-light mb-8 max-w-2xl">
            Conteúdo aplicado de gestão, finanças, liderança e inovação para convenções corporativas, empresas, cooperativas e eventos do setor.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <PedidoCTA label="Levar uma palestra ao meu evento" servico="palestra" origem="hero" />
            <a
              href="#temas"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white text-white h-14 px-8 text-base font-medium hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              Ver os temas
            </a>
            <PortfolioDownload variant="outline" label="Baixar portfólio" origem="hero" />
          </div>
        </div>
      </section>

      {/* Credenciais / prova social real */}
      <section className="bg-navy py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {credenciais.map((c) => (
              <div key={c.title} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <c.icon className="mx-auto text-dourado mb-3" size={26} />
                <h3 className="font-heading font-bold text-white text-sm mb-1 leading-tight">{c.title}</h3>
                <p className="text-white/60 text-xs">{c.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Momentos no palco */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-3">Momentos no Palco</h2>
            <p className="text-carvao/70">
              Palco de evento, plenária de sindicato e sala cheia de produtor. O conteúdo é o mesmo,
              a linguagem se ajusta a quem está na frente.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {galeria.map((g) => (
              <div key={g.src} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className={`object-cover ${g.src === '/palestra-somave.jpg' ? 'scale-125 origin-center' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Temas detalhados */}
      <section id="temas" className="py-20 bg-off-white scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">Temas Disponíveis</h2>
            <p className="text-carvao/70">
              Cada palestra é adaptada ao seu público. Veja o que a plateia leva de cada tema.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {temas.map((tema) => (
              <div
                key={tema.title}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-7 flex flex-col"
              >
                <h3 className="font-heading font-bold text-navy text-xl mb-2">{tema.title}</h3>
                <p className="text-carvao/70 text-sm leading-relaxed mb-5">{tema.promise}</p>
                <ul className="space-y-3 mb-7 flex-1">
                  {tema.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-carvao/80">
                      <CheckCircle2 className="text-verde-folha shrink-0 mt-0.5" size={18} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <PedidoCTA
                  label="Quero esta palestra"
                  servico="palestra"
                  tema={tema.title}
                  variant="secondary"
                  size="default"
                  origem={tema.title}
                  className="w-full"
                />
                {tema.paginaPropria && (
                  <Link
                    href={tema.paginaPropria.href}
                    className="text-navy/70 hover:text-dourado text-xs font-medium text-center mt-3 underline underline-offset-2"
                  >
                    {tema.paginaPropria.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfólio em PDF. Peça única: cobre palestras e treinamentos. */}
      <section className="py-16 md:py-20 bg-navy">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block bg-dourado/15 text-dourado text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                Material para download
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
                Quer o material completo em mãos?
              </h2>
              <p className="text-white/75 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
                Baixe o portfólio em PDF com bio, credenciais, os temas de palestra, os formatos e
                também os treinamentos. Serve para decidir sozinho ou para levar à comissão, ao
                sindicato ou ao patrocinador do evento.
              </p>
              <ul className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 mb-8">
                {temas.map((t) => (
                  <li key={t.title} className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle2 className="text-verde-folha shrink-0" size={16} />
                    {t.title}
                  </li>
                ))}
              </ul>
              <div className="flex justify-center lg:justify-start">
                <PortfolioDownload label="Baixar portfólio" origem="banda-temas" />
              </div>
            </div>
            <div className="shrink-0">
              <div className="bg-dourado/10 border border-dourado/20 rounded-2xl w-40 h-52 md:w-48 md:h-64 flex flex-col items-center justify-center text-center px-4">
                <FileText className="text-dourado mb-3" size={44} />
                <p className="font-heading font-bold text-white text-sm leading-tight">
                  Portfólio Fluxo Rural
                </p>
                <p className="text-white/60 text-xs mt-1">Palestras e treinamentos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formatos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-14">Formatos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {formatos.map((f) => (
              <div key={f.title} className="text-center">
                <div className="bg-dourado/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="text-dourado" size={28} />
                </div>
                <h3 className="font-heading font-bold text-navy text-lg mb-2">{f.title}</h3>
                <p className="text-carvao/60 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-carvao/60 text-sm text-center mt-12 max-w-2xl mx-auto">
            Precisa capacitar uma equipe, e não falar para uma plateia? Isso é treinamento
            in-company: meio período ou dia inteiro, com oficina prática e material de trabalho.{' '}
            <Link
              href="/servicos/treinamentos"
              className="text-navy font-semibold hover:text-dourado underline"
            >
              Veja os 7 treinamentos
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Público-alvo */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-navy mb-4">Quem está na plateia</h2>
          <p className="text-carvao/70 max-w-2xl mx-auto mb-10">
            A contratação do evento é B2B, mas o conteúdo é feito para quem senta na cadeira. As palestras são construídas com exemplos e vivência real, sendo ajustadas a cada perfil de público.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {plateias.map((p) => (
              <span
                key={p}
                className="bg-white border border-navy/10 text-navy text-sm font-medium px-5 py-2.5 rounded-full shadow-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Como contratar */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-14">Como Contratar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {passos.map((p) => (
              <div key={p.num} className="text-center">
                <div className="bg-navy w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-heading font-bold">
                  {p.num}
                </div>
                <h3 className="font-heading font-bold text-navy text-lg mb-2">{p.title}</h3>
                <p className="text-carvao/60 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group bg-white rounded-xl p-5 shadow-sm">
                <summary className="font-heading font-semibold text-navy cursor-pointer list-none flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-dourado text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-carvao/70 text-sm leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-navy py-20">
        <div className="container mx-auto px-4 text-center">
          <MessageCircle className="mx-auto text-dourado mb-5" size={40} />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Leve uma palestra de verdade ao seu evento
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Preencha o pedido e receba uma proposta personalizada em até 24h. Sem compromisso.
          </p>
          <div className="flex justify-center">
            <PedidoCTA label="Solicitar proposta" servico="palestra" origem="cta-final" />
          </div>
        </div>
      </section>
    </>
  )
}
