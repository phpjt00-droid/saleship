import { createClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import CommentSection from '@/components/CommentSection/CommentSection'

export async function generateStaticParams() {
  try {
    const supabase = await createClient()
    const { data: posts } = await supabase.from('posts').select('id')
    return posts?.map((post) => ({ slug: post.id.toString() })) || []
  } catch {
    return []
  }
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, content, image, category, store')
    .eq('id', slug)
    .single()

  if (!post) return { title: '게시글을 찾을 수 없습니다' }

  const title = post.title
  const description = post.content ? `${post.content.substring(0, 150)}...` : '세일쉽에서 핫딜 정보를 확인하세요.'
  const image = post.image || 'https://saleship-web.pages.dev/og-image.png'

  return {
    title: `${title} | 세일쉽`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      type: 'article',
      article: {
        section: post.category,
        tags: [post.store, post.category].filter(Boolean) as string[],
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function DealDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // 데이터 존재 여부 서버 사이드에서 선제 필터링
  const supabase = await createClient()
  const { data: post, error } = await supabase.from('posts').select('id').eq('id', slug).single()
  
  if (error || !post) {
    notFound()
  }

  return (
    <div className="container py-24">
      <CommentSection />
    </div>
  )
}
