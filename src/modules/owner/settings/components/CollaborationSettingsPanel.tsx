import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquareText, CheckCircle2, Sparkles } from 'lucide-react';

export function CollaborationSettingsPanel() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [messageEdit, setMessageEdit] = React.useState(true);
  const [messageDelete, setMessageDelete] = React.useState(true);
  const [convertToTask, setConvertToTask] = React.useState(true);
  const [convertToSop, setConvertToSop] = React.useState(true);
  const [aiSummaries, setAiSummaries] = React.useState(true);

  const handleSave = () => {
    setSuccess('✅ تم تطبيق إعدادات وخصائص مركز التعاون بنجاح!');
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
            <MessageSquareText className="w-5 h-5 text-indigo-400" />
            <span>إعدادات مركز التعاون والمحادثات — Collaboration & Chat Settings</span>
          </CardTitle>
          <CardDescription>
            تخصيص سياسات المراسلة، وتفعيل المشغلات الذكية لتحويل محادثات الموظفين إلى مهام أو أدلة تشغيل SOPs.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left side: Rules */}
            <div className="space-y-3">
              <span className="block text-slate-400 font-bold mb-1">سياسات المراسلة العامة (Chat Policies)</span>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">السماح للموظفين بتعديل الرسائل بعد إرسالها</span>
                <input
                  type="checkbox"
                  checked={messageEdit}
                  onChange={(e) => setMessageEdit(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">السماح للموظفين بحذف رسائلهم المرسلة</span>
                <input
                  type="checkbox"
                  checked={messageDelete}
                  onChange={(e) => setMessageDelete(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500"
                />
              </label>
            </div>

            {/* Right side: Conversions & AI */}
            <div className="space-y-3">
              <span className="block text-slate-400 font-bold mb-1">المحولات الذكية والذكاء الاصطناعي (AI integrations)</span>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">تفعيل خاصية تحويل الرسالة إلى بطاقة مهمة (Convert to Task)</span>
                <input
                  type="checkbox"
                  checked={convertToTask}
                  onChange={(e) => setConvertToTask(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">تفعيل خاصية تحويل الرسالة إلى SOP (Convert to SOP)</span>
                <input
                  type="checkbox"
                  checked={convertToSop}
                  onChange={(e) => setConvertToSop(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">توليد ملخصات الذكاء الاصطناعي للمحادثات المتأخرة (AI Summaries)</span>
                <input
                  type="checkbox"
                  checked={aiSummaries}
                  onChange={(e) => setAiSummaries(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500"
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">
              💡 يؤثر تغيير الصلاحيات في واجهات تطبيق الشات العام والخاص بالمؤسسة فوراً.
            </span>
            <Button onClick={handleSave} className="gap-2 h-10 px-6">
              <Sparkles className="w-4 h-4" />
              <span>تطبيق إعدادات مركز التعاون</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
