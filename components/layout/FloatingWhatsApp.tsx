'use client'

import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'

export default function FloatingWhatsApp() {
  const pathname = usePathname()
  if (pathname?.startsWith('/beweather')) return null
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991447004'
  const message = encodeURIComponent(
    'Olá Lucas! Vim pelo site fluxorural.com.br e gostaria de saber mais sobre seus serviços.'
  )

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="group fixed bottom-6 right-6 z-50"
    >
      {/* Tooltip */}
      <span className="absolute bottom-full right-0 mb-2 bg-carvao text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
        Fale pelo WhatsApp
      </span>
      {/* Botão */}
      <div className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform whatsapp-pulse">
        <MessageCircle size={28} fill="white" />
      </div>
    </a>
  )
}
