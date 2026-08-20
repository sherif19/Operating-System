import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JourneyEngine } from '../../customers/journey/services/journey-engine';
import { Customer } from '../../customers/types/domain.types';
import { CustomersApi } from '../../customers/api/customers.api';
import { Sparkles, CheckCircle2, Lock, Play, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function CustomerJourneyPage() {
  const [customer, setCustomer] = React.useState<Customer | null>(null);

  React.useEffect(() => {
    CustomersApi.fetchById('cust-1').then(setCustomer);
  }, []);

  if (!customer) {
    return <div className="p-8 text-center text-xs text-slate-400">جاري تحميل مسار رحلتك...</div>;
  }

  const currentStageIndex = JourneyEngine.STAGES_ORDER.indexOf(customer.currentStage);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 me-1.5 animate-pulse" />
            رحلتي التشغيلية المتكاملة
          </Badge>
          <h1 className="text-2xl font-black text-white">مسار تنفيذ وإطلاق مشروعك</h1>
          <p className="text-xs text-slate-400">
            تتبع المراحل المختلفة وتقدم العمليات التشغيلية حتى تسليم المخرجات النهائية.
          </p>
        </div>
      </div>

      {/* Dynamic Journey timeline path (4 in a row, wrapping) */}
      <Card className="p-6 relative overflow-hidden bg-slate-950/80 border-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-12">
          {JourneyEngine.STAGES_ORDER.map((stageId, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            const statusLabel = isCompleted ? 'مكتملة' : isCurrent ? 'نشطة' : 'مغلقة';

            // Hide connector on the last column of each row (4th, 8th, etc.) on desktop, and 2nd, 4th, etc. on tablet
            const isLastInDesktopRow = (idx + 1) % 4 === 0;
            const isLastInTabletRow = (idx + 1) % 2 === 0;
            const isLastOverall = idx === JourneyEngine.STAGES_ORDER.length - 1;

            return (
              <div key={stageId} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25, delay: idx * 0.03 }}
                  className={`w-full p-4 rounded-2xl border flex flex-col justify-between h-36 relative transition-all z-10 ${
                    isCurrent
                      ? 'border-blue-500 bg-[#10193E] shadow-lg shadow-blue-500/10'
                      : isCompleted
                      ? 'border-emerald-500/25 bg-emerald-950/5 text-slate-400'
                      : 'border-slate-900 bg-slate-950/40 opacity-70 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">
                      الخطوة {idx + 1}
                    </span>

                    <div className={`p-1 rounded-lg border flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                        : isCurrent
                        ? 'bg-[#0075FF]/10 border-[#0075FF]/25 text-cyan-400'
                        : 'bg-slate-950 border-slate-900 text-slate-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : isCurrent ? (
                        <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    <h4 className={`text-xs font-black truncate ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                      {stageId.replace('_', ' ')}
                    </h4>
                    <span className="text-[9px] text-slate-500 mt-1 block">الحالة: {statusLabel}</span>
                  </div>
                </motion.div>

                {/* Desktop connector arrow - perfectly centered in the 48px gap */}
                {!isLastOverall && !isLastInDesktopRow && (
                  <div className="hidden lg:flex absolute left-[-40px] w-8 top-1/2 -translate-y-1/2 items-center justify-center z-0">
                    <div className={`absolute w-full h-[2px] rounded-full ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-indigo-500' : 'bg-slate-900'}`} />
                    <ChevronLeft className={`w-4 h-4 z-10 ${isCompleted ? 'text-indigo-400 animate-pulse' : 'text-slate-800'}`} />
                  </div>
                )}

                {/* Tablet connector arrow - perfectly centered in the 48px gap */}
                {!isLastOverall && !isLastInTabletRow && (
                  <div className="hidden sm:flex lg:hidden absolute left-[-40px] w-8 top-1/2 -translate-y-1/2 items-center justify-center z-0">
                    <div className={`absolute w-full h-[2px] rounded-full ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-indigo-500' : 'bg-slate-900'}`} />
                    <ChevronLeft className={`w-4 h-4 z-10 ${isCompleted ? 'text-indigo-400 animate-pulse' : 'text-slate-800'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
export default CustomerJourneyPage;
