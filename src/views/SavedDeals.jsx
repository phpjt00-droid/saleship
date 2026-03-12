'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Grid, List, Clock, Eye, ThumbsUp, MessageSquare, Bookmark, BookmarkMinus } from 'lucide-react'
import Image from 'next/image'
import SkeletonCard from '../components/SkeletonCard'
import HighlightText from '../components/HighlightText'
import { supabase } from '../lib/supabase'

function SavedDealsContent() {
  const [viewMode, setViewMode] = useState('grid')
  const [posts, setPosts] = useState([])
  const [bookmarks, setBookmarks] = useState(new Set())
  const [userLikes, setUserLikes] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  useEffect(() => {
    // 좋아요 정보 로드
    const savedLikes = localStorage.getItem('saleship_likes')
    if (savedLikes) {
      try {
        setUserLikes(new Set(JSON.parse(savedLikes)))
      } catch (e) {
        console.error('Failed to parse likes from localStorage', e)
      }
    }

    // 북마크 정보 로드
    const savedBookmarks = localStorage.getItem('saleship_bookmarks')
    let initialBookmarks = new Set()
    if (savedBookmarks) {
      try {
        initialBookmarks = new Set(JSON.parse(savedBookmarks))
        setBookmarks(initialBookmarks)
      } catch (e) {
        console.error('Failed to parse bookmarks from localStorage', e)
      }
    }
    
    fetchSavedDeals(initialBookmarks)
  }, [])

  const fetchSavedDeals = async (bookmarkSet) => {
    if (bookmarkSet.size === 0) {
      setPosts([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const bookmarkArray = Array.from(bookmarkSet)
      
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .in('id', bookmarkArray)
        .order('date', { ascending: false })

      if (postsError) throw postsError

      const { data: likesData, error: likesError } = await supabase
        .from('post_likes')
        .select('post_id')
        .in('post_id', bookmarkArray)

      if (likesError) throw likesError

      const likeCounts = likesData.reduce((acc, curr) => {
        acc[curr.post_id] = (acc[curr.post_id] || 0) + 1
        return acc
      }, {})

      const catMapping = {
        '패션': 'fashion',
        '푸드': 'food',
        '뷰티': 'beauty',
        '리빙': 'home',
        '가전': 'electronics',
        '게임': 'game',
        '상품권/이용권': 'ticket',
        '오프라인': 'offline'
      }

      const updatedPosts = postsData.map(post => ({
        ...post,
        catKey: catMapping[post.category] || '',
        likes: likeCounts[post.id.toString()] || post.likes || 0,
        views: parseInt(post.views || '0', 10),
        currentPrice: post.price_info?.currentPrice || '가격 확인',
        originalPrice: post.price_info?.originalPrice,
        discount: post.price_info?.discount,
        shipping: post.shipping || '무료배송',
        author: post.author || '세일쉽',
        avatar: '🐧'
      }))
      
      setPosts(updatedPosts)
    } catch (error) {
      console.error('Error fetching saved deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLikeToggle = (e, postId) => {
    e.preventDefault()
    e.stopPropagation()

    const postIdStr = postId.toString()
    const isLiking = !userLikes.has(postIdStr)

    setUserLikes(prev => {
      const newLikes = new Set(prev)
      if (isLiking) {
        newLikes.add(postIdStr)
      } else {
        newLikes.delete(postIdStr)
      }
      localStorage.setItem('saleship_likes', JSON.stringify(Array.from(newLikes)))
      return newLikes
    })

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id.toString() === postIdStr) {
        return {
          ...post,
          likes: isLiking ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1)
        }
      }
      return post
    }))
  }

  const handleBookmarkToggle = (e, postId) => {
    e.preventDefault()
    e.stopPropagation()

    const postIdStr = postId.toString()
    
    // 관심핫딜 뷰에서는 삭제만 일어날 가능성이 높지만 토글 로직 유지
    setBookmarks(prev => {
      const newBookmarks = new Set(prev)
      if (newBookmarks.has(postIdStr)) {
        newBookmarks.delete(postIdStr)
      } else {
        newBookmarks.add(postIdStr)
      }
      localStorage.setItem('saleship_bookmarks', JSON.stringify(Array.from(newBookmarks)))
      return newBookmarks
    })
  }

  // 검색 결과를 계산할 때 북마크에 여전히 존재하는 것만 필터링 (UX 개선)
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchSearch = !searchQuery || post.title.toLowerCase().includes(searchQuery.toLowerCase())
      const isStillBookmarked = bookmarks.has(post.id.toString())
      return matchSearch && isStillBookmarked
    }).sort((a, b) => b.timestamp - a.timestamp)
  }, [posts, searchQuery, bookmarks])

  return (
    <div className="board">
      <div className="container">
        {/* 헤더 */}
        <div className="board__header animate-fadeInUp">
          <h1 className="board__title">
            <Bookmark className="text-amber-400 fill-amber-400" size={32} />
            관심 핫딜 (Saved Deals)
            <span className="board__count">{filteredPosts.length}개의 핫딜 보관중</span>
          </h1>
        </div>

        <div className="board__filter-bar animate-fadeInUp delay-1 mb-8">
          <div className="board__tools w-full flex justify-between gap-4 items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100 dark:bg-slate-800/50 dark:border-slate-700">
            {/* 삭제된 인풋 필드 공간 보완 */}
            <div className="flex-1"></div>

            <div className="board__view-toggle bg-white dark:bg-slate-800 shadow-sm ml-4 border border-slate-200 dark:border-slate-700">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className={`board__posts ${viewMode === 'list' ? 'board__posts--list' : 'board__posts--grid'}`}>
          {loading ? (
   Array.from({ length: 8 }).map((_, idx) => (
     <SkeletonCard key={idx} isListForm={viewMode === 'list'} />
   ))
) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, i) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className={`animate-fadeInUp group relative block h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden cursor-pointer transition-all duration-300 ${viewMode === 'list' ? 'board__post-card--list' : 'hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:border-orange-500'}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {viewMode === 'grid' && (
                  <div className="relative w-full h-52 overflow-hidden bg-slate-50 dark:bg-slate-800/80 shrink-0">
                    <Image
  src={post.image}
  alt={post.title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover transition-transform duration-500 group-hover:scale-110"
  priority={i < 4}
  unoptimized
/>
                    {/* 할인율 뱃지 (좌상단) */}
                    {post.discount && (
                      <div className="absolute top-3 left-3 bg-rose-500/95 backdrop-blur-sm text-white text-[11px] font-black px-2.5 py-1 rounded-sm shadow-lg z-10">
                        {post.discount}
                      </div>
                    )}
                    {/* 북마크 버튼 (우상단) */}
                    <button 
                      className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all z-20 shadow-sm ${bookmarks.has(post.id.toString()) ? 'bg-amber-400 text-white hover:bg-amber-500' : 'bg-slate-900/30 text-white hover:bg-slate-900/60'}`}
                      onClick={(e) => handleBookmarkToggle(e, post.id)}
                      title="관심 핫딜에서 제거"
                    >
                      <Bookmark size={14} fill={bookmarks.has(post.id.toString()) ? "currentColor" : "none"} />
                    </button>
                  </div>
                )}
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md uppercase border border-slate-200 dark:border-slate-600 shadow-sm">{post.store}</span>
                       <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">📍 {post.shipping}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} />{post.date}</span>
                  </div>

                  <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100 line-clamp-2 mb-4 h-11 leading-snug group-hover:text-amber-500 transition-colors">
                    <HighlightText text={post.title} query={searchQuery} />
                  </h3>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">{post.currentPrice}</span>
                      {post.originalPrice && (
                        <span className="text-sm font-medium text-slate-400 line-through decoration-slate-300 dark:decoration-slate-500">{post.originalPrice}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <span className="text-sm">{post.avatar}</span>
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><Eye size={12} />{post.views.toLocaleString()}</span>
                        <button 
                          className={`flex items-center gap-1.5 transition-colors ${userLikes.has(post.id.toString()) ? 'text-blue-500 font-bold' : 'hover:text-blue-500'}`}
                          onClick={(e) => handleLikeToggle(e, post.id)}
                        >
                           <ThumbsUp size={12} fill={userLikes.has(post.id.toString()) ? "currentColor" : "none"} />{post.likes.toLocaleString()}
                        </button>
                        <span className="flex items-center gap-1.5"><MessageSquare size={12} />{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center animate-fadeIn bg-slate-50 rounded-3xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 mb-4">
                <BookmarkMinus size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">저장된 핫딜이 없습니다</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">마음에 드는 핫딜을 발견하면 북마크 아이콘을 눌러주세요. 보관함에 알뜰하게 저축해두고 나중에 모아볼 수 있습니다.</p>
              <Link href="/board" className="btn-primary">
                실시간 인기 핫딜 보러가기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SavedDeals() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>콜렉션 불러오는 중...</div>}>
      <SavedDealsContent />
    </Suspense>
  )
}
