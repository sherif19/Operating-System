import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AssignmentEngine, INITIAL_TRAINERS } from '../services/assignment.service';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppointmentType } from '@/types/domain.types';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
}

export function AppointmentBookingModal({ isOpen, onClose, customerId }: AppointmentBookingModalProps) {
  const [type, setType] = React.useState<AppointmentType>('kickoff_call');
  const [selectedDate] = React.useState('2026-08-22');
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState('14:00');
  const [assignedTrainer, setAssignedTrainer] = React.useState<{ trainerId: string; reason: string } | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const timeSlots = ['10:00', '11:30', '14:00', '15:30', '17:00'];

  // Determine trainer using Round Robin when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const next = AssignmentEngine.getNextTrainer(customerId);
      setAssignedTrainer({ trainerId: next.trainerId, reason: next.reason });
    }
  }, [isOpen, customerId]);

  const trainerInfo = INITIAL_TRAINERS.find((t) => t.id === assignedTrainer?.trainerId) || INITIAL_TRAINERS[0];

  const handleBooking = () => {
    setErrorMessage('');
    try {
      const startsAt = `${selectedDate}T${selectedTimeSlot}:00Z`;
      const endsAt = `${selectedDate}T${selectedTimeSlot}:45:00Z`;

      AssignmentEngine.bookAppointment({
        organizationId: 'org-1',
        customerId,
        staffId: trainerInfo.id,
        type,
        startsAt,
        endsAt,
        notes: 'مكالمة بداية المتابعة التشغيلية',
      });

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'تعذر إتمام الحجز');
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="حجز موعد استشاري جديد"
      description="التوزيع التشغيلي التلقائي يعين لك المدرب الأنسب وفق جدول التوافر"
    >
      {!isSuccess ? (
        <div className="flex flex-col gap-5 pt-2">
          {/* Trainer Assignment Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
            <img
              src={trainerInfo.avatarUrl}
              alt={trainerInfo.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-indigo-400">المدرب المعين لك تلقائياً</span>
              <h4 className="text-sm font-extrabold text-white">{trainerInfo.name}</h4>
              <span className="text-[10px] text-slate-400 mt-0.5">{assignedTrainer?.reason}</span>
            </div>
            <Badge variant="success" className="me-0 ms-auto text-[10px]">
              متاح
            </Badge>
          </div>

          {/* Appointment Type Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">نوع المكالمة</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setType('kickoff_call')}
                className={`p-3 rounded-xl border text-right transition-all ${
                  type === 'kickoff_call'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                مكالمة البداية (Kickoff)
              </button>
              <button
                type="button"
                onClick={() => setType('wrapup_call')}
                className={`p-3 rounded-xl border text-right transition-all ${
                  type === 'wrapup_call'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                مكالمة التسليم (Wrap-up)
              </button>
            </div>
          </div>

          {/* Time Slot Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">اختر الوقت المناسب</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    selectedTimeSlot === slot
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{slot}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Button variant="primary" size="md" onClick={handleBooking} className="w-full mt-2">
            تأكيد الحجز وتوثيق الموعد
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400 mb-3">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">تم تثبيت موعدك بنجاح!</h3>
          <p className="text-xs text-slate-300 mb-5">
            تم تخصيص الجلسة مع المدرب ({trainerInfo.name}) يوم {selectedDate} الساعة {selectedTimeSlot}.
          </p>
          <Button variant="secondary" size="sm" onClick={onClose} className="w-full">
            تم، العودة للوحة القيادة
          </Button>
        </div>
      )}
    </Dialog>
  );
}
