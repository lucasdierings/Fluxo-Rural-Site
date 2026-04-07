import type { Metadata } from 'next'
import { getAllPosts, getAllCategories } from '@/lib/mdx'
import BlogList from '@/components/blog/BlogList'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Conteúdo prático sobre gestão, finanças e inovação no agronegócio brasileiro. Artigos semanais por Lucas Dierings.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()

  return (
    <section className="pt-32 pb-20 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy mb-4">Blog</h1>
          <p className="text-carvao/60 text-lg">Conteúdo prático sobre gestão, finanças e inovação no agronegócio</p>
        </div>

        <BlogList posts={posts} categories={categories} />
      </div>
    </section>
  )
}
