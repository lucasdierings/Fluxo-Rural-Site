const HIGH_PRIORITY = ['/', '/palestras', '/diagnostico']
const MEDIUM_PRIORITY = ['/sobre', '/servicos', '/blog', '/contato']

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://fluxorural.com.br',
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
  exclude: ['/api/*', '/admin', '/beweather', '/beweather/'],
  transform: async (config, path) => {
    const cleanPath = path.replace(/\/$/, '') || '/'
    let priority = 0.7
    let changefreq = 'monthly'
    if (HIGH_PRIORITY.includes(cleanPath)) {
      priority = 0.9
      changefreq = 'weekly'
    } else if (MEDIUM_PRIORITY.includes(cleanPath)) {
      priority = 0.8
    }
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
}
