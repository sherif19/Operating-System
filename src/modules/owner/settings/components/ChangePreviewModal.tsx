import { Button } from '@/components/ui/button';
import { SettingItem } from '../types/settings.types';
import { Check, AlertTriangle, X } from 'lucide-react';

interface ChangePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changes: Record<string, any>;
  originalSettings: SettingItem[];
}

export function ChangePreviewModal({ isOpen, onClose, onConfirm, changes, originalSettings }: ChangePreviewModalProps) {
  if (!isOpen) return null;

  const modifiedItems = Object.keys(changes).map((key) => {
    const original = originalSettings.find((s) => s.id === key);
    return {
      id: key,
      title: original?.title || key,
      before: original ? String(original.value) : 'N/A',
      after: String(changes[key]),
      isSensitive: original?.isSensitive || false
    };
  });

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black text-white">مراجعة وتأكيد التغييرات قبل الحفظ</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 space-y-4 max-h-96 overflow-y-auto no-scrollbar">
          <p className="text-xs text-slate-400 leading-relaxed">
            الرجاء مراجعة القيم المعدلة وتأكيد التطبيق الفوري لقيم النظام. سيتم تسجيل هذه العمليات تلقائياً في سجل التدقيق والأمان.
          </p>

          <div className="space-y-3">
            {modifiedItems.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-2 text-xs">
                <span className="font-extrabold text-slate-100">{item.title}</span>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-1">القيمة السابقة (Before)</span>
                    <span className="font-mono text-rose-400 break-all">{item.before}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold mb-1">القيمة الجديدة (After)</span>
                    <span className="font-mono text-emerald-400 break-all">{item.after}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose} className="h-10">
            تراجع / إلغاء
          </Button>
          <Button onClick={onConfirm} className="gap-2 h-10">
            <Check className="w-4 h-4" />
            <span>تأكيد وحفظ التغييرات</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
