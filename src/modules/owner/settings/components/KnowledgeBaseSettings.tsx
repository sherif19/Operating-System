import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export function KnowledgeBaseSettings() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [autoExtract, setAutoExtract] = React.useState(true);
  const [approvalReq, setApprovalReq] = React.useState(true);
  const [aiAccess, setAiAccess] = React.useState(true);
  const [embeddingModel, setEmbeddingModel] = React.useState('text-embedding-3-small');

  const handleSave = () => {
    setSuccess('✅ تم حفظ إعدادات وقواعد قاعدة المعرفة بنجاح!');
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Auto extraction configuration */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl space-y-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
              <span>الاستخراج التلقائي والذكاء الاصطناعي</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              ربط الـ AI بقاعدة المعرفة وقنوات المحادثة المكتوبة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-1">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
              <span className="text-slate-300">الاستخراج التلقائي لمسودات SOP من الشات</span>
              <input
                type="checkbox"
                checked={autoExtract}
                onChange={(e) => setAutoExtract(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
              <span className="text-slate-300">السماح للـ AI بقراءة واستخدام قاعدة المعرفة</span>
              <input
                type="checkbox"
                checked={aiAccess}
                onChange={(e) => setAiAccess(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
              <span className="text-slate-300">طلب موافقة المدير قبل نشر الـ SOP المستخرج</span>
              <input
                type="checkbox"
                checked={approvalReq}
                onChange={(e) => setApprovalReq(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
            </label>
          </CardContent>
        </Card>

        {/* Embedding & Types card */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl flex flex-col justify-between">
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>أنواع وقواعد المعرفة — Knowledge Base Engine</span>
            </CardTitle>
            <CardDescription>
              توزيع صلاحيات الاستعلام والفهرسة لقواعد العمل والمستندات التعليمية.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-center">
            {/* Knowledge types */}
            <div className="space-y-2 text-right">
              <span className="block text-slate-400 font-bold mb-1.5">أنواع المعرفة المعتمدة بالفهرس</span>
              <div className="flex flex-wrap gap-2">
                {['Articles (مقالات)', 'SOPs (خطوات تشغيل)', 'Videos (شروح مرئية)', 'Files (ملفات مرجعية)', 'Decisions (قرارات إدارية)', 'Conversation Knowledge (معرفة الشات)'].map((t, idx) => (
                  <Badge key={idx} variant="outline" className="border-slate-800 text-slate-300 text-[10px] px-2.5 py-1">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Embedding model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-400">نموذج التضمين وفهرسة النصوص (Embeddings Model)</label>
                <select
                  value={embeddingModel}
                  onChange={(e) => setEmbeddingModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="text-embedding-3-small">OpenAI Embeddings v3 (Small)</option>
                  <option value="text-embedding-3-large">OpenAI Embeddings v3 (Large)</option>
                  <option value="cohere-multilingual">Cohere Multilingual Embeddings</option>
                </select>
              </div>

              <div className="flex items-end justify-end">
                <Button onClick={handleSave} className="gap-2 h-10 px-6">
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>تطبيق إعدادات قاعدة المعرفة</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
