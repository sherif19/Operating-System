import React from 'react';
import { DepartmentOSService } from './services/departments.service';
import { DepartmentEmployeePerformance } from './types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Sparkles, Users, UserPlus, Link2, Copy, Check, MessageSquare, BarChart2, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { settingsService } from '@/modules/owner/settings/services/settings.service';
import { InviteLink } from '@/modules/owner/settings/types/settings.types';
import { EmployeesDB } from '@/modules/employees/services/employees-db';
import { EmployeeDashboardModal } from './components/EmployeeDashboardModal';

export function DepartmentTeam() {
  const [team, setTeam] = React.useState<DepartmentEmployeePerformance[]>([]);
  const [selectedEmp, setSelectedEmp] = React.useState<DepartmentEmployeePerformance | null>(null);
  const [coachingPlan, setCoachingPlan] = React.useState('');
  const [showCoachingModal, setShowCoachingModal] = React.useState(false);

  // Employee Dashboard Modal State
  const [showEmpDashboard, setShowEmpDashboard] = React.useState(false);
  const [activeEmpForDashboard, setActiveEmpForDashboard] = React.useState<{ userId: string; userName: string; role: string } | null>(null);

  // Invite Modal & Link State
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [inviteRole] = React.useState('employee');
  const [jobTitle, setJobTitle] = React.useState('');
  const [targetEmail, setTargetEmail] = React.useState('');
  const [expiresDays, setExpiresDays] = React.useState('7');

  const [generatedInvite, setGeneratedInvite] = React.useState<InviteLink | null>(null);
  const [copiedLink, setCopiedLink] = React.useState(false);

  const loadTeam = React.useCallback(() => {
    const allEmps = EmployeesDB.getEmployees();
    const deptEmps = allEmps.filter(
      (e) => e.departmentId === 'dept-exec-1' || e.departmentId === 'Execution' || e.departmentId === 'execution'
    );

    if (deptEmps.length > 0) {
      const mapped: DepartmentEmployeePerformance[] = deptEmps.map((e) => ({
        userId: e.id,
        userName: e.name,
        role: e.role === 'manager' ? 'مدير قسم' : 'عضو كادر بالقسم',
        acceptedTasksCount: e.activeTasksCount || 0,
        completedTasksCount: 0,
        avgExecutionTimeMinutes: 0,
        targetExecutionTimeMinutes: 60,
        complianceScore: 100,
        trend: 'STABLE',
        activeWorkload: e.activeTasksCount || 0,
        skills: e.skills || ['التنفيذ التشغيلي'],
      }));
      setTeam(mapped);
    } else {
      setTeam(DepartmentOSService.getTeamPerformance());
    }
  }, []);

  React.useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  const handleOpenEmployeeDashboard = (emp: DepartmentEmployeePerformance) => {
    setActiveEmpForDashboard({
      userId: emp.userId,
      userName: emp.userName,
      role: emp.role,
    });
    setShowEmpDashboard(true);
  };

  const handleGenerateInviteLink = (e: React.FormEvent) => {
    e.preventDefault();

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(expiresDays, 10));
    const expiresAtStr = expiryDate.toISOString().split('T')[0];

    const newLink = settingsService.createInviteLink({
      role: inviteRole as any,
      department: 'dept-exec-1',
      emailMatch: targetEmail.trim() || undefined,
      expiresAt: expiresAtStr,
      isOneTime: true,
    });

    setGeneratedInvite(newLink);
  };

  const getFullInviteUrl = (code: string) => {
    return `${window.location.origin}/employee-register?code=${code}`;
  };

  const handleCopyLink = (code: string) => {
    const url = getFullInviteUrl(code);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenCoaching = (emp: DepartmentEmployeePerformance) => {
    setSelectedEmp(emp);
    setCoachingPlan('');
    setShowCoachingModal(true);
  };

  const handleSaveCoachingPlan = () => {
    alert(`تم تسجيل خطة التطوير والتدريب المباشر للموظف ${selectedEmp?.userName} بنجاح.`);
    setShowCoachingModal(false);
  };

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px]">
              Team Roster & Employee Dashboards — كادر وتطوير القسم
            </Badge>
            <span className="text-[10px] font-mono text-cyan-300 font-bold">العدد الحالي: {team.length} موظفين</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">فريق العمل ودعوات الانضمام المباشرة</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            اضغط على أي موظف لفتح لوحة التحكم الخاصة بعملائه وتاسكاته وإحصائيات نسبة الإنجاز والمهام المتبقية.
          </p>
        </div>

        <Button
          onClick={() => {
            setGeneratedInvite(null);
            setShowInviteModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>إرسال رابط دعوة موظف جديد 🔗</span>
        </Button>
      </div>

      {/* Team Roster Grid or Empty State */}
      {team.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((emp) => (
            <motion.div key={emp.userId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 flex flex-col justify-between h-full hover:border-indigo-500/50 transition-all cursor-pointer group">
                <div className="space-y-3" onClick={() => handleOpenEmployeeDashboard(emp)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center font-bold text-indigo-300 text-sm">
                        {emp.userName[0]}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                          <span>{emp.userName}</span>
                          <BarChart2 className="w-3.5 h-3.5 text-cyan-400 opacity-80" />
                        </h3>
                        <span className="text-[10px] text-slate-400 block">{emp.role}</span>
                      </div>
                    </div>

                    {emp.trend === 'IMPROVING' && (
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[9px] flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> تصاعدي
                      </Badge>
                    )}
                    {emp.trend === 'STABLE' && (
                      <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 text-[9px] flex items-center gap-1">
                        <Minus className="w-3 h-3" /> مستقر
                      </Badge>
                    )}
                    {emp.trend === 'DECLINING' && (
                      <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/40 text-[9px] flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" /> يحتاج توجيه
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-850 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-500 block">حمولة العمل الحالية</span>
                      <strong className="text-cyan-300 font-bold">{emp.activeWorkload} مهام نشطة</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">درجة الالتزام (Compliance)</span>
                      <strong className="text-emerald-400 font-mono font-bold">{emp.complianceScore}%</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-850 grid grid-cols-1 gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleOpenEmployeeDashboard(emp)}
                    className="w-full text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white h-8 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-cyan-300" />
                    <span>لوحة عملاء وتاسكات الموظف 📊</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenCoaching(emp)}
                    className="w-full text-[10px] font-bold border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50 h-7 flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>توجيه ومخاطبة دافعية (Coaching Plan)</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 bg-slate-900/60 border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-white">لم يتم إضافة موظفين في هذا القسم بعد (0 موظفين)</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              قم بتوليد رابط دعوة مخصص وإرساله إلى الموظفين للانضمام والتسجيل المباشر داخل قسم التنفيذ والإنتاج.
            </p>
          </div>
          <Button
            onClick={() => {
              setGeneratedInvite(null);
              setShowInviteModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-6 py-2.5 rounded-2xl shadow-lg shadow-indigo-600/30"
          >
            <Link2 className="w-4 h-4 me-2" />
            إنشاء وإرسال رابط دعوة موظف جديد 🔗
          </Button>
        </Card>
      )}

      {/* Employee Dashboard Modal */}
      {activeEmpForDashboard && (
        <EmployeeDashboardModal
          isOpen={showEmpDashboard}
          onClose={() => setShowEmpDashboard(false)}
          employee={activeEmpForDashboard}
        />
      )}

      {/* Invite Employee Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-indigo-400" />
                <span>دعوة موظف جديد لانضمام المباشر للقسم</span>
              </h3>
              <Badge className="bg-indigo-500/10 text-indigo-400 text-[10px]">قسم التنفيذ والإنتاج</Badge>
            </div>

            {!generatedInvite ? (
              <form onSubmit={handleGenerateInviteLink} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">المسمى الوظيفي المرتقب للموظف</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="مثال: مطور واجهات / أخصائي خدمة عملاء..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">البريد الإلكتروني المخصص (اختياري)</label>
                  <input
                    type="email"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="name@company.com (اتركه فارغاً لدعوة عامة)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">مدة صلاحية رابط الدعوة</label>
                  <select
                    value={expiresDays}
                    onChange={(e) => setExpiresDays(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="3">3 أيام</option>
                    <option value="7">7 أيام (موصى به)</option>
                    <option value="30">30 يوم</option>
                  </select>
                </div>

                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[10px] text-indigo-300 leading-relaxed">
                  💡 عند فتح الموظف لهذا الرابط والتسجيل، سيتم تعيين حسابه وادراجه تلقائياً داخل قسم التنفيذ والإنتاج الرقمي مباشرة.
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowInviteModal(false)} className="text-xs text-slate-400">
                    إلغاء
                  </Button>
                  <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4">
                    توليد رابط الدعوة 🔗
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block">رابط الدعوة المباشر للقسم:</span>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-850 text-[11px] text-indigo-300 font-mono break-all flex items-center justify-between gap-2">
                    <span>{getFullInviteUrl(generatedInvite.code)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={() => handleCopyLink(generatedInvite.code)}
                    className={`w-full text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 ${
                      copiedLink ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط الدعوة'}</span>
                  </Button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`دعوة انضمام لكادر الشركة في قسم التنفيذ والإنتاج الرقمي:\n${getFullInviteUrl(generatedInvite.code)}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>مشاركة عبر واتساب</span>
                  </a>
                </div>

                <div className="flex items-center justify-end border-t border-slate-800 pt-3">
                  <Button variant="ghost" size="sm" onClick={() => setShowInviteModal(false)} className="text-xs text-slate-400">
                    إغلاق
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coaching Plan Modal */}
      {showCoachingModal && selectedEmp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>إعداد خطة توجيه فردية — {selectedEmp.userName}</span>
              </h3>
              <Badge className="bg-indigo-500/10 text-indigo-400 text-[10px]">توجيه داخلي</Badge>
            </div>

            <p className="text-xs text-slate-400">
              يتيح هذا الإجراء لمدير القسم وضع توصيات ودعم توجيهي دون أي خصومات أو عقوبات آليّة.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">نص التوصية وخطة الدعم والمتابعة:</label>
              <textarea
                rows={4}
                value={coachingPlan}
                onChange={(e) => setCoachingPlan(e.target.value)}
                placeholder="اكتب التوجيه الفردي، التحديات المراد تذليلها، والأهداف القادمة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setShowCoachingModal(false)} className="text-xs text-slate-400">
                إلغاء
              </Button>
              <Button size="sm" onClick={handleSaveCoachingPlan} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs">
                حفظ وإرسال التوجيه
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentTeam;
