import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, Check, CheckCircle2 } from 'lucide-react';

interface NotificationRuleRow {
  event: string;
  inApp: boolean;
  email: boolean;
  whatsapp: boolean;
  push: boolean;
}

export function NotificationsCenter() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [rules, setRules] = React.useState<NotificationRuleRow[]>([
    { event: 'New Customer (عميل جديد)', inApp: true, email: true, whatsapp: true, push: false },
    { event: 'New Task (مهمة جديدة)', inApp: true, email: false, whatsapp: true, push: true },
    { event: 'Task Overdue (تأخر المهمة)', inApp: true, email: true, whatsapp: true, push: true },
    { event: 'Appointment Created (موعد جديد)', inApp: true, email: true, whatsapp: false, push: false },
    { event: 'SLA Breach (تجاوز اتفاقية الـ SLA)', inApp: true, email: true, whatsapp: true, push: true },
    { event: 'Performance Alert (تراجع أداء الموظف)', inApp: true, email: true, whatsapp: false, push: false },
    { event: 'AI Agent Alert (تنبيه الذكاء الاصطناعي)', inApp: true, email: false, whatsapp: true, push: false }
  ]);

  const toggleChannel = (idx: number, channel: 'inApp' | 'email' | 'whatsapp' | 'push') => {
    const updated = [...rules];
    updated[idx][channel] = !updated[idx][channel];
    setRules(updated);
  };

  const handleSave = () => {
    setSuccess('✅ تم تحديث مصفوفة قنوات الإرسال وتعميمها بنجاح!');
    setTimeout(() => setSuccess(null), 3000);
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
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-indigo-400" />
            <span>مصفوفة إرسال وقنوات الإشعارات — Notification Preferences</span>
          </CardTitle>
          <CardDescription>
            تحديد القنوات المفعلة لكل حدث تشغيلي داخل النظام (تطبيق داخلي، بريد إلكتروني، رسائل واتساب، تنبيهات المتصفح).
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-xs">
          <div className="overflow-x-auto border border-slate-800/80 rounded-2xl bg-slate-950/40">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">الحدث التشغيلي المسبب</th>
                  <th className="p-4 text-center">إشعار داخلي (In-App)</th>
                  <th className="p-4 text-center">بريد إلكتروني (Email)</th>
                  <th className="p-4 text-center">واتساب (WhatsApp)</th>
                  <th className="p-4 text-center">دفع فوري (Push Alert)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {rules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/10 transition-colors">
                    <td className="p-4 font-bold text-white">{rule.event}</td>

                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={rule.inApp}
                        onChange={() => toggleChannel(idx, 'inApp')}
                        className="w-4.5 h-4.5 accent-indigo-500 cursor-pointer"
                      />
                    </td>

                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={rule.email}
                        onChange={() => toggleChannel(idx, 'email')}
                        className="w-4.5 h-4.5 accent-indigo-500 cursor-pointer"
                      />
                    </td>

                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={rule.whatsapp}
                        onChange={() => toggleChannel(idx, 'whatsapp')}
                        className="w-4.5 h-4.5 accent-indigo-500 cursor-pointer"
                      />
                    </td>

                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={rule.push}
                        onChange={() => toggleChannel(idx, 'push')}
                        className="w-4.5 h-4.5 accent-indigo-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex justify-end">
            <Button onClick={handleSave} className="gap-2 h-10 px-6">
              <Check className="w-4 h-4" />
              <span>حفظ وتثبيت قنوات الإرسال</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
