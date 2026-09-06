import type { BlogPost, FAQ } from './mdx'

export const LUCAS_DIERINGS_PERSON = {
  '@type': 'Person',
  '@id': 'https://fluxorural.com.br/#lucas-dierings',
  name: 'Lucas Dierings',
  jobTitle: 'Engenheiro Agrônomo (CREA-PR 179906/D), Consultor Estratégico e Palestrante',
  url: 'https://fluxorural.com.br/sobre/',
  image: 'https://fluxorural.com.br/images/lucas-hero.jpg',
  description:
    'Engenheiro Agrônomo (CREA-PR 179906/D), pós-graduado em Agronegócios pela USP/ESALQ, consultor em gestão financeira rural, inovação e sucessão familiar no agronegócio e palestrante.',
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'CREA-PR',
    value: '179906/D',
  },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'degree',
    name: 'Engenheiro Agrônomo',
    recognizedBy: {
      '@type': 'Organization',
      name: 'CREA-PR',
    },
    identifier: 'CREA-PR 179906/D',
  },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'USP/ESALQ - MBA em Agronegócios',
      sameAs: 'https://www.esalq.usp.br/',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: 'UFPR - Engenharia Agronômica',
      sameAs: 'https://www.ufpr.br/',
    },
  ],
  award: 'Top 5 Nacional - Prêmio CNA Jovem (2021)',
  affiliation: [
    {
      '@type': 'Organization',
      name: 'SENAR-PR',
      url: 'https://sistemafaep.org.br/',
    },
    {
      '@type': 'Organization',
      name: 'PUCPR',
      url: 'https://www.pucpr.br/',
    },
  ],
  knowsAbout: [
    'Gestão financeira rural',
    'Agronegócio',
    'Sucessão familiar rural',
    'Inovação no agro',
    'Crédito rural',
    'Custos e rendimento de máquinas agrícolas',
    'Governança rural',
  ],
  sameAs: [
    'https://www.linkedin.com/in/lucas-dierings/',
    'https://www.instagram.com/lucasdierings.agro/',
    'https://www.youtube.com/@agrojovempodcast',
    'https://fluxorural.com.br/sobre/',
  ],
} as const

export const FLUXO_RURAL_ORGANIZATION = {
  '@type': 'Organization',
  '@id': 'https://fluxorural.com.br/#organization',
  name: 'Fluxo Rural Consultoria',
  url: 'https://fluxorural.com.br/',
  logo: {
    '@type': 'ImageObject',
    url: 'https://fluxorural.com.br/logo-fluxo-rural.png',
    width: 512,
    height: 512,
  },
  founder: {
    '@id': 'https://fluxorural.com.br/#lucas-dierings',
  },
  sameAs: [
    'https://www.instagram.com/fluxorural/',
    'https://www.linkedin.com/company/fluxo-rural/',
    'https://www.youtube.com/@agrojovempodcast',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: 'https://fluxorural.com.br/contato/',
  },
} as const

/**
 * Ensures that a URL or path has a trailing slash,
 * while preserving query strings, hash fragments, and file extensions.
 */
export function ensureTrailingSlash(url: string): string {
  if (!url) return ''
  if (url.startsWith('#')) return url

  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const parsed = new URL(url)
      const pathname = parsed.pathname
      const lastSegment = pathname.split('/').pop() || ''
      if (!lastSegment.includes('.') && !pathname.endsWith('/')) {
        parsed.pathname = `${pathname}/`
      }
      return parsed.toString()
    }
  } catch {
    // Fall back to path manipulation below
  }

  const [urlWithoutHash, hash] = url.split('#')
  const hashSuffix = hash !== undefined ? `#${hash}` : ''

  const [pathPart, query] = urlWithoutHash.split('?')
  const querySuffix = query !== undefined ? `?${query}` : ''

  const lastSegment = pathPart.split('/').pop() || ''
  if (lastSegment.includes('.')) {
    return `${pathPart}${querySuffix}${hashSuffix}`
  }

  const normalizedPath = pathPart.endsWith('/') ? pathPart : `${pathPart}/`
  return `${normalizedPath}${querySuffix}${hashSuffix}`
}

