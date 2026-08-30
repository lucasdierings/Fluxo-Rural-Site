import { CURSOS, TEMAS_PALESTRA } from '@/lib/catalogo'
import Image from 'next/image'

export const metadata = {
  title: 'Portfólio - Fluxo Rural',
  robots: {
    index: false,
    follow: false,
  }
}

export default function PortfolioPdfGenerator() {
  return (
    <div className="bg-white min-h-screen text-carvao selection:bg-verde-folha selection:text-white print:bg-white print:m-0">
      
      {/* Estilo global para impressão */}
      <style dangerouslySetInnerHTML={{__html: `
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page-break-after {
            page-break-after: always;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
        }
      `}} />

      {/* CAPA */}
      <div className="w-[210mm] h-[297mm] mx-auto bg-navy relative overflow-hidden flex flex-col justify-end p-12 page-break-after shadow-xl print:shadow-none">
        <Image
          src="/images/lucas-hero.jpg"
          alt="Lucas Dierings"
          fill
          className="object-cover object-center opacity-60 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
        <div className="relative z-10 w-full">
          <div className="w-56 mb-8">
            <Image src="/logo-fluxo-rural-horizontal-novo.png" alt="Fluxo Rural" width={224} height={48} className="w-full h-auto" />
          </div>
          <span className="text-dourado uppercase tracking-widest text-sm font-semibold mb-2 block">
            Portfólio Oficial
          </span>
          <h1 className="text-white font-heading text-5xl font-bold mb-4 leading-tight">
            Palestras e Treinamentos
          </h1>
          <p className="text-white/80 text-xl max-w-lg mb-8">
            Gestão, finanças, sucessão, liderança e inovação na linguagem do campo.
          </p>
          <div className="pt-8 border-t border-white/20">
            <p className="text-white font-semibold">Lucas Dierings</p>
            <p className="text-white/60">Engenheiro Agrônomo e Consultor</p>
          </div>
        </div>
      </div>

      {/* PALESTRAS */}
      <div className="w-[210mm] min-h-[297mm] mx-auto bg-white px-16 py-16 page-break-after shadow-xl print:shadow-none">
        <div className="mb-12 border-b-2 border-verde-folha inline-block pb-2">
          <h2 className="text-navy font-heading text-3xl font-bold">Palestras (45 a 60 min)</h2>
        </div>
        
        <div className="space-y-12">
          {TEMAS_PALESTRA.map(tema => (
            <div key={tema.id} className="page-break-inside-avoid">
              <h3 className="text-navy font-heading text-xl font-bold mb-2">{tema.title}</h3>
              <p className="text-carvao/80 italic mb-4">{tema.promise}</p>
              <ul className="space-y-2">
                {tema.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm text-carvao/90">
                    <span className="text-verde-folha font-bold mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* TREINAMENTOS */}
      <div className="w-[210mm] min-h-[297mm] mx-auto bg-white px-16 py-16 page-break-after shadow-xl print:shadow-none">
        <div className="mb-12 border-b-2 border-verde-folha inline-block pb-2">
          <h2 className="text-navy font-heading text-3xl font-bold">Capacitação Corporativa</h2>
          <p className="text-carvao/60 mt-1">Imersões práticas de 4h ou 8h de duração.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
          {CURSOS.map(curso => (
            <div key={curso.id} className="page-break-inside-avoid bg-off-white p-6 rounded-xl border border-navy/5">
              <h3 className="text-navy font-heading text-lg font-bold mb-2">{curso.titulo}</h3>
              <p className="text-carvao/70 text-sm mb-4 leading-relaxed">{curso.subtitulo}</p>
              
              <div className="flex gap-2 mb-4">
                {curso.formatos.map(f => (
                  <span key={f} className="text-xs font-semibold bg-navy text-white px-2 py-1 rounded">
                    {f}
                  </span>
                ))}
              </div>
              
              <p className="text-xs uppercase tracking-wider text-carvao/50 font-bold mb-2">Módulos Abordados:</p>
              <ul className="space-y-1.5">
                {curso.modulos.map((m, i) => (
                  <li key={i} className="flex gap-2 text-xs text-carvao/80">
                    <span className="text-verde-folha mt-0.5 w-1.5 h-1.5 rounded-full bg-verde-folha shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CONTRA-CAPA / BIO */}
      <div className="w-[210mm] h-[297mm] mx-auto bg-navy text-white px-16 py-16 flex flex-col shadow-xl print:shadow-none">
        <div className="flex-1">
          <h2 className="font-heading text-4xl font-bold mb-8 text-dourado">Sobre o Palestrante</h2>
          <p className="text-lg leading-relaxed mb-6 font-light">
            Lucas Dierings é engenheiro agrônomo graduado pela UFPR, com MBA em Agronegócios pela USP/ESALQ.
            Atua há anos na intersecção entre tecnologia e gestão no campo, tendo passado por startups de gestão rural,
            atuando como consultor de produtores, e como host de podcasts do agronegócio como o Agro Jovem e o NHCast (New Holland).
          </p>
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <h3 className="font-bold text-xl mb-2">Credenciais</h3>
              <ul className="space-y-2 text-white/80">
                <li>• Top 5 CNA Jovem Brasil</li>
                <li>• Host do NHCast (New Holland)</li>
                <li>• MBA em Agronegócios (USP/ESALQ)</li>
                <li>• Consultor e Empreendedor no Agro</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Contato</h3>
              <ul className="space-y-2 text-white/80">
                <li>lucas@fluxorural.com.br</li>
                <li>(43) 9 9128-0857</li>
                <li>www.fluxorural.com.br</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/20 flex justify-between items-center text-white/50 text-sm">
          <span>Fluxo Rural Consultoria em Agronegócio</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>

    </div>
  )
}
