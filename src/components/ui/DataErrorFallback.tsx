import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from './button';

interface DataErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export default function DataErrorFallback({ 
  message = "?°ì´?°ë? ë¶ˆëŸ¬?¤ëŠ” ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.", 
  onRetry 
}: DataErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 min-h-[200px]">
      <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={24} />
      </div>
      
      <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 text-center">
        {message}
      </p>

      {onRetry && (
        <Button 
          variant="outline"
          onClick={onRetry}
          className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <RefreshCcw size={16} />
          ?¬ì‹œ??        </Button>
      )}
    </div>
  );
}
