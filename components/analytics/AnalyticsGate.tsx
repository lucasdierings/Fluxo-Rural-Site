'use client'

import { usePathname } from 'next/navigation'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

// Carrega o GA4 + GTM do Fluxo Rural em TODO o site, MENOS /beweather (marca
// separada, com tracking próprio). É o mesmo guard de rota que Navbar/Footer/
// FloatingWhatsApp já usam - sem ele, o GA4/Ads do Fluxo Rural se contaminava com
// o tráfego da landing do Beweather (property + lookalikes). Não toca em /beweather.
export default function AnalyticsGate() {
  const pathname = usePathname()
  if (pathname?.startsWith('/beweather')) return null

  return (
    <>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NG4CVQ38'} />
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </>
  )
}
