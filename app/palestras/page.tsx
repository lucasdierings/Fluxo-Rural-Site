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
  Sparkles,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import { PedidoCTA } from '@/components/palestras/PedidoCTA'
import { PortfolioDownload } from '@/components/palestras/PortfolioDownload'
import { WhatsappCTA } from '@/components/palestras/WhatsappCTA'
import Breadcrumbs from '@/components/ui/breadcrumbs'
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
    url: 'https://fluxorural.com.br/palestras/',
    images: [{ url: '/lucas-palestrante-chapeu.jpg', width: 1200, height: 630, alt: 'Lucas Dierings palestrando no agronegócio' }],
  },
}

const temas = TEMAS_PALESTRA

const credenciais = [
  { icon: Trophy, title: 'Top 5 CNA Jovem 2021', subtitle: 'Destaque Nacional em Liderança' },
  { icon: Radio, title: 'Host do NHCast', subtitle: 'Podcast oficial da New Holland Brasil' },
  { icon: GraduationCap, title: 'MBA USP/ESALQ', subtitle: 'Engenheiro Agrônomo CREA-PR' },
  { icon: MapPin, title: 'Palestras em 5 Estados', subtitle: 'PR, MS, SC, RS e PI' },
]

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
  {
    icon: Clock,
    title: 'Palestra Principal (45 a 60 min)',
    desc: 'Para abrir ou fechar o seu evento com energia, dados reais e insights práticos.',
  },
  {
    icon: Users,
    title: 'Painel ou Mesa Redonda',
    desc: 'Participação estratégica em debates ou mediação especializada de painéis com convidados.',
  },
  {
    icon: Monitor,
    title: 'Presencial ou Online',
    desc: 'Atendimento presencial em todo o Brasil ou transmissão digital ao vivo em alta definição.',
  },
]

const plateias = [
  'Produtores rurais e famílias',
  'Empresários e lideranças do setor',
  'Equipes técnicas e comerciais',
  'Jovens sucessores e novas gerações',
  'Público de feiras, sindicatos e eventos do setor',
]

const passos = [
  { num: '1', title: 'Preencha o pedido', desc: 'Conte o objetivo do evento, perfil do público e o tema de interesse.' },
  { num: '2', title: 'Receba a proposta em 24h', desc: 'Formato, duração e investimento alinhados às necessidades da sua programação.' },
  { num: '3', title: 'Alinhamento & Apresentação', desc: 'Alinhamos a linguagem e os exemplos diretamente com a comissão organizadora.' },
]

