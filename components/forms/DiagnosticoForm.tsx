'use client'

import React, { useState } from 'react'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  BarChart3,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { DiagnosticModal } from '@/components/diagnostico/DiagnosticModal'
import { trackCta } from '@/lib/track'
import { cn } from '@/lib/utils'

export interface DiagnosticoFormProps {
  className?: string
  autoOpen?: boolean
}

export function DiagnosticoForm({ className, autoOpen = false }: DiagnosticoFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(autoOpen)

  const handleOpen = () => {
    trackCta({ cta: 'iniciar_diagnostico_btn', location: 'diagnostico_form_card' })
    setIsModalOpen(true)
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Card de Apresentação / Launcher do Diagnóstico */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#112240] to-[#0D1F3C] border border-white/15 p-6 sm:p-8 lg:p-10 shadow-2xl text-left">
        {/* Glow decorativo de fundo */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#4ADE80]/10 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 space-y-6">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80] text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} className="text-[#E8B84B]" />
            <span>Diagnóstico Interativo 100% Gratuito</span>
          </div>

          {/* Título & Proposta de Valor */}
          <div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Avalie a Gestão da sua Fazenda em 9 Etapas Rápidas
            </h3>
            <p className="mt-2.5 text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              Uma experiência imersiva e sem atrito: responda primeiro sobre a realidade produtiva da sua fazenda e receba uma leitura técnica personalizada dos principais gargalos de caixa e margem.
            </p>
          </div>

          {/* Destaques do formato */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <Layers size={18} className="text-[#4ADE80] shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-white uppercase tracking-wider">
                  1 Pergunta por Tela
                </span>
                <span className="text-[12px] text-slate-300 font-light">
                  Navegação ágil com atalhos de teclado
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <Clock size={18} className="text-[#E8B84B] shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-white uppercase tracking-wider">
                  Menos de 3 Minutos
                </span>
                <span className="text-[12px] text-slate-300 font-light">
                  Sem perguntas desnecessárias
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <BarChart3 size={18} className="text-[#4ADE80] shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-white uppercase tracking-wider">
                  Retorno Técnico 24h
                </span>
                <span className="text-[12px] text-slate-300 font-light">
                  Análise conduzida por Lucas Dierings
                </span>
              </div>
            </div>
          </div>

          {/* Botão de Abertura Principal */}
          <div className="pt-3 space-y-3">
            <button
              type="button"
              onClick={handleOpen}
              className={cn(
                'w-full min-h-[58px] sm:min-h-[64px] px-8 py-4 rounded-xl font-bold text-base sm:text-lg text-white shadow-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 group',
                'bg-[#6AAF3D] hover:bg-[#6AAF3D]/90 active:scale-[0.99] border border-[#6AAF3D]/50 shadow-[0_10px_30px_rgba(106,175,61,0.25)]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A192F]'
              )}
            >
              <span>Iniciar Diagnóstico Gratuito da Fazenda</span>
              <ArrowRight
                size={20}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-light">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#4ADE80]" /> Dados protegidos sob a LGPD
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#4ADE80]" /> Sem cadastro invasivo inicial
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Interativo Full-Screen */}
      <DiagnosticModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
