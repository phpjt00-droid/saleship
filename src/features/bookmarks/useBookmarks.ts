'use client'
import { useState, useEffect } from 'react'
import { Deal } from '@/types/deal'
import { toast } from 'sonner'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 로컬 스토리지에서 북마크 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('saleship_bookmarks')
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse bookmarks', e)
      }
    }
    setIsLoading(false)
  }, [])

  // 북마크 토글 기능
  const toggleBookmark = (deal: Deal) => {
    setBookmarks(prev => {
      const isExist = prev.some(b => b.id === deal.id)
      let nextBookmarks
      
      if (isExist) {
        nextBookmarks = prev.filter(b => b.id !== deal.id)
        toast.info('북마크가 취소되었습니다.')
      } else {
        nextBookmarks = [...prev, deal]
        toast.success('북마크에 저장되었습니다!')
      }
      
      localStorage.setItem('saleship_bookmarks', JSON.stringify(nextBookmarks))
      return nextBookmarks
    })
  }

  const isBookmarked = (id: string | number) => {
    return bookmarks.some(b => b.id === id)
  }

  return { bookmarks, isLoading, toggleBookmark, isBookmarked }
}
