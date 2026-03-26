'use client'

// Formulário de contato via Typeform — compatível com Next.js static export
export function ContactForm() {
  return (
    <div className="w-full">
      <iframe
        src="https://form.typeform.com/to/h4Lfgaxx"
        style={{ width: '100%', height: '560px', border: 'none', borderRadius: '8px' }}
        title="Formulário de Contato — Fluxo Rural Consultoria"
        allow="camera; microphone; autoplay; encrypted-media;"
      />
    </div>
  )
}
