import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { createRequire } from 'node:module'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

const require = createRequire(import.meta.url)
import {
  LUCAS_DIERINGS_PERSON,
  FLUXO_RURAL_ORGANIZATION,
  ensureTrailingSlash,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
} from '../lib/seo.ts'

// --- Constants & Config ---
const ROOT_DIR = process.cwd()
const BLOG_DIR = path.join(ROOT_DIR, 'content/blog')
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')
const HEADERS_PATH = path.join(PUBLIC_DIR, '_headers')
const ROBOTS_PATH = path.join(PUBLIC_DIR, 'robots.txt')
const SITEMAP_CONFIG_PATH = path.join(ROOT_DIR, 'next-sitemap.config.js')
const LAYOUT_PATH = path.join(ROOT_DIR, 'app/layout.tsx')

export const ALLOWED_CATEGORIES = [
  'Gestão',
  'Inovação',
  'Marketing',
  'Agronegócio',
  'Governança',
  'Mercado',
]

export const REQUIRED_AI_BOTS = [
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

export const INSTITUTIONAL_SOURCES = [
  'Conab',
  'Embrapa',
  'Cepea',
  'Deral',
  'MAPA',
  'IBGE',
]

// --- Helper Functions ---

/**
 * Returns all published .mdx files, explicitly excluding _template.mdx or any draft prefix.
 */
export function getPublishedBlogFiles() {
  assert.ok(fs.existsSync(BLOG_DIR), `Blog directory must exist at ${BLOG_DIR}`)
  const files = fs.readdirSync(BLOG_DIR)
  return files
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))
    .sort()
}

/**
 * Validates frontmatter against expected metadata schema.
 * Returns an array of error messages (empty if valid).
 */
export function validateFrontmatterSchema(data) {
  const errors = []
  if (typeof data.title !== 'string' || data.title.trim().length < 15) {
    errors.push('title must be a descriptive string with >= 15 characters')
  }
  if (typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push(`date must be in YYYY-MM-DD format, received '${data.date}'`)
  }
  if (typeof data.category !== 'string' || !ALLOWED_CATEGORIES.includes(data.category)) {
    errors.push(`category '${data.category}' must be one of: ${ALLOWED_CATEGORIES.join(', ')}`)
  }
  if (typeof data.readingTime !== 'number' || data.readingTime <= 0) {
    errors.push(`readingTime must be a positive number, received ${data.readingTime}`)
  }
  if (typeof data.excerpt !== 'string' || data.excerpt.length < 80 || data.excerpt.length > 350) {
    errors.push(`excerpt must be between 80 and 350 characters, received length ${data.excerpt?.length}`)
  }
  if (!Array.isArray(data.faqs) || data.faqs.length < 3) {
    errors.push(`faqs must be an array with >= 3 items, received ${Array.isArray(data.faqs) ? data.faqs.length : 'non-array'}`)
  } else {
    data.faqs.forEach((faq, idx) => {
      if (typeof faq.question !== 'string' || faq.question.trim().length < 5) {
        errors.push(`faqs[${idx}].question must be a non-empty string >= 5 chars`)
      }
      if (typeof faq.answer !== 'string' || faq.answer.trim().length < 10) {
        errors.push(`faqs[${idx}].answer must be a non-empty string >= 10 chars`)
      }
    })
  }
  return errors
}

/**
 * Extracts and returns all markdown tables outside code fences.
 */
export function extractMarkdownTables(content) {
  const lines = content.split('\n')
  let insideCodeBlock = false
  const tableBlocks = []
  let currentTable = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim().startsWith('```')) {
      insideCodeBlock = !insideCodeBlock
      continue
    }
    if (insideCodeBlock) continue

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      currentTable.push({ lineIndex: i + 1, text: line.trim() })
    } else {
      if (currentTable.length > 0) {
        tableBlocks.push([...currentTable])
        currentTable = []
      }
    }
  }
  if (currentTable.length > 0) {
    tableBlocks.push([...currentTable])
  }
  return tableBlocks
}

/**
 * Validates syntax, separator formatting, and column alignments of a markdown table.
 * Returns an array of error messages (empty if valid).
 */
