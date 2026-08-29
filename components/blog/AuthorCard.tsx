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
          Fundador da Fluxo Rural Consultoria, consultor credenciado do SENAR-PR e professor de MBA. Destaque Nacional do Programa Jovens Líderes do Agro (CNA Jovem 2021). Membro ativo da JCI (Junior Chamber International), organização mundial de formação de líderes presente em mais de 100 países. Coautor do livro <em>Os Jovens, o Brasil e o Agro</em>.
        </p>
        <Link href="/sobre" className="text-navy text-sm font-medium hover:text-dourado transition-colors mt-2 inline-block">
          Saiba mais →
        </Link>
      </div>
    </div>
  )
}
