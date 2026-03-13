const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />
);

export default function SkeletonCard({ isListForm = false }) {
  if (isListForm) {
    return (
      <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-0 flex h-44 w-full shadow-sm">
        <Shimmer />
        {/* Thumbnail Skeleton */}
        <div className="w-52 h-full bg-slate-50 dark:bg-slate-900 shrink-0"></div>
        
        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col justify-between p-5 md:p-6 min-w-0">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg w-16"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-20"></div>
            </div>
            <div className="h-5 bg-slate-100 dark:bg-slate-700/50 rounded-full w-full mb-2"></div>
            <div className="h-5 bg-slate-100 dark:bg-slate-700/50 rounded-full w-2/3"></div>
          </div>
          
          <div className="mt-auto">
            <div className="h-7 bg-slate-100 dark:bg-slate-700/50 rounded-full w-24 mb-5"></div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-700/30">
              <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full w-32"></div>
              <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700/50 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid version
  return (
    <div className="relative overflow-hidden flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 h-full shadow-sm">
      <Shimmer />
      {/* Thumbnail Skeleton */}
      <div className="w-full h-56 bg-slate-50 dark:bg-slate-900 shrink-0"></div>
      
      {/* Content Skeleton */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg w-16"></div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-16"></div>
        </div>
        
        <div className="h-5 bg-slate-100 dark:bg-slate-700/50 rounded-full w-full mb-2"></div>
        <div className="h-5 bg-slate-100 dark:bg-slate-700/50 rounded-full w-4/5 mb-4"></div>
        
        <div className="mt-auto">
          <div className="h-7 bg-slate-100 dark:bg-slate-700/50 rounded-full w-28 mb-5"></div>
          
          <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-700/30">
            <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full w-32"></div>
            <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700/50 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
