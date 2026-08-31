import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import test from 'node:test'
import assert from 'node:assert'

const postSlug = 'prestacao-servico-maquinas-agricolas-como-rentabilizar'
const mdxFilePath = path.join(process.cwd(), 'content/blog', `${postSlug}.mdx`)
const outHtmlPath = path.join(process.cwd(), 'out/blog', postSlug, 'index.html')

test('MDX File exists and can be read', () => {
  assert.ok(fs.existsSync(mdxFilePath), `MDX file should exist at ${mdxFilePath}`)
  const raw = fs.readFileSync(mdxFilePath, 'utf8')
  assert.ok(raw.length > 0, 'File should not be empty')
})

test('Frontmatter Schema and Metadata Validation', () => {
  const raw = fs.readFileSync(mdxFilePath, 'utf8')
  const { data, content } = matter(raw)

  assert.strictEqual(typeof data.title, 'string', 'title should be string')
  assert.ok(data.title.length > 10, 'title should be descriptive')
  
  assert.strictEqual(typeof data.date, 'string', 'date should be string')
  assert.match(data.date, /^\d{4}-\d{2}-\d{2}$/, 'date should be YYYY-MM-DD')

  assert.strictEqual(typeof data.category, 'string', 'category should be string')
  assert.ok(['Gestão', 'Inovação', 'Marketing', 'Agronegócio'].includes(data.category), 'category should match allowed categories')

  assert.strictEqual(typeof data.coverImage, 'string', 'coverImage should be string')
  assert.ok(data.coverImage.startsWith('/'), 'coverImage should be absolute path')
  
  const localCoverImagePath = path.join(process.cwd(), 'public', data.coverImage)
  assert.ok(fs.existsSync(localCoverImagePath), `Cover image must exist at public${data.coverImage}`)

  assert.strictEqual(typeof data.readingTime, 'number', 'readingTime should be number')
  assert.ok(data.readingTime >= 5, 'readingTime should be realistic for long-form article')

  assert.strictEqual(typeof data.excerpt, 'string', 'excerpt should be string')
  assert.ok(data.excerpt.length >= 80 && data.excerpt.length <= 300, 'excerpt length should be between 80 and 300 chars')

  assert.ok(Array.isArray(data.faqs), 'faqs should be array')
  assert.ok(data.faqs.length >= 3, 'should have at least 3 FAQs for rich snippets')
  for (const faq of data.faqs) {
    assert.strictEqual(typeof faq.question, 'string', 'faq question must be string')
    assert.strictEqual(typeof faq.answer, 'string', 'faq answer must be string')
    assert.ok(faq.question.length > 5, 'faq question not empty')
    assert.ok(faq.answer.length > 10, 'faq answer not empty')
  }
})

test('Word Count and Editorial Depth Check', () => {
  const raw = fs.readFileSync(mdxFilePath, 'utf8')
  const { content } = matter(raw)
  const words = content.trim().split(/\s+/).filter(Boolean)
  console.log(`\nEmpirical Word Count: ${words.length} words`)
  assert.ok(words.length >= 1800, `Article must have at least 1800 words, found ${words.length}`)
})

test('Markdown Tables Syntax and Column Alignment Validation', () => {
  const raw = fs.readFileSync(mdxFilePath, 'utf8')
  const { content } = matter(raw)
  const lines = content.split('\n')

  let insideCodeBlock = false
  let tableBlocks = []
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

  console.log(`Found ${tableBlocks.length} markdown tables`)
  assert.ok(tableBlocks.length >= 2, 'Should contain at least 2 structured data tables')

  for (let t = 0; t < tableBlocks.length; t++) {
    const table = tableBlocks[t]
    assert.ok(table.length >= 3, `Table ${t + 1} must have header, separator, and at least 1 row (starts line ${table[0].lineIndex})`)

    const header = table[0].text
    const separator = table[1].text

    const headerCols = header.split('|').slice(1, -1).map(c => c.trim())
    const separatorCols = separator.split('|').slice(1, -1).map(c => c.trim())

    assert.strictEqual(
      separatorCols.length,
      headerCols.length,
      `Table ${t + 1} separator column count (${separatorCols.length}) does not match header (${headerCols.length}) at line ${table[1].lineIndex}`
    )

    for (let c = 0; c < separatorCols.length; c++) {
      const sep = separatorCols[c]
      assert.ok(
        /^:?-+:?$/.test(sep),
        `Table ${t + 1} column ${c + 1} has invalid separator '${sep}' at line ${table[1].lineIndex}`
      )
    }

    for (let r = 2; r < table.length; r++) {
      const row = table[r].text
      const rowCols = row.split('|').slice(1, -1).map(c => c.trim())
      assert.strictEqual(
        rowCols.length,
        headerCols.length,
        `Table ${t + 1} row at line ${table[r].lineIndex} has ${rowCols.length} columns, expected ${headerCols.length}`
      )
    }
  }
})

