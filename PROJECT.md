# Project: Fluxo Rural Technical SEO/GEO Optimization & Blog Editorial Review

## Architecture
Next.js 16 (App Router, `output: 'export'`) with static export, Cloudflare Pages hosting, TypeScript strict mode, MDX blog engine (`content/blog/`), and next-sitemap + custom llms-full pipeline.

Data Flow & Layers:
1. **Discovery & Crawling Layer**: `next-sitemap.config.js` -> `out/robots.txt` / `public/robots.txt`, `app/layout.tsx` (`<link rel="help">`), `public/_headers` (Cloudflare Pages HTTP headers).
2. **Semantic Knowledge Graph (JSON-LD)**: `lib/seo.ts` (centralized Person, Organization, Schema generators) -> `app/blog/[slug]/page.tsx` (Article/TechArticle, BreadcrumbList, FAQPage).
3. **Content & Editorial Layer**: `content/blog/*.mdx` -> `lib/mdx.ts` (frontmatter parser with keywords, about, mentions, citations) -> MDX renderer with BLUF, quantitative data, institutional sources, and Markdown tables.
4. **LLM Synthesis & RAG Layer**: `content/llms-full-base.txt` + `content/blog/*.mdx` -> `scripts/generate-llms-full.mjs` -> `public/llms-full.txt` & `out/llms-full.txt`.
5. **Quality & Verification Layer**: `tests/` (`tests/mdx-article-validation.test.mjs`, `tests/seo-m2.test.mjs`, `tests/blog-geo-validation.test.mjs`, `tests/llms-citation-infrastructure.test.mjs`, `tests/challenger-adversarial-seo-geo.test.mjs`), `npm run typecheck`, `npm test`, `npm run build`.

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | AI Bot Allow Directives in robots.txt | Explicit Allow for 13 AI bots (OAI-SearchBot, ChatGPT-User, GPTBot, PerplexityBot, ClaudeBot, Claude-Web, Google-Extended, GoogleOther, Applebot-Extended, Bingbot, Bytespider, Amazonbot, FacebookBot) in `next-sitemap.config.js` | M1 | R1 | VERIFIED |
| 2 | LLM Discovery Links in Root Layout | Add `<link rel="help" type="text/markdown" href="/llms.txt">` and `<link rel="help" type="text/markdown" href="/llms-full.txt">` to `app/layout.tsx` | M1 | R1 | VERIFIED |
| 3 | Cloudflare HTTP Headers for LLMs and Blog | Configure CORS (`Access-Control-Allow-Origin: *`), MIME type, cache headers, and `X-Robots-Tag: index, follow` in `public/_headers` | M1 | R1 | VERIFIED |
| 4 | robots.txt Sync in postbuild | Update `package.json` postbuild script to synchronize `out/robots.txt` with `public/robots.txt` | M1 | R1 | VERIFIED |
| 5 | Centralized SEO/Schema Module (`lib/seo.ts`) | Create `lib/seo.ts` with `LUCAS_DIERINGS_PERSON` (CREA-PR 179906/D, UFPR, MBA USP/ESALQ, CNA Jovem, PUCPR, SENAR-PR, sameAs), `FLUXO_RURAL_ORGANIZATION`, and JSON-LD generators | M2 | R2 | VERIFIED |
| 6 | MDX Interface Extension | Extend `BlogPost` in `lib/mdx.ts` to parse `keywords`, `tags`, `about`, `mentions`, `citations`, and `schemaType` | M2 | R2 | VERIFIED |
| 7 | Enhanced Article/TechArticle Schema | Emit `@type: "Article"` with `additionalType: "https://schema.org/TechArticle"`, `inLanguage: "pt-BR"`, `keywords`, `about`, `mentions`, `citation` in `app/blog/[slug]/page.tsx` | M2 | R2 | VERIFIED |
| 8 | Canonical Trailing Slash Consistency | Enforce trailing slash on `postUrl` (`${siteUrl}/blog/${post.slug}/`), Breadcrumb items, Publisher URL, `app/agrojovem/page.tsx`, and `app/layout.tsx` search action | M2 | R2 | VERIFIED |
| 9 | Structured BreadcrumbList & FAQPage | Unify `@id` properties (`#breadcrumb`, `#faq`) and guarantee canonical URL references in `app/blog/[slug]/page.tsx` | M2 | R2 | VERIFIED |
| 10 | LLMs Pipeline Enrichment | Update `scripts/generate-llms-full.mjs` and `content/llms-full-base.txt` with formal citation blocks (ABNT), executive TL;DRs, key questions, and data sources | M3 | R3 | VERIFIED |
| 11 | LLMs Files Synchronization | Ensure `public/llms.txt`, `public/llms-full.txt`, and `out/llms-full.txt` are perfectly synchronized via `npm run postbuild` | M3 | R3 | VERIFIED |
| 12 | Critical MDX Articles Expansion (<1k words) | Expand `inteligencia-artificial-no-campo...` and `sucessao-familiar-agronegocio...` (>1,500 words, simulations, and comparison tables) | M4 | R4 | VERIFIED |
| 13 | Comparison Tables for Articles with 0 Tables | Add Markdown comparison tables to `5-indicadores-financeiros...`, `apagao-de-lideranca...`, `inteligencia-artificial...`, and `sucessao-familiar...` | M4 | R4 | VERIFIED |
| 14 | BLUF & Institutional Citations in Blog | Ensure BLUF in conceptual sections and nominal citations of Conab, Embrapa, Cepea/Esalq, Deral, MAPA, IBGE across all 11 articles | M4 | R4 | VERIFIED |
| 15 | Blog Frontmatter Semantic Enrichment | Add `keywords`, `about`, `mentions`, `citations` to MDX articles | M4 | R4 | VERIFIED |
| 16 | E2E Automated Blog & SEO Test Suite | Create `tests/blog-geo-validation.test.mjs` verifying all 11 articles (word count, tables >= 1, frontmatter, institutional citations, valid MDX) and testing robots/JSON-LD | E2E | Acceptance | VERIFIED |
| 17 | Final Acceptance & Forensic Integrity Audit | Complete execution of `npm run typecheck`, `npm test`, `npm run build`, and independent forensic audit | M5 | Acceptance | VERIFIED |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | AI Crawlers, Robots & Link Discovery | `next-sitemap.config.js`, `app/layout.tsx`, `public/_headers`, `package.json` | None | DONE |
| M2 | Semantic JSON-LD E-E-A-T & Canonical Consistency | `lib/seo.ts`, `lib/mdx.ts`, `app/blog/[slug]/page.tsx`, `app/agrojovem/page.tsx`, `components/blog/AuthorCard.tsx` | None | DONE |
| E2E | E2E Test Suite & Validation Harness | `tests/blog-geo-validation.test.mjs`, `TEST_INFRA.md`, `TEST_READY.md` | None | DONE |
| M3 | LLMs.txt Pipeline & Citation Infrastructure | `scripts/generate-llms-full.mjs`, `content/llms-full-base.txt`, `public/llms.txt` | M1, M2 | DONE |
| M4 | GEO Editorial Review of MDX Blog Articles | `content/blog/*.mdx` (all 11 articles) | M2 | DONE |
| M5 | Final Acceptance & Forensic Audit | Verification across all acceptance criteria, builds, tests, and auditor | M1, M2, M3, M4, E2E | DONE (Gate: PASS, Audit: CLEAN) |

