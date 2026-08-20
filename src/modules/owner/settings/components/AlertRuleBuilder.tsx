import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertOctagon, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { AlertRule } from '../types/settings.types';
import { settingsService } from '../services/settings.service';

export function AlertRuleBuilder() {
  const [rules, setRules] = React.useState<AlertRule[]>([]);
  const [trigger, setTrigger] = React.useState('Task Overdue (تأخر المهمة)');
  const [severity, setSeverity] = React.useState<'critical' | 'warning' | 'info'>('warning');
  const [actionNotif, setActionNotif] = React.useState(true);
  const [actionWhatsapp, setActionWhatsapp] = React.useState(false);
  const [actionEscalate, setActionEscalate] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    setRules(settingsService.getAlertRules());
  }, []);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedActions: string[] = [];
    if (actionNotif) selectedActions.push('Notification');
    if (actionWhatsapp) selectedActions.push('WhatsApp');
    if (actionEscalate) selectedActions.push('Escalate');

    const newRule = settingsService.createAlertRule({
      trigger,
      severity,
      actions: selectedActions
    });

    setRules([...rules, newRule]);
    setSuccess('✅ تم إدراج وتنشيط قاعدة التنبيه التشغيلية!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteRule = (id: string) => {
    const res = settingsService.deleteAlertRule(id);
    if (res) {
      setRules(rules.filter((r) => r.id !== id));
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
        {/* Creator Form */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <AlertOctagon className="w-4.5 h-4.5 text-indigo-400" />
              <span>منشئ قواعد الإنذار والتحذير</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تحديد الشروط والتحذيرات التشغيلية وتصعيد الإجراءات.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <form onSubmit={handleAddRule} className="space-y-3">
              <div>
                <label className="block mb-1 text-slate-400 font-bold">المشغل المسبب للإنذار</label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Task Overdue (تأخر المهمة)">Task Overdue (تأخر المهمة)</option>
                  <option value="SLA Exceeded (تجاوز الـ SLA)">SLA Exceeded (تجاوز الـ SLA)</option>
                  <option value="Customer Inactive (خمول العميل)">Customer Inactive (خمول العميل)</option>
                  <option value="Performance Decline (تراجع الأداء)">Performance Decline (تراجع الأداء)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-bold">مستوى الخطورة (Severity)</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="info">إرشادية (Information)</option>
                  <option value="warning">تحذير (Warning)</option>
                  <option value="critical">حرجة جداً (Critical)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <label className="block mb-1 text-slate-400">الإجراءات المترتبة عند حدوث الإنذار</label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">إرسال إشعار فوري للمدير</span>
                  <input
                    type="checkbox"
                    checked={actionNotif}
                    onChange={(e) => setActionNotif(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">إرسال تنبيه واتساب مباشر</span>
                  <input
                    type="checkbox"
                    checked={actionWhatsapp}
                    onChange={(e) => setActionWhatsapp(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">تصعيد تلقائي (Auto Escalate)</span>
                  <input
                    type="checkbox"
                    checked={actionEscalate}
                    onChange={(e) => setActionEscalate(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500"
                  />
                </label>
              </div>

              <Button type="submit" className="w-full h-9 gap-1.5 mt-2">
                <Plus className="w-4 h-4" />
                <span>إدراج قاعدة التنبيه</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Alerts Grid */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl max-h-[600px] overflow-y-auto no-scrollbar">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <AlertOctagon className="w-4.5 h-4.5 text-indigo-400" />
              <span>قواعد الإنذار المفعلة حالياً ({rules.length})</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              شروط وأفعال توليد التحذيرات التشغيلية عند تعثر المهام أو تراجع أداء الموظفين.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-1">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-[13px]">{rule.trigger}</span>
                    <Badge variant="outline" className={
                      rule.severity === 'critical'
                        ? 'border-rose-500/20 text-rose-400 bg-rose-500/5'
                        : rule.severity === 'warning'
                        ? 'border-amber-500/20 text-amber-400 bg-amber-500/5'
                        : 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5'
                    }>
                      {rule.severity}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {rule.actions.map((act, i) => (
                      <Badge key={i} variant="outline" className="border-slate-800 text-slate-400 text-[10px]">
                        {act}
                      </Badge>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
