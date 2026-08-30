import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle2,
  Clock,
  CalendarCheck,
  FileText,
  Shield,
  Monitor,
  MapPin,
  ArrowRight,
  Sparkles,
  BarChart3,
  Target,
  Calendar,
  Zap,
} from 'lucide-react'
import { DiagnosticoForm } from '@/components/forms/DiagnosticoForm'
import Breadcrumbs from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  alternates: { canonical: '/diagnostico/' },
  title: 'Diagnóstico Gratuito para o Agronegócio',
  description:
    'Diagnóstico gratuito de gestão para produtores rurais. Identifique o principal gargalo da propriedade e os próximos passos para agir com clareza.',
  openGraph: {
    title: 'Diagnóstico Gratuito para o Agronegócio | Fluxo Rural Consultoria',
    description:
      'Diagnóstico gratuito de gestão para produtores rurais, com leitura preliminar de dados e uma sessão técnica de 30 minutos.',
    url: 'https://fluxorural.com.br/diagnostico/',
    images: [{ url: '/images/lucas-agronomo.jpg', width: 1200, height: 630, alt: 'Diagnóstico Gratuito Fluxo Rural' }],
  },
}

const benefits = [
  {
    icon: BarChart3,
    title: 'Finanças & Margens Reais',
    desc: 'Diagnóstico do custo de produção real por atividade, ponto de equilíbrio e projeção de fluxo de caixa para tomada de decisão segura.',
  },
  {
    icon: Target,
    title: 'Processos & Eficiência de Campo',
    desc: 'Mapeamento de gargalos operacionais, controle de insumos e rotinas padronizadas para estancar desperdícios invisíveis.',
  },
  {
    icon: Calendar,
    title: 'Pessoas, Liderança & Sucessão',
    desc: 'Estruturação de papéis claros, alinhamento da equipe de trabalho e direcionamento para governança e transição familiar.',
  },
  {
    icon: Zap,
    title: 'Tecnologia & Plano de Ação 90 Dias',
    desc: 'Direcionamento para modernização da gestão, escolha de ferramentas digitais e sistemas adequados, com plano de prioridades para o próximo ciclo.',
  },
]

const audience = [
  'Produtores de grãos, pecuária (corte e leite), avicultura, suinocultura, café e hortifrúti',
  'Quem busca clareza imediata sobre custo real por saca/arroba/litro e controle de caixa',
  'Propriedades que desejam padronizar rotinas e profissionalizar a equipe operacional',
  'Famílias do agronegócio em processo de estruturação de governança e transição sucessória',
  'Gestores que buscam modernizar a propriedade com tecnologias, softwares de gestão e rotinas orientadas a lucro',
]

const steps = [
  {
    num: '1',
    title: 'Preencha o diagnóstico',
    desc: 'Responda perguntas objetivas sobre a sua operação.',
    icon: FileText,
  },
  {
    num: '2',
    title: 'Agendamos a sua sessão',
    desc: 'Retornamos em até 24h para marcar dia e horário.',
    icon: Clock,
  },
  {
    num: '3',
    title: 'Receba seu plano de ação',
    desc: 'Em uma sessão técnica de 30 minutos por vídeo.',
    icon: CalendarCheck,
  },
]

const credenciais = [
  'Engenheiro Agrônomo com MBA em Agronegócios pela USP/ESALQ',
  'Consultor credenciado SENAR, SEBRAE e SESCOOP em gestão no agronegócio',
  'Professor e especialista em gestão técnica, financeira e inovação rural',
  'Experiência prática em consultoria de gestão em diversas cadeias produtivas pelo país',
]

