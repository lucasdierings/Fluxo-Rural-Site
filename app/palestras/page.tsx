import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Send, Sparkles, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Palestras e Workshops',
  description: 'Palestras sobre gestão, finanças, sucessão familiar e IA no agronegócio. Contrate Lucas Dierings para seu evento.',
  openGraph: {
    title: 'Palestras | Fluxo Rural Consultoria',
    description: 'Conteúdo aplicado, linguagem do campo, resultados na prática.',
  },
}

const talks = [
  { title: 'Gestão e Inovação no Agronegócio', image: '/images/gestao-blog.png', description: 'Como aplicar metodologias de gestão e inovação para aumentar a eficiência e rentabilidade no campo.' },
  { title: 'Gestão Financeira Rural na Prática', image: '/images/gestao-blog.png', description: 'Ferramentas e indicadores financeiros essenciais para a tomada de decisão no agronegócio.' },
  { title: 'Gestão como Ferramenta para Sucessão Familiar', image: '/images/sucessao-blog.png', description: 'Como a gestão profissional facilita o processo de transição geracional na propriedade rural.' },
  { title: 'Inteligência Artificial no Agronegócio', image: '/images/ia-agro-blog.png', description: 'O que já é realidade, quais ferramentas estão disponíveis e como começar a aplicar IA no campo.' },
]

const steps = [
  { icon: FileText, title: 'Preencha o formulário', description: 'Envie os detalhes do seu evento, público-alvo e tema de interesse.' },
  { icon: Send, title: 'Receba proposta personalizada em 24h', description: 'Proposta adaptada ao formato, duração e público do seu evento.' },
  { icon: Sparkles, title: 'Confirme e prepare-se', description: 'Confirme e prepare-se para um evento transformador.' },
]

export default function PalestrasPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[500px] flex items-end">
        <Image src="/images/lucas-posse.jpg" alt="Lucas Dierings em evento formal" fill className="object-cover object-top" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Palestras e Workshops</h1>
          <p className="text-white/80 text-xl">Conteúdo aplicado, linguagem do campo, resultados na prática.</p>
        </div>
      </section>

      {/* YouTube placeholder */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="bg-navy/5 rounded-2xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <p className="text-navy/50 text-lg font-medium">Video Reel em Breve</p>
              <p className="text-navy/30 text-sm mt-2">Destaques das palestras e eventos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Temas */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-14">Temas Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {talks.map((talk) => (
              <div key={talk.title} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={talk.image} alt={talk.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-navy text-lg mb-2">{talk.title}</h3>
                  <p className="text-carvao/60 text-sm leading-relaxed">{talk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-80 rounded-xl overflow-hidden">
              <Image src="/images/lucas-podcast.jpg" alt="Lucas no Agrojovem Podcast" fill className="object-cover" />
            </div>
            <div>
              <span className="bg-dourado text-carvao text-xs font-semibold px-3 py-1 rounded-full">Podcast</span>
              <h2 className="font-heading text-2xl font-bold text-navy mt-3 mb-4">Agrojovem Podcast</h2>
              <p className="text-carvao/70 leading-relaxed">
                Compartilhando conhecimento com produtores de todo o Brasil. Conversas sobre gestão, inovação, finanças e o futuro do agronegócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="relative h-64 rounded-2xl overflow-hidden">
            <Image src="/images/lucas-banner.png" alt="Lucas Dierings em diferentes contextos" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Como contratar */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-14">Como Contratar</h2>
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

      {/* CTA */}
      <section className="bg-navy py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-6">Solicitar Orçamento para Palestra</h2>
          <p className="text-white/80 text-lg mb-8">Conteúdo personalizado para o seu evento e público.</p>
          <Button asChild size="lg">
            <Link href="/contato">Solicitar Orçamento <ArrowRight className="ml-2" size={18} /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
