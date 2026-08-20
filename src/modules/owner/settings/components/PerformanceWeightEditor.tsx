import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { settingsService } from '../services/settings.service';

export function PerformanceWeightEditor() {
  const [speed, setSpeed] = React.useState(40);
  const [quality, setQuality] = React.useState(25);
  const [workload, setWorkload] = React.useState(20);
  const [stability, setStability] = React.useState(15);
  const [success, setSuccess] = React.useState<string | null>(null);

  const total = speed + quality + workload + stability;
  const isValid = total === 100;

  const handleReset = () => {
    setSpeed(40);
    setQuality(25);
    setWorkload(20);
    setStability(15);
  };

  const handleSave = async () => {
    if (!isValid) return;
    const result = await settingsService.saveSettings({
      weight_speed: speed,
      weight_quality: quality,
      weight_workload: workload,
      weight_stability: stability
    }, 'تعديل مصفوفة أوزان الأداء');

    if (result.success) {
      setSuccess('✅ تم حفظ وتحديث صيغة حساب تقييم الموظفين بنجاح!');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <div className="space-y-6 text-right">
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Card */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>محرر أوزان معادلة الأداء — Performance Weight Editor</span>
              </CardTitle>
              <CardDescription>
                توزيع نسب التأثير للمقاييس الحيوية الأربعة في التقييم التلقائي العام للموظفين.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset} className="h-8 gap-1 cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة ضبط</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-5 text-xs">
            {/* Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>وزن سرعة التنفيذ (Execution Speed)</span>
                <span className="font-mono text-indigo-400 text-sm">{speed}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>وزن جودة المخرجات (Quality & QA Review)</span>
                <span className="font-mono text-indigo-400 text-sm">{quality}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Workload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>وزن كثافة العمل وحجم المهام (Workload)</span>
                <span className="font-mono text-indigo-400 text-sm">{workload}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={workload}
                onChange={(e) => setWorkload(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Stability */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>وزن الاستقرار والتواصل (Stability)</span>
                <span className="font-mono text-indigo-400 text-sm">{stability}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={stability}
                onChange={(e) => setStability(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Validation Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${isValid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4.5 h-4.5" />
                <span>
                  {isValid
                    ? 'النسب المدخلة صحيحة وتساوي 100%. جاهز للحفظ وتحديث نظام الأوزان.'
                    : 'تنبيه: يجب أن يكون مجموع الأوزان الأربعة مساوياً لـ 100% بالضبط لضمان دقة العمليات!'}
                </span>
              </div>
              <span className="font-mono font-black text-sm">المجموع: {total}%</span>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={handleSave} disabled={!isValid} className="px-6 h-10">
                تطبيق وحفظ معادلة الأداء
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Formula Preview Card */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white">معاينة الصيغة الرياضية — Formula Preview</CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              كيفية حساب مجموع نقاط الموظف التشغيلية بناءً على المدخلات الحالية.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-center text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-indigo-300 leading-relaxed text-left">
              Score = (Speed * {speed/100}) + (Quality * {quality/100}) + (Workload * {workload/100}) + (Stability * {stability/100})
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              💡 يرجى الملاحظة أن وقت استلام المهام لا يدخل في معادلة السرعة لضمان العدالة التشغيلية للموظفين.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
