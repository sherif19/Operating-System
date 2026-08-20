import { Card, CardContent } from '@/components/ui/card';
import { timelineService } from '../../services/timeline.service';
import { Activity, ShieldAlert, Layers, Clock } from 'lucide-react';

export function TimelineMetricsSummary() {
  const metrics = timelineService.getMetricsSummary();

  const cards = [
    {
      title: 'حجم أحداث اليوم (Daily Volume)',
      value: metrics.dailyVolume,
      description: 'إجمالي الحركات والعمليات المسجلة اليوم',
      icon: <Activity className="w-5 h-5 text-indigo-400" />,
      glowColor: 'shadow-indigo-500/10 border-indigo-500/20'
    },
    {
      title: 'تنبيهات أمنية خطيرة (Critical alerts)',
      value: metrics.criticalCount,
      description: 'محاولات دخول غير مصرحة أو اختراق SLA',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      glowColor: 'shadow-rose-500/10 border-rose-500/20'
    },
    {
      title: 'القسم الأكثر نشاطاً (Active Department)',
      value: metrics.mostActiveDept,
      description: 'القسم الذي سجل أكبر عدد حركات تشغيلية',
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      glowColor: 'shadow-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'إجمالي سجل التدقيق (Total Logged)',
      value: `${metrics.totalEvents} حدث`,
      description: 'السجل الكلي المتراكم للعمليات',
      icon: <Clock className="w-5 h-5 text-emerald-400" />,
      glowColor: 'shadow-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-right text-xs">
      {cards.map((card, idx) => (
        <Card key={idx} className={`bg-slate-900/60 border rounded-3xl p-5 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:bg-slate-900/80 ${card.glowColor}`}>
          <CardContent className="p-0 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold block">{card.title}</span>
              <span className="text-lg font-black text-white block tracking-tight">{card.value}</span>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{card.description}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-center shrink-0">
              {card.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
