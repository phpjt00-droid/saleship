import { createClient } from '@/lib/supabaseServer'

export const dynamic = 'force-static'

export default async function sitemap() {
  const supabase = await createClient()
  const baseUrl = 'https://saleship-web.pages.dev'
  
  // 기본 페이지들
  const routes = ['', '/board', '/saved', '/about', '/privacy', '/terms', '/contact', '/faq', '/free', '/guide', '/review'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    // Supabase에서 포스트 목록 조회 (최신 1000개 제한)
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, date')
      .order('date', { ascending: false })
      .limit(1000)

    if (!error && posts) {
      const dynamicRoutes = posts.map(post => ({
        url: `${baseUrl}/deal/${post.id}`,
        lastModified: post.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly',
        priority: 0.7,
      }))
      
      return [...routes, ...dynamicRoutes]
    }
  } catch (err) {
    console.error('Error generating sitemap dynamic routes:', err)
  }

  return [...routes]
}