export function validateTableStructure(table) {
  const errors = []
  if (table.length < 3) {
    errors.push(`Table starting at line ${table[0]?.lineIndex || 'unknown'} has fewer than 3 lines (requires header, separator, and data rows)`)
    return errors
  }

  const headerCols = table[0].text.split('|').slice(1, -1).map((c) => c.trim())
  const sepCols = table[1].text.split('|').slice(1, -1).map((c) => c.trim())

  if (headerCols.length !== sepCols.length) {
    errors.push(`Table header has ${headerCols.length} columns, but separator has ${sepCols.length} at line ${table[1].lineIndex}`)
  }

  for (let c = 0; c < sepCols.length; c++) {
    const sep = sepCols[c]
    if (!/^:?-+:?$/.test(sep)) {
      errors.push(`Table column ${c + 1} separator '${sep}' is invalid at line ${table[1].lineIndex}`)
    }
  }

  for (let r = 2; r < table.length; r++) {
    const rowCols = table[r].text.split('|').slice(1, -1).map((c) => c.trim())
    if (rowCols.length !== headerCols.length) {
      errors.push(`Table row ${r - 1} at line ${table[r].lineIndex} has ${rowCols.length} columns, expected ${headerCols.length}`)
    }
  }

  return errors
}

/**
 * Audits MDX content for unclosed code fences, unescaped tags, and stray braces.
 */
