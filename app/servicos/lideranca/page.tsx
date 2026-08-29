import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Users,
  Rocket,
  Mic,
  Check,
  ArrowRight,
  MessageSquare,
  Lightbulb,
  LineChart,
  GraduationCap,
  Compass,
  Brain,
  Globe,
  Award,
  Video,
} from 'lucide-react'
import Breadcrumbs from '@/components/ui/breadcrumbs'
import { PortfolioDownload } from '@/components/palestras/PortfolioDownload'

export const metadata: Metadata = {
  alternates: { canonical: '/servicos/lideranca/' },
  title: 'Liderança e Empreendedorismo no Agronegócio',
  description:
    'Workshop de liderança, palestras de empreendedorismo e inovação no agronegócio e consultoria individual on-line para produtores. Um novo modelo de liderança para o agro - com Lucas Dierings, Destaque Nacional CNA Jovem.',
  openGraph: {
    title: 'Liderança e Empreendedorismo no Agro | Fluxo Rural',
    description:
      'Se nem os filhos querem ficar na propriedade, imagina os funcionários. O modelo antigo de liderança acabou - forme o novo.',
    images: [{ url: '/images/lucas-discurso-jci.jpg' }],
  },
}

// O novo modelo de liderança - tese proprietária da página (GEO)
const novoModelo = [
  { icon: MessageSquare, title: 'Comunicação', description: 'Falar de um jeito que a equipe e a família entendem - e escutam.' },
  { icon: Rocket, title: 'Empreendedorismo', description: 'Mentalidade de dono: enxergar e agarrar oportunidades antes dos outros.' },
  { icon: Lightbulb, title: 'Inovação', description: 'Testar, errar barato e adotar o que funciona - sem modismo.' },
  { icon: LineChart, title: 'Visão de negócios', description: 'A fazenda como empresa: gestão, administração e números na mesa.' },
  { icon: GraduationCap, title: 'Aprender a aprender', description: 'O agro muda rápido. Quem aprende mais rápido, lidera.' },
  { icon: Compass, title: 'Propósito', description: 'Gente boa fica onde existe um porquê - não só um salário.' },
  { icon: Users, title: 'Sucessão e dinâmicas de poder', description: 'Preparar a próxima geração e dividir o poder sem rachar a família.' },
  { icon: Brain, title: 'Inteligência emocional', description: 'Liderar sob pressão de safra, clima e mercado sem queimar as pessoas.' },
  { icon: Globe, title: 'Visão global, ação local', description: 'Entender o mundo que move os preços - e agir na sua porteira.' },
]

const oferta = [
  {
    icon: Users,
    tipo: 'Workshop',
    title: 'Liderança no Agronegócio',
    description:
      'Imersão prática com metodologia de aprendizado pela ação (base JCI): comunicação eficaz, delegação, feedback, dinâmicas de poder e formação de líderes na propriedade.',
  },
  {
    icon: Rocket,
    tipo: 'Palestra',
    title: 'Empreendedorismo e Inovação no Agronegócio',
    description:
      'Mentalidade empreendedora aplicada ao campo: identificar oportunidades, tirar ideias do papel e inovar sem apostar a fazenda. Palestra já rodada em eventos do agro.',
  },
  {
    icon: Mic,
    tipo: 'Palestra',
    title: 'Liderança Eficaz no Agronegócio',
    description:
      'O novo modelo de liderança: por que o comando-e-controle da porteira não segura mais ninguém - e o que fazer no lugar para atrair e manter gente boa.',
  },
]

const deliverables = [
  'Diagnóstico prévio do público e do evento',
  'Conteúdo sob medida - dores reais da sua região e cultura',
  'Dinâmicas práticas de aprendizado pela ação',
  'Material de apoio pós-evento',
  'Plano de ação individual dos participantes',
  'Presencial em todo o Brasil ou on-line',
]

