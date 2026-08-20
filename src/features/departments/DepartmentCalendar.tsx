import React from 'react';
import { DepartmentOSService } from './services/departments.service';
import { DepartmentShift } from './types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, PhoneCall, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export function DepartmentCalendar() {
  const [shifts, setShifts] = React.useState<DepartmentShift[]>([]);

  React.useEffect(() => {
    setShifts(DepartmentOSService.getShifts());
  }, []);

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px]">
              Operational Calendar — التقويم والوردانيات
            </Badge>
            <span className="text-[10px] text-slate-400 font-mono">وردانيات اليوم</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">التقويم التشغيلي وجدول المواعيد والوردانيات</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            إدارة وردانيات فريق العمل، تتبع التوافر، وحجوزات مكالمات العملاء والاستشارات.
          </p>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>إضافة موعد أو وردية جديدة</span>
        </Button>
      </div>

      {/* Shifts & Availability Grid or Empty State */}
      {shifts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shifts.map((shift, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-sm">{shift.userName}</span>

                    {shift.availabilityStatus === 'AVAILABLE' && (
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[9px]">متاح للعمل 🟢</Badge>
                    )}
                    {shift.availabilityStatus === 'IN_CALL' && (
                      <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 text-[9px] animate-pulse">في مكالمة 📞</Badge>
                    )}
                    {shift.availabilityStatus === 'OFF' && (
                      <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-[9px]">خارج الوردية 🔴</Badge>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-850 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        توقيت الوردية:
                      </span>
                      <strong className="text-slate-200 font-mono">{shift.shiftStart} - {shift.shiftEnd}</strong>
                    </div>
                  </div>

                  {/* Assigned Client Call Slots */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 block">مواعيد واستشارات العملاء المسندة:</span>
                    {shift.assignedClientCallSlots.length > 0 ? (
                      shift.assignedClientCallSlots.map((slot, sIdx) => (
                        <div key={sIdx} className="p-2 rounded-xl bg-slate-950 border border-slate-850 text-[10px] text-cyan-300 font-bold flex items-center gap-1.5">
                          <PhoneCall className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{slot}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[9px] text-slate-500 block italic">لا توجد حوارات أو مكالمات محجوزة اليوم.</span>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 bg-slate-900/60 border-slate-800 text-center space-y-3 shadow-xl">
          <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-sm font-black text-white">لا توجد وردانيات أو مواعيد مسجلة اليوم بالقسم (0 وردانيات)</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            يمكنك جدولة وردانيات أفراد القسم وحجز مواعيد مكالمات الاستشارات مع العملاء هنا.
          </p>
        </Card>
      )}
    </div>
  );
}

export default DepartmentCalendar;
