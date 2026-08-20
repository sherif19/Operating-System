import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, Key, User, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '@/stores/auth.store';
import { settingsService } from '@/modules/owner/settings/services/settings.service';
import { EmployeesDB } from '@/modules/employees/services/employees-db';

import { FirebaseAuthService } from '@/lib/firebase/auth.service';
import { useDialogStore } from '@/stores/dialog.store';

export function EmployeeRegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCodeParam = searchParams.get('code') || '';

  const { setUser } = useAuthStore();
  const { showAlert } = useDialogStore();

  const [inviteCode, setInviteCode] = React.useState(inviteCodeParam);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [isInviteValid, setIsInviteValid] = React.useState(false);
  const [assignedRole, setAssignedRole] = React.useState('');
  const [assignedDept, setAssignedDept] = React.useState('');
  const [validationError, setValidationError] = React.useState('');
  const [isCheckingCode, setIsCheckingCode] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);

  // Validate Invitation Code
  const handleVerifyCode = async () => {
    if (!inviteCode.trim()) return;
    setIsCheckingCode(true);
    setValidationError('');

    const invite = settingsService.validateInviteCode(inviteCode);
    setIsCheckingCode(false);

    if (invite) {
      setIsInviteValid(true);
      setAssignedRole(invite.role);
      setAssignedDept(invite.department || 'Execution');
      if (invite.emailMatch) {
        setEmail(invite.emailMatch);
      }
    } else {
      setValidationError('كود الدعوة هذا غير صالح، منتهي الصلاحية أو مستخدم مسبقاً.');
      setIsInviteValid(false);
    }
  };

  React.useEffect(() => {
    if (inviteCodeParam) {
      handleVerifyCode();
    }
  }, [inviteCodeParam]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInviteValid) return;
    setIsRegistering(true);

    const checkEmail = email.trim().toLowerCase();

    // 1. Local check
    const existsLocally = EmployeesDB.getEmployees().some(emp => emp.email.toLowerCase() === checkEmail);
    if (existsLocally) {
      showAlert(
        'البريد الإلكتروني مسجل بالفعل',
        '⚠️ هذا البريد الإلكتروني مسجل بالفعل لموظف آخر في النظام. يرجى استخدام بريد إلكتروني آخر.'
      );
      setIsRegistering(false);
      return;
    }

    try {
      // 2. Create user in Firebase Auth
      let firebaseUid = '';
      try {
        firebaseUid = await FirebaseAuthService.signup(checkEmail, password);
      } catch (authErr: any) {
        console.error(authErr);
        if (authErr.code === 'auth/email-already-in-use' || authErr.message?.includes('email-already-in-use')) {
          showAlert(
            'حساب مسجل بالفعل',
            '⚠️ هذا البريد الإلكتروني مستخدم بالفعل ومسجل في خوادم النظام. يرجى استخدام بريد إلكتروني آخر للتسجيل.'
          );
        } else {
          showAlert(
            'فشل تفعيل الحساب',
            `⚠️ تعذر إنشاء حسابك في خادم التحقق: ${authErr.message || authErr}`
          );
        }
        setIsRegistering(false);
        return;
      }

      // 3. Consume Invitation code
      settingsService.consumeInviteCode(inviteCode);

      // 4. Create employee record in database
      const newEmps = EmployeesDB.getEmployees();
      newEmps.push({
        id: firebaseUid,
        name,
        email: checkEmail,
        role: assignedRole.toLowerCase() as any,
        departmentId: assignedDept,
        status: 'active',
        joinedAt: new Date().toISOString().split('T')[0],
        workloadScore: 0,
        assignedCustomersCount: 0,
        activeTasksCount: 0,
        phoneNumber: '',
        skills: [],
        personalGoals: []
      });
      EmployeesDB.saveEmployees(newEmps);

      // 5. Authenticate in current session
      const mappedRole = assignedRole.toLowerCase(); // 'manager', 'employee', 'trainer'
      setUser({
        id: firebaseUid,
        email: checkEmail,
        displayName: name,
        role: mappedRole as any,
        organizationId: 'org-1',
        status: 'active',
        createdAt: new Date().toISOString(),
      });

      // Redirect to correct dashboard
      if (mappedRole === 'manager') {
        navigate('/manager/department');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegistering(false);
    }
  };

  const getRoleArabicLabel = (role: string) => {
    const roles: Record<string, string> = {
      Employee: 'موظف تشغيلي',
      Trainer: 'مدرب / كوتش',
      Manager: 'مدير قسم'
    };
    return roles[role] || role;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-right text-xs"
      >
        <Card className="p-6 space-y-6 bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
          
          <div className="text-center flex flex-col items-center gap-1.5 z-10 relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-black text-lg flex items-center justify-center shadow-lg mb-2">
              OS
            </div>
            <h2 className="text-xl font-black text-white">تسجيل حساب موظف جديد</h2>
            <p className="text-xs text-slate-400">
              يرجى التحقق من كود الدعوة المشفر المرسل من الإدارة العليا لتفعيل حساب الموظف.
            </p>
          </div>

          {!isInviteValid ? (
            <div className="space-y-4 z-10 relative">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                أدخل كود الدعوة المعتمد
              </span>
              <div className="flex gap-2">
                <Input
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="كود الدعوة (مثال: ACC-JOIN-XXXX)"
                  className="bg-slate-950 border-slate-850 text-xs text-center font-mono tracking-widest text-indigo-300 placeholder:text-slate-700"
                />
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleVerifyCode}
                  isLoading={isCheckingCode}
                  className="shrink-0 cursor-pointer"
                >
                  تحقق
                </Button>
              </div>

              {validationError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 z-10 relative">
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-[10px] text-emerald-400 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">تهانينا! كود الدعوة الموجه للموظف صالح وفعال.</span>
                </div>
                <div className="border-t border-emerald-500/10 pt-1.5 mt-1.5 grid grid-cols-2 gap-2 text-slate-300">
                  <span>الدور: <strong>{getRoleArabicLabel(assignedRole)}</strong></span>
                  <span>القسم: <strong>{assignedDept}</strong></span>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-400 font-bold">الاسم بالكامل</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: يوسف الشريف"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl pr-9 pl-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500/80"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-400 font-bold">البريد الإلكتروني المهني</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="employee@company.os"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl pr-9 pl-3 py-2.5 text-slate-200 text-left focus:outline-none focus:border-indigo-500/80"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-400 font-bold">كلمة المرور</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl pr-9 pl-3 py-2.5 text-slate-200 text-left focus:outline-none focus:border-indigo-500/80"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-10 mt-3" isLoading={isRegistering}>
                تأكيد التسجيل وتفعيل الحساب
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
export default EmployeeRegisterPage;
