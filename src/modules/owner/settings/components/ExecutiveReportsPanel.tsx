import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Trash2, CheckCircle2, Send } from 'lucide-react';

interface ReportConfig {
  id: string;
  interval: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  recipients: string[];
  kpis: string[];
  formats: ('Interactive' | 'PDF' | 'CSV')[];
}

export function ExecutiveReportsPanel() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [configs, setConfigs] = React.useState<ReportConfig[]>([
    { id: 'rep-1', interval: 'Daily', recipients: ['ceo@company.com', 'ops@company.com'], kpis: ['Registration Completion', 'SLA Breaches'], formats: ['Interactive', 'PDF'] },
    { id: 'rep-2', interval: 'Monthly', recipients: ['board@company.com', 'investors@company.com'], kpis: ['Overall Performance', 'Revenue Forecast'], formats: ['PDF', 'CSV'] }
  ]);

  const [selected, setSelected] = React.useState<ReportConfig | null>(null);
  const [newEmail, setNewEmail] = React.useState('');

  React.useEffect(() => {
    setSelected(configs[0]);
  }, [configs]);

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !newEmail) return;
    if (selected.recipients.includes(newEmail)) return;

    const updated = {
      ...selected,
      recipients: [...selected.recipients, newEmail]
    };
    setSelected(updated);
    setConfigs(configs.map((c) => (c.id === selected.id ? updated : c)));
    setNewEmail('');
  };

  const handleRemoveEmail = (email: string) => {
    if (!selected) return;
    const updated = {
      ...selected,
      recipients: selected.recipients.filter((r) => r !== email)
    };
    setSelected(updated);
    setConfigs(configs.map((c) => (c.id === selected.id ? updated : c)));
  };

  const handleSave = () => {
    setSuccess('✅ تم حفظ وتحديث جداول التقارير التنفيذية التلقائية!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleTriggerNow = () => {
    setSuccess('🚀 تم تشغيل وإرسال التقرير التنفيذي فوراً لكافة المستلمين!');
    setTimeout(() => setSuccess(null), 3500);
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
        {/* Reports Schedule Sidebar */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-indigo-400" />
              <span>جداول التقارير القيادية</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تحديد توقيت وجدولة التقارير الأوتوماتيكية للملاك.
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
                  <span>تقرير دوري: {c.interval}</span>
                  <Badge variant="outline" className="border-indigo-500/20 text-indigo-400">
                    {c.recipients.length} مستلم
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Selected Config parameters */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
          {selected ? (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>إعداد مستلمي تقرير: {selected.interval}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">إضافة عناوين البريد الإلكتروني للملاك والمستثمرين لإرسال التقارير التلقائية.</p>
                </div>
                <Button size="sm" onClick={handleTriggerNow} className="h-8 gap-1">
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال الآن</span>
                </Button>
              </div>

              {/* Email List Builder */}
              <div className="space-y-3">
                <span className="block text-slate-400 font-bold mb-1">عناوين البريد للمستلمين</span>
                <form onSubmit={handleAddEmail} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="example@company.com"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-left"
                  />
                  <Button type="submit" size="icon" className="w-10 h-10 rounded-xl shrink-0">
                    <Plus className="w-5 h-5" />
                  </Button>
                </form>

                <div className="flex flex-wrap gap-2 pt-1.5">
                  {selected.recipients.map((email) => (
                    <Badge key={email} variant="outline" className="border-slate-800 text-slate-300 font-mono text-[10px] pl-1 pr-2.5 py-1 flex items-center gap-1.5 bg-slate-950/40">
                      <span>{email}</span>
                      <button type="button" onClick={() => handleRemoveEmail(email)} className="text-slate-500 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Formats Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <span className="block text-slate-400 font-bold">صيغ وإخراج التقرير المتاحة</span>
                <div className="flex gap-4">
                  {['Interactive (تفاعلي)', 'PDF (مستند)', 'CSV (جدول أرقام)'].map((f) => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <Button onClick={handleSave} className="px-6 h-9">
                  حفظ جدول التقارير
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">الرجاء اختيار دورية للتقرير القيادي لتعديل معاييره.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
