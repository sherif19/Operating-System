import { usePwaStore } from '@/stores/pwa.store';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, DownloadCloud, Share2, Smartphone, Zap, BellRing } from 'lucide-react';
import { Button } from './button';
import React from 'react';

export function PwaInstallModal() {
  const { isModalOpen, setModalOpen, triggerInstall } = usePwaStore();

  // Detect iOS
  const [isIOSDevice, setIsIOSDevice] = React.useState(false);

  React.useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOSDevice(isIOS);
  }, []);

  const handleInstallClick = () => {
    triggerInstall();
    setModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-right text-xs overflow-hidden"
          >
            {/* Ambient Purple glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 to-transparent blur-2xl pointer-events-none rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-cyan-500/10 to-transparent blur-2xl pointer-events-none rounded-full" />

            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800/60 text-slate-400 hover:text-white transition-all cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Brand logo */}
            <div className="flex flex-col items-center text-center gap-4.5 mt-2 mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-indigo-500/20 blur-lg animate-pulse" />
                <div className="w-20 h-20 rounded-3xl bg-slate-950 border-2 border-indigo-500/50 flex items-center justify-center shadow-lg relative z-10 overflow-hidden">
                  <img src="/icon-192.png" alt="Company OS Logo" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-indigo-400 font-extrabold text-[10px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تطبيق الويب التقدمي — PWA Application</span>
                </div>
                <h3 className="text-base font-black text-white">تثبيت تطبيق Company OS</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  احصل على أفضل تجربة أداء للنظام التشغيلي وإدارة عمليات الشركة على جهازك مباشرة.
                </p>
              </div>
            </div>

            {/* Benefits section */}
            <div className="space-y-3 bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4.5 mb-6 text-[11px] text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white mb-0.5">سرعة فائقة واستجابة فورية</h4>
                  <p className="text-[10px] text-slate-500">يعمل التطبيق بشكل مستقل تماماً بدون واجهة المتصفح التقليدية.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5 text-indigo-400">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white mb-0.5">أيقونة مباشرة على سطح المكتب</h4>
                  <p className="text-[10px] text-slate-500">إمكانية فتح النظام فوراً بضغطة زر واحدة من الشاشة الرئيسية لهاتفك أو حاسوبك.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                  <BellRing className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white mb-0.5">إشعارات فورية وتزامن خلفي</h4>
                  <p className="text-[10px] text-slate-500">استلام تنبيهات المهام، الـ SLAs، والعمليات الطارئة مباشرة على جهازك.</p>
                </div>
              </div>
            </div>

            {/* Action Area */}
            {isIOSDevice ? (
              /* iOS Safari Manual Flow */
              <div className="space-y-4 pt-2">
                <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl text-[10px] text-slate-400 space-y-2 text-right">
                  <div className="flex items-center gap-2 text-white font-extrabold text-xs mb-1">
                    <Share2 className="w-4 h-4 text-indigo-400" />
                    <span>خطوات التثبيت على أجهزة iPhone / iPad:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-400">1</span>
                    <span>اضغط على زر <strong>المشاركة 📤 (Share)</strong> في شريط Safari السفلي.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-400">2</span>
                    <span className="flex items-center gap-1">اختر <strong>إضافة للشاشة الرئيسية ➕ (Add to Home Screen)</strong>.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4.5 h-4.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-400">3</span>
                    <span>اضغط على <strong>إضافة (Add)</strong> في الزاوية العلوية لتأكيد التثبيت.</span>
                  </div>
                </div>
                <Button
                  onClick={() => setModalOpen(false)}
                  className="w-full h-10 bg-slate-800 hover:bg-slate-700 text-white font-extrabold"
                >
                  فهمت، حسناً
                </Button>
              </div>
            ) : (
              /* Android / Desktop Prompt Flow */
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleInstallClick}
                  className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>تثبيت التطبيق الآن</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 h-10 border-slate-800 hover:bg-slate-800/40 text-slate-400 hover:text-white"
                >
                  إلغاء
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
