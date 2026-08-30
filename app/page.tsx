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
    'Consultoria em gestão rural, treinamentos e palestras sobre gestão financeira, sucessão familiar, liderança e inovação no agronegócio. Com Lucas Dierings, engenheiro agrônomo (CREA-PR 179906/D) e fundador da Fluxo Rural.',
  openGraph: {
    title: 'Lucas Dierings | Gestão e Inovação no Agronegócio',
    description:
      'Consultoria, treinamentos e palestras sobre gestão, finanças e inovação no agronegócio.',
    images: [{ url: '/og-image.png' }],
  },
}

export default function HomePage() {
  // Os 3 artigos mais recentes de verdade, ordenados por data decrescente
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

