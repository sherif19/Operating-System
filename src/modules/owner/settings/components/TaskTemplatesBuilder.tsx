import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListTodo, Plus, Trash2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { TaskTemplate } from '../types/settings.types';
import { settingsService } from '../services/settings.service';

export function TaskTemplatesBuilder() {
  const [templates, setTemplates] = React.useState<TaskTemplate[]>([]);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [role, setRole] = React.useState('Employee');
  const [department, setDepartment] = React.useState('Execution');
  const [customerStage, setCustomerStage] = React.useState('stage-set');
  const [trigger, setTrigger] = React.useState('Stage Entered');
  const [expectedDuration, setExpectedDuration] = React.useState(12);
  const [maxDuration, setMaxDuration] = React.useState(24);
  const [priority, setPriority] = React.useState<'low' | 'medium' | 'high'>('medium');
  const [requiredApproval, setRequiredApproval] = React.useState(true);
  const [requiredQa, setRequiredQa] = React.useState(true);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTemplates(settingsService.getTaskTemplates());
  }, []);

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTemplate = settingsService.createTaskTemplate({
      title,
      description,
      role,
      department,
      customerStage,
      trigger,
      expectedDurationHours: expectedDuration,
      maxDurationHours: maxDuration,
      priority,
      dependencies: [],
      requiredFiles: [],
      requiredApproval,
      requiredQa,
      slaEnabled: true,
      automationEnabled: true,
      notificationEnabled: true
    });

    setTemplates([...templates, newTemplate]);
    setTitle('');
    setDescription('');
    setSuccess('✅ تم إدراج قالب المهمة الذكي بجدول التشغيل والمشغلات الآلية!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteTemplate = (id: string) => {
    const res = settingsService.deleteTaskTemplate(id);
    if (res) {
      setTemplates(templates.filter((t) => t.id !== id));
      setSuccess('🗑️ تم إلغاء قالب المهمة بنجاح.');
      setTimeout(() => setSuccess(null), 2500);
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
        {/* Template Builder Form */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <Plus className="w-4.5 h-4.5 text-indigo-400" />
              <span>منشئ قوالب المهام — Template Builder</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              إنشاء قواعد توليد المهام التلقائي للموظفين بناءً على أحداث رحلة العميل.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <form onSubmit={handleAddTemplate} className="space-y-3">
              <div>
                <label className="block mb-1 text-slate-400 font-bold">عنوان المهمة</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: مراجعة العقد التشغيلي..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-bold">شرح تفاصيل المهمة</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="خطوات التنفيذ للموظف..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-400">القسم المسؤول</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 text-[11px]"
                  >
                    <option value="Execution">التنفيذ (Execution)</option>
                    <option value="Sales">المبيعات (Sales)</option>
                    <option value="Development">التطوير (Dev)</option>
                    <option value="Support">الدعم (Support)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">الحدث المسبب (Trigger)</label>
                  <select
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 text-[11px]"
                  >
                    <option value="Stage Entered">دخول المرحلة (Stage Entered)</option>
                    <option value="Customer Created">إنشاء العميل (Customer Created)</option>
                    <option value="Domain Purchased">شراء النطاق (Domain)</option>
                    <option value="Task Completed">إتمام مهمة سابقة (Task Done)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">الدور المنفذ</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 text-[11px]"
                  >
                    <option value="Employee">موظف (Employee)</option>
                    <option value="Trainer">مدرب (Trainer)</option>
                    <option value="Manager">مدير (Manager)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">المرحلة المرتبطة</label>
                  <select
                    value={customerStage}
                    onChange={(e) => setCustomerStage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200 text-[11px]"
                  >
                    <option value="stage-reg">Registration</option>
                    <option value="stage-wel">Welcome</option>
                    <option value="stage-set">Setup</option>
                    <option value="stage-exec">Execution</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-400">الوقت المتوقع (ساعات)</label>
                  <input
                    type="number"
                    value={expectedDuration}
                    onChange={(e) => setExpectedDuration(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">الحد الأقصى للتأخر (SLA)</label>
                  <input
                    type="number"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-400 font-bold">مستوى الأهمية (Priority)</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="low">منخفضة (Low)</option>
                  <option value="medium">متوسطة (Medium)</option>
                  <option value="high">مرتفعة (High)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/60">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-400 text-[11px]">يتطلب موافقة المدير لاعتماد المهمة</span>
                  <input
                    type="checkbox"
                    checked={requiredApproval}
                    onChange={(e) => setRequiredApproval(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-400 text-[11px]">يتطلب مراجعة QA قبل الإغلاق</span>
                  <input
                    type="checkbox"
                    checked={requiredQa}
                    onChange={(e) => setRequiredQa(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500"
                  />
                </label>
              </div>

              <Button type="submit" className="w-full h-9 gap-1.5 mt-2">
                <Plus className="w-4 h-4" />
                <span>حفظ القالب وتنشيطه</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Templates Grid */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl max-h-[600px] overflow-y-auto no-scrollbar">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <ListTodo className="w-4.5 h-4.5 text-indigo-400" />
              <span>قوالب المهام التشغيلية المفعلة حالياً ({templates.length})</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              قوالب المهام المعتمدة في النظام والتي يتم إسنادها تلقائياً للموظفين عند تحقق المشغل المختار.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-1">
            {templates.map((temp) => (
              <div key={temp.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5 text-right">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-[13px]">{temp.title}</span>
                    <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/5 text-[10px]">
                      {temp.department}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{temp.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>المشغل: <strong>{temp.trigger}</strong></span>
                    </span>
                    <span>• الزمن المتوقع: <strong>{temp.expectedDurationHours} ساعة</strong></span>
                    <span>• حد الـ SLA الأقصى: <strong>{temp.maxDurationHours} ساعة</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-end">
                  <div className="flex flex-col gap-1 items-end">
                    {temp.requiredApproval && (
                      <span className="text-[9px] text-emerald-400 font-extrabold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>يتطلب اعتماد إداري</span>
                      </span>
                    )}
                    {temp.requiredQa && (
                      <span className="text-[9px] text-indigo-400 font-extrabold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>يتطلب تدقيق جودة QA</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteTemplate(temp.id)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 cursor-pointer"
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
