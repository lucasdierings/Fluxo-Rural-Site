# Configuração do Resend

## 1. Criar conta
1. Acesse [resend.com](https://resend.com) e crie uma conta gratuita.
2. O plano gratuito permite 100 e-mails/dia.

## 2. Verificar domínio
1. No painel, vá em **Domains** > **Add Domain**.
2. Adicione `fluxorural.com.br`.
3. Configure os registros DNS conforme instruído (MX, SPF, DKIM).
4. Aguarde a verificação (pode levar até 24h).

## 3. Gerar API Key
1. Vá em **API Keys** > **Create API Key**.
2. Dê um nome (ex: "Fluxo Rural Site").
3. Copie a chave gerada.

## 4. Configurar no projeto
1. Abra o arquivo `.env.local`.
2. Substitua `your_resend_api_key_here` pela chave gerada.

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
```

## 5. Configurar remetente
Após verificar o domínio, o remetente `contato@fluxorural.com.br` estará disponível automaticamente.

## Observações
- Até verificar o domínio, use `onboarding@resend.dev` como remetente para testes.
- O Resend oferece logs de entrega no painel para monitorar os envios.
