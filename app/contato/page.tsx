import type { Metadata } from 'next'
import { Mail, MapPin, Clock, MessageCircle, Linkedin } from 'lucide-react'
import { ContactForm } from '@/components/forms/ContactForm'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com Lucas Dierings. Consultoria, mentoria e palestras para o agronegócio. Resposta em até 24 horas.',
  openGraph: {
    title: 'Contato | Fluxo Rural Consultoria',
    description: 'Fale com Lucas Dierings — resposta em até 24 horas.',
  },
}

export default function ContatoPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991447004'
  const whatsappMessage = encodeURIComponent(
    'Olá Lucas! Vim pelo site fluxorural.com.br e gostaria de saber mais sobre seus serviços.'
  )

  return (
    <>
      <section className="pt-32 pb-20 bg-off-white">
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
                    <a href="mailto:lucas@fluxorural.com.br" className="text-carvao/70 hover:text-dourado transition-colors text-sm">
                      lucas@fluxorural.com.br
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-navy mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-navy">Localização</p>
                    <p className="text-carvao/70 text-sm">Londrina, Paraná — Brasil</p>
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

              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-semibold py-4 rounded-xl hover:bg-[#20bd5a] transition-colors w-full"
              >
                <MessageCircle size={22} />
                Falar pelo WhatsApp
              </a>

              <a
                href="https://www.linkedin.com/in/lucas-dierings"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-navy text-white font-semibold py-4 rounded-xl hover:bg-navy/90 transition-colors w-full"
              >
                <Linkedin size={22} />
                Conectar no LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
