import Image from 'next/image'
import Link from 'next/link'

export default function AuthorCard() {
  return (
    <div className="bg-off-white rounded-xl p-6 flex flex-col sm:flex-row items-center gap-5">
      <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src="/images/lucas-hero.jpg"
          alt="Lucas Dierings"
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h4 className="font-heading font-bold text-navy text-lg">Lucas Dierings</h4>
        <p className="text-carvao/60 text-sm">
          Engenheiro Agrônomo | MBA em Agronegócios USP/ESALQ
        </p>
        <p className="text-carvao/50 text-sm mt-1">
          Engenheiro Agrônomo (CREA-PR 179906/D), pós-graduado em Agronegócios pela USP/ESALQ, professor e fundador da Fluxo Rural Consultoria. Consultor credenciado Senar e Sebrae, especialista em gestão técnica, financeira e sucessão familiar com experiência prática em propriedades rurais em 24 estados.
        </p>
        <Link href="/sobre" className="text-navy text-sm font-medium hover:text-dourado transition-colors mt-2 inline-block">
          Saiba mais →
        </Link>
      </div>
    </div>
  )
}
