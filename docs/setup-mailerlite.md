# Configuração do MailerLite

## 1. Criar conta
1. Acesse [mailerlite.com](https://www.mailerlite.com) e crie uma conta.
2. O plano gratuito permite até 1.000 subscribers e 12.000 e-mails/mês.

## 2. Verificar domínio
1. No painel, vá em **Settings** > **Domains** > **Sending domains**.
2. Adicione `fluxorural.com.br`.
3. Configure os registros DNS (SPF, DKIM, DMARC).

## 3. Gerar API Key
1. Vá em **Integrations** > **API**.
2. Clique em **Generate new token**.
3. Copie a chave gerada.

## 4. Configurar no projeto
1. Abra o arquivo `.env.local`.
2. Substitua `your_mailerlite_api_key_here` pela chave gerada.

```
MAILERLITE_API_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 5. Criar grupo (opcional)
1. Vá em **Subscribers** > **Groups**.
2. Crie um grupo "Newsletter Site" para segmentar os inscritos.
3. Atualize o código em `lib/mailerlite.ts` com o ID do grupo se desejar.

## Observações
- O MailerLite exige aprovação da conta antes de permitir envios. Preencha o perfil completo.
- Configure automações para enviar e-mails de boas-vindas e sequências de nutrição.
