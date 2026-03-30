/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://fluxorural.com.br',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  exclude: ['/api/*'],
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/sobre': 0.9,
      '/servicos': 0.9,
      '/palestras': 0.8,
      '/blog': 0.8,
      '/contato': 0.7,
      '/newsletter': 0.6,
    }

    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : path.startsWith('/blog/') ? 'monthly' : 'weekly',
      priority: priorities[path] || 0.7,
      lastmod: new Date().toISOString(),
    }
  },
}
