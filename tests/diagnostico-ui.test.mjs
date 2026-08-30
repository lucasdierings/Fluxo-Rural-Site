import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateLeadScore } from '../lib/schema-diagnostico.ts'

test('Diagnostic Success WhatsApp Link Encoding', () => {
  const WHATSAPP_NUMERO = '5545991447004'
  const fakeData = {
    nome: 'Lucas Dierings',
    nome_propriedade: 'Fazenda Modelo',
    cidade: 'Londrina',
    estado: 'PR',
    atividade: 'graos',
    area_ha: '500-2000ha',
    gestao_atual: 'planilhas',
    desafio_principal: 'custos_margem',
    faturamento_anual: '5M-20M',
    urgencia: '30_dias',
  }

  const desafioLabel = 'Controle de Custos & Margem Real'
  const localizacaoFormatada = `${fakeData.cidade} / ${fakeData.estado}`
  const nomePropriedadeOuGenerico = `a fazenda ${fakeData.nome_propriedade}`
  const msgWhats = `Olá Lucas! Acabei de enviar o diagnóstico gratuito de gestão para ${nomePropriedadeOuGenerico} em ${localizacaoFormatada} (foco em ${desafioLabel}) e gostaria de agilizar minha sessão de 30 minutos.`
  const linkWhats = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msgWhats)}`

  assert.ok(linkWhats.startsWith('https://wa.me/5545991447004?text='))
  assert.ok(linkWhats.includes(encodeURIComponent('Fazenda Modelo')))
  assert.ok(linkWhats.includes(encodeURIComponent('Londrina / PR')))
  assert.ok(linkWhats.includes(encodeURIComponent('Controle de Custos & Margem Real')))
})

test('Diagnostic Score Result Thermal Badge Mapping', () => {
  const hotData = {
    faturamento_anual: '>20M',
    urgencia: '30_dias',
    desafio_principal: 'endividamento',
    area_ha: '>2000ha',
    gestao_atual: 'nenhuma',
  }
  const scoreResult = calculateLeadScore(hotData)
  assert.equal(scoreResult.qualificationLevel, 'verde')
  assert.ok(scoreResult.score >= 70)
})
