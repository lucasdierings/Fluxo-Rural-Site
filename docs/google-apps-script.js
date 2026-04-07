/**
 * Fluxo Rural — Google Apps Script (v2) Multi-aba
 *
 * Detecta o tipo de lead pelo campo _tipo e grava na aba correta:
 *   - "diagnostico" → aba "Diagnóstico"
 *   - "contato"     → aba "Contato"
 *   - "newsletter"  → aba "Newsletter"
 *
 * INSTRUÇÕES DE DEPLOY:
 * 1. Abra a Google Sheet "Fluxo Rural - Leads Diagnóstico"
 * 2. Extensions > Apps Script
 * 3. SUBSTITUA todo o código pelo conteúdo deste arquivo
 * 4. Ajuste o EMAIL_NOTIFICACAO abaixo se necessário
 * 5. Deploy > Manage deployments > Editar (ou New deployment)
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. A URL do script NÃO muda se você editar o deployment existente
 *
 * IMPORTANTE: Se criar um NEW deployment, a URL muda e você precisa
 * atualizar SCRIPT_URL em ContactForm.tsx, DiagnosticoForm.tsx,
 * NewsletterForm.tsx e newsletter/page.tsx
 */

// === CONFIGURAÇÃO ===
const EMAIL_NOTIFICACAO = 'lucasdierings12@gmail.com'

// === HANDLERS ===

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Fluxo Rural API v2 online' }))
    .setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const tipo = data._tipo || detectarTipo(data)

    switch (tipo) {
      case 'diagnostico':
        return gravarDiagnostico(data)
      case 'contato':
        return gravarContato(data)
      case 'newsletter':
        return gravarNewsletter(data)
      default:
        return gravarContato(data) // fallback
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// Fallback para formulários antigos sem _tipo
function detectarTipo(data) {
  if (data.score !== undefined || data.qualificationLevel) return 'diagnostico'
  if (data.fonte === 'newsletter' || data.interesse === 'Newsletter') return 'newsletter'
  return 'contato'
}

// === DIAGNÓSTICO ===

function gravarDiagnostico(data) {
  const sheet = getOrCreateSheet('Diagnóstico', [
    'Timestamp', 'Nome', 'Email', 'WhatsApp', 'Estado',
    'Atividade', 'Faturamento', 'Hectares', 'Desafios',
    'Gestão', 'Filhos', 'Situação Filhos', 'Conflito',
    'Dívidas', 'Investimento', 'Urgência', 'Consultor',
    'Expectativa', 'Origem', 'Score', 'Nível',
    'UTM Source', 'UTM Medium', 'UTM Campaign',
  ])

  sheet.appendRow([
    timestamp(),
    data.nome || '',
    data.email || '',
    data.whatsapp || '',
    data.estado || '',
    data.atividade || '',
    data.faturamento || '',
    data.hectares || '',
    data.desafios || '',
    data.gestao || '',
    data.filhos || '',
    data.situacaoFilhos || '',
    data.conflito || '',
    data.dividas || '',
    data.investimento || '',
    data.urgencia || '',
    data.consultor || '',
    data.expectativa || '',
    data.origem || 'direto',
    data.score || 0,
    data.qualificationLevel || '',
    data.utm_source || '',
    data.utm_medium || '',
    data.utm_campaign || '',
  ])

  enviarNotificacaoDiagnostico(data)

  return resposta('ok', 'Diagnóstico recebido')
}

// === CONTATO ===

function gravarContato(data) {
  const sheet = getOrCreateSheet('Contato', [
    'Timestamp', 'Nome', 'Email', 'Telefone', 'Cidade', 'Estado', 'Interesse', 'Detalhes',
  ])

  sheet.appendRow([
    timestamp(),
    data.nome || '',
    data.email || '',
    data.telefone || '',
    data.cidade || '',
    data.estado || '',
    data.interesse || '',
    data.detalhes || '',
  ])

  enviarNotificacaoContato(data)

  return resposta('ok', 'Contato recebido')
}

// === NEWSLETTER ===

function gravarNewsletter(data) {
  const sheet = getOrCreateSheet('Newsletter', [
    'Timestamp', 'Nome', 'Email', 'Fonte',
  ])

  // Verificar duplicata de email
  const emails = sheet.getRange(1, 3, sheet.getLastRow(), 1).getValues().flat()
  if (emails.includes(data.email)) {
    return resposta('ok', 'Email já cadastrado')
  }

  sheet.appendRow([
    timestamp(),
    data.nome || '',
    data.email || '',
    data.fonte || 'site',
  ])

  return resposta('ok', 'Newsletter inscrito')
}

// === FUNÇÕES AUXILIARES ===

function timestamp() {
  return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
}

function resposta(status, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status, message }))
    .setMimeType(ContentService.MimeType.JSON)
}

function getOrCreateSheet(nome, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(nome)

  if (!sheet) {
    sheet = ss.insertSheet(nome)
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])

    const headerRange = sheet.getRange(1, 1, 1, headers.length)
    headerRange.setFontWeight('bold')
    headerRange.setBackground('#1E4D7B')
    headerRange.setFontColor('#FFFFFF')
    sheet.setFrozenRows(1)
  }

  return sheet
}

