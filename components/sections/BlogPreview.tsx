'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const posts = [
  {
    title: '5 Indicadores Financeiros que Todo Produtor Rural Precisa Monitorar',
    slug: '5-indicadores-financeiros-produtor-rural',
    category: 'Finanças',
    image: '/images/gestao-blog-opt.png',
    imageWebp: '/images/gestao-blog-opt.webp',
    readingTime: 7,
  },
  {
    title: 'Sucessão Familiar no Agronegócio: Por que Planejar Agora?',
    slug: 'sucessao-familiar-agronegocio-por-que-planejar-agora',
    category: 'Sucessão Familiar',
    image: '/images/sucessao-blog-opt.png',
    imageWebp: '/images/sucessao-blog-opt.webp',
    readingTime: 8,
  },
  {
    title: 'Inteligência Artificial no Campo: O que Já É Realidade',
    slug: 'inteligencia-artificial-no-campo-o-que-ja-e-realidade',
    category: 'IA no Agro',
    image: '/images/ia-agro-blog-opt.png',
    imageWebp: '/images/ia-agro-blog-opt.webp',
    readingTime: 7,
  },
]

export default function BlogPreview() {
  return (
    <section className="bg-off-white py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            Conteúdo para o Agro
          </h2>
          <p className="text-carvao/60 text-lg">
            Artigos práticos sobre gestão, finanças e inovação no campo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative h-52 rounded-xl overflow-hidden mb-4">
                  <picture>
                    <source srcSet={post.imageWebp} type="image/webp" />
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </picture>
                  <span className="absolute top-3 left-3 bg-verde-folha text-white text-xs font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-navy text-lg group-hover:text-dourado transition-colors leading-snug mb-2">
                  {post.title}
                </h3>
                <span className="text-carvao/50 text-sm">{post.readingTime} min de leitura</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="navy">
            <Link href="/blog">
              Ver Todos os Artigos <ArrowRight className="ml-2" size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
