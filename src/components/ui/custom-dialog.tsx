import { useDialogStore } from '@/stores/dialog.store';
import { motion, AnimatePresence } from 'motion/react';
import { Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from './button';

export function CustomDialog() {
  const { dialog, closeDialog } = useDialogStore();

  const handleConfirm = () => {
    if (dialog.onConfirm) {
      dialog.onConfirm();
    }
    closeDialog();
  };

  const handleCancel = () => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    closeDialog();
  };

  // Determine icon based on message title or content
  const getIcon = () => {
    const text = (dialog.title + ' ' + dialog.message).toLowerCase();
    if (text.includes('حذف') || text.includes('إزالة') || text.includes('delete') || text.includes('تنبيه') || text.includes('danger') || text.includes('حرج')) {
      return <AlertTriangle className="w-8 h-8 text-rose-500 animate-bounce" />;
    }
    if (text.includes('نجاح') || text.includes('تم ') || text.includes('success')) {
      return <CheckCircle2 className="w-8 h-8 text-emerald-400" />;
    }
    return <Info className="w-8 h-8 text-indigo-400" />;
  };

  return (
    <AnimatePresence>
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-right text-xs space-y-5 overflow-hidden"
          >
            {/* Tech background highlight */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent blur-xl pointer-events-none" />

            {/* Header Content */}
            <div className="flex flex-col items-center text-center gap-3 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
                {getIcon()}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white">{dialog.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">{dialog.message}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 relative z-10">
              {dialog.type === 'confirm' ? (
                <>
                  <Button
                    onClick={handleConfirm}
                    className="flex-1 h-9 bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-lg shadow-rose-600/15"
                  >
                    {dialog.confirmLabel || 'تأكيد'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 h-9 border-slate-800 hover:bg-slate-800/40 text-slate-400 hover:text-white"
                  >
                    {dialog.cancelLabel || 'إلغاء'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleConfirm}
                  className="w-full h-9 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-lg shadow-indigo-600/15"
                >
                  {dialog.confirmLabel || 'حسناً'}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
export default CustomDialog;
