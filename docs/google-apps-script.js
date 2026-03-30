/**
 * Fluxo Rural — Google Apps Script para receber leads do Diagnóstico
 *
 * INSTRUÇÕES DE DEPLOY:
 * 1. Crie uma Google Sheet chamada "Fluxo Rural - Leads Diagnóstico"
 * 2. Abra Extensions > Apps Script
 * 3. Cole este código no editor
 * 4. Ajuste o EMAIL_NOTIFICACAO abaixo
 * 5. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copie a URL gerada e atualize SCRIPT_URL no DiagnosticoForm.tsx
 *
 * COLUNAS DA PLANILHA (criadas automaticamente na primeira execução):
 * Timestamp | Nome | Email | WhatsApp | Estado | Atividade | Faturamento |
 * Hectares | Desafios | Gestão | Filhos | Situação Filhos | Conflito |
 * Dívidas | Investimento | Urgência | Consultor | Expectativa |
 * Origem | Score | Nível | UTM Source | UTM Medium | UTM Campaign
 */

// === CONFIGURAÇÃO ===
const EMAIL_NOTIFICACAO = 'lucasdierings12@gmail.com'
const NOME_PLANILHA = 'Leads' // Nome da aba (sheet tab)

// === HANDLERS ===

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Fluxo Rural API online' }))
    .setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = getOrCreateSheet()

    // Adiciona a linha na planilha
    const row = [
      new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
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
    ]

    sheet.appendRow(row)

    // Envia notificação por email
    enviarNotificacao(data)

    // Resposta
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'ok',
        message: 'Lead recebido com sucesso',
        score: data.score,
        level: data.qualificationLevel
      }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// === FUNÇÕES AUXILIARES ===

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(NOME_PLANILHA)

  if (!sheet) {
    sheet = ss.insertSheet(NOME_PLANILHA)
    // Cria cabeçalhos
    const headers = [
      'Timestamp', 'Nome', 'Email', 'WhatsApp', 'Estado',
      'Atividade', 'Faturamento', 'Hectares', 'Desafios',
      'Gestão', 'Filhos', 'Situação Filhos', 'Conflito',
      'Dívidas', 'Investimento', 'Urgência', 'Consultor',
      'Expectativa', 'Origem', 'Score', 'Nível',
      'UTM Source', 'UTM Medium', 'UTM Campaign'
    ]
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])

    // Formata cabeçalho
    const headerRange = sheet.getRange(1, 1, 1, headers.length)
    headerRange.setFontWeight('bold')
    headerRange.setBackground('#1B3A4B') // navy
    headerRange.setFontColor('#FFFFFF')
    sheet.setFrozenRows(1)

    // Ajusta largura das colunas
    sheet.setColumnWidth(1, 160) // Timestamp
    sheet.setColumnWidth(2, 200) // Nome
    sheet.setColumnWidth(3, 220) // Email
    sheet.setColumnWidth(4, 150) // WhatsApp
  }

  return sheet
}

function enviarNotificacao(data) {
  const score = data.score || 0
  const level = data.qualificationLevel || 'não calculado'
  const primeiroNome = (data.nome || 'Lead').split(' ')[0]

  // Emoji e cor baseado no nível
  const nivelInfo = {
    verde: { emoji: '🟢', label: 'QUENTE', prioridade: 'ALTA' },
    amarelo: { emoji: '🟡', label: 'MORNO', prioridade: 'MÉDIA' },
    laranja: { emoji: '🟠', label: 'FRIO', prioridade: 'BAIXA' },
    vermelho: { emoji: '🔴', label: 'MUITO FRIO', prioridade: 'BAIXA' },
  }

  const info = nivelInfo[level] || { emoji: '⚪', label: level, prioridade: '?' }

  const subject = `${info.emoji} Novo Lead Diagnóstico: ${primeiroNome} (${info.label} - Score ${score})`

  const body = `
Novo lead recebido via Diagnóstico Gratuito!

━━━━━━━━━━━━━━━━━━━━━━━━━━
${info.emoji} QUALIFICAÇÃO: ${info.label} (Score: ${score}/155)
Prioridade de contato: ${info.prioridade}
━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 DADOS DO LEAD
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

⏰ URGÊNCIA & EXPECTATIVA
Urgência: ${data.urgencia}
Já trabalhou com consultor: ${data.consultor}
Expectativa: ${data.expectativa}

📌 TRACKING
Origem: ${data.origem}
UTM: ${data.utm_source || '-'} / ${data.utm_medium || '-'} / ${data.utm_campaign || '-'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
Acesse a planilha completa de leads no Google Sheets.
  `.trim()

  MailApp.sendEmail({
    to: EMAIL_NOTIFICACAO,
    subject: subject,
    body: body,
  })
}

// === FUNÇÃO DE TESTE ===
// Rode esta função manualmente para testar
function testarScript() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        nome: 'TESTE Manual',
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
      })
    }
  }

  const result = doPost(mockEvent)
  Logger.log(result.getContent())
}
