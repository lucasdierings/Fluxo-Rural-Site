import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Artigos sobre Agronegócio, Gestão e Inovação',
  description: 'Artigos e insights sobre gestão rural, finanças no agronegócio, sucessão familiar, inteligência artificial no campo e inovação. Conteúdo prático para quem transforma o campo em resultado.',
  keywords: [
    'blog agronegócio',
    'artigos gestão rural',
    'gestão financeira agro',
    'sucessão familiar agronegócio',
    'inteligência artificial agro',
    'inovação no campo',
    'rentabilidade rural',
  ],
  openGraph: {
    title: 'Blog | Fluxo Rural Consultoria',
    description: 'Artigos sobre gestão, inovação e sucessão no agronegócio. Conteúdo prático e aplicado para propriedades rurais.',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
