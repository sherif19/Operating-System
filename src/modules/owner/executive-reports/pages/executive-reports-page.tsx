import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExecutiveReportsApi } from '../api/reports.api';
import { ReportsDB } from '../services/reports-db';
import { KPIOverview, InteractiveReport, DepartmentHealth, CustomerHealthOverview } from '../types/domain.types';
import { Sparkles, Bot, AlertTriangle, Users, DollarSign, ShieldAlert, Clock, ArrowDownToLine, RefreshCw, BarChart2 } from 'lucide-react';

import { useDialogStore } from '@/stores/dialog.store';

export function ExecutiveReportsPage() {
  const { showAlert } = useDialogStore();
  const [overview, setOverview] = React.useState<KPIOverview | null>(null);
  const [selectedPeriod, setSelectedPeriod] = React.useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('weekly');
  const [depts, setDepts] = React.useState<DepartmentHealth[]>([]);
  const [customers, setCustomers] = React.useState<CustomerHealthOverview[]>([]);
  const [activeReport, setActiveReport] = React.useState<InteractiveReport | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [drillDownTasks, setDrillDownTasks] = React.useState<boolean>(false);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    const [stats, repList] = await Promise.all([
      ExecutiveReportsApi.fetchOverview(),
      ExecutiveReportsApi.fetchReports(),
    ]);
    setOverview(stats);
    setDepts(ReportsDB.getDepts());
    setCustomers(ReportsDB.getCustomers());

    // Select latest report for selected period
    const matched = repList.find((r) => r.period === selectedPeriod);
    setActiveReport(matched || repList[0] || null);
    setIsLoading(false);
  }, [selectedPeriod]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerateAIReport = async () => {
    setIsGenerating(true);
    const generated = await ExecutiveReportsApi.generateAIReport(selectedPeriod);
    setActiveReport(generated);
    setIsGenerating(false);
  };

  const handleExportCSV = () => {
    showAlert('تصدير التقرير', '📥 جاري تصدير التقرير التنفيذي بصيغة CSV وحفظه في جهازك...');
  };

  const handleExportPDF = () => {
    showAlert('تصدير التقرير', '📥 جاري حفظ وتحميل التقرير كـ PDF وتجهيزه للطباعة...');
  };

  if (isLoading || !overview) {
    return <div className="p-12 text-center text-xs text-indigo-400">جاري تحميل التقارير والتحليلات...</div>;
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[24px] bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1.5 z-10">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 me-1.5 animate-pulse" />
            غرفة تحليلات الإدارة العليا — Executive Control Center
          </Badge>
          <h1 className="text-2xl font-black text-white">التقارير التنفيذية ومؤشرات الأداء</h1>
          <p className="text-xs text-slate-400">
            متابعة صحة الشركة التشغيلية والمالية، ومراجعة أداء الأقسام وتوليد تقارير أداء ذكية فورية.
          </p>
        </div>

        <div className="flex items-center gap-2 z-10">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 text-[10px] gap-1.5 border-slate-800 bg-slate-950/40 text-slate-300">
            <ArrowDownToLine className="w-4 h-4" />
            <span>تصدير CSV</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="h-9 text-[10px] gap-1.5 border-slate-800 bg-slate-950/40 text-slate-300">
            <ArrowDownToLine className="w-4 h-4" />
            <span>تحميل PDF</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Company overall health card */}
        <Card className="p-4 bg-slate-950/60 border-slate-850 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold">مؤشر صحة الشركة العام</span>
            <h3 className="text-2xl font-black text-white">{overview.companyHealth}%</h3>
            <span className="text-[9px] text-emerald-400 font-bold">▲ مستقر وإيجابي</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <BarChart2 className="w-5 h-5" />
          </div>
        </Card>

        {/* Financial health card */}
        <Card className="p-4 bg-slate-950/60 border-slate-850 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold">الوضع المالي (الصافي)</span>
            <h3 className="text-2xl font-black text-emerald-400">{(overview.netIncome).toLocaleString()} ج</h3>
            <span className="text-[9px] text-slate-500">إيرادات: {(overview.revenue).toLocaleString()} ج</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </Card>

        {/* Operations health card */}
        <Card
          onClick={() => setDrillDownTasks(true)}
          className="p-4 bg-slate-950/60 border-slate-850 flex items-center justify-between cursor-pointer hover:border-indigo-500/30 transition-all"
        >
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold">العمليات والالتزام (SLA)</span>
            <h3 className="text-2xl font-black text-white">{overview.slaComplianceRate}%</h3>
            <span className="text-[9px] text-rose-400 font-bold flex items-center gap-0.5">
              <AlertTriangle className="w-3 h-3" />
              <span>{overview.delayedTasks} مهام متأخرة (اضغط للتفاصيل)</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        {/* Customers health card */}
        <Card className="p-4 bg-slate-950/60 border-slate-850 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold">العملاء ومعدل التقدم</span>
            <h3 className="text-2xl font-black text-white">{overview.activeCustomers} عملاء</h3>
            <span className="text-[9px] text-amber-400 font-bold">⚠️ {overview.atRiskCustomers} عملاء بحاجة لتدخل</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Drill-down Task list dialog simulator */}
      {drillDownTasks && (
        <Card className="p-5 border-rose-500/20 bg-rose-950/5 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <h4 className="text-xs font-black text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4.5 h-4.5" />
              <span>المهام المتأخرة والـ SLA المتجاوزة ({overview.delayedTasks})</span>
            </h4>
            <button onClick={() => setDrillDownTasks(false)} className="text-[10px] text-slate-400 hover:text-white cursor-pointer font-bold">إغلاق التتبع ×</button>
          </div>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between text-[11px] text-slate-300">
              <span>ملء استبيان معلومات الشركة — صالون سارة حسام</span>
              <span className="text-rose-400 font-mono">متجاوز بـ 4 أيام</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between text-[11px] text-slate-300">
              <span>تأكيد حسابات السوشيال ميديا — Mona Beauty</span>
              <span className="text-rose-400 font-mono">متجاوز بـ 2 أيام</span>
            </div>
          </div>
        </Card>
      )}

      {/* Reports selector tabs */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Interactive AI report block */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-slate-950/40 p-1 rounded-xl border border-slate-850">
              {[
                { id: 'daily', label: 'يومي' },
                { id: 'weekly', label: 'أسبوعي' },
                { id: 'monthly', label: 'شهري' },
                { id: 'quarterly', label: 'ربع سنوي' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedPeriod(btn.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    selectedPeriod === btn.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateAIReport}
              disabled={isGenerating}
              className="h-9 text-[10px] gap-1 bg-indigo-600 font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>توليد تقرير AI محدث</span>
            </Button>
          </div>

          {activeReport ? (
            <Card className="p-6 bg-slate-950/50 border-slate-850 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3 justify-between">
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-white">{activeReport.title}</h3>
                  <span className="text-[9px] text-slate-500">تم الإنشاء في: {activeReport.createdAt}</span>
                </div>
                <Badge variant="outline" className="text-[9px] border-[#00a884]/20 text-[#00a884] uppercase">
                  تقرير AI
                </Badge>
              </div>

              {/* Summary text */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-850 text-xs text-slate-300 leading-relaxed font-sans">
                {activeReport.summary}
              </div>

              {/* Plan vs Actual table */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">جدول مقارنة الأهداف والفعلي (Plan vs Actual)</span>
                <div className="overflow-x-auto rounded-xl border border-slate-900">
                  <table className="w-full text-right text-[11px]">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 font-bold border-b border-slate-950">
                        <th className="p-3">المؤشر الرئيسي</th>
                        <th className="p-3 text-center">المستهدف</th>
                        <th className="p-3 text-center">الفعلي</th>
                        <th className="p-3 text-center">الانحراف / الفرق</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60 bg-slate-950/40">
                      {activeReport.planVsActual.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/20 text-slate-300">
                          <td className="p-3 font-bold">{item.indicator}</td>
                          <td className="p-3 text-center font-mono">{item.planned.toLocaleString()}</td>
                          <td className="p-3 text-center font-mono">{item.actual.toLocaleString()}</td>
                          <td className="p-3 text-center font-mono font-extrabold text-emerald-400">{item.variance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risks & Attention warnings */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">المخاطر والنقاط الحرجة المرصودة</span>
                <div className="space-y-2">
                  {activeReport.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 text-[11px] leading-relaxed ${
                        risk.severity === 'critical'
                          ? 'bg-rose-950/10 border-rose-500/20 text-rose-300'
                          : 'bg-amber-950/10 border-amber-500/20 text-amber-300'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-extrabold block mb-0.5">[{risk.source}]</span>
                        <span>{risk.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">الإجراءات والقرارات المقترحة</span>
                <div className="space-y-1.5">
                  {activeReport.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-indigo-300 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-dashed border-slate-850">
              لا توجد تقارير AI مولدة لهذه الفترة الزمنية بعد. اضغط على توليد تقرير AI لتسوية القوائم.
            </div>
          )}
        </div>

        {/* Health sidebars (Department & Customer lists) */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Department health panel */}
          <Card className="p-4 bg-slate-950/60 border-slate-850 space-y-4">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5 border-b border-slate-850 pb-2.5">
              <Bot className="w-4.5 h-4.5 text-indigo-400" />
              <span>مؤشرات صحة الأقسام</span>
            </h4>
            <div className="space-y-2">
              {depts.map((d) => (
                <div key={d.id} className="p-3 rounded-xl bg-slate-900 border border-slate-850 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">{d.name}</span>
                    <Badge className={`text-[8px] ${
                      d.status === 'healthy' ? 'bg-emerald-600/10 text-emerald-400' : 'bg-amber-600/10 text-amber-400'
                    }`}>
                      {d.healthScore}% صحة
                    </Badge>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>مهام معلقة: {d.openTasks}</span>
                    <span>سرعة التسليم: {d.avgDurationMinutes} د</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Customer health reasons logs panel */}
          <Card className="p-4 bg-slate-950/60 border-slate-850 space-y-4">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5 border-b border-slate-850 pb-2.5">
              <Users className="w-4.5 h-4.5 text-cyan-400" />
              <span>تتبع تعثر وصحة العملاء</span>
            </h4>
            <div className="space-y-2">
              {customers.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-900 border border-slate-850 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">{c.name}</span>
                    <Badge className={`text-[8px] ${
                      c.healthStatus === 'healthy' ? 'bg-emerald-600/10 text-emerald-400' : 'bg-rose-600/10 text-rose-400'
                    }`}>
                      {c.healthStatus === 'healthy' ? 'نشط' : 'متعثر'}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                    سبب التقييم: {c.reason}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default ExecutiveReportsPage;
