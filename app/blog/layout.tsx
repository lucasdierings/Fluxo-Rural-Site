import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artigos práticos sobre gestão financeira rural, sucessão familiar, inovação e inteligência artificial no agronegócio. Conteúdo por Lucas Dierings.',
  openGraph: {
    title: 'Blog | Lucas Dierings — Fluxo Rural',
    description:
      'Conteúdo prático sobre gestão, finanças e inovação no agronegócio brasileiro.',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
