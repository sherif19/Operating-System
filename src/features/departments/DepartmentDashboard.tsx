import { DepartmentOSService } from './services/departments.service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  Zap,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  PlayCircle,
  Inbox
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function DepartmentDashboard() {
  const navigate = useNavigate();
  const summary = DepartmentOSService.getSummary();
  const deliverables = DepartmentOSService.getDeliverables();
  const announcements = DepartmentOSService.getAnnouncements();
  const taskMetrics = DepartmentOSService.getTaskMetrics();
  const sops = DepartmentOSService.getSOPs();

  return (
    <div className="space-y-6 text-right">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-black px-3 py-1">
              <Building2 className="w-3.5 h-3.5 me-1.5" />
              Department OS — لوحة قيادة القسم
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
              مؤشر الصحة: {summary.overallHealthScore}% ممتاز
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-white">{summary.name}</h1>
          <p className="text-xs text-slate-400">
            المدير المسؤول: <strong className="text-cyan-300">{summary.managerName}</strong> | متابعة سرعة التنفيذ، جودة المخرجات، وأداء فريق العمل بالوقت الفعلي.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 z-10">
          <Button
            onClick={() => navigate('/manager/department/ai-coach')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>استشارة مستشار AI للقسم</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Execution Speed */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="p-4 bg-slate-900/90 border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">مؤشر سرعة التنفيذ الصافي</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-white">{summary.executionSpeedPercentage}%</h3>
              <span className="text-[10px] text-emerald-400 flex items-center font-bold">
                <TrendingUp className="w-3 h-3 me-0.5" /> 0%
              </span>
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed border-t border-slate-850 pt-1.5">
              يحسب صافي زمن التنفيذ فور القبول (task_accepted_at) ولا يحسب مدة الانتظار.
            </p>
          </Card>
        </motion.div>

        {/* KPI 2: Active Headcount */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-4 bg-slate-900/90 border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">أفراد فريق العمل النشطون</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-white">{summary.activeEmployeesCount} موظف</h3>
              <span className="text-[10px] text-indigo-400 font-bold">0 متواجدون</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed border-t border-slate-850 pt-1.5">
              موزعون على المهام المفتوحة والوردانيات المحددة للقسم.
            </p>
          </Card>
        </motion.div>

        {/* KPI 3: Open & Completed Tasks */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="p-4 bg-slate-900/90 border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">إنجاز المهام هذا الأسبوع</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-white">{summary.completedTasksThisWeek}</h3>
              <span className="text-[10px] text-amber-400 font-bold">({summary.openTasksCount} قيد التنفيذ)</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed border-t border-slate-850 pt-1.5">
              معدل استجابة مرتفع مع الالتزام باتفاقيات الخدمة SLA.
            </p>
          </Card>
        </motion.div>

        {/* KPI 4: Active Clients */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-4 bg-slate-900/90 border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">العملاء النشطون بالقسم</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-white">{summary.activeClientsCount} عميل</h3>
              <span className="text-[10px] text-purple-400 font-bold">في مراحل تنفيذ مختلفة</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed border-t border-slate-850 pt-1.5">
              توفير متابعة تشغيلية مباشرة ومخرجات بجودة عالية.
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid: Execution Metrics & Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Task Execution Metrics & Speed SLA */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-black text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>قياس سرعة التنفيذ الحقيقية (Effective Execution Speed SLA)</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  تُقاس الفترة الفعّالة فور القبول: <code className="text-cyan-300 font-mono text-[10px]">effective_duration = task_completed_at - task_accepted_at</code>
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/manager/department/tasks')}
                className="text-[10px] text-indigo-400 hover:bg-indigo-500/10"
              >
                عرض كل المهام
                <ArrowUpRight className="w-3.5 h-3.5 ms-1" />
              </Button>
            </div>

            {taskMetrics.length > 0 ? (
              <div className="space-y-3">
                {taskMetrics.map((metric) => (
                  <div
                    key={metric.taskId}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="font-extrabold text-slate-200 block">{metric.taskTitle}</span>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span>المسؤول: <strong className="text-slate-300">{metric.assigneeName}</strong></span>
                        <span className="font-mono text-slate-500">قبول: {metric.acceptedAt.split(' ')[1]}</span>
                        <span className="font-mono text-slate-500">إنجاز: {metric.completedAt.split(' ')[1]}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-left font-mono">
                        <span className="text-xs font-bold text-cyan-400 block">
                          {metric.effectiveDurationMinutes} دقيقة
                        </span>
                        <span className="text-[9px] text-slate-500">المستهدف: {metric.expectedDurationMinutes} د</span>
                      </div>

                      {metric.status === 'EXCELLENT' && (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[9px]">ممتاز ⚡</Badge>
                      )}
                      {metric.status === 'ON_TIME' && (
                        <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 text-[9px]">في الموعد ✅</Badge>
                      )}
                      {metric.status === 'CRITICAL_DELAY' && (
                        <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/40 text-[9px]">تأخير حاد 🚨</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2 bg-slate-950/40 rounded-2xl border border-slate-850">
                <Inbox className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
                <p className="font-bold text-slate-400">لا توجد مهام أو اتفاقيات خدمة مسجلة بالقسم حالياً (0 مهام)</p>
                <p className="text-[10px] text-slate-500">سيتم قياس سرعة التنفيذ تلقائياً فور تكليف أعضاء القسم بمهام وتأكيد قبولها.</p>
              </div>
            )}
          </Card>

          {/* Operation Deliverables Overview */}
          <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>مخرجات وعمليات القسم القائمة (Deliverables)</span>
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/manager/department/operations')}
                className="text-[10px] text-indigo-400 hover:bg-indigo-500/10"
              >
                إدارة العمليات
                <ArrowUpRight className="w-3.5 h-3.5 ms-1" />
              </Button>
            </div>

            {deliverables.length > 0 ? (
              <div className="space-y-3">
                {deliverables.map((del) => (
                  <div key={del.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{del.title}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{del.clientName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-400">تاريخ التسليم: {del.dueDate}</span>
                      {del.status === 'UNDER_REVIEW' && <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[9px]">قيد الاعتماد والمراجعة</Badge>}
                      {del.status === 'IN_PROGRESS' && <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 text-[9px]">قيد التنفيذ البرمجي</Badge>}
                      {del.status === 'DELIVERED' && <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[9px]">تم التسليم 100%</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2 bg-slate-950/40 rounded-2xl border border-slate-850">
                <Briefcase className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
                <p className="font-bold text-slate-400">لا توجد مخرجات أو مشاريع جارية لهذا القسم حالياً (0 مخرجات)</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Col: Announcements & Quick Access */}
        <div className="space-y-6">
          {/* Announcements Card */}
          <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>إعلانات القسم والمثبتات</span>
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/manager/department/collaboration')}
                className="text-[10px] text-indigo-400 hover:bg-indigo-500/10"
              >
                مساحة التعاون
              </Button>
            </div>

            {announcements.length > 0 ? (
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-200">{ann.title}</span>
                      {ann.priority === 'URGENT' && <Badge className="bg-rose-500/20 text-rose-400 text-[8px]">هام جداً</Badge>}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{ann.content}</p>
                    <span className="text-[9px] text-slate-500 font-mono block pt-1">{ann.authorName} - {ann.createdAt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 space-y-1 bg-slate-950/40 rounded-xl border border-slate-850">
                <p className="font-bold text-slate-400">لا توجد إعلانات منشورة بالقسم حالياً</p>
              </div>
            )}
          </Card>

          {/* SOPs Quick Video Access */}
          <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <PlayCircle className="w-4 h-4 text-cyan-400" />
              <span>دليل العمل والمعايير (SOPs)</span>
            </h3>

            {sops.length > 0 ? (
              <div className="space-y-2">
                {sops.map((sop) => (
                  <div key={sop.id} className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1">
                    <span className="font-bold text-slate-200 block">{sop.title}</span>
                    <p className="text-[10px] text-slate-400">{sop.category}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 space-y-1 bg-slate-950/40 rounded-xl border border-slate-850">
                <p className="font-bold text-slate-400">لا توجد أدلة إجرائية أو فيديوهات مثبتة حالياً</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DepartmentDashboard;
