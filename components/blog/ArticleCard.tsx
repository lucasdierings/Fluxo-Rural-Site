import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface ArticleCardProps {
  slug: string
  title: string
  category: string
  coverImage: string
  date: string
  readingTime: number
  excerpt?: string
}

export default function ArticleCard({
  slug, title, category, coverImage, date, readingTime, excerpt,
}: ArticleCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <div className="relative h-52 rounded-xl overflow-hidden mb-4">
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-verde-folha text-white text-xs font-medium px-3 py-1 rounded-full">
          {category}
        </span>
      </div>
      <h3 className="font-heading font-bold text-navy text-lg group-hover:text-dourado transition-colors leading-snug mb-2">
        {title}
      </h3>
      {excerpt && (
        <p className="text-carvao/60 text-sm line-clamp-2 mb-2">{excerpt}</p>
      )}
      <div className="flex items-center gap-3 text-carvao/50 text-sm">
        <span>{formatDate(date)}</span>
        <span>·</span>
        <span>{readingTime} min de leitura</span>
      </div>
    </Link>
  )
}
