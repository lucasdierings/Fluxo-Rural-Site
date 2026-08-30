import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart2, GraduationCap, Mic2, Headphones, Handshake, ArrowRight, Sparkles } from 'lucide-react'
import Breadcrumbs from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  alternates: { canonical: '/servicos/' },
  title: 'Serviços em Gestão, Treinamentos e Palestras',
  description:
    'Consultoria em gestão rural, capacitação corporativa, palestras e podcast para o agronegócio. As quatro frentes de atuação da Fluxo Rural.',
  openGraph: {
    title: 'Serviços | Fluxo Rural Consultoria',
    description:
      'Consultoria em gestão rural, treinamentos, palestras e podcast, para produtores, cooperativas e empresas do agro.',
    url: 'https://fluxorural.com.br/servicos/',
  },
}

const services = [
  {
    icon: BarChart2,
    title: 'Consultoria em Gestão Rural',
    para: 'Para produtores rurais e famílias',
    description:
      'Diagnóstico de gargalos, planejamento de safra, gestão financeira, rentabilidade real por talhão e estruturação de governança sucessória. O diagnóstico define as prioridades imediatas.',
    href: '/servicos/consultoria',
    badge: 'Produtores Rurais',
    accentColor: 'text-[#4ADE80]',
    bgIcon: 'bg-[#6AAF3D]/20 text-[#4ADE80] border-[#4ADE80]/30',
  },
  {
    icon: GraduationCap,
    title: 'Capacitação Corporativa',
    para: 'Para empresas, cooperativas e revendas',
    description:
      'Sete cursos práticos em formatos de 4h ou 8h: finanças agro, comunicação e oratória, liderança, inteligência artificial, agrometeorologia e gestão do tempo.',
    href: '/servicos/treinamentos',
    badge: 'Empresas & Cooperativas',
    accentColor: 'text-[#E8B84B]',
    bgIcon: 'bg-[#E8B84B]/20 text-[#E8B84B] border-[#E8B84B]/30',
  },
  {
    icon: Mic2,
    title: 'Palestras de Alto Impacto',
    para: 'Para convenções, feiras e encontros',
    description:
      'Seis temas de palco sobre gestão, finanças, sucessão, liderança e IA no agro. Conteúdo técnico com linguagem direta do campo, presencial ou online.',
    href: '/palestras',
    badge: 'Eventos & Convenções',
    accentColor: 'text-[#4ADE80]',
    bgIcon: 'bg-[#1B4F7A]/30 text-[#4ADE80] border-white/20',
  },
  {
    icon: Headphones,
    title: 'Agro Jovem Podcast & Videocasts',
    para: 'Para marcas e lideranças do setor',
    description:
      'Produção e apresentação de videocasts estratégicos. Lucas Dierings é host do NHCast (New Holland Brasil) e do Agro Jovem Podcast. Projetos de patrocínio e mediação.',
    href: '/agrojovem',
    badge: 'Mídia & Conteúdo',
    accentColor: 'text-[#E8B84B]',
    bgIcon: 'bg-[#153C24]/40 text-[#4ADE80] border-[#4ADE80]/30',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': 'https://fluxorural.com.br/servicos/#itemlist',
  name: 'Serviços da Fluxo Rural Consultoria',
  itemListElement: services.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'ProfessionalService',
      name: s.title,
      description: s.description,
      url: `https://fluxorural.com.br${s.href}/`,
      provider: {
        '@type': 'Person',
        '@id': 'https://fluxorural.com.br/#lucas-dierings',
        name: 'Lucas Dierings',
      },
    },
  })),
}

export default function ServicosPage() {
  return (
    <div className="bg-[#0A192F] text-slate-100 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Serviços' }]} />

      <section className="pt-10 pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#112240] border border-[#4ADE80]/30 text-[#4ADE80] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
              <Sparkles size={14} />
              <span>Soluções Especializadas para o Agronegócio</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Nossas Frentes de Trabalho
            </h1>
            <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
              Consultoria técnica para quem produz no campo e programas corporativos para as organizações que impulsionam o setor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group bg-[#112240]/90 rounded-2xl border border-white/10 hover:border-[#4ADE80]/40 p-8 transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(74,222,128,0.08)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${service.bgIcon}`}
                    >
                      <service.icon size={28} />
                    </div>
                    <span className="bg-[#0A192F] border border-white/10 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
                      {service.badge}
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl font-bold text-white mb-1 group-hover:text-[#4ADE80] transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-[#E8B84B] text-xs font-semibold uppercase tracking-wider mb-4">
                    {service.para}
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                    {service.description}
                  </p>
                </div>

                <span className="inline-flex items-center text-[#E8B84B] group-hover:text-[#4ADE80] font-semibold text-sm gap-1.5 group-hover:gap-2.5 transition-all pt-2 border-t border-white/10">
                  Conhecer detalhes <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>

          {/* Card de Parcerias e Projetos Especiais */}
          <div className="max-w-5xl mx-auto mt-10">
            <Link
              href="/contato"
              className="group flex flex-col sm:flex-row sm:items-center gap-6 bg-[#0D1F3C] border border-white/10 hover:border-[#E8B84B]/50 rounded-2xl p-7 md:p-8 transition-all duration-300 shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#E8B84B]/15 border border-[#E8B84B]/30 flex items-center justify-center shrink-0">
                <Handshake className="text-[#E8B84B]" size={28} />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-xl font-bold text-white mb-1 group-hover:text-[#E8B84B] transition-colors">
                  Projetos Especiais & Parcerias
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                  Gravações de campo, produção de conteúdo técnico para marcas, mediação de painéis em feiras ou iniciativas sob medida.
                </p>
              </div>
              <span className="inline-flex items-center justify-center bg-[#112240] border border-white/20 text-[#E8B84B] font-semibold text-sm gap-1.5 px-5 py-3 rounded-xl group-hover:bg-[#E8B84B] group-hover:text-[#202522] transition-all shrink-0">
                Falar sobre parceria <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
