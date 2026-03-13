'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { dealService } from '@/features/deals/dealService'
import { toast } from 'sonner'

interface VoteControlProps {
  postId: string | number;
  initialUpvotes?: number;
  initialDownvotes?: number;
}

export default function VoteControl({ postId, initialUpvotes = 0, initialDownvotes = 0 }: VoteControlProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [voted, setVoted] = useState<'up' | 'down' | null>(null)

  const handleVote = async (type: 'up' | 'down') => {
    if (voted) {
      toast.info('이미 투표하셨습니다.')
      return
    }

    try {
      // API 호출 로직은 실제 구현에 맞춰 확장 가능
      if (type === 'up') setUpvotes(prev => prev + 1)
      else setDownvotes(prev => prev + 1)
      
      setVoted(type)
      toast.success(type === 'up' ? '추천했습니다!' : '비추천했습니다.')
    } catch (error) {
      toast.error('투표 실패')
    }
  }

  return (
    <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
      <button 
        onClick={() => handleVote('up')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${voted === 'up' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white dark:hover:bg-slate-700 text-slate-500'}`}
      >
        <ThumbsUp size={18} /> <span className="font-black text-sm">{upvotes}</span>
      </button>
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
      <button 
        onClick={() => handleVote('down')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${voted === 'down' ? 'bg-rose-500 text-white shadow-lg' : 'hover:bg-white dark:hover:bg-slate-700 text-slate-500'}`}
      >
        <ThumbsDown size={18} /> <span className="font-black text-sm">{downvotes}</span>
      </button>
    </div>
  )
}
