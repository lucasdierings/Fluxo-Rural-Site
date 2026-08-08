// Blocos de e-mail HTML compartilhados pelas Cloudflare Functions.
//
// Estes três helpers estavam COPIADOS em contato.js, diagnostico.js e
// calculadora.js, e as cópias já tinham divergido: a de diagnostico.js usa
// `if (!valor) return ''`, que descarta silenciosamente qualquer valor
// falsy-mas-real. Na prática `linha('Score', 0)` some do e-mail, e score 0 é
// alcançável. A versão daqui só descarta vazio e nulo de verdade.
//
// As funções antigas NÃO foram migradas de propósito: mexer nelas agora
// misturaria a captura nova com o comportamento de três formulários que já
// rodam em produção. Use este módulo nas Functions novas.

/** Escapa o mínimo necessário para interpolar texto de usuário em HTML. */
export function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Linha rótulo/valor. Some quando o valor é vazio ou nulo, e SÓ nesse caso. */
export function linha(label, valor) {
  if (valor === '' || valor == null) return ''
  return `<tr><td style="padding:6px 0;color:#666;width:180px;vertical-align:top;">${esc(label)}</td><td style="padding:6px 0;color:#1C1C1C;font-weight:600;">${esc(valor)}</td></tr>`
}

/** Bloco titulado. Some inteiro quando nenhuma linha sobreviveu. */
export function bloco(titulo, linhas) {
  const conteudo = linhas.join('')
  if (!conteudo) return ''
  return `<div style="margin-top:18px;"><p style="margin:0 0 6px;color:#1E4D7B;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.5px;">${esc(titulo)}</p><table style="width:100%;border-collapse:collapse;">${conteudo}</table></div>`
}

/** Moldura padrão do e-mail interno: cabeçalho colorido, corpo e rodapé. */
export function moldura(titulo, corpo, cor = '#7AB648') {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#F8F6F1;">
      <div style="background:${cor};padding:24px;text-align:center;">
        <h1 style="color:#FFFFFF;margin:0;font-size:20px;">${esc(titulo)}</h1>
      </div>
      <div style="padding:24px;background:#FFFFFF;">${corpo}</div>
      <div style="background:#1E4D7B;padding:14px;text-align:center;">
        <p style="color:#FFFFFF;margin:0;font-size:12px;">Fluxo Rural Consultoria</p>
      </div>
    </div>`
}
