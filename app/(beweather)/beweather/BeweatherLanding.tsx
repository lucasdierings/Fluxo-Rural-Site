'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  CloudRain,
  Droplets,
  CloudOff,
  ThermometerSun,
  Wind,
  Gauge,
  Sun,
  Activity,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  PlayCircle,
  Sprout,
  MessageCircle,
  FileText,
  TrendingDown,
  Loader2,
  Shield,
  Truck,
  UserCheck,
} from 'lucide-react'
import { z } from 'zod'
import { cn } from '@/lib/utils'

// TODO: trocar por WhatsApp oficial da Beweather quando definido.
// Hoje usa o número do Lucas (compartilhado com Fluxo Rural).
const WHATSAPP_URL =
  'https://wa.me/5545991447004?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20quero%20uma%20cota%C3%A7%C3%A3o%20da%20Beweather'

// TODO: criar um Google Apps Script dedicado para leads Beweather
// (o atual é o do /diagnostico — trocar antes do go-live)
const GAS_URL =
  'https://script.google.com/macros/s/PLACEHOLDER_BEWEATHER_FORM/exec'

// --- Lightweight UI Components ---
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary'
    size?: 'default' | 'sm' | 'lg'
  }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-normal text-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beweather-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-beweather-primary text-white hover:bg-beweather-primary/90':
            variant === 'default',
          'bg-beweather-amarelo text-beweather-grafite hover:bg-beweather-amarelo/90':
            variant === 'secondary',
          'border border-beweather-primary text-beweather-primary hover:bg-beweather-accent/20':
            variant === 'outline',
          'hover:bg-beweather-accent/20': variant === 'ghost',
          'h-11 px-4 py-2': size === 'default',
          'h-9 rounded-md px-3': size === 'sm',
          'h-12 rounded-md px-8 text-base': size === 'lg',
        },
        className,
      )}
      {...props}
    />
  )
})
Button.displayName = 'Button'

const Card = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => (
  <div
    className={cn(
      'rounded-2xl border bg-white text-beweather-grafite shadow-sm',
      className,
    )}
  >
    {children}
  </div>
)

// --- Validation + masks for form ---
const onlyDigits = (v: string) => v.replace(/\D/g, '')

const maskPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11)
  if (d.length <= 10) {
    return d
      .replace(/^(\d{0,2})/, '($1')
      .replace(/^\((\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return d
    .replace(/^(\d{0,2})/, '($1')
    .replace(/^\((\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

const maskCep = (v: string) =>
  onlyDigits(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')

const maskCpfCnpj = (v: string) => {
  const d = onlyDigits(v).slice(0, 14)
  if (d.length <= 11) {
    return d
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

const cpfOrCnpjValid = (v: string) => {
  const d = onlyDigits(v)
  return d.length === 11 || d.length === 14
}

const proposalSchema = z.object({
  nome: z.string().min(3, 'Informe seu nome completo'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().refine((v) => onlyDigits(v).length >= 10, 'Telefone inválido'),
  cidade: z.string().min(2, 'Informe a cidade'),
  uf: z.string().length(2, 'UF'),
  cep: z.string().refine((v) => onlyDigits(v).length === 8, 'CEP inválido'),
  documento: z.string().refine(cpfOrCnpjValid, 'CPF ou CNPJ inválido'),
  hectares: z.string().optional(),
  mensagem: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Você precisa aceitar para enviar.' }),
  }),
})

type ProposalData = z.infer<typeof proposalSchema>

// -----------------------------------------------------

function YouTubeFacade({ id, caption }: { id: string; caption: string }) {
  const [loaded, setLoaded] = useState(false)
  if (loaded) {
    return (
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        title={caption}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    )
  }
  return (
    <button
      type="button"
      onClick={() => {
        setLoaded(true)
        {/* TODO-PIXEL: fbq('trackCustom', 'VideoPlay', { id }) */}
      }}
      aria-label={`Reproduzir: ${caption}`}
      className="relative w-full h-full group"
    >
      <img
        src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
        alt={caption}
        loading="lazy"
        decoding="async"
        width={480}
        height={360}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
        <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
      </div>
    </button>
  )
}

export default function BeweatherLanding() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // ROI Calc
  const [hectares, setHectares] = useState(500)
  const [custoMm, setCustoMm] = useState(50)
  const [aplicacoes, setAplicacoes] = useState(5)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToForm = () => {
    document.getElementById('cotacao')?.scrollIntoView({ behavior: 'smooth' })
  }

  const economiaEstimada =
    hectares * aplicacoes * 0.15 * 100 + custoMm * hectares * 0.2

  return (
    <div className="min-h-screen bg-beweather-offwhite text-beweather-grafite font-body flex flex-col">
      {/* 1. NAVBAR */}
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent',
          isScrolled
            ? 'bg-beweather-offwhite/90 backdrop-blur-md border-black/5 shadow-sm py-3'
            : 'bg-transparent py-5',
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/beweather/logo-beweather.jpeg"
              alt="Beweather"
              className="h-8 w-auto object-contain mix-blend-multiply"
            />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-beweather-grafite/80">
            <a href="#como-funciona" className="hover:text-beweather-primary transition-colors">
              Como funciona
            </a>
            <a href="#tecnologia" className="hover:text-beweather-primary transition-colors">
              Tecnologia
            </a>
            <a href="#videos" className="hover:text-beweather-primary transition-colors">
              Vídeos
            </a>
            <a href="#roi" className="hover:text-beweather-primary transition-colors">
              Calculadora ROI
            </a>
            <a href="#faq" className="hover:text-beweather-primary transition-colors">
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button onClick={scrollToForm} className="gap-2 rounded-full px-6">
              <MessageCircle className="w-4 h-4" />
              Quero uma cotação
            </Button>
          </div>

          <button
            className="md:hidden p-3 min-h-[44px] min-w-[44px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-beweather-offwhite border-b shadow-lg py-4 px-4 flex flex-col gap-4">
            {[
              ['#como-funciona', 'Como funciona'],
              ['#tecnologia', 'Tecnologia'],
              ['#videos', 'Vídeos'],
              ['#roi', 'Calculadora ROI'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 min-h-[44px] text-base"
              >
                {label}
              </a>
            ))}
            <Button
              onClick={() => {
                setMobileMenuOpen(false)
                scrollToForm()
              }}
              className="w-full gap-2 rounded-full"
            >
              <MessageCircle className="w-4 h-4" /> Quero uma cotação
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 2. HERO */}
        <section className="relative pt-24 pb-10 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-br from-beweather-offwhite via-beweather-offwhite to-beweather-accent/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-xl motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div className="inline-flex items-center rounded-full border border-beweather-primary/20 bg-beweather-primary/5 px-3 py-1 text-sm font-medium text-beweather-primary mb-6">
                  <Activity className="w-4 h-4 mr-2" />
                  Estação Meteorológica Profissional
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-beweather-grafite mb-6 font-heading leading-[1.1]">
                  O clima da sua lavoura, na palma da sua mão.
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-beweather-grafite/70 mb-8 font-medium">
                  12 sensores de precisão, dados em tempo real via WiFi e painel solar integrado. Decisões mais rápidas no campo, safras mais lucrativas no fim da colheita.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full font-bold text-base shadow-lg shadow-beweather-amarelo/30 hover:scale-[1.02] transition-transform motion-reduce:hover:scale-100 motion-reduce:transition-none"
                    onClick={scrollToForm}
                  >
                    Quero uma cotação
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full bg-white/50 backdrop-blur"
                    onClick={() =>
                      document
                        .getElementById('como-funciona')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Ver como funciona
                  </Button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-beweather-grafite/75">
                  <span className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-beweather-primary" /> Frete grátis Brasil
                  </span>
                  <span className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-beweather-primary" /> Entrega em 15 dias
                  </span>
                  <span className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-beweather-primary" /> Garantia de 12 meses
                  </span>
                  <span className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-beweather-primary" /> Suporte com agrônomo
                  </span>
                </div>
              </motion.div>

              <div className="relative h-[260px] sm:h-[360px] md:h-[540px] flex items-center justify-center">
                <div className="absolute inset-0 bg-beweather-primary/10 rounded-full blur-3xl animate-pulse-glow motion-reduce:animate-none" />
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  className="relative z-10 w-full h-full motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <img
                    src="/beweather/hero-soja-goldenhour.jpg"
                    alt="Estação Beweather na plantação"
                    width={800}
                    height={1400}
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                  <div className="absolute top-1/4 right-2 md:-right-12 bg-white rounded-2xl shadow-xl p-3 md:p-4 border border-black/5">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                      </span>
                      <span className="font-bold text-xs md:text-sm">Em tempo real • LIVE</span>
                    </div>
                    <div className="mt-2 text-[11px] md:text-xs text-beweather-grafite/60">
                      Chuva: 12mm / Vento: 15km/h
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PROVA / GARANTIAS */}
        <section className="py-12 border-y border-black/5 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm md:text-base font-semibold text-beweather-grafite/75 mb-8 max-w-3xl mx-auto">
              Estação Beweather B2K — 12 sensores, tecnologia B2K Technology Solutions, suporte técnico com engenheiro agrônomo.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-10">
              <div className="inline-flex items-center gap-2 bg-beweather-offwhite border border-black/5 rounded-full px-4 py-2 text-sm md:text-base font-semibold text-beweather-grafite">
                <Shield className="w-5 h-5 text-beweather-primary" /> Garantia 12 meses
              </div>
              <div className="inline-flex items-center gap-2 bg-beweather-offwhite border border-black/5 rounded-full px-4 py-2 text-sm md:text-base font-semibold text-beweather-grafite">
                <Truck className="w-5 h-5 text-beweather-primary" /> Frete grátis Brasil
              </div>
              <div className="inline-flex items-center gap-2 bg-beweather-offwhite border border-black/5 rounded-full px-4 py-2 text-sm md:text-base font-semibold text-beweather-grafite">
                <UserCheck className="w-5 h-5 text-beweather-primary" /> Suporte com agrônomo
              </div>
            </div>
          </div>
        </section>

        {/* 4. PROBLEMA */}
        <section className="py-20 md:py-24 bg-beweather-offwhite">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-6">
                90% dos prejuízos da lavoura vêm do clima. E você ainda decide olhando o céu?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <Card className="p-6 md:p-8 border-l-4 border-red-500 bg-red-50/30 hover:shadow-xl transition-all duration-200">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-6">
                  <CloudRain className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3">Aplicação perdida pela chuva</h3>
                <p className="text-beweather-grafite/75 text-sm">
                  Sem saber a umidade e o vento exatos da SUA área, são milhares de reais jogados fora em defensivos a cada erro.
                </p>
              </Card>

              <Card className="p-6 md:p-8 border-l-4 border-red-500 bg-orange-50/30 hover:shadow-xl transition-all duration-200">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-6">
                  <Droplets className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3">Irrigação no escuro</h3>
                <p className="text-beweather-grafite/75 text-sm">
                  Ligando o pivô por &quot;achismo&quot;. Gastando água e energia elétrica que não precisava, ou deixando a planta sofrer estresse.
                </p>
              </Card>

              <Card className="p-6 md:p-8 border-l-4 border-red-500 bg-yellow-50/30 hover:shadow-xl transition-all duration-200">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-6">
                  <CloudOff className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3">Previsão genérica do celular</h3>
                <p className="text-beweather-grafite/75 text-sm">
                  Aquele app grátis usa dados de um aeroporto a 80km da sua porteira. Na sua fazenda, a realidade é completamente outra.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* 5. SOLUÇÃO */}
        <section id="tecnologia" className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-beweather-accent/20 rounded-3xl blur-2xl transform -rotate-6" />
                <img
                  src="/beweather/estacao-produto-packshot.jpg"
                  alt="Estação Beweather B2K"
                  width={600}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="relative rounded-3xl shadow-2xl object-cover w-full h-auto max-w-full"
                />

                <Card className="relative md:absolute md:-bottom-8 md:-right-8 mt-6 md:mt-0 p-5 md:p-6 shadow-xl border-beweather-accent/20 bg-white/95 backdrop-blur">
                  <div className="text-xs md:text-sm font-semibold text-beweather-grafite/75 mb-1">A partir de</div>
                  <div className="text-4xl md:text-5xl font-extrabold text-beweather-grafite font-heading mb-2 tracking-tight">
                    R$ 9.900
                  </div>
                  <div className="text-xs md:text-sm font-semibold text-beweather-primary flex flex-col gap-1">
                    <span className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-beweather-primary mr-2" /> 12x sem juros
                    </span>
                    <span className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-beweather-primary mr-2" /> Frete Brasil incluso
                    </span>
                  </div>
                  <Button className="w-full mt-4" onClick={scrollToForm}>
                    Quero a minha
                  </Button>
                </Card>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading mb-6">
                  Conheça a Beweather B2K
                </h2>
                <p className="text-base md:text-lg text-beweather-grafite/75 mb-8">
                  Nossa estação top de linha projetada para o rigor do campo brasileiro. Sem fios, sem complicação, dados direto no seu celular.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: Sun, title: 'Painel solar + bateria', desc: 'Instala em qualquer canto, sem depender da rede elétrica.' },
                    { icon: Activity, title: 'WiFi + Bluetooth', desc: 'Dados em tempo real transmitidos direto pro seu app.' },
                    { icon: MapPin, title: 'GPS integrado', desc: 'Localização exata e automática da estação no talhão.' },
                    { icon: FileText, title: 'Dicas inteligentes', desc: 'Recomendações por cultura, validadas por agrônomo.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-beweather-accent/10 flex items-center justify-center text-beweather-primary">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">{item.title}</h4>
                        <p className="text-beweather-grafite/60 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. SENSORES */}
        <section className="py-20 md:py-24 bg-beweather-grafite text-white overflow-hidden relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading mb-6">
                12 parâmetros que mudam o jogo da sua safra
              </h2>
              <p className="text-white/70 text-base md:text-lg">
                Esqueça a previsão genérica. Tenha medições precisas e localizadas para agir no exato momento certo.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { name: 'Temperatura', range: '-40 a 60°C', icon: ThermometerSun },
                { name: 'Umidade do ar', range: '1-99%', icon: Droplets },
                { name: 'Precipitação', range: 'até 9999mm', icon: CloudRain },
                { name: 'Velocidade do vento', range: 'até 180km/h', icon: Wind },
                { name: 'Rajada do vento', range: 'Em tempo real', icon: Wind },
                { name: 'Direção do vento', range: '0-359°', icon: Gauge },
                { name: 'Pressão atmosf.', range: '300-1100 hPa', icon: CloudOff },
                { name: 'Intensidade lum.', range: '0-200.000 lux', icon: Sun },
                { name: 'Índice UV', range: 'Nível de Radiação', icon: Sun },
                { name: 'Radiação solar', range: 'W/m²', icon: Sun },
                { name: 'Ponto de orvalho', range: 'Temperatura °C', icon: Droplets },
                { name: 'Evapotranspiração', range: "Perda d'água", icon: Sprout },
              ].map((sensor, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group rounded-2xl bg-white/5 border border-white/10 p-4 md:p-6 flex flex-col items-center text-center transition-all duration-200 hover:bg-beweather-primary/20 hover:border-beweather-accent/50 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <sensor.icon className="w-7 h-7 md:w-8 md:h-8 text-beweather-accent mb-3 md:mb-4 opacity-80" />
                  <h4 className="font-bold text-xs sm:text-sm md:text-base mb-1">{sensor.name}</h4>
                  <span className="text-[11px] md:text-xs text-white/50">{sensor.range}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6B. JANELA DE PULVERIZAÇÃO */}
        <section id="pulverizacao" className="py-20 md:py-24 bg-beweather-offwhite relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-beweather-primary/10 text-beweather-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Wind className="w-4 h-4" /> Janela ideal de pulverização
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading mb-6">
                  O defensivo certo, na hora errada, vira dinheiro no lixo.
                </h2>
                <p className="text-base md:text-lg text-beweather-grafite/75 mb-8">
                  Vento forte leva o produto embora. Umidade baixa evapora a calda antes de agir. Temperatura alta queima a folha. A Beweather te avisa <strong>em tempo real</strong> quando a sua lavoura está dentro da janela ideal para aplicar — e quando é melhor esperar.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Wind, title: 'Vento entre 3 e 10 km/h', desc: 'Evita deriva e garante que a calda chegue no alvo, não no vizinho.' },
                    { icon: Droplets, title: 'Umidade relativa acima de 55%', desc: 'Gota não evapora no ar. Defensivo age onde precisa agir.' },
                    { icon: ThermometerSun, title: 'Temperatura abaixo de 30°C', desc: 'Sem queima de folha, sem perda de eficácia do produto.' },
                    { icon: CloudRain, title: 'Previsão de chuva nas próximas horas', desc: "Não aplica para ver tudo escorrer junto com o próximo pé-d'água." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-black/5">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-beweather-accent/10 flex items-center justify-center text-beweather-primary">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold">{item.title}</h4>
                        <p className="text-sm text-beweather-grafite/60">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Card className="p-6 md:p-8 bg-white shadow-2xl border-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-beweather-accent/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-semibold text-beweather-grafite/60 uppercase tracking-wide">
                        Status atual da lavoura
                      </span>
                      <span className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> AO VIVO
                      </span>
                    </div>
                    <div className="mb-6 p-5 rounded-2xl bg-beweather-primary text-white shadow-lg shadow-beweather-primary/40 animate-pulse-glow motion-reduce:animate-none">
                      <div className="text-xs font-semibold opacity-90 mb-1">RECOMENDAÇÃO</div>
                      <div className="text-2xl font-bold font-heading mb-1">Pode pulverizar ✓</div>
                      <div className="text-sm opacity-90">Janela ideal até às 10h30</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-beweather-offwhite">
                        <div className="flex items-center gap-2 text-beweather-grafite/60 text-xs mb-1">
                          <Wind className="w-3 h-3" />
                          Vento
                        </div>
                        <div className="font-bold text-lg">6 km/h</div>
                      </div>
                      <div className="p-3 rounded-xl bg-beweather-offwhite">
                        <div className="flex items-center gap-2 text-beweather-grafite/60 text-xs mb-1">
                          <Droplets className="w-3 h-3" />
                          Umidade
                        </div>
                        <div className="font-bold text-lg">72%</div>
                      </div>
                      <div className="p-3 rounded-xl bg-beweather-offwhite">
                        <div className="flex items-center gap-2 text-beweather-grafite/60 text-xs mb-1">
                          <ThermometerSun className="w-3 h-3" />
                          Temp.
                        </div>
                        <div className="font-bold text-lg">24°C</div>
                      </div>
                      <div className="p-3 rounded-xl bg-beweather-offwhite">
                        <div className="flex items-center gap-2 text-beweather-grafite/60 text-xs mb-1">
                          <CloudRain className="w-3 h-3" />
                          Chuva 6h
                        </div>
                        <div className="font-bold text-lg">0 mm</div>
                      </div>
                    </div>
                    <div className="text-xs text-beweather-grafite/60 text-center pt-2 border-t">
                      Dados medidos diretamente na sua estação Beweather
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* 7. TIMELINE */}
        <section id="como-funciona" className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading mb-6">
                Em minutos você está medindo. Em dias, lucrando.
              </h2>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-1 bg-gradient-to-r from-beweather-accent/20 via-beweather-accent to-beweather-accent/20 z-0" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                {[
                  { num: 1, title: 'Receba', desc: 'Em até 15 dias em qualquer canto do Brasil.' },
                  { num: 2, title: 'Instale', desc: 'Você mesmo, em 8 minutos, seguindo o vídeo passo a passo.' },
                  { num: 3, title: 'Conecte', desc: 'Ao WiFi do seu roteador e abra o app no celular.' },
                  { num: 4, title: 'Lucre', desc: 'Receba dicas inteligentes por cultura, todo dia.' },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white border-4 border-beweather-primary text-beweather-primary font-bold text-xl md:text-2xl flex items-center justify-center mb-4 md:mb-6 shadow-xl">
                      {step.num}
                    </div>
                    <h4 className="text-base md:text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-beweather-grafite/60 text-xs md:text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 md:mt-16 flex justify-center">
              <img
                src="/beweather/pulverizacao-amanhecer.jpg"
                alt="Estação instalada no campo"
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
                className="rounded-3xl shadow-xl w-full max-w-4xl object-cover h-auto"
              />
            </div>
          </div>
        </section>

        {/* 8. VÍDEOS — Veja a Beweather em ação */}
        <section id="videos" className="py-20 md:py-24 bg-beweather-offwhite">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading mb-4">
                Veja a Beweather em ação
              </h2>
              <p className="text-base md:text-lg text-beweather-grafite/60">
                Produtores reais, resultados reais. Do desembalar à primeira decisão salvando safra.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { id: '3T8bvdjBc3E', caption: 'Conheça a estação Beweather' },
                { id: 'e1MP7uhvl7o', caption: 'Como instalar passo a passo' },
                { id: 'Py9TPstz3b0', caption: 'Unboxing: o que vem na caixa' },
              ].map((video, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-xl bg-black">
                    <YouTubeFacade id={video.id} caption={video.caption} />
                  </div>
                  <p className="text-center font-semibold text-beweather-grafite">{video.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. CALCULADORA ROI */}
        <section id="roi" className="py-20 md:py-24 bg-white border-y border-black/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 md:gap-12 items-center bg-beweather-offwhite rounded-3xl p-6 md:p-8 shadow-sm border">
              <div className="flex-1 w-full space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">
                    Quanto a Beweather pode te economizar?
                  </h2>
                  <p className="text-beweather-grafite/75">Simule o retorno com base nos custos da sua lavoura.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Tamanho da área (Hectares)</label>
                      <span className="font-bold text-beweather-primary">{hectares} ha</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="5000"
                      step="10"
                      value={hectares}
                      onChange={(e) => setHectares(Number(e.target.value))}
                      className="w-full accent-beweather-primary h-2"
                      aria-label="Tamanho da área em hectares"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Aplicações por Safra</label>
                      <span className="font-bold text-beweather-primary">{aplicacoes}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={aplicacoes}
                      onChange={(e) => setAplicacoes(Number(e.target.value))}
                      className="w-full accent-beweather-primary h-2"
                      aria-label="Aplicações por safra"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Custo Irrigação/mm (R$)</label>
                      <span className="font-bold text-beweather-primary">R$ {custoMm}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="5"
                      value={custoMm}
                      onChange={(e) => setCustoMm(Number(e.target.value))}
                      className="w-full accent-beweather-primary h-2"
                      aria-label="Custo de irrigação por mm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full flex justify-center">
                <div className="bg-beweather-primary text-white rounded-3xl p-6 md:p-8 w-full max-w-sm text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-beweather-accent w-24 h-24 rounded-bl-full opacity-50" />
                  <TrendingDown className="w-12 h-12 text-beweather-accent mx-auto mb-4" />
                  <p className="text-white/80 mb-2 font-medium">Economia estimada (Safra)</p>
                  <div className="text-3xl md:text-5xl font-bold font-heading text-beweather-accent mb-4">
                    R$ {economiaEstimada.toLocaleString('pt-BR')}
                  </div>
                  <div className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-medium mb-6">
                    Payback em apenas 3 meses
                  </div>
                  <Button variant="secondary" size="lg" className="w-full text-base font-bold rounded-full shadow-lg shadow-beweather-amarelo/30 hover:scale-[1.02] transition-transform motion-reduce:hover:scale-100 motion-reduce:transition-none" onClick={scrollToForm}>
                    Quero esse retorno na minha fazenda
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12. FAQ */}
        <section id="faq" className="py-20 md:py-24 bg-beweather-offwhite">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading mb-10 md:mb-12 text-center">
              Dúvidas frequentes
            </h2>

            <div className="space-y-4">
              {[
                { q: 'Funciona em fazenda sem energia elétrica?', a: 'Sim. A Beweather tem painel solar integrado e bateria de longa duração — é totalmente autônoma e instala em qualquer ponto da fazenda.' },
                { q: 'Precisa de internet para funcionar?', a: 'A estação conecta via WiFi. Basta um roteador próximo ou um repetidor no campo para transmitir os dados continuamente para o aplicativo.' },
                { q: 'É difícil instalar?', a: 'Não. Você mesmo instala em cerca de 8 minutos seguindo o vídeo passo a passo. A estação já vem com tudo que você precisa na caixa.' },
                { q: 'Tem mensalidade ou taxa oculta?', a: 'Não. A plataforma e o aplicativo já estão inclusos no preço da estação. Sem taxas mensais, sem surpresa.' },
                { q: 'Quais as formas de pagamento?', a: 'Cartão de crédito em até 12x sem juros ou PIX à vista com desconto.' },
                { q: 'Os dados são meus?', a: '100% seus. Você pode exportar todo o histórico de clima da sua lavoura em Excel ou CSV a qualquer momento.' },
                { q: 'Tem garantia?', a: 'Sim — 12 meses de garantia de fábrica contra defeitos de fabricação, com suporte técnico especializado em agronomia.' },
              ].map((item, i) => (
                <details key={i} className="group border rounded-xl overflow-hidden bg-white hover:bg-beweather-offwhite transition-colors">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 md:p-6 text-base md:text-lg min-h-[56px]">
                    <span>{item.q}</span>
                    <span className="transition group-open:rotate-180 group-hover:text-beweather-primary">
                      <ChevronDown />
                    </span>
                  </summary>
                  <div className="text-beweather-grafite/75 p-5 md:p-6 pt-0 text-sm md:text-base">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FORMULÁRIO DE COTAÇÃO */}
        <section id="cotacao" className="pt-20 md:pt-24 pb-28 md:pb-12 bg-white">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading mb-4">
                Peça sua cotação personalizada
              </h2>
              <p className="text-base md:text-lg text-beweather-grafite/75">
                Um especialista vai entrar em contato em até 24h com a melhor condição para a sua fazenda.
              </p>
            </div>
            <ProposalForm />
          </div>
        </section>

        {/* 13. CTA FINAL */}
        <section className="py-24 md:py-32 text-white relative overflow-hidden">
          <img
            src="/beweather/cta-aerial-sunset.jpg"
            alt="Fazenda ao pôr do sol vista de cima"
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-beweather-primary/95 via-beweather-primary/80 to-beweather-primary/60" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-8 max-w-3xl mx-auto drop-shadow-md">
              Pare de adivinhar o tempo.
              <br /> Comece a controlar o resultado.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full font-bold shadow-lg shadow-beweather-amarelo/30 hover:scale-[1.02] transition-transform motion-reduce:hover:scale-100 motion-reduce:transition-none"
                onClick={scrollToForm}
              >
                <MessageCircle className="mr-2 w-5 h-5" /> Quero uma cotação
              </Button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white px-8 text-base font-medium transition-colors"
              >
                Falar no WhatsApp
              </a>
            </div>
            <p className="mt-8 text-sm text-white/90 flex items-center justify-center gap-2 drop-shadow">
              <CheckCircle2 className="w-4 h-4 text-beweather-accent" /> Atendimento por agrônomo • Resposta rápida
            </p>
          </div>
        </section>
      </main>

      {/* 15. FOOTER */}
      <footer className="bg-beweather-grafite text-white/60 py-12 border-t border-white/10 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="inline-flex items-center bg-white rounded-xl px-4 py-3 mb-6 shadow-sm">
                <img
                  src="/beweather/logo-beweather.jpeg"
                  alt="Beweather"
                  className="h-9 w-auto"
                />
              </div>
              <p className="max-w-xs mb-6">
                Tecnologia para o agronegócio inteligente. Dados precisos para safras mais lucrativas e sustentáveis.
              </p>
              <div className="flex gap-3 items-center">
                <div className="bg-white rounded-lg px-2 py-2 flex items-center justify-center">
                  <img src="/beweather/logo-b2k-mini.jpeg" alt="B2K Technology" className="h-8 w-auto" />
                </div>
                <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-center">
                  <img
                    src="/beweather/logo-e-aware-technologies.jpeg"
                    alt="e-Aware Technologies"
                    className="h-7 w-auto"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-base">Produto</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#tecnologia" className="hover:text-white transition-colors">
                    Estação B2K
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="hover:text-white transition-colors">
                    App e Plataforma
                  </a>
                </li>
                <li>
                  <a href="#roi" className="hover:text-white transition-colors">
                    Calculadora ROI
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-base">Suporte</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ / Ajuda
                  </a>
                </li>
                <li>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="#cotacao" className="hover:text-white transition-colors">
                    Pedir cotação
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between pt-8 border-t border-white/10 text-xs">
            <p>© {new Date().getFullYear()} Beweather B2K. Todos os direitos reservados.</p>
            <p className="mt-2 md:mt-0">Distribuído por eProdutor</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      {/* TODO-PIXEL: fbq('track', 'Contact') */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Beweather no WhatsApp (abre em nova aba)"
        className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl p-4 transition-transform hover:scale-105 motion-reduce:hover:scale-100 motion-reduce:transition-none min-h-[56px] min-w-[56px] flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  )
}

// -----------------------------------------------------
// Proposal form
// -----------------------------------------------------

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

function ProposalForm() {
  const [form, setForm] = useState<any>({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    uf: '',
    cep: '',
    documento: '',
    hectares: '',
    mensagem: '',
    consent: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ProposalData, string>>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const utms = useMemo(() => {
    if (typeof window === 'undefined') return {}
    const params = new URLSearchParams(window.location.search)
    const out: Record<string, string> = {}
    ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'source'].forEach((k) => {
      const v = params.get(k)
      if (v) out[k] = v
    })
    return out
  }, [])

  const update = (k: keyof ProposalData, v: string | boolean) => {
    setForm((f: any) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = proposalSchema.safeParse(form)
    if (!parsed.success) {
      const errs: Partial<Record<keyof ProposalData, string>> = {}
      parsed.error.issues.forEach((iss) => {
        const k = iss.path[0] as keyof ProposalData
        errs[k] = iss.message
      })
      setErrors(errs)
      return
    }

    setStatus('loading')
    const consentTimestamp = new Date().toISOString()
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          form: 'beweather-cotacao',
          ...form,
          consent: String(form.consent),
          consent_timestamp: consentTimestamp,
          consent_text:
            'Concordo em receber contato da Beweather (Fluxo Rural Consultoria) sobre minha cotação por WhatsApp, telefone e email. LGPD 13.709/18.',
          ...utms,
          page_url: typeof window !== 'undefined' ? window.location.href : '',
          submitted_at: consentTimestamp,
        }).toString(),
      })
      {/* TODO-PIXEL: fbq('track', 'Lead') + gtag('event', 'generate_lead') */}
      setStatus('success')
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl md:text-2xl font-bold text-beweather-grafite mb-2">
          Recebemos seu pedido!
        </h3>
        <p className="text-beweather-grafite/70">
          Um especialista vai entrar em contato em até 24h.
        </p>
      </div>
    )
  }

  const inputCls =
    'flex h-12 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-base md:text-sm placeholder:text-beweather-grafite/40 focus:outline-none focus:ring-2 focus:ring-beweather-primary'

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-beweather-offwhite p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm">
      <Field label="Nome completo" error={errors.nome}>
        <input
          className={inputCls}
          value={form.nome}
          onChange={(e) => update('nome', e.target.value)}
          autoComplete="name"
          required
        />
      </Field>

      <div className="grid md:grid-cols-2 gap-5">
        <Field label="E-mail" error={errors.email}>
          <input
            type="email"
            className={inputCls}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            autoComplete="email"
            inputMode="email"
            required
          />
        </Field>
        <Field label="WhatsApp" error={errors.telefone}>
          <input
            className={inputCls}
            value={form.telefone}
            onChange={(e) => update('telefone', maskPhone(e.target.value))}
            autoComplete="tel"
            inputMode="tel"
            placeholder="(45) 99999-9999"
            required
          />
        </Field>
      </div>

      <div className="grid md:grid-cols-[1fr_120px] gap-5">
        <Field label="Cidade" error={errors.cidade}>
          <input
            className={inputCls}
            value={form.cidade}
            onChange={(e) => update('cidade', e.target.value)}
            autoComplete="address-level2"
            required
          />
        </Field>
        <Field label="UF" error={errors.uf}>
          <select
            className={inputCls}
            value={form.uf}
            onChange={(e) => update('uf', e.target.value)}
            required
          >
            <option value="">—</option>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Field label="CEP" error={errors.cep}>
          <input
            className={inputCls}
            value={form.cep}
            onChange={(e) => update('cep', maskCep(e.target.value))}
            inputMode="numeric"
            placeholder="00000-000"
            autoComplete="postal-code"
            required
          />
        </Field>
        <Field label="CPF ou CNPJ" error={errors.documento}>
          <input
            className={inputCls}
            value={form.documento}
            onChange={(e) => update('documento', maskCpfCnpj(e.target.value))}
            inputMode="numeric"
            placeholder="CPF ou CNPJ"
            required
          />
        </Field>
      </div>

      <Field label="Tamanho da lavoura (hectares, opcional)" error={errors.hectares}>
        <input
          className={inputCls}
          value={form.hectares}
          onChange={(e) => update('hectares', onlyDigits(e.target.value))}
          inputMode="numeric"
          placeholder="Ex: 500"
        />
      </Field>

      <Field label="Mensagem (opcional)" error={errors.mensagem}>
        <textarea
          className={cn(inputCls, 'h-28 py-3')}
          value={form.mensagem}
          onChange={(e) => update('mensagem', e.target.value)}
          placeholder="Conte um pouco sobre sua lavoura, cultura, dúvidas..."
        />
      </Field>

      <label className="flex items-start gap-3 text-xs md:text-sm text-beweather-grafite/80 bg-white p-3 rounded-lg border border-black/10 cursor-pointer">
        <input
          type="checkbox"
          checked={!!form.consent}
          onChange={(e) => update('consent' as any, e.target.checked)}
          className="mt-1 h-5 w-5 accent-beweather-primary flex-shrink-0"
          aria-required="true"
          required
        />
        <span>
          Concordo em receber contato da Beweather (Fluxo Rural Consultoria) sobre minha cotação por WhatsApp, telefone e email. Meus dados serão tratados conforme a{' '}
          <a
            href="/politica-de-privacidade"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-beweather-primary font-semibold"
          >
            Política de Privacidade
          </a>{' '}
          e a LGPD (Lei 13.709/18).
        </span>
      </label>
      {errors.consent && (
        <span className="text-xs text-red-600 block">{errors.consent}</span>
      )}

      {status === 'error' && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          Ops, não conseguimos enviar. Tente de novo ou fale no WhatsApp.
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        variant="secondary"
        className="w-full rounded-full font-bold text-base shadow-lg shadow-beweather-amarelo/30 hover:scale-[1.01] transition-transform motion-reduce:hover:scale-100 motion-reduce:transition-none"
        disabled={status === 'loading' || !form.consent}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...
          </>
        ) : (
          'Enviar pedido de cotação'
        )}
      </Button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-beweather-grafite mb-1.5 block">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
    </label>
  )
}
