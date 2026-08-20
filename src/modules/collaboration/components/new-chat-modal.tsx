import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, UserPlus, Phone, ShieldCheck, Briefcase } from 'lucide-react';
import { EmployeesDB } from '../../employees/services/employees-db';
import { EmployeeProfile } from '../../employees/types/domain.types';
import { Input } from '@/components/ui/input';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmployee: (employeeId: string, employeeName: string, avatarUrl?: string) => void;
}

export function NewChatModal({ isOpen, onClose, onSelectEmployee }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [employees, setEmployees] = React.useState<EmployeeProfile[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      const list = EmployeesDB.getEmployees();
      setEmployees(list);
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      (emp.skills && emp.skills.some((s) => s.toLowerCase().includes(query)))
    );
  });

  const getRoleBadgeLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'المالك والمدير التنفيذي';
      case 'manager':
        return 'مدير القسم';
      case 'trainer':
        return 'مدرب وخبير كوتشينج';
      case 'employee':
        return 'منفذ أعمال';
      case 'customer_service':
        return 'خدمة العملاء والدعم';
      default:
        return 'عضو الفريق';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-lg bg-[#111b21] border border-[#222e35] rounded-3xl p-5 shadow-2xl text-right text-[#e9edef] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#222e35] pb-3.5 mb-4">
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <h3 className="text-sm font-extrabold text-[#e9edef] flex items-center gap-1.5 justify-end">
                    <span>بدء دردشة جديدة</span>
                    <UserPlus className="w-4 h-4 text-[#00a884]" />
                  </h3>
                  <p className="text-[10px] text-[#8696a0] mt-0.5">
                    اختر أحداً من الموظفين والإدارة للبدء في مراسلته فوراً.
                  </p>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-[#8696a0] absolute right-3 top-2.5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الموظف، المسمى الوظيفي أو التخصص..."
                className="bg-[#202c33] border-transparent text-[#e9edef] pr-9 text-xs h-9 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00a884] placeholder:text-[#8696a0]"
              />
            </div>

            {/* Employee List */}
            <div className="max-h-80 overflow-y-auto space-y-2 no-scrollbar pr-1">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => {
                  const roleTitle = getRoleBadgeLabel(emp.role);
                  return (
                    <button
                      key={emp.id}
                      onClick={() => {
                        onSelectEmployee(emp.id, emp.name);
                        onClose();
                      }}
                      className="w-full text-right p-3 rounded-2xl bg-[#202c33]/70 hover:bg-[#202c33] border border-[#222e35] hover:border-[#00a884]/50 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-[#111b21] border border-[#222e35] flex items-center justify-center font-black text-sm text-[#00a884] shrink-0 group-hover:scale-105 transition-transform">
                          {emp.name[0]}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="font-extrabold text-xs text-[#e9edef] truncate group-hover:text-[#00a884] transition-colors">
                            {emp.name}
                          </span>
                          <span className="text-[10px] text-[#8696a0] flex items-center gap-1 mt-0.5">
                            <Briefcase className="w-3 h-3 text-slate-500" />
                            <span>{roleTitle}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[9px] text-[#8696a0] font-mono flex items-center gap-1 dir-ltr">
                          <Phone className="w-2.5 h-2.5 text-[#00a884]" />
                          {emp.phoneNumber || '01009876500'}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#00a884]/10 text-[#00a884] font-bold border border-[#00a884]/20 flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>نشط الآن</span>
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-[#8696a0]">
                  لم يتم العثور على أي موظف مطابق للبحث.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
