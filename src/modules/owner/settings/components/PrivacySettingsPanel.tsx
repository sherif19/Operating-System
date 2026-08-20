import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle2, Database } from 'lucide-react';
import { settingsService } from '../services/settings.service';

import { useDialogStore } from '@/stores/dialog.store';

export function PrivacySettingsPanel() {
  const { showConfirm, showAlert } = useDialogStore();
  const [success, setSuccess] = React.useState<string | null>(null);
  const [custRetention, setCustRetention] = React.useState(5);
  const [chatRetention, setChatRetention] = React.useState(3);
  const [auditRetention, setAuditRetention] = React.useState(7);
  const [fileRetention, setFileRetention] = React.useState(5);

  const handleSave = async () => {
    const res = await settingsService.saveSettings({
      privacy_cust_retention_years: custRetention,
      privacy_chat_retention_years: chatRetention,
      privacy_audit_retention_years: auditRetention,
      privacy_file_retention_years: fileRetention
    }, 'تعديل فترات الاحتفاظ بالبيانات والخصوصية');

    if (res.success) {
      setSuccess('✅ تم تطبيق سياسات الاحتفاظ وأرشفة البيانات بنجاح!');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleAnonymize = () => {
    showConfirm(
      'تأكيد تفعيل إخفاء هوية العملاء',
      '🚨 هل أنت متأكد من تفعيل خوارزمية إخفاء الهوية للعملاء غير النشطين منذ أكثر من سنة؟ سيتم محو أرقام الهواتف والأسماء واستبدالها بنصوص مشفرة.',
      () => {
        setSuccess('✅ تم بنجاح تشغيل عملية إخفاء الهوية وجدولة الأرشفة للعملاء الخاملين!');
        setTimeout(() => setSuccess(null), 3500);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retention Form */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl space-y-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
              <span>فترات وأجل الاحتفاظ بالبيانات — Data Retention Policies</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تحديد المدد الزمنية (بالسنوات) لحفظ سجلات العملاء والملفات والدردشة وسجلات الأمان قبل الأرشفة التلقائية.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-400 font-bold font-sans">فترة حفظ ملفات وبيانات العملاء (سنة)</label>
                <input
                  type="number"
                  value={custRetention}
                  onChange={(e) => setCustRetention(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-bold font-sans">فترة حفظ سجل المحادثات والدردشة (سنة)</label>
                <input
                  type="number"
                  value={chatRetention}
                  onChange={(e) => setChatRetention(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-bold font-sans">فترة حفظ ملفات التدقيق والأمان (سنة)</label>
                <input
                  type="number"
                  value={auditRetention}
                  onChange={(e) => setAuditRetention(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-bold font-sans">فترة حفظ المرفقات والملفات المرفوعة (سنة)</label>
                <input
                  type="number"
                  value={fileRetention}
                  onChange={(e) => setFileRetention(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={handleSave} className="px-6 h-10">
                تطبيق سياسات الاحتفاظ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Compliance and Anonymization */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-indigo-400" />
              <span>مكتب الامتثال والخصوصية — GDPR & Compliance Office</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تطبيق لوائح حماية الخصوصية ومحو السجلات للعملاء المنسحبين والخاملين.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
              <h4 className="font-extrabold text-white mb-1">تجهيز ملفات تصدير البيانات</h4>
              <p className="text-[10px] text-slate-500">تحميل ملفات بصيغة JSON تحتوي على كافة سجلات وملفات العميل بناءً على رغبته.</p>
              <Button variant="outline" size="sm" onClick={() => showAlert('تصدير بيانات العملاء', '📥 تم البدء بتجميع ملف البيانات التشغيلية للعملاء وتصديره بصيغة CSV!')} className="w-full h-8 mt-2.5">
                تصدير كافة بيانات العملاء
              </Button>
            </div>

            <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
              <h4 className="font-extrabold text-white mb-1">إخفاء هوية العملاء الخاملين</h4>
              <p className="text-[10px] text-slate-500">محو البيانات الشخصية للعملاء المنقطعين منذ أكثر من سنة والاحتفاظ بالبيانات التشغيلية مجهولة الهوية.</p>
              <Button type="button" onClick={handleAnonymize} className="bg-rose-950 hover:bg-rose-900 border border-rose-500/30 text-rose-400 w-full h-8 mt-2.5">
                تفعيل إخفاء هوية العملاء (Anonymize)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
