import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart2, GraduationCap, Mic2, Headphones, Handshake, ArrowRight } from 'lucide-react'
import Breadcrumbs from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  alternates: { canonical: '/servicos/' },
  title: 'Serviços',
  description:
    'Consultoria em gestão rural, treinamentos in-company, palestras e podcast para o agronegócio. As quatro frentes de trabalho da Fluxo Rural.',
  openGraph: {
    title: 'Serviços | Fluxo Rural Consultoria',
    description:
      'Consultoria em gestão rural, treinamentos, palestras e podcast, para produtores, cooperativas e empresas do agro.',
  },
}

// Quatro frentes de trabalho. A divisão não é temática, é de público:
// consultoria atende o PRODUTOR; treinamentos, palestras e podcast atendem
// EMPRESA, cooperativa e associação.
const services = [
  {
    icon: BarChart2,
    title: 'Consultoria em Gestão Rural',
    para: 'Para produtores rurais',
    description:
      'Diagnóstico, planejamento estratégico, gestão financeira, rentabilidade, avaliação de investimento e projetos de custeio. O diagnóstico define quais passos seguir primeiro e o que pode esperar.',
    href: '/servicos/consultoria',
    color: 'bg-navy',
  },
  {
    icon: GraduationCap,
    title: 'Treinamentos',
    para: 'Para empresas, cooperativas e associações',
    description:
      'Sete cursos in-company em formato de 4h ou 8h: gestão financeira, comunicação, liderança, inteligência artificial, agrometeorologia, gestão do tempo e sucessão. Conteúdo customizado à sua operação.',
    href: '/servicos/treinamentos',
    color: 'bg-verde-folha',
  },
  {
    icon: Mic2,
    title: 'Palestras',
    para: 'Para eventos, convenções e encontros',
    description:
      'Seis temas de palco sobre gestão, finanças, sucessão, liderança, empreendedorismo e IA no agro. Conteúdo aplicado e linguagem do campo, presencial ou online.',
    href: '/palestras',
    color: 'bg-dourado',
  },
  {
    icon: Headphones,
    title: 'Agro Jovem Podcast',
    para: 'Para o produtor rural e para marcas do agro',
    description:
      'O podcast sobre gestão, liderança e inovação no campo. Indique convidados, contrate host para o seu videocast ou fale sobre patrocínio. Host do NHCast, podcast oficial da New Holland Brasil.',
    href: '/agrojovem',
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
      // Barra final: o site roda com trailingSlash: true, então esta URL
      // precisa bater com o canonical da página de destino.
      url: `https://fluxorural.com.br${s.href}/`,
      provider: { '@type': 'Person', name: 'Lucas Dierings' },
    },
  })),
}

export default function ServicosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Serviços' }]} />
      <section className="pb-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy mb-4">Serviços</h1>
            <p className="text-carvao/60 text-lg max-w-2xl mx-auto">
              Quatro frentes de trabalho para quem produz e para quem forma quem produz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl p-8 transition-all duration-300 border border-gray-100 hover:border-dourado/30 flex flex-col"
              >
                <div
                  className={`${service.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}
                >
                  <service.icon className="text-white" size={28} />
                </div>
                <h2 className="font-heading text-xl font-bold text-navy mb-1 group-hover:text-dourado transition-colors">
                  {service.title}
                </h2>
                <p className="text-dourado text-xs font-semibold uppercase tracking-wide mb-3">
                  {service.para}
                </p>
                <p className="text-carvao/60 leading-relaxed mb-4 flex-1">{service.description}</p>
                <span className="inline-flex items-center text-dourado font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
                  Saiba mais <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>

          {/* Parcerias: pedido de entrada, não serviço com página própria */}
          <div className="max-w-5xl mx-auto mt-8">
            <Link
              href="/contato"
              className="group flex flex-col sm:flex-row sm:items-center gap-5 bg-navy rounded-2xl p-7 md:p-8 hover:bg-navy/95 transition-colors"
            >
              <div className="bg-white/10 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                <Handshake className="text-dourado" size={26} />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-lg font-bold text-white mb-1">
                  Parcerias
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Divulgação, gravações, captações, presença em eventos e outras ideias que não
                  cabem nas quatro frentes acima. Manda a proposta.
                </p>
              </div>
              <span className="inline-flex items-center text-dourado font-semibold text-sm gap-1 group-hover:gap-2 transition-all shrink-0">
                Falar sobre parceria <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
