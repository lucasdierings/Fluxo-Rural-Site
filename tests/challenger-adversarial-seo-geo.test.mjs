import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import matter from 'gray-matter'
import {
  LUCAS_DIERINGS_PERSON,
  FLUXO_RURAL_ORGANIZATION,
  ensureTrailingSlash,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
} from '../lib/seo.ts'

const ROOT_DIR = process.cwd()
const BLOG_DIR = path.join(ROOT_DIR, 'content/blog')
const OUT_BLOG_DIR = path.join(ROOT_DIR, 'out/blog')
const PUBLIC_ROBOTS = path.join(ROOT_DIR, 'public/robots.txt')
const OUT_ROBOTS = path.join(ROOT_DIR, 'out/robots.txt')

const EXPECTED_AI_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'PerplexityBot',
  'ClaudeBot',
  'Claude-Web',
  'Google-Extended',
  'GoogleOther',
  'Applebot-Extended',
  'Bingbot',
  'Bytespider',
  'Amazonbot',
  'FacebookBot',
]

function parseRobotsTxt(content) {
  const lines = content.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
  const policies = {}
  let currentAgents = []

  for (const line of lines) {
    const [directive, ...rest] = line.split(':')
    const key = directive.trim().toLowerCase()
    const val = rest.join(':').trim()

    if (key === 'user-agent') {
      currentAgents.push(val)
      if (!policies[val]) policies[val] = { allow: [], disallow: [] }
    } else if (key === 'allow') {
      for (const agent of currentAgents) {
        policies[agent].allow.push(val)
      }
    } else if (key === 'disallow') {
      for (const agent of currentAgents) {
        policies[agent].disallow.push(val)
      }
    } else {
      currentAgents = []
    }
  }
  return policies
}