export function checkMdxJsxSafety(content) {
  const lines = content.split('\n')
  let insideCode = false
  let codeFenceCount = 0
  const violations = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim().startsWith('```')) {
      insideCode = !insideCode
      codeFenceCount++
      continue
    }
    if (insideCode) continue

    // Strip inline code blocks
    const stripped = line.replace(/`[^`]+`/g, '')

    // Stray unclosed pseudo-tag
    const tagMatch = stripped.match(/<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*$/)
    if (tagMatch) {
      violations.push({ line: i + 1, type: 'unclosed_jsx_tag', text: line.trim() })
    }

    // Stray unescaped curly brace
    const braceMatch = stripped.match(/[{}]/)
    if (braceMatch) {
      violations.push({ line: i + 1, type: 'stray_curly_brace', text: line.trim() })
    }
  }

  return {
    violations,
    codeFenceCount,
    isBalanced: codeFenceCount % 2 === 0,
  }
}

// ==========================================
// TEST SUITE: Blog & GEO Technical E2E Audit
// ==========================================

describe('Blog & GEO Technical Validation Suite (E2E)', () => {
  const publishedFiles = getPublishedBlogFiles()

  describe('1. Blog Articles Inventory & File Integrity', () => {
    it('detects all published .mdx blog articles (excluding templates)', () => {
      assert.ok(publishedFiles.length >= 10, `Expected at least 10 published articles, found ${publishedFiles.length}`)
      assert.ok(!publishedFiles.includes('_template.mdx'), 'Template file _template.mdx must not be included')
    })

    it('ensures each published article is non-empty and readable as UTF-8', () => {
      for (const file of publishedFiles) {
        const fullPath = path.join(BLOG_DIR, file)
        const stats = fs.statSync(fullPath)
        assert.ok(stats.isFile(), `${file} must be a file`)
        assert.ok(stats.size > 1000, `${file} size (${stats.size} bytes) should be substantial (>1000 bytes)`)
        const content = fs.readFileSync(fullPath, 'utf8')
        assert.ok(content.trim().length > 0, `${file} content must not be empty`)
      }
    })
  })

  describe('2. Frontmatter Schema & Metadata Contract', () => {
    it('validates frontmatter schema across all published articles', () => {
      const allErrors = []
      for (const file of publishedFiles) {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
        const { data } = matter(raw)
        const errors = validateFrontmatterSchema(data)
        if (errors.length > 0) {
          allErrors.push({ file, errors })
        }
      }
      assert.deepEqual(allErrors, [], `Frontmatter validation errors found: ${JSON.stringify(allErrors, null, 2)}`)
    })

    it('verifies coverImage path exists in public/ if defined', () => {
      for (const file of publishedFiles) {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
        const { data } = matter(raw)
        if (data.coverImage) {
          assert.ok(data.coverImage.startsWith('/'), `${file}: coverImage '${data.coverImage}' must start with '/'`)
          const imagePath = path.join(PUBLIC_DIR, data.coverImage)
          assert.ok(fs.existsSync(imagePath), `${file}: coverImage file must exist at ${imagePath}`)
        }
      }
    })

    it('validates semantic SEO enrichment fields when present (keywords, about, mentions, citations)', () => {
      for (const file of publishedFiles) {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
        const { data } = matter(raw)

        if (data.keywords) {
          const isValidKeywords = Array.isArray(data.keywords) || typeof data.keywords === 'string'
          assert.ok(isValidKeywords, `${file}: keywords must be an array or string`)
        }

        if (data.tags) {
          assert.ok(Array.isArray(data.tags), `${file}: tags must be an array`)
        }

        if (data.about) {
          assert.ok(Array.isArray(data.about), `${file}: about must be an array of entities`)
        }

        if (data.mentions) {
          assert.ok(Array.isArray(data.mentions), `${file}: mentions must be an array of entities`)
        }

        if (data.citations) {
          assert.ok(Array.isArray(data.citations), `${file}: citations must be an array of citations`)
        }

        if (data.schemaType) {
          assert.ok(
            ['Article', 'TechArticle'].includes(data.schemaType) || typeof data.schemaType === 'string',
            `${file}: schemaType must be 'Article', 'TechArticle' or valid schema type`
          )
        }
      }
    })
  })

  describe('3. Word Count & Content Depth Analysis', () => {
    it('measures word count across all published articles ensuring substantial depth', () => {
      let totalCorpusWords = 0
      const articleWordCounts = []

      for (const file of publishedFiles) {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
        const { content } = matter(raw)
        const words = content.trim().split(/\s+/).filter(Boolean)
        const count = words.length
        totalCorpusWords += count
        articleWordCounts.push({ file, count })

        // Every published long-form article must have at least 900 words
        assert.ok(
          count >= 900,
          `Article ${file} has ${count} words, expected >= 900 words for long-form authority`
        )
      }

      const averageWords = Math.round(totalCorpusWords / publishedFiles.length)
      assert.ok(
        averageWords >= 1500,
        `Average word count (${averageWords}) should be >= 1500 across the corpus`
      )
      assert.ok(
        totalCorpusWords >= 18000,
        `Total corpus words (${totalCorpusWords}) should exceed 18,000 words`
      )
    })

    it('verifies flagship articles exceed high-density technical depth (>1800 words)', () => {
      const flagshipSlug = 'prestacao-servico-maquinas-agricolas-como-rentabilizar.mdx'
      const raw = fs.readFileSync(path.join(BLOG_DIR, flagshipSlug), 'utf8')
      const { content } = matter(raw)
      const words = content.trim().split(/\s+/).filter(Boolean)
      assert.ok(
        words.length >= 1800,
        `Flagship article ${flagshipSlug} must exceed 1800 words, found ${words.length}`
      )
    })
  })

  describe('4. Markdown Tables Syntax & Column Alignment', () => {
    it('validates formatting, pipe delimiter syntax, and column alignment of all markdown tables', () => {
      let totalTables = 0
      const tableErrors = []

      for (const file of publishedFiles) {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
        const { content } = matter(raw)
        const tables = extractMarkdownTables(content)
        totalTables += tables.length

        tables.forEach((table, idx) => {
          const errors = validateTableStructure(table)
          if (errors.length > 0) {
            tableErrors.push({ file, tableIndex: idx + 1, errors })
          }
        })
      }

      assert.deepEqual(
        tableErrors,
        [],
        `Markdown table syntax violations found: ${JSON.stringify(tableErrors, null, 2)}`
      )
      assert.ok(
        totalTables >= 10,
        `Corpus must contain structured comparison tables (found ${totalTables}, expected >= 10)`
      )
    })
  })

  describe('5. Institutional Source Citations & E-E-A-T Authority', () => {
    it('verifies every published article cites authoritative Brazilian agricultural institutions', () => {
      const uncitedArticles = []

      for (const file of publishedFiles) {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
        const matchedSources = INSTITUTIONAL_SOURCES.filter((src) =>
          new RegExp(`\\b${src}\\b`, 'i').test(raw)
        )

        if (matchedSources.length === 0) {
          uncitedArticles.push(file)
        }
      }

      assert.deepEqual(
        uncitedArticles,
        [],
        `The following articles do not cite any authoritative agricultural institution (Conab, Embrapa, Cepea, Deral, MAPA, IBGE): ${uncitedArticles.join(', ')}`
      )
    })

    it('verifies high-frequency citation of benchmark institutions across the corpus', () => {
      let conabCitations = 0
      let embrapaCitations = 0
      let ibgeCitations = 0

      for (const file of publishedFiles) {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
        if (/\bConab\b/i.test(raw)) conabCitations++
        if (/\bEmbrapa\b/i.test(raw)) embrapaCitations++
        if (/\bIBGE\b/i.test(raw)) ibgeCitations++
      }

      assert.ok(conabCitations >= 8, `Conab should be cited in at least 8 articles (found ${conabCitations})`)
      assert.ok(embrapaCitations >= 8, `Embrapa should be cited in at least 8 articles (found ${embrapaCitations})`)
      assert.ok(ibgeCitations >= 8, `IBGE should be cited in at least 8 articles (found ${ibgeCitations})`)
    })
  })

  describe('6. MDX JSX Safety & Rendering Reliability', () => {
    it('verifies no unescaped JSX tags or curly braces outside code fences', () => {
      const allViolations = []

      for (const file of publishedFiles) {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
        const { content } = matter(raw)
        const { violations } = checkMdxJsxSafety(content)
        if (violations.length > 0) {
          allViolations.push({ file, violations })
        }
      }

      assert.deepEqual(
        allViolations,
        [],
        `Unescaped JSX syntax violations detected: ${JSON.stringify(allViolations, null, 2)}`
      )
    })

    it('verifies all code fences are properly balanced and closed in every article', () => {
      for (const file of publishedFiles) {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
        const { content } = matter(raw)
        const { isBalanced, codeFenceCount } = checkMdxJsxSafety(content)
        assert.ok(
          isBalanced,
          `${file} has an unbalanced number of triple backtick code fences (${codeFenceCount})`
        )
      }
    })

    it('verifies embedded images have valid markdown syntax and local assets exist in public/', () => {
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
      let totalImages = 0

      for (const file of publishedFiles) {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
        const { content } = matter(raw)
        let match

        while ((match = imageRegex.exec(content)) !== null) {
          const imgUrl = match[2]
          totalImages++
          if (imgUrl.startsWith('/')) {
            const localAsset = path.join(PUBLIC_DIR, imgUrl)
            assert.ok(fs.existsSync(localAsset), `${file}: Embedded image not found at ${localAsset}`)
          }
        }
      }

      assert.ok(totalImages > 0, `Corpus should contain didactic images (found ${totalImages})`)
    })
  })

  describe('7. AI Crawler & Bot Directives (robots.txt & next-sitemap.config.js)', () => {
    it('validates next-sitemap.config.js includes Allow for all 13 modern AI bots', () => {
      assert.ok(fs.existsSync(SITEMAP_CONFIG_PATH), `next-sitemap.config.js must exist at ${SITEMAP_CONFIG_PATH}`)
      const config = require(SITEMAP_CONFIG_PATH)
      assert.ok(config.generateRobotsTxt, 'generateRobotsTxt must be true')
      assert.ok(config.robotsTxtOptions?.policies, 'robotsTxtOptions.policies must be configured')

      const policies = config.robotsTxtOptions.policies
      const userAgents = policies.map((p) => p.userAgent)

      for (const bot of REQUIRED_AI_BOTS) {
        assert.ok(
          userAgents.includes(bot),
          `next-sitemap.config.js is missing Allow policy for AI bot: ${bot}`
        )
        const policy = policies.find((p) => p.userAgent === bot)
        assert.strictEqual(policy.allow, '/', `Bot ${bot} must have allow: '/'`)
      }
    })

    it('verifies wildcard Allow policy and protection of private routes', () => {
      const config = require(SITEMAP_CONFIG_PATH)
      const policies = config.robotsTxtOptions.policies
      const wildcardPolicy = policies.find((p) => p.userAgent === '*')
      assert.ok(wildcardPolicy, 'Must include wildcard userAgent *')
      assert.strictEqual(wildcardPolicy.allow, '/', 'Wildcard userAgent must have allow: /')

      assert.ok(Array.isArray(config.exclude), 'Excludes must be an array')
      assert.ok(config.exclude.includes('/api/*'), 'Excludes must protect /api/*')
      assert.ok(config.exclude.includes('/dashboard/*'), 'Excludes must protect /dashboard/*')
    })

    it('validates public/robots.txt contains Allow for all 13 AI bots and points to canonical sitemap', () => {
      assert.ok(fs.existsSync(ROBOTS_PATH), `public/robots.txt must exist at ${ROBOTS_PATH}`)
      const robotsContent = fs.readFileSync(ROBOTS_PATH, 'utf8')

      for (const bot of REQUIRED_AI_BOTS) {
        assert.match(
          robotsContent,
          new RegExp(`User-agent:\\s*${bot}[\\r\\n]+Allow:\\s*\\/`, 'i'),
          `public/robots.txt must explicitly allow ${bot}`
        )
      }

      assert.match(
        robotsContent,
        /Sitemap:\s*https:\/\/fluxorural\.com\.br\/sitemap\.xml/i,
        'public/robots.txt must declare canonical sitemap URL'
      )
    })
  })

  describe('8. Cloudflare Pages HTTP Headers (public/_headers)', () => {
    it('validates HTTP headers for /llms.txt (CORS, markdown MIME, cache, X-Robots-Tag)', () => {
      assert.ok(fs.existsSync(HEADERS_PATH), `public/_headers must exist at ${HEADERS_PATH}`)
      const headersContent = fs.readFileSync(HEADERS_PATH, 'utf8')

      assert.ok(headersContent.includes('/llms.txt'), '/llms.txt section must exist in _headers')
      assert.match(headersContent, /\/llms\.txt[\s\S]*?Content-Type:\s*text\/markdown;\s*charset=utf-8/i)
      assert.match(headersContent, /\/llms\.txt[\s\S]*?Access-Control-Allow-Origin:\s*\*/i)
      assert.match(headersContent, /\/llms\.txt[\s\S]*?X-Robots-Tag:\s*index,\s*follow/i)
      assert.match(headersContent, /\/llms\.txt[\s\S]*?Cache-Control:/i)
    })

    it('validates HTTP headers for /llms-full.txt (CORS, markdown MIME, cache, X-Robots-Tag)', () => {
      const headersContent = fs.readFileSync(HEADERS_PATH, 'utf8')

      assert.ok(headersContent.includes('/llms-full.txt'), '/llms-full.txt section must exist in _headers')
      assert.match(headersContent, /\/llms-full\.txt[\s\S]*?Content-Type:\s*text\/markdown;\s*charset=utf-8/i)
      assert.match(headersContent, /\/llms-full\.txt[\s\S]*?Access-Control-Allow-Origin:\s*\*/i)
      assert.match(headersContent, /\/llms-full\.txt[\s\S]*?X-Robots-Tag:\s*index,\s*follow/i)
      assert.match(headersContent, /\/llms-full\.txt[\s\S]*?Cache-Control:/i)
    })

    it('validates blog route headers for /blog/* (X-Robots-Tag with large preview)', () => {
      const headersContent = fs.readFileSync(HEADERS_PATH, 'utf8')

      assert.ok(headersContent.includes('/blog/*'), '/blog/* section must exist in _headers')
      assert.match(headersContent, /\/blog\/\*[\s\S]*?X-Robots-Tag:\s*index,\s*follow/i)
      assert.match(headersContent, /\/blog\/\*[\s\S]*?max-image-preview:large/i)
    })

    it('validates global security headers in /*', () => {
      const headersContent = fs.readFileSync(HEADERS_PATH, 'utf8')

      assert.match(headersContent, /X-Frame-Options:\s*DENY/i)
      assert.match(headersContent, /X-Content-Type-Options:\s*nosniff/i)
      assert.match(headersContent, /Referrer-Policy:\s*strict-origin-when-cross-origin/i)
    })
  })

  describe('9. LLM Discovery & Navigation Links in Root Layout', () => {
    it('verifies <link rel="help"> tags for /llms.txt and /llms-full.txt in app/layout.tsx', () => {
      assert.ok(fs.existsSync(LAYOUT_PATH), `app/layout.tsx must exist at ${LAYOUT_PATH}`)
      const layoutContent = fs.readFileSync(LAYOUT_PATH, 'utf8')

      assert.match(
        layoutContent,
        /<link\s+[^>]*rel="help"[^>]*href="\/llms\.txt"[^>]*\/?>/i,
        'app/layout.tsx must contain <link rel="help" ... href="/llms.txt">'
      )
      assert.match(
        layoutContent,
        /<link\s+[^>]*rel="help"[^>]*href="\/llms-full\.txt"[^>]*\/?>/i,
        'app/layout.tsx must contain <link rel="help" ... href="/llms-full.txt">'
      )
    })
  })

  describe('10. Centralized SEO & Semantic JSON-LD (lib/seo.ts)', () => {
    it('validates LUCAS_DIERINGS_PERSON schema (CREA-PR, credentials, alumni, sameAs)', () => {
      assert.strictEqual(LUCAS_DIERINGS_PERSON['@type'], 'Person')
      assert.strictEqual(LUCAS_DIERINGS_PERSON['@id'], 'https://fluxorural.com.br/#lucas-dierings')
      assert.strictEqual(LUCAS_DIERINGS_PERSON.name, 'Lucas Dierings')
      assert.strictEqual(LUCAS_DIERINGS_PERSON.identifier?.value, '179906/D')
      assert.strictEqual(LUCAS_DIERINGS_PERSON.hasCredential?.identifier, 'CREA-PR 179906/D')

      assert.ok(Array.isArray(LUCAS_DIERINGS_PERSON.alumniOf), 'alumniOf must be an array')
      const alumniNames = LUCAS_DIERINGS_PERSON.alumniOf.map((a) => a.name)
      assert.ok(alumniNames.some((n) => n.includes('USP/ESALQ')), 'alumniOf must include USP/ESALQ')
      assert.ok(alumniNames.some((n) => n.includes('UFPR')), 'alumniOf must include UFPR')

      assert.ok(Array.isArray(LUCAS_DIERINGS_PERSON.sameAs), 'sameAs must be an array')
      assert.ok(LUCAS_DIERINGS_PERSON.sameAs.some((u) => u.includes('linkedin.com')), 'sameAs must include LinkedIn')
      assert.ok(LUCAS_DIERINGS_PERSON.sameAs.some((u) => u.includes('instagram.com')), 'sameAs must include Instagram')
    })

    it('validates FLUXO_RURAL_ORGANIZATION schema (founder, branding, sameAs)', () => {
      assert.strictEqual(FLUXO_RURAL_ORGANIZATION['@type'], 'Organization')
      assert.strictEqual(FLUXO_RURAL_ORGANIZATION['@id'], 'https://fluxorural.com.br/#organization')
      assert.strictEqual(FLUXO_RURAL_ORGANIZATION.name, 'Fluxo Rural Consultoria')
      assert.strictEqual(FLUXO_RURAL_ORGANIZATION.founder['@id'], 'https://fluxorural.com.br/#lucas-dierings')
      assert.ok(Array.isArray(FLUXO_RURAL_ORGANIZATION.sameAs), 'sameAs must be an array')
    })

    it('validates ensureTrailingSlash handles standard paths, URLs, query params, hashes, and files', () => {
      assert.strictEqual(ensureTrailingSlash('https://fluxorural.com.br/blog'), 'https://fluxorural.com.br/blog/')
      assert.strictEqual(ensureTrailingSlash('https://fluxorural.com.br/blog/'), 'https://fluxorural.com.br/blog/')
      assert.strictEqual(ensureTrailingSlash('https://fluxorural.com.br/sitemap.xml'), 'https://fluxorural.com.br/sitemap.xml')
      assert.strictEqual(ensureTrailingSlash('/calculadora'), '/calculadora/')
      assert.strictEqual(ensureTrailingSlash('/blog/artigo?utm_source=test'), '/blog/artigo/?utm_source=test')
      assert.strictEqual(ensureTrailingSlash('/blog/artigo#faq'), '/blog/artigo/#faq')
      assert.strictEqual(ensureTrailingSlash('/assets/doc.pdf'), '/assets/doc.pdf')
      assert.strictEqual(ensureTrailingSlash('#section'), '#section')
      assert.strictEqual(ensureTrailingSlash(''), '')
    })

    it('validates generateArticleJsonLd produces valid Article/TechArticle schema with trailing slash URLs', () => {
      const mockPost = {
        slug: 'teste-artigo',
        title: 'Artigo de Teste para Validação E2E',
        date: '2026-09-05',
        category: 'Gestão',
        coverImage: '/images/teste.jpg',
        readingTime: 7,
        excerpt: 'Resumo de teste com mais de 80 caracteres para validação completa de schema JSON-LD.',
        content: 'Conteúdo de teste com diversas palavras simulando um artigo agronômico.',
      }

      const jsonLd = generateArticleJsonLd(mockPost)
      assert.strictEqual(jsonLd['@context'], 'https://schema.org')
      assert.strictEqual(jsonLd['@type'], 'Article')
      assert.strictEqual(jsonLd.additionalType, 'https://schema.org/TechArticle')
      assert.strictEqual(jsonLd.inLanguage, 'pt-BR')
      assert.strictEqual(jsonLd['@id'], 'https://fluxorural.com.br/blog/teste-artigo/#article')
      assert.strictEqual(jsonLd.mainEntityOfPage?.['@id'], 'https://fluxorural.com.br/blog/teste-artigo/')
      assert.strictEqual(jsonLd.headline, mockPost.title)
      assert.strictEqual(jsonLd.author?.name, 'Lucas Dierings')
      assert.strictEqual(jsonLd.author?.['@id'], 'https://fluxorural.com.br/#lucas-dierings')
      assert.strictEqual(jsonLd.publisher?.name, 'Fluxo Rural Consultoria')
    })

    it('validates generateFaqJsonLd produces valid FAQPage schema', () => {
      const mockFaqs = [
        { question: 'Pergunta 1?', answer: 'Resposta 1 detalhada.' },
        { question: 'Pergunta 2?', answer: 'Resposta 2 detalhada.' },
        { question: 'Pergunta 3?', answer: 'Resposta 3 detalhada.' },
      ]

      const faqSchema = generateFaqJsonLd(mockFaqs, 'https://fluxorural.com.br/blog/artigo/')
      assert.ok(faqSchema, 'FAQ schema should be generated')
      assert.strictEqual(faqSchema['@type'], 'FAQPage')
      assert.strictEqual(faqSchema['@id'], 'https://fluxorural.com.br/blog/artigo/#faq')
      assert.strictEqual(faqSchema.mainEntity.length, 3)
      assert.strictEqual(faqSchema.mainEntity[0]['@type'], 'Question')
      assert.strictEqual(faqSchema.mainEntity[0].name, 'Pergunta 1?')
      assert.strictEqual(faqSchema.mainEntity[0].acceptedAnswer?.text, 'Resposta 1 detalhada.')
    })

    it('validates generateBreadcrumbJsonLd produces valid BreadcrumbList schema', () => {
      const items = [
        { name: 'Início', url: 'https://fluxorural.com.br/' },
        { name: 'Blog', url: 'https://fluxorural.com.br/blog/' },
        { name: 'Artigo Atual', url: 'https://fluxorural.com.br/blog/artigo/' },
      ]

      const breadcrumbs = generateBreadcrumbJsonLd(items)
      assert.strictEqual(breadcrumbs['@type'], 'BreadcrumbList')
      assert.strictEqual(breadcrumbs.itemListElement.length, 3)
      assert.strictEqual(breadcrumbs.itemListElement[0].position, 1)
      assert.strictEqual(breadcrumbs.itemListElement[0].item, 'https://fluxorural.com.br/')
      assert.strictEqual(breadcrumbs.itemListElement[2].item, 'https://fluxorural.com.br/blog/artigo/')
    })
  })

  describe('11. Adversarial & Edge Case Verification', () => {
    it('adversarial: detects malformed table row with missing column delimiter', () => {
      const malformedTable = [
        { lineIndex: 1, text: '| Cabeçalho 1 | Cabeçalho 2 |' },
        { lineIndex: 2, text: '| :--- | :--- |' },
        { lineIndex: 3, text: '| Dado 1 |' }, // Missing 1 column
      ]
      const errors = validateTableStructure(malformedTable)
      assert.ok(errors.length > 0, 'Must report error for mismatched row column count')
      assert.match(errors[0], /expected 2/i)
    })

    it('adversarial: detects invalid separator syntax in table delimiter row', () => {
      const invalidSeparatorTable = [
        { lineIndex: 1, text: '| Coluna A | Coluna B |' },
        { lineIndex: 2, text: '| :--- | invalid_sep |' },
        { lineIndex: 3, text: '| Dado A | Dado B |' },
      ]
      const errors = validateTableStructure(invalidSeparatorTable)
      assert.ok(errors.length > 0, 'Must report error for invalid separator')
      assert.match(errors[0], /separator 'invalid_sep' is invalid/i)
    })

    it('adversarial: detects unclosed JSX tags in MDX content', () => {
      const sampleMdx = `
