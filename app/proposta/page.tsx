import type { Metadata } from 'next'
import PropostaForm from '@/components/forms/PropostaForm'

export const metadata: Metadata = {
  alternates: { canonical: '/proposta/' },
  title: 'Falar com Consultor | Fluxo Rural',
  description:
    'Conte o que você procura: consultoria em gestão rural, palestras, capacitação profissional ou parcerias. Retorno técnico em até 24h.',
  // Página de formulário não deve competir nos resultados de busca com as
  // páginas de serviço, que é onde o conteúdo está.
  robots: { index: false, follow: true },
}

export default function PropostaPage() {
  return (
    <section className="bg-off-white min-h-[80vh] py-14 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-3">
            Falar com a Nossa Equipe
          </h1>
          <p className="text-carvao/70">
            Conte o que você procura para a sua fazenda ou evento. Retorno em até 24h.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <PropostaForm />
        </div>
        <p className="text-center text-carvao/45 text-xs mt-6">
          Seus dados são usados só para retornar o contato. Sem lista de disparo automático.
        </p>
      </div>
    </section>
  )
}
