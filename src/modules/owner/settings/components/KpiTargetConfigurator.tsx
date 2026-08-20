import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, CheckCircle2, Save, Sparkles } from 'lucide-react';
import { settingsService } from '../services/settings.service';

interface KpiMetricConfig {
  id: string;
  name: string;
  target: string;
  warning: string;
  critical: string;
  freq: string;
}

export function KpiTargetConfigurator() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [kpis, setKpis] = React.useState<KpiMetricConfig[]>([
    { id: 'reg_comp', name: 'نسبة إكمال تسجيل العملاء (Registration Completion)', target: '95%', warning: '85%', critical: '75%', freq: 'يومي (Daily)' },
    { id: 'call_att', name: 'حضور الجلسات والمكالمات الختامية (Call Attendance)', target: '98%', warning: '90%', critical: '80%', freq: 'فوري (Real-time)' },
    { id: 'task_sla', name: 'التزام الموظفين بـ SLA المهام (Task Completion SLA)', target: '90%', warning: '80%', critical: '70%', freq: 'يومي (Daily)' },
    { id: 'first_resp', name: 'زمن الرد الأول للتذاكر (First Response Time)', target: 'ساعة واحدة', warning: 'ساعتين', critical: '4 ساعات', freq: 'فوري (Real-time)' }
  ]);

  const handleUpdate = (idx: number, key: keyof KpiMetricConfig, val: string) => {
    const updated = [...kpis];
    updated[idx] = { ...updated[idx], [key]: val };
    setKpis(updated);
  };

  const handleSave = async () => {
    const changes: Record<string, any> = {};
    kpis.forEach((k) => {
      changes[`kpi_${k.id}_target`] = k.target;
      changes[`kpi_${k.id}_warning`] = k.warning;
    });

    const res = await settingsService.saveSettings(changes, 'تحديث أهداف مؤشرات الأداء KPIs');
    if (res.success) {
      setSuccess('✅ تم تحديث وتعميم أهداف مؤشرات الأداء الحيوية بنجاح!');
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

      <Card className="border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-indigo-400" />
              <span>تهيئة أهداف ومؤشرات القياس — KPI Targets & Thresholds</span>
            </CardTitle>
            <CardDescription>
              تحديد الأهداف الاستراتيجية وعتبات الخطر لكل مؤشر أداء تشغيلي في أكاديمية المستبصرين.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 text-xs">
          <div className="overflow-x-auto border border-slate-800/80 rounded-2xl bg-slate-950/40">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">مؤشر الأداء التشغيلي (KPI Metric)</th>
                  <th className="p-4">الهدف المطلوب (Target)</th>
                  <th className="p-4">حد التحذير (Warning)</th>
                  <th className="p-4">حد الخطر (Critical)</th>
                  <th className="p-4">تكرار التحديث</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {kpis.map((kpi, idx) => (
                  <tr key={kpi.id} className="hover:bg-slate-800/10 transition-colors">
                    <td className="p-4 font-bold text-white max-w-sm">{kpi.name}</td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={kpi.target}
                        onChange={(e) => handleUpdate(idx, 'target', e.target.value)}
                        className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-center text-emerald-400 font-mono"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={kpi.warning}
                        onChange={(e) => handleUpdate(idx, 'warning', e.target.value)}
                        className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-center text-amber-400 font-mono"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={kpi.critical}
                        onChange={(e) => handleUpdate(idx, 'critical', e.target.value)}
                        className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-center text-rose-400 font-mono"
                      />
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-slate-800 text-slate-400">
                        {kpi.freq}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[10px] text-indigo-400/80 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>تستخدم هذه القيم لتلوين مؤشرات تقارير لوحة الملاك العليا وتوليد التحليلات الفورية.</span>
            </span>
            <Button onClick={handleSave} className="gap-2 h-10 px-6">
              <Save className="w-4 h-4" />
              <span>حفظ وتعميم مؤشرات الـ KPIs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
