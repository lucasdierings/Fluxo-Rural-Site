import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/schema'
import { resend, buildContactEmailHtml } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    await resend.emails.send({
      from: 'Fluxo Rural <contato@fluxorural.com.br>',
      to: 'lucas@fluxorural.com.br',
      replyTo: data.email,
      subject: `Novo contato — ${data.tipo}: ${data.nome}`,
      html: buildContactEmailHtml({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        empresa: data.empresa,
        tipo: data.tipo,
        mensagem: data.mensagem,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar contato:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos. Verifique os campos e tente novamente.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao enviar mensagem. Tente pelo WhatsApp.' },
      { status: 500 }
    )
  }
}
