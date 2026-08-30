import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import AnalyticsGate from '@/components/analytics/AnalyticsGate'
import AttributionCapture from '@/components/analytics/AttributionCapture'
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
    template: '%s | Fluxo Rural',
  },
  description: 'Lucas Dierings - Engenheiro Agrônomo, MBA USP/ESALQ, vencedor nacional CNA Jovem. Referência em gestão financeira rural, inovação e estratégia no agronegócio brasileiro. Consultoria, liderança e palestras. Londrina, PR.',
  keywords: [
    'Lucas Dierings',
    'Lucas Dierings agrônomo',
    'Lucas Dierings consultor agronegócio',
    'Lucas Dierings palestrante',
    'Fluxo Rural Consultoria',
    'consultoria agronegócio Londrina',
    'gestão financeira rural Paraná',
    'gestão fazenda produtiva',
    'liderança no agronegócio',
    'empreendedorismo rural',
    'palestra liderança agronegócio',
    'palestra inteligência artificial agronegócio',
    'inovação agronegócio Brasil',
    'rentabilidade safra soja',
    'engenheiro agrônomo consultor Londrina',
    'NHCast New Holland podcast',
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
    siteName: 'Fluxo Rural Consultoria - Lucas Dierings',
    title: 'Lucas Dierings | Consultoria, Liderança e Palestras no Agronegócio',
    description: 'Engenheiro Agrônomo e consultor estratégico. Referência em gestão, inovação e estratégia no agronegócio brasileiro. Conheça os serviços de Lucas Dierings.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lucas Dierings - Fluxo Rural Consultoria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Dierings | Fluxo Rural Consultoria',
    description: 'Referência em gestão, inovação e estratégia no agronegócio brasileiro.',
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
    canonical: '/',
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lucas Dierings',
  givenName: 'Lucas',
  familyName: 'Dierings',
  jobTitle: 'Engenheiro Agrônomo (CREA-PR 179906/D), Consultor Estratégico e Palestrante',
  description: 'Lucas Dierings é Engenheiro Agrônomo (CREA-PR 179906/D) formado pela UFPR com MBA em Agronegócios pela ESALQ/USP, vencedor nacional do prêmio CNA Jovem 2021, host do podcast NHCast New Holland e professor de MBA na PUCPR. Referência nacional em gestão financeira rural, inovação tecnológica e gestão estratégica no agronegócio brasileiro.',
  url: 'https://fluxorural.com.br',
  image: 'https://fluxorural.com.br/images/lucas-hero.jpg',
  email: 'lucas@fluxorural.com.br',
  telephone: '+5545991447004',
  sameAs: [
    'https://www.linkedin.com/in/lucas-dierings/',
    'https://www.instagram.com/lucasdierings.agro/',
    'https://fluxorural.com.br',
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: 'Engenheiro Agrônomo',
      recognizedBy: {
        '@type': 'Organization',
        name: 'CREA-PR',
      },
      identifier: 'CREA-PR 179906/D',
    },
  ],
  alumniOf: [
    {
      '@type': 'EducationalOrganization',
      name: 'Universidade Federal do Paraná (UFPR)',
      description: 'Engenharia Agronômica',
    },
    {
      '@type': 'EducationalOrganization',
      name: 'ESALQ-USP',
      description: 'MBA em Agronegócios',
    },
  ],
  knowsAbout: [
    'Gestão financeira rural',
    'Agronegócio brasileiro',
    'Inovação no campo',
    'Liderança no agronegócio',
    'Empreendedorismo rural',
    'Inteligência artificial no agronegócio',
    'Gestão estratégica de fazendas',
    'Rentabilidade agrícola',
    'Sucessão familiar rural',
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
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Fluxo Rural Consultoria',
  description: 'Consultoria estratégica em gestão financeira, inovação e liderança no agronegócio brasileiro. Consultoria e palestras com Lucas Dierings, Engenheiro Agrônomo CREA-PR 179906/D.',
  url: 'https://fluxorural.com.br',
  telephone: '+5545991447004',
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
    'Liderança e Empreendedorismo no Agronegócio',
    'Palestras sobre Inovação no Agronegócio',
    'Consultoria em Gestão e Inovação Rural',
  ],
  priceRange: 'Consulte',
  sameAs: [
    'https://www.linkedin.com/in/lucas-dierings/',
    'https://www.instagram.com/lucasdierings.agro/',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Fluxo Rural Consultoria - Lucas Dierings',
  url: 'https://fluxorural.com.br',
  description: 'Site oficial de Lucas Dierings, engenheiro agrônomo CREA-PR 179906/D e consultor referência em gestão, inovação e estratégia no agronegócio brasileiro.',
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
        <link rel="alternate" type="text/plain" href="https://fluxorural.com.br/llms.txt" title="LLMs.txt" />
      </head>
      <body className="font-body bg-[#0A192F] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-white">
        {/* GA4 + GTM do site principal, com guard de rota (não carrega em /beweather). */}
        <AnalyticsGate />
        {/* Primeiro toque (UTM/gclid) em cookie de 90 dias - vale em todo o site. */}
        <AttributionCapture />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  )
}
