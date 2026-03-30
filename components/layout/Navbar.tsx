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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
        scrolled
          ? 'bg-navy/70 backdrop-blur-2xl shadow-apple-md border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 transition-smooth hover:opacity-80">
            <Image
              src="/logo-colorido.svg"
              alt="Fluxo Rural"
              width={240}
              height={72}
              className="h-16 sm:h-20 w-auto object-contain"
              priority
            />
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/90 hover:text-dourado transition-all duration-300 font-medium text-sm relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-dourado after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm">
              <Link href="/diagnostico">Diagnostico Gratis</Link>
            </Button>
          </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      <div
        className={cn(
          'md:hidden fixed inset-0 top-20 bg-navy/95 backdrop-blur-2xl transition-all duration-500 ease-out z-40',
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}
      >
        <div className="flex flex-col items-center gap-8 pt-16 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white text-2xl font-medium hover:text-dourado transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="lg" className="mt-4 w-full max-w-xs">
            <Link href="/diagnostico" onClick={() => setIsOpen(false)}>
              Diagnostico Gratis
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
