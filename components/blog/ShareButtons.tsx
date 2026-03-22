'use client'

import { Linkedin, MessageCircle, Link2, Twitter } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-carvao/50 text-sm font-medium">Compartilhar:</span>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
        aria-label="Compartilhar no WhatsApp"
      >
        <MessageCircle size={18} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#0A66C2] text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
        aria-label="Compartilhar no LinkedIn"
      >
        <Linkedin size={18} />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-carvao text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
        aria-label="Compartilhar no X"
      >
        <Twitter size={18} />
      </a>
      <button
        onClick={copyLink}
        className="bg-gray-200 text-carvao p-2 rounded-lg hover:bg-gray-300 transition-colors"
        aria-label="Copiar link"
      >
        <Link2 size={18} />
      </button>
      {copied && <span className="text-verde-folha text-sm">Link copiado!</span>}
    </div>
  )
}
