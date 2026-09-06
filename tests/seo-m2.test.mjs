import test from 'node:test'
import assert from 'node:assert'
import {
  LUCAS_DIERINGS_PERSON,
  FLUXO_RURAL_ORGANIZATION,
  ensureTrailingSlash,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
} from '../lib/seo.ts'
import { getPostBySlug } from '../lib/mdx.ts'

test('LUCAS_DIERINGS_PERSON semantic E-E-A-T structure', () => {
  assert.strictEqual(LUCAS_DIERINGS_PERSON['@type'], 'Person')
  assert.strictEqual(
    LUCAS_DIERINGS_PERSON['@id'],
    'https://fluxorural.com.br/#lucas-dierings'
  )
  assert.strictEqual(LUCAS_DIERINGS_PERSON.name, 'Lucas Dierings')
  assert.strictEqual(LUCAS_DIERINGS_PERSON.url, 'https://fluxorural.com.br/sobre/')

  // CREA credential and identifier
  assert.strictEqual(LUCAS_DIERINGS_PERSON.identifier.propertyID, 'CREA-PR')
  assert.strictEqual(LUCAS_DIERINGS_PERSON.identifier.value, '179906/D')
  assert.strictEqual(
    LUCAS_DIERINGS_PERSON.hasCredential.name,
    'Engenheiro Agrônomo'
  )
  assert.strictEqual(
    LUCAS_DIERINGS_PERSON.hasCredential.identifier,
    'CREA-PR 179906/D'
  )
  assert.strictEqual(
    LUCAS_DIERINGS_PERSON.hasCredential.recognizedBy.name,
    'CREA-PR'
  )

  // Alumni & Awards & Affiliations
  const alumniNames = LUCAS_DIERINGS_PERSON.alumniOf.map((a) => a.name)
  assert.ok(alumniNames.some((n) => n.includes('ESALQ')))
  assert.ok(alumniNames.some((n) => n.includes('UFPR')))

  assert.ok(LUCAS_DIERINGS_PERSON.award.includes('CNA Jovem'))

  const affiliations = LUCAS_DIERINGS_PERSON.affiliation.map((a) => a.name)
  assert.ok(affiliations.includes('SENAR-PR'))
  assert.ok(affiliations.includes('PUCPR'))

  // sameAs social profiles and canonical /sobre/
  assert.ok(
    LUCAS_DIERINGS_PERSON.sameAs.includes(
      'https://www.youtube.com/@agrojovempodcast'
    )
  )
  assert.ok(
    LUCAS_DIERINGS_PERSON.sameAs.includes('https://fluxorural.com.br/sobre/')
  )
  assert.ok(
    LUCAS_DIERINGS_PERSON.sameAs.some((s) => s.includes('linkedin.com'))
  )
  assert.ok(
    LUCAS_DIERINGS_PERSON.sameAs.some((s) => s.includes('instagram.com'))
  )
})

test('FLUXO_RURAL_ORGANIZATION semantic structure', () => {
  assert.strictEqual(FLUXO_RURAL_ORGANIZATION['@type'], 'Organization')
  assert.strictEqual(
    FLUXO_RURAL_ORGANIZATION['@id'],
    'https://fluxorural.com.br/#organization'
  )
  assert.strictEqual(
    FLUXO_RURAL_ORGANIZATION.name,
    'Fluxo Rural Consultoria'
  )
  assert.strictEqual(FLUXO_RURAL_ORGANIZATION.url, 'https://fluxorural.com.br/')
  assert.strictEqual(FLUXO_RURAL_ORGANIZATION.logo['@type'], 'ImageObject')
  assert.ok(FLUXO_RURAL_ORGANIZATION.logo.url.endsWith('logo-fluxo-rural.png'))
})

