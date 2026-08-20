import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EmployeesApi } from '../../api/employees.api';
import { EmployeePerformanceApi } from '../../api/performance.api';
import { EmployeeProfile as EmployeeProfileType, EmployeePerformance } from '../../types/domain.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, TrendingUp, CheckSquare, Zap } from 'lucide-react';

export function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = React.useState<EmployeeProfileType | null>(null);
  const [performance, setPerformance] = React.useState<EmployeePerformance | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    if (!id) return;
    const emp = await EmployeesApi.fetchById(id);
    setEmployee(emp);
    if (emp) {
      const perf = await EmployeePerformanceApi.fetchByEmployee(emp.id);
      setPerformance(perf);
    }
    setIsLoading(false);
  }, [id]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (status: EmployeeProfileType['status']) => {
    if (!employee) return;
    const updated = await EmployeesApi.updateStatus(employee.id, status);
    setEmployee(updated);
  };

  if (isLoading) {
    return <div className="p-12 text-center text-xs text-slate-400">جاري تحميل ملف الموظف...</div>;
  }

  if (!employee) {
    return <div className="p-12 text-center text-xs text-slate-400">الموظف غير موجود.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 font-bold">
          <span className="cursor-pointer hover:text-white" onClick={() => navigate('/owner/employees')}>الموظفون</span>
          <span>/</span>
          <span className="text-white font-extrabold">{employee.name}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/owner/employees')}
          className="gap-2 border-blue-500/20 bg-slate-950/40 text-[10px]"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>العودة لدليل الموظفين</span>
        </Button>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-[24px] bg-gradient-to-br from-[#10193E] to-[#0A0F24]/85 border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_65%)] pointer-events-none" />

        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border-2 border-cyan-500/35 text-white font-black flex items-center justify-center text-xl shadow-lg shrink-0">
            {employee.name[0]}
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{employee.name}</span>
              <Badge variant="default" className="bg-slate-900 border border-slate-800 text-[10px] text-cyan-400 font-extrabold uppercase">
                {employee.role}
              </Badge>
            </h1>
            <span className="text-xs text-slate-400 mt-1">
              القسم: <span className="text-white font-semibold">{employee.departmentId}</span> • تاريخ الانضمام: {employee.joinedAt}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 z-10 bg-slate-950/50 p-4 rounded-xl border border-slate-900">
          <div className="flex flex-col gap-1">
            <span>القدرة الاستيعابية</span>
            <span className="font-extrabold text-cyan-400 text-sm">{employee.workloadScore}%</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex flex-col gap-1">
            <span>المهام النشطة</span>
            <span className="font-extrabold text-white text-sm">{employee.activeTasksCount} مهام</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex flex-col gap-1">
            <span>حالة الدوام الحالية</span>
            <span className="font-extrabold text-indigo-400 text-sm">{employee.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Performance summaries & HR controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* HR Status Controls */}
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-black text-white border-b border-slate-800 pb-3 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>إجراءات الدوام للمدير</span>
            </h3>
            <p className="text-[10px] text-slate-400">تحديث حالة تواجد الموظف آلياً في النظام لاستقبال المهام:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'active', label: '🟢 نشط' },
                { id: 'away', label: '🟡 خارج العمل' },
                { id: 'on_leave', label: '🔴 إجازة' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleStatusChange(s.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border ${
                    employee.status === s.id
                      ? 'bg-slate-900 text-white border-blue-500/40'
                      : 'bg-slate-950/40 text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Performance KPIs */}
          <Card className="p-5 bg-gradient-to-br from-slate-950 to-[#10193E]/20 border-cyan-500/10">
            <h3 className="text-xs font-black text-white border-b border-slate-850 pb-3 mb-4 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>معدلات الفروق الزمنية للإنتاج</span>
            </h3>

            {performance ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-850">
                  <span className="text-slate-400">إجمالي المهام المكتملة</span>
                  <span className="font-extrabold text-white text-sm">{performance.totalCompletedTasks} مهمة</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-850">
                  <span className="text-slate-400">متوسط الانحراف الزمني (Variance)</span>
                  <span className={`font-extrabold text-sm ${performance.averageVarianceMinutes <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {performance.averageVarianceMinutes <= 0 ? '' : '+'}{performance.averageVarianceMinutes} دقيقة
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-850">
                  <span className="text-slate-400">نسبة الالتزام بالـ SLA</span>
                  <span className="font-extrabold text-cyan-400 text-sm">{performance.completionRate}%</span>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">لا توجد بيانات أداء مسجلة حتى الآن.</div>
            )}
          </Card>
        </div>

        {/* Right Side: Speed analysis and Task logs history */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-5">
            <h3 className="text-xs font-black text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <span>سجل الأداء والمقارنة الزمنية التفصيلية</span>
            </h3>

            <div className="space-y-3">
              {performance && performance.history && performance.history.length > 0 ? (
                performance.history.map((hist, idx) => {
                  const isSlower = hist.varianceMinutes > 0;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-extrabold text-white">{hist.title}</span>
                        <span className="text-[10px] text-slate-500">تاريخ الإنجاز: {hist.completedAt}</span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] font-mono shrink-0 bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                        <div className="flex flex-col text-slate-400">
                          <span>المدة الفعلية</span>
                          <span className="text-white mt-0.5">{hist.actualDurationMinutes} د</span>
                        </div>
                        <div className="w-px h-6 bg-slate-800" />
                        <div className="flex flex-col text-slate-400">
                          <span>المدة المتوقعة</span>
                          <span className="text-slate-400 mt-0.5">{hist.expectedDurationMinutes} د</span>
                        </div>
                        <div className="w-px h-6 bg-slate-800" />
                        <div className="flex flex-col text-slate-400">
                          <span>الانحراف</span>
                          <span className={`font-bold mt-0.5 ${isSlower ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {isSlower ? `+${hist.varianceMinutes}` : hist.varianceMinutes} د
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-850 rounded-xl">
                  لا توجد مهام منجزة في سجل الأداء التاريخي.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default EmployeeProfilePage;
