'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { trackLead, readAttribution } from '@/lib/track'
import { PORTFOLIO_PDF } from '@/lib/catalogo'
import type { VariantProps } from 'class-variance-authority'

// O portfólio é ISCA, não proposta. Quem baixa entra no CRM como CONTATO, sem
// abrir negócio: baixar um PDF não é intenção de compra, e tratar como
// oportunidade suja o funil. Por isso o POST usa `etapa: 'contato'`, que a
// Function traduz em contato{} sem negocio{}.
//
// Quem já baixou não é perguntado de novo: o flag fica no localStorage.

const API = '/api/proposta'
const JA_BAIXOU = 'fr_portfolio'

type Variant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
type Size = NonNullable<VariantProps<typeof buttonVariants>['size']>

interface PortfolioDownloadProps {
  label?: string
  variant?: Variant
  size?: Size
  className?: string
  origem?: string
  formLocation?: string
}

export function PortfolioDownload({
  label = 'Baixar portfólio',
  variant = 'default',
  size = 'lg',
  className,
  origem,
  formLocation = 'palestras',
}: PortfolioDownloadProps) {
  const [aberto, setAberto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [dados, setDados] = useState({ nome: '', email: '', whatsapp: '' })

  const valido =
    dados.nome.trim() !== '' && dados.email.trim() !== '' && dados.whatsapp.trim() !== ''

  const baixar = () => {
    const a = document.createElement('a')
    a.href = PORTFOLIO_PDF
    a.download = ''
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const abrir = (e: React.MouseEvent) => {
    e.preventDefault()
    // Já deixou os dados antes: libera direto, sem pedir de novo.
    if (typeof window !== 'undefined' && localStorage.getItem(JA_BAIXOU)) {
      trackLead('midia_kit_download', {
        form_location: formLocation,
        origem: origem || 'geral',
        repetido: true,
      })
      baixar()
      return
    }
    setAberto(true)
  }

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valido || enviando) return
    setEnviando(true)
    setErro(null)
    const attr = readAttribution()
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          etapa: 'contato',
          tipo: 'portfolio',
          ...dados,
          ...attr,
          origem: attr.origem === 'site' ? 'portfolio' : attr.origem,
          page_url: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => null)
        throw new Error(d?.error || 'Não foi possível liberar o download. Tente de novo.')
      }
      localStorage.setItem(JA_BAIXOU, '1')
      trackLead('midia_kit_download', {
        form_location: formLocation,
        origem: origem || 'geral',
        lead_type: 'portfolio',
      })
      setAberto(false)
      baixar()
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível liberar o download.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <a
        href={PORTFOLIO_PDF}
        onClick={abrir}
        className={cn(buttonVariants({ variant, size }), 'gap-2', className)}
      >
        <Download size={20} />
        {label}
      </a>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogTitle>O portfólio completo em PDF</DialogTitle>
          <DialogDescription className="mt-2">
            As 6 palestras e os 7 treinamentos, com conteúdo programático, carga horária e
            credenciais. Deixe seu contato e o download começa na hora.
          </DialogDescription>

          {erro && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
              {erro}
            </p>
          )}

          <form onSubmit={enviar} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <Input
                value={dados.nome}
                onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
              <Input
                type="email"
                value={dados.email}
                onChange={(e) => setDados({ ...dados, email: e.target.value })}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
              <Input
                type="tel"
                value={dados.whatsapp}
                onChange={(e) => setDados({ ...dados, whatsapp: e.target.value })}
                placeholder="(XX) 9XXXX-XXXX"
              />
            </div>
            <Button type="submit" disabled={!valido || enviando} className="w-full" size="lg">
              {enviando ? 'Liberando...' : <><Download className="mr-2" size={18} /> Baixar agora</>}
            </Button>
            <p className="text-xs text-carvao/45 text-center">
              Só para te enviar o material e retornar se você chamar. Sem disparo automático.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
