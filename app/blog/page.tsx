'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import CategoryFilter from '@/components/blog/CategoryFilter'
import ArticleCard from '@/components/blog/ArticleCard'

const allPosts = [
  {
    slug: '5-indicadores-financeiros-produtor-rural',
    title: '5 Indicadores Financeiros que Todo Produtor Rural Precisa Monitorar',
    date: '2026-03-01',
    category: 'Finanças',
    coverImage: '/images/gestao-blog.png',
    readingTime: 7,
    excerpt: 'Descubra os 5 indicadores financeiros essenciais para ter clareza sobre a saúde financeira da sua propriedade rural.',
  },
  {
    slug: 'rentabilidade-safra-soja-como-calcular',
    title: 'Como Calcular a Rentabilidade Real da sua Safra de Soja',
    date: '2026-03-08',
    category: 'Finanças',
    coverImage: '/images/gestao-blog.png',
    readingTime: 8,
    excerpt: 'Aprenda a calcular a rentabilidade real da sua safra considerando todos os custos envolvidos na produção.',
  },
  {
    slug: 'sucessao-familiar-agronegocio-por-que-planejar-agora',
    title: 'Sucessão Familiar no Agronegócio: Por que Planejar Agora?',
    date: '2026-03-15',
    category: 'Sucessão Familiar',
    coverImage: '/images/sucessao-blog.png',
    readingTime: 8,
    excerpt: 'Entenda por que 70% das fazendas não sobrevivem à segunda geração e como planejar a sucessão familiar no agro.',
  },
  {
    slug: 'inteligencia-artificial-no-campo-o-que-ja-e-realidade',
    title: 'Inteligência Artificial no Campo: O que Já É Realidade',
    date: '2026-03-22',
    category: 'IA no Agro',
    coverImage: '/images/ia-agro-blog.png',
    readingTime: 7,
    excerpt: 'Conheça as aplicações de IA que já estão transformando o agronegócio brasileiro e como começar a usá-las.',
  },
]

const categories = ['Finanças', 'Sucessão Familiar', 'IA no Agro', 'Gestão', 'Inovação']

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const filtered = allPosts.filter((post) => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !selectedCategory || post.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <section className="pt-32 pb-20 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy mb-4">Blog</h1>
          <p className="text-carvao/60 text-lg">Conteúdo prático sobre gestão, finanças e inovação no agronegócio</p>
        </div>

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
      </div>
    </section>
  )
}
