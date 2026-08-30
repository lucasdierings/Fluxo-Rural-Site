import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ShieldCheck } from 'lucide-react'
import { LinkButton } from '@/components/links/LinkButton'
import { SocialRow } from '@/components/links/SocialRow'

export const metadata: Metadata = {
  title: 'Links e Contatos Oficiais',
  description:
    'Todos os links de Lucas Dierings em um só lugar: WhatsApp, diagnóstico gratuito, portfólio de palestras, podcasts (NHCast e Agro Jovem) e contatos.',
  alternates: { canonical: '/links/' },
  openGraph: {
    title: 'Links de Lucas Dierings | Fluxo Rural Consultoria',
    description:
      'WhatsApp, diagnóstico gratuito, mídia kit de palestras, podcasts e redes de Lucas Dierings — Engenheiro Agrônomo CREA-PR 179906/D, consultor e palestrante.',
    url: 'https://fluxorural.com.br/links/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Lucas Dierings - Fluxo Rural' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Links de Lucas Dierings | Fluxo Rural Consultoria',
    description: 'Todos os links de Lucas Dierings em um só lugar.',
    images: ['/og-image.png'],
  },
}

const profilePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://fluxorural.com.br/links/#webpage',
  dateCreated: '2026-06-28',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://fluxorural.com.br/#lucas-dierings',
    name: 'Lucas Dierings',
    jobTitle: 'Engenheiro Agrônomo, Consultor e Palestrante do Agronegócio',
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'CREA-PR',
      value: '179906/D',
    },
    description:
      'Engenheiro Agrônomo com MBA USP/ESALQ, Top 5 CNA Jovem 2021 e host do NHCast (New Holland). Consultor em gestão, finanças e inovação no agronegócio.',
    image: 'https://fluxorural.com.br/images/lucas-hero.jpg',
    url: 'https://fluxorural.com.br/sobre/',
    email: 'lucas@fluxorural.com.br',
    telephone: '+5545991447004',
    worksFor: { '@type': 'Organization', name: 'Fluxo Rural Consultoria', url: 'https://fluxorural.com.br/' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Londrina',
      addressRegion: 'PR',
      addressCountry: 'BR',
    },
    sameAs: [
      'https://www.linkedin.com/in/lucas-dierings/',
      'https://www.instagram.com/lucasdierings.agro/',
      'https://www.youtube.com/@agrojovempodcast',
    ],
  },
}

