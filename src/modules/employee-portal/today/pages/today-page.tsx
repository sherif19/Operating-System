import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, CheckCircle2, Coffee, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  type: 'task' | 'meeting' | 'break' | 'deadline';
  status: 'pending' | 'completed' | 'ongoing';
  duration?: string;
}

export function TodayPage() {

  const events: TimelineEvent[] = [
    { id: '1', time: '09:00 - 09:30', title: 'مراجعة مهام البريد وترتيب أولويات اليوم', type: 'task', status: 'completed' },
    { id: '2', time: '10:00 - 10:45', title: 'مكالمة انطلاق سارة حسام (Zoom)', type: 'meeting', status: 'completed' },
    { id: '3', time: '11:00 - 12:30', title: 'تصميم دليل الهوية البصرية لـ Nour Store', type: 'task', status: 'ongoing', duration: '١.٥ ساعة' },
    { id: '4', time: '12:30 - 13:00', title: 'استراحة غداء وصلاة', type: 'break', status: 'pending' },
    { id: '5', time: '14:00 - 14:45', title: 'مكالمة مراجعة أهداف Khaled Fitness', type: 'meeting', status: 'pending' },
    { id: '6', time: '16:00', title: 'الموعد النهائي لتسليم تصاميم السوشيال ميديا', type: 'deadline', status: 'pending' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 me-1.5 animate-pulse" />
            Today Mode — التركيز التشغيلي اليومي
          </Badge>
          <h1 className="text-2xl font-black text-white">ماذا أحتاج أن أفعل اليوم؟</h1>
          <p className="text-xs text-slate-400">
            جدولك الزمني التفصيلي لليوم الحالي. ركّز على مهمة واحدة في كل مرة لتسريع الكفاءة.
          </p>
        </div>
      </div>

      {/* Timeline events container */}
      <Card className="p-6">
        <div className="relative border-r border-slate-800/80 pr-6 mr-2 space-y-6">
          {events.map((ev, idx) => {
            const isOngoing = ev.status === 'ongoing';
            const isCompleted = ev.status === 'completed';

            let typeIcon = <Clock className="w-4 h-4" />;
            if (ev.type === 'meeting') typeIcon = <Play className="w-4 h-4" />;
            else if (ev.type === 'break') typeIcon = <Coffee className="w-4 h-4" />;
            else if (ev.type === 'deadline') typeIcon = <ShieldAlert className="w-4 h-4" />;

            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-slate-950/80 transition-all"
              >
                {/* Timeline Dot */}
                <div className={`absolute right-[-31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 ${
                  isOngoing
                    ? 'bg-blue-500 border-blue-400 animate-pulse'
                    : isCompleted
                    ? 'bg-emerald-500 border-emerald-400'
                    : 'bg-slate-950 border-slate-800'
                }`} />

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : isOngoing
                      ? 'bg-blue-500/10 text-cyan-400'
                      : 'bg-slate-900 text-slate-500'
                  }`}>
                    {typeIcon}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500 font-mono">{ev.time}</span>
                    <h4 className={`text-xs font-black ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {ev.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {ev.duration && (
                    <Badge variant="outline" className="border-slate-800 text-[10px] text-slate-400 font-mono">
                      المدة: {ev.duration}
                    </Badge>
                  )}
                  {isOngoing ? (
                    <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                      قيد التنفيذ حالياً
                    </span>
                  ) : isCompleted ? (
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      مكتملة
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                      قيد الانتظار
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
export default TodayPage;
