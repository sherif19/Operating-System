import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckSquare, Sparkles, TrendingUp, FileText } from 'lucide-react';

export interface UIArtifactSchema {
  id: string;
  type: 'kpi_report' | 'task_summary' | 'action_plan';
  title: string;
  summary: string;
  kpis?: { label: string; value: string; change?: string }[];
  items?: { title: string; status: string; detail: string }[];
  actions?: string[];
  generatedAt: string;
}

export function ArtifactRenderer({ schema }: { schema: UIArtifactSchema }) {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl my-3">
      {/* Artifact Banner Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white">{schema.title}</h4>
            <span className="text-[10px] text-slate-400">واجهة تفاعلية تم توليدها بواسطة AI Mentor • {schema.generatedAt}</span>
          </div>
        </div>
        <Badge variant="default" className="text-[10px]">
          Artifact v1.0
        </Badge>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        {schema.summary}
      </p>

      {/* Dynamic KPI Cards if present */}
      {schema.kpis && schema.kpis.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {schema.kpis.map((kpi, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-slate-400">{kpi.label}</span>
              <span className="text-base font-extrabold text-white">{kpi.value}</span>
              {kpi.change && (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {kpi.change}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Task / Action Items if present */}
      {schema.items && schema.items.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>تفاصيل المهام المحللة:</span>
          </h5>
          <div className="space-y-1.5">
            {schema.items.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950/30 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-200">{item.title}</span>
                  <span className="text-[10px] text-slate-400">{item.detail}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Plan recommendations */}
      {schema.actions && schema.actions.length > 0 && (
        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
          <h5 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>الإجراءات الموصى بها:</span>
          </h5>
          <ul className="list-disc list-inside text-xs text-indigo-200 space-y-1">
            {schema.actions.map((act, idx) => (
              <li key={idx}>{act}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
        <Button variant="ghost" size="sm" className="text-[11px] h-7">تحديث</Button>
        <Button variant="primary" size="sm" className="text-[11px] h-7">تصدير التقرير (PDF)</Button>
      </div>
    </div>
  );
}