## Interface Contracts
### `lib/seo.ts` ↔ `app/blog/[slug]/page.tsx`
- Exports:
  - `LUCAS_DIERINGS_PERSON`: Person schema with `@id: 'https://fluxorural.com.br/#lucas-dierings'`, `CREA-PR 179906/D`, credentials, alumni, sameAs.
  - `FLUXO_RURAL_ORGANIZATION`: Organization schema with `@id: 'https://fluxorural.com.br/#organization'`.
  - `generateArticleJsonLd(post: BlogPost, siteUrl?: string): object`
  - `generateBreadcrumbJsonLd(items: Array<{ name: string; url?: string }>, siteUrl?: string): object`
  - `generateFaqJsonLd(faqs: FAQ[], pageUrl: string): object | null`
  - `ensureTrailingSlash(url: string): string`

### `lib/mdx.ts` ↔ `content/blog/*.mdx` & `scripts/generate-llms-full.mjs`
- `BlogPost` interface fields:
  - `keywords?: string[] | string`
  - `tags?: string[]`
  - `about?: Array<{ name: string; sameAs?: string; description?: string } | string>`
  - `mentions?: Array<{ name: string; sameAs?: string } | string>`
  - `citations?: string[]`
  - `schemaType?: 'Article' | 'TechArticle'`

### Build & Export Contract
- `npm run typecheck` exits with 0.
- `npm test` passes 159/159 tests (20 suites, 100% pass rate).
- `npm run build` runs Turbopack build and `postbuild` generating `out/`, `sitemap.xml`, `robots.txt`, `llms-full.txt`.
