// Gera public/llms-full.txt (e out/llms-full.txt se a pasta out/ existir) a partir de
// content/llms-full-base.txt + artigos de content/blog/*.mdx.
// Roda no postbuild: precisa escrever em out/ porque o next build
// copia public/ -> out/ ANTES do postbuild (mesmo caso do sitemap).
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = process.cwd()
const basePath = path.join(root, 'content/llms-full-base.txt')
const blogDir = path.join(root, 'content/blog')
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fluxorural.com.br'

if (!fs.existsSync(basePath)) {
  console.error(`Erro: Arquivo base não encontrado em ${basePath}`)
  process.exit(1)
}

const base = fs.readFileSync(basePath, 'utf8').trimEnd()

// Formatação ABNT da data de build (ex: "5 set. 2026")
function formatAbntDate(d = new Date()) {
  const months = [
    'jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.',
    'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'
  ]
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const buildDateAbnt = formatAbntDate()

// Catálogo institucional para enriquecimento de fontes e metodologias
const INSTITUTIONAL_CATALOG = [
  {
    name: 'Conab (Companhia Nacional de Abastecimento)',
    pattern: /\bconab\b/i,
    description: 'Metodologia canônica de custos operacionais agrícolas (COE, COT, CT e custo horário de máquinas) e levantamentos de safra brasileira de grãos.'
  },
  {
    name: 'Embrapa (Empresa Brasileira de Pesquisa Agropecuária)',
    pattern: /\bembrapa\b/i,
    description: 'Parâmetros técnicos de manejo agronômico, zoneamento de riscos climáticos (ZARC), tecnologias de produção e cultivares adaptadas.'
  },
  {
    name: 'Cepea/Esalq (USP)',
    pattern: /\b(cepea|esalq)\b/i,
    description: 'Séries históricas de preços de commodities agrícolas (soja, milho, trigo, boi gordo) e benchmarks de custos agropecuários.'
  },
  {
    name: 'MAPA (Ministério da Agricultura e Pecuária)',
    pattern: /\bmapa\b/i,
    description: 'Diretrizes oficiais de política agrícola nacional, normas de sustentabilidade, rastreabilidade e crédito rural oficial do Plano Safra.'
  },
  {
    name: 'IBGE (Instituto Brasileiro de Geografia e Estatística)',
    pattern: /\bibge\b/i,
    description: 'Dados do Censo Agropecuário, Levantamento Sistemático da Produção Agrícola (LSPA) e indicadores demográficos do meio rural.'
  },
  {
    name: 'Deral/SEAB-PR (Departamento de Economia Rural do Paraná)',
    pattern: /\b(deral|seab)\b/i,
    description: 'Boletins conjunturais de acompanhamento de lavouras e estimativas econômicas e de custos regionais no estado do Paraná.'
  },
  {
    name: 'INMET (Instituto Nacional de Meteorologia)',
    pattern: /\binmet\b/i,
    description: 'Rede de estações meteorológicas automáticas, monitoramento agroclimático e modelos de balanço hídrico para o campo.'
  },
  {
    name: 'NOAA (National Oceanic and Atmospheric Administration)',
    pattern: /\bnoaa\b/i,
    description: 'Modelos climáticos globais de temperatura superficial do oceano Pacífico e anomalias de El Niño e La Niña (ENSO).'
  },
  {
    name: 'ASABE Standards (American Society of Agricultural and Biological Engineers)',
    pattern: /\basabe\b/i,
    description: 'Normas internacionais ASABE D497 e EP496 para dimensionamento, depreciação e custo operacional horário de frotas agrícolas.'
  },
  {
    name: 'Receita Federal do Brasil (RFB)',
    pattern: /\b(receita\s+federal|rfb|lcdpr)\b/i,
    description: 'Normativas do Livro Caixa Digital do Produtor Rural (LCDPR), IRPF sobre a atividade rural e conformidade do Funrural.'
  },
  {
    name: 'Banco Central do Brasil (Bacen)',
    pattern: /\b(banco\s+central|bacen|mcr|proagro)\b/i,
    description: 'Manual de Crédito Rural (MCR), equalização de juros subsidiados e diretrizes do Programa de Garantia da Atividade Agropecuária (Proagro).'
  },
  {
    name: 'Sistema CNA/SENAR',
    pattern: /\b(cna|senar)\b/i,
    description: 'Metodologia do Projeto Campo Futuro para custos de produção agropecuária e capacitação técnica e gerencial do produtor rural.'
  },
  {
    name: 'USDA (United States Department of Agriculture)',
    pattern: /\busda\b/i,
    description: 'Relatórios globais de oferta e demanda de grãos (WASDE) e cotações de referência internacional na Bolsa de Chicago (CBOT).'
  },
  {
    name: 'FAEP (Federação da Agricultura do Estado do Paraná)',
    pattern: /\bfaep\b/i,
    description: 'Comissões técnicas setoriais, conjuntura agropecuária estadual e representatividade da agricultura paranaense.'
  }
]

// Extração e formatação de fontes citadas no post
function extractSources(post) {
  const sources = []
  const addedNames = new Set()

  // 1. Citações explícitas declaradas no frontmatter
  if (Array.isArray(post.citations)) {
    for (const cit of post.citations) {
      if (cit && typeof cit === 'string' && !addedNames.has(cit.toLowerCase())) {
        sources.push(`- **${cit}**`)
        addedNames.add(cit.toLowerCase())
      }
    }
  } else if (typeof post.citations === 'string') {
    sources.push(`- **${post.citations}**`)
    addedNames.add(post.citations.toLowerCase())
  }

  // 2. Mapeamento do catálogo institucional a partir do conteúdo do artigo
  for (const inst of INSTITUTIONAL_CATALOG) {
    if (inst.pattern.test(post.content)) {
      if (!addedNames.has(inst.name.toLowerCase())) {
        sources.push(`- **${inst.name}:** ${inst.description}`)
        addedNames.add(inst.name.toLowerCase())
      }
    }
  }

  // 3. Fallback institucional de segurança
  if (sources.length === 0) {
    sources.push(
      '- **Fundamentação Agronômica e Econômica:** Diretrizes técnicas da Embrapa (Empresa Brasileira de Pesquisa Agropecuária) e Conab (Companhia Nacional de Abastecimento).'
    )
  }

  return sources.join('\n')
}

// Limpeza e preservação estrutural do corpo do artigo em Markdown
function cleanArticleBody(rawContent) {
  return rawContent
    // Remove comentários JSX: {/* ... */}
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    // Remove comentários HTML: <!-- ... -->
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove eventuais imports ou exports do MDX
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    // Ajusta a hierarquia de cabeçalhos (# e ## viram #### para aninhamento sob o artigo)
    .replace(/^(#{1,4}) /gm, (_, h) => {
      const level = h.length === 1 ? 4 : h.length + 2
      return '#'.repeat(level) + ' '
    })
    // Normaliza quebras de linha preservando tabelas e parágrafos
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const posts = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))
  .map((file) => {
    const slug = file.replace(/\.mdx$/, '')
    const fileContent = fs.readFileSync(path.join(blogDir, file), 'utf8')
    const { data, content } = matter(fileContent)
    return { slug, ...data, content: content.trim() }
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

const authorCredentials =
  'Lucas Dierings — Engenheiro Agrônomo (CREA-PR 179906/D), MBA em Agronegócios (USP/ESALQ), Vencedor Nacional Top 5 CNA Jovem 2021, Consultor Credenciado SENAR-PR.'

const articles = posts
  .map((post, i) => {
    const canonicalUrl = `${siteUrl}/blog/${post.slug}/`
    const year = post.date ? post.date.slice(0, 4) : new Date().getFullYear().toString()
    const slugKey = post.slug.replace(/[^a-zA-Z0-9]/g, '_')

    // 1. Citação recomendada em múltiplos padrões acadêmicos e digitais
    const citationBlock = [
      `#### Citação Recomendada (ABNT / BibTeX / Markdown)`,
      `- **ABNT:** DIERINGS, Lucas. ${post.title}. Fluxo Rural Consultoria, ${year}. Disponível em: <${canonicalUrl}>. Acesso em: ${buildDateAbnt}.`,
      `- **BibTeX:**`,
      '```bibtex',
      `@article{dierings${year}_${slugKey},`,
      `  author = {Lucas Dierings},`,
      `  title = {${post.title}},`,
      `  journal = {Fluxo Rural Consultoria},`,
      `  year = {${year}},`,
      `  url = {${canonicalUrl}}`,
      `}`,
      '```',
      `- **Markdown:** [${post.title} — Lucas Dierings / Fluxo Rural](${canonicalUrl})`,
    ].join('\n')

    // 2. Credenciais do autor
    const authorBlock = [
      `#### Autor e Credenciais Técnicas`,
      authorCredentials,
    ].join('\n')

    // 3. Resumo executivo (TL;DR)
    const tldrBlock = [
      `#### Resumo Executivo (TL;DR)`,
      post.excerpt || 'Resumo analítico com foco em gestão agronômica e resultados econômicos práticos.',
    ].join('\n')

    // 4. Perguntas-chave respondidas (FAQ estruturado para recuperação RAG)
    let faqsBlock = null
    if (Array.isArray(post.faqs) && post.faqs.length > 0) {
      const faqsContent = post.faqs
        .map((f) => `**P: ${f.question}**\nR: ${f.answer}`)
        .join('\n\n')
      faqsBlock = `#### Perguntas-Chave Respondidas\n\n${faqsContent}`
    }

    // 5. Fontes de dados e metodologias institucionais
    const sourcesBlock = [
      `#### Fontes de Dados e Metodologias`,
      extractSources(post),
    ].join('\n')

    // 6. Corpo integral do artigo limpo e estruturado
    const cleanedBody = cleanArticleBody(post.content)
    const contentBlock = [
      `#### Conteúdo Integral do Artigo`,
      cleanedBody,
    ].join('\n\n')

    const dateHeader = post.updated && post.updated !== post.date
      ? `- **Data de Publicação:** ${post.date} | **Atualizado em:** ${post.updated} | **Categoria:** ${post.category}`
      : `- **Data de Publicação:** ${post.date} | **Categoria:** ${post.category}`

    return [
      `### 3.${i + 1}. ${post.title}`,
      `- **URL Canônica:** ${canonicalUrl}`,
      dateHeader,
      ``,
      citationBlock,
      ``,
      authorBlock,
      ``,
      tldrBlock,
      ``,
      faqsBlock,
      ``,
      sourcesBlock,
      ``,
      contentBlock,
    ]
      .filter((section) => section !== null)
      .join('\n')
  })
  .join('\n\n---\n\n')

const output = `${base}\n\n## 3. Blog de Artigos Técnicos (Na Íntegra)\n\n${articles}\n`

fs.writeFileSync(path.join(root, 'public/llms-full.txt'), output, 'utf8')

const outDir = path.join(root, 'out')
if (fs.existsSync(outDir)) {
  fs.writeFileSync(path.join(outDir, 'llms-full.txt'), output, 'utf8')
  const publicLlms = path.join(root, 'public/llms.txt')
  if (fs.existsSync(publicLlms)) {
    fs.copyFileSync(publicLlms, path.join(outDir, 'llms.txt'))
  }
}

console.log(`llms-full.txt gerado com sucesso contendo ${posts.length} artigos estruturados.`)
