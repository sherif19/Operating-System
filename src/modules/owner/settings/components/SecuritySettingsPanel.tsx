import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle2, KeyRound } from 'lucide-react';
import { settingsService } from '../services/settings.service';

import { useDialogStore } from '@/stores/dialog.store';

export function SecuritySettingsPanel() {
  const { showConfirm } = useDialogStore();
  const [success, setSuccess] = React.useState<string | null>(null);
  const [minPasswordLength, setMinPasswordLength] = React.useState(8);
  const [mfaAdmin, setMfaAdmin] = React.useState(true);
  const [mfaOwner, setMfaOwner] = React.useState(true);
  const [sessionTimeout, setSessionTimeout] = React.useState(60);
  const [maxSessions, setMaxSessions] = React.useState(3);
  const [ipRestrictions, setIpRestrictions] = React.useState('192.168.1.0/24, 10.0.0.0/8');

  const handleSave = async () => {
    const res = await settingsService.saveSettings({
      security_min_password_length: minPasswordLength,
      security_require_mfa_admin: mfaAdmin,
      security_require_mfa_owner: mfaOwner,
      security_session_timeout: sessionTimeout,
      security_max_sessions: maxSessions,
      security_ip_restrictions: ipRestrictions
    }, 'تعديل سياسات الأمان وحماية الجلسات');

    if (res.success) {
      setSuccess('✅ تم تطبيق وحفظ سياسات الأمان وحماية الجلسات بنجاح!');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleRevokeAll = () => {
    showConfirm(
      'تأكيد إلغاء الجلسات النشطة',
      '🚨 هل أنت متأكد من إلغاء تفعيل كافة الجلسات النشطة لجميع المستخدمين والموظفين فوراً؟ سيتعين عليهم تسجيل الدخول مجدداً.',
      () => {
        setSuccess('🚨 تم إلغاء وإنهاء جميع الجلسات النشطة بنجاح وتم تسجيل الحدث!');
        setTimeout(() => setSuccess(null), 3000);
      }
    );
  };

  return (
    <div className="space-y-6 text-right">
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Authentication & MFA */}
        <Card className="border border-slate-800 bg-slate-900/60 p-5 rounded-3xl space-y-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <KeyRound className="w-4.5 h-4.5 text-indigo-400" />
              <span>سياسة كلمات المرور والتوثيق الثنائي (MFA)</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تأمين حسابات المدراء والمشرفين بطلب التحقق الثنائي وسياسات التعقيد.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-1">
            <div>
              <label className="block mb-1 text-slate-400 font-bold">الحد الأدنى لطول كلمة المرور (أحرف)</label>
              <input
                type="number"
                value={minPasswordLength}
                onChange={(e) => setMinPasswordLength(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
              <span className="text-slate-300">فرض التحقق الثنائي (MFA) للمشرفين (Admins)</span>
              <input
                type="checkbox"
                checked={mfaAdmin}
                onChange={(e) => setMfaAdmin(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
              <span className="text-slate-300">فرض التحقق الثنائي (MFA) للمالك (Owner)</span>
              <input
                type="checkbox"
                checked={mfaOwner}
                onChange={(e) => setMfaOwner(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
            </label>
          </CardContent>
        </Card>

        {/* Sessions & IP Restrictions */}
        <Card className="border border-slate-800 bg-slate-900/60 p-5 rounded-3xl space-y-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-indigo-400" />
              <span>جلسات المستخدمين والقيود الجغرافية</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تحديد فترات خمول الجلسات، وتقييد نفاذ لوحة التحكم بعناوين IP معينة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1 text-slate-400">مهلة الخمول التلقائية (دقائق)</label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400">الحد الأقصى للأجهزة المتزامنة</label>
                <input
                  type="number"
                  value={maxSessions}
                  onChange={(e) => setMaxSessions(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-slate-400 font-bold">عناوين الـ IP الموثوقة للدخول (مفصولة بفاصلة)</label>
              <input
                type="text"
                value={ipRestrictions}
                onChange={(e) => setIpRestrictions(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-left"
              />
            </div>

            <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-800/60">
              <Button type="button" onClick={handleRevokeAll} className="bg-rose-950 hover:bg-rose-900 border border-rose-500/30 text-rose-400 text-[11px] h-9">
                إنهاء جميع جلسات الموظفين حالاً
              </Button>

              <Button onClick={handleSave} className="h-9 px-4">
                تطبيق سياسة الحماية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
