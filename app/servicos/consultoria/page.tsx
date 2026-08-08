import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Search,
  Map,
  Wallet,
  PieChart,
  LineChart,
  Landmark,
  FileSpreadsheet,
  Cog,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import Breadcrumbs from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  alternates: { canonical: '/servicos/consultoria/' },
  title: 'Consultoria em Gestão Rural',
  description:
    'Diagnóstico, planejamento estratégico, gestão financeira, análise de rentabilidade e projetos de custeio e investimento agropecuários para produtores rurais. Com Lucas Dierings, engenheiro agrônomo e MBA USP/ESALQ.',
  openGraph: {
    title: 'Consultoria em Gestão Rural | Fluxo Rural',
    description:
      'Clareza dos números e direção para a propriedade: diagnóstico, planejamento, rentabilidade e projetos de custeio e investimento.',
    images: [{ url: '/images/gestao-rural-blog.jpg' }],
  },
}

// As frentes que a consultoria cobre. A oferta é ampla de propósito. O que o
// diagnóstico faz é definir a ordem: quais passos seguir e o que priorizar.
const frentes = [
  {
    icon: Search,
    title: 'Diagnóstico',
    desc: 'Leitura completa do negócio: estrutura familiar, modelo de negócio, situação financeira e o futuro que a propriedade está construindo.',
  },
  {
    icon: Map,
    title: 'Planejamento estratégico',
    desc: 'Para onde a propriedade vai nos próximos anos, com metas escritas e prioridade definida.',
  },
  {
    icon: Wallet,
    title: 'Gestão financeira',
    desc: 'Organização da gestão com reuniões mensais, presenciais ou online: DRE, previsão de fluxo de caixa, balanço patrimonial e planejamento.',
  },
  {
    icon: PieChart,
    title: 'Análise de rentabilidade',
    desc: 'Apuração de margem e retorno por negócio e por cultura, com custo por hectare e por saca, para comparar atividades em base técnica.',
  },
  {
    icon: LineChart,
    title: 'Avaliação de resultados',
    desc: 'Indicadores acompanhados safra a safra, comparando o que foi planejado com o que aconteceu.',
  },
  {
    icon: Landmark,
    title: 'Avaliação de investimento',
    desc: 'Máquina, terra ou benfeitoria: se o retorno paga a conta e se o caixa suporta a parcela.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Projetos de custeio e investimento agropecuários',
    desc: 'Estruturação técnica e financeira do projeto para levar ao banco, com os números organizados e defensáveis.',
  },
]

const phases = [
  {
    icon: Search,
    title: 'Diagnóstico',
    description: 'Levantamento completo da situação atual da propriedade.',
  },
  {
    icon: Map,
    title: 'Planejamento',
    description: 'Definição de prioridades e metas a partir do que o diagnóstico mostrou.',
  },
  {
    icon: Cog,
    title: 'Implementação',
    description: 'Acompanhamento na execução, com ajuste de rota quando a safra pede.',
  },
  {
    icon: TrendingUp,
    title: 'Resultados',
    description: 'Mensuração do que mudou e definição do próximo ciclo.',
  },
]

