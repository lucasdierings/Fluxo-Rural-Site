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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (pathname?.startsWith('/beweather') || pathname?.startsWith('/links')) return null

  // Home: transparente sobre o hero no topo, vira dark navy ao rolar.
  // Demais páginas: sempre dark navy sólido com borda sutil.
  const isHome = pathname === '/'

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
        isHome
          ? scrolled
            ? 'bg-[#0A192F]/90 backdrop-blur-md shadow-lg border-b border-white/10'
            : 'bg-transparent border-b border-transparent'
          : 'bg-[#0A192F]/95 backdrop-blur-md shadow-lg border-b border-white/10'
      )}
    >
      <div className="container relative z-50 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Horizontal Branca de Alto Contraste */}
          <Link href="/" className="flex items-center group" aria-label="Fluxo Rural — Página inicial">
            <div className="relative w-48 sm:w-60 h-12 sm:h-16 transition-transform duration-300 group-hover:scale-102">
              <Image
                src="/logo-fluxo-rural-horizontal-novo.png"
                alt="Fluxo Rural Logo"
                fill
                sizes="(max-width: 640px) 192px, 240px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Links desktop com indicadores de rota ativa */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative py-1 text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'text-[#4ADE80] font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#4ADE80] after:shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                      : 'text-slate-200 hover:text-dourado after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-dourado after:transition-all after:duration-300'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <Button
              asChild
              size="sm"
              className="bg-verde-folha hover:bg-verde-folha/90 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all min-h-[44px] px-5"
            >
              <Link href="/proposta" onClick={() => trackCta({ cta: 'falar-consultor', local: 'navbar-desktop' })}>
                Falar com Consultor
              </Link>
            </Button>
          </div>

          {/* Botão Hamburger Mobile com área de toque WCAG ≥ 44px */}
          <button
            className="md:hidden text-white p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-lg transition-all"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay para fechar ao clicar fora */}
      {isOpen && (
        <div
          className="fixed inset-0 top-20 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer mobile */}
      <div
        id="mobile-navigation"
        aria-hidden={!isOpen}
        className={cn(
          'absolute left-0 right-0 top-full z-40 h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-[#0A192F]/98 pb-[calc(2rem+env(safe-area-inset-bottom))] backdrop-blur-2xl border-b border-white/10 transition-all duration-300 ease-out md:hidden',
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        <div className="flex flex-col items-center gap-6 pt-12 px-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-xl font-medium transition-all duration-300 py-2.5 px-4 rounded-lg min-h-[48px] flex items-center justify-center',
                  isActive
                    ? 'text-[#4ADE80] font-semibold bg-white/5'
                    : 'text-slate-200 hover:text-dourado'
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          <Button
            asChild
            size="lg"
            className="mt-4 w-full max-w-xs bg-verde-folha hover:bg-verde-folha/90 text-white font-semibold py-3.5 rounded-lg min-h-[48px] shadow-lg"
          >
            <Link
              href="/proposta"
              onClick={() => {
                setIsOpen(false)
                trackCta({ cta: 'falar-consultor', local: 'navbar-mobile' })
              }}
            >
              Falar com Consultor
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
