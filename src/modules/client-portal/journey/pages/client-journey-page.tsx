import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Calendar, Lock, Sparkles } from 'lucide-react';
import { AppointmentBookingModal } from '../../appointments/components/appointment-booking-modal';
import { JoRobotGuide } from '../../onboarding/components/jo-robot-guide';

interface JourneyStep {
  id: string;
  stageName: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  dateLabel?: string;
  unlockedItems: string[];
}

export function ClientJourneyPage() {
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);

  const steps: JourneyStep[] = [
    {
      id: '1',
      stageName: 'التسجيل وتفعيل الحساب',
      description: 'تسجيل الدخول من الرابط الموثق وإنشاء مساحة العمل الخاصة بك.',
      status: 'completed',
      dateLabel: 'تم في 15 أغسطس 2026',
      unlockedItems: ['حساب العميل', 'جولة جو الترحبئية', 'مقال إرشادات الرحلة'],
    },
    {
      id: '2',
      stageName: 'مكالمة البداية (Kickoff Call)',
      description: 'جلسة التخطيط وتحديد المتطلبات الأساسية مع المدرب المعين.',
      status: 'current',
      dateLabel: 'الموعد الموصى به: اليوم',
      unlockedItems: ['تقويم المدرب (محمد)', 'نموذج البيانات الأولية', 'مهام مكالمة البداية'],
    },
    {
      id: '3',
      stageName: 'إعداد الدومين والسوشيال ميديا',
      description: 'شراء الدومين، تهيئة المنصات، وفتح حسابات التواصل الاجتماعي.',
      status: 'locked',
      dateLabel: 'يفتح عقب إتمام مكالمة البداية',
      unlockedItems: ['مهام التحقق من السوشيال', 'مقال دليل اختيار الدومين'],
    },
    {
      id: '4',
      stageName: 'التنفيذ والإنتاج',
      description: 'بناء الهوية الشاملة، تصميم مخرجات الميديا، وتجهيز الأنظمة.',
      status: 'locked',
      dateLabel: 'المرحلة التشغيلية الرئيسية',
      unlockedItems: ['مخرجات الهوية', 'ملفات التصاميم', 'تحديثات التقدم الفورية'],
    },
    {
      id: '5',
      stageName: 'المراجعة والاعتماد (QA)',
      description: 'مراجعة الجودة النهائية والتأكد من مطابقة جميع المواصفات.',
      status: 'locked',
      dateLabel: 'مراجعة قسم الجودة',
      unlockedItems: ['معاينة المخرجات', 'طلب تعديلات إن وجدت'],
    },
    {
      id: '6',
      stageName: 'التسليم ومكالمة النهاية',
      description: 'نشر جميع الملفات والاعتمادات في قسم (ممتلكاتي) وجلسة الختام.',
      status: 'locked',
      dateLabel: 'موعد الاستلام التقديري: 30 أغسطس',
      unlockedItems: ['حزمة الممتلكات الكاملة', 'شهادة الأكاديمية', 'تقويم مكالمة التسليم'],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 shadow-2xl">
        <div className="flex flex-col gap-1">
          <Badge variant="purple" className="w-fit">
            <Sparkles className="w-3 h-3 me-1" />
            رحلتك التشغيلية — Step-by-Step Journey
          </Badge>
          <h1 className="text-2xl font-bold text-white">خريطة ومراحل تنفيذ المشروع</h1>
          <p className="text-xs text-slate-300">
            تتبع تقدم مشروعك خطوة بخطوة. الانتقال بين المراحل يتم تلقائياً بناءً على إتمام المهام والمواعيد.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsBookingOpen(true)} className="gap-2">
          <Calendar className="w-4 h-4" />
          <span>حجز مكالمة البداية الآن</span>
        </Button>
      </div>

      {/* Journey Steps Stream */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <Card
            key={step.id}
            className={`transition-all ${
              step.status === 'current'
                ? 'border-indigo-500/60 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 shadow-indigo-500/10 shadow-xl'
                : step.status === 'completed'
                ? 'border-slate-800/80 bg-slate-900/40 opacity-90'
                : 'border-slate-800/40 bg-slate-950/40 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl shrink-0 mt-1 ${
                    step.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : step.status === 'current'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 animate-pulse'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : step.status === 'current' ? (
                    <Clock className="w-6 h-6" />
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">
                      المرحلة 0{idx + 1}
                    </span>
                    <h3 className="text-base font-extrabold text-white">{step.stageName}</h3>
                    <Badge
                      variant={
                        step.status === 'completed'
                          ? 'success'
                          : step.status === 'current'
                          ? 'default'
                          : 'outline'
                      }
                      className="text-[10px]"
                    >
                      {step.status === 'completed'
                        ? 'مكتملة'
                        : step.status === 'current'
                        ? 'المرحلة الحالية النشطة'
                        : 'سيفتح لاحقاً'}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] font-semibold text-slate-400">العناصر المتاحة:</span>
                    {step.unlockedItems.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700/50"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                {step.dateLabel && (
                  <span className="text-[11px] font-semibold text-slate-400">{step.dateLabel}</span>
                )}
                {step.status === 'current' && (
                  <Button variant="primary" size="sm" onClick={() => setIsBookingOpen(true)}>
                    انتقل للتنفيذ
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AppointmentBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        customerId="cust-demo-1"
      />

      <JoRobotGuide />
    </div>
  );
}