const faqs = [
  {
    q: 'Para quem é a consultoria?',
    a: 'Para produtores rurais e famílias que tocam a propriedade e querem gestão profissional, independente do tamanho da área. Se você procura capacitação para um grupo ou conteúdo para um evento, o caminho é treinamentos ou palestras.',
  },
  {
    q: 'Preciso ter contador para contratar?',
    a: 'Não. O trabalho é de gestão gerencial, não contábil. A linguagem é a do campo, sem complicação fiscal, e o que sai daqui conversa com o seu contador em vez de concorrer com ele.',
  },
  {
    q: 'Serve para propriedade pequena?',
    a: 'Sim. Gestão financeira é essencial em qualquer escala, e a metodologia se adapta à realidade de cada propriedade. Área pequena costuma ter menos margem para errar, não mais.',
  },
  {
    q: 'Qual a duração do processo?',
    a: 'Depende da complexidade. Normalmente entre 3 e 12 meses, com encontros periódicos de acompanhamento. Em 30 dias já dá para ter a visão clara da situação financeira.',
  },
  {
    q: 'É presencial ou on-line?',
    a: 'Presencial, on-line ou híbrido, conforme a localização e a necessidade. Boa parte do acompanhamento funciona bem por chamada de vídeo.',
  },
  {
    q: 'Preciso de algum software específico?',
    a: 'Não necessariamente. Dá para começar com planilha e evoluir para ferramenta mais completa quando a operação pedir.',
  },
  {
    q: 'Como é o primeiro passo?',
    a: 'Pelo diagnóstico gratuito. São poucas perguntas e é ele que mostra qual das frentes faz sentido atacar primeiro no seu caso.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Consultoria em Gestão Rural',
  provider: { '@type': 'Person', name: 'Lucas Dierings' },
  areaServed: { '@type': 'Country', name: 'Brasil' },
  description:
    'Diagnóstico, planejamento estratégico, gestão financeira, análise de rentabilidade, avaliação de investimento e projetos de custeio e investimento agropecuários para produtores rurais.',
  url: 'https://fluxorural.com.br/servicos/consultoria/',
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

export default function ConsultoriaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Serviços', href: '/servicos' },
          { label: 'Consultoria em Gestão Rural' },
        ]}
      />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image
          src="/images/gestao-rural-blog.jpg"
          alt="Consultoria em gestão rural para produtores"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Consultoria em Gestão Rural
          </h1>
          <p className="text-white/85 text-lg md:text-xl max-w-2xl font-light">
            Para o produtor que quer decidir com número na mão. De reuniões mensais à apuração exata da rentabilidade por negócio e cultura.
          </p>
        </div>
      </section>

      {/* Crença */}
      <section className="bg-off-white py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <p className="font-heading text-2xl md:text-3xl font-bold text-navy mb-3">
            Direção antes de velocidade.
          </p>
          <p className="text-carvao/70 text-lg leading-relaxed">
            Não adianta correr na direção errada. Antes de acelerar, a gente acerta o rumo, com
            diagnóstico, planejamento e os números na mesa.
          </p>
        </div>
      </section>

      {/* As frentes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
              O que a consultoria cobre
            </h2>
            <p className="text-carvao/70">
              A propriedade bem gerida trabalha todas essas frentes. O diagnóstico é o que define a
              ordem: quais passos seguir primeiro e o que pode esperar a próxima safra.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {frentes.map((f) => (
              <div
                key={f.title}
                className="bg-off-white rounded-2xl p-6 border border-navy/5 hover:border-dourado/30 hover:shadow-sm transition-all"
              >
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <f.icon className="text-navy" size={22} />
                </div>
                <h3 className="font-heading font-bold text-navy text-base mb-2 leading-snug">
                  {f.title}
                </h3>
                <p className="text-carvao/65 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-14">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {phases.map((phase, i) => (
              <div key={phase.title} className="text-center">
                <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <phase.icon className="text-navy" size={28} />
                </div>
                <span className="text-dourado font-bold text-sm">Fase {i + 1}</span>
                <h3 className="font-heading font-bold text-navy text-lg mt-1 mb-2">{phase.title}</h3>
                <p className="text-carvao/60 text-sm">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-10">
            Perguntas Frequentes
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-off-white rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="text-left text-navy">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-carvao/70">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-verde-folha py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Comece pelo diagnóstico
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
            São poucas perguntas e é gratuito. No fim você recebe a leitura da situação da sua
            propriedade e a indicação de por onde começar.
          </p>
          <Button asChild size="lg" className="bg-white text-verde-escuro hover:bg-white/90">
            <Link href="/diagnostico">
              Fazer diagnóstico gratuito <ArrowRight className="ml-2" size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