const faqs = [
  {
    q: 'Quanto custa a sessão de diagnóstico?',
    a: 'O diagnóstico é 100% gratuito. Não há taxas de agendamento e nenhum tipo de cobrança surpresa.',
  },
  {
    q: 'Sou obrigado a contratar consultoria depois?',
    a: 'Não. O diagnóstico é um serviço independente de alto valor. Se a sua propriedade tiver sinergia com a consultoria da Fluxo Rural, poderemos apresentar uma proposta, mas você não tem qualquer obrigação de contratação.',
  },
  {
    q: 'Qual é o tempo de duração da conversa?',
    a: 'A sessão dura 30 minutos de forma direta, analítica e objetiva, focando nos dados que você preencheu.',
  },
  {
    q: 'Como é realizado o agendamento?',
    a: 'Assim que você envia suas respostas, nossa equipe analisa os pontos críticos e entra em contato via WhatsApp em até 24h para confirmar o melhor horário. A chamada é online por videoconferência.',
  },
  {
    q: 'Sou uma cooperativa, revenda ou empresa. Este diagnóstico é para mim?',
    a: 'Este diagnóstico é desenhado especificamente para propriedades rurais e produtores. Para capacitação corporativa, palestras ou parcerias institucionais, solicite uma proposta na página de Palestras ou Serviços.',
  },
]