describe('Challenger Adversarial Audit: AI Crawling, Canonical URLs & Metadata Infrastructure', () => {
  describe('Suite 1: Empirical Verification of 13 AI Bots in robots.txt', () => {
    it('verifies public/robots.txt allows all 13 specified AI bots with Allow: /', () => {
      assert.ok(fs.existsSync(PUBLIC_ROBOTS), `Missing ${PUBLIC_ROBOTS}`)
      const content = fs.readFileSync(PUBLIC_ROBOTS, 'utf8')
      const policies = parseRobotsTxt(content)

      for (const bot of EXPECTED_AI_BOTS) {
        assert.ok(policies[bot], `Bot ${bot} missing from public/robots.txt`)
        assert.ok(
          policies[bot].allow.includes('/'),
          `Bot ${bot} does not have Allow: / in public/robots.txt (has: ${policies[bot].allow})`
        )
        assert.strictEqual(
          policies[bot].disallow.length,
          0,
          `Bot ${bot} has unexpected disallows in public/robots.txt: ${policies[bot].disallow}`
        )
      }
    })

    it('verifies out/robots.txt allows all 13 specified AI bots with Allow: /', () => {
      assert.ok(fs.existsSync(OUT_ROBOTS), `Missing ${OUT_ROBOTS}`)
      const content = fs.readFileSync(OUT_ROBOTS, 'utf8')
      const policies = parseRobotsTxt(content)

      for (const bot of EXPECTED_AI_BOTS) {
        assert.ok(policies[bot], `Bot ${bot} missing from out/robots.txt`)
        assert.ok(
          policies[bot].allow.includes('/'),
          `Bot ${bot} does not have Allow: / in out/robots.txt (has: ${policies[bot].allow})`
        )
        assert.strictEqual(
          policies[bot].disallow.length,
          0,
          `Bot ${bot} has unexpected disallows in out/robots.txt: ${policies[bot].disallow}`
        )
      }
    })

    it('verifies exact 100% parity between public/robots.txt and out/robots.txt', () => {
      const pub = fs.readFileSync(PUBLIC_ROBOTS, 'utf8')
      const out = fs.readFileSync(OUT_ROBOTS, 'utf8')
      assert.strictEqual(pub, out, 'public/robots.txt and out/robots.txt must be bitwise identical')
    })

    it('verifies sitemap and host declarations in both robots.txt files', () => {
      for (const filePath of [PUBLIC_ROBOTS, OUT_ROBOTS]) {
        const content = fs.readFileSync(filePath, 'utf8')
        assert.match(
          content,
          /Sitemap:\s*https:\/\/fluxorural\.com\.br\/sitemap\.xml/i,
          `Canonical sitemap URL declaration missing in ${filePath}`
        )
        assert.match(
          content,
          /Host:\s*https:\/\/fluxorural\.com\.br/i,
          `Host declaration missing in ${filePath}`
        )
      }
    })
  })

  describe('Suite 2: Empirical Verification of Static Blog HTML Outputs (out/blog/[slug]/index.html)', () => {
    assert.ok(fs.existsSync(OUT_BLOG_DIR), `out/blog directory must exist at ${OUT_BLOG_DIR}`)
    const blogSubdirs = fs
      .readdirSync(OUT_BLOG_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort()

    it('discovers all published blog subdirectories in out/blog matching published MDX files', () => {
      const mdxFiles = fs
        .readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))
        .map((f) => f.replace(/\.mdx$/, ''))
        .sort()

      assert.strictEqual(blogSubdirs.length, mdxFiles.length, `Expected ${mdxFiles.length} blog routes in out/blog, found ${blogSubdirs.length}`)
      assert.deepStrictEqual(blogSubdirs, mdxFiles, 'Generated blog output slugs must match published MDX files')
    })

    for (const slug of blogSubdirs) {
      it(`verifies out/blog/${slug}/index.html canonical tag, JSON-LD Article, Author CREA, and Breadcrumbs`, () => {
        const htmlPath = path.join(OUT_BLOG_DIR, slug, 'index.html')
        assert.ok(fs.existsSync(htmlPath), `Missing index.html for slug ${slug}`)
        const html = fs.readFileSync(htmlPath, 'utf8')

        // 1. Canonical tag check
        const canonicalMatch =
          html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
          html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)

        assert.ok(canonicalMatch, `Slug ${slug} missing canonical link tag`)
        const canonicalHref = canonicalMatch[1]
        const expectedCanonical = `https://fluxorural.com.br/blog/${slug}/`
        assert.strictEqual(
          canonicalHref,
          expectedCanonical,
          `Slug ${slug} canonical tag mismatch: got ${canonicalHref}, expected ${expectedCanonical}`
        )
        assert.ok(
          canonicalHref.endsWith('/'),
          `Slug ${slug} canonical tag must have a trailing slash: ${canonicalHref}`
        )

        // 2. Parse all JSON-LD blocks
        const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi
        let match
        const schemas = []
        while ((match = jsonLdRegex.exec(html)) !== null) {
          try {
            const parsed = JSON.parse(match[1])
            schemas.push(parsed)
          } catch (err) {
            assert.fail(`Slug ${slug} contains malformed JSON-LD: ${err.message}`)
          }
        }
        assert.ok(schemas.length > 0, `Slug ${slug} must have at least 1 JSON-LD script`)

        // 3. Validate Article schema
        const articleSchema = schemas.find((s) => s['@type'] === 'Article')
        assert.ok(articleSchema, `Slug ${slug} missing @type: "Article" schema`)
        assert.strictEqual(
          articleSchema.additionalType,
          'https://schema.org/TechArticle',
          `Slug ${slug} missing additionalType: "https://schema.org/TechArticle"`
        )
        assert.strictEqual(
          articleSchema['@id'],
          `${expectedCanonical}#article`,
          `Slug ${slug} article @id mismatch: ${articleSchema['@id']}`
        )
        assert.strictEqual(
          articleSchema.mainEntityOfPage?.['@id'],
          expectedCanonical,
          `Slug ${slug} article mainEntityOfPage @id mismatch: ${articleSchema.mainEntityOfPage?.['@id']}`
        )
        assert.strictEqual(articleSchema.inLanguage, 'pt-BR')

        // 4. Validate Author Lucas Dierings & CREA
        const author = articleSchema.author
        assert.ok(author, `Slug ${slug} article missing author entity`)
        assert.strictEqual(author['@type'], 'Person')
        assert.strictEqual(
          author['@id'],
          'https://fluxorural.com.br/#lucas-dierings',
          `Slug ${slug} author @id must be unified to https://fluxorural.com.br/#lucas-dierings`
        )
        assert.strictEqual(author.name, 'Lucas Dierings')

        // Verify CREA-PR 179906/D presence in author credentials
        const hasCreaIdentifier =
          author.identifier?.propertyID === 'CREA-PR' && author.identifier?.value === '179906/D'
        const hasCreaCredential = author.hasCredential?.identifier === 'CREA-PR 179906/D'
        const hasCreaInJobTitle =
          typeof author.jobTitle === 'string' && author.jobTitle.includes('CREA-PR 179906/D')
        const hasCreaInDesc =
          typeof author.description === 'string' && author.description.includes('CREA-PR 179906/D')

        assert.ok(
          hasCreaIdentifier && hasCreaCredential && (hasCreaInJobTitle || hasCreaInDesc),
          `Slug ${slug} author missing rigorous CREA-PR 179906/D accreditation fields`
        )

        // 5. Validate BreadcrumbList schema
        const breadcrumbSchema = schemas.find((s) => s['@type'] === 'BreadcrumbList')
        assert.ok(breadcrumbSchema, `Slug ${slug} missing BreadcrumbList schema`)
        assert.strictEqual(
          breadcrumbSchema['@id'],
          `${expectedCanonical}#breadcrumb`,
          `Slug ${slug} breadcrumb @id mismatch: got ${breadcrumbSchema['@id']}, expected ${expectedCanonical}#breadcrumb`
        )
        assert.ok(
          Array.isArray(breadcrumbSchema.itemListElement),
          `Slug ${slug} breadcrumb itemListElement must be an array`
        )
        assert.strictEqual(
          breadcrumbSchema.itemListElement.length,
          3,
          `Slug ${slug} breadcrumb should have 3 hierarchy levels (Home, Blog, Post)`
        )

        // Check trailing slash on ALL hierarchy levels
        for (const item of breadcrumbSchema.itemListElement) {
          assert.ok(item.item, `Slug ${slug} breadcrumb item missing url: ${JSON.stringify(item)}`)
          assert.ok(
            item.item.endsWith('/'),
            `Slug ${slug} breadcrumb level "${item.name}" url "${item.item}" does not have trailing slash`
          )
        }

        assert.strictEqual(breadcrumbSchema.itemListElement[0].item, 'https://fluxorural.com.br/')
        assert.strictEqual(breadcrumbSchema.itemListElement[1].item, 'https://fluxorural.com.br/blog/')
        assert.strictEqual(breadcrumbSchema.itemListElement[2].item, expectedCanonical)

        // 6. Validate FAQPage schema if MDX defines faqs
        const mdxRaw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8')
        const { data: frontmatter } = matter(mdxRaw)
        if (Array.isArray(frontmatter.faqs) && frontmatter.faqs.length > 0) {
          const faqSchema = schemas.find((s) => s['@type'] === 'FAQPage')
          assert.ok(faqSchema, `Slug ${slug} has FAQs in MDX but missing FAQPage schema in HTML`)
          assert.strictEqual(
            faqSchema['@id'],
            `${expectedCanonical}#faq`,
            `Slug ${slug} FAQPage @id mismatch: ${faqSchema['@id']}`
          )
          assert.strictEqual(
            faqSchema.mainEntity.length,
            frontmatter.faqs.length,
            `Slug ${slug} FAQ count mismatch between MDX (${frontmatter.faqs.length}) and HTML (${faqSchema.mainEntity.length})`
          )
        }
      })
    }
  })

  describe('Suite 3: Adversarial Stress-Testing of lib/seo.ts Edge Cases', () => {
    describe('ensureTrailingSlash Stress Harness', () => {
      const edgeCases = [
        // Protocol roots
        ['https://fluxorural.com.br', 'https://fluxorural.com.br/'],
        ['https://fluxorural.com.br/', 'https://fluxorural.com.br/'],
        ['http://localhost:3000', 'http://localhost:3000/'],
        ['http://localhost:3000/', 'http://localhost:3000/'],

        // Relative routes
        ['/blog', '/blog/'],
        ['/blog/', '/blog/'],
        ['/sobre', '/sobre/'],
        ['/sobre/', '/sobre/'],
        ['/', '/'],
        ['', ''],

        // Query parameters
        ['/blog?q=trator', '/blog/?q=trator'],
        ['/blog/?q=trator', '/blog/?q=trator'],
        ['https://fluxorural.com.br/blog?categoria=gestao&ano=2026', 'https://fluxorural.com.br/blog/?categoria=gestao&ano=2026'],
        ['https://fluxorural.com.br?origem=ads', 'https://fluxorural.com.br/?origem=ads'],

        // Hash anchors
        ['#faq', '#faq'],
        ['#article', '#article'],
        ['/blog#faq', '/blog/#faq'],
        ['/blog/#faq', '/blog/#faq'],
        ['https://fluxorural.com.br/blog#faq', 'https://fluxorural.com.br/blog/#faq'],

        // Query + Hash combined
        ['/blog?q=soja#resultados', '/blog/?q=soja#resultados'],
        ['/blog/?q=soja#resultados', '/blog/?q=soja#resultados'],
        ['https://fluxorural.com.br/blog?q=soja#resultados', 'https://fluxorural.com.br/blog/?q=soja#resultados'],

        // File extensions preservation (strictly no trailing slash)
        ['https://fluxorural.com.br/sitemap.xml', 'https://fluxorural.com.br/sitemap.xml'],
        ['https://fluxorural.com.br/robots.txt', 'https://fluxorural.com.br/robots.txt'],
        ['https://fluxorural.com.br/logo.png', 'https://fluxorural.com.br/logo.png'],
        ['https://fluxorural.com.br/assets/guia.pdf', 'https://fluxorural.com.br/assets/guia.pdf'],
        ['/llms.txt', '/llms.txt'],
        ['/llms-full.txt', '/llms-full.txt'],
        ['/images/hero.jpg?v=2', '/images/hero.jpg?v=2'],
        ['/relatorio.pdf#page=3', '/relatorio.pdf#page=3'],

        // Encoded characters and deep nesting
        ['https://fluxorural.com.br/blog/safra%202026', 'https://fluxorural.com.br/blog/safra%202026/'],
        ['/blog/gest%C3%A3o-rural', '/blog/gest%C3%A3o-rural/'],
        ['https://fluxorural.com.br/a/b/c/d/e', 'https://fluxorural.com.br/a/b/c/d/e/'],
      ]

      for (const [input, expected] of edgeCases) {
        it(`normalizes "${input}" -> "${expected}"`, () => {
          assert.strictEqual(ensureTrailingSlash(input), expected)
        })
      }
    })

    describe('generateArticleJsonLd Adversarial Inputs', () => {
      it('handles minimal post with zero optional fields without throwing', () => {
        const minimal = {
          slug: 'artigo-adversarial-minimo',
          title: 'Artigo Adversarial Mínimo',
          excerpt: 'Resumo com caracteres suficientes para validação.',
          date: '2026-09-05',
          category: 'Gestão',
          coverImage: '/images/test.jpg',
        }
        const ld = generateArticleJsonLd(minimal)
        assert.strictEqual(ld['@type'], 'Article')
        assert.strictEqual(ld.additionalType, 'https://schema.org/TechArticle')
        assert.strictEqual(ld['@id'], 'https://fluxorural.com.br/blog/artigo-adversarial-minimo/#article')
        assert.strictEqual(ld.dateModified, '2026-09-05')
        assert.strictEqual(ld.keywords, undefined)
        assert.strictEqual(ld.about, undefined)
        assert.strictEqual(ld.mentions, undefined)
        assert.strictEqual(ld.citation, undefined)
      })

      it('correctly handles relative coverImage without leading slash', () => {
        const post = {
          slug: 'teste-img',
          title: 'Teste Imagem',
          excerpt: 'Resumo...',
          date: '2026-09-05',
          category: 'Inovação',
          coverImage: 'images/foto.jpg',
        }
        const ld = generateArticleJsonLd(post)
        assert.strictEqual(ld.image, 'https://fluxorural.com.br/images/foto.jpg')
      })

      it('prioritizes keywords over tags and handles string vs array', () => {
        const postKeywordsArray = {
          slug: 'teste-kw-1',
          title: 'Teste KW 1',
          excerpt: '...',
          date: '2026-09-05',
          category: 'Mercado',
          coverImage: '/img.jpg',
          keywords: ['milho', 'soja', 'trigo'],
          tags: ['ignorado'],
        }
        assert.strictEqual(generateArticleJsonLd(postKeywordsArray).keywords, 'milho, soja, trigo')

        const postKeywordsString = {
          slug: 'teste-kw-2',
          title: 'Teste KW 2',
          excerpt: '...',
          date: '2026-09-05',
          category: 'Mercado',
          coverImage: '/img.jpg',
          keywords: 'apenas, uma, string',
        }
        assert.strictEqual(generateArticleJsonLd(postKeywordsString).keywords, 'apenas, uma, string')

        const postTagsOnly = {
          slug: 'teste-kw-3',
          title: 'Teste KW 3',
          excerpt: '...',
          date: '2026-09-05',
          category: 'Mercado',
          coverImage: '/img.jpg',
          tags: ['fallback', 'tags'],
        }
        assert.strictEqual(generateArticleJsonLd(postTagsOnly).keywords, 'fallback, tags')
      })

      it('normalizes heterogeneous about and mentions entities', () => {
        const post = {
          slug: 'teste-entidades',
          title: 'Teste Entidades',
          excerpt: '...',
          date: '2026-09-05',
          category: 'Agronegócio',
          coverImage: '/img.jpg',
          about: [
            'Simples String',
            { name: 'Conab', sameAs: 'https://conab.gov.br', description: 'Companhia' },
            { name: 'Embrapa' },
          ],
          mentions: [
            'MAPA',
            { name: 'Cepea', sameAs: 'https://cepea.esalq.usp.br' },
          ],
        }
        const ld = generateArticleJsonLd(post)
        assert.strictEqual(ld.about.length, 3)
        assert.deepStrictEqual(ld.about[0], { '@type': 'Thing', name: 'Simples String' })
        assert.deepStrictEqual(ld.about[1], {
          '@type': 'Thing',
          name: 'Conab',
          sameAs: 'https://conab.gov.br',
          description: 'Companhia',
        })
        assert.deepStrictEqual(ld.about[2], { '@type': 'Thing', name: 'Embrapa' })

        assert.strictEqual(ld.mentions.length, 2)
        assert.deepStrictEqual(ld.mentions[0], { '@type': 'Thing', name: 'MAPA' })
        assert.deepStrictEqual(ld.mentions[1], {
          '@type': 'Thing',
          name: 'Cepea',
          sameAs: 'https://cepea.esalq.usp.br',
        })
      })

      it('computes wordCount accurately from content string', () => {
        const post = {
          slug: 'teste-wordcount',
          title: 'Teste WordCount',
          excerpt: '...',
          date: '2026-09-05',
          category: 'Gestão',
          coverImage: '/img.jpg',
          content: '  Uma   duas  três quatro \n\n cinco seis   sete.  ',
        }
        const ld = generateArticleJsonLd(post)
        assert.strictEqual(ld.wordCount, 7)
      })
    })

    describe('generateBreadcrumbJsonLd and generateFaqJsonLd Edge Cases', () => {
      it('handles breadcrumb items without url', () => {
        const items = [{ name: 'Home', url: 'https://fluxorural.com.br' }, { name: 'Página Final' }]
        const bc = generateBreadcrumbJsonLd(items)
        assert.strictEqual(bc.itemListElement.length, 2)
        assert.strictEqual(bc.itemListElement[0].item, 'https://fluxorural.com.br/')
        assert.strictEqual(bc.itemListElement[1].item, undefined)
      })

      it('returns null for empty, undefined, or null FAQs', () => {
        assert.strictEqual(generateFaqJsonLd([], 'https://fluxorural.com.br/blog/slug/'), null)
        assert.strictEqual(generateFaqJsonLd(undefined, 'https://fluxorural.com.br/blog/slug/'), null)
        assert.strictEqual(generateFaqJsonLd(null, 'https://fluxorural.com.br/blog/slug/'), null)
      })

      it('generates valid FAQPage schema with correctly formatted questions and answers', () => {
        const faqs = [
          { question: 'Qual a rentabilidade?', answer: 'Entre 15% e 25% conforme Conab.' },
        ]
        const faq = generateFaqJsonLd(faqs, 'https://fluxorural.com.br/blog/slug')
        assert.strictEqual(faq['@type'], 'FAQPage')
        assert.strictEqual(faq['@id'], 'https://fluxorural.com.br/blog/slug/#faq')
        assert.strictEqual(faq.mainEntity.length, 1)
        assert.strictEqual(faq.mainEntity[0].name, 'Qual a rentabilidade?')
        assert.strictEqual(faq.mainEntity[0].acceptedAnswer.text, 'Entre 15% e 25% conforme Conab.')
      })
    })
  })
})
