'use client'
import { useState, useEffect, useCallback } from 'react'
import { dealService } from './dealService'
import { Deal } from '@/types/deal'
import { supabase } from '@/lib/supabaseClient'

export function useDeals() {
  const [posts, setPosts] = useState<Deal[]>([])
  const [popularDeals, setPopularDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [userLikes, setUserLikes] = useState(new Set<string>())
  const [bookmarks, setBookmarks] = useState(new Set<string>())
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const savedLikes = localStorage.getItem('saleship_likes')
    if (savedLikes) setUserLikes(new Set(JSON.parse(savedLikes)))
    const savedBookmarks = localStorage.getItem('saleship_bookmarks')
    if (savedBookmarks) setBookmarks(new Set(JSON.parse(savedBookmarks)))

    return () => subscription.unsubscribe()
  }, [])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [allDeals, popular] = await Promise.all([
        dealService.getDeals(),
        dealService.getPopularDeals()
      ])
      setPosts(allDeals)
      setPopularDeals(popular)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData, user])

  const handleLikeToggle = useCallback((e: any, postId: number) => {
    e.preventDefault(); e.stopPropagation()
    const idStr = postId.toString()
    
    setUserLikes(prev => {
      const next = new Set(prev)
      const isLiked = next.has(idStr)
      
      if (isLiked) {
        next.delete(idStr)
      } else {
        next.add(idStr)
      }
      localStorage.setItem('saleship_likes', JSON.stringify(Array.from(next)))
      
      const updateLikes = (deal: Deal) => 
        deal.id === postId ? { ...deal, likes: isLiked ? deal.likes - 1 : deal.likes + 1 } : deal
        
      setPosts(prevPosts => prevPosts.map(updateLikes))
      setPopularDeals(prevPopular => prevPopular.map(updateLikes))
      
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
    userLikes,
    bookmarks,
    user,
    handleLikeToggle,
    handleBookmarkToggle,
    refreshDeals: fetchData
  }
}
