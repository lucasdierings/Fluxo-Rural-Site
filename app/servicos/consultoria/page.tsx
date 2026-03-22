import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Search, FileText, Cog, TrendingUp, Check, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Consultoria em Gestão e Inovação',
  description: 'Diagnóstico, planejamento estratégico e acompanhamento para propriedades e empresas do agronegócio. Consultoria com Lucas Dierings em Londrina, PR.',
}

const phases = [
  { icon: Search, title: 'Diagnóstico', description: 'Análise completa da situação atual da propriedade ou empresa.' },
  { icon: FileText, title: 'Plano de Ação', description: 'Planejamento estratégico personalizado com metas claras.' },
  { icon: Cog, title: 'Implementação', description: 'Acompanhamento na execução das ações planejadas.' },
  { icon: TrendingUp, title: 'Resultados', description: 'Mensuração e ajustes para melhoria contínua.' },
]

const results = [
  'Visão clara da situação financeira e operacional',
  'Planejamento estratégico documentado e prático',
  'Processos otimizados e indicadores de desempenho',
  'Tomada de decisão baseada em dados e análise',
  'Aumento de eficiência e rentabilidade',
]

const faqs = [
  { q: 'Para quem é a consultoria?', a: 'Para produtores rurais, gestores de propriedades, empresas do agronegócio e cooperativas que buscam melhorar sua gestão e resultados.' },
  { q: 'Qual a duração do processo?', a: 'Depende da complexidade do projeto. Geralmente entre 3 e 12 meses, com reuniões periódicas de acompanhamento.' },
  { q: 'A consultoria é presencial ou online?', a: 'Pode ser presencial, online ou híbrida, dependendo da localização e das necessidades do cliente.' },
  { q: 'Quais resultados posso esperar?', a: 'Mais organização, clareza financeira, processos definidos, indicadores de desempenho e aumento da rentabilidade.' },
  { q: 'Como é o primeiro passo?', a: 'Entre em contato para uma conversa inicial gratuita. Vamos entender sua situação e propor o melhor caminho.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Consultoria em Gestão e Inovação no Agronegócio',
  provider: { '@type': 'Person', name: 'Lucas Dierings' },
  areaServed: { '@type': 'Country', name: 'Brasil' },
  description: 'Diagnóstico, planejamento estratégico e acompanhamento para propriedades e empresas do agronegócio.',
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

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image src="/images/gestao-blog.png" alt="Consultoria em gestão no agronegócio" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Consultoria em Gestão e Inovação no Agronegócio
          </h1>
          <p className="text-white/80 text-xl">Para produtores rurais, gestores e empresas do agro</p>
        </div>
      </section>

      {/* Fases */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-14">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {phases.map((phase, i) => (
              <div key={phase.title} className="text-center">
                <div className="bg-navy/5 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
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

      {/* Resultados */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-10">Resultados Esperados</h2>
          <div className="space-y-4">
            {results.map((r) => (
              <div key={r} className="flex items-start gap-3 bg-white p-4 rounded-xl">
                <Check className="text-verde-folha mt-0.5 flex-shrink-0" size={20} />
                <span className="text-carvao/80">{r}</span>
              </div>
            ))}
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

      {/* CTA */}
      <section className="bg-verde-folha py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-6">Solicitar Proposta</h2>
          <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">Vamos entender a sua realidade e montar um plano estratégico para o seu negócio.</p>
          <Button asChild size="lg" className="bg-white text-verde-escuro hover:bg-white/90">
            <Link href="/contato">Solicitar Proposta <ArrowRight className="ml-2" size={18} /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
