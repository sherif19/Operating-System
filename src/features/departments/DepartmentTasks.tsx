import React from 'react';
import { DepartmentOSService } from './services/departments.service';
import { TaskExecutionMetric } from './types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Search } from 'lucide-react';

export function DepartmentTasks() {
  const [metrics, setMetrics] = React.useState<TaskExecutionMetric[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'TABLE' | 'KANBAN'>('TABLE');

  React.useEffect(() => {
    setMetrics(DepartmentOSService.getTaskMetrics());
  }, []);

  const filtered = metrics.filter(
    (m) =>
      m.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.assigneeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px]">
              Task Templates & SLA Tracking — إدارة المهام لاتفاقيات الخدمة
            </Badge>
            <span className="text-[10px] text-slate-400 font-mono">العدد: {metrics.length} مهام معتمدة</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">متابعة المهام وقواعد سرعة التنفيذ (SLA)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            حساب صافي مدة التنفيذ فور قبول المهمة: <code className="text-cyan-300 font-mono text-[10px]">effective_duration = task_completed_at - task_accepted_at</code>
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-850">
          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'TABLE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            جدول القياس
          </button>
          <button
            onClick={() => setViewMode('KANBAN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'KANBAN' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            لوحة كانبان (Kanban)
          </button>
        </div>
      </div>

      {/* Search & Notice Bar */}
      <Card className="p-4 bg-slate-900/90 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم المهمة أو المنفذ..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 text-[10px] text-amber-400 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
          <Zap className="w-3.5 h-3.5" />
          <span>ملاحظة: مدة الانتظار في قائمة المهام قبل القبول مستبعدة نهائياً من تقييم الأداء.</span>
        </div>
      </Card>

      {/* Empty State when no metrics */}
      {filtered.length === 0 ? (
        <Card className="p-12 bg-slate-900/60 border-slate-800 text-center space-y-3 shadow-xl">
          <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Zap className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-sm font-black text-white">لا توجد مهام أو اتفاقيات خدمة مسجلة بالقسم حالياً (0 مهام)</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            سيتم احتساب وتتبع سرعة التنفيذ الصافية فور تكليف الموظفين بالمهام وتأكيد قبولها.
          </p>
        </Card>
      ) : (
        <>
          {/* Table View */}
          {viewMode === 'TABLE' && (
            <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold text-[10px]">
                      <th className="pb-3 pr-2">عنوان المهمة</th>
                      <th className="pb-3">الموظف المسند</th>
                      <th className="pb-3 font-mono">وقت القبول (Accepted)</th>
                      <th className="pb-3 font-mono">وقت الإنجاز (Completed)</th>
                      <th className="pb-3 font-mono">المدة الفعّالة (Effective)</th>
                      <th className="pb-3 font-mono">المدة المستهدفة</th>
                      <th className="pb-3 pl-2">حالة الـ SLA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60">
                    {filtered.map((m) => (
                      <tr key={m.taskId} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3.5 pr-2 font-bold text-white max-w-xs">{m.taskTitle}</td>
                        <td className="py-3.5 text-cyan-300 font-bold">{m.assigneeName}</td>
                        <td className="py-3.5 font-mono text-slate-400 text-[10px]">{m.acceptedAt}</td>
                        <td className="py-3.5 font-mono text-slate-400 text-[10px]">{m.completedAt}</td>
                        <td className="py-3.5 font-mono font-bold text-cyan-400">{m.effectiveDurationMinutes} دقيقة</td>
                        <td className="py-3.5 font-mono text-slate-400">{m.expectedDurationMinutes} دقيقة</td>
                        <td className="py-3.5 pl-2">
                          {m.status === 'EXCELLENT' && <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[9px]">ممتاز ⚡</Badge>}
                          {m.status === 'ON_TIME' && <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 text-[9px]">في الموعد ✅</Badge>}
                          {m.status === 'CRITICAL_DELAY' && <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/40 text-[9px]">تأخير حاد 🚨</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Kanban View */}
          {viewMode === 'KANBAN' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4 bg-slate-900/90 border-slate-800 space-y-3">
                <h3 className="text-xs font-black text-emerald-400 border-b border-slate-800 pb-2">ممتاز وسريع ⚡</h3>
                <div className="space-y-2">
                  {filtered.filter((m) => m.status === 'EXCELLENT').map((m) => (
                    <div key={m.taskId} className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1">
                      <span className="font-bold text-white block">{m.taskTitle}</span>
                      <span className="text-[10px] text-slate-400 block">{m.assigneeName}</span>
                      <span className="text-[9px] font-mono text-cyan-400 block pt-1">مدة التنفيذ: {m.effectiveDurationMinutes} دقيقة</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 bg-slate-900/90 border-slate-800 space-y-3">
                <h3 className="text-xs font-black text-cyan-400 border-b border-slate-800 pb-2">في الموعد ✅</h3>
                <div className="space-y-2">
                  {filtered.filter((m) => m.status === 'ON_TIME').map((m) => (
                    <div key={m.taskId} className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1">
                      <span className="font-bold text-white block">{m.taskTitle}</span>
                      <span className="text-[10px] text-slate-400 block">{m.assigneeName}</span>
                      <span className="text-[9px] font-mono text-cyan-400 block pt-1">مدة التنفيذ: {m.effectiveDurationMinutes} دقيقة</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 bg-slate-900/90 border-slate-800 space-y-3">
                <h3 className="text-xs font-black text-rose-400 border-b border-slate-800 pb-2">تأخير حاد 🚨</h3>
                <div className="space-y-2">
                  {filtered.filter((m) => m.status === 'CRITICAL_DELAY').map((m) => (
                    <div key={m.taskId} className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1">
                      <span className="font-bold text-white block">{m.taskTitle}</span>
                      <span className="text-[10px] text-slate-400 block">{m.assigneeName}</span>
                      <span className="text-[9px] font-mono text-rose-400 block pt-1">مدة التنفيذ: {m.effectiveDurationMinutes} دقيقة</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DepartmentTasks;
