import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Calendar, CheckSquare, Rocket } from 'lucide-react';

interface TimelineEvent {
  id: string;
  icon: React.ReactNode;
  title: string;
  timestamp: string;
  bgClass: string;
}

export function CompanyTimelinePage() {
  const events: TimelineEvent[] = [
    {
      id: 'e-1',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      title: 'دفعة اتقبضت من Khaled Fitness — ١٨,٠٠٠ جنيه',
      timestamp: 'من ساعة',
      bgClass: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'e-2',
      icon: <Calendar className="w-4 h-4 text-indigo-400" />,
      title: 'مكالمة Kickoff مع عميل جديد — Layla Studio',
      timestamp: 'من 3 ساعات',
      bgClass: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      id: 'e-3',
      icon: <CheckSquare className="w-4 h-4 text-purple-400" />,
      title: 'محمد جو اعتمد فاتورة Meta Ads',
      timestamp: 'من 4 ساعات',
      bgClass: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      id: 'e-4',
      icon: <Rocket className="w-4 h-4 text-rose-400" />,
      title: 'إطلاق حملة Khaled Fitness Ramadan',
      timestamp: 'إمبارح',
      bgClass: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit">
            <Clock className="w-3.5 h-3.5 me-1" />
            السجل الزمني الحي للشركة — Company Operational Stream
          </Badge>
          <h1 className="text-2xl font-bold text-white">الخط الزمني الموحد لكل الحوادث والعمليات</h1>
          <p className="text-xs text-slate-400">
            تتبع وتسجيل كافة المدفوعات، المكالمات، الإطلاقات، المهام، وتسليم المخرجات لحظة بلحظة.
          </p>
        </div>
      </div>

      {/* Stream */}
      <div className="space-y-4">
        {events.map((ev) => (
          <Card key={ev.id} className={`hover:border-indigo-500/40 transition-all border ${ev.bgClass}`}>
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-950/80 shrink-0 mt-0.5 border border-slate-800">
                {ev.icon}
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-white">{ev.title}</h3>
                  <span className="text-[10px] text-slate-400">{ev.timestamp}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
