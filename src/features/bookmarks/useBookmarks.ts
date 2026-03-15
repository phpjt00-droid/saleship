'use client'

import { useState, useEffect } from 'react'
import { Deal } from '@/types/deal'
import { toast } from 'sonner'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const toggleBookmark = (deal: Deal) => {
    setBookmarks(prev => {
      const isExist = prev.some(b => b.id === deal.id)
      let nextBookmarks

      if (isExist) {
        nextBookmarks = prev.filter(b => b.id !== deal.id)
        // 지속 시간 2.5초로 수정
        toast.info('북마크가 취소되었습니다.', { duration: 2500 })
      } else {
        nextBookmarks = [...prev, deal]
        // 지속 시간 2.5초로 수정
        toast.success('북마크에 저장되었습니다!', { duration: 2500 })
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