'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PalestrasServicoPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/palestras')
  }, [router])

  return (
    <>
      <head>
        <meta httpEquiv="refresh" content="0; url=/palestras/" />
        <link rel="canonical" href="https://fluxorural.com.br/palestras/" />
      </head>
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-carvao/60">Redirecionando...</p>
      </div>
    </>
  )
}
