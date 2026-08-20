import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  Paperclip,
  Upload,
  User,
  Building,
  MessageSquare,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ApprovalItem } from '../types/approvals.types';
import { ApprovalsDB } from '../services/approvals-db';

interface ApprovalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  approval: ApprovalItem | null;
  onUpdate: () => void;
}

export function ApprovalDetailsModal({ isOpen, onClose, approval, onUpdate }: ApprovalDetailsModalProps) {
  const [reviewNote, setReviewNote] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadFileName, setUploadFileName] = React.useState('');
  const [uploadFileUrl, setUploadFileUrl] = React.useState('');
  const [showUploadForm, setShowUploadForm] = React.useState(false);

  React.useEffect(() => {
    if (approval) {
      setReviewNote(approval.reviewNote || '');
    }
  }, [approval]);

  if (!isOpen || !approval) return null;

  const handleAction = (status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !reviewNote.trim()) {
      alert('يرجى كتابة سبب الرفض في صندوق التجميع والتوجيه أدناه لتوضيح السبب للموظف.');
      return;
    }

    setIsSubmitting(true);
    ApprovalsDB.updateStatus(approval.id, status, reviewNote.trim() || undefined);
    setIsSubmitting(false);
    onUpdate();
    onClose();
  };

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    ApprovalsDB.addAttachment(approval.id, {
      name: uploadFileName,
      url: uploadFileUrl.trim() || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      size: '1.5 MB',
    });

    setUploadFileName('');
    setUploadFileUrl('');
    setShowUploadForm(false);
    onUpdate();
  };

  const getCategoryBadge = (category: ApprovalItem['category']) => {
    switch (category) {
      case 'leave':
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]">طلب إجازة 🏖️</Badge>;
      case 'invoice':
        return <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px]">فاتورة مورد 🧾</Badge>;
      case 'proposal':
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">عرض سعر 📑</Badge>;
      case 'content':
        return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-[10px]">اعتماد محتوى 🎨</Badge>;
      case 'refund':
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-[10px]">استرجاع مالي 💳</Badge>;
      default:
        return <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[10px]">طلب عام 📌</Badge>;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right"
        >
          {/* Header */}
          <div className="p-6 bg-slate-950/90 border-b border-slate-850 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                {getCategoryBadge(approval.category)}
                {approval.status === 'pending' && (
                  <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]">معلقة بانتظار التوقيع ⏳</Badge>
                )}
                {approval.status === 'approved' && (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">تمت المراجعة والاعتماد ✅</Badge>
                )}
                {approval.status === 'rejected' && (
                  <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-[10px]">تم رفض الطلب ❌</Badge>
                )}
              </div>

              <h2 className="text-xl font-black text-white">{approval.title}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-indigo-400" /> {approval.requesterName} ({approval.requesterRole})</span>
                <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-cyan-400" /> {approval.department}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Specific Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {approval.amount && (
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-850 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    💰
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">المبلغ المالي المطلوبة اعتماده</span>
                    <strong className="text-emerald-400 text-sm font-mono font-black">{approval.amount}</strong>
                  </div>
                </div>
              )}

              {approval.leaveStartDate && (
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-850 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    📅
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">فترة الإجازة المطلوبة ({approval.leaveDaysCount} أيام)</span>
                    <strong className="text-amber-300 text-xs font-mono font-bold">
                      من {approval.leaveStartDate} إلى {approval.leaveEndDate}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* Description / Cause */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>تفاصيل ووصف الطلب المقدم</span>
              </h3>
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 text-slate-300 leading-relaxed">
                {approval.description || 'لا يوجد وصف إضافي مرفق مع الطلب.'}
              </div>
            </div>

            {/* Attachments & Files */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-indigo-400" />
                  <span>المستندات والمرفقات الرسمية ({approval.attachments.length})</span>
                </h3>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="text-[10px] font-bold border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 h-7 flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع ملف إضافي 📎</span>
                </Button>
              </div>

              {showUploadForm && (
                <form onSubmit={handleAddAttachment} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 block">إرفاق مستند أو تقرير جديد:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      required
                      type="text"
                      placeholder="اسم الملف (مثال: Medical_Report.pdf)"
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="url"
                      placeholder="رابط الملف / التخزين (اختياري)"
                      value={uploadFileUrl}
                      onChange={(e) => setUploadFileUrl(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowUploadForm(false)} className="text-[10px] text-slate-400">
                      إلغاء
                    </Button>
                    <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px]">
                      تأكيد الرفع
                    </Button>
                  </div>
                </form>
              )}

              {approval.attachments.length > 0 ? (
                <div className="space-y-2">
                  {approval.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-white font-bold block">{att.name}</strong>
                          <span className="text-[9px] text-slate-500 font-mono">تم الرفع بتاريخ: {att.uploadedAt} {att.size ? `(${att.size})` : ''}</span>
                        </div>
                      </div>

                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Download className="w-3 h-3" />
                        <span>معاينة وتحميل</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-850 text-center text-slate-500 text-xs">
                  لا توجد مستندات أو مرفقات تابعة لهذا الطلب حالياً.
                </div>
              )}
            </div>

            {/* Decision Notes & Action Area */}
            <div className="space-y-3 pt-2 border-t border-slate-850">
              <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>ملاحظات القرار والتوجيه (اعتماد / سبب الرفض)</span>
              </h3>

              <textarea
                rows={3}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="اكتب توجيه المراجعة أو تبرير الرفض ليظهر للموظف..."
                disabled={approval.status !== 'pending'}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
              />

              {approval.status === 'pending' ? (
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    disabled={isSubmitting}
                    onClick={() => handleAction('approved')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اعتماد وموافقة على الطلب</span>
                  </Button>

                  <Button
                    disabled={isSubmitting}
                    onClick={() => handleAction('rejected')}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-2.5 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/20"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>رفض الطلب</span>
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
                  <span className="block font-bold text-white">تم اتخاذ القرار بواسطة: {approval.reviewedBy || 'مدير النظام'}</span>
                  <span className="block font-mono">تاريخ الاعتماد: {approval.reviewedAt}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ApprovalDetailsModal;
