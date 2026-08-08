import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import TrustBar from '@/components/sections/TrustBar'
import ServicesPreview from '@/components/sections/ServicesPreview'
import Credentials from '@/components/sections/Credentials'
import BlogPreview from '@/components/sections/BlogPreview'
import NaMidia from '@/components/sections/NaMidia'
import FinalCTA from '@/components/sections/FinalCTA'
import { getAllPosts } from '@/lib/mdx'

export const metadata: Metadata = {
  title: {
    absolute: 'Lucas Dierings | Gestão e Inovação no Agronegócio',
  },
  description:
    'Consultoria em gestão rural, treinamentos e palestras sobre gestão financeira, sucessão familiar, liderança e inovação no agronegócio. Com Lucas Dierings, fundador da Fluxo Rural.',
  openGraph: {
    title: 'Lucas Dierings | Gestão e Inovação no Agronegócio',
    description:
      'Consultoria, treinamentos e palestras sobre gestão, finanças e inovação no agronegócio.',
    images: [{ url: '/og-image.png' }],
  },
}

// Seções removidas em ago/2026:
//   ContentCTA ("Leia Grátis") apontava para um único artigo fixo, competindo
//   com a própria seção de blog logo abaixo.
//   Testimonials trazia três depoimentos INVENTADOS. Melhor não ter prova
//   social do que ter prova social falsa; volta quando houver depoimento real.
export default function HomePage() {
  // Os 3 artigos mais recentes de verdade. getAllPosts já devolve ordenado por
  // data decrescente, e antes esta lista era um array fixo que envelhecia sem
  // ninguém perceber.
  const recentes = getAllPosts()
    .slice(0, 3)
    .map(({ slug, title, category, coverImage, readingTime }) => ({
      slug,
      title,
      category,
      coverImage,
      readingTime,
    }))

  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesPreview />
      <Credentials />
      <BlogPreview posts={recentes} />
      <NaMidia />
      <FinalCTA />
    </>
  )
}
