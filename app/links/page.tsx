import type { Metadata } from 'next'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { LinkButton } from '@/components/links/LinkButton'
import { SocialRow } from '@/components/links/SocialRow'

export const metadata: Metadata = {
  title: 'Links de Lucas Dierings | Fluxo Rural',
  description:
    'Todos os links de Lucas Dierings em um lugar: WhatsApp, diagnóstico de gestão, mídia kit de palestras, podcasts (NHCast e Agro Jovem), redes sociais e contato.',
  alternates: { canonical: 'https://fluxorural.com.br/links' },
  openGraph: {
    title: 'Links de Lucas Dierings | Fluxo Rural',
    description:
      'WhatsApp, diagnóstico gratuito, mídia kit de palestras, podcasts e redes de Lucas Dierings — engenheiro agrônomo, consultor e palestrante do agronegócio.',
    url: 'https://fluxorural.com.br/links',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Lucas Dierings — Fluxo Rural' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Links de Lucas Dierings | Fluxo Rural',
    description: 'Todos os links de Lucas Dierings em um lugar.',
    images: ['/og-image.png'],
  },
}

const profilePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  dateCreated: '2026-06-28',
  mainEntity: {
    '@type': 'Person',
    name: 'Lucas Dierings',
    jobTitle: 'Engenheiro Agrônomo, Consultor e Palestrante do Agronegócio',
    description:
      'Engenheiro agrônomo com MBA USP/ESALQ, Top 5 CNA Jovem 2021 e host do NHCast (New Holland). Consultor em gestão, finanças e inovação no agronegócio.',
    image: 'https://fluxorural.com.br/images/lucas-hero.jpg',
    url: 'https://fluxorural.com.br',
    email: 'lucas@fluxorural.com.br',
    telephone: '+5545991447004',
    worksFor: { '@type': 'Organization', name: 'Fluxo Rural Consultoria' },
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

// utm para o GA4 atribuir o tráfego vindo da bio
const U = '?utm_source=bio&utm_medium=social'

const MSG_WHATS =
  'Olá Lucas! Cheguei pelo seu link da bio e gostaria de falar com você.'

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-navy via-navy to-verde-escuro text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />

      <div className="mx-auto w-full max-w-[480px] px-5 pt-12 pb-16">
        {/* Cabeçalho / perfil */}
        <header className="text-center mb-8">
          <div className="relative mx-auto w-28 h-28 rounded-full overflow-hidden ring-4 ring-dourado/30 shadow-xl">
            <Image
              src="/images/lucas-hero.jpg"
              alt="Lucas Dierings — Engenheiro Agrônomo, consultor e palestrante"
              fill
              sizes="112px"
              className="object-cover"
              priority
            />
          </div>
          <h1 className="font-heading text-2xl font-bold mt-5">Lucas Dierings</h1>
          <p className="text-white/75 text-sm mt-1">
            Eng. Agrônomo · Consultor · Palestrante
          </p>
          <p className="text-white/50 text-xs mt-1">Londrina / Curitiba · PR — atende todo o Brasil</p>
          <div className="inline-flex items-center gap-2 mt-4 bg-white/10 border border-white/15 rounded-full px-4 py-1.5">
            <Sparkles size={14} className="text-dourado" />
            <span className="text-xs font-medium text-white/85">Top 5 CNA Jovem · Host do NHCast</span>
          </div>
        </header>

        {/* Destaques */}
        <section className="space-y-3 mb-7">
          <LinkButton
            href={`/diagnostico/${U}`}
            label="Diagnóstico de Gestão (grátis)"
            sublabel="30 min para achar onde melhorar — sem compromisso"
            icon="sparkles"
            tone="gold"
            lead
            cta="diagnostico"
          />
          <LinkButton
            href={`https://wa.me/5545991447004?text=${encodeURIComponent(MSG_WHATS)}`}
            label="Falar no WhatsApp"
            sublabel="Resposta rápida, direto comigo"
            icon="whatsapp"
            tone="green"
            lead
            cta="whatsapp"
          />
          <LinkButton
            href="/midia-kit-palestras-lucas-dierings.pdf"
            label="Mídia Kit de Palestras (PDF)"
            sublabel="Temas, bio e formatos para o seu evento"
            icon="download"
            tone="navy"
            download
            cta="midia_kit"
          />
        </section>

        {/* Explore */}
        <h2 className="text-white/45 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3 px-1">
          Explore
        </h2>
        <section className="space-y-3 mb-7">
          <LinkButton href={`/palestras/${U}`} label="Palestras" sublabel="Gestão, finanças, sucessão e IA no agro" icon="mic" cta="palestras" />
          <LinkButton href={`/servicos/${U}`} label="Serviços e Consultoria" sublabel="Gestão, financeiro e marketing no agro" icon="briefcase" cta="servicos" />
          <LinkButton href={`/sobre/${U}`} label="Sobre o Lucas" sublabel="Trajetória, prêmios e credenciais" icon="user" cta="sobre" />
          <LinkButton href={`/blog/${U}`} label="Blog" sublabel="Artigos práticos de gestão no campo" icon="book" cta="blog" />
        </section>

        {/* Conteúdo & Podcasts */}
        <h2 className="text-white/45 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3 px-1">
          Conteúdo e podcasts
        </h2>
        <section className="space-y-3 mb-7">
          <LinkButton
            href="https://www.youtube.com/playlist?list=PLdv5Ps8k7ij8UDT_9aOTuzs_G5uo6lNva"
            label="NHCast — New Holland"
            sublabel="Host do podcast oficial da New Holland Brasil"
            icon="radio"
            cta="nhcast"
          />
          <LinkButton
            href="https://www.youtube.com/@agrojovempodcast"
            label="Agro Jovem Podcast"
            sublabel="Conversas sobre o futuro do agro"
            icon="headphones"
            cta="agrojovem"
          />
        </section>

        {/* Contato direto */}
        <h2 className="text-white/45 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3 px-1">
          Contato direto
        </h2>
        <section className="space-y-3 mb-9">
          <LinkButton href="mailto:lucas@fluxorural.com.br" label="E-mail" sublabel="lucas@fluxorural.com.br" icon="mail" cta="email" />
          <LinkButton href="tel:+5545991447004" label="Telefone" sublabel="(45) 99144-7004" icon="phone" cta="telefone" />
          <LinkButton href="/contato-lucas-dierings.vcf" label="Salvar contato" sublabel="Baixe o cartão e adicione na agenda" icon="contact" download cta="vcard" />
        </section>

        {/* Redes sociais */}
        <SocialRow />

        {/* Rodapé */}
        <footer className="mt-9 text-center">
          <a
            href={`https://fluxorural.com.br/${U}`}
            className="text-white/60 hover:text-dourado text-sm transition-colors"
          >
            Ver site completo →
          </a>
          <p className="text-white/30 text-xs mt-4">
            © {new Date().getFullYear()} Fluxo Rural Consultoria
          </p>
        </footer>
      </div>
    </main>
  )
}
