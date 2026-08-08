import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'
import Breadcrumbs from '@/components/ui/breadcrumbs'
import { PedidoCTA } from '@/components/palestras/PedidoCTA'
import { PortfolioDownload } from '@/components/palestras/PortfolioDownload'
import { CURSOS, ETAPAS_IMPLANTACAO, PORTFOLIO_PDF } from '@/lib/catalogo'

export const metadata: Metadata = {
  alternates: { canonical: '/servicos/treinamentos/' },
  title: 'Treinamentos e Capacitação para o Agronegócio',
  description:
    'Sete treinamentos sobre gestão financeira, comunicação, liderança, inteligência artificial, agrometeorologia, gestão do tempo e sucessão. De 4h a 8h, para cooperativas, sindicatos, empresas, faculdades e eventos do agro.',
  openGraph: {
    title: 'Treinamentos e Capacitação para o Agronegócio | Fluxo Rural',
    description:
      'Sete treinamentos aplicados, de 4h a 8h, presenciais ou online. Para cooperativas, sindicatos, empresas, instituições de ensino e eventos do agro.',
    images: [{ url: '/treinamento-workshop.jpg' }],
  },
}

const coursesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Catálogo de treinamentos para o agronegócio',
  itemListElement: CURSOS.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Course',
      name: c.titulo,
      description: c.subtitulo,
      url: `https://fluxorural.com.br/servicos/treinamentos/#${c.id}`,
      provider: {
        '@type': 'Organization',
        name: 'Fluxo Rural Consultoria',
        url: 'https://fluxorural.com.br',
      },
      audience: { '@type': 'Audience', audienceType: c.publico },
      hasCourseInstance: c.formatos.map((f) => ({
        '@type': 'CourseInstance',
        courseMode: ['Presencial', 'Online'],
        courseWorkload: f.startsWith('8h') ? 'PT8H' : 'PT4H',
        name: f,
      })),
    },
  })),
}

export default function TreinamentosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Serviços', href: '/servicos' },
          { label: 'Treinamentos' },
        ]}
      />

      {/* Hero */}
      <section className="relative min-h-[52vh] flex items-end">
        <Image
          src="/treinamento-workshop.jpg"
          alt="Lucas Dierings conduzindo treinamento com a turma diante do quadro de trabalho"
          fill
          className="object-cover object-[center_30%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/70 to-navy/30" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20 pb-12">
          <span className="inline-block bg-verde-folha/90 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
            Treinamentos
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3 max-w-3xl leading-tight">
            Treinamento que vira ferramenta de trabalho
          </h1>
          <p className="text-white/85 text-lg md:text-xl max-w-2xl font-light">
            Sete cursos estruturados sobre gestão, finanças, comunicação, liderança, clima e
            inteligência artificial. Formatos flexíveis de 4h a 8h, presencial ou online, com o conteúdo ajustado a quem vai
            estar na sala.
          </p>
        </div>
      </section>

      {/* Os cursos */}
      <section id="cursos" className="py-20 bg-off-white scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
              Os Treinamentos
            </h2>
            <p className="text-carvao/70">
              A versão de <strong className="text-navy">4h</strong> é a mais enxuta. A de{' '}
              <strong className="text-navy">8h</strong> é o mesmo conteúdo com oficinas e exercícios
              práticos. O detalhe de cada módulo e os entregáveis estão no portfólio em PDF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {CURSOS.map((curso) => (
              <div
                key={curso.id}
                id={curso.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-7 flex flex-col scroll-mt-24"
              >
                <h3 className="font-heading font-bold text-navy text-lg mb-2 leading-snug">
                  {curso.titulo}
                </h3>
                <p className="text-carvao/70 text-sm leading-relaxed mb-4">{curso.subtitulo}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {curso.formatos.map((f) => (
                    <span
                      key={f}
                      className="bg-navy/5 text-navy text-xs font-semibold px-3 py-1.5 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <p className="text-carvao/45 text-[11px] font-semibold uppercase tracking-wide mb-2.5">
                  Módulos
                </p>
                <ul className="space-y-1.5 flex-1">
                  {curso.modulos.map((m) => (
                    <li key={m} className="flex gap-2.5 text-sm text-carvao/75 leading-snug">
                      <span className="text-verde-folha shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-verde-folha" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfólio em PDF */}
      <section className="py-16 md:py-20 bg-navy">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block bg-dourado/15 text-dourado text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                Material para download
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
                O portfólio completo
              </h2>
              <p className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                Os 7 treinamentos e as 6 palestras num documento só: objetivo, módulos, entregáveis
                e carga horária de cada um, mais a bio e as credenciais. Pronto para levar à
                diretoria, ao RH ou à comissão organizadora.
              </p>
              <div className="flex justify-center lg:justify-start">
                <PortfolioDownload
                  origem="banda-portfolio"
                  formLocation="treinamentos"
                  className="bg-dourado text-carvao hover:bg-dourado/90 shadow-lg shadow-dourado/20"
                />
              </div>
            </div>
            <div className="shrink-0">
              <div className="bg-dourado/10 border border-dourado/20 rounded-2xl w-40 h-52 md:w-48 md:h-64 flex flex-col items-center justify-center text-center px-4">
                <FileText className="text-dourado mb-3" size={44} />
                <p className="font-heading font-bold text-white text-sm leading-tight">
                  Portfólio Fluxo Rural
                </p>
                <p className="text-white/60 text-xs mt-1">Treinamentos e palestras</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-navy mb-4">Como Funciona</h2>
            <p className="text-carvao/70">
              Sem burocracia e sem proposta de trinta páginas. São três passos até a sala.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {ETAPAS_IMPLANTACAO.map((etapa) => (
              <div key={etapa.num} className="text-center">
                <div className="bg-navy w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-heading font-bold">
                  {etapa.num}
                </div>
                <h3 className="font-heading font-bold text-navy text-base mb-2">{etapa.title}</h3>
                <p className="text-carvao/60 text-sm leading-relaxed">{etapa.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ponteiro para palestras */}
      <section className="py-14 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
          <p className="text-carvao/65 text-sm">
            Procura conteúdo de palco para um evento, e não capacitação com material de trabalho?{' '}
            <Link href="/palestras" className="text-navy font-semibold hover:text-dourado underline">
              Veja os temas de palestra
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-verde-folha py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Vamos estruturar a próxima capacitação?
          </h2>
          <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
            Conte quem vai estar na sala, o que motivou o treinamento e a janela de agenda. A partir
            daí montamos o formato e o conteúdo.
          </p>
          <PedidoCTA
            label="Solicitar proposta"
            servico="treinamento"
            origem="cta-final"
            className="bg-white text-verde-escuro hover:bg-white/90"
          />
        </div>
      </section>
    </>
  )
}
