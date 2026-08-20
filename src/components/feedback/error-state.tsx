import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'حدث خطأ غير متوقع',
  message = 'تعذر تحميل البيانات المطلوب. يرجى المحاولة مرة أخرى.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-950/20 border border-rose-900/30 rounded-2xl">
      <div className="p-3 rounded-full bg-rose-500/10 text-rose-400 mb-3">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h4 className="text-sm font-bold text-rose-200 mb-1">{title}</h4>
      <p className="text-xs text-rose-300/80 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="border-rose-800/50 hover:bg-rose-900/30 text-rose-300">
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
