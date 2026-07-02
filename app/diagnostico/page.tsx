import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, Clock, CalendarCheck, FileText, Shield, Monitor, MapPin, ArrowRight } from 'lucide-react'
import { DiagnosticoForm } from '@/components/forms/DiagnosticoForm'

export const metadata: Metadata = {
  title: 'Diagnóstico Gratuito para o Agro | Fluxo Rural',
  description: '30 minutos para descobrir onde sua gestão, marketing e vendas perdem resultado — para produtores rurais e empresas do agro. Você sai com um plano de ação de 90 dias. Sem compromisso.',
  openGraph: {
    title: 'Diagnóstico Gratuito | Fluxo Rural Consultoria',
    description: 'Diagnóstico gratuito de 30 minutos para produtores rurais e empresas do agronegócio. Plano de ação de 90 dias, sem compromisso.',
    images: [{ url: '/og-image.png' }],
  },
}

const benefits = [
  { emoji: '📊', title: 'Análise personalizada', desc: 'Uma leitura da gestão do seu negócio no agro, feita sobre as suas respostas — não um modelo genérico' },
  { emoji: '🎯', title: 'Gargalos identificados', desc: 'Onde você perde dinheiro, clientes ou eficiência — e por onde começar a corrigir' },
  { emoji: '📅', title: 'Plano de ação de 90 dias', desc: 'Você sai da conversa com próximos passos concretos para os próximos 3 meses' },
  { emoji: '✨', title: 'Recomendações reais', desc: 'Baseadas em dados e em experiência de campo com produtores e empresas do agro' },
]

const audience = [
  'Produtores rurais que querem organizar as finanças',
  'Famílias em processo de sucessão',
  'Revendas, cooperativas e empresas do agro que querem vender mais',
  'Negócios do agro que dependem só de indicação e querem estruturar marketing e vendas',
  'Quem sente que poderia ter mais resultado com o que já tem',
]

const steps = [
  { num: '1', title: 'Preencha o diagnóstico', desc: 'Leva menos de 3 minutos', icon: FileText },
  { num: '2', title: 'Agendamos a sua sessão', desc: 'Entramos em contato em até 24h', icon: Clock },
  { num: '3', title: 'Receba seu plano de ação', desc: 'Na sessão de 30 minutos', icon: CalendarCheck },
]

const credenciais = [
  'Engenheiro Agrônomo (CREA-PR 179906/D)',
  'MBA em Agronegócios pela USP/ESALQ e professor de MBA',
  'Top 5 nacional no CNA Jovem 2021 (entre 3.742 projetos)',
  'Host do NHCast (New Holland) — 7 anos no mercado de gestão rural, em 24 estados',
]

const faqs = [
  { q: 'Quanto custa o diagnóstico?', a: 'Completamente gratuito. Sem taxas, sem compromisso.' },
  { q: 'Preciso contratar algo depois?', a: 'Não. O diagnóstico é 100% independente. Se fizer sentido, podemos conversar sobre consultoria, mas não há obrigação.' },
  { q: 'Quanto tempo leva a sessão?', a: '30 minutos focados e objetivos. Você sai com um plano claro.' },
  { q: 'Como funciona o agendamento?', a: 'Você preenche o formulário e nós entramos em contato em até 24h para marcar o melhor dia e horário. A conversa é por vídeo, de onde você estiver.' },
  { q: 'Funciona pra empresa, não só produtor?', a: 'Sim. Você escolhe no início se é produtor rural ou empresa do agro, e as perguntas se adaptam ao seu caso.' },
]

