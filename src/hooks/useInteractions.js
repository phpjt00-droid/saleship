import { useState, useEffect } from 'react';

export function useInteractions(postId) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const idStr = postId?.toString();

  // 초기 상태 로드
  useEffect(() => {
    if (!idStr) return;

    const savedLikes = localStorage.getItem('saleship_likes');
    const savedBookmarks = localStorage.getItem('saleship_bookmarks');

    if (savedLikes) {
      const likesSet = new Set(JSON.parse(savedLikes));
      setIsLiked(likesSet.has(idStr));
    }

    if (savedBookmarks) {
      const bookmarksSet = new Set(JSON.parse(savedBookmarks));
      setIsBookmarked(bookmarksSet.has(idStr));
    }
  }, [idStr]);

  const toggleLike = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsLiked(prev => {
      const next = !prev;
      const savedLikes = localStorage.getItem('saleship_likes');
      const likesSet = new Set(savedLikes ? JSON.parse(savedLikes) : []);
      
      if (next) likesSet.add(idStr);
      else likesSet.delete(idStr);
      
      localStorage.setItem('saleship_likes', JSON.stringify([...likesSet]));
      return next;
    });
  };

  const toggleBookmark = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setIsBookmarked(prev => {
      const next = !prev;
      const savedBookmarks = localStorage.getItem('saleship_bookmarks');
      const bookmarksSet = new Set(savedBookmarks ? JSON.parse(savedBookmarks) : []);

      if (next) bookmarksSet.add(idStr);
      else bookmarksSet.delete(idStr);

      localStorage.setItem('saleship_bookmarks', JSON.stringify([...bookmarksSet]));
      return next;
    });
  };

  return {
    isLiked,
    isBookmarked,
    likesCount,
    setLikesCount,
    toggleLike,
    toggleBookmark
  };
}
