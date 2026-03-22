import { NextResponse } from 'next/server'
import { newsletterSchema } from '@/lib/schema'
import { addSubscriber } from '@/lib/mailerlite'
import { resend, buildWelcomeEmailHtml } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = newsletterSchema.parse(body)

    // Adicionar ao MailerLite
    await addSubscriber({
      email: data.email,
      nome: data.nome,
    })

    // Enviar e-mail de boas-vindas
    await resend.emails.send({
      from: 'Fluxo Rural <contato@fluxorural.com.br>',
      to: data.email,
      subject: 'Bem-vindo(a) à Newsletter Fluxo Rural!',
      html: buildWelcomeEmailHtml(data.nome),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao inscrever na newsletter:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'E-mail inválido.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao inscrever. Tente novamente.' },
      { status: 500 }
    )
  }
}
