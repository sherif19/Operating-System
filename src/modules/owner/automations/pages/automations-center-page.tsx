import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Plus } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string;
  actions: string;
  enabled: boolean;
  executionCount: number;
}

export function AutomationsCenterPage() {
  const [rules, setRules] = React.useState<AutomationRule[]>([
    {
      id: 'rule-1',
      name: 'إنشاء رحلة ومهام العميل بعد التسجيل الموثق',
      trigger: 'تسجيل عميل جديد عبر رابط Invite Code',
      conditions: 'الحساب نشط + الصفقة مؤكدة',
      actions: 'إنشاء Workspace + فتح رحلة + تعيين المدرب بالـ Round-Robin',
      enabled: true,
      executionCount: 148,
    },
    {
      id: 'rule-2',
      name: 'فتح مهام المرحلة بعد إتمام مكالمة البداية',
      trigger: 'تغيير حالة مكالمة البداية إلى (مكتملة)',
      conditions: 'التقويم محدّث',
      actions: 'إطلاق مهام شراء الدومين والسوشيال ميديا وتجهيز المقالات',
      enabled: true,
      executionCount: 132,
    },
    {
      id: 'rule-3',
      name: 'تنبيه إداري عند تجاوز زمن المهمة المعياري',
      trigger: 'تجاوز effective_duration > expected_duration',
      conditions: 'المهمة قيد التنفيذ',
      actions: 'إرسال تنبيه في مركز التنبيهات + تحليل AI مرجح للسبب',
      enabled: true,
      executionCount: 12,
    },
  ]);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit">
            <Zap className="w-3.5 h-3.5 me-1 text-amber-400" />
            مركز الأتمتة والـ Workflows التشغيلية
          </Badge>
          <h1 className="text-2xl font-bold text-white">قواعد الأتمتة وسير العمل الآلي</h1>
          <p className="text-xs text-slate-400">
            تحويل العمليات المتكررة إلى تدفقات آلية بدون تدخل بشري (Trigger → Conditions → Actions).
          </p>
        </div>

        <Button variant="primary" size="md" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>إنشاء قاعدة أتمتة جديدة</span>
        </Button>
      </div>

      {/* Rules Stream */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="hover:border-indigo-500/40 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 mt-1 ${rule.enabled ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Zap className="w-6 h-6" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">{rule.name}</h3>
                    <Badge variant={rule.enabled ? 'success' : 'outline'} className="text-[10px]">
                      {rule.enabled ? 'نشطة' : 'معطلة'}
                    </Badge>
                    <span className="text-[10px] text-slate-400">تم التشغيل {rule.executionCount} مرة</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] font-semibold text-amber-400 block mb-0.5">المُشغّل (Trigger)</span>
                      <span className="text-slate-200">{rule.trigger}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] font-semibold text-indigo-400 block mb-0.5">الشروط (Conditions)</span>
                      <span className="text-slate-200">{rule.conditions}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] font-semibold text-emerald-400 block mb-0.5">الإجراءات (Actions)</span>
                      <span className="text-slate-200">{rule.actions}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant={rule.enabled ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => toggleRule(rule.id)}
                >
                  {rule.enabled ? 'تعطيل القاعد' : 'تفعيل'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
