import { Button } from '@/components/ui/button';
import { X, ExternalLink, User } from 'lucide-react';

interface PeekCustomer {
  id: string;
  name: string;
  stage: string;
  progress: number;
  health: '🟢' | '🟡' | '🔴';
  employee: string;
  lastMessage?: string;
}

interface PeekPanelProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: PeekCustomer | null;
  onOpenFullWorkspace?: (id: string) => void;
}

export function PeekPanel({ isOpen, onClose, customer, onOpenFullWorkspace }: PeekPanelProps) {
  if (!isOpen || !customer) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-Over Panel */}
      <div className="fixed top-0 left-0 bottom-0 z-51 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col transition-transform duration-200 ease-out dir-rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
              {customer.name[0]}
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{customer.name}</span>
                <span className="text-sm">{customer.health}</span>
              </h3>
              <span className="text-xs text-slate-400">{customer.stage}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Progress Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold">التقدم الكلي في الرحلة</span>
              <span className="font-mono font-bold text-indigo-400">{customer.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${customer.progress}%` }}
              />
            </div>
          </div>

          {/* Assigned Staff */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              المسؤول عن المتابعة
            </span>
            <div className="text-sm font-extrabold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>{customer.employee}</span>
            </div>
          </div>

          {/* Recent Chat Message */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              آخر محادثة في مساحة العمل
            </span>
            <p className="text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800/80">
              {customer.lastMessage || 'لا توجد محادثات سابقة'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              if (onOpenFullWorkspace) onOpenFullWorkspace(customer.id);
            }}
            className="w-full justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>فتح مساحة العمل الكاملة (Workspace)</span>
          </Button>
        </div>
      </div>
    </>
  );
}