# Artigo

Aqui está um texto com tag inválida:
<CustomComponent sem fechar

Mais texto normal.
`
      const { violations } = checkMdxJsxSafety(sampleMdx)
      assert.ok(violations.length > 0, 'Must flag unclosed JSX pseudo-tag')
      assert.strictEqual(violations[0].type, 'unclosed_jsx_tag')
    })

    it('adversarial: detects unescaped curly braces in MDX content', () => {
      const sampleMdx = `
# Artigo

O valor é {variavel} fora de bloco de código.
`
      const { violations } = checkMdxJsxSafety(sampleMdx)
      assert.ok(violations.length > 0, 'Must flag unescaped curly brace')
      assert.strictEqual(violations[0].type, 'stray_curly_brace')
    })

    it('adversarial: ensures code blocks with raw < and {} are NOT flagged as violations', () => {
      const codeBlockMdx = `
# Exemplo de Código

\`\`\`tsx
interface Props {
  title: string;
}
export function Component<T>() {
  return <div>{title}</div>
}
\`\`\`

\`const inline = { a: 1 } && <Tag />\`
`
      const { violations, isBalanced } = checkMdxJsxSafety(codeBlockMdx)
      assert.strictEqual(violations.length, 0, 'Code blocks and inline code must not be flagged as violations')
      assert.strictEqual(isBalanced, true, 'Code fences must be balanced')
    })

    it('adversarial: rejects invalid dates, negative readingTime, and empty titles in frontmatter validator', () => {
      const badData = {
        title: 'Curto',
        date: '05/09/2026',
        category: 'Inexistente',
        readingTime: -5,
        excerpt: 'Muito curto',
        faqs: [],
      }
      const errors = validateFrontmatterSchema(badData)
      assert.ok(errors.length >= 5, `Expected >= 5 schema errors, got ${errors.length}`)
    })

    it('adversarial: ensures ensureTrailingSlash preserves complex query strings and file formats', () => {
      const complexUrl = 'https://fluxorural.com.br/blog/pesquisa?query=milho+safrinha&page=2&sort=desc#grafico'
      const normalized = ensureTrailingSlash(complexUrl)
      assert.strictEqual(
        normalized,
        'https://fluxorural.com.br/blog/pesquisa/?query=milho+safrinha&page=2&sort=desc#grafico'
      )

      const feedUrl = 'https://fluxorural.com.br/rss.xml'
      assert.strictEqual(ensureTrailingSlash(feedUrl), 'https://fluxorural.com.br/rss.xml')
    })
  })
})
