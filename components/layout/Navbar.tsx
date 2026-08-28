'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { trackCta } from '@/lib/track'

const navLinks = [
  { href: '/sobre', label: 'Sobre' },
  { href: '/servicos', label: 'Serviços' },
  { href: '/blog', label: 'Blog' },
  { href: '/palestras', label: 'Palestras' },
  { href: '/contato', label: 'Contato' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  if (pathname?.startsWith('/beweather') || pathname?.startsWith('/links')) return null

  // Home: transparente sobre o hero escuro, vira navy ao rolar (imersivo, inalterado).
  // Demais páginas têm topo claro (ex.: /blog, /contato bg-off-white), header sempre
  // navy sólido pra a logo/links brancos terem contraste desde o topo.
  const isHome = pathname === '/'

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
        isHome
          ? scrolled
            ? 'bg-navy/70 backdrop-blur-2xl shadow-apple-md border-b border-white/10'
            : 'bg-transparent'
          : 'bg-navy/90 backdrop-blur-2xl shadow-apple-md border-b border-white/10'
      )}
    >
      <div className="container relative z-50 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Página inicial">
            <div className="relative w-48 sm:w-64 h-10 sm:h-12 transition-transform duration-300 hover:scale-105">
              <Image
                src="/logo-fluxo-rural-horizontal-novo.png"
                alt="Fluxo Rural Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
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
              <Link href="/proposta" onClick={() => trackCta({ cta: 'proposta', local: 'navbar-desktop' })}>Solicitar proposta</Link>
            </Button>
          </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      <div
        id="mobile-navigation"
        aria-hidden={!isOpen}
        className={cn(
          'absolute left-0 right-0 top-full z-40 h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-navy/95 pb-[calc(2rem+env(safe-area-inset-bottom))] backdrop-blur-2xl transition-all duration-300 ease-out md:hidden',
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible pointer-events-none -translate-y-2 opacity-0'
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
            <Link href="/proposta" onClick={() => { setIsOpen(false); trackCta({ cta: 'proposta', local: 'navbar-mobile' }) }}>
              Solicitar proposta
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
