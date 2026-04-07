import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content/blog')

export interface FAQ {
  question: string
  answer: string
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  category: string
  coverImage: string
  readingTime: number
  excerpt: string
  content: string
  faqs?: FAQ[]
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) return []

  const files = fs.readdirSync(contentDirectory)
  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      return getPostBySlug(slug)
    })
    .filter(Boolean) as BlogPost[]

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(contentDirectory, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) return null

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title,
    date: data.date,
    category: data.category,
    coverImage: data.coverImage,
    readingTime: data.readingTime || 5,
    excerpt: data.excerpt || content.slice(0, 160).replace(/[#*\n]/g, '') + '...',
    content,
    faqs: data.faqs || undefined,
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category)
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = new Set(posts.map((post) => post.category))
  return Array.from(categories)
}
