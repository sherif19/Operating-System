import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { FirebaseAuthService } from '@/lib/firebase/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminLoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const loggedUser = await FirebaseAuthService.login(email, password, 'owner');
      setUser(loggedUser);
      navigate('/owner/mission-control');
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل تسجيل الدخول. يرجى التأكد من البيانات.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-right w-full">
      {/* Header matching the spec image */}
      <div className="flex flex-col gap-1 text-right">
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
          Login your account
        </span>
        <h2 className="text-3xl font-black text-white tracking-tight mt-0.5">
          Welcome Back!
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Enter your email and password (بوابة الإدارة العليا)
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4 text-slate-500" />}
            placeholder="Hello@company.os"
            className="bg-[#0a0f24]/30 border-slate-800/80 rounded-2xl focus:border-blue-500/80 focus:ring-blue-500/10 focus:shadow-[0_0_20px_rgba(59,130,246,0.25)] h-12 transition-all duration-300 placeholder:text-slate-700"
            required
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-slate-500" />}
              placeholder="Enter your password"
              className="bg-[#0a0f24]/30 border-slate-800/80 rounded-2xl focus:border-blue-500/80 focus:ring-blue-500/10 focus:shadow-[0_0_20px_rgba(59,130,246,0.25)] h-12 transition-all duration-300 placeholder:text-slate-700"
              required
            />
            <div className="flex justify-end pt-1">
              <a href="#" className="text-[11px] text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>
        </div>

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-300 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        <Button 
          variant="primary" 
          size="md" 
          isLoading={isLoading} 
          type="submit" 
          whileHover={{ scale: 1.01 }}
          className="w-full bg-[#0a0a0c] hover:bg-slate-900 shadow-xl shadow-black/30 border border-slate-800 rounded-2xl h-12 text-sm font-bold text-slate-200 hover:text-white"
        >
          <LogIn className="w-4 h-4 me-1.5" />
          Sign in
        </Button>
      </form>

      {/* Switch Portal Links */}
      <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 pt-5 border-t border-slate-900">
        <Link to="/auth/client-login" className="hover:text-blue-500 transition-colors duration-300 relative group py-1 font-bold">
          <span>بوابة العملاء</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
        </Link>
        <span className="text-slate-800">•</span>
        <Link to="/auth/employee-login" className="hover:text-blue-500 transition-colors duration-300 relative group py-1 font-bold">
          <span>بوابة الموظفين</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
        </Link>
      </div>
    </div>
  );
}
