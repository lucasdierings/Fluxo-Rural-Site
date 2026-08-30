'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  ClipboardCheck,
  GraduationCap,
  Mic2,
  Newspaper,
  Route,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackCta } from '@/lib/track'

const fronts = [
  {
    icon: ClipboardCheck,
    eyebrow: 'Consultoria em gestão rural',
    title: 'Diagnóstico e gestão para decisões mais claras no campo.',
    body: 'Leitura da realidade, números e plano de ação para uma gestão mais consistente.',
    image: '/images/hero-fazenda-aerea.jpg',
    href: '/diagnostico',
    cta: 'Começar pelo diagnóstico',
  },
  {
    icon: GraduationCap,
    eyebrow: 'Capacitação Corporativa',
    title: 'Conhecimento que sai da sala e chega à prática.',
    body: 'Cursos e programas de capacitação sobre gestão, liderança, inovação e tecnologia no agro.',
    image: '/treinamento-workshop.jpg',
    href: '/servicos/treinamentos',
    cta: 'Ver treinamentos',
  },
  {
    icon: Mic2,
    eyebrow: 'Palestras',
    title: 'Palestras que conectam gestão, inovação e futuro do agro.',
    body: 'Conteúdo de palco para provocar reflexão, conversa e ação.',
    image: '/images/lucas-palestrante.jpg',
    href: '/palestras',
    cta: 'Ver palestras',
  },
  {
    icon: Newspaper,
    eyebrow: 'Projeto de conteúdo',
    title: 'Agro Jovem: conversas que ampliam as vozes do campo.',
    body: 'Podcast e conteúdo sobre gestão, liderança e inovação com quem vive o agronegócio.',
    image: '/images/agrojovem-estudio.jpg',
    href: '/agrojovem',
    cta: 'Conhecer o Agro Jovem',
  },
]

export default function ScrollWorldJourney() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-54%'])

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-x-clip bg-navy-950 text-white lg:h-[240vh]"
      aria-labelledby="scroll-world-title"
    >
      <div className="relative min-h-[76svh] overflow-hidden lg:sticky lg:top-0 lg:min-h-screen">
        <div className="absolute inset-0 lg:hidden" aria-hidden="true">
          <Image
            src="/images/hero-fazenda-aerea.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[58%_center] opacity-30"
          />
        </div>

        <motion.div
          style={{ x }}
          className="absolute inset-y-0 left-0 hidden w-[216vw] will-change-transform lg:flex"
          aria-hidden="true"
        >
          {fronts.map((front) => (
            <div key={front.title} className="relative h-full w-[54vw] min-w-[420px]">
              <Image
                src={front.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-navy-950/75" />
            </div>
          ))}
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,25,47,0.4)_0%,rgba(10,25,47,0.85)_48%,rgba(10,25,47,1)_100%)] lg:bg-[linear-gradient(90deg,rgba(10,25,47,0.98)_0%,rgba(10,25,47,0.85)_38%,rgba(10,25,47,0.45)_100%)]" />

        <div className="relative z-10 flex min-h-[76svh] items-end pb-9 pt-28 lg:min-h-screen lg:items-center lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="max-w-2xl"
              >
                <span className="mb-4 inline-flex items-center gap-2 rounded-xl border border-gold/35 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold sm:mb-5">
                  <Route size={16} className="text-gold" />
                  Ecossistema Integrado
                </span>
                <h2
                  id="scroll-world-title"
                  className="font-heading text-3xl font-extrabold leading-tight text-slate-50 md:text-5xl lg:text-6xl"
                >
                  Gestão, conhecimento e inovação em movimento.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base md:mt-6 md:text-lg">
                  Consultoria, treinamentos, palestras e conteúdo com aplicação prática no
                  agronegócio.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                  <Button asChild size="lg" className="w-full sm:w-auto min-h-[48px] bg-agro-green-action hover:bg-agro-green-action/90 text-white font-semibold shadow-dark-md border border-agro-green-neon/30">
                    <Link
                      href="/servicos"
                      onClick={() => trackCta({ cta: 'servicos', local: 'scroll_world_journey' })}
                    >
                      Conhecer os serviços
                    </Link>
                  </Button>
                </div>
                <div className="mt-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400 lg:hidden">
                  <span>4 frentes Fluxo Rural</span>
                  <span className="h-px flex-1 bg-white/20" aria-hidden="true" />
                </div>
              </motion.div>

              <div className="hidden grid-cols-2 gap-4 lg:grid">
                {fronts.map((front, index) => (
                  <motion.article
                    key={front.title}
                    data-scroll-front={index}
                    initial={{ opacity: 0, x: 28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ delay: index * 0.08, duration: 0.55, ease: 'easeOut' }}
                    className="group flex min-h-[190px] flex-col rounded-2xl border border-white/10 bg-navy-800/80 p-5 backdrop-blur-xl transition-all hover:bg-navy-800 hover:border-agro-green-neon/30 shadow-dark-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold">
                      <front.icon size={20} aria-hidden="true" />
                    </div>
                    <p className="mt-3.5 text-xs font-semibold uppercase tracking-wider text-gold">
                      {front.eyebrow}
                    </p>
                    <h3 className="mt-1 font-heading text-lg font-bold leading-tight text-slate-50">
                      {front.title}
                    </h3>
                    <p className="mt-2 hidden text-xs leading-relaxed text-slate-400 xl:block">
                      {front.body}
                    </p>
                    <Link
                      href={front.href}
                      onClick={() =>
                        trackCta({ cta: front.href.replace('/', ''), local: 'scroll_world_front' })
                      }
                      className="mt-auto inline-flex items-center gap-2 pt-3 text-xs font-semibold text-gold hover:text-agro-green-neon transition-colors group-hover:gap-2.5 min-h-[44px]"
                    >
                      {front.cta} <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-navy-950 lg:hidden">
        <div className="container mx-auto px-4 pb-16 pt-8">
          <ul className="m-0 grid list-none gap-5 p-0">
            {fronts.map((front, index) => (
              <li key={front.title}>
                <article
                  data-scroll-front-mobile={index}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800/80 shadow-dark-md"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={front.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) calc(100vw - 2rem), 608px"
                      className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-carvao shadow-lg">
                      <front.icon size={21} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                      {front.eyebrow}
                    </p>
                    <h3 className="mt-1.5 font-heading text-xl font-bold leading-tight text-slate-50">
                      {front.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-300">{front.body}</p>
                    <Link
                      href={front.href}
                      onClick={() =>
                        trackCta({ cta: front.href.replace('/', ''), local: 'scroll_world_front_mobile' })
                      }
                      className="mt-4 flex min-h-[44px] w-full items-center justify-between border-t border-white/10 pt-3 text-sm font-semibold text-gold hover:text-agro-green-neon transition-colors"
                    >
                      {front.cta} <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

