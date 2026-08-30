'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Check, ChevronsUpDown, Loader2, MapPin, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const ESTADOS_BRASIL = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
] as const

export interface UfCitySelectorProps {
  uf: string
  cidade: string
  onUfChange: (uf: string) => void
  onCidadeChange: (cidade: string) => void
  disabled?: boolean
  errorUf?: string
  errorCidade?: string
  className?: string
}

// Cache global em memória para não repetir requisições na navegação
const cidadesCache = new Map<string, string[]>()

export function UfCitySelector({
  uf,
  cidade,
  onUfChange,
  onCidadeChange,
  disabled = false,
  errorUf,
  errorCidade,
  className,
}: UfCitySelectorProps) {
  const [cidades, setCidades] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [fallbackMode, setFallbackMode] = useState(false)
  const [busca, setBusca] = useState(cidade || '')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Sincroniza busca local caso o valor externo mude
  useEffect(() => {
    setBusca(cidade || '')
  }, [cidade])

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Carrega cidades via API IBGE com cache e fallback
  useEffect(() => {
    if (!uf || uf.length !== 2) {
      setCidades([])
      setLoading(false)
      return
    }

    if (cidadesCache.has(uf)) {
      setCidades(cidadesCache.get(uf)!)
      setFallbackMode(false)
      return
    }

    setLoading(true)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500) // Timeout de 3.5s

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        clearTimeout(timeoutId)
        if (!res.ok) throw new Error(`IBGE HTTP ${res.status}`)
        const data = (await res.json()) as Array<{ nome: string }>
        const nomes: string[] = Array.isArray(data) ? data.map((m) => m.nome) : []
        cidadesCache.set(uf, nomes)
        setCidades(nomes)
        setFallbackMode(false)
      })
      .catch(() => {
        // Degradação graciosa para input de texto livre caso haja falha de rede/IBGE/timeout
        setFallbackMode(true)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [uf])

  // Filtro inteligente de busca (insensível a maiúsculas e acentos)
  const cidadesFiltradas = useMemo(() => {
    if (!busca) return cidades.slice(0, 100)
    const buscaNorm = busca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return cidades
      .filter((c) =>
        c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(buscaNorm)
      )
      .slice(0, 100)
  }, [cidades, busca])

  const handleUfSelect = (newUf: string) => {
    onUfChange(newUf)
    onCidadeChange('')
    setBusca('')
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleCidadeSelect = useCallback(
    (nome: string) => {
      onCidadeChange(nome)
      setBusca(nome)
      setIsOpen(false)
      setHighlightedIndex(-1)
    },
    [onCidadeChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        if (uf && cidadesFiltradas.length > 0) {
          setIsOpen(true)
          setHighlightedIndex(0)
          e.preventDefault()
        }
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        const next = prev < cidadesFiltradas.length - 1 ? prev + 1 : 0
        scrollItemIntoView(next)
        return next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : cidadesFiltradas.length - 1
        scrollItemIntoView(next)
        return next
      })
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < cidadesFiltradas.length) {
        e.preventDefault()
        handleCidadeSelect(cidadesFiltradas[highlightedIndex])
      } else if (cidadesFiltradas.length > 0) {
        e.preventDefault()
        handleCidadeSelect(cidadesFiltradas[0])
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      setHighlightedIndex(-1)
    } else if (e.key === 'Tab') {
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  const scrollItemIntoView = (index: number) => {
    if (listRef.current) {
      const items = listRef.current.children
      if (items[index]) {
        (items[index] as HTMLElement).scrollIntoView({ block: 'nearest' })
      }
    }
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-12 gap-4', className)}>
      {/* Seletor de UF */}
      <div className="sm:col-span-4">
        <label
          htmlFor="uf-select"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          Estado (UF) <span className="text-[#E8B84B]">*</span>
        </label>
        <select
          id="uf-select"
          value={uf}
          onChange={(e) => handleUfSelect(e.target.value)}
          disabled={disabled}
          aria-label="Estado (UF)"
          aria-invalid={!!errorUf}
          className={cn(
            'w-full h-14 px-4 rounded-xl bg-[#0A192F] border text-slate-100 text-base font-normal appearance-none transition-all duration-200 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent',
            errorUf ? 'border-red-500' : 'border-white/15 hover:border-white/30'
          )}
        >
          <option value="" className="bg-[#0A192F] text-slate-400">
            Selecione a UF...
          </option>
          {ESTADOS_BRASIL.map((e) => (
            <option key={e.sigla} value={e.sigla} className="bg-[#0A192F] text-slate-100">
              {e.sigla} — {e.nome}
            </option>
          ))}
        </select>
        {errorUf && <p className="text-red-400 text-xs mt-1">{errorUf}</p>}
      </div>

      {/* Seletor de Município / Combobox */}
      <div className="sm:col-span-8 relative" ref={dropdownRef}>
        <label
          htmlFor="cidade-input"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          Município <span className="text-[#E8B84B]">*</span>
        </label>

        {fallbackMode ? (
          // Modo Fallback Offline (Input de Texto Livre)
          <div>
            <input
              id="cidade-input"
              type="text"
              value={cidade}
              onChange={(e) => onCidadeChange(e.target.value)}
              placeholder="Digite o nome da sua cidade"
              disabled={disabled || !uf}
              aria-label="Município"
              aria-invalid={!!errorCidade}
              className={cn(
                'w-full h-14 px-4 rounded-xl bg-[#0A192F] border text-slate-100 text-base transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent',
                errorCidade ? 'border-red-500' : 'border-white/15'
              )}
            />
            <p className="text-amber-400/80 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              Busca automática indisponível — digite normalmente.
            </p>
          </div>
        ) : (
          // Modo Padrão (Combobox Autocomplete)
          <div>
            <div className="relative">
              <input
                id="cidade-input"
                type="text"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value)
                  onCidadeChange(e.target.value)
                  setIsOpen(true)
                  setHighlightedIndex(-1)
                }}
                onFocus={() => {
                  if (uf) setIsOpen(true)
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  !uf
                    ? 'Selecione o estado primeiro'
                    : loading
                    ? 'Carregando municípios do IBGE...'
                    : 'Digite para buscar sua cidade...'
                }
                disabled={disabled || !uf || loading}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isOpen && uf ? true : false}
                aria-haspopup="listbox"
                aria-label="Município"
                aria-invalid={!!errorCidade}
                className={cn(
                  'w-full h-14 pl-11 pr-10 rounded-xl bg-[#0A192F] border text-slate-100 text-base transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent',
                  !uf ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
                  errorCidade ? 'border-red-500' : 'border-white/15 hover:border-white/30'
                )}
              />
              <MapPin
                className="absolute left-3.5 top-4.5 text-slate-400 pointer-events-none"
                size={18}
              />
              {loading && (
                <Loader2
                  className="absolute right-3.5 top-4.5 text-[#4ADE80] animate-spin"
                  size={18}
                />
              )}
              {!loading && uf && (
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Abrir lista de municípios"
                  className="absolute right-3.5 top-4.5 text-slate-400 hover:text-white"
                >
                  <ChevronsUpDown size={18} />
                </button>
              )}
            </div>

            {/* Dropdown de Resultados */}
            {isOpen && uf && cidadesFiltradas.length > 0 && (
              <ul
                ref={listRef}
                role="listbox"
                aria-label="Municípios sugeridos"
                className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl bg-[#0D1F3C] border border-white/20 shadow-2xl divide-y divide-white/5 py-1"
              >
                {cidadesFiltradas.map((c, index) => {
                  const isSelected = c.toLowerCase() === cidade.toLowerCase()
                  const isHighlighted = index === highlightedIndex
                  return (
                    <li
                      key={c}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleCidadeSelect(c)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={cn(
                        'px-4 py-3 text-sm text-slate-200 hover:bg-[#1B4F7A] hover:text-white cursor-pointer flex items-center justify-between transition-colors',
                        isHighlighted && 'bg-[#1B4F7A] text-white',
                        isSelected && 'bg-[#1B4F7A]/80 text-[#4ADE80] font-semibold'
                      )}
                    >
                      <span>{c}</span>
                      {isSelected && <Check size={16} className="text-[#4ADE80]" />}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
        {errorCidade && <p className="text-red-400 text-xs mt-1">{errorCidade}</p>}
      </div>
    </div>
  )
}
