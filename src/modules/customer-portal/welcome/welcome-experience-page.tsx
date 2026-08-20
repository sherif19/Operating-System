import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TOUR_STEPS, WELCOME_BOT_NAME } from './content/welcome-messages';
import { Bot, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function WelcomeExperiencePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(0);

  const step = TOUR_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed, redirect to dashboard
      navigate('/client/dashboard');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="p-6 relative overflow-hidden bg-gradient-to-b from-[#10193E] to-slate-950/90 border-blue-500/25 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_65%)] pointer-events-none" />

          {/* Bot avatar */}
          <div className="flex flex-col items-center gap-4 text-center mt-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0"
            >
              <Bot className="w-8 h-8" />
            </motion.div>

            <div className="flex flex-col">
              <Badge variant="default" className="w-fit mx-auto bg-cyan-500/20 text-cyan-300">
                <Sparkles className="w-3 h-3 me-1 animate-pulse" />
                مساعدك الذكي
              </Badge>
              <h2 className="text-lg font-black text-white mt-1">{WELCOME_BOT_NAME}</h2>
            </div>
          </div>

          {/* Speech bubble */}
          <div className="mt-8 relative p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed text-right min-h-24">
            <div className="absolute top-[-8px] right-8 w-4 h-4 bg-slate-900 border-t border-r border-slate-800 rotate-[-45deg]" />
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {step.text}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Step indicators */}
          <div className="mt-6 flex justify-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-1.5 rounded-full transition-all ${
                  idx === currentStep ? 'bg-cyan-400 w-5' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`p-2 text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:pointer-events-none`}
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            <Button variant="primary" size="md" onClick={handleNext} className="gap-2">
              <span>{step.actionLabel || 'التالي'}</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
export default WelcomeExperiencePage;
