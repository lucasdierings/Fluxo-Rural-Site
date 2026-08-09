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
    eyebrow: 'Treinamentos in-company',
    title: 'Conhecimento que sai da sala e chega à prática.',
    body: 'Cursos e workshops in-company sobre gestão, liderança, inovação e tecnologia no agro.',
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
      className="relative isolate overflow-x-clip bg-[#102D49] text-white lg:h-[300vh]"
      aria-labelledby="scroll-world-title"
    >
      <div className="relative min-h-[76svh] overflow-hidden lg:sticky lg:top-0 lg:min-h-screen">
        <div className="absolute inset-0 lg:hidden" aria-hidden="true">
          <Image
            src="/images/hero-fazenda-aerea.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[58%_center]"
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
                sizes="54vw"
                className="object-cover opacity-55"
              />
              <div className="absolute inset-0 bg-[#102D49]/55" />
            </div>
          ))}
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,45,73,0.34)_0%,rgba(16,45,73,0.78)_48%,rgba(16,45,73,1)_100%)] lg:bg-[linear-gradient(90deg,rgba(16,45,73,0.98)_0%,rgba(16,45,73,0.82)_38%,rgba(16,45,73,0.42)_100%)]" />

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
                <span className="mb-4 inline-flex items-center gap-2 rounded-[8px] border border-dourado/35 bg-dourado/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-dourado sm:mb-5 sm:text-xs lg:tracking-[0.18em]">
                  <Route size={16} />
                  Ecossistema Fluxo Rural
                </span>
                <h2
                  id="scroll-world-title"
                  className="font-heading text-3xl font-bold leading-tight md:text-5xl lg:text-6xl"
                >
                  Gestão, conhecimento e inovação em movimento.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:mt-6 md:text-lg">
                  Consultoria, treinamentos, palestras e conteúdo com aplicação prática no
                  agronegócio.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link
                      href="/servicos"
                      onClick={() => trackCta({ cta: 'servicos', local: 'scroll_world_journey' })}
                    >
                      Conhecer os serviços
                    </Link>
                  </Button>
                </div>
                <div className="mt-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65 lg:hidden">
                  <span>4 frentes Fluxo Rural</span>
                  <span className="h-px flex-1 bg-white/25" aria-hidden="true" />
                </div>
              </motion.div>

              <div className="hidden grid-cols-2 gap-3 lg:grid">
                {fronts.map((front, index) => (
                  <motion.article
                    key={front.title}
                    data-scroll-front={index}
                    initial={{ opacity: 0, x: 28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ delay: index * 0.08, duration: 0.55, ease: 'easeOut' }}
                    className="group flex min-h-[190px] flex-col rounded-[8px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl transition-colors hover:bg-white/[0.12]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-dourado text-carvao">
                      <front.icon size={20} aria-hidden="true" />
                    </div>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-dourado/90">
                      {front.eyebrow}
                    </p>
                    <h3 className="mt-1.5 font-heading text-lg font-bold leading-tight text-white">
                      {front.title}
                    </h3>
                    <p className="mt-2 hidden text-sm leading-relaxed text-white/68 xl:block">
                      {front.body}
                    </p>
                    <Link
                      href={front.href}
                      onClick={() =>
                        trackCta({ cta: front.href.replace('/', ''), local: 'scroll_world_front' })
                      }
                      className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-dourado transition-all group-hover:gap-3"
                    >
                      {front.cta} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-[#102D49] lg:hidden">
        <div className="container mx-auto px-4 pb-16 pt-8">
          <ul className="m-0 grid list-none gap-5 p-0">
            {fronts.map((front, index) => (
              <li key={front.title}>
                <article
                  data-scroll-front-mobile={index}
                  className="overflow-hidden rounded-[8px] border border-white/12 bg-white/[0.07] shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={front.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) calc(100vw - 2rem), 608px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,45,73,0.08)_35%,rgba(16,45,73,0.82)_100%)]" />
                    <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-[8px] bg-dourado text-carvao shadow-lg">
                      <front.icon size={21} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dourado">
                      {front.eyebrow}
                    </p>
                    <h3 className="mt-2 font-heading text-xl font-bold leading-tight">
                      {front.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/75">{front.body}</p>
                    <Link
                      href={front.href}
                      onClick={() =>
                        trackCta({ cta: front.href.replace('/', ''), local: 'scroll_world_front_mobile' })
                      }
                      className="mt-5 flex min-h-11 w-full items-center justify-between border-t border-white/12 pt-4 text-sm font-semibold text-dourado transition-colors active:text-white"
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
