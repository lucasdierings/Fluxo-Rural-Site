'use client'

import Hero from '@/components/sections/Hero'
import TrustBar from '@/components/sections/TrustBar'
import ServicesPreview from '@/components/sections/ServicesPreview'
import Credentials from '@/components/sections/Credentials'
import ContentCTA from '@/components/sections/ContentCTA'
import BlogPreview from '@/components/sections/BlogPreview'
import NaMidia from '@/components/sections/NaMidia'
import Testimonials from '@/components/sections/Testimonials'
import FinalCTA from '@/components/sections/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesPreview />
      <Credentials />
      <ContentCTA />
      <BlogPreview />
      <NaMidia />
      <Testimonials />
      <FinalCTA />
    </>
  )
}
