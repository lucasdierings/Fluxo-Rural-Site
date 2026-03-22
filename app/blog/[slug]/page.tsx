import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import AuthorCard from '@/components/blog/AuthorCard'
import ShareButtons from '@/components/blog/ShareButtons'
import ArticleCard from '@/components/blog/ArticleCard'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Lucas Dierings'],
      images: [{ url: post.coverImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fluxorural.com.br'
  const postUrl = `${siteUrl}/blog/${post.slug}`

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: `${siteUrl}${post.coverImage}`,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Lucas Dierings',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Fluxo Rural Consultoria',
      url: siteUrl,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Hero do artigo */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pb-12">
          <span className="inline-block bg-verde-folha text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readingTime} min de leitura</span>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <Button asChild variant="ghost" className="mb-8 text-navy">
            <Link href="/blog">
              <ArrowLeft className="mr-2" size={16} /> Voltar ao Blog
            </Link>
          </Button>

          <article className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-navy prose-a:text-navy prose-a:no-underline hover:prose-a:text-dourado">
            <MDXRemote source={post.content} />
          </article>

          {/* CTA Newsletter inline */}
          <div className="my-12 bg-off-white rounded-xl p-8 text-center">
            <h3 className="font-heading text-xl font-bold text-navy mb-2">
              Gostou deste conteúdo? Receba mais toda semana.
            </h3>
            <p className="text-carvao/60 text-sm mb-4">
              Inscreva-se na newsletter da Fluxo Rural.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm variant="inline" />
            </div>
          </div>

          {/* Share */}
          <div className="border-t border-b py-6 my-8">
            <ShareButtons url={postUrl} title={post.title} />
          </div>

          {/* Author */}
          <AuthorCard />
        </div>
      </section>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="py-16 bg-off-white">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-heading text-2xl font-bold text-navy text-center mb-10">
              Artigos Relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {related.map((p) => (
                <ArticleCard key={p.slug} {...p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
