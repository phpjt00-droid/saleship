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
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const currentCat = searchParams.get('cat') || ''
  const currentSort = searchParams.get('sort') || 'latest'

  const PAGE_SIZE = 20
  const getKey = (pageIndex: number, previousPageData: Deal[]) => {
    if (previousPageData && !previousPageData.length) return null // 끝에 도달
    // 카테고리 및 정렬 정보를 키에 포함
    return `/api/deals?page=${pageIndex + 1}&limit=${PAGE_SIZE}&cat=${currentCat}&sort=${currentSort}`
  }

  const fetcher = async (url: string) => {
    const urlObj = new URL(url, 'http://localhost')
    const page = parseInt(urlObj.searchParams.get('page') || '1')
    const limit = parseInt(urlObj.searchParams.get('limit') || '20')
    const category = urlObj.searchParams.get('cat') || undefined
    const sort = urlObj.searchParams.get('sort') || 'latest'
    return await dealService.getDeals(page, limit, category, sort)
  }

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false
  })

  // 트렌딩 핫딜 (Trending)
  const { data: trendingDeals } = useSWR('/api/trending-deals', () => dealService.getTrendingDeals(5), {
    revalidateOnFocus: false,
    dedupingInterval: 60000
  })

  // 누적 인기 핫딜 (Popular)
  const { data: popularDeals } = useSWR('/api/popular-deals', () => dealService.getPopularDeals(4), {
    revalidateOnFocus: false,
    dedupingInterval: 60000
  })

  // 최신 핫딜 (Latest) - 무한 스크롤 연동
  const posts = data ? ([] as Deal[]).concat(...data) : []
  
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
    trendingDeals: trendingDeals || [],
    popularDeals: popularDeals || [],
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
