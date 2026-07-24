/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://fluxorural.com.br',
  // Escreve direto na pasta exportada (Cloudflare publica /out). Sem isso, o
  // next build copia public/ -> out/ ANTES do postbuild, deixando o sitemap 1 build atrasado.
  outDir: 'out',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
    ],
    additionalSitemaps: [],
  },
  exclude: ['/api/*', '/admin', '/dashboard', '/dashboard/', '/beweather', '/beweather/'],
  // Entrada manual do PDF (arquivo): sem trailing slash, que quebraria a URL do .pdf.
  additionalPaths: async () => [
    {
      loc: 'https://fluxorural.com.br/midia-kit-palestras-lucas-dierings.pdf',
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      trailingSlash: false,
    },
  ],
}
