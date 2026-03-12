'use client'
import { useState, useEffect, useCallback } from 'react'
import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr'
import { dealService } from './dealService'
import { Deal } from '@/types/deal'
import { supabase } from '@/lib/supabaseClient'

export function useDeals() {
  const [userLikes, setUserLikes] = useState(new Set<string>())
  const [bookmarks, setBookmarks] = useState(new Set<string>())
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))

    const savedLikes = localStorage.getItem('saleship_likes')
    if (savedLikes) setUserLikes(new Set(JSON.parse(savedLikes)))
    const savedBookmarks = localStorage.getItem('saleship_bookmarks')
    if (savedBookmarks) setBookmarks(new Set(JSON.parse(savedBookmarks)))

    return () => subscription.unsubscribe()
  }, [])

  // 무한 스크롤 / 더보기를 위한 SWR Infinite
  const PAGE_SIZE = 20
  const getKey = (pageIndex: number, previousPageData: Deal[]) => {
    if (previousPageData && !previousPageData.length) return null // 끝에 도달
    return `/api/deals?page=${pageIndex + 1}&limit=${PAGE_SIZE}` // 실제 API가 아니더라도 swr 키로 유효
  }

  const fetcher = async (url: string) => {
    const urlObj = new URL(url, 'http://localhost') // dummy origin for parsing
    const page = parseInt(urlObj.searchParams.get('page') || '1')
    const limit = parseInt(urlObj.searchParams.get('limit') || '20')
    return await dealService.getDeals(page, limit)
  }

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false // 포커스시 백그라운드 재페칭 방지로 성능 최적화
  })

  // 인기 핫딜 별도 SWR 캐싱
  const { data: popularDealsData } = useSWR('/api/popular-deals', () => dealService.getPopularDeals(), {
    revalidateOnFocus: false,
    dedupingInterval: 60000 // 1분 동안 캐시 유지
  })

  const posts = data ? ([] as Deal[]).concat(...data) : []
  const popularDeals = popularDealsData || []
  
  const isLoadingInitialData = !data && !error
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const loading = isValidating || isLoadingInitialData

  const handleLikeToggle = useCallback((e: any, postId: number) => {
    e.preventDefault(); e.stopPropagation()
    const idStr = postId.toString()
    
    setUserLikes(prev => {
      const next = new Set(prev)
      if (next.has(idStr)) next.delete(idStr)
      else next.add(idStr)
      localStorage.setItem('saleship_likes', JSON.stringify(Array.from(next)))
      
      // 낙관적 업데이트 로직 생략 (SWR이 담당하거나 기존 mutate 방식 활용)
      return next
    })
  }, [])

  const handleBookmarkToggle = useCallback((e: any, postId: number) => {
    e.preventDefault(); e.stopPropagation()
    const idStr = postId.toString()
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(idStr)) next.delete(idStr)
      else next.add(idStr)
      localStorage.setItem('saleship_bookmarks', JSON.stringify(Array.from(next)))
      return next
    })
  }, [])

  return {
    posts,
    popularDeals,
    loading,
    isLoadingMore,
    isReachingEnd,
    loadMore: () => setSize(size + 1),
    userLikes,
    bookmarks,
    user,
    handleLikeToggle,
    handleBookmarkToggle,
    refreshDeals: mutate
  }
}