test('ensureTrailingSlash handles diverse URL shapes', () => {
  // Protocol roots
  assert.strictEqual(
    ensureTrailingSlash('https://fluxorural.com.br'),
    'https://fluxorural.com.br/'
  )
  assert.strictEqual(
    ensureTrailingSlash('https://fluxorural.com.br/'),
    'https://fluxorural.com.br/'
  )

  // Subpaths
  assert.strictEqual(
    ensureTrailingSlash('https://fluxorural.com.br/blog'),
    'https://fluxorural.com.br/blog/'
  )
  assert.strictEqual(
    ensureTrailingSlash('https://fluxorural.com.br/blog/slug'),
    'https://fluxorural.com.br/blog/slug/'
  )
  assert.strictEqual(
    ensureTrailingSlash('https://fluxorural.com.br/blog/slug/'),
    'https://fluxorural.com.br/blog/slug/'
  )

  // Relative paths
  assert.strictEqual(ensureTrailingSlash('/sobre'), '/sobre/')
  assert.strictEqual(ensureTrailingSlash('/sobre/'), '/sobre/')
  assert.strictEqual(ensureTrailingSlash('/'), '/')

  // File assets preservation
  assert.strictEqual(
    ensureTrailingSlash('https://fluxorural.com.br/logo.png'),
    'https://fluxorural.com.br/logo.png'
  )
  assert.strictEqual(
    ensureTrailingSlash('/images/photo.jpg'),
    '/images/photo.jpg'
  )

  // Query parameters and hash fragments
  assert.strictEqual(
    ensureTrailingSlash('/blog/post?preview=true'),
    '/blog/post/?preview=true'
  )
  assert.strictEqual(
    ensureTrailingSlash('https://fluxorural.com.br/blog#faq'),
    'https://fluxorural.com.br/blog/#faq'
  )
})

test('generateArticleJsonLd produces compliant Article and TechArticle schema', () => {
  const mockPost = {
    slug: 'teste-artigo-tecnico',
    title: 'Como Calcular o Custo Operacional de Máquinas',
    excerpt: 'Guia definitivo de cálculo de depreciação e manutenção horária.',
    category: 'Gestão',
    coverImage: '/images/blog/maquinas.jpg',
    date: '2026-09-01',
    updated: '2026-09-05',
    readingTime: 8,
    content: 'Parágrafo 1 com texto técnico sobre o agronegócio brasileiro.\n\nMais texto detalhado.',
    keywords: ['máquinas agrícolas', 'custo horário', 'depreciação'],
    about: [
      { name: 'Depreciação', sameAs: 'https://pt.wikipedia.org/wiki/Deprecia%C3%A7%C3%A3o' },
      'Gestão Agrícola',
    ],
    mentions: [
      { name: 'Embrapa', sameAs: 'https://www.embrapa.br' },
      'Conab',
    ],
    citations: [
      'Embrapa Gestão Territorial (2024)',
      'Conab Custos de Produção (2025)',
    ],
  }

  const jsonLd = generateArticleJsonLd(mockPost)

  // Type assertions (must pass existing '@type: Article' assertion)
  assert.strictEqual(jsonLd['@context'], 'https://schema.org')
  assert.strictEqual(jsonLd['@type'], 'Article')
  assert.strictEqual(
    jsonLd.additionalType,
    'https://schema.org/TechArticle'
  )
  assert.strictEqual(
    jsonLd['@id'],
    'https://fluxorural.com.br/blog/teste-artigo-tecnico/#article'
  )
  assert.strictEqual(jsonLd.headline, mockPost.title)
  assert.strictEqual(jsonLd.description, mockPost.excerpt)
  assert.strictEqual(
    jsonLd.image,
    'https://fluxorural.com.br/images/blog/maquinas.jpg'
  )
  assert.strictEqual(jsonLd.inLanguage, 'pt-BR')
  assert.strictEqual(jsonLd.articleSection, 'Gestão')
  assert.strictEqual(jsonLd.isAccessibleForFree, true)

  // Canonical page URL with trailing slash
  assert.strictEqual(
    jsonLd.mainEntityOfPage['@id'],
    'https://fluxorural.com.br/blog/teste-artigo-tecnico/'
  )

  // Author and Publisher
  assert.strictEqual(jsonLd.author['@id'], 'https://fluxorural.com.br/#lucas-dierings')
  assert.strictEqual(jsonLd.publisher['@id'], 'https://fluxorural.com.br/#organization')

  // Speakable
  assert.deepStrictEqual(jsonLd.speakable, {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'article p'],
  })

  // Keywords, About, Mentions, Citation
  assert.strictEqual(
    jsonLd.keywords,
    'máquinas agrícolas, custo horário, depreciação'
  )
  assert.strictEqual(jsonLd.about.length, 2)
  assert.strictEqual(jsonLd.about[0].name, 'Depreciação')
  assert.strictEqual(
    jsonLd.about[0].sameAs,
    'https://pt.wikipedia.org/wiki/Deprecia%C3%A7%C3%A3o'
  )
  assert.strictEqual(jsonLd.about[1].name, 'Gestão Agrícola')

  assert.strictEqual(jsonLd.mentions.length, 2)
  assert.strictEqual(jsonLd.mentions[0].name, 'Embrapa')
  assert.strictEqual(jsonLd.mentions[0].sameAs, 'https://www.embrapa.br')
  assert.strictEqual(jsonLd.mentions[1].name, 'Conab')

  assert.deepStrictEqual(jsonLd.citation, [
    'Embrapa Gestão Territorial (2024)',
    'Conab Custos de Produção (2025)',
  ])
})