const faqs = [
  {
    q: 'Quais são os formatos disponíveis de palestra?',
    a: 'Palestra principal de 45 a 60 minutos, ou participação em painéis e mesas redondas, tanto presencialmente quanto online. Para programas de imersão de meio período ou dia inteiro com exercícios práticos e ferramentas de trabalho, consulte o formato de capacitação corporativa.',
  },
  {
    q: 'Lucas Dierings atende em todo o Brasil?',
    a: 'Sim. Lucas já realizou apresentações em 5 estados (PR, MS, SC, RS e PI) presencialmente, além de convenções corporativas e transmissões online para todo o território nacional.',
  },
  {
    q: 'Como funciona o investimento e prazos?',
    a: 'O investimento varia conforme o formato, duração e logística de deslocamento. Ao preencher o formulário no site, a equipe da Fluxo Rural envia uma proposta personalizada detalhada em até 24 horas úteis.',
  },
  {
    q: 'É possível adaptar os exemplos ao perfil da minha plateia?',
    a: 'Sim, 100%. Toda apresentação passa por um alinhamento prévio para incorporar a realidade da região, o segmento dos participantes (cooperados, revendas, consultores ou produtores) e os objetivos do evento.',
  },
  {
    q: 'Com quanto tempo de antecedência é necessário solicitar a data?',
    a: 'Recomenda-se reservar a data com a maior antecedência possível para garantir a agenda de safra, mas pedidos com prazos mais curtos também são atendidos conforme a disponibilidade.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://fluxorural.com.br/palestras/#service',
  serviceType: 'Palestras sobre Agronegócio',
  name: 'Palestras de Lucas Dierings sobre Agronegócio',
  description:
    'Palestras e painéis sobre gestão, finanças, sucessão familiar, liderança, empreendedorismo e inteligência artificial no agronegócio, para cooperativas, sindicatos, empresas e eventos do agro.',
  url: 'https://fluxorural.com.br/palestras/',
  areaServed: { '@type': 'Country', name: 'Brasil' },
  provider: {
    '@type': 'Person',
    '@id': 'https://fluxorural.com.br/#lucas-dierings',
    name: 'Lucas Dierings',
    jobTitle: 'Engenheiro Agrônomo, Consultor e Palestrante',
    url: 'https://fluxorural.com.br/sobre/',
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
    <div className="bg-[#0A192F] text-slate-100 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Palestras' }]} />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-end overflow-hidden">
        <Image
          src="/lucas-palestrante-chapeu.jpg"
          alt="Lucas Dierings no palco palestrando para evento de agronegócio"
          fill
          className="object-cover object-[center_25%]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/70 to-[#0A192F]/30" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A192F]/30 to-[#0A192F]/80 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16 sm:pb-20 max-w-6xl">
          <div className="inline-flex items-center gap-2 bg-[#112240]/90 border border-[#E8B84B]/40 text-[#E8B84B] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-md shadow-sm">
            <Sparkles size={16} className="text-[#E8B84B]" />
            <span>Speaker Kit Oficial · Proposta em até 24h</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-5 max-w-3xl">
            Palestras de Alto Impacto para o Agronegócio
          </h1>

          <p className="text-slate-200 text-lg sm:text-xl font-light mb-8 max-w-2xl leading-relaxed">
            Conteúdo técnico e inspirador sobre gestão financeira, sucessão familiar, liderança e inteligência artificial para convenções corporativas, cooperativas, sindicatos e grandes eventos do setor.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
            <PedidoCTA
              label="Solicitar Proposta para meu Evento"
              servico="palestra"
              origem="hero"
              className="bg-[#6AAF3D] hover:bg-[#6AAF3D]/90 text-white min-h-[48px] h-12 px-6 rounded-xl font-semibold shadow-lg"
            />
            <PortfolioDownload
              variant="outline"
              label="Baixar Speaker Kit (PDF)"
              origem="hero"
              className="border-white/30 text-white hover:bg-white/10 min-h-[48px] h-12 px-6 rounded-xl"
            />
            <a
              href="#temas"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10 min-h-[48px] h-12 px-6 text-sm font-medium transition-colors"
            >
              Ver os 6 Temas
            </a>
          </div>
        </div>
      </section>

      {/* Credenciais / Autoridade */}
      <section className="bg-[#0D1F3C] py-12 border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {credenciais.map((c) => (
              <div
                key={c.title}
                className="bg-[#112240]/90 border border-white/10 rounded-2xl p-5 text-center hover:border-[#E8B84B]/40 transition-all duration-300 shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E8B84B]/10 border border-[#E8B84B]/20 flex items-center justify-center mx-auto mb-3">
                  <c.icon className="text-[#E8B84B]" size={22} />
                </div>
                <h3 className="font-heading font-bold text-white text-sm sm:text-base mb-1 leading-tight">
                  {c.title}
                </h3>
                <p className="text-slate-400 text-xs">{c.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Momentos no Palco (Galeria) */}
      <section className="py-20 sm:py-28 bg-[#0A192F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-[#4ADE80] text-xs uppercase font-semibold tracking-widest">
              Presença e Conexão
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1 mb-3">
              Momentos no Palco
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Palcos de feiras, plenárias de cooperativas, sindicatos rurais e empresas do agro. A mesma profundidade técnica, modulada para o tom exato de cada público.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {galeria.map((g) => (
              <div
                key={g.src}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#112240] group"
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className={`object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
                    g.src === '/palestra-somave.jpg' ? 'scale-110 origin-center' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-xs font-medium leading-snug">{g.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Temas Detalhados */}
      <section id="temas" className="py-20 sm:py-28 bg-[#0D1F3C] border-y border-white/10 scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#E8B84B] text-xs uppercase font-semibold tracking-widest">
              Catálogo Estratégico
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1 mb-3">
              Temas Disponíveis
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Palestras construídas com metodologia própria, dados de mercado e foco em aplicabilidade prática.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {temas.map((tema) => (
              <div
                key={tema.id || tema.title}
                className="bg-[#112240]/90 border border-white/10 rounded-2xl p-7 sm:p-8 flex flex-col justify-between hover:border-[#4ADE80]/40 transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(74,222,128,0.08)]"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[#E8B84B] text-xs font-semibold uppercase tracking-wider mb-2">
                    <Sparkles size={14} /> Tema de Palco
                  </div>
                  <h3 className="font-heading font-bold text-white text-xl sm:text-2xl mb-3">
                    {tema.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                    {tema.promise}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {tema.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-slate-200">
                        <CheckCircle2 className="text-[#4ADE80] shrink-0 mt-0.5" size={18} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <PedidoCTA
                    label="Quero esta palestra"
                    servico="palestra"
                    tema={tema.title}
                    variant="secondary"
                    size="default"
                    origem={tema.title}
                    className="w-full bg-[#6AAF3D] hover:bg-[#6AAF3D]/90 text-white min-h-[48px] h-12 rounded-xl font-semibold justify-center"
                  />
                  {tema.paginaPropria && (
                    <Link
                      href={tema.paginaPropria.href}
                      className="block text-[#E8B84B] hover:text-[#F0CD7A] text-xs font-medium text-center underline underline-offset-4 transition-colors"
                    >
                      {tema.paginaPropria.label} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfólio / Speaker Kit em PDF */}
      <section className="py-20 bg-[#0A192F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="bg-[#112240]/90 border border-white/10 rounded-2xl p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 shadow-2xl">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block bg-[#E8B84B]/15 text-[#E8B84B] border border-[#E8B84B]/30 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                Material para Download Imediato
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
                Deseja o Speaker Kit completo para a comissão?
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6 max-w-xl font-light">
                Baixe o portfólio em PDF com biografia completa, credenciais, grade curricular dos 6 temas de palestra, 7 treinamentos e requisitos técnicos de palco. Ideal para reuniões de diretoria e alinhamento de patrocínio.
              </p>

              <div className="flex justify-center lg:justify-start">
                <PortfolioDownload
                  label="Baixar Portfólio em PDF"
                  origem="banda-temas"
                  className="bg-[#6AAF3D] hover:bg-[#6AAF3D]/90 text-white min-h-[48px] h-12 px-6 rounded-xl font-semibold shadow-lg"
                />
              </div>
            </div>

            <div className="shrink-0">
              <div className="bg-[#0D1F3C] border border-[#E8B84B]/30 rounded-2xl w-44 h-56 sm:w-52 sm:h-64 flex flex-col items-center justify-center text-center p-5 shadow-xl group hover:border-[#E8B84B] transition-colors">
                <FileText className="text-[#E8B84B] mb-3 group-hover:scale-110 transition-transform" size={48} />
                <p className="font-heading font-bold text-white text-sm leading-tight">
                  Speaker Kit Oficial
                </p>
                <p className="text-[#4ADE80] text-xs font-semibold mt-1">Fluxo Rural · 2026</p>
                <p className="text-slate-400 text-[11px] mt-2">Palestras e Treinamentos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formatos de Apresentação */}
      <section className="py-20 sm:py-28 bg-[#0D1F3C] border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-[#4ADE80] text-xs uppercase font-semibold tracking-widest">
              Modalidades
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Formatos de Apresentação
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {formatos.map((f) => (
              <div
                key={f.title}
                className="bg-[#112240]/90 border border-white/10 rounded-2xl p-7 text-center hover:border-white/20 transition-all duration-300 shadow-lg"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#E8B84B]/10 border border-[#E8B84B]/20 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="text-[#E8B84B]" size={28} />
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#112240]/60 border border-white/10 rounded-2xl p-6 text-center max-w-2xl mx-auto">
            <p className="text-slate-300 text-sm">
              Precisa capacitar equipes com oficinas práticas em formato intensivo? Conheça nossos programas de capacitação corporativa.{' '}
              <Link
                href="/servicos/treinamentos"
                className="text-[#E8B84B] hover:text-[#F0CD7A] font-semibold underline underline-offset-4 ml-1 transition-colors"
              >
                Conheça os 7 treinamentos
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Público-Alvo */}
      <section className="py-20 bg-[#0A192F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <span className="text-[#E8B84B] text-xs uppercase font-semibold tracking-widest">
            Aderência e Conexão
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1 mb-4">
            Quem Está na Plateia
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            A contratação é corporativa, mas a mensagem é construída para quem senta na cadeira. Cada exemplo é fundamentado na vivência de quem entende o dia a dia da porteira.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {plateias.map((p) => (
              <span
                key={p}
                className="bg-[#112240] border border-white/15 text-slate-200 text-sm font-medium px-5 py-2.5 rounded-full shadow-sm hover:border-[#4ADE80]/40 transition-colors"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Como Contratar */}
      <section className="py-20 sm:py-28 bg-[#0D1F3C] border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-[#4ADE80] text-xs uppercase font-semibold tracking-widest">
              Processo Simples
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Como Contratar para seu Evento
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {passos.map((p) => (
              <div
                key={p.num}
                className="bg-[#112240]/90 border border-white/10 rounded-2xl p-7 text-center shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#6AAF3D] text-white flex items-center justify-center mx-auto mb-4 font-heading font-bold text-xl shadow-md">
                  {p.num}
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">
                  {p.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#0A192F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-[#E8B84B] text-xs uppercase font-semibold tracking-widest">
              Tire suas Dúvidas
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group bg-[#112240]/90 border border-white/10 rounded-2xl p-6 shadow-md transition-all duration-300"
              >
                <summary className="font-heading font-semibold text-white cursor-pointer list-none flex justify-between items-center gap-4 text-base sm:text-lg">
                  <span>{f.q}</span>
                  <span className="text-[#E8B84B] text-2xl group-open:rotate-45 transition-transform shrink-0">
                    +
                  </span>
                </summary>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-4 pt-4 border-t border-white/10 font-light">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final com WhatsApp & Proposta */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-[#1B4F7A] via-[#0D1F3C] to-[#153C24] border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="w-16 h-16 rounded-2xl bg-[#E8B84B]/15 border border-[#E8B84B]/30 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="text-[#E8B84B]" size={36} />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Leve uma palestra de verdade ao seu evento
          </h2>

          <p className="text-slate-200 text-base sm:text-lg font-light mb-8 max-w-xl mx-auto leading-relaxed">
            Solicite sua proposta detalhada em até 24h ou tire dúvidas diretamente com o palestrante pelo WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <PedidoCTA
              label="Solicitar Proposta (24h)"
              servico="palestra"
              origem="cta-final"
              className="bg-[#6AAF3D] hover:bg-[#6AAF3D]/90 text-white min-h-[48px] h-12 px-8 rounded-xl font-semibold shadow-lg"
            />
            <WhatsappCTA
              message="Olá Lucas! Gostaria de verificar disponibilidade para uma palestra no meu evento."
              label="Conversar pelo WhatsApp"
              origem="cta-final-palestras"
              className="bg-[#112240] border border-white/20 text-white hover:bg-[#162a4d] min-h-[48px] h-12 px-8 rounded-xl font-medium"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
