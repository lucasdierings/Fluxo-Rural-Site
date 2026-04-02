'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import CategoryFilter from '@/components/blog/CategoryFilter'
import ArticleCard from '@/components/blog/ArticleCard'

interface Post {
  slug: string
  title: string
  date: string
  category: string
  coverImage: string
  readingTime: number
  excerpt: string
}

interface BlogListProps {
  posts: Post[]
  categories: string[]
}

export default function BlogList({ posts, categories }: BlogListProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const filtered = posts.filter((post) => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !selectedCategory || post.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <>
      <div className="max-w-4xl mx-auto mb-10 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-carvao/40" size={20} />
          <Input
            placeholder="Buscar artigos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 bg-white"
          />
        </div>
        <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filtered.map((post) => (
          <ArticleCard key={post.slug} {...post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-carvao/50 py-12">Nenhum artigo encontrado.</p>
      )}
    </>
  )
}
