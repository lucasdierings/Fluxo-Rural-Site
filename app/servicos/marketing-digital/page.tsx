import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Target, Megaphone, TrendingUp, Check, ArrowRight } from 'lucide-react'
import Breadcrumbs from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  title: 'Marketing e Vendas Digitais no Agronegócio',
  description: 'Consultoria em marketing e vendas digitais para produtores e empresas do agronegócio: posicionamento de marca, geração de leads e funil de vendas para atrair clientes e vender mais.',
  openGraph: {
    title: 'Marketing e Vendas Digitais no Agronegócio | Fluxo Rural',
    description: 'Posicionamento, presença digital e funil de vendas para o agro vender mais — sem depender só da indicação.',
    images: [{ url: '/images/lucas-palestrante.jpg' }],
  },
}

const pillars = [
  { icon: Target, title: 'Posicionamento & Presença Digital', description: 'Construímos uma marca clara e profissional no digital — site, redes e conteúdo que comunicam autoridade e geram confiança.' },
  { icon: Megaphone, title: 'Geração de Demanda', description: 'Estratégia de conteúdo e tráfego para atrair o público certo — produtores, clientes ou parceiros — e gerar leads qualificados de forma consistente.' },
  { icon: TrendingUp, title: 'Funil de Vendas & Conversão', description: 'Estruturamos a jornada do primeiro contato até a venda, com processo, mensagens e acompanhamento para transformar interesse em resultado.' },
]

const deliverables = [
  'Diagnóstico da presença digital atual e dos concorrentes',
  'Definição de posicionamento, público-alvo e proposta de valor',
  'Plano de conteúdo e calendário editorial para redes sociais',
  'Estruturação de campanhas de tráfego e geração de leads',
  'Montagem do funil de vendas e fluxo de atendimento',
  'Indicadores e acompanhamento de resultados (ROI)',
]

export default function MarketingDigitalPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Serviços', href: '/servicos' }, { label: 'Marketing e Vendas Digitais' }]} />
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image src="/images/lucas-palestrante.jpg" alt="Lucas Dierings — Marketing e vendas digitais no agronegócio" fill className="object-cover object-[center_30%]" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Marketing e Vendas Digitais no Agronegócio</h1>
          <p className="text-white/80 text-xl">Posicione sua marca, atraia clientes e venda mais — sem depender só da indicação</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <p className="text-carvao/70 text-lg leading-relaxed text-center max-w-3xl mx-auto mb-14">
            No agro, muita gente tem um produto ou serviço excelente — mas continua invisível no digital, dependendo só do boca a boca. Produtores e empresas que aprendem a se posicionar, gerar demanda e estruturar vendas online saem na frente. A Fluxo Rural ajuda você a transformar presença digital em clientes e faturamento.
          </p>

          <h2 className="font-heading text-3xl font-bold text-navy text-center mb-10">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p, i) => (
              <div key={p.title} className="text-center p-6">
                <div className="bg-navy/5 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <p.icon className="text-navy" size={28} />
                </div>
                <span className="text-dourado font-bold text-sm">Pilar {i + 1}</span>
                <h3 className="font-heading font-bold text-navy text-lg mt-1 mb-2">{p.title}</h3>
                <p className="text-carvao/60 text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-off-white">
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
          <p className="text-carvao/50 text-sm text-center mt-10 max-w-2xl mx-auto">
            Para produtores rurais e empresas do agro — cada projeto é montado sob medida para a sua realidade e o seu momento.
          </p>
        </div>
      </section>

      <section className="bg-verde-escuro py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-6">Quero vender mais no digital</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">O primeiro passo é uma conversa. Vamos entender o seu negócio e desenhar a estratégia digital que faz sentido pra você.</p>
          <Button asChild size="lg" className="bg-dourado text-carvao hover:bg-dourado/90">
            <Link href="/contato">Falar com o Lucas <ArrowRight className="ml-2" size={18} /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
