'use client'
import dynamic from 'next/dynamic'

const PostDetail = dynamic(() => import('@/components/views/PostDetail'), { ssr: false })

export default function PostDetailWrapper() {
  return <PostDetail />
}
