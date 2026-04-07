import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Check, ArrowRight } from 'lucide-react'
import Breadcrumbs from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  title: 'Gestão Financeira Rural',
  description: 'Fluxo de caixa, custos operacionais e análise de rentabilidade de safra. Gestão financeira rural com Lucas Dierings — Fluxo Rural Consultoria.',
  openGraph: {
    title: 'Gestão Financeira Rural | Fluxo Rural',
    description: 'Clareza financeira para decisões mais seguras no campo. Fluxo de caixa, custos e rentabilidade.',
    images: [{ url: '/images/gestao-blog.png' }],
  },
}

const includes = [
  'Diagnóstico financeiro da propriedade',
  'Estruturação de fluxo de caixa rural',
  'Levantamento e controle de custos operacionais',
  'Análise de rentabilidade por cultura/safra',
  'Indicadores de desempenho financeiro (KPIs)',
  'Relatórios gerenciais para tomada de decisão',
]

const faqs = [
  { q: 'Preciso ter um contador para contratar esse serviço?', a: 'Não. O serviço é focado em gestão gerencial, não contábil. Trabalhamos com linguagem prática do campo, sem complicações fiscais.' },
  { q: 'Serve para pequenos produtores?', a: 'Sim. A gestão financeira é essencial independente do tamanho da propriedade. Adaptamos a metodologia para cada realidade.' },
  { q: 'Como funciona na prática?', a: 'Começamos com um diagnóstico financeiro completo, depois estruturamos ferramentas e processos para você ter controle total dos números.' },
  { q: 'Quanto tempo leva para ver resultados?', a: 'Com 30 dias já é possível ter uma visão clara da situação financeira. Resultados de otimização aparecem ao longo das primeiras safras acompanhadas.' },
  { q: 'Preciso de algum software específico?', a: 'Não necessariamente. Podemos começar com planilhas simples e evoluir para ferramentas mais completas conforme a necessidade.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Gestão Financeira Rural',
  provider: { '@type': 'Person', name: 'Lucas Dierings' },
  description: 'Clareza financeira para decisões mais seguras no campo.',
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

export default function FinanceiroPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Serviços', href: '/servicos' }, { label: 'Gestão Financeira' }]} />
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image src="/images/gestao-blog.png" alt="Gestão financeira rural" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Gestão Financeira Rural</h1>
          <p className="text-white/80 text-xl">Clareza financeira para decisões mais seguras no campo</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy mb-4">Para quem é</h2>
              <p className="text-carvao/70 leading-relaxed">
                Produtores e gestores rurais que precisam ter controle real dos números da propriedade — fluxo de caixa, custos, margens e rentabilidade por safra.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy mb-4">Diferencial</h2>
              <p className="text-carvao/70 leading-relaxed">
                Metodologia desenvolvida especificamente para o agronegócio — sem complicações contábeis, com foco em decisões práticas e resultados no campo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-10">O que Inclui</h2>
          <div className="space-y-4">
            {includes.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white p-4 rounded-xl">
                <Check className="text-verde-folha mt-0.5 flex-shrink-0" size={20} />
                <span className="text-carvao/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <section className="bg-dourado py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-carvao mb-6">Solicitar Diagnóstico Financeiro</h2>
          <p className="text-carvao/70 text-lg mb-8 max-w-xl mx-auto">O primeiro passo para ter clareza dos seus números no campo.</p>
          <Button asChild size="lg" className="bg-navy text-white hover:bg-navy/90">
            <Link href="/contato">Solicitar Diagnóstico <ArrowRight className="ml-2" size={18} /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
