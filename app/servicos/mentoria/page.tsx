import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageSquare, FileCheck, Handshake, ArrowRight, Quote } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mentoria para Sucessão Familiar',
  description: 'Programa de mentoria para planejar e executar a transição geracional na propriedade rural com segurança e clareza.',
}

const steps = [
  { icon: MessageSquare, title: 'Conversa Inicial', description: 'Entendemos a dinâmica da família, os desafios e as expectativas de cada membro envolvido.' },
  { icon: FileCheck, title: 'Plano de Sucessão', description: 'Construímos juntos um plano estruturado de transição com papéis claros, cronograma e metas.' },
  { icon: Handshake, title: 'Acompanhamento', description: 'Sessões periódicas para guiar a implementação, resolver conflitos e ajustar o plano conforme necessário.' },
]

const testimonials = [
  { text: 'A mentoria nos ajudou a ter conversas que evitávamos há anos. Hoje a família está alinhada e o futuro da fazenda está planejado.', name: 'Família P.', role: 'Propriedade em Uberaba, MG' },
  { text: 'Lucas conduziu o processo com sensibilidade e profissionalismo. Sabíamos que precisávamos planejar a sucessão, mas não sabíamos como começar.', name: 'Família T.', role: 'Propriedade em Cascavel, PR' },
]

export default function MentoriaPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image src="/images/sucessao-blog.png" alt="Pai e filho na fazenda ao pôr do sol" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Mentoria para Gestão e Sucessão Familiar</h1>
          <p className="text-white/80 text-xl">Planeje a transição geracional com segurança e clareza</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <p className="text-carvao/70 text-lg leading-relaxed text-center max-w-3xl mx-auto mb-14">
            A sucessão familiar é um dos maiores desafios do agronegócio brasileiro. Mais de 70% das propriedades não sobrevivem à segunda geração — não por falta de capacidade, mas por falta de planejamento. A mentoria da Fluxo Rural ajuda famílias a conduzirem esse processo com estrutura, diálogo e visão de futuro.
          </p>

          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-10">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center p-6">
                <div className="bg-navy/5 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="text-navy" size={28} />
                </div>
                <span className="text-dourado font-bold text-sm">Passo {i + 1}</span>
                <h3 className="font-heading font-bold text-navy text-lg mt-1 mb-2">{step.title}</h3>
                <p className="text-carvao/60 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-10">O que Dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-6 shadow-sm">
                <Quote className="text-dourado mb-3" size={24} />
                <p className="text-carvao/70 leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-navy">{t.name}</p>
                <p className="text-carvao/50 text-sm">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-verde-escuro py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-6">Quero Iniciar Minha Mentoria</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">O primeiro passo é uma conversa. Vamos entender a realidade da sua família e traçar o melhor caminho.</p>
          <Button asChild size="lg" className="bg-dourado text-carvao hover:bg-dourado/90">
            <Link href="/contato">Iniciar Mentoria <ArrowRight className="ml-2" size={18} /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