export default function DiagnosticoPage() {
  return (
    <div className="bg-[#0A192F] text-slate-100 min-h-screen">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              '@id': 'https://fluxorural.com.br/diagnostico/#service',
              url: 'https://fluxorural.com.br/diagnostico/',
              name: 'Diagnóstico Gratuito para o Agronegócio',
              provider: {
                '@type': 'Person',
                '@id': 'https://fluxorural.com.br/#lucas-dierings',
                name: 'Lucas Dierings',
                jobTitle: 'Engenheiro Agrônomo e Consultor',
                url: 'https://fluxorural.com.br/sobre/',
              },
              description:
                'Diagnóstico gratuito de 30 minutos para avaliar a gestão, fluxo de caixa e gargalos de produtores rurais.',
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
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.a,
                },
              })),
            },
          ]),
        }}
      />

      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Diagnóstico Gratuito' }]} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pb-28 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#112240] border border-[#4ADE80]/30 text-[#4ADE80] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <Sparkles size={15} />
            <span>Gratuito · 30 Minutos · Online para Todo o Brasil</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            Identifique os Gargalos que Travam a Rentabilidade da sua Fazenda
          </h1>

          <p className="text-slate-200 text-lg sm:text-xl font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            Uma análise técnica e gerencial personalizada para identificar gargalos operacionais, estancar vazamentos de caixa e estruturar as prioridades da sua fazenda para os próximos 90 dias.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#formulario"
              className="inline-flex items-center justify-center gap-2 bg-[#6AAF3D] hover:bg-[#6AAF3D]/90 text-white font-semibold min-h-[48px] h-12 px-8 rounded-xl shadow-lg transition-all text-base"
            >
              Fazer meu Diagnóstico Gratuito <ArrowRight size={18} />
            </a>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-4 font-light">
            Leva menos de 2 minutos para preencher. Sem compromisso.
          </p>
        </div>
      </section>

      {/* Benefícios / O que você vai receber */}
      <section className="py-20 bg-[#0D1F3C] border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[#4ADE80] text-xs uppercase font-semibold tracking-widest">
              Entrega de Valor
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              O Que Você Receberá na Sessão
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Não é uma ligação de vendas. É uma análise estratégica com base nos números e desafios do seu agro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-[#112240]/90 border border-white/10 rounded-2xl p-6 sm:p-7 flex gap-4 items-start hover:border-[#4ADE80]/30 transition-all duration-300 shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center shrink-0 text-[#4ADE80]">
                  <b.icon size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-lg mb-1">{b.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-light">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autoridade - Quem conduz a sessão */}
      <section className="py-20 bg-[#0A192F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-[#112240]/90 border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-center">
              <div className="relative w-44 h-44 md:w-full md:h-64 rounded-2xl overflow-hidden mx-auto shrink-0 border border-white/15 shadow-xl bg-navy-900">
                <Image
                  src="/images/lucas-hero.jpg"
                  alt="Lucas Dierings - Engenheiro Agrônomo e consultor no agronegócio"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 176px, 220px"
                />
              </div>

              <div>
                <span className="text-[#E8B84B] text-xs font-semibold uppercase tracking-widest">
                  Especialista Responsável
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">
                  Quem Conduz o seu Diagnóstico
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4 font-light">
                  <strong className="text-white font-semibold">Lucas Dierings</strong> conduz pessoalmente cada diagnóstico. Engenheiro agrônomo formado pela UFPR, pós-graduado em agronegócios pela USP/ESALQ, professor e consultor credenciado Senar, Sebrae e Sescoop, com vivência prática no planejamento técnico, financeiro e gerencial de propriedades rurais pelo Brasil.
                </p>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 font-light">
                  A sessão conecta a realidade do campo à precisão financeira e de processos, garantindo que as decisões da sua propriedade sejam sustentadas por números concretos, equipe alinhada e rotinas eficientes.
                </p>
                <ul className="space-y-2.5">
                  {credenciais.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="text-[#4ADE80] mt-0.5 shrink-0" size={16} />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-[#0D1F3C] border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-[#4ADE80] text-xs uppercase font-semibold tracking-widest">
              Passo a Passo
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Como Funciona o Diagnóstico
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((s) => (
              <div
                key={s.num}
                className="bg-[#112240]/90 border border-white/10 rounded-2xl p-7 text-center shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#6AAF3D] text-white flex items-center justify-center mx-auto mb-4 font-heading font-bold text-xl shadow-md">
                  {s.num}
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-1">{s.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Público-Alvo */}
      <section className="py-20 bg-[#0A192F]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-[#E8B84B] text-xs uppercase font-semibold tracking-widest">
              Perfil Ideal
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Para Quem É Este Diagnóstico
            </h2>
          </div>

          <div className="space-y-3">
            {audience.map((item) => (
              <div
                key={item}
                className="bg-[#112240]/80 border border-white/10 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm"
              >
                <CheckCircle2 className="text-[#4ADE80] mt-0.5 shrink-0" size={20} />
                <span className="text-slate-200 text-sm sm:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#0D1F3C] border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-[#4ADE80] text-xs uppercase font-semibold tracking-widest">
              Dúvidas Frequentes
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1">
              Perguntas sobre o Diagnóstico
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-[#112240]/90 border border-white/10 rounded-2xl p-6 shadow-md transition-all"
              >
                <summary className="font-heading font-semibold text-white cursor-pointer list-none flex items-center justify-between gap-4 text-base sm:text-lg">
                  <span>{faq.q}</span>
                  <span className="text-[#E8B84B] text-2xl group-open:rotate-45 transition-transform shrink-0">
                    +
                  </span>
                </summary>
                <p className="text-slate-300 text-sm sm:text-base mt-4 pt-4 border-t border-white/10 leading-relaxed font-light">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário Interativo */}
      <section id="formulario" className="py-20 sm:py-28 bg-[#0A192F] scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-[#4ADE80] text-xs uppercase font-semibold tracking-widest">
              Início Imediato
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-1 mb-2">
              Comece seu Diagnóstico Gratuito
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light">
              Primeiro salvamos seu contato com segurança. Depois, você responde apenas às perguntas relacionadas à sua operação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Form Container */}
            <div className="lg:col-span-8 bg-[#112240]/95 border border-white/15 rounded-2xl p-6 sm:p-10 shadow-2xl">
              <DiagnosticoForm />
            </div>

            {/* Sidebar com Garantias */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#112240]/80 border border-white/10 rounded-2xl p-6 space-y-5 shadow-lg">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center shrink-0 text-[#4ADE80]">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Sem Compromisso</p>
                    <p className="text-slate-400 text-xs mt-0.5">Você não é obrigado a contratar nada</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center shrink-0 text-[#4ADE80]">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">30 Minutos Objetivos</p>
                    <p className="text-slate-400 text-xs mt-0.5">Foco total em soluções práticas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center shrink-0 text-[#4ADE80]">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">100% Online</p>
                    <p className="text-slate-400 text-xs mt-0.5">Videoconferência de onde você estiver</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center shrink-0 text-[#4ADE80]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Abrangência Nacional</p>
                    <p className="text-slate-400 text-xs mt-0.5">Atendimento consultivo em todo o Brasil</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center">
                Seus dados estão protegidos sob sigilo.{' '}
                <Link href="/politica-de-privacidade" className="underline text-slate-300 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
