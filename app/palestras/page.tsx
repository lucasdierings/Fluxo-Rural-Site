import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Trophy,
  GraduationCap,
  Radio,
  MapPin,
  CheckCircle2,
  Clock,
  Monitor,
  Building2,
  MessageCircle,
  FileText,
} from 'lucide-react'
import { WhatsappCTA } from '@/components/palestras/WhatsappCTA'
import { MidiaKitDownload } from '@/components/palestras/MidiaKitDownload'

export const metadata: Metadata = {
  title: 'Palestrante para Agronegócio | Gestão, Finanças e IA no Agro',
  description:
    'Contrate Lucas Dierings — palestrante de gestão, finanças, marketing e IA no agronegócio. Host do NHCast (New Holland), Top 5 CNA Jovem do Brasil. Proposta em 24h.',
  alternates: { canonical: 'https://fluxorural.com.br/palestras' },
  openGraph: {
    title: 'Palestrante para Agronegócio | Lucas Dierings',
    description:
      'Palestras de gestão, finanças, marketing e IA no agro. Conteúdo aplicado, linguagem do campo. Para cooperativas, sindicatos, empresas e eventos.',
  },
}

// Mensagem genérica do CTA principal (hero / final)
const MSG_GERAL =
  'Olá Lucas! Quero levar uma palestra sua para o meu evento. Pode me enviar os temas e valores?'

const temas = [
  {
    title: 'Gestão e Inovação no Agronegócio',
    promise:
      'Como aplicar gestão profissional e inovação para aumentar a eficiência e a rentabilidade no campo.',
    bullets: [
      'Os indicadores que todo gestor rural precisa acompanhar — e os que só dão trabalho',
      'Como transformar os dados da fazenda em decisão, sem virar refém de planilha',
      'Casos reais de propriedades que profissionalizaram a gestão e o que mudou no bolso',
    ],
  },
  {
    title: 'Gestão Financeira Rural na Prática',
    promise:
      'Fluxo de caixa, custo de produção e rentabilidade por safra explicados na linguagem do campo.',
    bullets: [
      'Como separar a conta da pessoa física da conta da fazenda — e por que isso muda tudo',
      'Custo por hectare e por saca: como calcular e usar para negociar melhor',
      'O ciclo financeiro do agro e como não apertar no vão entre safra e venda',
    ],
  },
  {
    title: 'Gestão como Ferramenta para a Sucessão Familiar',
    promise:
      'Como a gestão profissional destrava a transição entre gerações sem brigar a família.',
    bullets: [
      'Por que a maioria das sucessões trava na falta de gestão, não na falta de herdeiro',
      'Combinados, papéis e governança: o mínimo para empresa e família não se misturarem',
      'O caminho para a próxima geração assumir com número na mão, não no feeling',
    ],
  },
  {
    title: 'Inteligência Artificial no Agronegócio',
    promise:
      'O que já é realidade em IA no agro, quais ferramentas usar e como começar a aplicar amanhã.',
    bullets: [
      'O que a IA já faz hoje no agro — e o que ainda é promessa de palco',
      'Ferramentas práticas que um produtor ou empresa pode usar essa semana',
      'Como usar IA para ganhar tempo em gestão, marketing e decisão, sem ser técnico',
    ],
  },
]

const credenciais = [
  { icon: Trophy, title: 'Top 5 CNA Jovem 2021', subtitle: 'Entre os 5 melhores de 3.742 do Brasil' },
  { icon: Radio, title: 'Host do NHCast', subtitle: 'Podcast oficial da New Holland Brasil' },
  { icon: GraduationCap, title: 'MBA USP/ESALQ', subtitle: 'A melhor escola de agro do país' },
  { icon: MapPin, title: 'Palestras em 5 estados', subtitle: 'PR, MS, SC, RS e PI' },
]

const galeria = [
  {
    src: '/palestra-plateia.jpg',
    alt: 'Lucas Dierings palestrando para plateia no Fórum Jovens Líderes Rurais, em Londrina/PR',
  },
  {
    src: '/palestra-palco.jpg',
    alt: 'Lucas Dierings no palco durante palestra sobre empreendedorismo no agronegócio',
  },
  {
    src: '/palestra-painel.jpg',
    alt: 'Lucas Dierings em painel de debate sobre o futuro do agronegócio',
  },
]

const formatos = [
  { icon: Clock, title: 'Keynote (45–60 min)', desc: 'Palestra principal para abrir ou fechar o seu evento com energia.' },
  { icon: Building2, title: 'Workshop / Imersão', desc: 'Meio período de conteúdo aplicado, com exercícios e discussão.' },
  { icon: Monitor, title: 'Presencial ou online', desc: 'Atendimento em todo o Brasil presencialmente ou por chamada de vídeo.' },
]

