export default function SkeletonCard({ isListForm = false }) {
  if (isListForm) {
    return (
      <div className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 flex gap-4 h-full w-full">
        {/* Thumbnail Skeleton */}
        <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0"></div>
        
        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    )
  }

  // Grid version
  return (
    <div className="animate-pulse flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden h-full">
      {/* Thumbnail Skeleton */}
      <div className="w-full h-52 bg-slate-200 dark:bg-slate-700 shrink-0"></div>
      
      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
        </div>
        
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5 mb-6"></div>
        
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700/50">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
