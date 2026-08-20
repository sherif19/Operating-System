import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AiAgentItem {
  id: string;
  name: string;
  role: string;
  model: string;
  prompt: string;
  tokenLimit: number;
  costLimit: number;
  isActive: boolean;
}

export function AiAgentsManager() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [agents, setAgents] = React.useState<AiAgentItem[]>([
    { id: 'ceo', name: 'CEO AI (الرئيس التنفيذي)', role: 'أخذ القرارات والمشورة الإستراتيجية العليا', model: 'gpt-4o', prompt: 'أنت رئيس تنفيذي للشركة. قم بتحليل التقارير التشغيلية والمالية واقتراح التعديلات لتحسين الأداء وتفادي تعثر SLA.', tokenLimit: 100000, costLimit: 5.0, isActive: true },
    { id: 'ops', name: 'Operations AI (وكيل التشغيل)', role: 'توزيع المهام ومراقبة انحراف الأداء اليومي للعملاء', model: 'gpt-4o', prompt: 'أنت مدير عمليات تشغيلي. راقب مهام الموظفين، ونبه المشرفين للمهمات المتأخرة، ونسق الـ SLA.', tokenLimit: 80000, costLimit: 3.0, isActive: true },
    { id: 'finance', name: 'Finance AI (الوكيل المالي)', role: 'تحليل الفواتير والمصروفات والتدفق النقدي', model: 'claude-3.5', prompt: 'أنت مستشار مالي. راقب الفواتير، ونبه لتأخر سداد الدفعات، ونظم معدلات نمو الدخل.', tokenLimit: 50000, costLimit: 2.0, isActive: false }
  ]);
  const [selectedAgent, setSelectedAgent] = React.useState<AiAgentItem | null>(null);

  React.useEffect(() => {
    setSelectedAgent(agents[0]);
  }, [agents]);

  const handleUpdateField = (key: keyof AiAgentItem, val: any) => {
    if (!selectedAgent) return;
    const updated = { ...selectedAgent, [key]: val };
    setSelectedAgent(updated);
    setAgents(agents.map((a) => (a.id === selectedAgent.id ? updated : a)));
  };

  const handleSave = () => {
    setSuccess('✅ تم تحديث ونشر توجيهات وكلاء الذكاء الاصطناعي بنجاح!');
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
        {/* Agents List */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-indigo-400" />
              <span>قائمة وكلاء الـ AI</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تحديد حالة استدعاء وتفويض وكلاء الذكاء الاصطناعي المتخصصين.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-1">
            {agents.map((agent) => {
              const isActive = selectedAgent?.id === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-600/10 border-indigo-500 text-white'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span>{agent.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{agent.role}</span>
                  </div>
                  <Badge variant="outline" className={agent.isActive ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-slate-800 text-slate-500'}>
                    {agent.isActive ? 'نشط' : 'معطل'}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Selected Agent settings */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
          {selectedAgent ? (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
                    <span>توجيه الوكيل: {selectedAgent.name}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">تحديد الموديل وصلاحيات وميزانية استهلاك الوكيل بالدولار.</p>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <span className="text-slate-400">حالة الوكيل التشغيلية</span>
                  <input
                    type="checkbox"
                    checked={selectedAgent.isActive}
                    onChange={(e) => handleUpdateField('isActive', e.target.checked)}
                    className="w-4 h-4 accent-indigo-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">النموذج اللغوي (LLM Model)</label>
                  <select
                    value={selectedAgent.model}
                    onChange={(e) => handleUpdateField('model', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="gpt-4o">GPT-4o (الخيار الموصى به)</option>
                    <option value="claude-3.5">Claude 3.5 Sonnet</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1 text-slate-400">سقف التوكينات اليومي</label>
                    <input
                      type="number"
                      value={selectedAgent.tokenLimit}
                      onChange={(e) => handleUpdateField('tokenLimit', parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-400">سقف التكلفة اليومي ($)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedAgent.costLimit}
                      onChange={(e) => handleUpdateField('costLimit', parseFloat(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1.5 text-slate-400 font-bold">موجه النظام المخصص (System Prompt)</label>
                  <textarea
                    value={selectedAgent.prompt}
                    onChange={(e) => handleUpdateField('prompt', e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 leading-relaxed font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <Button onClick={handleSave} className="px-6 h-9">
                  حفظ وتطبيق توجيهات الوكيل
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">الرجاء اختيار وكيل AI لعرض معايير توجيهه.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
