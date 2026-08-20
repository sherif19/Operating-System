import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CustomersApi } from '../../customers/api/customers.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, Key, User, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '@/stores/auth.store';

import { FirebaseAuthService } from '@/lib/firebase/auth.service';

import { useDialogStore } from '@/stores/dialog.store';

export function ClientRegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCodeParam = searchParams.get('code') || '';

  const { setUser } = useAuthStore();
  const { showAlert } = useDialogStore();

  const [inviteCode, setInviteCode] = React.useState(inviteCodeParam);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [isInviteValid, setIsInviteValid] = React.useState(false);
  const [validationError, setValidationError] = React.useState('');
  const [isCheckingCode, setIsCheckingCode] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);

  // Validate Invitation Code
  const handleVerifyCode = async () => {
    if (!inviteCode.trim()) return;
    setIsCheckingCode(true);
    setValidationError('');

    const invite = await CustomersApi.validateInvite(inviteCode);
    setIsCheckingCode(false);

    if (invite) {
      setIsInviteValid(true);
      if (invite.customerEmail) {
        setEmail(invite.customerEmail);
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

    // 1. Local database collision check
    const customers = await CustomersApi.fetchAll();
    const existsLocally = customers.some(c => c.email.toLowerCase() === checkEmail);
    if (existsLocally) {
      showAlert(
        'البريد الإلكتروني مسجل بالفعل',
        '⚠️ هذا البريد الإلكتروني مسجل بالفعل لعميل آخر في النظام. يرجى استخدام بريد إلكتروني آخر.'
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
      await CustomersApi.consumeInvite(inviteCode);

      // 4. Create customer record attached to organization
      const cust = await CustomersApi.registerCustomer({
        organizationId: 'org-1',
        userId: firebaseUid,
        name,
        email: checkEmail,
        whatsapp,
        companyName: `${name} Co.`,
        currentStage: 'onboarding',
        progress: 10,
        health: 'healthy',
      });

      // 5. Authenticate in current local session
      setUser({
        id: cust.userId,
        email: cust.email,
        displayName: cust.name,
        role: 'client',
        organizationId: cust.organizationId,
        status: 'active',
        createdAt: new Date().toISOString(),
      });

      // Redirect to onboarding welcome bot
      navigate('/client/welcome');
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 space-y-6">
          <div className="text-center flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold text-lg flex items-center justify-center shadow-lg mb-2">
              OS
            </div>
            <h2 className="text-xl font-black text-white">تسجيل حساب العميل الجديد</h2>
            <p className="text-xs text-slate-400">
              يرجى التحقق من كود الدعوة المرسل من إدارة المبيعات لفتح بوابة العملاء.
            </p>
          </div>

          {!isInviteValid ? (
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                أدخل كود الدعوة المعتمد
              </span>
              <div className="flex gap-2">
                <Input
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="INV-XXXX-XXX"
                  className="bg-slate-900 border-slate-800 text-xs text-center font-mono tracking-widest text-indigo-300"
                />
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleVerifyCode}
                  isLoading={isCheckingCode}
                  className="shrink-0"
                >
                  تحقق
                </Button>
              </div>

              {validationError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>كود الدعوة صالح للمؤسسة!</span>
                </span>
                <span className="font-mono font-bold text-xs">{inviteCode}</span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">الاسم الكامل</span>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                    <Input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="محمد أحمد"
                      className="bg-slate-900 border-slate-800 pr-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">البريد الإلكتروني</span>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                    <Input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@mail.com"
                      className="bg-slate-900 border-slate-800 pr-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">رقم الواتساب (WhatsApp)</span>
                  <Input
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="01234567890"
                    className="bg-slate-900 border-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">كلمة المرور</span>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                    <Input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-slate-900 border-slate-800 pr-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center mt-6"
                isLoading={isRegistering}
              >
                تأكيد التسجيل وإنشاء مساحة العمل
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
export default ClientRegisterPage;
