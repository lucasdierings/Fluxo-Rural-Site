# 🌾 Fluxo Rural: Contexto do Projeto

## 👤 Sobre Lucas Dierings
- **Agrônomo, consultor rural, podcast host (NHCast + AgroJovem Podcast)**
- Especialista em: Gestão financeira, sucessão familiar, inovação em agronegócio
- Baseado em Londrina, Paraná
- Email: lucas@fluxorural.com.br
- WhatsApp: 5545991447004

---

## 🎯 Projeto Atual: Site Fluxo Rural
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, MDX
**Deployment:** Cloudflare Pages
**Email:** Resend + MailerLite (newsletter)
**Repo:** github.com/lucasdierings/Fluxo-Rural-Site (privado)

### 🎨 Brand Colors
- Primary Blue: `#1E4D7B`
- Leaf Green: `#7AB648`
- Gold Yellow: `#E8B84B`
- Dark Green: `#1B4332`

---

## 🚀 Projeto Em Andamento: Landing Diagnóstico Inteligente

### Status: ✅ EM PROGRESSO
- **Fase 1:** Criar `/diagnostico` com formulário 2-step ✅ CONCLUÍDO
- **Fase 2:** Implementar scoring automático ✅ CONCLUÍDO
- **Fase 3:** Corrigir acentos + adicionar ícones ✅ CONCLUÍDO
- **Fase 4:** Remover score visual, adicionar WhatsApp fallback ✅ CONCLUÍDO
- **Fase 5:** Aumentar tamanho logo + investigar badge "3 Issues" (AGORA)
- **Fase 6:** Google Apps Script integração (PENDENTE)
- **Fase 7:** Campanha Google Ads com R$ 880 (PRÓXIMA)

### 📋 Detalhes do Formulário
**Step 1:** Identificação (30 seg)
- Nome, Email, WhatsApp, Estado

**Step 2:** Pré-diagnóstico Estratégico (17 campos)
- Atividade, Faturamento, Hectares, Desafios, Gestão, Filhos, Situação, Conflito, Dívidas, Investimento, Urgência, Consultor anterior, Expectativa

### 🎯 Sistema de Scoring (Backend Only)
- Score: 0–150 pontos (calculado mas NÃO mostrado pro user)
- Qualificação: Verde/Amarelo/Laranja/Vermelho (enviado pro Google Sheets)
- User vê: Apenas "Diagnóstico recebido!" (sem score)

---

## ⚠️ Próximas Correções (AGORA)
1. **Logo na Navbar:** Aumentar tamanho (muito pequeno atualmente)
2. **Badge "3 Issues":** Remover ou investigar (aparece no canto inferior esquerdo)
3. **Testar em localhost:** Verificar se é só desenvolvimento ou também em produção

---

## 📝 Checklist Ativo
- [ ] Fase 5: Aumentar logo Navbar + remover badge "3 Issues"
- [ ] Testar `/diagnostico` em localhost
- [ ] Atualizar Google Apps Script (detectar origem + MailerLite)
- [ ] Testar integração Google Sheets + MailerLite
- [ ] Configurar sequência de email automática (MailerLite)
- [ ] Criar 3 variações de anúncio Google Ads
- [ ] Rodar teste A/B com R$ 50 (primeira semana)
- [ ] Deploy em Cloudflare Pages

---

**Última atualização:** 30 de março de 2025 - 11:00
**Status:** 🟢 Ativo - Fase 5 em progresso
