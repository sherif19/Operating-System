import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckSquare,
  DollarSign,
  Bot,
  Zap,
  Sparkles,
  AlertTriangle,
  Flame,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';

export function MissionControlPage() {
  const navigate = useNavigate();

  const kpis = [
    { title: 'الإيرادات (الشهر)', value: '٤٨٢,٣٠٠ ج', change: '▲ 12%', icon: <DollarSign className="w-5 h-5 text-emerald-400" />, shadowColor: 'shadow-emerald-500/10', glowBorder: 'hover:border-emerald-500/30' },
    { title: 'عملاء جدد', value: '٢٤ عميلاً', change: '▲ 5', icon: <Users className="w-5 h-5 text-indigo-400" />, shadowColor: 'shadow-indigo-500/10', glowBorder: 'hover:border-indigo-500/30' },
    { title: 'الموظفين النشطين', value: '١٨ / ٢٠', change: '٩٠%', icon: <Users className="w-5 h-5 text-purple-400" />, shadowColor: 'shadow-purple-500/10', glowBorder: 'hover:border-purple-500/30' },
    { title: 'تذاكر Support مفتوحة', value: '١٤ تذكرة', change: '٦٠% متأخر', icon: <AlertTriangle className="w-5 h-5 text-rose-400" />, shadowColor: 'shadow-rose-500/10', glowBorder: 'hover:border-rose-500/30' },
  ];

  const depts = [
    { id: 'Marketing', label: 'Marketing', status: '🟡 نشط جزئياً', accentClass: 'border-amber-500/30 hover:border-amber-500/60 bg-amber-950/10 text-amber-300' },
    { id: 'Sales', label: 'Sales', status: '🟢 مكتمل', accentClass: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/10 text-emerald-300' },
    { id: 'Execution', label: 'Execution', status: '🟢 مكتمل', accentClass: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/10 text-emerald-300' },
    { id: 'Support', label: 'Support', status: '🔴 حرج', accentClass: 'border-rose-500/30 hover:border-rose-500/60 bg-rose-950/10 text-rose-300' },
    { id: 'Development', label: 'Development', status: '🟢 مكتمل', accentClass: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/10 text-emerald-300' },
    { id: 'Design', label: 'Design', status: '🟢 مكتمل', accentClass: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/10 text-emerald-300' },
    { id: 'Finance', label: 'Finance', status: '🟢 مكتمل', accentClass: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/10 text-emerald-300' },
    { id: 'HR', label: 'HR', status: '🟢 مكتمل', accentClass: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/10 text-emerald-300' },
  ];

  const pendingApprovals = [
    { title: 'فاتورة مورد — Meta Ads', detail: '٨,٤٠٠ ج', type: 'F', bg: 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' },
    { title: 'عرض سعر — Nour Store', detail: '١٥,٠٠٠ ج', type: 'S', bg: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' },
    { title: 'طلب إجازة أحمد', detail: '٣ أيام', type: 'H', bg: 'bg-amber-600/20 text-amber-400 border border-amber-500/30' },
  ];

  const urgentTasks = [
    { title: 'اعتماد عرض سعر Nour Store', source: 'موافقة معلّقة', score: '2.4' },
    { title: 'متابعة عميلة متأخرة: Mona Beauty', source: 'عميل متأخر', score: '1.9' },
    { title: 'مراجعة أداء حملة Ramadan Launch', source: 'حملة غير نشطة', score: '1.5' },
  ];

  const recentActivity = [
    { icon: '💰', text: 'دفعة اتقبضت من Khaled Fitness — ١٨,٠٠٠ جنيه', time: 'من ساعة' },
    { icon: '📞', text: 'مكالمة Kickoff مع عميل جديد — Layla Studio', time: 'من 3 ساعات' },
    { icon: '✅', text: 'محمد جو اعتمد فاتورة Meta Ads', time: 'من 4 ساعات' },
  ];

  // Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 p-1 pb-12"
    >
      {/* Top Banner - Highly Animated & Structured */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-[24px] bg-gradient-to-br from-[#10193E] to-[#0A0F24]/80 border border-blue-500/25 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-2 z-10">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            <Badge variant="default" className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1 shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-3.5 h-3.5 me-1.5 animate-pulse" />
              غرفة التحكم الموحدة — Vision OS
            </Badge>
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-2">
            مرحباً بك في غرفة القيادة
          </h1>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            الأحد ٢٦ يوليو — نظرة عامة على صحة وأداء كافة الأقسام والمؤشرات الحيوية للشركة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/owner/ai-brain')}
            className="gap-2 border-blue-500/20 hover:border-cyan-500/40 bg-slate-950/40"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>عقل الذكاء الاصطناعي</span>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/owner/approvals')}
            className="gap-2 shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/25"
          >
            <Zap className="w-4 h-4 text-white" />
            <span>مركز الموافقات</span>
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards Grid - Glowing & Balanced */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.title}
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            className={`card flex flex-col justify-between p-5 rounded-[20px] shadow-lg ${kpi.shadowColor} ${kpi.glowBorder} cursor-default`}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-extrabold text-slate-400">
                {kpi.title}
              </span>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-blue-500/10">
                {kpi.icon}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-white tracking-tight">
                {kpi.value}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/60 text-[10px]">
                <span className="text-cyan-400 font-extrabold flex items-center gap-0.5">
                  {kpi.change}
                </span>
                <Badge variant="outline" className="text-[9px] border-slate-800 text-slate-400 px-2 py-0">
                  محدث الآن
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Department Status Grid & Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Controller Grid */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-cyan-400" />
                  <span>حالة تشغيل الأقسام — انتقل للوحة التحكم</span>
                </CardTitle>
                <CardDescription>
                  مؤشرات الحضور والأداء لأقسام الشركة الـ 8 بشكل فوري.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {depts.map((d) => (
                    <motion.button
                      key={d.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/owner/departments')}
                      className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${d.accentClass}`}
                    >
                      <div className="text-xs font-black">{d.label}</div>
                      <div className="text-[10px] opacity-80 flex items-center justify-between w-full">
                        <span>الحالة:</span>
                        <span>{d.status}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Urgent Execution Tasks */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-400" />
                  <span>المهام التنفيذية العاجلة اليوم</span>
                </CardTitle>
                <CardDescription>
                  الترتيب التلقائي للأولويات التشغيلية بناءً على خوارزميات النظام.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 mt-4">
                {urgentTasks.map((t, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: -4 }}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-extrabold flex items-center justify-center border border-indigo-500/20">
                        {t.score}
                      </span>
                      <div>
                        <h4 className="font-black text-white">{t.title}</h4>
                        <span className="text-[10px] text-slate-400">المصدر: {t.source}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/owner/approvals')} className="h-8">
                      إجراء
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI digest, approvals list & recent timeline */}
        <div className="flex flex-col gap-6">
          {/* AI daily summary with breathe animation */}
          <motion.div
            variants={itemVariants}
            className="card p-6 bg-gradient-to-b from-[#10193E] to-slate-950/80 border-cyan-500/20 relative"
          >
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-sm font-extrabold text-cyan-400 flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4" />
              <span>ملخص الـ AI اليومي</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              الإيرادات أعلى بـ ١٢٪ من متوسط الأسبوع. حملة "Ramadan Launch" تستهلك ميزانية بمعدل تحويل ضعيف. الدعم الفني لديه تذاكر بحاجة لمعالجة فورية.
            </p>
            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
              <button onClick={() => navigate('/owner/alerts')} className="text-rose-400 hover:underline font-extrabold">
                🔴 تنبيهات حرجة (2)
              </button>
              <button onClick={() => navigate('/owner/reports')} className="text-indigo-400 hover:underline font-extrabold flex items-center gap-0.5">
                <span>التقرير التنفيذي</span>
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>
          </motion.div>

          {/* Pending approvals list */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardHeader className="flex-row items-center justify-between pb-3">
                <CardTitle className="text-xs text-white">موافقات معلّقة</CardTitle>
                <Badge variant="warning" className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  ٣ طلبات
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 mt-2">
                {pendingApprovals.map((p, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between gap-3 text-xs pb-3 border-b border-slate-800/60 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${p.bg} font-black flex items-center justify-center text-xs`}>
                        {p.type}
                      </div>
                      <div>
                        <div className="font-extrabold text-white">{p.title}</div>
                        <div className="text-[10px] text-slate-400">{p.detail}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/owner/approvals')} className="h-7 text-[10px]">
                      مراجعة
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity Line */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-white">النشاط الأخير بالخط الزمني</CardTitle>
              <CardDescription>آخر العمليات المالية والتشغيلية المعتمدة.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/owner/timeline')}>
              عرض الكل
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 mt-4">
            {recentActivity.map((act, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 text-xs pb-3 border-b border-slate-800/60 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="text-base shrink-0">{act.icon}</span>
                  <span className="text-slate-200">{act.text}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
