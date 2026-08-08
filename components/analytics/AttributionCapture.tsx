'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { captureAttribution } from '@/lib/track'

// Guarda o primeiro toque (UTM + gclid/fbclid) num cookie de 90 dias, em TODO o
// site - inclusive /beweather, que fica fora do AnalyticsGate mas cujo lead
// também precisa de origem. Sem isso, quem entra por anúncio na home e converte
// numa página interna chega no CRM como "site", e a campanha que pagou pelo
// lead não recebe crédito.
//
// Escreve só na primeira vez (a lógica de "não sobrescrever" mora em
// captureAttribution); aqui é só o gatilho por pageview.
export default function AttributionCapture() {
  const pathname = usePathname()
  useEffect(() => {
    captureAttribution()
  }, [pathname])
  return null
}
