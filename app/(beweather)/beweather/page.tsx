import type { Metadata } from 'next'
import BeweatherLanding from './BeweatherLanding'

const SITE_URL = 'https://fluxorural.com.br'
const PAGE_URL = `${SITE_URL}/beweather`

export const metadata: Metadata = {
  title: {
    absolute: 'Beweather B2K — Estação Meteorológica Agrícola | 12 Sensores',
  },
  description:
    'Estação meteorológica profissional com 12 sensores, WiFi e painel solar. Dados em tempo real da sua lavoura. R$ 9.900, 12x sem juros, frete grátis.',
  keywords: [
    'estação meteorológica',
    'estação meteorológica agrícola',
    'estação meteorológica profissional',
    'estação meteorológica para fazenda',
    'agricultura de precisão',
    'clima fazenda',
    'janela de pulverização',
    'sensores climáticos lavoura',
    'Beweather B2K',
    'estação meteorológica solar wifi',
    'monitoramento climático rural',
    'dados meteorológicos fazenda',
    'pulverização de defensivos',
    'irrigação inteligente',
    'pluviômetro digital lavoura',
    'evapotranspiração cálculo',
  ],
  alternates: { canonical: '/beweather' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: PAGE_URL,
    siteName: 'Beweather B2K',
    title: 'Beweather B2K — Estação Meteorológica Agrícola | 12 Sensores',
    description:
      '12 sensores, WiFi e painel solar. Clima da sua lavoura em tempo real no celular. R$ 9.900, 12x sem juros, frete grátis.',
    images: [
      {
        url: `${SITE_URL}/beweather/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Estação Meteorológica Beweather B2K em campo ao pôr do sol',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beweather B2K — Estação Meteorológica Agrícola',
    description:
      '12 sensores + WiFi + painel solar. Dados da sua lavoura em tempo real. R$ 9.900, 12x sem juros.',
    images: [`${SITE_URL}/beweather/og-image.jpg`],
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
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  name: 'Beweather',
  url: PAGE_URL,
  logo: `${SITE_URL}/beweather/logo-beweather.jpeg`,
  description:
    'Beweather é uma linha de estações meteorológicas agrícolas profissionais com 12 sensores de precisão, desenvolvida pela B2K Technology Solutions e distribuída no Brasil pela Fluxo Rural Consultoria.',
  sameAs: [
    'https://eprodutor.com.br',
    'https://www.beweather.eprodutor.com.br',
  ],
}

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Beweather B2K',
  sku: 'BEWEATHER-B2K',
  mpn: 'B2K',
  description:
    'Estação meteorológica agrícola profissional com 12 sensores de precisão, conectividade WiFi, Bluetooth, painel solar integrado, bateria de longa duração e GPS. Monitora temperatura, umidade, precipitação, vento, pressão, radiação solar, UV, evapotranspiração e mais. Dados em tempo real no celular, com alerta de janela ideal de pulverização.',
  image: `${SITE_URL}/beweather/estacao-produto-packshot.jpg`,
  brand: { '@type': 'Brand', name: 'Beweather' },
  manufacturer: {
    '@type': 'Organization',
    name: 'B2K Technology Solutions',
  },
  category: 'Estação Meteorológica Agrícola',
  inLanguage: 'pt-BR',
  offers: {
    '@type': 'Offer',
    price: '9900.00',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    url: PAGE_URL,
    priceValidUntil: '2026-12-31',
    seller: {
      '@type': 'Organization',
      name: 'Fluxo Rural Consultoria',
      url: SITE_URL,
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '0',
        currency: 'BRL',
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'BR',
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 2,
          unitCode: 'DAY',
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 3,
          maxValue: 15,
          unitCode: 'DAY',
        },
      },
    },
  },
}

// IMPORTANTE: as Q&A abaixo devem bater VERBATIM com o array FAQ em
// BeweatherLanding.tsx (seção #faq). Google suprime o FAQ rich result se
// o texto do JSON-LD não bater com o texto visível.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'pt-BR',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Funciona em fazenda sem energia elétrica?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. A Beweather tem painel solar integrado e bateria de longa duração — é totalmente autônoma e instala em qualquer ponto da fazenda.',
      },
    },
    {
      '@type': 'Question',
      name: 'Precisa de internet para funcionar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A estação conecta via WiFi. Basta um roteador próximo ou um repetidor no campo para transmitir os dados continuamente para o aplicativo.',
      },
    },
    {
      '@type': 'Question',
      name: 'É difícil instalar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não. Você mesmo instala em cerca de 8 minutos seguindo o vídeo passo a passo. A estação já vem com tudo que você precisa na caixa.',
      },
    },
    {
      '@type': 'Question',
      name: 'Tem mensalidade ou taxa oculta?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não. A plataforma e o aplicativo já estão inclusos no preço da estação. Sem taxas mensais, sem surpresa.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quais as formas de pagamento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cartão de crédito em até 12x sem juros ou PIX à vista com desconto.',
      },
    },
    {
      '@type': 'Question',
      name: 'Os dados são meus?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '100% seus. Você pode exportar todo o histórico de clima da sua lavoura em Excel ou CSV a qualquer momento.',
      },
    },
    {
      '@type': 'Question',
      name: 'Tem garantia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim — 12 meses de garantia de fábrica contra defeitos de fabricação, com suporte técnico especializado em agronomia.',
      },
    },
  ],
}

// BreadcrumbList removido — a landing não tem breadcrumb visível e o
// Google marca como mismatch. Se adicionarmos um breadcrumb visual no
// header da Beweather, reintroduzir o schema.

export default function BeweatherPage() {
  return (
    <>
      {/* AI/LLM discoverability: aponta pro llms.txt dedicado da Beweather */}
      <link
        rel="alternate"
        type="text/plain"
        href={`${SITE_URL}/beweather/llms.txt`}
        title="Beweather B2K — Informações para LLMs"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BeweatherLanding />
    </>
  )
}