test('Didactic Images and Code Fences Validity', () => {
  const raw = fs.readFileSync(mdxFilePath, 'utf8')
  const { content } = matter(raw)
  const lines = content.split('\n')

  let openFence = false
  let openLine = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim().startsWith('```')) {
      if (!openFence) {
        openFence = true
        openLine = i + 1
      } else {
        openFence = false
      }
    }
  }

  assert.strictEqual(openFence, false, `Unclosed code fence starting at line ${openLine}`)

  // Validate didactic images existence
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  let match
  const images = []
  while ((match = imageRegex.exec(content)) !== null) {
    images.push(match[2])
  }

  console.log(`Found ${images.length} embedded didactic images in MDX`)
  assert.ok(images.length >= 3, `Expected at least 3 embedded images, found ${images.length}`)

  for (const imgUrl of images) {
    const localImgPath = path.join(process.cwd(), 'public', imgUrl)
    assert.ok(fs.existsSync(localImgPath), `Image file must exist at ${localImgPath}`)
  }
})

test('Unescaped JSX Characters Check outside Code Fences', () => {
  const raw = fs.readFileSync(mdxFilePath, 'utf8')
  const { content } = matter(raw)
  const lines = content.split('\n')

  let insideCodeBlock = false
  const suspiciousChars = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim().startsWith('```')) {
      insideCodeBlock = !insideCodeBlock
      continue
    }
    if (insideCodeBlock) continue

    // Check for unescaped < or { outside of markdown links/formatting
    // In MDX, raw '<' that looks like a JSX tag or standalone '{' could crash the parser
    // Check for stray opening curly braces '{' not part of inline code
    const lineWithoutInlineCode = line.replace(/`[^`]+`/g, '')
    
    // Test for stray unmatched '<' followed by letters (unclosed pseudo-tags)
    const tagMatches = lineWithoutInlineCode.match(/<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*$/)
    if (tagMatches) {
      suspiciousChars.push({ line: i + 1, match: tagMatches[0] })
    }

    // Check for stray unmatched '{' or '}'
    const braceMatches = lineWithoutInlineCode.match(/[{}]/)
    if (braceMatches) {
      suspiciousChars.push({ line: i + 1, char: braceMatches[0], text: line })
    }
  }

  console.log(`Suspicious JSX characters count: ${suspiciousChars.length}`)
  assert.strictEqual(suspiciousChars.length, 0, `Found unescaped JSX characters: ${JSON.stringify(suspiciousChars, null, 2)}`)
})

test('Links and Anchor Tags Format and Internal Route Validation', () => {
  const raw = fs.readFileSync(mdxFilePath, 'utf8')
  const { content } = matter(raw)

  // Match all markdown links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match
  const links = []

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({ text: match[1], url: match[2] })
  }

  console.log(`Found ${links.length} markdown links`)
  assert.ok(links.length >= 8, 'Article should contain internal and external links')

  for (const link of links) {
    assert.ok(link.text.trim().length > 0, `Link text must not be empty for URL: ${link.url}`)
    assert.ok(link.url.trim().length > 0, `Link URL must not be empty for text: ${link.text}`)

    if (link.url.startsWith('/')) {
      // Internal link
      const cleanPath = link.url.replace(/^\//, '').replace(/\/$/, '')
      
      // Check if it's blog post, static route, or public file
      const blogCandidate = path.join(process.cwd(), 'content/blog', `${cleanPath.replace(/^blog\//, '')}.mdx`)
      const appCandidate = path.join(process.cwd(), 'app', cleanPath, 'page.tsx')
      const publicCandidate = path.join(process.cwd(), 'public', cleanPath)
      const outCandidate = path.join(process.cwd(), 'out', cleanPath, 'index.html')
      const outDirectCandidate = path.join(process.cwd(), 'out', cleanPath)

      const exists = 
        fs.existsSync(blogCandidate) || 
        fs.existsSync(appCandidate) || 
        fs.existsSync(publicCandidate) || 
        fs.existsSync(outCandidate) || 
        fs.existsSync(outDirectCandidate)

      assert.ok(exists, `Internal link ${link.url} does not resolve to an existing route/file`)
    } else if (link.url.startsWith('https://') || link.url.startsWith('http://')) {
      // External link format
      assert.doesNotThrow(() => new URL(link.url), `Invalid URL: ${link.url}`)
    } else {
      assert.fail(`Relative link without leading slash found: ${link.url}`)
    }
  }
})

