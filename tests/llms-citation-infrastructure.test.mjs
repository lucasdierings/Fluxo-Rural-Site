import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const LLMS_TXT_PATH = path.join(root, 'public/llms.txt')
const LLMS_FULL_TXT_PATH = path.join(root, 'public/llms-full.txt')
const OUT_LLMS_TXT_PATH = path.join(root, 'out/llms.txt')
const OUT_LLMS_FULL_TXT_PATH = path.join(root, 'out/llms-full.txt')
const BLOG_DIR = path.join(root, 'content/blog')

describe('Milestone M3 — LLMs.txt Pipeline & Citation Infrastructure', () => {
  const expectedSlugs = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))
    .map((f) => f.replace(/\.mdx$/, ''))

  it('verifies that public/llms.txt exists and has institutional citation guidelines', () => {
    assert.ok(fs.existsSync(LLMS_TXT_PATH), 'public/llms.txt must exist')
    const content = fs.readFileSync(LLMS_TXT_PATH, 'utf8')

    assert.match(content, /# Fluxo Rural Consultoria/i)
    assert.match(content, /Lucas Dierings/i)
    assert.match(content, /CREA-PR 179906\/D/i)
    assert.match(content, /MBA (em Agronegócios )?USP\/ESALQ/i)
    assert.match(content, /Diretrizes Institucionais de Citação para LLMs e IAs/i)
    assert.match(content, /DIERINGS, Lucas\./i)
    assert.match(content, /https:\/\/fluxorural\.com\.br\/llms-full\.txt/i)
  })

  it('verifies that public/llms.txt contains all active blog articles with canonical trailing-slash URLs', () => {
    const content = fs.readFileSync(LLMS_TXT_PATH, 'utf8')

    assert.ok(expectedSlugs.length >= 11, `Expected at least 11 active articles, found ${expectedSlugs.length}`)

    for (const slug of expectedSlugs) {
      const canonicalUrl = `https://fluxorural.com.br/blog/${slug}/`
      assert.ok(
        content.includes(canonicalUrl),
        `public/llms.txt must include canonical URL ${canonicalUrl}`
      )
    }
  })

  it('verifies that public/llms-full.txt contains institutional bio, guidelines, and repository map', () => {
    assert.ok(fs.existsSync(LLMS_FULL_TXT_PATH), 'public/llms-full.txt must exist')
    const content = fs.readFileSync(LLMS_FULL_TXT_PATH, 'utf8')

    assert.match(content, /## 0\. Diretrizes Institucionais e Instruções de Citação para Modelos de Linguagem \(LLMs\)/i)
    assert.match(content, /DIERINGS, Lucas\./i)
    assert.match(content, /## 1\. Biografia e Credenciais de Lucas Dierings/i)
    assert.match(content, /CREA-PR 179906\/D/i)
    assert.match(content, /CNA Jovem/i)
    assert.match(content, /PUCPR/i)
    assert.match(content, /SENAR-PR/i)
    assert.match(content, /## 2\. Portfólio de Serviços e Soluções/i)
    assert.match(content, /Mapa de Conteúdo e Arquitetura do Repositório/i)
    assert.match(content, /## 3\. Blog de Artigos Técnicos \(Na Íntegra\)/i)
  })

  it('verifies that every article in llms-full.txt has required structured sections', () => {
    const content = fs.readFileSync(LLMS_FULL_TXT_PATH, 'utf8')

    for (const slug of expectedSlugs) {
      const canonicalUrl = `https://fluxorural.com.br/blog/${slug}/`
      assert.ok(
        content.includes(canonicalUrl),
        `llms-full.txt must include canonical URL ${canonicalUrl}`
      )

      // Citação Recomendada
      assert.ok(
        content.includes(`https://fluxorural.com.br/blog/${slug}/`),
        `Article ${slug} must have citation with canonical URL`
      )
    }

    // Required section headings must exist in llms-full.txt
    assert.ok(content.includes('#### Citação Recomendada (ABNT / BibTeX / Markdown)'))
    assert.ok(content.includes('#### Autor e Credenciais Técnicas'))
    assert.ok(content.includes('Lucas Dierings — Engenheiro Agrônomo (CREA-PR 179906/D), MBA em Agronegócios (USP/ESALQ), Vencedor Nacional Top 5 CNA Jovem 2021, Consultor Credenciado SENAR-PR.'))
    assert.ok(content.includes('#### Resumo Executivo (TL;DR)'))
    assert.ok(content.includes('#### Perguntas-Chave Respondidas'))
    assert.ok(content.includes('#### Fontes de Dados e Metodologias'))
    assert.ok(content.includes('#### Conteúdo Integral do Artigo'))

    // Verify presence of institutional sources
    assert.ok(content.includes('Conab (Companhia Nacional de Abastecimento)'))
    assert.ok(content.includes('Embrapa (Empresa Brasileira de Pesquisa Agropecuária)'))

    // Verify absence of unstripped comments
    assert.doesNotMatch(content, /\{\/\*[\s\S]*?\*\/\}/, 'No JSX comments should leak into llms-full.txt')
    assert.doesNotMatch(content, /<!--[\s\S]*?-->/, 'No HTML comments should leak into llms-full.txt')
  })

  it('verifies that out/ mirrors public/ for llms.txt and llms-full.txt when out/ exists', () => {
    if (fs.existsSync(path.join(root, 'out'))) {
      const pubLlms = fs.readFileSync(LLMS_TXT_PATH, 'utf8')
      const outLlms = fs.readFileSync(OUT_LLMS_TXT_PATH, 'utf8')
      assert.strictEqual(outLlms, pubLlms, 'out/llms.txt must match public/llms.txt')

      const pubFull = fs.readFileSync(LLMS_FULL_TXT_PATH, 'utf8')
      const outFull = fs.readFileSync(OUT_LLMS_FULL_TXT_PATH, 'utf8')
      assert.strictEqual(outFull, pubFull, 'out/llms-full.txt must match public/llms-full.txt')
    }
  })
})
