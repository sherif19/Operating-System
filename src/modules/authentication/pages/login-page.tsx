import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { UserRole } from '@/types/domain.types';

export function LoginPage() {
  const [email, setEmail] = React.useState('owner@company.os');
  const [password, setPassword] = React.useState('••••••••');
  const [isLoading, setIsLoading] = React.useState(false);
  const { switchRole } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/owner/mission-control');
    }, 600);
  };

  const handleQuickDemoRole = (role: UserRole, targetPath: string) => {
    switchRole(role);
    navigate(targetPath);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h2 className="text-xl font-bold text-slate-100">تسجيل الدخول إلى النظام</h2>
        <p className="text-xs text-slate-400">أدخل بيانات حسابك للوصول إلى لوحة المباشرة</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Input
          label="البريد الإلكتروني"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          placeholder="user@company.com"
          required
        />

        <Input
          label="كلمة المرور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="flex items-center justify-between text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500" />
            <span>تذكرني</span>
          </label>
          <a href="#" className="hover:text-indigo-400 transition-colors">نسيت كلمة المرور؟</a>
        </div>

        <Button variant="primary" size="md" isLoading={isLoading} type="submit" className="w-full mt-2">
          <LogIn className="w-4 h-4 me-1" />
          الدخول للوحة القيادة
        </Button>
      </form>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
        <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-slate-900 px-3 text-slate-400 font-bold">معاينة مباشرة بالأدوار</span></div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => handleQuickDemoRole('owner', '/owner/mission-control')}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700/60 text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>منظور المالك</span>
        </button>
        <button
          onClick={() => handleQuickDemoRole('client', '/client/dashboard')}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-violet-600/30 border border-slate-700/60 text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>منظور العميل</span>
        </button>
      </div>
    </div>
  );
}
