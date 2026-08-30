'use client'

import React from 'react'
import { CheckCircle2, MessageCircle, ArrowRight, ShieldCheck, MapPin, Building2, TrendingUp, Sparkles, X } from 'lucide-react'
import type { DiagnosticoFormData, ScoreCalculationResult, NivelQualificacao } from '@/types/diagnostico'
import { trackLead } from '@/lib/track'
import { cn } from '@/lib/utils'

export interface DiagnosticSuccessScreenProps {
  data: DiagnosticoFormData
  scoreResult?: ScoreCalculationResult
  onClose?: () => void
  className?: string
}

const WHATSAPP_NUMERO = '5545991447004'

const ATIVIDADE_LABELS: Record<string, string> = {
  graos: 'Grãos & Culturas Anuais',
  pecuaria_corte: 'Pecuária de Corte',
  pecuaria_leite: 'Pecuária de Leite',
  hortifruti_cafe: 'Café, Frutas ou Hortifrúti',
  mista: 'Operação Mista / Diversificada',
  outra: 'Outra Atividade Agro',
}

const AREA_LABELS: Record<string, string> = {
  '<100ha': 'Até 100 hectares',
  '100-500ha': 'De 100 a 500 hectares',
  '500-2000ha': 'De 500 a 2.000 hectares',
  '>2000ha': 'Mais de 2.000 hectares',
  'nao-aplica': 'Área não se aplica',
}

const GESTAO_LABELS: Record<string, string> = {
  erp_software: 'Software de Gestão Rural / ERP',
  planilhas: 'Planilhas Estruturadas',
  caderno_basico: 'Controles Básicos / Caderno',
  nenhuma: 'Sem Controles Formais',
}

const DESAFIO_LABELS: Record<string, string> = {
  custos_margem: 'Controle de Custos & Margem Real',
  fluxo_caixa: 'Previsibilidade de Fluxo de Caixa',
  endividamento: 'Gestão de Dívidas & Custeio',
  sucessao: 'Sucessão Familiar & Governança',
  investimentos: 'Decisão de Investimento / Expansão',
  nao_sei: 'Avaliação Geral de Gestão',
}

const QUALIFICACAO_CONFIG: Record<
  NivelQualificacao,
  { label: string; badgeClass: string; desc: string }
> = {
  verde: {
    label: 'Prioridade Alta · Qualificação Verde',
    badgeClass: 'bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/40',
    desc: 'Operação com alto potencial de ganho imediato de eficiência e rentabilidade.',
  },
  amarelo: {
    label: 'Prioridade Média · Qualificação Amarela',
    badgeClass: 'bg-[#E8B84B]/15 text-[#E8B84B] border-[#E8B84B]/40',
    desc: 'Propriedade pronta para estruturação de processos e rotinas de caixa.',
  },
  laranja: {
    label: 'Prioridade Padrão · Qualificação Laranja',
    badgeClass: 'bg-orange-400/15 text-orange-300 border-orange-400/40',
    desc: 'Fase inicial de organização e diagnóstico técnico.',
  },
  vermelho: {
    label: 'Diagnóstico Preliminar',
    badgeClass: 'bg-slate-400/15 text-slate-300 border-slate-400/40',
    desc: 'Análise de alinhamento com metodologia de consultoria.',
  },
}

