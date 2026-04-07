import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@id': item.href
          ? `https://fluxorural.com.br${item.href}`
          : undefined,
        name: item.label,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4"
      >
        <ol className="flex items-center gap-1.5 text-sm text-carvao/50 flex-wrap">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={14} className="text-carvao/30" />}
              {item.href && i < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="hover:text-navy transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-navy font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
