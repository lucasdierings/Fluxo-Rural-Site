'use client'

import { MessageCircle } from 'lucide-react'

export default function FloatingWhatsApp() {
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
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform whatsapp-pulse"
    >
      <MessageCircle size={28} fill="white" />
    </a>
  )
}