test('Static Export HTML Content and Headings Inspection', () => {
  assert.ok(fs.existsSync(outHtmlPath), `Exported HTML must exist at ${outHtmlPath}`)
  const html = fs.readFileSync(outHtmlPath, 'utf8')

  // Check page title in html
  assert.ok(html.includes('Prestação de Serviços com Máquinas Agrícolas'), 'HTML must contain title')
  
  // Check H2 headings
  assert.ok(html.includes('A Anatomia do Custo Horário'), 'Should render H2 Anatomia do Custo Horário')
  assert.ok(html.includes('O Poder Matemático da Diluição'), 'Should render H2 O Poder Matemático da Diluição')
  assert.ok(html.includes('Tabela de Tarifas e Parâmetros de Mercado'), 'Should render H2 Tabela de Tarifas')
  assert.ok(html.includes('Análise Comparativa: Pulverização Terrestre vs. Drone Agrícola'), 'Should render H2 Comparação Drone')
  assert.ok(html.includes('Os 5 Pilares de Governança'), 'Should render H2 5 Pilares')
  assert.ok(html.includes('A Revolução da Negociação Direta: O Papel da Field Machine'), 'Should render H2 Field Machine')
  assert.ok(html.includes('Fontes e Referências Oficiais'), 'Should render H2 Fontes')

  // Check Schema.org JSON-LD scripts
  assert.ok(html.includes('"@type":"Article"'), 'HTML must include Article JSON-LD')
  assert.ok(html.includes('"@type":"BreadcrumbList"'), 'HTML must include BreadcrumbList JSON-LD')
  assert.ok(html.includes('"@type":"FAQPage"'), 'HTML must include FAQPage JSON-LD')
  assert.ok(html.includes('Field Machine'), 'HTML must mention Field Machine')
  assert.ok(html.includes('fieldmachine.com.br'), 'HTML must contain fieldmachine.com.br')

  // Check table tags rendered in HTML
  const tableCount = (html.match(/<table\b/g) || []).length
  console.log(`Rendered <table> tags in HTML: ${tableCount}`)
  assert.ok(tableCount >= 3, `Expected at least 3 HTML tables, found ${tableCount}`)

  // Check img tags rendered in HTML
  const imgCount = (html.match(/<img\b/g) || []).length
  console.log(`Rendered <img> tags in HTML: ${imgCount}`)
  assert.ok(imgCount >= 3, `Expected at least 3 <img> tags for didactic graphics, found ${imgCount}`)

  // Check blockquote tags in HTML
  const bqCount = (html.match(/<blockquote\b/g) || []).length
  console.log(`Rendered <blockquote> tags in HTML: ${bqCount}`)
  assert.ok(bqCount >= 1, `Expected at least 1 <blockquote>, found ${bqCount}`)
})
