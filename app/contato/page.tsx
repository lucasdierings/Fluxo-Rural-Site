import type { Metadata } from 'next'
import { Mail, MapPin, Clock, MessageCircle, Sparkles } from 'lucide-react'
import { ContactForm } from '@/components/forms/ContactForm'
import Breadcrumbs from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  alternates: { canonical: '/contato/' },
  title: 'Contato | Fluxo Rural Consultoria no Agronegócio',
  description:
    'Entre em contato com a Fluxo Rural Consultoria. Atendimento especializado em gestão de propriedades rurais, capacitação corporativa e palestras em todo o Brasil. Retorno em até 24h úteis.',
  openGraph: {
    title: 'Contato | Fluxo Rural Consultoria no Agronegócio',
    description:
      'Fale com a equipe técnica da Fluxo Rural. Atendimento consultivo para produtores, cooperativas e empresas do agronegócio.',
    url: 'https://fluxorural.com.br/contato/',
  },
}

export default function ContatoPage() {
  return (
    <div className="bg-[#0A192F] text-slate-100 min-h-screen">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contato' }]} />

      <section className="pt-10 pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#112240] border border-[#4ADE80]/30 text-[#4ADE80] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4 shadow-sm">
              <Sparkles size={14} />
              <span>Atendimento Corporativo & Consultivo</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Fale com a Fluxo Rural
            </h1>
            <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
              Conte sobre a demanda da sua propriedade, cooperativa ou empresa. Nossa equipe técnica retornará o contato em até 24 horas úteis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Formulário */}
            <div className="lg:col-span-8 bg-[#112240]/90 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl">
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#112240]/80 border border-white/10 rounded-2xl p-6 space-y-6 shadow-lg">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center shrink-0 text-[#4ADE80]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">E-mail Oficial</p>
                    <a
                      href="mailto:contato@fluxorural.com.br"
                      className="text-slate-300 hover:text-[#E8B84B] transition-colors text-sm break-all font-light"
                    >
                      contato@fluxorural.com.br
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center shrink-0 text-[#4ADE80]">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">WhatsApp de Atendimento</p>
                    <a
                      href="https://wa.me/5545991447004"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-[#4ADE80] transition-colors text-sm font-light"
                    >
                      (45) 99144-7004
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center shrink-0 text-[#4ADE80]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Abrangência e Atuação</p>
                    <p className="text-slate-300 text-sm font-light">Atendimento em Todo o Brasil</p>
                    <p className="text-slate-400 text-xs mt-0.5">Consultoria presencial em campo e atendimento on-line</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center shrink-0 text-[#4ADE80]">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Tempo de Resposta</p>
                    <p className="text-slate-300 text-sm font-light">Até 24 horas úteis</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D1F3C] border border-white/10 rounded-2xl p-5 text-center space-y-1">
                <p className="text-xs font-semibold text-slate-200">
                  Fluxo Rural Consultoria e Gestão
                </p>
                <p className="text-xs text-slate-400 font-light">
                  Responsabilidade técnica agronômica especializada
                </p>
                <p className="text-xs text-[#4ADE80] font-semibold pt-1">
                  CREA-PR 179906/D
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
