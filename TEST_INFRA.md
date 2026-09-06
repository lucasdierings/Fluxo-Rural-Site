# E2E Test Infra: Fluxo Rural SEO/GEO & Blog Editorial Review

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on internal private implementation details.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise + Workload Testing.
- Native Node test runner (`node:test` and `node:assert`).

## Feature Inventory & Test Mapping
| # | Feature | Requirement | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Combination) |
|---|---------|-------------|:----------------:|:-----------------:|:--------------------:|
| 1 | AI Bot Allow Directives | R1 (robots.txt) | 5 | 5 | ✓ |
| 2 | LLM Discovery Links | R1 (layout.tsx) | 5 | 5 | ✓ |
| 3 | Cloudflare HTTP Headers | R1 (_headers) | 5 | 5 | ✓ |
| 4 | robots.txt Sync postbuild | R1 (package.json) | 5 | 5 | ✓ |
| 5 | Centralized lib/seo.ts | R2 (JSON-LD) | 5 | 5 | ✓ |
| 6 | lib/mdx.ts Extension | R2 (MDX Parser) | 5 | 5 | ✓ |
| 7 | Article/TechArticle Schema | R2 (Schema.org) | 5 | 5 | ✓ |
| 8 | Canonical Trailing Slash | R2 (Canonical URLs) | 5 | 5 | ✓ |
| 9 | BreadcrumbList & FAQPage | R2 (Navigation) | 5 | 5 | ✓ |
| 10 | LLMs Pipeline Enrichment | R3 (generate-llms-full) | 5 | 5 | ✓ |
| 11 | LLMs Files Synchronization | R3 (postbuild sync) | 5 | 5 | ✓ |
| 12 | Critical MDX Expansion | R4 (Content Depth) | 5 | 5 | ✓ |
| 13 | Comparison Tables | R4 (Tables >= 1) | 5 | 5 | ✓ |
| 14 | BLUF & Institutional Sources | R4 (GEO Citations) | 5 | 5 | ✓ |
| 15 | Blog Frontmatter Enrichment | R4 (Keywords/About) | 5 | 5 | ✓ |
| 16 | E2E Automated Validation | Acceptance Criteria | 5 | 5 | ✓ |

## Test Architecture
- Test Runner: `npm test` -> `node --test tests/**/*.test.mjs`
- Test Files:
  - `tests/mdx-article-validation.test.mjs` (Existing: single post benchmark)
  - `tests/blog-geo-validation.test.mjs` (New: comprehensive 11 articles audit + R1/R2/R3/R4 validation)
- Verification Semantics:
  - Exit code 0 on all tests passing.

## Real-World Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | AI Agent Crawls Root Layout and discovers /llms.txt | F1, F2, F3, F10 | High |
| 2 | SearchGPT / Perplexity extracts Article Schema + CREA Author | F5, F7, F8, F9 | High |
| 3 | RAG chunking extracts BLUF, Institutional Sources & Tables from all 11 articles | F12, F13, F14, F15 | High |
| 4 | Static Export & Build integrity check across out/ and public/ | F4, F11, F16 | High |