const faqs = [
  {
    q: 'Para quem são as palestras e o workshop?',
    a: 'Cooperativas, sindicatos rurais, associações, eventos do agro, empresas do setor e famílias rurais que querem preparar líderes - da porteira pra dentro e pra fora. O conteúdo é adaptado ao público de cada evento.',
  },
  {
    q: 'Qual a diferença para um treinamento corporativo genérico?',
    a: 'O modelo antigo de liderança do agro não funciona mais - e as metodologias corporativas batidas também não. O conteúdo nasce da vivência real: formação na JCI (escola global de líderes), Destaque Nacional CNA Jovem e anos de consultoria dentro de propriedades rurais. É liderança falada na língua do agro, com os números da fazenda na mesa.',
  },
  {
    q: 'Como isso ajuda na sucessão familiar?',
    a: 'Sucessão é, antes de tudo, um problema de liderança: menos de 7% das propriedades chegam à terceira geração. O trabalho aborda dinâmicas de poder, comunicação entre gerações e preparação do sucessor para liderar - não só para herdar.',
  },
  {
    q: 'Como contratar para meu evento? E a consultoria individual?',
    a: 'Para palestras e workshops, entre em contato pelo formulário ou WhatsApp e solicite o mídia kit - proposta em até 24h. Para produtores que querem aplicar o conteúdo na própria propriedade, há consultoria individual 100% on-line, de onde você estiver.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Liderança e Empreendedorismo no Agronegócio',
  provider: { '@type': 'Person', name: 'Lucas Dierings' },
  areaServed: { '@type': 'Country', name: 'Brasil' },
  description:
    'Workshop de liderança, palestras de empreendedorismo e inovação no agronegócio e consultoria individual on-line para produtores rurais.',
  url: 'https://fluxorural.com.br/servicos/lideranca/',
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

export default function LiderancaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Serviços', href: '/servicos' }, { label: 'Liderança e Empreendedorismo' }]} />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image
          src="/images/lucas-discurso-jci.jpg"
          alt="Lucas Dierings discursando na JCI - liderança e empreendedorismo no agronegócio"
          fill
          className="object-cover object-[center_25%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Liderança e Empreendedorismo no Agro
          </h1>
          <p className="text-white/80 text-xl max-w-3xl">
            Se nem os filhos querem ficar na propriedade, imagina os funcionários. O modelo antigo de liderança acabou - forme o novo.
          </p>
        </div>
      </section>

      {/* Crença / manifesto */}
      <section className="bg-off-white py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <p className="font-heading text-2xl md:text-3xl font-bold text-navy mb-3">
            Não é apagão de mão de obra. É apagão de liderança.
          </p>
          <p className="text-carvao/70 text-lg leading-relaxed">
            As pessoas não desapareceram - elas só não aceitam mais trabalhar em ambientes mal liderados.
            O grito da porteira não segura equipe, e o corporativês batido de treinamento genérico não convence o campo.
            Não é só política que determina o futuro da propriedade: é a liderança de quem está à frente dela.
          </p>
        </div>
      </section>

      {/* O novo modelo */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-4">O Novo Modelo de Liderança no Agro</h2>
          <p className="text-carvao/60 text-center max-w-2xl mx-auto mb-14">
            Liderar no agro de hoje exige um conjunto novo de competências - e todas se aprendem na prática.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {novoModelo.map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-off-white rounded-xl p-5">
                <div className="bg-navy/5 w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-navy" size={22} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-navy">{item.title}</h3>
                  <p className="text-carvao/60 text-sm mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oferta */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-14">Como Levar Isso Para o Seu Evento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {oferta.map((o) => (
              <div key={o.title} className="bg-white rounded-2xl p-8 shadow-sm text-center flex flex-col">
                <div className="bg-navy/5 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <o.icon className="text-navy" size={28} />
                </div>
                <span className="text-dourado font-bold text-sm uppercase tracking-wide">{o.tipo}</span>
                <h3 className="font-heading font-bold text-navy text-lg mt-1 mb-3">{o.title}</h3>
                <p className="text-carvao/60 text-sm leading-relaxed">{o.description}</p>
              </div>
            ))}
          </div>
          <p className="text-carvao/60 text-sm text-center mt-12 max-w-2xl mx-auto">
            As duas palestras acima estão no catálogo completo de{' '}
            <Link href="/palestras" className="text-navy font-semibold hover:text-dourado underline">
              temas de palco
            </Link>
            , e o workshop é um dos{' '}
            <Link
              href="/servicos/treinamentos"
              className="text-navy font-semibold hover:text-dourado underline"
            >
              treinamentos in-company
            </Link>
            , disponível em 4h ou 8h.
          </p>
        </div>
      </section>

      {/* Credibilidade */}
      <section className="py-20 bg-navy">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 className="font-heading text-3xl font-bold text-white text-center mb-4">Quem Ensina Viveu Isso</h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
            Liderança não se aprende em slide - se aprende liderando. As credenciais por trás do conteúdo:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="bg-dourado/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Globe className="text-dourado" size={24} />
              </div>
              <h3 className="font-heading font-bold text-white text-xl mb-3">JCI - Junior Chamber International</h3>
              <p className="text-white/70 leading-relaxed">
                Escola global de líderes presente em mais de 100 países, onde jovens de 18 a 40 anos se formam liderando
                na prática - a metodologia do aprendizado pela ação, nas áreas individual, negócios, comunidade e
                cooperação internacional. É a base das dinâmicas usadas nos workshops.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="bg-dourado/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Award className="text-dourado" size={24} />
              </div>
              <h3 className="font-heading font-bold text-white text-xl mb-3">Destaque Nacional CNA Jovem</h3>
              <p className="text-white/70 leading-relaxed">
                Programa nacional de formação de jovens líderes do agro do Sistema CNA/SENAR. Lucas foi um dos 5
                vencedores nacionais em 2021 - reconhecimento de quem lidera
                dentro do setor, não de fora dele.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Entregáveis */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-10">O que está incluído</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <span className="bg-verde-folha/15 text-verde-folha rounded-full p-1 mt-0.5 flex-shrink-0">
                  <Check size={16} />
                </span>
                <span className="text-carvao/70">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Consultoria individual */}
      <section className="py-16 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="bg-verde-folha/10 w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0">
              <Video className="text-verde-folha" size={28} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-heading text-2xl font-bold text-navy mb-2">Quer aplicar isso na sua propriedade?</h2>
              <p className="text-carvao/60">
                Para produtores e sucessores que querem desenvolver a própria liderança e a visão de negócio:
                consultoria individual <strong>100% on-line</strong> - de onde você estiver.
              </p>
            </div>
            <Button asChild size="lg" className="flex-shrink-0">
              <Link href="/contato">Quero consultoria <ArrowRight className="ml-2" size={18} /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-10">Perguntas Frequentes</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-off-white rounded-xl px-6 border-none">
                <AccordionTrigger className="text-left text-navy">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-carvao/70">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-verde-escuro py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-6">Quero levar esse conteúdo pro meu evento</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Cooperativa, sindicato, empresa ou encontro de produtores: me conta o contexto e eu retorno com proposta em até 24h.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-dourado text-carvao hover:bg-dourado/90">
              <Link href="/contato">Falar com o Lucas <ArrowRight className="ml-2" size={18} /></Link>
            </Button>
            <PortfolioDownload
              variant="outline"
              label="Baixar portfólio"
              origem="lideranca"
              formLocation="lideranca"
              className="border-white/30 text-white hover:bg-white/10"
            />
          </div>
        </div>
      </section>
    </>
  )
}