/**
 * Generates Schema.org Article / TechArticle JSON-LD for a blog post.
 * Emits @type: 'Article' and additionalType: 'https://schema.org/TechArticle'
 * to preserve compatibility with existing tests and schema validators.
 */
export function generateArticleJsonLd(
  post: BlogPost,
  siteUrl: string = 'https://fluxorural.com.br'
): Record<string, any> {
  const baseSiteUrl = ensureTrailingSlash(siteUrl)
  const postUrl = ensureTrailingSlash(`${baseSiteUrl}blog/${post.slug}`)
  const coverImageUrl = post.coverImage.startsWith('http')
    ? post.coverImage
    : `${baseSiteUrl.replace(/\/$/, '')}${post.coverImage.startsWith('/') ? '' : '/'}${post.coverImage}`

  const wordCount = post.content
    ? post.content.split(/\s+/).filter(Boolean).length
    : undefined

  // Keywords normalization (keywords priority over tags)
  let keywordsFormatted: string | undefined = undefined
  if (post.keywords) {
    keywordsFormatted = Array.isArray(post.keywords)
      ? post.keywords.join(', ')
      : String(post.keywords)
  } else if (post.tags && Array.isArray(post.tags)) {
    keywordsFormatted = post.tags.join(', ')
  }

  // About entities normalization
  const aboutEntities =
    Array.isArray(post.about) && post.about.length > 0
      ? post.about.map((item) => {
          if (typeof item === 'string') {
            return {
              '@type': 'Thing',
              name: item,
            }
          }
          return {
            '@type': 'Thing',
            name: item.name,
            ...(item.sameAs ? { sameAs: item.sameAs } : {}),
            ...(item.description ? { description: item.description } : {}),
          }
        })
      : undefined

  // Mentions entities normalization
  const mentionsEntities =
    Array.isArray(post.mentions) && post.mentions.length > 0
      ? post.mentions.map((item) => {
          if (typeof item === 'string') {
            return {
              '@type': 'Thing',
              name: item,
            }
          }
          return {
            '@type': 'Thing',
            name: item.name,
            ...(item.sameAs ? { sameAs: item.sameAs } : {}),
          }
        })
      : undefined

  // Citations normalization
  const citationsList =
    Array.isArray(post.citations) && post.citations.length > 0
      ? post.citations.map((c) =>
          typeof c === 'string' ? c : (c as any).name || String(c)
        )
      : undefined

  const article: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    additionalType: 'https://schema.org/TechArticle',
    '@id': `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    image: coverImageUrl,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    ...(wordCount ? { wordCount } : {}),
    articleSection: post.category,
    inLanguage: 'pt-BR',
    isAccessibleForFree: true,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    author: LUCAS_DIERINGS_PERSON,
    publisher: FLUXO_RURAL_ORGANIZATION,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'article p'],
    },
  }

  if (keywordsFormatted) {
    article.keywords = keywordsFormatted
  }
  if (aboutEntities) {
    article.about = aboutEntities
  }
  if (mentionsEntities) {
    article.mentions = mentionsEntities
  }
  if (citationsList) {
    article.citation = citationsList
  }

  return article
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD with canonical trailing slashes.
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url?: string }>,
  pageOrSiteUrl: string = 'https://fluxorural.com.br/'
): Record<string, any> {
  const targetUrl = ensureTrailingSlash(pageOrSiteUrl)
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${targetUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => {
      const element: Record<string, any> = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      }
      if (item.url) {
        element.item = ensureTrailingSlash(item.url)
      }
      return element
    }),
  }
}

/**
 * Generates Schema.org FAQPage JSON-LD for a list of FAQs.
 * Returns null if no FAQs are present.
 */
export function generateFaqJsonLd(
  faqs: FAQ[] | undefined,
  pageUrl: string
): Record<string, any> | null {
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null

  const canonicalUrl = ensureTrailingSlash(pageUrl)
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
