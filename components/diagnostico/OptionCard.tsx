'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface OptionCardProps {
  active: boolean
  label: string
  description?: string
  index?: number
  shortcut?: string | number
  onClick: () => void
  disabled?: boolean
  className?: string
  role?: 'radio' | 'button'
  id?: string
  autoFocus?: boolean
}

export function OptionCard({
  active,
  label,
  description,
  index,
  shortcut,
  onClick,
  disabled = false,
  className,
  role = 'radio',
  id,
  autoFocus = false,
}: OptionCardProps) {
  const shortcutDisplay = shortcut !== undefined ? shortcut : index !== undefined ? index + 1 : null

  return (
    <button
      id={id}
      type="button"
      role={role}
      aria-checked={role === 'radio' ? active : undefined}
      aria-pressed={role === 'button' ? active : undefined}
      aria-disabled={disabled}
      disabled={disabled}
      autoFocus={autoFocus}
      onClick={onClick}
      className={cn(
        'group relative w-full text-left rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200 select-none cursor-pointer',
        'min-h-[58px] sm:min-h-[64px] flex items-center justify-between gap-3.5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A192F]',
        active
          ? 'border-[#4ADE80] bg-[#1B4F7A]/80 text-white shadow-[0_0_20px_rgba(74,222,128,0.18)] ring-2 ring-[#4ADE80]'
          : 'border-white/10 bg-[#0D1F3C]/80 text-slate-200 hover:border-white/30 hover:bg-[#112240] hover:text-white',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {shortcutDisplay !== null && (
          <span
            aria-hidden="true"
            className={cn(
              'hidden sm:inline-flex items-center justify-center h-7 px-2 min-w-[28px] rounded-lg text-xs font-mono font-bold transition-colors shrink-0',
              active
                ? 'bg-[#4ADE80] text-[#0A192F] shadow-sm'
                : 'bg-white/10 text-slate-300 border border-white/15 group-hover:border-white/30 group-hover:bg-white/15'
            )}
          >
            {shortcutDisplay}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <span className="block text-base sm:text-lg font-semibold leading-snug tracking-tight">
            {label}
          </span>
          {description && (
            <span
              className={cn(
                'mt-1 block text-xs sm:text-sm font-normal leading-relaxed transition-colors',
                active ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'
              )}
            >
              {description}
            </span>
          )}
        </div>
      </div>

      <div
        aria-hidden="true"
        className={cn(
          'w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200',
          active
            ? 'border-[#4ADE80] bg-[#4ADE80] text-[#0A192F]'
            : 'border-white/20 bg-white/5 group-hover:border-white/40'
        )}
      >
        {active && <Check size={14} strokeWidth={3} className="text-[#0A192F]" />}
      </div>
    </button>
  )
}
