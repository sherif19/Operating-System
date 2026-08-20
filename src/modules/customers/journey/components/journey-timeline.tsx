import React from 'react';
import { Customer } from '../../types/domain.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomerStage } from '@/types/domain.types';
import { JourneyEngine, StageApprovalState } from '../services/journey-engine';
import {
  CheckCircle2,
  Lock,
  ArrowLeftRight,
  Play,
  ChevronLeft,
  Building2,
  User,
  UserCheck,
  Clock,
  AlertTriangle,
  Send,
  XCircle,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface JourneyTimelineProps {
  customer: Customer;
  onStageChange: () => void;
}

export function JourneyTimeline({ customer, onStageChange }: JourneyTimelineProps) {
  const currentStageIndex = JourneyEngine.STAGES_ORDER.indexOf(customer.currentStage);
  const [approvals, setApprovals] = React.useState<StageApprovalState[]>([]);
  const [selectedStageId, setSelectedStageId] = React.useState<CustomerStage>(customer.currentStage);

  // Forms state
  const [submissionNotes, setSubmissionNotes] = React.useState('');
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [isRejecting, setIsRejecting] = React.useState(false);

  const loadApprovals = React.useCallback(() => {
    const data = JourneyEngine.getStageApprovals(customer.id);
    setApprovals(data);
  }, [customer.id]);

  React.useEffect(() => {
    loadApprovals();
  }, [loadApprovals, customer.currentStage]);

  const activeApproval = approvals.find((a) => a.stageId === selectedStageId);

  // Handle Employee submitting stage for approval
  const handleSubmitForApproval = (stageId: CustomerStage) => {
    const updated = JourneyEngine.submitStageForApproval(customer.id, stageId, submissionNotes);
    setApprovals(updated);
    setSubmissionNotes('');
  };

  // Handle Manager approving stage
  const handleApproveStage = (stageId: CustomerStage) => {
    const updated = JourneyEngine.approveStage(customer.id, stageId);
    setApprovals(updated);
    onStageChange();
  };

  // Handle Manager rejecting stage with reason
  const handleRejectStage = (stageId: CustomerStage) => {
    if (!rejectionReason.trim()) return;
    const updated = JourneyEngine.rejectStage(customer.id, stageId, rejectionReason);
    setApprovals(updated);
    setRejectionReason('');
    setIsRejecting(false);
  };

  const getApprovalStatusBadge = (status: StageApprovalState['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[9px]">معتمدة ومكتملة ✅</Badge>;
      case 'pending_approval':
        return <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/40 text-[9px] animate-pulse">بانتظار موافقة المدير ⏳</Badge>;
      case 'rejected_needs_revision':
        return <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/40 text-[9px]">مرفوضة - يلزم التعديل ❌</Badge>;
      case 'in_progress':
        return <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 text-[9px]">نشطة حالياً 🛠️</Badge>;
      default:
        return <Badge className="bg-slate-900 text-slate-500 border-slate-800 text-[9px]">مغلقة 🔒</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-right">
      {/* Main Flowchart Card */}
      <Card className="p-6 relative overflow-hidden bg-slate-950/90 border-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
              <span>مسار مراحل العميل والدورة الإجرائية للاعتماد (قسم / موظف / مدير)</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              انقر على أي مرحلة لعرض القسم والموظف المسؤول، أو تقديمها واعتمادها من المدير المباشر.
            </p>
          </div>

          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs">
            المرحلة الحالية: {customer.currentStage}
          </Badge>
        </div>

        {/* Grid of 4 columns, wrapping to next rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-12">
          {JourneyEngine.STAGES_ORDER.map((stageId, idx) => {
            const approval = approvals.find((a) => a.stageId === stageId);
            const isCompleted = approval?.status === 'approved' || idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isSelected = selectedStageId === stageId;

            const isLastInDesktopRow = (idx + 1) % 4 === 0;
            const isLastInTabletRow = (idx + 1) % 2 === 0;
            const isLastOverall = idx === JourneyEngine.STAGES_ORDER.length - 1;

            return (
              <div key={stageId} className="relative">
                {/* Card Container */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25, delay: idx * 0.02 }}
                  onClick={() => setSelectedStageId(stageId)}
                  className={`w-full p-3.5 rounded-2xl border flex flex-col justify-between min-h-[160px] relative transition-all cursor-pointer z-10 ${
                    isSelected
                      ? 'border-indigo-500 bg-[#10193E] shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-500/40'
                      : isCompleted
                      ? 'border-emerald-500/30 bg-emerald-950/10 text-slate-300'
                      : approval?.status === 'pending_approval'
                      ? 'border-amber-500/50 bg-amber-950/20 text-amber-200 ring-1 ring-amber-500/30'
                      : approval?.status === 'rejected_needs_revision'
                      ? 'border-rose-500/50 bg-rose-950/20 text-rose-200'
                      : 'border-slate-900 bg-slate-950/40 text-slate-500'
                  }`}
                >
                  {/* Step indicator & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">
                      الخطوة {idx + 1}
                    </span>

                    <div
                      className={`p-1 rounded-lg border flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                          : approval?.status === 'pending_approval'
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : approval?.status === 'rejected_needs_revision'
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                          : isCurrent
                          ? 'bg-indigo-500/10 border-indigo-500/25 text-cyan-400'
                          : 'bg-slate-950 border-slate-900 text-slate-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : approval?.status === 'pending_approval' ? (
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                      ) : approval?.status === 'rejected_needs_revision' ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : isCurrent ? (
                        <Play className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>

                  {/* Title & Status */}
                  <div className="mt-2">
                    <h4 className={`text-xs font-black truncate ${isCurrent || isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {stageId.replace('_', ' ')}
                    </h4>
                    <div className="mt-1">{getApprovalStatusBadge(approval?.status || 'not_started')}</div>
                  </div>

                  {/* Responsible Department & Employee Info */}
                  {approval && (
                    <div className="mt-3 pt-2 border-t border-slate-850/80 space-y-1 text-[9px] text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="truncate">{approval.departmentName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate text-slate-300 font-bold">{approval.employeeName}</span>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Connector Arrows */}
                {!isLastOverall && !isLastInDesktopRow && (
                  <div className="hidden lg:flex absolute left-[-40px] w-8 top-1/2 -translate-y-1/2 items-center justify-center z-0">
                    <div
                      className={`absolute w-full h-[2px] rounded-full ${
                        isCompleted ? 'bg-gradient-to-r from-emerald-500 to-indigo-500' : 'bg-slate-900'
                      }`}
                    />
                    <ChevronLeft className={`w-4 h-4 z-10 ${isCompleted ? 'text-indigo-400 animate-pulse' : 'text-slate-800'}`} />
                  </div>
                )}

                {!isLastOverall && !isLastInTabletRow && (
                  <div className="hidden sm:flex lg:hidden absolute left-[-40px] w-8 top-1/2 -translate-y-1/2 items-center justify-center z-0">
                    <div
                      className={`absolute w-full h-[2px] rounded-full ${
                        isCompleted ? 'bg-gradient-to-r from-emerald-500 to-indigo-500' : 'bg-slate-900'
                      }`}
                    />
                    <ChevronLeft className={`w-4 h-4 z-10 ${isCompleted ? 'text-indigo-400 animate-pulse' : 'text-slate-800'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Selected Stage Detail & Approval Control Panel (لوحة إجازة واعتماد المرحلة من المدير المباشر) */}
      {activeApproval && (
        <Card className="p-6 border-slate-800 bg-slate-900/90 shadow-2xl space-y-5 relative">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-500/10 text-indigo-400 text-[10px] font-mono">
                  المرحلة المختارة
                </Badge>
                <h3 className="text-sm font-black text-white">{selectedStageId.replace('_', ' ')}</h3>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                تفاصيل المسئولية ودورة الاعتماد والمراجعة الخاصة بـ المدير المباشر.
              </p>
            </div>

            {getApprovalStatusBadge(activeApproval.status)}
          </div>

          {/* Department, Employee & Manager Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-850 text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-850">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block font-bold">القسم المسؤول</span>
                <strong className="text-slate-200">{activeApproval.departmentName}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-850">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block font-bold">الموظف المكلف</span>
                <strong className="text-cyan-300 font-extrabold">{activeApproval.employeeName}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-850">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block font-bold">المدير المباشر المعني</span>
                <strong className="text-purple-300 font-extrabold">{activeApproval.managerName}</strong>
              </div>
            </div>
          </div>

          {/* Rejection Alert Box if Status is rejected_needs_revision */}
          {activeApproval.status === 'rejected_needs_revision' && activeApproval.rejectionReason && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-black text-rose-400">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>سبب الرفض والملحوظات المطلوبة من المدير المباشر ({activeApproval.managerName}):</span>
              </div>
              <p className="text-xs leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-rose-500/20 text-rose-200">
                "{activeApproval.rejectionReason}"
              </p>
              {activeApproval.reviewedAt && (
                <span className="text-[9px] text-rose-400/80 block font-mono">تاريخ التوجيه: {activeApproval.reviewedAt}</span>
              )}
            </div>
          )}

          {/* Submission Notes if any */}
          {activeApproval.submissionNotes && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs text-slate-300">
              <span className="text-[9px] font-bold text-slate-500 block mb-1">ملاحظات الموظف عند الرفع:</span>
              <p>{activeApproval.submissionNotes}</p>
            </div>
          )}

          {/* Dynamic Approval Actions (إجراءات الرفع والاعتماد) */}
          <div className="pt-3 border-t border-slate-850 space-y-4">
            {/* 1. Employee Controls: Submit or Resubmit for Approval */}
            {(activeApproval.status === 'in_progress' || activeApproval.status === 'rejected_needs_revision') && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">
                  إجراءات الموظف ({activeApproval.employeeName}):
                </span>

                <input
                  type="text"
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="اكتب ملاحظات إنجاز المرحلة قبل الرفع للمدير..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />

                <Button
                  onClick={() => handleSubmitForApproval(selectedStageId)}
                  className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {activeApproval.status === 'rejected_needs_revision'
                      ? 'إعادة رفع وتأكيد طلب الاعتماد للمدير 🔄'
                      : 'رفع طلب اعتماد وإجازة المرحلة للمدير 📤'}
                  </span>
                </Button>
              </div>
            )}

            {/* 2. Direct Manager Controls: Approve or Reject */}
            {activeApproval.status === 'pending_approval' && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                  <Clock className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                  <span>هذه المرحلة مرفوعة ومقدمة للاعتماد والمراجعة من المدير المباشر ({activeApproval.managerName})</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => handleApproveStage(selectedStageId)}
                    className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>إجازة وموافقة المدير المباشر ✅</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsRejecting(true)}
                    className="flex-1 h-10 border-rose-500/40 text-rose-400 hover:bg-rose-500/10 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>رفض وإعادة مع ملاحظات ❌</span>
                  </Button>
                </div>

                {/* Rejection Form Input */}
                {isRejecting && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/30 space-y-2 mt-2">
                    <label className="block text-[10px] font-bold text-rose-300">سبب الرفض والملحوظات المطلوبة من الموظف:</label>
                    <textarea
                      required
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="اكتب النقاط والملحوظات التي يلزم تعديلها قبل الإجازة..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsRejecting(false)}
                        className="h-7 text-[10px] border-slate-800"
                      >
                        إلغاء
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRejectStage(selectedStageId)}
                        className="h-7 text-[10px] bg-rose-600 hover:bg-rose-500 text-white font-bold"
                      >
                        تأكيد الرفض والإعادة للموظف
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Approved status indicator */}
            {activeApproval.status === 'approved' && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>تم إجازة وتأكيد هذه المرحلة رسمياً بواسطة المدير المباشر ({activeApproval.managerName}).</span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

export default JourneyTimeline;