const MSG_WHATS =
  'Olá Lucas! Cheguei pelo seu link da bio e gostaria de conversar com você.'

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A192F] via-[#0D1F3C] to-[#0A192F] text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />

      <div className="mx-auto w-full max-w-[480px] px-4 sm:px-5 pt-10 pb-16">
        {/* Logo Fluxo Rural no Topo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="relative w-40 h-10 block opacity-90 hover:opacity-100 transition-opacity">
            <Image
              src="/logo-fluxo-rural-branco-horizontal.png"
              alt="Fluxo Rural Consultoria"
              fill
              sizes="160px"
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Cabeçalho / Perfil */}
        <header className="text-center mb-8 bg-[#112240]/80 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-[#E8B84B]/40 shadow-2xl">
            <Image
              src="/images/lucas-hero.jpg"
              alt="Lucas Dierings — Engenheiro Agrônomo, consultor e palestrante"
              fill
              sizes="112px"
              className="object-cover"
              priority
            />
          </div>

          <h1 className="font-heading text-2xl font-bold text-white mt-4">
            Lucas Dierings
          </h1>

          <p className="text-[#4ADE80] text-xs sm:text-sm font-semibold mt-1 flex items-center justify-center gap-1.5">
            <ShieldCheck size={16} />
            <span>Eng. Agrônomo (CREA-PR 179906/D)</span>
          </p>

          <p className="text-slate-300 text-xs mt-1">
            Consultor em Gestão Rural · Palestrante · MBA USP/ESALQ
          </p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Londrina e Curitiba / PR · Atendimento em todo o Brasil
          </p>

          <div className="inline-flex items-center gap-1.5 mt-3.5 bg-[#0A192F]/80 border border-white/10 rounded-full px-3.5 py-1">
            <Sparkles size={13} className="text-[#E8B84B]" />
            <span className="text-[11px] font-medium text-slate-200">
              Top 5 CNA Jovem · Host do NHCast
            </span>
          </div>
        </header>

        {/* Destaques de Ação */}
        <section className="space-y-3 mb-7">
          <LinkButton
            href="/diagnostico/"
            label="Diagnóstico Gratuito de Gestão"
            sublabel="Identifique o principal gargalo da fazenda em 30 min"
            icon="sparkles"
            tone="gold"
            lead
            cta="diagnostico"
          />
          <LinkButton
            href={`https://wa.me/5545991447004?text=${encodeURIComponent(MSG_WHATS)}`}
            label="Falar no WhatsApp"
            sublabel="Atendimento direto com Lucas Dierings"
            icon="whatsapp"
            tone="green"
            lead
            cta="whatsapp"
          />
          <LinkButton
            href="/servicos/consultoria/"
            label="Consultoria em Gestão Rural"
            sublabel="Finanças, planejamento de safra e governança"
            icon="briefcase"
            tone="navy"
            cta="consultoria"
          />
          <LinkButton
            href="/portfolio-treinamentos-palestras-lucas-dierings.pdf"
            label="Baixar Portfólio / Speaker Kit"
            sublabel="Palestras, treinamentos, bio e credenciais (PDF)"
            icon="download"
            tone="navy"
            download
            cta="portfolio"
          />
        </section>

        {/* Explore */}
        <h2 className="text-[#E8B84B] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 px-1">
          Explore os Serviços
        </h2>
        <section className="space-y-3 mb-7">
          <LinkButton
            href="/palestras/"
            label="Palestras para o Agro"
            sublabel="Gestão, liderança, sucessão e IA no agro"
            icon="mic"
            cta="palestras"
          />
          <LinkButton
            href="/servicos/treinamentos/"
            label="Capacitação Corporativa"
            sublabel="Sete programas práticos para equipes do agro"
            icon="sparkles"
            cta="treinamentos"
          />
          <LinkButton
            href="/servicos/"
            label="Visão Geral dos Serviços"
            sublabel="Quatro frentes de trabalho para o setor"
            icon="briefcase"
            cta="servicos"
          />
          <LinkButton
            href="/sobre/"
            label="Sobre Lucas Dierings"
            sublabel="Trajetória, formação UFPR/ESALQ e premiações"
            icon="user"
            cta="sobre"
          />
          <LinkButton
            href="/blog/"
            label="Artigos e Conteúdo"
            sublabel="Gestão financeira, mercado e tecnologia no campo"
            icon="book"
            cta="blog"
          />
        </section>

        {/* Conteúdo & Podcasts */}
        <h2 className="text-[#E8B84B] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 px-1">
          Podcasts Oficiais
        </h2>
        <section className="space-y-3 mb-7">
          <LinkButton
            href="https://www.youtube.com/playlist?list=PLdv5Ps8k7ij8UDT_9aOTuzs_G5uo6lNva"
            label="NHCast — New Holland Brasil"
            sublabel="Host do podcast oficial da maior fabricante agro"
            icon="radio"
            cta="nhcast"
          />
          <LinkButton
            href="https://www.youtube.com/@agrojovempodcast"
            label="Agro Jovem Podcast"
            sublabel="Conversas semanais sobre o futuro do agronegócio"
            icon="headphones"
            cta="agrojovem"
          />
        </section>

        {/* Contato Direto */}
        <h2 className="text-[#E8B84B] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 px-1">
          Contato Direto
        </h2>
        <section className="space-y-3 mb-8">
          <LinkButton
            href="mailto:lucas@fluxorural.com.br"
            label="E-mail Direto"
            sublabel="lucas@fluxorural.com.br"
            icon="mail"
            cta="email"
          />
          <LinkButton
            href="tel:+5545991447004"
            label="Telefone Corporativo"
            sublabel="(45) 99144-7004"
            icon="phone"
            cta="telefone"
          />
          <LinkButton
            href="/contato-lucas-dierings.vcf"
            label="Salvar Contato na Agenda"
            sublabel="Baixe o cartão de contato oficial (vCard)"
            icon="contact"
            download
            cta="vcard"
          />
        </section>

        {/* Redes Sociais */}
        <div className="mb-8">
          <SocialRow />
        </div>

        {/* Rodapé */}
        <footer className="mt-8 text-center pt-6 border-t border-white/10">
          <Link
            href="/"
            className="text-slate-300 hover:text-[#E8B84B] text-sm font-medium transition-colors"
          >
            Acessar site completo da Fluxo Rural →
          </Link>
          <p className="text-slate-400 text-xs mt-3">
            © {new Date().getFullYear()} Fluxo Rural Consultoria · Lucas Dierings · Eng. Agrônomo CREA-PR 179906/D
          </p>
        </footer>
      </div>
    </main>
  )
}