// === NOTIFICAÇÕES ===

function enviarNotificacaoDiagnostico(data) {
  const score = data.score || 0
  const level = data.qualificationLevel || 'não calculado'
  const primeiroNome = (data.nome || 'Lead').split(' ')[0]

  const nivelInfo = {
    verde:    { emoji: '🟢', label: 'QUENTE',     prioridade: 'ALTA' },
    amarelo:  { emoji: '🟡', label: 'MORNO',      prioridade: 'MÉDIA' },
    laranja:  { emoji: '🟠', label: 'FRIO',       prioridade: 'BAIXA' },
    vermelho: { emoji: '🔴', label: 'MUITO FRIO',  prioridade: 'BAIXA' },
  }

  const info = nivelInfo[level] || { emoji: '⚪', label: level, prioridade: '?' }

  MailApp.sendEmail({
    to: EMAIL_NOTIFICACAO,
    subject: `${info.emoji} Novo Diagnóstico: ${primeiroNome} (${info.label} - Score ${score})`,
    body: `
Novo lead via Diagnóstico Gratuito!

━━━━━━━━━━━━━━━━━━━━━━━━━━
${info.emoji} QUALIFICAÇÃO: ${info.label} (Score: ${score}/155)
Prioridade de contato: ${info.prioridade}
━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 DADOS
Nome: ${data.nome}
Email: ${data.email}
WhatsApp: ${data.whatsapp}
Estado: ${data.estado}

🌾 PROPRIEDADE
Atividade: ${data.atividade}
Faturamento: ${data.faturamento}
Hectares: ${data.hectares}

📊 GESTÃO
Desafios: ${data.desafios}
Gestão estruturada: ${data.gestao}
Dívidas: ${data.dividas}
Investimento tech/ano: ${data.investimento}

👨‍👩‍👧‍👦 SUCESSÃO
Filhos/herdeiros: ${data.filhos}
Situação: ${data.situacaoFilhos}
Conflito familiar: ${data.conflito}

⏰ URGÊNCIA
Urgência: ${data.urgencia}
Consultor anterior: ${data.consultor}
Expectativa: ${data.expectativa}

📌 TRACKING
Origem: ${data.origem}
UTM: ${data.utm_source || '-'} / ${data.utm_medium || '-'} / ${data.utm_campaign || '-'}
    `.trim(),
  })
}

function enviarNotificacaoContato(data) {
  const primeiroNome = (data.nome || 'Lead').split(' ')[0]

  MailApp.sendEmail({
    to: EMAIL_NOTIFICACAO,
    subject: `📩 Novo Contato: ${primeiroNome} — ${data.interesse || 'Geral'}`,
    body: `
Novo contato recebido pelo site!

Nome: ${data.nome}
Email: ${data.email}
Telefone: ${data.telefone}
Cidade/UF: ${data.cidade}/${data.estado}
Interesse: ${data.interesse}

Detalhes:
${data.detalhes || '(não informado)'}
    `.trim(),
  })
}

// === TESTES ===

function testarDiagnostico() {
  const result = doPost({
    postData: {
      contents: JSON.stringify({
        _tipo: 'diagnostico',
        nome: 'TESTE Diagnóstico',
        email: 'teste@fluxorural.com.br',
        whatsapp: '(43) 99999-0000',
        estado: 'PR',
        atividade: 'Grãos (soja, milho, trigo)',
        faturamento: '500k-1M',
        hectares: '200-500ha',
        desafios: 'Gestão financeira, Sucessão familiar',
        gestao: 'Parcialmente (planilhas)',
        filhos: 'Sim, 2+ filhos',
        situacaoFilhos: 'Querem entrar',
        conflito: 'Algumas discussões',
        dividas: 'Pequenas (<20%)',
        investimento: '10k-50k',
        urgencia: 'Próximos 3 meses',
        consultor: 'Nunca',
        expectativa: 'Ter um plano de ação',
        origem: 'teste-manual',
        score: 85,
        qualificationLevel: 'amarelo',
      }),
    },
  })
  Logger.log(result.getContent())
}

function testarContato() {
  const result = doPost({
    postData: {
      contents: JSON.stringify({
        _tipo: 'contato',
        nome: 'TESTE Contato',
        email: 'teste@fluxorural.com.br',
        telefone: '(43) 99999-0000',
        cidade: 'Londrina',
        estado: 'PR',
        interesse: 'Consultoria em Gestão Financeira',
        detalhes: 'Quero saber mais sobre o serviço.',
      }),
    },
  })
  Logger.log(result.getContent())
}

function testarNewsletter() {
  const result = doPost({
    postData: {
      contents: JSON.stringify({
        _tipo: 'newsletter',
        nome: 'TESTE Newsletter',
        email: 'teste-news@fluxorural.com.br',
        fonte: 'footer',
      }),
    },
  })
  Logger.log(result.getContent())
}
