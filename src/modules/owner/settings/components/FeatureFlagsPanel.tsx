import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToggleRight, CheckCircle2 } from 'lucide-react';

interface FeatureFlagItem {
  id: string;
  name: string;
  enabled: boolean;
  rolloutPct: number;
  environment: 'production' | 'staging' | 'development';
}

export function FeatureFlagsPanel() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [flags, setFlags] = React.useState<FeatureFlagItem[]>([
    { id: 'portal', name: 'بوابة العملاء (Customer Portal)', enabled: true, rolloutPct: 100, environment: 'production' },
    { id: 'ai_engine', name: 'محرك أتمتة الذكاء الاصطناعي (AI engine)', enabled: true, rolloutPct: 50, environment: 'production' },
    { id: 'collab', name: 'قنوات الدردشة الفورية (Collaboration Channels)', enabled: true, rolloutPct: 100, environment: 'production' },
    { id: 'perf_engine', name: 'محرك أوزان التقييم (Performance Weight Engine)', enabled: true, rolloutPct: 80, environment: 'production' },
    { id: 'whatsapp_notif', name: 'إشعارات الواتساب الجماعية (WhatsApp OTP & Broadcasts)', enabled: false, rolloutPct: 0, environment: 'staging' }
  ]);

  const [selectedFlag, setSelectedFlag] = React.useState<FeatureFlagItem | null>(null);

  React.useEffect(() => {
    setSelectedFlag(flags[0]);
  }, [flags]);

  const handleUpdate = (key: keyof FeatureFlagItem, val: any) => {
    if (!selectedFlag) return;
    const updated = { ...selectedFlag, [key]: val };
    setSelectedFlag(updated);
    setFlags(flags.map((f) => (f.id === selectedFlag.id ? updated : f)));
  };

  const handleSave = () => {
    setSuccess('✅ تم حفظ ونشر قيم مؤشرات الميزات والتدريج الجغرافي بنجاح!');
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flags list */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <ToggleRight className="w-4.5 h-4.5 text-indigo-400" />
              <span>مؤشرات الميزات (Feature Flags)</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تفعيل الميزات التشغيلية تدريجياً لنسب معينة أو بيئات تطوير محددة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-1">
            {flags.map((flag) => {
              const isActive = selectedFlag?.id === flag.id;
              return (
                <div
                  key={flag.id}
                  onClick={() => setSelectedFlag(flag)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-600/10 border-indigo-500 text-white'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{flag.name}</span>
                  <Badge variant="outline" className={flag.enabled ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-slate-800 text-slate-500'}>
                    {flag.enabled ? 'مفعل' : 'معطل'}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Selected Flag controller */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
          {selectedFlag ? (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>التحكم بالميزة: {selectedFlag.name}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">تحديد نسب النشر التدريجي والبيئة المستهدفة.</p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-slate-400">حالة التفعيل الكلية</span>
                  <input
                    type="checkbox"
                    checked={selectedFlag.enabled}
                    onChange={(e) => handleUpdate('enabled', e.target.checked)}
                    className="w-4.5 h-4.5 accent-indigo-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">بيئة التشغيل المستهدفة</label>
                  <select
                    value={selectedFlag.environment}
                    onChange={(e) => handleUpdate('environment', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="production">الإنتاج العام (Production)</option>
                    <option value="staging">بيئة الاختبار (Staging)</option>
                    <option value="development">التطوير الداخلي (Development)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-300 font-bold">
                    <span>نسبة النشر التدريجي للمستخدمين (Rollout Pct)</span>
                    <span className="font-mono text-indigo-400">{selectedFlag.rolloutPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedFlag.rolloutPct}
                    onChange={(e) => handleUpdate('rolloutPct', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <Button onClick={handleSave} className="px-6 h-9">
                  حفظ قيم الـ Feature Flag
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">الرجاء اختيار ميزة لتحديد نسب النشر التدريجي.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