export default function DiagnosticoPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy via-navy/95 to-verde-escuro text-white pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <span className="inline-block bg-verde-folha/90 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Gratuito · 30 minutos · Sem compromisso
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            Descubra os Gargalos que Travam o Resultado do seu Agro
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            Em 30 minutos, um diagnóstico gratuito da sua gestão, marketing e vendas — e você sai com um plano de ação de 90 dias. Seja produtor rural ou empresa do agro.
          </p>
          <a
            href="#formulario"
            className="inline-flex items-center gap-2 bg-verde-folha hover:bg-verde-folha/90 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            Fazer meu diagnóstico gratuito <ArrowRight size={20} />
          </a>
          <p className="text-white/50 text-sm mt-4">Leva menos de 3 minutos para preencher.</p>
        </div>
      </section>

      {/* Beneficios — VALOR primeiro */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            O Que Você Vai Receber
          </h2>
          <p className="text-carvao/60 text-center mb-12 max-w-xl mx-auto">
            Não é uma ligação de vendas. É uma leitura honesta do seu negócio, com próximos passos claros.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((b) => (
              <div key={b.title} className="bg-off-white rounded-2xl p-6 flex gap-4 items-start">
                <div className="bg-verde-folha/10 rounded-xl p-3 shrink-0 text-2xl">
                  {b.emoji}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-navy mb-1">{b.title}</h3>
                  <p className="text-carvao/60 text-sm">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autoridade — quem faz o diagnóstico */}
      <section className="bg-off-white py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-center">
            <div className="relative w-40 h-40 md:w-full md:h-56 rounded-2xl overflow-hidden mx-auto shrink-0">
              <Image
                src="/images/lucas-agronomo.jpg"
                alt="Lucas Dierings — Engenheiro Agrônomo e consultor no agronegócio"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-2">
                Quem Vai Fazer seu Diagnóstico
              </h2>
              <p className="text-carvao/70 mb-5 leading-relaxed">
                <strong className="text-navy">Lucas Dierings</strong> conduz cada diagnóstico pessoalmente. Ele une a técnica do campo à gestão de negócios — e traduz os seus números em decisões práticas.
              </p>
              <ul className="space-y-2">
                {credenciais.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-carvao/80">
                    <CheckCircle2 className="text-verde-folha mt-0.5 shrink-0" size={18} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy text-center mb-12">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 bg-navy text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-heading font-bold text-navy text-lg mb-1">{s.title}</h3>
                <p className="text-carvao/60 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publico-Alvo */}
      <section className="bg-off-white py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            Para Quem É o Diagnóstico
          </h2>
          <ul className="space-y-4">
            {audience.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="text-verde-folha mt-0.5 shrink-0" size={20} />
                <span className="text-carvao/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ — objeções antes do formulário */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Antes de Começar, as Dúvidas Mais Comuns
          </h2>
          <p className="text-carvao/60 text-center mb-10 max-w-xl mx-auto">
            Sem pegadinha: é gratuito e você não precisa contratar nada depois.
          </p>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="bg-off-white rounded-xl p-5 group">
                <summary className="font-heading font-semibold text-navy cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-navy/40 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="text-carvao/60 text-sm mt-3 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario — fechamento */}
      <section id="formulario" className="bg-off-white py-16 md:py-20 scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy text-center mb-4">
            Comece seu Diagnóstico Gratuito
          </h2>
          <p className="text-carvao/60 text-center mb-10 max-w-xl mx-auto">
            Responda as perguntas abaixo. Assim que recebermos seu perfil, entramos em contato em até 24h para marcar sua sessão.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <DiagnosticoForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <Shield className="text-verde-folha mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-navy text-sm">Sem compromisso</p>
                    <p className="text-carvao/60 text-xs">Você não precisa contratar nada</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-verde-folha mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-navy text-sm">30 minutos objetivos</p>
                    <p className="text-carvao/60 text-xs">Direto ao ponto, sem enrolação</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Monitor className="text-verde-folha mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-navy text-sm">100% online</p>
                    <p className="text-carvao/60 text-xs">Chamada por vídeo, de onde você estiver</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-verde-folha mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-navy text-sm">Londrina, PR</p>
                    <p className="text-carvao/60 text-xs">Atendimento para todo o Brasil</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-carvao/40 text-center">
                Seus dados estão protegidos.{' '}
                <Link href="/politica-de-privacidade" className="underline hover:text-navy">
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Diagnóstico Gratuito para o Agronegócio',
            provider: {
              '@type': 'Person',
              name: 'Lucas Dierings',
              jobTitle: 'Engenheiro Agrônomo e Consultor',
            },
            description: 'Diagnóstico gratuito de 30 minutos para avaliar gestão, marketing e vendas de produtores rurais e empresas do agronegócio.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'BRL',
              availability: 'https://schema.org/InStock',
            },
            areaServed: {
              '@type': 'Country',
              name: 'Brasil',
            },
          }),
        }}
      />
    </>
  )
}