const paraQuem = [
  'Cooperativas agropecuárias',
  'Sindicatos rurais e associações',
  'Revendas e indústrias de insumos',
  'Agtechs e empresas do agro',
  'Organizadores de eventos e feiras',
  'Universidades e instituições de ensino',
]

const passos = [
  { num: 1, title: 'Chame no WhatsApp', desc: 'Conte o evento, o público-alvo e o tema de interesse.' },
  { num: 2, title: 'Receba proposta em 24h', desc: 'Formato, duração e investimento adaptados ao seu evento.' },
  { num: 3, title: 'Confirme e prepare-se', desc: 'Alinhamos o conteúdo ao perfil da sua plateia.' },
]

const faqs = [
  {
    q: 'Quais são os formatos de palestra?',
    a: 'Keynote de 45 a 60 minutos, workshop de meio período ou participação em painel. Tudo presencial ou online, conforme o seu evento.',
  },
  {
    q: 'Atende em todo o Brasil?',
    a: 'Sim. As palestras já passaram por 5 estados (PR, MS, SC, RS e PI) presencialmente, e também são realizadas online por chamada de vídeo.',
  },
  {
    q: 'Como funciona o investimento?',
    a: 'Varia conforme formato, duração e deslocamento. Após o primeiro contato pelo WhatsApp, você recebe uma proposta personalizada em até 24h.',
  },
  {
    q: 'Dá para adaptar o tema ao meu público?',
    a: 'Sim. Todo o conteúdo é adaptado ao perfil da plateia — produtores, cooperativa, empresa, evento ou universidade.',
  },
  {
    q: 'Com quanto tempo de antecedência preciso contratar?',
    a: 'Quanto antes melhor para garantir a agenda, mas também organizamos palestras com prazos curtos quando há disponibilidade.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Palestras e workshops sobre agronegócio',
  name: 'Palestras de Lucas Dierings sobre Agronegócio',
  description:
    'Palestras e workshops sobre gestão, finanças, marketing e inteligência artificial no agronegócio, para cooperativas, sindicatos, empresas e eventos do agro.',
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
            Palestras de Gestão, Finanças e IA no Agro
          </h1>
          <p className="text-white/85 text-lg md:text-xl font-light mb-3 max-w-2xl">
            Conteúdo aplicado, linguagem do campo e resultado na prática — para cooperativas,
            sindicatos, empresas e eventos do agronegócio.
          </p>
          <p className="text-dourado font-medium text-base md:text-lg mb-8 max-w-2xl">
            Nada de palco motivacional vazio: quem sobe ao palco vive o que ensina.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <WhatsappCTA message={MSG_GERAL} label="Levar essa palestra ao meu evento" origem="hero" />
            <a
              href="#temas"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white text-white h-14 px-8 text-base font-medium hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              Ver os temas
            </a>
            <MidiaKitDownload variant="outline" label="Baixar mídia kit (PDF)" origem="hero" />
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
              Palestra recente: “Empreendedorismo e Inovação no Agronegócio” — Fórum Jovens Líderes
              Rurais, Londrina/PR.
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
                  className="object-cover"
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
                <WhatsappCTA
                  message={`Olá Lucas! Tenho interesse na palestra "${tema.title}" para o meu evento. Pode me passar formato e valores?`}
                  label="Quero esta palestra"
                  variant="secondary"
                  size="default"
                  origem={tema.title}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mídia Kit — material para apresentar à diretoria */}
      <section className="py-16 md:py-20 bg-navy">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block bg-dourado/15 text-dourado text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                Material para download
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
                Precisa apresentar para a diretoria?
              </h2>
              <p className="text-white/75 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
                Baixe o mídia kit completo em PDF — bio, credenciais, os temas de palestra e
                formatos. Pronto para enviar à comissão, cooperativa ou patrocinador do seu evento.
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
                <MidiaKitDownload label="Baixar mídia kit (PDF)" origem="banda-temas" />
              </div>
            </div>
            <div className="shrink-0">
              <div className="bg-dourado/10 border border-dourado/20 rounded-2xl w-40 h-52 md:w-48 md:h-64 flex flex-col items-center justify-center text-center px-4">
                <FileText className="text-dourado mb-3" size={44} />
                <p className="font-heading font-bold text-white text-sm leading-tight">Mídia Kit</p>
                <p className="text-white/60 text-xs mt-1">Palestras · PDF · 5 páginas</p>
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
        </div>
      </section>

      {/* Para quem */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <h2 className="font-heading text-3xl font-bold text-navy mb-10">Para quem são as palestras</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {paraQuem.map((p) => (
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
      <section className="py-20 bg-off-white">
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
            Fale comigo no WhatsApp e receba uma proposta personalizada em até 24h. Sem compromisso.
          </p>
          <div className="flex justify-center">
            <WhatsappCTA message={MSG_GERAL} label="Solicitar proposta no WhatsApp" origem="cta-final" />
          </div>
        </div>
      </section>
    </>
  )
}
