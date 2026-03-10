export default function sitemap() {
  const baseUrl = 'https://saleship-web.pages.dev'
  
  // 기본 페이지들
  const routes = ['', '/board', '/about', '/privacy', '/terms', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }))

  return [...routes]
}
