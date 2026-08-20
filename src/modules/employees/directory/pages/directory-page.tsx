import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { EmployeesApi } from '../../api/employees.api';
import { EmployeeProfile } from '../../types/domain.types';
import { Search, Sparkles, Filter, Bot, UserPlus, Copy, CheckCircle2, Trash2 } from 'lucide-react';
import { settingsService } from '@/modules/owner/settings/services/settings.service';
import { DepartmentsService, Department } from '@/modules/departments/services/departments.service';

import { useDialogStore } from '@/stores/dialog.store';

export function DirectoryPage() {
  const navigate = useNavigate();
  const { showConfirm } = useDialogStore();
  const [employees, setEmployees] = React.useState<EmployeeProfile[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [isLoading, setIsLoading] = React.useState(true);

  // Invite modal states
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [role, setRole] = React.useState('Employee');
  const [emailMatch, setEmailMatch] = React.useState('');
  const [selectedDept, setSelectedDept] = React.useState('');
  const [generatedCode, setGeneratedCode] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [departments, setDepartments] = React.useState<Department[]>([]);

  React.useEffect(() => {
    EmployeesApi.fetchAll().then((data) => {
      setEmployees(data);
      setIsLoading(false);
    });

    const depts = DepartmentsService.getDepartments();
    setDepartments(depts);
    if (depts.length > 0) {
      setSelectedDept(depts[0].id);
    }
  }, []);

  const handleGenerateInvite = () => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newLink = settingsService.createInviteLink({
      role,
      isOneTime: true,
      emailMatch: emailMatch || undefined,
      orgMatch: 'أكاديمية المستبصرين',
      expiresAt: expiresAt.toISOString().replace('T', ' ').substring(0, 19),
      department: selectedDept
    });

    setGeneratedCode(newLink.code);
  };

  const generatedLink = `${window.location.origin}/auth/employee-register?code=${generatedCode}`;

  const handleCopy = () => {
    const textToCopy = generatedLink;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => fallbackCopy(textToCopy));
    } else {
      fallbackCopy(textToCopy);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
    }
    
    document.body.removeChild(textArea);
  };

  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
    setGeneratedCode('');
    setEmailMatch('');
  };

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    showConfirm(
      'تأكيد حذف الموظف نهائياً',
      `🚨 هل أنت متأكد من حذف الموظف "${name}" نهائياً من النظام؟ سيتم محو كافة بياناته والاتصال بالـ Cloud Function لإزالة حسابه من Firebase Authentication.`,
      async () => {
        await EmployeesApi.deleteEmployee(id);
        setEmployees(employees.filter((emp) => emp.id !== id));
      }
    );
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col gap-6 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3 h-3 me-1.5 animate-pulse" />
            نظام تشغيل وإدارة الموظفين — OS Team
          </Badge>
          <h1 className="text-2xl font-black text-white">دليل الكفاءات والموظفين</h1>
          <p className="text-xs text-slate-400">
            تتبع أداء الموظفين، توزيع المهام، القدرة الاستيعابية الفورية، ومعدلات الفروق الزمنية للإنتاج.
          </p>
        </div>

        {/* Invite Employee Button */}
        <Button 
          variant="primary" 
          size="md" 
          onClick={() => setIsInviteModalOpen(true)} 
          className="gap-2 z-10 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>توليد دعوة موظف جديد</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الموظف، البريد، أو المسمى الوظيفي..."
            className="bg-slate-900 border-slate-800 pr-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 overflow-x-auto py-1">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {[
            { id: 'all', label: 'كل الموظفين' },
            { id: 'owner', label: 'الإدارة العليا' },
            { id: 'manager', label: 'مدراء الأقسام' },
            { id: 'trainer', label: 'كوتش / مدرب' },
            { id: 'employee', label: 'موظف تشغيلي' },
            { id: 'customer_service', label: 'خدمة عملاء' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setRoleFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                roleFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-indigo-400 flex items-center justify-center gap-2">
          <Bot className="w-4 h-4 animate-spin" />
          <span>جاري تحميل ملفات الموظفين...</span>
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="overflow-x-auto rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800/85 bg-slate-950/60 text-slate-400 text-xs font-black select-none">
                <th className="p-4 pr-6 text-right">الموظف والبريد</th>
                <th className="p-4 text-right">الدور الوظيفي</th>
                <th className="p-4 text-right">القسم</th>
                <th className="p-4 text-right">الحالة</th>
                <th className="p-4 text-right">القدرة الاستيعابية / ضغط العمل</th>
                <th className="p-4 text-center">العملاء</th>
                <th className="p-4 text-center">تاريخ الانضمام</th>
                <th className="p-4 text-left pl-6">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => {
                const getRoleBadge = (role: string) => {
                  switch (role) {
                    case 'owner':
                      return <Badge className="bg-rose-500/10 border border-rose-500/30 text-rose-400 font-extrabold text-[10px]">إدارة عليا</Badge>;
                    case 'manager':
                      return <Badge className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-[10px]">مدير قسم</Badge>;
                    case 'trainer':
                      return <Badge className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-extrabold text-[10px]">كوتش / مدرب</Badge>;
                    case 'employee':
                      return <Badge className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-extrabold text-[10px]">موظف تشغيلي</Badge>;
                    default:
                      return <Badge className="bg-slate-500/10 border border-slate-800 text-slate-400 font-extrabold text-[10px]">خدمة عملاء</Badge>;
                  }
                };

                const statusColor =
                  emp.status === 'active'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : emp.status === 'away'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-400';

                // Find department name
                const dept = departments.find(d => d.id === emp.departmentId);
                const deptName = dept ? dept.name : 'الإدارة العليا';

                return (
                  <tr
                    key={emp.id}
                    onClick={() => navigate(`/owner/employees/${emp.id}`)}
                    className="border-b border-slate-850 hover:bg-slate-800/30 transition-all duration-150 cursor-pointer text-[11px] text-slate-300 font-bold group"
                  >
                    {/* User profile info */}
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-black flex items-center justify-center text-xs shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-200">
                          {emp.name[0]}
                        </div>
                        <div className="flex flex-col truncate max-w-[180px]">
                          <span className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors">{emp.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono font-normal mt-0.5 truncate">{emp.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">{getRoleBadge(emp.role)}</td>

                    {/* Department */}
                    <td className="p-4 text-slate-400">{deptName}</td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black ${statusColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{emp.status === 'active' ? 'نشط' : emp.status === 'away' ? 'خارج العمل' : 'إجازة'}</span>
                      </span>
                    </td>

                    {/* Workload Progress Bar */}
                    <td className="p-4 min-w-[150px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
                          <span className="text-cyan-400">{emp.workloadScore}%</span>
                        </div>
                        <div className="w-28 h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-900">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                            style={{ width: `${emp.workloadScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Assigned Customers */}
                    <td className="p-4 text-center text-white font-mono">{emp.assignedCustomersCount}</td>

                    {/* Joined Date */}
                    <td className="p-4 text-center font-mono text-slate-400">{emp.joinedAt}</td>

                    {/* Actions */}
                    <td className="p-4 text-left pl-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => handleDelete(e, emp.id, emp.name)}
                          className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
                          title="حذف الموظف نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-16 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-dashed border-slate-850">
          لم يتم العثور على موظفين يطابقون خيارات البحث.
        </div>
      )}

      {/* Invite Employee Modal Dialog */}
      <Dialog 
        isOpen={isInviteModalOpen} 
        onClose={handleCloseModal}
        title="توليد دعوة موظف جديد"
        description="أنشئ رابطاً مشفراً ومباشراً للموظفين والمدربين الجدد للتسجيل في النظام."
        className="max-w-md bg-slate-950 border border-slate-800 text-right text-xs"
      >
        <div className="space-y-4 pt-2">
          {!generatedCode ? (
            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 text-slate-400 font-bold">الدور الوظيفي الممنوح</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="Employee">موظف تشغيلي (Employee)</option>
                  <option value="Trainer">مدرب / كوتش (Trainer)</option>
                  <option value="Manager">مدير قسم (Manager)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-400 font-bold">القسم التابع له الموظف</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.engName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-400 font-bold">تحديد بريد الموظف للتطابق (اختياري)</label>
                <input
                  type="email"
                  value={emailMatch}
                  onChange={(e) => setEmailMatch(e.target.value)}
                  placeholder="employee@company.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-left placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/80"
                />
              </div>

              <Button onClick={handleGenerateInvite} className="w-full h-10 mt-2">
                توليد رابط الدعوة المباشر
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center py-2">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>تم إنشاء رابط الدعوة المشفر بنجاح!</span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 block">قم بنسخ الرابط المباشر وأرسله للموظف للتسجيل:</span>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[10px] text-cyan-400 break-all select-all flex flex-col gap-2 items-center">
                  <div className="w-full bg-slate-950 p-2 rounded text-slate-300 text-left truncate">
                    {generatedLink}
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-indigo-650 hover:bg-indigo-500 text-white transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-sans w-full justify-center"
                  >
                    {copied ? 'تم النسخ!' : <><Copy className="w-3.5 h-3.5" /> نسخ الرابط المباشر</>}
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-right leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/40">
                💡 **ملاحظة**: هذا الرابط صالح للاستخدام لمرة واحدة فقط وينتهي تلقائياً بعد 7 أيام من تاريخ اليوم حماية للنظام.
              </div>

              <Button variant="outline" onClick={handleCloseModal} className="w-full h-9">
                إغلاق
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
export default DirectoryPage;
