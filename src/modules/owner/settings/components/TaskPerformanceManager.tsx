import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TaskPerfConfig {
  id: string;
  taskType: string;
  expectedDuration: number;
  maxExpectedDuration: number;
  complexityWeight: number;
  qualityWeight: number;
  reworkPenalty: number; // In points/penalty factor
}

export function TaskPerformanceManager() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [configs, setConfigs] = React.useState<TaskPerfConfig[]>([
    { id: 't1', taskType: 'مراجعة وتوقيع العقود (Contract Setup)', expectedDuration: 4, maxExpectedDuration: 12, complexityWeight: 2, qualityWeight: 3, reworkPenalty: 15 },
    { id: 't2', taskType: 'حجز وشراء النطاقات (Domain Purchase)', expectedDuration: 1, maxExpectedDuration: 4, complexityWeight: 1, qualityWeight: 1, reworkPenalty: 5 },
    { id: 't3', taskType: 'إعداد خطة التشغيل ومستندات البدء', expectedDuration: 12, maxExpectedDuration: 24, complexityWeight: 3, qualityWeight: 5, reworkPenalty: 25 }
  ]);

  const [selected, setSelected] = React.useState<TaskPerfConfig | null>(null);

  React.useEffect(() => {
    setSelected(configs[0]);
  }, [configs]);

  const handleUpdate = (key: keyof TaskPerfConfig, val: any) => {
    if (!selected) return;
    const updated = { ...selected, [key]: val };
    setSelected(updated);
    setConfigs(configs.map((c) => (c.id === selected.id ? updated : c)));
  };

  const handleSave = () => {
    setSuccess('✅ تم تحديث أوزان وجزاءات أداء أنواع المهام بنجاح!');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 text-right text-xs">
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Formula Warning Panel */}
      <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-indigo-400" />
          <span>
            صيغة احتساب الوقت الفعلي للمهمة هي:{' '}
            <strong className="text-white font-mono text-[11px]">
              effective_duration = task_completed_at - task_accepted_at
            </strong>{' '}
            (لا يدخل وقت انتظار استلام المهمة في تقييم سرعة تنفيذ الموظف).
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Types Sidebar */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <ListChecks className="w-4.5 h-4.5 text-indigo-400" />
              <span>أنواع المهام التشغيلية</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تحديد أوزان ونسب تقييم الإنتاجية لكل نوع مهمة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-1">
            {configs.map((c) => {
              const isActive = selected?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-600/10 border-indigo-500 text-white'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{c.taskType}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Selected Config parameters */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
          {selected ? (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>إعدادات تقييم المهمة: {selected.taskType}</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">تعديل الزمن المتوقع ووزن التعقيد وجزاء إعادة العمل (Rework).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">الزمن المتوقع للتنفيذ (ساعات)</label>
                  <input
                    type="number"
                    value={selected.expectedDuration}
                    onChange={(e) => handleUpdate('expectedDuration', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">الزمن الأقصى المسموح به (ساعات)</label>
                  <input
                    type="number"
                    value={selected.maxExpectedDuration}
                    onChange={(e) => handleUpdate('maxExpectedDuration', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">وزن تعقيد المهمة (Complexity Weight)</label>
                  <input
                    type="number"
                    value={selected.complexityWeight}
                    onChange={(e) => handleUpdate('complexityWeight', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">جزاء إعادة العمل المرفوض (Rework Penalty)</label>
                  <input
                    type="number"
                    value={selected.reworkPenalty}
                    onChange={(e) => handleUpdate('reworkPenalty', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-rose-400"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <Button onClick={handleSave} className="px-6 h-9">
                  حفظ وتطبيق قواعد التقييم للمهمة
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">الرجاء اختيار نوع مهمة لتعديل معاييرها التشغيلية.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
