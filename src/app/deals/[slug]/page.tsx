import { Suspense } from 'react'
import CommentSection from '@/components/CommentSection/CommentSection'
import { supabase } from '@/lib/supabase'

// 정적 내보내기를 위해 개별 게시글 페이지들의 ID 목록을 생성
export async function generateStaticParams() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id')
    
    if (error) {
      console.error('Error fetching post IDs for static params:', error)
      return []
    }

    return posts?.map((post) => ({
      slug: post.id.toString(),
    })) || []
  } catch (err) {
    console.error('Exception in generateStaticParams:', err)
    return []
  }
}

export const dynamicParams = false

// SEO를 위한 동적 메타 데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Supabase에서 실제 포스트 정보 조회
  const { data: post, error } = await supabase
    .from('posts')
    .select('title, content')
    .eq('id', slug)
    .single()

  const title = post?.title || '핫딜 정보'
  const description = post?.content ? `${post.content.substring(0, 100)}...` : `${title}의 상세 할인 정보와 가격 변동 인사이트를 확인해 보세요.`

  return {
    title: `${title} | 세일쉽 핫딜`,
    description: description,
    openGraph: {
      title: `${title} | 세일쉽 핫딜`,
      description: description,
      type: 'article',
    }
  }
}

export default function DealDetailPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center' }}>게시글을 불러오는 중...</div>}>
      <CommentSection />
    </Suspense>
  )
}
