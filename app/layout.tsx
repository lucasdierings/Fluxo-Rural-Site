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
    default: 'Lucas Dierings — Consultoria em Agronegócio | Fluxo Rural',
    template: '%s | Lucas Dierings',
  },
  description: 'Lucas Dierings — Engenheiro Agrônomo, MBA USP/ESALQ, destaque nacional CNA Jovem 2021. Consultoria estratégica, mentoria para sucessão familiar e palestras sobre gestão, inovação e IA no agronegócio. Londrina, PR.',
  keywords: [
    'Lucas Dierings',
    'consultoria agronegócio',
    'engenheiro agrônomo Londrina',
    'gestão financeira rural',
    'sucessão familiar propriedade',
    'inteligência artificial agronegócio',
    'mentor agronegócio',
    'palestra agronegócio',
    'consultoria gestão fazenda',
    'Fluxo Rural Consultoria',
  ],
  authors: [{ name: 'Lucas Dierings' }],
  creator: 'Fluxo Rural Consultoria',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Lucas Dierings — Fluxo Rural Consultoria',
    title: 'Lucas Dierings — Consultoria em Agronegócio | Gestão, Inovação e Sucessão',
    description: 'Consultoria estratégica, mentoria para sucessão familiar e palestras sobre gestão, inovação e inteligência artificial no agronegócio. MBA USP/ESALQ, destaque CNA Jovem 2021.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lucas Dierings - Consultoria em Agronegócio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Dierings — Consultoria em Agronegócio',
    description: 'Consultoria estratégica, mentoria para sucessão e palestras sobre gestão no agronegócio.',
    creator: '@lucasdierings.agro',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lucas Dierings',
  alternateName: 'Lucas Dierings Agronegócio',
  jobTitle: ['Engenheiro Agrônomo', 'Consultor Estratégico', 'Palestrante', 'Mentor'],
  description: 'Engenheiro agrônomo com MBA USP/ESALQ, destaque nacional CNA Jovem 2021. Especialista em gestão, inovação e sucessão familiar no agronegócio. Host do podcast NHCast (New Holland Brasil), professor de MBA na PUCPR e consultor SENAR/PR.',
  url: 'https://fluxorural.com.br',
  image: 'https://fluxorural.com.br/images/lucas-hero.jpg',
  email: 'lucas@fluxorural.com.br',
  sameAs: [
    'https://linkedin.com/in/lucasdierings',
    'https://www.instagram.com/lucasdierings.agro/',
    'https://www.youtube.com/@agrojovempodcast',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Fluxo Rural Consultoria',
    url: 'https://fluxorural.com.br',
  },
  knowsAbout: [
    'Gestão de Propriedades Rurais',
    'Inteligência Artificial em Agronegócio',
    'Gestão Financeira Rural',
    'Sucessão Familiar',
    'Inovação Tecnológica',
    'Desenvolvimento Estratégico',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Londrina',
    addressLocality: 'Londrina',
    addressRegion: 'PR',
    postalCode: '',
    addressCountry: 'BR',
  },
  award: 'Destaque Nacional CNA Jovem 2021',
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://fluxorural.com.br',
  name: 'Fluxo Rural Consultoria',
  alternateName: 'Lucas Dierings Consultoria',
  description: 'Consultoria estratégica especializada em gestão, inovação, inteligência artificial e sucessão familiar no agronegócio brasileiro.',
  url: 'https://fluxorural.com.br',
  telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+55-43-99999-9999',
  email: 'lucas@fluxorural.com.br',
  founder: {
    '@type': 'Person',
    name: 'Lucas Dierings',
    jobTitle: 'Engenheiro Agrônomo e Consultor',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Londrina',
    addressRegion: 'PR',
    postalCode: '',
    addressCountry: 'BR',
  },
  areaServed: { '@type': 'Country', name: 'Brasil' },
  serviceType: [
    'Consultoria em Gestão',
    'Mentoria para Sucessão Familiar',
    'Gestão Financeira Rural',
    'Palestras e Workshops',
  ],
  priceRange: '$$',
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Quais serviços Lucas Dierings oferece?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Lucas oferece consultoria em gestão e inovação, mentoria para sucessão familiar, gestão financeira rural e palestras sobre liderança e IA no agronegócio.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Lucas Dierings atende propriedades em qual região?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Embora baseado em Londrina-PR, Lucas atende propriedades em todo Brasil através de consultoria remota, mentoria e palestras em diferentes estados.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Como contratar consultoria com Lucas Dierings?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Você pode entrar em contato através do formulário de contato no site, por WhatsApp ou enviar um email. Lucas retorna em até 24 horas úteis.',
                  },
                },
              ],
            }),
          }}
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
