import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Trash2, CheckCircle2, Shield } from 'lucide-react';

interface CmsItem {
  id: string;
  title: string;
  type: string; // Article, Policy, Video, FAQ, Jo Script, Customer Guide
  status: 'Draft' | 'Review' | 'Published' | 'Scheduled' | 'Archived';
  stageRestriction: string;
  roleRestriction: string;
  approvalRequired: boolean;
}

export function CmsSettingsPanel() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [contentList, setContentList] = React.useState<CmsItem[]>([
    { id: 'cms-1', title: 'دليل التهيئة الأولية للمشتركين', type: 'Customer Guide', status: 'Published', stageRestriction: 'stage-wel', roleRestriction: 'Customer', approvalRequired: true },
    { id: 'cms-2', title: 'سياسة الأمان وحماية البيانات الشخصية', type: 'Policy', status: 'Published', stageRestriction: 'stage-reg', roleRestriction: 'everyone', approvalRequired: false },
    { id: 'cms-3', title: 'فيديو شرح استخدام واجهة التشغيل للوكلاء', type: 'Video', status: 'Review', stageRestriction: 'stage-set', roleRestriction: 'Employee', approvalRequired: true }
  ]);

  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('Article');
  const [status, setStatus] = React.useState<'Draft' | 'Review' | 'Published'>('Draft');
  const [stage, setStage] = React.useState('stage-wel');
  const [role, setRole] = React.useState('Customer');
  const [approval, setApproval] = React.useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newItem: CmsItem = {
      id: `cms-${Date.now()}`,
      title,
      type,
      status,
      stageRestriction: stage,
      roleRestriction: role,
      approvalRequired: approval
    };

    setContentList([...contentList, newItem]);
    setTitle('');
    setSuccess('✅ تم إدراج محتوى الـ CMS الجديد بنجاح!');
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creator Form */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-indigo-400" />
              <span>إدراج محتوى CMS جديد</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تحديد قيود العرض والاعتماد للمستندات والوسائط التعليمية.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block mb-1 text-slate-400 font-bold">عنوان المحتوى</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: دليل استخدام لوحة التحكم..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-400">نوع المحتوى</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 text-[11px]"
                  >
                    <option value="Article">مقالة (Article)</option>
                    <option value="Policy">سياسة (Policy)</option>
                    <option value="Video">فيديو (Video)</option>
                    <option value="FAQ">أسئلة شائعة (FAQ)</option>
                    <option value="Customer Guide">دليل عميل</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">حالة النشر</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 text-[11px]"
                  >
                    <option value="Draft">مسودة (Draft)</option>
                    <option value="Review">مراجعة (Review)</option>
                    <option value="Published">منشور (Published)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-400">قيد المرحلة</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 text-[11px]"
                  >
                    <option value="stage-reg">Registration</option>
                    <option value="stage-wel">Welcome</option>
                    <option value="stage-set">Setup</option>
                    <option value="stage-exec">Execution</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">صلاحية الدور</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 text-[11px]"
                  >
                    <option value="everyone">الجميع (Everyone)</option>
                    <option value="Customer">العملاء فقط</option>
                    <option value="Employee">الموظفين فقط</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-800/60">
                <span className="text-slate-400 text-[11px]">يتطلب اعتماد إداري قبل النشر</span>
                <input
                  type="checkbox"
                  checked={approval}
                  onChange={(e) => setApproval(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500"
                />
              </label>

              <Button type="submit" className="w-full h-9 gap-1.5 mt-2">
                <Plus className="w-4 h-4" />
                <span>إضافة المحتوى</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* CMS items list */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-indigo-400" />
              <span>مستندات ومحتويات الـ CMS المفعلة ({contentList.length})</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              قائمة المحتويات المعروضة ببوابة العملاء ومستندات الرحلة المخصصة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {contentList.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-[13px]">{item.title}</span>
                    <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/5 text-[10px]">
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-slate-500">
                    <span>قيد المرحلة: <strong>{item.stageRestriction}</strong></span>
                    <span>• الدور المسموح: <strong>{item.roleRestriction}</strong></span>
                    {item.approvalRequired && (
                      <span className="text-amber-400 font-extrabold flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" />
                        <span>يتطلب مراجعة QA</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={item.status === 'Published' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-slate-800 text-slate-500'}>
                    {item.status}
                  </Badge>
                  <button
                    onClick={() => setContentList(contentList.filter((c) => c.id !== item.id))}
                    className="p-1 text-slate-500 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
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