test('generateBreadcrumbJsonLd formats list with canonical trailing slashes', () => {
  const items = [
    { name: 'Início', url: 'https://fluxorural.com.br' },
    { name: 'Blog', url: 'https://fluxorural.com.br/blog' },
    { name: 'Artigo', url: 'https://fluxorural.com.br/blog/artigo-1' },
  ]

  const breadcrumbs = generateBreadcrumbJsonLd(
    items,
    'https://fluxorural.com.br/blog/artigo-1/'
  )
  assert.strictEqual(breadcrumbs['@type'], 'BreadcrumbList')
  assert.strictEqual(
    breadcrumbs['@id'],
    'https://fluxorural.com.br/blog/artigo-1/#breadcrumb'
  )
  assert.strictEqual(breadcrumbs.itemListElement.length, 3)

  assert.strictEqual(breadcrumbs.itemListElement[0].position, 1)
  assert.strictEqual(
    breadcrumbs.itemListElement[0].item,
    'https://fluxorural.com.br/'
  )

  assert.strictEqual(breadcrumbs.itemListElement[1].position, 2)
  assert.strictEqual(
    breadcrumbs.itemListElement[1].item,
    'https://fluxorural.com.br/blog/'
  )

  assert.strictEqual(breadcrumbs.itemListElement[2].position, 3)
  assert.strictEqual(
    breadcrumbs.itemListElement[2].item,
    'https://fluxorural.com.br/blog/artigo-1/'
  )
})

test('generateFaqJsonLd formats FAQs with #faq @id', () => {
  assert.strictEqual(generateFaqJsonLd([], 'https://fluxorural.com.br/blog/artigo/'), null)
  assert.strictEqual(generateFaqJsonLd(undefined, 'https://fluxorural.com.br/blog/artigo/'), null)

  const faqs = [
    { question: 'Qual a vida útil de um trator?', answer: 'Em média 10.000 a 12.000 horas.' },
    { question: 'Como diluir custos fixos?', answer: 'Aumentando as horas anuais de uso.' },
  ]

  const faqSchema = generateFaqJsonLd(faqs, 'https://fluxorural.com.br/blog/artigo/')
  assert.ok(faqSchema)
  assert.strictEqual(faqSchema['@type'], 'FAQPage')
  assert.strictEqual(faqSchema['@id'], 'https://fluxorural.com.br/blog/artigo/#faq')
  assert.strictEqual(faqSchema.mainEntity.length, 2)
  assert.strictEqual(faqSchema.mainEntity[0]['@type'], 'Question')
  assert.strictEqual(faqSchema.mainEntity[0].name, faqs[0].question)
  assert.strictEqual(faqSchema.mainEntity[0].acceptedAnswer.text, faqs[0].answer)
})

test('lib/mdx.ts parses real article and provides BlogPost interface compatibility', () => {
  const post = getPostBySlug('prestacao-servico-maquinas-agricolas-como-rentabilizar')
  assert.ok(post, 'Post should be found by slug')
  assert.strictEqual(typeof post.title, 'string')
  assert.strictEqual(typeof post.slug, 'string')
  assert.ok(post.readingTime > 0)
  assert.ok(Array.isArray(post.faqs))
})
