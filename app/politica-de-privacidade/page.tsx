import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade da Fluxo Rural Consultoria — como tratamos seus dados pessoais em conformidade com a LGPD.',
}

export default function PoliticaPage() {
  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="font-heading text-4xl font-bold text-navy mb-8">Política de Privacidade</h1>
        <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-navy">
          <p><em>Última atualização: março de 2026</em></p>

          <h2>1. Responsável pelo Tratamento</h2>
          <p>
            Fluxo Rural Consultoria, CNPJ a definir, com sede em Curitiba, Paraná — Brasil, representada por Lucas Dierings, é responsável pelo tratamento dos dados pessoais coletados neste site.
          </p>

          <h2>2. Dados Coletados</h2>
          <p>Coletamos os seguintes dados pessoais:</p>
          <ul>
            <li><strong>Formulário de contato:</strong> nome, e-mail, telefone/WhatsApp, empresa/propriedade, tipo de interesse e mensagem.</li>
            <li><strong>Newsletter:</strong> nome e e-mail.</li>
            <li><strong>Navegação:</strong> dados de acesso via Google Analytics (anonimizados).</li>
          </ul>

          <h2>3. Finalidade do Tratamento</h2>
          <ul>
            <li>Responder a solicitações de contato.</li>
            <li>Enviar conteúdo da newsletter (mediante consentimento).</li>
            <li>Melhorar a experiência de navegação do site.</li>
          </ul>

          <h2>4. Base Legal</h2>
          <p>O tratamento de dados é realizado com base no consentimento do titular (Art. 7°, I da LGPD) e no legítimo interesse (Art. 7°, IX).</p>

          <h2>5. Compartilhamento</h2>
          <p>Seus dados podem ser compartilhados com:</p>
          <ul>
            <li><strong>Resend:</strong> para envio de e-mails transacionais.</li>
            <li><strong>MailerLite:</strong> para gestão da newsletter.</li>
            <li><strong>Google Analytics:</strong> para análise de tráfego (dados anonimizados).</li>
          </ul>

          <h2>6. Seus Direitos</h2>
          <p>Você tem direito a acessar, corrigir, excluir ou solicitar a portabilidade dos seus dados. Entre em contato pelo e-mail lucas@fluxorural.com.br.</p>

          <h2>7. Segurança</h2>
          <p>Adotamos medidas técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado, perda ou destruição.</p>

          <h2>8. Contato</h2>
          <p>Para dúvidas sobre esta política, entre em contato:<br />
            E-mail: contato@fluxorural.com.br<br />
            Localização: Curitiba, PR — Brasil</p>
        </div>
      </div>
    </section>
  )
}
