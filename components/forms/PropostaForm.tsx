'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react'
import { trackLead, readAttribution } from '@/lib/track'
import { SERVICOS, perguntasDe, pedeOrganizacao, type Servico } from '@/lib/proposta'

// Formulário único de pedido do site. Uma pergunta por tela, ramificando pelo
// serviço escolhido, e o contato só no fim.
//
// Duas decisões que vieram de errar antes:
//   1. Qualificação ANTES do contato. Pedir nome e telefone de cara faz o
//      visitante decidir se confia antes de ter investido qualquer coisa.
//   2. O evento de conversão só dispara com HTTP 200. O DiagnosticoForm avança
//      mesmo com o POST falhando e conta conversão que não existiu.

const API = '/api/proposta'
const WHATSAPP_NUMERO = '5545991447004'

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR',
  'PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
const selectClass =
  'w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-navy/30'

function Cartao({
  ativo,
  onClick,
  titulo,
  sub,
}: {
  ativo: boolean
  onClick: () => void
  titulo: string
  sub?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left px-5 py-4 min-h-[56px] rounded-xl border-2 transition-colors ${
        ativo
          ? 'bg-navy text-white border-navy'
          : 'bg-white text-carvao/80 border-gray-300 hover:border-navy/60 hover:bg-navy/[0.02]'
      }`}
    >
      <span className="block font-semibold text-[15px] leading-snug">{titulo}</span>
      {sub && (
        <span className={`block text-xs mt-1 ${ativo ? 'text-white/70' : 'text-carvao/50'}`}>
          {sub}
        </span>
      )}
    </button>
  )
}

interface PropostaFormProps {
  /** Serviço pré-selecionado pela URL, quando vem de um botão de página. */
  servicoInicial?: Servico
  /** Tema pré-selecionado pela URL, quando vem do card de um tema ou curso. */
  temaInicial?: string
}

export default function PropostaForm({ servicoInicial, temaInicial }: PropostaFormProps) {
  // -1 = escolha do serviço. 0..n-1 = perguntas. n = contato.
  const [passo, setPasso] = useState(servicoInicial ? 0 : -1)
  const [servico, setServico] = useState<Servico | null>(servicoInicial ?? null)
  const [respostas, setRespostas] = useState<Record<string, string>>(
    temaInicial ? { tema: temaInicial } : {}
  )
  const [contato, setContato] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    organizacao: '',
    cidade: '',
    uf: '',
    detalhes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)

  const perguntas = useMemo(() => (servico ? perguntasDe(servico) : []), [servico])
  const total = perguntas.length + 1 // perguntas + tela de contato
  const naContato = passo >= perguntas.length

  // O serviço e o tema chegam pela query string (?servico=treinamento&tema=...),
  // porque o site é static export e a página não consegue ler isso no servidor.
  // Em useEffect e não no initializer do useState: ler `window` durante o
  // render quebraria a hidratação, já que o HTML é gerado sem a query.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const s = q.get('servico') as Servico | null
    const t = q.get('tema')
    if (s && SERVICOS.some((x) => x.valor === s)) {
      setServico(s)
      setPasso(0)
    }
    if (t) setRespostas((r) => ({ ...r, tema: t }))
  }, [])

  // Rola pro topo do formulário a cada troca de tela: sem isso, no celular o
  // visitante avança e continua vendo o meio da pergunta anterior.
  useEffect(() => {
    document.getElementById('proposta-topo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [passo])

  const escolherServico = (s: Servico) => {
    setServico(s)
    setRespostas(temaInicial ? { tema: temaInicial } : {})
    setPasso(0)
  }

  const responder = (campo: string, valor: string) => {
    setRespostas((r) => ({ ...r, [campo]: valor }))
    setPasso((p) => p + 1) // avanço automático: um toque, uma pergunta
  }

  const voltar = () => setPasso((p) => p - 1)

  const contatoValido =
    contato.nome.trim() !== '' && contato.email.trim() !== '' && contato.whatsapp.trim() !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contatoValido || submitting || !servico) return
    setSubmitting(true)
    setErro(null)
    const attr = readAttribution()
    const origemLead = attr.origem === 'site' ? 'proposta' : attr.origem
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          etapa: 'completo',
          tipo: servico,
          ...respostas,
          ...contato,
          ...attr,
          origem: origemLead,
          page_url: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => null)
        throw new Error(d?.error || 'Não foi possível enviar. Tente de novo.')
      }
      trackLead('proposta_lead', {
        form_location: 'proposta',
        origem: origemLead,
        lead_type: servico === 'consultoria' ? 'consultoria' : 'palestra',
        tipo_pedido: servico,
      })
      setEnviado(true)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível enviar. Tente de novo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (enviado) {
    const rotulo = SERVICOS.find((s) => s.valor === servico)?.titulo.toLowerCase() || 'contato'
    const msg = `Olá Lucas! Acabei de enviar um pedido pelo site sobre ${rotulo}${
      contato.organizacao ? ` (${contato.organizacao})` : ''
    }.`
    return (
      <div className="text-center py-12 space-y-5">
        <CheckCircle2 className="mx-auto text-verde-folha" size={64} />
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy">Pedido recebido!</h2>
        <p className="text-carvao/70 max-w-md mx-auto">
          Obrigado, {contato.nome.split(' ')[0]}. Vou ler com calma e retorno em até 24h.
        </p>
        <p className="text-carvao/50 text-sm max-w-md mx-auto">
          Quer adiantar? Me chama no WhatsApp que a conversa começa agora.
        </p>
        <div className="flex justify-center pt-2">
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackLead('proposta_whatsapp_click', {
                form_location: 'proposta',
                origem: 'tela-sucesso',
              })
            }
            className="inline-flex items-center justify-center min-h-[52px] gap-2 rounded-full bg-verde-folha text-white px-8 text-base font-semibold hover:bg-verde-folha/90 transition-colors"
          >
            <MessageCircle size={20} /> Continuar no WhatsApp
          </a>
        </div>
      </div>
    )
  }

  const pct = passo < 0 ? 0 : Math.round(((passo + 1) / (total + 1)) * 100)

  return (
    <div id="proposta-topo" className="scroll-mt-24">
      {/* Progresso */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-sm font-medium text-navy whitespace-nowrap tabular-nums">
          {passo < 0 ? 1 : passo + 2} de {total + 1}
        </span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-verde-folha rounded-full transition-all duration-500"
            style={{ width: `${Math.max(pct, 8)}%` }}
          />
        </div>
      </div>

      {erro && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
          {erro}
        </p>
      )}

      {/* Escolha do serviço */}
      {passo < 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-2">
              O que você procura?
            </h2>
            <p className="text-carvao/60 text-sm">
              As próximas perguntas mudam conforme a sua resposta. São poucas.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {SERVICOS.map((s) => (
              <Cartao
                key={s.valor}
                ativo={false}
                onClick={() => escolherServico(s.valor)}
                titulo={s.titulo}
                sub={s.sub}
              />
            ))}
          </div>
        </div>
      )}

      {/* Perguntas do serviço */}
      {passo >= 0 && !naContato && servico && (
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-2">
              {perguntas[passo].titulo}
            </h2>
            {perguntas[passo].ajuda && (
              <p className="text-carvao/60 text-sm">{perguntas[passo].ajuda}</p>
            )}
          </div>
          <div
            className={`grid gap-3 ${
              perguntas[passo].colunas === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {perguntas[passo].opcoes.map((op) => (
              <Cartao
                key={op}
                ativo={respostas[perguntas[passo].campo] === op}
                onClick={() => responder(perguntas[passo].campo, op)}
                titulo={op}
              />
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={passo === 0 ? () => setPasso(-1) : voltar}
              className="inline-flex items-center gap-1.5 text-sm text-carvao/50 hover:text-navy min-h-[44px]"
            >
              <ArrowLeft size={16} /> Voltar
            </button>
            <button
              type="button"
              onClick={() => setPasso((p) => p + 1)}
              className="text-sm text-carvao/40 hover:text-navy underline min-h-[44px]"
            >
              Pular
            </button>
          </div>
        </div>
      )}

      {/* Contato */}
      {naContato && servico && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-2">
              Só falta saber quem é você
            </h2>
            <p className="text-carvao/60 text-sm">Retorno em até 24h, no canal que preferir.</p>
          </div>

          <div>
            <label className={labelClass}>Nome completo *</label>
            <Input
              value={contato.nome}
              onChange={(e) => setContato({ ...contato, nome: e.target.value })}
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className={labelClass}>WhatsApp *</label>
            <Input
              type="tel"
              value={contato.whatsapp}
              onChange={(e) => setContato({ ...contato, whatsapp: e.target.value })}
              placeholder="(XX) 9XXXX-XXXX"
            />
          </div>
          <div>
            <label className={labelClass}>E-mail *</label>
            <Input
              type="email"
              value={contato.email}
              onChange={(e) => setContato({ ...contato, email: e.target.value })}
              placeholder="seu@email.com"
            />
          </div>
          {pedeOrganizacao(servico) && (
            <div>
              <label className={labelClass}>Organização</label>
              <Input
                value={contato.organizacao}
                onChange={(e) => setContato({ ...contato, organizacao: e.target.value })}
                placeholder="Cooperativa, empresa, sindicato, faculdade..."
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Cidade</label>
              <Input
                value={contato.cidade}
                onChange={(e) => setContato({ ...contato, cidade: e.target.value })}
                placeholder="Cidade"
              />
            </div>
            <div>
              <label className={labelClass}>UF</label>
              <select
                value={contato.uf}
                onChange={(e) => setContato({ ...contato, uf: e.target.value })}
                className={selectClass}
              >
                <option value="">--</option>
                {ESTADOS_BR.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Quer contar mais alguma coisa?</label>
            <textarea
              value={contato.detalhes}
              onChange={(e) => setContato({ ...contato, detalhes: e.target.value })}
              rows={3}
              className={selectClass}
              placeholder="Opcional"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={voltar} className="flex-1" size="lg">
              <ArrowLeft className="mr-2" size={18} /> Voltar
            </Button>
            <Button type="submit" disabled={submitting || !contatoValido} className="flex-1" size="lg">
              {submitting ? 'Enviando...' : <>Enviar <ArrowRight className="ml-2" size={18} /></>}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
