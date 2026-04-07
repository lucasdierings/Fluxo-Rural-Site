import type { Metadata } from 'next'
import { Mail, MapPin, Clock } from 'lucide-react'
import { ContactForm } from '@/components/forms/ContactForm'
import Breadcrumbs from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a Fluxo Rural Consultoria. Consultoria, mentoria e palestras para o agronegócio. Resposta em até 24 horas.',
  openGraph: {
    title: 'Contato | Fluxo Rural Consultoria',
    description: 'Fale com a Fluxo Rural Consultoria — resposta em até 24 horas.',
  },
}

export default function ContatoPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contato' }]} />
      <section className="pb-20 bg-off-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy mb-4">
              Vamos Conversar
            </h1>
            <p className="text-carvao/60 text-lg">
              Respondo em até 24 horas úteis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Formulário */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <Mail className="text-navy mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-navy">E-mail</p>
                    <a href="mailto:contato@fluxorural.com.br" className="text-carvao/70 hover:text-dourado transition-colors text-sm">
                      contato@fluxorural.com.br
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-navy mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-navy">Localização</p>
                    <p className="text-carvao/70 text-sm">Curitiba, Paraná — Brasil</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-navy mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-navy">Tempo de resposta</p>
                    <p className="text-carvao/70 text-sm">Até 24 horas úteis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
