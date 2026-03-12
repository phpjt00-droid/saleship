'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { dealService } from '@/features/deals/dealService'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface VoteControlProps {
  postId: string;
}

export default function VoteControl({ postId }: VoteControlProps) {
  const [upVotes, setUpVotes] = useState(0)
  const [downVotes, setDownVotes] = useState(0)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const fetchVoteData = useCallback(async (userId?: string) => {
    try {
      const counts = await dealService.getVoteCounts(postId)
      setUpVotes(counts.up)
      setDownVotes(counts.down)

      if (userId) {
        const vote = await dealService.getUserVote(postId, userId)
        setUserVote(vote)
      }
    } catch (error) {
      console.error('Error fetching vote data:', error)
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      fetchVoteData(u?.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      fetchVoteData(u?.id)
    })

    return () => subscription.unsubscribe()
  }, [fetchVoteData])

  const handleVote = async (type: 'up' | 'down') => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.')
      return
    }

    const newVoteType = userVote === type ? null : type
    
    // 낙관적 업데이트
    const prevVote = userVote
    const prevUp = upVotes
    const prevDown = downVotes

    setUserVote(newVoteType)
    if (type === 'up') {
      if (prevVote === 'up') setUpVotes(v => v - 1)
      else {
        setUpVotes(v => v + 1)
        if (prevVote === 'down') setDownVotes(v => v - 1)
      }
    } else {
      if (prevVote === 'down') setDownVotes(v => v - 1)
      else {
        setDownVotes(v => v + 1)
        if (prevVote === 'up') setUpVotes(v => v - 1)
      }
    }

    try {
      await dealService.vote(postId, user.id, newVoteType)
    } catch (error) {
      console.error('Error voting:', error)
      // 실패 시 복구
      setUserVote(prevVote)
      setUpVotes(prevUp)
      setDownVotes(prevDown)
      alert('투표 처리 중 오류가 발생했습니다.')
    }
  }

  const score = upVotes - downVotes

  return (
    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all">
      <button
        onClick={() => handleVote('up')}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-bold text-sm ${
          userVote === 'up' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
            : 'text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700'
        }`}
      >
        <ThumbsUp size={16} fill={userVote === 'up' ? "currentColor" : "none"} />
        <span>{upVotes}</span>
      </button>

      <div className={`px-2 font-black text-xs min-w-[2rem] text-center ${
        score > 0 ? 'text-blue-600' : score < 0 ? 'text-rose-500' : 'text-slate-400'
      }`}>
        {score > 0 ? `+${score}` : score}
      </div>

      <button
        onClick={() => handleVote('down')}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-bold text-sm ${
          userVote === 'down' 
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-none' 
            : 'text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-700'
        }`}
      >
        <ThumbsDown size={16} fill={userVote === 'down' ? "currentColor" : "none"} />
        <span>{downVotes}</span>
      </button>
    </div>
  )
}