export function DiagnosticSuccessScreen({
  data,
  scoreResult,
  onClose,
  className,
}: DiagnosticSuccessScreenProps) {
  const primeiroNome = data.nome.trim().split(' ')[0] || 'Produtor'
  const atividadeLabel = ATIVIDADE_LABELS[data.atividade] || data.atividade || 'Não informada'
  const areaLabel = AREA_LABELS[data.area_ha] || data.area_ha || 'Não informada'
  const gestaoLabel = GESTAO_LABELS[data.gestao_atual] || data.gestao_atual || 'Não informada'
  const desafioLabel = DESAFIO_LABELS[data.desafio_principal] || data.desafio_principal || 'Não informado'
  const qualificacao = scoreResult?.qualificationLevel || 'verde'
  const qualConfig = QUALIFICACAO_CONFIG[qualificacao]

  const nomePropriedadeOuGenerico = data.nome_propriedade?.trim()
    ? `a fazenda ${data.nome_propriedade.trim()}`
    : 'minha propriedade rural'

  const localizacaoFormatada = [data.cidade, data.estado].filter(Boolean).join(' / ')

  const msgWhats = `Olá Lucas! Acabei de enviar o diagnóstico gratuito de gestão para ${nomePropriedadeOuGenerico}${
    localizacaoFormatada ? ` em ${localizacaoFormatada}` : ''
  } (foco em ${desafioLabel}) e gostaria de agilizar minha sessão de 30 minutos.`

  const linkWhats = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msgWhats)}`

  const handleWhatsAppClick = () => {
    trackLead('diagnostico_whatsapp_direct', {
      form_location: 'diagnostico_sucesso',
      score: scoreResult?.score ?? 0,
      qualification: qualificacao,
    })
  }

  return (
    <div
      className={cn(
        'w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300',
        className
      )}
      aria-live="polite"
    >
      {/* Botão de Fechar se fornecido */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar tela de sucesso"
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={22} />
        </button>
      )}

      {/* Ícone de Sucesso */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-[#4ADE80]/15 border-2 border-[#4ADE80]/40 flex items-center justify-center text-[#4ADE80] shadow-[0_0_32px_rgba(74,222,128,0.25)]">
          <CheckCircle2 size={44} strokeWidth={2.4} />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#E8B84B] text-[#0A192F] flex items-center justify-center shadow-md">
          <Sparkles size={14} strokeWidth={2.5} />
        </div>
      </div>

      {/* Título & Subtítulo */}
      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
        Diagnóstico Enviado com Sucesso!
      </h2>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mb-6 font-light">
        Obrigado, <strong className="text-white font-semibold">{primeiroNome}</strong>. Nossa equipe técnica já recebeu as informações da sua propriedade
        {localizacaoFormatada ? (
          <> em <strong className="text-white font-medium">{localizacaoFormatada}</strong></>
        ) : null} e fará a consolidação da análise preliminar.
      </p>

      {/* Badge de Qualificação */}
      <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold tracking-wide shadow-sm backdrop-blur-md">
        <span className={cn('px-2.5 py-0.5 rounded-full border', qualConfig.badgeClass)}>
          {qualConfig.label}
        </span>
      </div>

      {/* Card de Resumo da Fazenda */}
      <div className="w-full bg-[#0D1F3C]/90 border border-white/15 rounded-2xl p-5 sm:p-6 text-left mb-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <span className="text-[#E8B84B] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Building2 size={14} />
            Resumo da Operação Enviada
          </span>
          {localizacaoFormatada && (
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <MapPin size={12} className="text-[#4ADE80]" />
              {localizacaoFormatada}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Atividade Principal</span>
            <span className="text-slate-100 font-medium">{atividadeLabel}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Dimensão da Área</span>
            <span className="text-slate-100 font-medium">{areaLabel}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Gestão Atual</span>
            <span className="text-slate-100 font-medium">{gestaoLabel}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Principal Desafio</span>
            <span className="text-[#4ADE80] font-medium">{desafioLabel}</span>
          </div>

          {data.detalhe_desafio && (
            <div className="sm:col-span-2 pt-1 border-t border-white/5">
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Detalhamento do Desafio</span>
              <span className="text-slate-200 text-xs">{data.detalhe_desafio}</span>
            </div>
          )}

          {data.nome_propriedade && (
            <div className="sm:col-span-2">
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Propriedade / Empresa</span>
              <span className="text-slate-200">{data.nome_propriedade}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chamada para Agilizar no WhatsApp */}
      <div className="w-full space-y-3">
        <p className="text-slate-300 text-xs sm:text-sm font-medium">
          Deseja antecipar o agendamento da sua sessão de 30 minutos com o consultor?
        </p>

        <a
          href={linkWhats}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className={cn(
            'w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold text-base text-white shadow-xl transition-all duration-200 cursor-pointer',
            'bg-[#6AAF3D] hover:bg-[#6AAF3D]/90 active:scale-[0.99] border border-[#6AAF3D]/40',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A192F]'
          )}
        >
          <MessageCircle size={20} className="shrink-0" />
          <span>Agilizar Atendimento via WhatsApp</span>
          <ArrowRight size={18} className="shrink-0" />
        </a>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 py-3 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Voltar à página inicial
          </button>
        )}
      </div>

      {/* Garantias e Segurança */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-slate-400 text-xs">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#4ADE80]" /> Sigilo absoluto dos dados
        </span>
        <span className="flex items-center gap-1.5">
          <TrendingUp size={14} className="text-[#E8B84B]" /> Retorno técnico em até 24h úteis
        </span>
      </div>
    </div>
  )
}
