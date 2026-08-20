import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, ShieldAlert } from 'lucide-react';

interface SystemAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  triggerRule: string;
  entity: string;
  since: string;
  status: 'active' | 'resolved';
}

export function AlertsCenterPage() {
  const [alerts, setAlerts] = React.useState<SystemAlert[]>([
    { id: '1', severity: 'critical', title: 'معدل استرجاع مرتفع — Mona Beauty', triggerRule: 'refundRisk > 15%', entity: 'عميلة: Mona Beauty', since: 'من 3 ساعات', status: 'active' },
    { id: '2', severity: 'critical', title: 'حملة بتخسر فلوس — Ramadan Launch', triggerRule: 'ROAS < 1.5x لمدة 3 أيام متتالية', entity: 'حملة: Ramadan Launch', since: 'من يوم', status: 'active' },
    { id: '3', severity: 'warning', title: 'عميل غير نشط 7 أيام — Layla Studio', triggerRule: 'lastActiveAt > 7 days', entity: 'عميلة: Layla Studio', since: 'من يومين', status: 'active' },
    { id: '4', severity: 'warning', title: 'موظف محمّل فوق طاقته — Omar', triggerRule: 'openTasks > 8 لمدة أسبوع', entity: 'موظف: Omar', since: 'من 4 أيام', status: 'active' },
    { id: '5', severity: 'warning', title: 'قسم متأخر عن الخطة — Support', triggerRule: 'onSchedule% < 70%', entity: 'قسم: Support', since: 'من يوم', status: 'active' },
    { id: '6', severity: 'warning', title: 'مشكلة تدفق نقدي محتملة', triggerRule: 'forecastedCashflow < 0 خلال 30 يوم', entity: 'Finance', since: 'من ساعتين', status: 'active' },
    { id: '7', severity: 'warning', title: 'SLA اتخطى الحد المسموح — تذكرة #4021', triggerRule: 'responseTime > SLA threshold', entity: 'Support', since: 'من 5 ساعات', status: 'active' },
  ]);

  const handleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a))
    );
  };

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-1">
          <Badge variant="destructive" className="w-fit">
            <Bell className="w-3.5 h-3.5 me-1" />
            مركز التنبيهات وقواعد الخلل التشغيلي
          </Badge>
          <h1 className="text-2xl font-bold text-white">تنبيهات النظام والمؤشرات التنبيهية</h1>
          <p className="text-xs text-slate-400">
            تنبيهات حرجة بس — كل واحد ناتج من قاعدة أتمتة حقيقية اتخطت حد معين، مش رأي من الـ AI.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-rose-500/30 bg-rose-950/10">
          <div className="text-xs font-semibold text-rose-400">تنبيهات حرجة</div>
          <div className="text-2xl font-black text-rose-400 font-number mt-1">
            {activeAlerts.filter((a) => a.severity === 'critical').length}
          </div>
        </Card>
        <Card className="border-amber-500/30 bg-amber-950/10">
          <div className="text-xs font-semibold text-amber-400">تنبيهات تحذيرية</div>
          <div className="text-2xl font-black text-amber-400 font-number mt-1">
            {activeAlerts.filter((a) => a.severity === 'warning').length}
          </div>
        </Card>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3">
        {activeAlerts.map((alert) => (
          <Card
            key={alert.id}
            className={`transition-all ${
              alert.severity === 'critical'
                ? 'border-rose-500/50 bg-rose-950/10'
                : 'border-slate-800 bg-slate-900/60'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                    alert.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-white">{alert.title}</h3>
                    <Badge
                      variant={alert.severity === 'critical' ? 'destructive' : 'warning'}
                      className="text-[10px]"
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-300">
                    مصدر التنبيه: <span className="font-mono text-indigo-300 font-semibold">{alert.triggerRule}</span> • {alert.entity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-400 me-2">{alert.since}</span>
                <Button variant="primary" size="sm" onClick={() => handleResolve(alert.id)}>
                  تم الحل
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
