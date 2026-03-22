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
          Engenheiro Agrônomo | Consultor Estratégico | Palestrante
        </p>
        <p className="text-carvao/50 text-sm mt-1">
          Fundador da Fluxo Rural Consultoria. Especialista em gestão, inovação e sucessão no agronegócio.
        </p>
        <Link href="/sobre" className="text-navy text-sm font-medium hover:text-dourado transition-colors mt-2 inline-block">
          Saiba mais →
        </Link>
      </div>
    </div>
  )
}
