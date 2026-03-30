import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')

interface ContactEmailProps {
  nome: string
  email: string
  telefone: string
  empresa?: string
  tipo: string
  mensagem: string
}

export function buildContactEmailHtml(data: ContactEmailProps): string {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #F8F6F1; padding: 0;">
      <div style="background: #1E4D7B; padding: 30px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0; font-size: 24px;">Novo Contato — Fluxo Rural</h1>
      </div>
      <div style="padding: 30px; background: #FFFFFF;">
        <div style="background: #7AB648; color: white; display: inline-block; padding: 4px 16px; border-radius: 20px; font-size: 14px; margin-bottom: 20px;">
          ${data.tipo}
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; width: 120px;">Nome</td><td style="padding: 8px 0; color: #1C1C1C; font-weight: 600;">${data.nome}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">E-mail</td><td style="padding: 8px 0; color: #1C1C1C;">${data.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Telefone</td><td style="padding: 8px 0; color: #1C1C1C;">${data.telefone}</td></tr>
          ${data.empresa ? `<tr><td style="padding: 8px 0; color: #666;">Empresa</td><td style="padding: 8px 0; color: #1C1C1C;">${data.empresa}</td></tr>` : ''}
        </table>
        <div style="margin-top: 20px; padding: 20px; background: #F8F6F1; border-radius: 8px;">
          <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Mensagem:</p>
          <p style="margin: 0; color: #1C1C1C; line-height: 1.6;">${data.mensagem}</p>
        </div>
      </div>
      <div style="background: #1E4D7B; padding: 20px; text-align: center;">
        <p style="color: #FFFFFF; margin: 0; font-size: 12px;">Fluxo Rural Consultoria | Londrina, PR — Brasil</p>
      </div>
    </div>
  `
}

export function buildWelcomeEmailHtml(nome?: string): string {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1E4D7B; padding: 30px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0; font-size: 24px;">Bem-vindo(a) à Newsletter Fluxo Rural!</h1>
      </div>
      <div style="padding: 30px; background: #FFFFFF;">
        <p style="color: #1C1C1C; font-size: 16px; line-height: 1.6;">
          ${nome ? `Olá, ${nome}!` : 'Olá!'}<br><br>
          Obrigado por se inscrever na newsletter da Fluxo Rural Consultoria.<br><br>
          Toda semana você receberá conteúdo sobre gestão financeira rural, inovação no agronegócio, sucessão familiar e estratégias práticas para o campo.<br><br>
          Um abraço,<br>
          <strong>Lucas Dierings</strong><br>
          Engenheiro Agrônomo | Consultor Estratégico
        </p>
      </div>
      <div style="background: #1E4D7B; padding: 20px; text-align: center;">
        <p style="color: #FFFFFF; margin: 0; font-size: 12px;">Fluxo Rural Consultoria | Londrina, PR — Brasil</p>
      </div>
    </div>
  `
}
