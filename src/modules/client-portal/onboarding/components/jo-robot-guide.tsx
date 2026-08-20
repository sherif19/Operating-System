import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TourStep {
  id: string;
  title: string;
  message: string;
  targetArea: string;
}

const DEFAULT_JO_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'أهلاً بك! أنا "جو" مرشدك التشغيلي',
    message: 'سأرافقك في رحلتك داخل المنصة. هنا يمكنك حجز المواعيد، متابعة المهام، واستلام مخرجات مشروعك خطوة بخطوة.',
    targetArea: 'dashboard',
  },
  {
    id: 'journey',
    title: 'خريطة رحلتك العملية',
    message: 'تستطيع متابعة مرحلتك الحالية من شراء الدومين حتى التسليم النهائي، ومعرفة الخطوة القادمة دائماً.',
    targetArea: 'journey',
  },
  {
    id: 'tasks',
    title: 'قسم "مهامي"',
    message: 'المهام تنزل هنا تلقائياً عقب كل مرحلة. يمكنك إرفاق الملفات وإتمام المهام مباشرة دون الحاجة للانتظار.',
    targetArea: 'tasks',
  },
  {
    id: 'deliverables',
    title: 'قسم "ممتلكاتي ومخرجاتي"',
    message: 'كل ما يتم إنتاجه لك (شعارات، ملفات، حسابات أدوات) ستجده موثقاً ومحفوظاً هنا بأمان.',
    targetArea: 'deliverables',
  },
];

export function JoRobotGuide({ onComplete }: { onComplete?: () => void }) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);

  const step = DEFAULT_JO_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < DEFAULT_JO_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsVisible(false);
      if (onComplete) onComplete();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 max-w-sm select-none">
        {/* Robot Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative bg-slate-900 border border-indigo-500/40 rounded-3xl p-5 shadow-2xl backdrop-blur-xl text-slate-100"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-extrabold text-indigo-300">
                {step.title}
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="إغلاق الجولة"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Message Content */}
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {step.message}
          </p>

          {/* Step Progress & Controls */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] font-semibold text-slate-500">
              خطوة {currentStepIndex + 1} من {DEFAULT_JO_STEPS.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDismiss}
                className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1"
              >
                تخطي
              </button>
              <Button variant="primary" size="sm" onClick={handleNext} className="py-1 px-3 text-xs">
                <span>{currentStepIndex === DEFAULT_JO_STEPS.length - 1 ? 'إنهاء' : 'التالي'}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Animated Robot Mascot Character */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, 1.5, -1.5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-600/30 border border-white/20 cursor-pointer"
          onClick={() => setIsVisible(true)}
        >
          <Bot className="w-8 h-8 text-white" />
          <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-500 border border-slate-900"></span>
          </span>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
