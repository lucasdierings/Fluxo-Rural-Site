import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fluxorural.com.br'),
  title: {
    default: 'Lucas Dierings | Fluxo Rural Consultoria',
    template: '%s | Lucas Dierings — Fluxo Rural',
  },
  description: 'Lucas Dierings — Engenheiro Agrônomo, MBA USP/ESALQ, vencedor nacional CNA Jovem. Referência em gestão rural, inteligência artificial no agronegócio, inovação e sucessão familiar. Fundador da Fluxo Rural Consultoria. Host do NH Cast (New Holland) e Agro Jovem Podcast. Londrina, PR.',
  keywords: [
    'Lucas Dierings',
    'Lucas Dierings agrônomo',
    'Lucas Dierings consultor agronegócio',
    'Lucas Dierings palestrante',
    'Fluxo Rural',
    'Fluxo Rural Consultoria',
    'Gestão Rural',
    'gestão rural',
    'gestão financeira rural',
    'consultoria agronegócio Londrina',
    'gestão financeira rural Paraná',
    'gestão fazenda produtiva',
    'mentoria sucessão familiar fazenda',
    'Inteligência Artificial no Agronegócio',
    'inteligência artificial agronegócio',
    'IA no agronegócio',
    'palestra inteligência artificial agronegócio',
    'inovação agronegócio Brasil',
    'sucessão familiar rural',
    'rentabilidade safra soja',
    'engenheiro agrônomo consultor Londrina',
    'Agro Jovem Podcast',
    'Agrojovem Podcast',
    'NH CAST',
    'NHCast',
    'NHCast New Holland podcast',
    'NH Cast New Holland',
    'CNA Jovem destaque nacional',
    'MBA USP ESALQ agronegócio',
    'SENAR Paraná consultoria',
    'gestão estratégica propriedade rural',
    'agro inovação tecnologia campo',
  ],
  authors: [{ name: 'Lucas Dierings', url: 'https://fluxorural.com.br' }],
  creator: 'Lucas Dierings',
  publisher: 'Fluxo Rural Consultoria',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://fluxorural.com.br',
    siteName: 'Fluxo Rural Consultoria — Lucas Dierings',
    title: 'Lucas Dierings | Consultoria, Mentoria e Palestras no Agronegócio',
    description: 'Engenheiro Agrônomo e consultor estratégico. Referência em gestão rural, inteligência artificial no agronegócio e sucessão familiar. Host do NH Cast e Agro Jovem Podcast. Conheça os serviços de Lucas Dierings.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lucas Dierings — Fluxo Rural Consultoria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Dierings | Fluxo Rural Consultoria',
    description: 'Referência em gestão, inovação e sucessão no agronegócio brasileiro.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://fluxorural.com.br',
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lucas Dierings',
  givenName: 'Lucas',
  familyName: 'Dierings',
  jobTitle: 'Engenheiro Agrônomo, Consultor Estratégico e Palestrante',
  description: 'Lucas Dierings é engenheiro agrônomo com MBA USP/ESALQ, vencedor nacional do prêmio CNA Jovem 2021, host do podcast NHCast New Holland e professor de MBA na PUCPR. Referência nacional em gestão financeira rural, inovação tecnológica e sucessão familiar no agronegócio brasileiro. Consultor credenciado do SENAR/PR.',
  url: 'https://fluxorural.com.br',
  image: 'https://fluxorural.com.br/images/lucas-hero.jpg',
  email: 'lucas@fluxorural.com.br',
  sameAs: [
    'https://linkedin.com/in/lucasdierings',
    'https://www.instagram.com/lucasdierings.agro/',
    'https://fluxorural.com.br',
  ],
  knowsAbout: [
    'Gestão Rural',
    'Gestão financeira rural',
    'Agronegócio brasileiro',
    'Inovação no campo',
    'Sucessão familiar em propriedades rurais',
    'Inteligência Artificial no Agronegócio',
    'Gestão estratégica de fazendas',
    'Rentabilidade agrícola',
    'Liderança no agronegócio',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Fluxo Rural Consultoria',
    url: 'https://fluxorural.com.br',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Londrina',
    addressRegion: 'PR',
    addressCountry: 'BR',
  },
  alumniOf: [
    {
      '@type': 'Organization',
      name: 'ESALQ-USP',
      description: 'MBA em Agronegócios',
    },
  ],
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Fluxo Rural Consultoria',
  description: 'Consultoria estratégica em gestão financeira, inovação e sucessão no agronegócio brasileiro. Mentoria individual e palestras com Lucas Dierings.',
  url: 'https://fluxorural.com.br',
  telephone: '',
  email: 'lucas@fluxorural.com.br',
  image: 'https://fluxorural.com.br/og-image.png',
  logo: 'https://fluxorural.com.br/logo-fluxo-rural.png',
  founder: {
    '@type': 'Person',
    name: 'Lucas Dierings',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Londrina',
    addressRegion: 'PR',
    addressCountry: 'BR',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Brasil',
  },
  serviceType: [
    'Consultoria em Gestão Financeira Rural',
    'Mentoria Individual para Produtores Rurais',
    'Palestras sobre Inovação no Agronegócio',
    'Consultoria em Sucessão Familiar Rural',
  ],
  priceRange: 'Consulte',
  sameAs: [
    'https://linkedin.com/in/lucasdierings',
    'https://www.instagram.com/lucasdierings.agro/',
  ],
}

const nhCastPodcastJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'PodcastSeries',
  name: 'NH Cast',
  alternateName: ['NHCast', 'NH CAST', 'NHCast New Holland'],
  description: 'Podcast oficial da New Holland Brasil sobre agronegócio, inovação e máquinas agrícolas. Apresentado por Lucas Dierings.',
  url: 'https://fluxorural.com.br',
  image: 'https://fluxorural.com.br/images/nh-cast-logo-azul-fundo-branco.png',
  author: {
    '@type': 'Person',
    name: 'Lucas Dierings',
    url: 'https://fluxorural.com.br',
  },
  productionCompany: {
    '@type': 'Organization',
    name: 'New Holland Brasil',
  },
  inLanguage: 'pt-BR',
}

const agrojovemPodcastJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'PodcastSeries',
  name: 'Agro Jovem Podcast',
  alternateName: ['Agrojovem Podcast', 'AgroJovem Podcast', 'Agro Jovem'],
  description: 'Podcast sobre gestão rural, inovação, finanças e o futuro do agronegócio brasileiro. Apresentado por Lucas Dierings.',
  url: 'https://www.youtube.com/@agrojovempodcast',
  image: 'https://fluxorural.com.br/images/logo-agrojovem.png',
  author: {
    '@type': 'Person',
    name: 'Lucas Dierings',
    url: 'https://fluxorural.com.br',
  },
  inLanguage: 'pt-BR',
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Fluxo Rural Consultoria — Lucas Dierings',
  url: 'https://fluxorural.com.br',
  description: 'Site oficial de Lucas Dierings, engenheiro agrônomo e consultor referência em gestão, inovação e sucessão no agronegócio brasileiro.',
  author: {
    '@type': 'Person',
    name: 'Lucas Dierings',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://fluxorural.com.br/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(nhCastPodcastJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(agrojovemPodcastJsonLd) }}
        />
        <link rel="canonical" href="https://fluxorural.com.br" />
      </head>
      <body className="font-body text-carvao antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingWhatsApp />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
