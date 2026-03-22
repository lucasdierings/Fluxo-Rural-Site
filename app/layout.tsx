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
    default: 'Fluxo Rural Consultoria | Lucas Dierings',
    template: '%s | Fluxo Rural Consultoria',
  },
  description: 'Lucas Dierings — Engenheiro Agrônomo, MBA USP/ESALQ, vencedor nacional CNA Jovem. Consultoria, mentoria e palestras em gestão e inovação no agronegócio. Londrina, PR.',
  keywords: [
    'consultoria agronegócio Londrina',
    'gestão financeira rural Paraná',
    'mentoria sucessão familiar fazenda',
    'palestra inteligência artificial agronegócio',
    'Lucas Dierings consultor',
    'Fluxo Rural Consultoria',
    'engenheiro agrônomo consultor Londrina',
    'rentabilidade safra soja',
  ],
  authors: [{ name: 'Lucas Dierings' }],
  creator: 'Fluxo Rural Consultoria',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Fluxo Rural Consultoria',
    title: 'Fluxo Rural Consultoria | Lucas Dierings',
    description: 'Consultoria, Mentoria e Palestras em Gestão, Inovação e Sucessão no Agronegócio.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fluxo Rural Consultoria | Lucas Dierings',
    description: 'Consultoria, Mentoria e Palestras em Gestão, Inovação e Sucessão no Agronegócio.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lucas Dierings',
  jobTitle: 'Engenheiro Agrônomo e Consultor Estratégico',
  description: 'Engenheiro agrônomo, MBA USP/ESALQ, destaque nacional CNA Jovem 2021, host do NHCast New Holland, professor de MBA na PUCPR, consultor do SENAR/PR. Especializado em gestão e inovação no agronegócio brasileiro.',
  url: 'https://fluxorural.com.br',
  image: 'https://fluxorural.com.br/images/lucas-hero.jpg',
  sameAs: [
    'https://linkedin.com/in/lucasdierings',
    'https://www.instagram.com/lucasdierings.agro/',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Fluxo Rural Consultoria',
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
  '@type': 'LocalBusiness',
  name: 'Fluxo Rural Consultoria',
  description: 'Consultoria em gestão, inovação e sucessão no agronegócio.',
  url: 'https://fluxorural.com.br',
  email: 'lucas@fluxorural.com.br',
  founder: { '@type': 'Person', name: 'Lucas Dierings' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Londrina',
    addressRegion: 'PR',
    addressCountry: 'BR',
  },
  areaServed: { '@type': 'Country', name: 'Brasil' },
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
