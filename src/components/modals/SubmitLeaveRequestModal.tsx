import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Paperclip, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '@/stores/auth.store';
import { ApprovalsDB } from '@/modules/owner/approvals/services/approvals-db';

interface SubmitLeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitLeaveRequestModal({ isOpen, onClose }: SubmitLeaveRequestModalProps) {
  const { user } = useAuthStore();

  const [leaveType, setLeaveType] = React.useState('اعتيادية');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [fileUrl, setFileUrl] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      alert('يرجى اختيار تاريخ البداية والنهاية وكتابة سبب طلب الإجازة.');
      return;
    }

    // Calculate days count
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysCount = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1);

    setIsSubmitting(true);

    const requesterName = user?.displayName || 'عضو الكادر';
    const requesterRole = user?.role === 'manager' ? 'مدير قسم' : 'منفذ أعمال';

    ApprovalsDB.addApproval({
      title: `طلب إجازة ${leaveType} — ${requesterName}`,
      detail: `${daysCount} أيام من ${startDate} إلى ${endDate}`,
      description: reason.trim(),
      category: 'leave',
      requesterName,
      requesterRole,
      department: 'قسم التنفيذ والإنتاج',
      leaveStartDate: startDate,
      leaveEndDate: endDate,
      leaveDaysCount: daysCount,
      attachments: fileName.trim()
        ? [
            {
              id: `att-${Date.now()}`,
              name: fileName.trim(),
              url: fileUrl.trim() || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              size: '1.2 MB',
            },
          ]
        : [],
    });

    setIsSubmitting(false);
    alert('تم تقديم طلب الإجازة بنجاح، وتحويله لمركز الاعتماد والموافقات الإدارية.');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 overflow-hidden text-right text-xs space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">تقديم طلب إجازة رسمي</h3>
                <span className="text-[10px] text-slate-400 block">إرسال الطلب للاعتماد المباشر من الإدارة</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">نوع الإجازة المطلوبة</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="اعتيادية">إجازة اعتيادية سنوية</option>
                <option value="مرضية">إجازة مرضية (تتطلب إرفاق عذر طبي)</option>
                <option value="عارضة">إجازة عارضة طارئة</option>
                <option value="بدون راتب">إجازة بدون راتب</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">تاريخ بداية الإجازة</label>
                <input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">تاريخ نهاية الإجازة</label>
                <input
                  required
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">سبب وملاحظات طلب الإجازة</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="اكتب التوضيح وخطط تسليم المهام أثناء فترة الإجازة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Optional Attachments */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-850 space-y-2">
              <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                <span>إرفاق مستند أو تقرير طبي (اختياري)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="اسم الملف (مثال: Medical_Report.pdf)"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="url"
                  placeholder="رابط المستند إن وجد"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs text-slate-400">
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>تقديم طلب الإجازة الآن</span>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SubmitLeaveRequestModal;
