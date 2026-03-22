import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart2, DollarSign, Users, Mic2, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Serviços de Consultoria em Agronegócio | Fluxo Rural',
  description: 'Consultoria em gestão estratégica, gestão financeira rural, mentoria para sucessão familiar e palestras. Soluções práticas para propriedades e empresas do agronegócio brasileiro.',
  keywords: [
    'consultoria agronegócio',
    'gestão financeira rural',
    'mentoria sucessão familiar',
    'palestras agronegócio',
    'consultoria estratégica agro',
    'gestão propriedade rural',
    'consultoria inovação agronegócio',
  ],
  openGraph: {
    title: 'Serviços | Fluxo Rural Consultoria - Consultoria Agronegócio',
    description: 'Consultoria estratégica, gestão financeira, mentoria para sucessão e palestras em agronegócio. Transformando desafios em oportunidades.',
  },
}

const services = [
  {
    icon: BarChart2,
    title: 'Consultoria em Gestão e Inovação',
    description: 'Diagnóstico, planejamento estratégico e acompanhamento para propriedades e empresas do agronegócio. Transformamos desafios em oportunidades de crescimento com metodologias práticas e resultados mensuráveis.',
    href: '/servicos/consultoria',
    color: 'bg-navy',
  },
  {
    icon: DollarSign,
    title: 'Gestão Financeira Rural',
    description: 'Controle de fluxo de caixa, custos operacionais e análise de rentabilidade de safra. Clareza financeira para decisões mais seguras no campo.',
    href: '/servicos/financeiro',
    color: 'bg-verde-folha',
  },
  {
    icon: Users,
    title: 'Mentoria para Sucessão Familiar',
    description: 'Programa estruturado para planejar e executar a transição geracional com segurança e clareza. Porque o campo merece continuar nas mãos da família.',
    href: '/servicos/mentoria',
    color: 'bg-dourado',
  },
  {
    icon: Mic2,
    title: 'Palestras e Workshops',
    description: 'Conteúdo aplicado sobre gestão, finanças, sucessão familiar e inteligência artificial no agronegócio. Palestras que transformam perspectivas.',
    href: '/servicos/palestras',
    color: 'bg-verde-escuro',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: services.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'ProfessionalService',
      name: s.title,
      description: s.description,
      url: `https://fluxorural.com.br${s.href}`,
      provider: { '@type': 'Person', name: 'Lucas Dierings' },
    },
  })),
}

export default function ServicosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="pt-32 pb-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy mb-4">
              Serviços
            </h1>
            <p className="text-carvao/60 text-lg max-w-2xl mx-auto">
              Soluções estratégicas para propriedades e empresas do agronegócio brasileiro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl p-8 transition-all duration-300 border border-gray-100 hover:border-dourado/30"
              >
                <div className={`${service.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}>
                  <service.icon className="text-white" size={28} />
                </div>
                <h2 className="font-heading text-xl font-bold text-navy mb-3 group-hover:text-dourado transition-colors">
                  {service.title}
                </h2>
                <p className="text-carvao/60 leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center text-dourado font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
                  Saiba mais <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
