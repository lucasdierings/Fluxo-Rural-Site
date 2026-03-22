'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/sobre', label: 'Sobre' },
  { href: '/servicos', label: 'Serviços' },
  { href: '/blog', label: 'Blog' },
  { href: '/palestras', label: 'Palestras' },
  { href: '/contato', label: 'Contato' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-navy/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-fluxo-rural.png"
              alt="Fluxo Rural Consultoria"
              width={160}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/90 hover:text-dourado transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild>
              <Link href="/contato">Fale Comigo</Link>
            </Button>
          </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      <div
        className={cn(
          'md:hidden fixed inset-0 top-20 bg-navy/98 backdrop-blur-lg transition-transform duration-300 z-40',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col items-center gap-6 pt-12">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white text-xl font-medium hover:text-dourado transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="lg" className="mt-4">
            <Link href="/contato" onClick={() => setIsOpen(false)}>
              Fale Comigo
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
