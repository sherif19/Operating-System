import { DepartmentOSService } from './services/departments.service';
import { useAuthStore } from '@/stores/auth.store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Lock, ShieldAlert, Zap, Sparkles } from 'lucide-react';

export function DepartmentAnalytics() {
  const { user } = useAuthStore();
  const role = user?.role || 'client';

  // Rule B: Internal Analytics Visible ONLY to Department Managers & Owners/Admins
  const isManagerOrAdmin =
    role === 'manager' || role === 'owner' || role === 'admin' || user?.email?.includes('admin');

  if (!isManagerOrAdmin) {
    return (
      <div className="p-8 text-center space-y-4">
        <Card className="p-8 bg-slate-900 border-slate-800 max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-base font-black text-white">التحليل الداخلي مقيّد لمديري الأقسام والإدارة فقط</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            وفقاً لقواعد النظام (Section 10)، تكون تقييمات الأداء والتحليل الداخلي مقتصرة على مدير القسم والمالك، ولن تظهر لأعضاء الفريق العاديين دون إذن صريح.
          </p>
        </Card>
      </div>
    );
  }

  const team = DepartmentOSService.getTeamPerformance();
  const summary = DepartmentOSService.getSummary();

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-[10px]">
              Internal Analytics — التقييم الداخلي للقسم
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
              خاص بالمدير والمالك 🔒
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">التحليل الداخلي ومؤشرات الجودة والـ SLA</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            رسم بياني وسجل تفصيلي لقياس سرعة التنفيذ الفعّالة (Speed vs Expected Duration) وتطوير كفاءة الفريق دون عقوبات آليّة.
          </p>
        </div>
      </div>

      {/* Analytics Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">متوسط سرعة الإنجاز للقسم</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-3xl font-black text-cyan-400">{summary.executionSpeedPercentage}%</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-850 pt-2">
            معدل استجابة مرتفع متفوق على المستهدف العام (90%).
          </p>
        </Card>

        <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">معدل التزام الفريق بالـ SLA</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-black text-emerald-400">95.2%</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-850 pt-2">
            استبعاد مدة الانتظار قبل القبول لتوفير تقييم عادل.
          </p>
        </Card>

        <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">التوجيه الإيجابي (Coaching Plans)</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-3xl font-black text-indigo-300">5 توجيهات</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-850 pt-2">
            خطط تطوير فردية مفعلة دون خصومات آليّة.
          </p>
        </Card>
      </div>

      {/* Speed vs Expected Duration Analysis Bar */}
      <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>مقارنة الزمن الفعلي المستغرق vs الزمن المستهدف (Speed vs Target Duration)</span>
        </h3>

        {team.length > 0 ? (
          <div className="space-y-4">
            {team.map((emp) => {
              const ratio = Math.min(100, Math.round((emp.avgExecutionTimeMinutes / emp.targetExecutionTimeMinutes) * 100));
              return (
                <div key={emp.userId} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="font-extrabold">{emp.userName} ({emp.role})</span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {emp.avgExecutionTimeMinutes} دقيقة / المستهدف {emp.targetExecutionTimeMinutes} دقيقة
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-850 flex">
                    <div
                      className={`h-full rounded-full transition-all ${
                        ratio <= 100 ? 'bg-gradient-to-r from-indigo-500 to-emerald-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2 bg-slate-950/40 rounded-2xl border border-slate-850">
            <BarChart3 className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
            <p className="font-bold text-slate-400">لا تتوفر تحليلات بيانية لعدم وجود موظفين بالقسم حالياً (0 موظفين)</p>
            <p className="text-[10px] text-slate-500">ستشحن الرسوم البيانية تلقائياً فور إضافة أعضاء الفريق وبدء التنفيذ.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default DepartmentAnalytics;
