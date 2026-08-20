import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';
import { settingsService } from '../services/settings.service';

export function AiCostControlsPanel() {
  const [monthlyBudget, setMonthlyBudget] = React.useState(500);
  const [dailyBudget, setDailyBudget] = React.useState(25);
  const [warningThreshold, setWarningThreshold] = React.useState(80);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Mock utilization values
  const currentMonthlySpend = 142.50;
  const currentDailySpend = 8.12;

  const monthlyPct = (currentMonthlySpend / monthlyBudget) * 100;
  const dailyPct = (currentDailySpend / dailyBudget) * 100;

  const handleSave = async () => {
    const res = await settingsService.saveSettings({
      ai_monthly_budget: monthlyBudget,
      ai_daily_budget: dailyBudget,
      ai_warning_threshold: warningThreshold
    }, 'تعديل سقوف ميزانية الذكاء الاصطناعي');

    if (res.success) {
      setSuccess('✅ تم تطبيق ميزانيات وسقوف استهلاك الذكاء الاصطناعي بنجاح!');
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
        {/* Cost Budget Form */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <DollarSign className="w-4.5 h-4.5 text-indigo-400" />
              <span>تهيئة حدود وميزانيات الاستهلاك</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تحديد الميزانية القصوى بالدولار لتفادي الفواتير غير المتوقعة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="block mb-1 text-slate-400 font-bold">الميزانية الشهرية القصوى ($)</label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400 font-bold">الميزانية اليومية القصوى ($)</label>
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400 font-bold">نسبة التنبيه قبل قطع الخدمة (%)</label>
              <input
                type="number"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <Button onClick={handleSave} className="w-full h-9 gap-1.5 mt-2">
              <span>تطبيق حدود الميزانية</span>
            </Button>
          </CardContent>
        </Card>

        {/* Live Utilization Progress */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl flex flex-col justify-between">
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>معدل ومراقبة الاستهلاك الفعلي — API Usage Tracking</span>
            </CardTitle>
            <CardDescription>
              مراقبة التكاليف المستهلكة للرموز المميزة (Tokens) لوكلاء الذكاء الاصطناعي خلال دورة الفوترة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-xs flex-1 flex flex-col justify-center">
            {/* Monthly Spend */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>الاستهلاك الشهري الحالي</span>
                <span className="font-mono text-white">
                  <strong>${currentMonthlySpend}</strong> / ${monthlyBudget}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(monthlyPct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>نسبة الاستهلاك: {monthlyPct.toFixed(1)}%</span>
                <span>المتبقي: ${(monthlyBudget - currentMonthlySpend).toFixed(2)}</span>
              </div>
            </div>

            {/* Daily Spend */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>الاستهلاك اليومي الحالي</span>
                <span className="font-mono text-white">
                  <strong>${currentDailySpend}</strong> / ${dailyBudget}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(dailyPct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>نسبة الاستهلاك اليومي: {dailyPct.toFixed(1)}%</span>
                <span>المتبقي لليوم: ${(dailyBudget - currentDailySpend).toFixed(2)}</span>
              </div>
            </div>

            {/* Warning Message */}
            {monthlyPct >= warningThreshold && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] rounded-2xl flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                <span>تحذير: لقد تجاوزت عتبة التنبيه المقررة ({warningThreshold}%). سيتم إيقاف الموديل بمجرد وصول الميزانية لـ 100%.</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
