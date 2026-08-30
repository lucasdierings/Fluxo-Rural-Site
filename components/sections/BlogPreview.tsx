'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface PostPreview {
  slug: string
  title: string
  category: string
  coverImage: string
  readingTime: number
}

interface BlogPreviewProps {
  posts: PostPreview[]
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  if (!posts.length) return null

  return (
    <section className="relative bg-navy-950 py-20 sm:py-28 lg:py-32 border-b border-white/10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-navy-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-agro-green-neon/10 text-agro-green-neon border border-agro-green-neon/25 mb-4">
            <BookOpen size={14} className="text-agro-green-neon" />
            <span>Conteúdo Especializado</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-50 mb-4 tracking-tight">
            Inteligência e Gestão no Campo
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            Artigos práticos sobre finanças rurais, mercado, sucessão familiar e inovação no agronegócio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between h-full rounded-2xl bg-navy-800/80 hover:bg-navy-800 border border-white/10 hover:border-agro-green-neon/40 p-4 sm:p-5 transition-all duration-300 shadow-dark-md hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-48 sm:h-52 rounded-xl overflow-hidden mb-4 bg-navy-900">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-agro-green-action text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-slate-50 text-lg group-hover:text-gold transition-colors leading-snug mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400 mt-auto">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400" />
                    {post.readingTime} min de leitura
                  </span>
                  <span className="text-gold group-hover:text-agro-green-neon font-semibold inline-flex items-center gap-1 transition-colors">
                    Ler artigo <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-14">
          <Button
            asChild
            size="lg"
            className="min-h-[48px] bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-white border border-white/10 hover:border-agro-green-neon/30 shadow-dark-sm transition-all duration-300"
          >
            <Link href="/blog">
              Ver Todos os Artigos <ArrowRight className="ml-2" size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

