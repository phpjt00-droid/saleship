'use client'
import React from 'react'
import { ThumbsUp, Bookmark } from 'lucide-react'

export default function DealActions({ 
  postId, 
  upvotes, 
  isLiked, 
  isBookmarked, 
  onLikeToggle, 
  onBookmarkToggle,
  variant = 'default' 
}) {
  const baseButtonClass = "flex items-center gap-1.5 transition-all text-xs font-bold"
  const iconSize = variant === 'large' ? 16 : 14

  return (
    <div className={`flex items-center ${variant === 'large' ? 'gap-6' : 'gap-3'}`}>
      <button 
        className={`${baseButtonClass} ${isLiked ? 'text-blue-500' : 'text-slate-500 hover:text-blue-500'}`}
        onClick={(e) => onLikeToggle(e, postId)}
      >
        <ThumbsUp size={iconSize} fill={isLiked ? "currentColor" : "none"} />
        <span>{upvotes.toLocaleString()}</span>
      </button>

      <button 
        className={`${baseButtonClass} ${isBookmarked ? 'text-amber-500' : 'text-slate-500 hover:text-amber-500'}`}
        onClick={(e) => onBookmarkToggle(e, postId)}
      >
        <Bookmark size={iconSize} fill={isBookmarked ? "currentColor" : "none"} />
      </button>
    </div>
  )
}
