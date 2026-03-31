'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PalestrasServicoPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/palestras')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-carvao/60">Redirecionando...</p>
    </div>
  )
}
