import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { AutomationRule } from '../types/settings.types';
import { settingsService } from '../services/settings.service';

export function AutomationBuilder() {
  const [rules, setRules] = React.useState<AutomationRule[]>([]);
  const [title, setTitle] = React.useState('');
  const [trigger, setTrigger] = React.useState('إتمام مهمة (Task Completed)');
  const [conditions, setConditions] = React.useState('Task.Priority == "critical"');
  const [actions, setActions] = React.useState('إرسال واتساب للمدير');
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    setRules(settingsService.getAutomationRules());
  }, []);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newRule = settingsService.createAutomationRule({
      title,
      trigger,
      conditions,
      actions
    });

    setRules([...rules, newRule]);
    setTitle('');
    setSuccess('✅ تم إنشاء قاعدة الأتمتة وإدراجها بجدول التشغيل الفوري!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  return (
    <Card className="border border-slate-800/80 bg-slate-900/60 p-6 rounded-3xl relative overflow-hidden">
      {success && (
        <div className="absolute top-4 left-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 z-20">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>منشئ قواعد الأتمتة — Trigger-Condition-Action Rule Builder</span>
        </CardTitle>
        <CardDescription>
          تفعيل الاستجابات والأفعال الفورية عند تحقق شروط مخصصة في مهام العملاء أو مواعيدهم.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 text-xs">
        {/* Rule Form */}
        <form onSubmit={handleAddRule} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
          <div>
            <label className="block mb-1.5 text-slate-400 font-bold">اسم القاعدة</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تنبيه المشرف..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-slate-400 font-bold">المشغل (Trigger)</label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="إنشاء عميل جديد (Customer Created)">إنشاء عميل جديد</option>
              <option value="إتمام مهمة (Task Completed)">إتمام مهمة</option>
              <option value="تغيير المرحلة (Stage Entered)">تغيير المرحلة</option>
              <option value="فوات الموعد (Task Overdue)">فوات الموعد</option>
            </select>
          </div>

          <div>
            <label className="block mb-1.5 text-slate-400 font-bold">الشروط (Conditions)</label>
            <input
              type="text"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="مثال: Task.Priority == 'critical'"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[10px]"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-slate-400 font-bold">الإجراء (Actions)</label>
            <input
              type="text"
              value={actions}
              onChange={(e) => setActions(e.target.value)}
              placeholder="مثال: إرسال واتساب للمدير"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full gap-1.5 h-10">
              <Plus className="w-4 h-4" />
              <span>إدراج القاعدة</span>
            </Button>
          </div>
        </form>

        {/* Rules Table */}
        <div className="overflow-x-auto border border-slate-800/60 rounded-2xl bg-slate-950/20">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">القاعدة الوظيفية</th>
                <th className="p-3.5">الحدث المسبب (Trigger)</th>
                <th className="p-3.5">الشروط</th>
                <th className="p-3.5">الإجراءات المترتبة</th>
                <th className="p-3.5 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-200">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-3.5 font-bold text-white">{rule.title}</td>
                  <td className="p-3.5">
                    <Badge variant="outline" className="border-amber-500/20 text-amber-400 bg-amber-500/5">
                      {rule.trigger}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-mono text-[10px] text-indigo-300">{rule.conditions}</td>
                  <td className="p-3.5 text-slate-300">{rule.actions}</td>
                  <td className="p-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
