import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal, Plus, Trash2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useDialogStore } from '@/stores/dialog.store';

interface WebhookItem {
  id: string;
  url: string;
  event: string;
  status: 'active' | 'inactive';
  lastStatus: number;
}

export function ApiWebhooksPanel() {
  const { showConfirm } = useDialogStore();
  const [success, setSuccess] = React.useState<string | null>(null);
  const [showKey, setShowKey] = React.useState(false);
  const [webhooks, setWebhooks] = React.useState<WebhookItem[]>([
    { id: 'web-1', url: 'https://api.thirdparty.com/v1/customer-sync', event: 'Customer Created', status: 'active', lastStatus: 200 },
    { id: 'web-2', url: 'https://hooks.slack.com/services/T00/B00/X00', event: 'Task Completed', status: 'active', lastStatus: 200 }
  ]);

  const [newUrl, setNewUrl] = React.useState('');
  const [newEvent, setNewEvent] = React.useState('Customer Created');

  const apiKeyMasked = showKey ? 'uk_live_9f83ea24b7a1e0b5c7d8a9e0f312c4' : '••••••••••••••••••••••••••••••••••••••••••••••';

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const newItem: WebhookItem = {
      id: `web-${Date.now()}`,
      url: newUrl,
      event: newEvent,
      status: 'active',
      lastStatus: 200
    };

    setWebhooks([...webhooks, newItem]);
    setNewUrl('');
    setSuccess('✅ تم إدراج وجدولة الـ Webhook الجديد بنجاح!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleGenerateKey = () => {
    showConfirm(
      'تأكيد إعادة توليد مفتاح API',
      '⚠️ تنبيه: توليد مفتاح API جديد سيعطل فوراً المفتاح المستخدم حالياً في الربط الخارجي. هل ترغب بالاستمرار؟',
      () => {
        setShowKey(true);
        setSuccess('✅ تم توليد مفتاح API Keys مشفر وجديد للمطورين!');
        setTimeout(() => setSuccess(null), 3000);
      }
    );
  };

  return (
    <div className="space-y-6 text-right text-xs">
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Developer API Keys */}
      <Card className="border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-indigo-400" />
              <span>مفاتيح الربط البرمجي (API Keys)</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              استخدام الـ API للمزامنة الخارجية وتغذية قواعد البيانات الخارجية.
            </CardDescription>
          </div>
          <Button size="sm" onClick={handleGenerateKey} className="h-8">
            توليد مفتاح جديد
          </Button>
        </CardHeader>
        <CardContent className="p-1.5 pt-2">
          <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-2xl font-mono text-[11px]">
            <span className="text-indigo-300 tracking-wider text-left block flex-1">{apiKeyMasked}</span>
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-1 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              {showKey ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creator Form */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <Plus className="w-4.5 h-4.5 text-indigo-400" />
              <span>إنشاء Webhook جديد</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              إرسال إشعار فوري لسيرفراتك عند حدوث حدث معين.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 p-1">
            <form onSubmit={handleAddWebhook} className="space-y-3">
              <div>
                <label className="block mb-1 text-slate-400 font-bold">رابط الاستلام (Payload URL)</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://api.yourdomain.com/webhook"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-left"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-bold">الحدث المستهدف (Event Trigger)</label>
                <select
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Customer Created">إنشاء العميل (Customer Created)</option>
                  <option value="Customer Updated">تعديل العميل (Customer Updated)</option>
                  <option value="Task Created">إنشاء المهمة (Task Created)</option>
                  <option value="Task Completed">إتمام المهمة (Task Completed)</option>
                  <option value="Appointment Created">إنشاء الموعد (Appointment Created)</option>
                  <option value="Payment Completed">إتمام الدفع (Payment Completed)</option>
                </select>
              </div>

              <Button type="submit" className="w-full h-9 gap-1.5 mt-2">
                <Plus className="w-4 h-4" />
                <span>ربط وتفعيل الـ Webhook</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Webhooks List */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-indigo-400" />
              <span>مستقبلات الأحداث الخارجية Webhooks ({webhooks.length})</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              عناوين الـ URLs المربوطة التي تتلقى إشعارات تشغيلية مشفرة بصيغة JSON.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {webhooks.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
                <div className="space-y-1 text-right flex-1 min-w-0">
                  <span className="font-mono text-indigo-300 block truncate text-left">{item.url}</span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span>الحدث: <strong>{item.event}</strong></span>
                    <span>• استجابة السيرفر: <strong className="text-emerald-400">{item.lastStatus} OK</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 text-[10px]">
                    {item.status}
                  </Badge>
                  <button
                    onClick={() => setWebhooks(webhooks.filter((w) => w.id !== item.id))}
                    className="p-1 text-slate-500 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
