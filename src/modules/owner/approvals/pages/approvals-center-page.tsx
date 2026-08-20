import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { CheckSquare, Check, X, Eye, Paperclip, Calendar } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { ApprovalsDB } from '../services/approvals-db';
import { ApprovalItem } from '../types/approvals.types';
import { ApprovalDetailsModal } from '../components/ApprovalDetailsModal';
import { SubmitLeaveRequestModal } from '@/components/modals/SubmitLeaveRequestModal';

export function ApprovalsCenterPage() {
  const { user } = useAuthStore();
  const [approvalsTab, setApprovalsTab] = React.useState<'pending' | 'approved' | 'rejected'>('pending');
  const [items, setItems] = React.useState<ApprovalItem[]>([]);
  const [selectedApproval, setSelectedApproval] = React.useState<ApprovalItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);
  const [showLeaveModal, setShowLeaveModal] = React.useState(false);

  // Admin / Owner does NOT submit leave requests
  const canSubmitLeave = user?.role === 'employee' || user?.role === 'trainer' || user?.role === 'customer_service' || user?.role === 'manager';

  const loadApprovals = React.useCallback(() => {
    setItems(ApprovalsDB.getApprovals());
  }, []);

  React.useEffect(() => {
    loadApprovals();
    window.addEventListener('approvals_updated', loadApprovals);
    return () => window.removeEventListener('approvals_updated', loadApprovals);
  }, [loadApprovals]);

  const handleOpenDetails = (item: ApprovalItem) => {
    setSelectedApproval(item);
    setShowDetailsModal(true);
  };

  const handleActionDirect = (e: React.MouseEvent, id: string, status: 'approved' | 'rejected') => {
    e.stopPropagation();
    ApprovalsDB.updateStatus(id, status);
    loadApprovals();
  };

  const filtered = items.filter((i) => i.status === approvalsTab);

  const getItemIcon = (category: ApprovalItem['category']) => {
    switch (category) {
      case 'leave':
        return { text: '🏖️', bg: 'bg-indigo-600/20 border border-indigo-500/30' };
      case 'invoice':
        return { text: '🧾', bg: 'bg-indigo-600/20 border border-indigo-500/30' };
      case 'proposal':
        return { text: '📑', bg: 'bg-emerald-600/20 border border-emerald-500/30' };
      case 'content':
        return { text: '🎨', bg: 'bg-purple-600/20 border border-purple-500/30' };
      case 'refund':
        return { text: '💳', bg: 'bg-rose-600/20 border border-rose-500/30' };
      default:
        return { text: '📌', bg: 'bg-cyan-600/20 border border-cyan-500/30' };
    }
  };

  return (
    <div className="flex flex-col gap-6 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px]">
            <CheckSquare className="w-3.5 h-3.5 me-1" />
            مركز الموافقات والاعتمادات البشرية
          </Badge>
          <h1 className="text-2xl font-black text-white mt-0.5">إدارة طلبات الاعتماد والمعلقات</h1>
          <p className="text-xs text-slate-400">
            اضغط على أي طلب لاستعراض التفاصيل الكاملة، إرفاق الملفات والمستندات، واتخاذ قرار الاعتماد أو الرفض بالتبرير.
          </p>
        </div>

        {canSubmitLeave && (
          <Button
            onClick={() => setShowLeaveModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <Calendar className="w-4 h-4" />
            <span>تقديم طلب إجازة جديد 🏖️</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'pending', label: `معلّقة (${items.filter((i) => i.status === 'pending').length})` },
          { id: 'approved', label: `معتمدة (${items.filter((i) => i.status === 'approved').length})` },
          { id: 'rejected', label: `مرفوضة (${items.filter((i) => i.status === 'rejected').length})` },
        ]}
        activeTab={approvalsTab}
        onChange={(id) => setApprovalsTab(id as any)}
      />

      {/* Approvals List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const iconConfig = getItemIcon(item.category);
            return (
              <Card
                key={item.id}
                onClick={() => handleOpenDetails(item)}
                className="hover:border-indigo-500/50 transition-all cursor-pointer group bg-slate-900/90 border-slate-800 p-5 shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${iconConfig.bg} text-lg font-extrabold flex items-center justify-center shrink-0 shadow-inner`}>
                      {iconConfig.text}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                          <span>{item.title}</span>
                          <Eye className="w-3.5 h-3.5 text-cyan-400 opacity-80" />
                        </h3>
                        {item.attachments.length > 0 && (
                          <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[9px] flex items-center gap-1">
                            <Paperclip className="w-3 h-3 text-indigo-400" /> {item.attachments.length} مرفقات
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-300">{item.detail}</p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        مقدم الطلب: {item.requesterName} ({item.department}) · {item.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'pending' ? (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => handleActionDirect(e, item.id, 'rejected')}
                          className="gap-1 text-xs font-bold px-3 py-1.5 h-8 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>رفض</span>
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => handleActionDirect(e, item.id, 'approved')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1 text-xs font-bold px-3 py-1.5 h-8 cursor-pointer shadow-md shadow-emerald-600/20"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>اعتماد الطلب</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetails(item);
                        }}
                        className="text-xs font-bold border-slate-800 text-slate-300 hover:text-white h-8"
                      >
                        <Eye className="w-3.5 h-3.5 me-1 text-indigo-400" />
                        عرض التفاصيل
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            لا توجد طلبات موافقة في هذه الحالة حالياً.
          </div>
        )}
      </div>

      {/* Approval Details Modal */}
      <ApprovalDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        approval={selectedApproval}
        onUpdate={loadApprovals}
      />

      {/* Submit Leave Modal */}
      {canSubmitLeave && (
        <SubmitLeaveRequestModal
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
        />
      )}
    </div>
  );
}

export default ApprovalsCenterPage;
