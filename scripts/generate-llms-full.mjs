// Gera public/llms-full.txt (e out/llms-full.txt) a partir de
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

const base = fs.readFileSync(basePath, 'utf8').trimEnd()

const posts = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith('.mdx'))
  .map((file) => {
    const slug = file.replace(/\.mdx$/, '')
    const { data, content } = matter(fs.readFileSync(path.join(blogDir, file), 'utf8'))
    return { slug, ...data, content: content.trim() }
  })
  .sort((a, b) => new Date(a.date) - new Date(b.date))

const demoteHeadings = (md) => md.replace(/^(#{2,4}) /gm, (_, h) => '#'.repeat(h.length + 2) + ' ')

const articles = posts
  .map((post, i) => {
    const faqs = (post.faqs || [])
      .map((f) => `**P: ${f.question}**\nR: ${f.answer}`)
      .join('\n\n')
    return [
      `### 3.${i + 1}. ${post.title}`,
      `- **URL:** ${siteUrl}/blog/${post.slug}/`,
      `- **Data:** ${post.date} | **Categoria:** ${post.category}`,
      `- **Resumo:** ${post.excerpt}`,
      `- **Texto do Artigo:**`,
      demoteHeadings(post.content),
      faqs ? `#### Perguntas Frequentes\n${faqs}` : null,
    ]
      .filter(Boolean)
      .join('\n')
  })
  .join('\n\n---\n\n')

const output = `${base}\n\n## 3. Blog de Artigos Técnicos (Na Íntegra)\n\n${articles}\n`

fs.writeFileSync(path.join(root, 'public/llms-full.txt'), output)
const outDir = path.join(root, 'out')
if (fs.existsSync(outDir)) {
  fs.writeFileSync(path.join(outDir, 'llms-full.txt'), output)
}

console.log(`llms-full.txt gerado com ${posts.length} artigos`)
