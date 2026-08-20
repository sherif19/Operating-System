import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Plus, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { InviteLink } from '../types/settings.types';
import { settingsService } from '../services/settings.service';

export function InviteSettingsPanel() {
  const [links, setLinks] = React.useState<InviteLink[]>([]);
  const [role, setRole] = React.useState('Employee');
  const [isOneTime, setIsOneTime] = React.useState(true);
  const [emailMatch, setEmailMatch] = React.useState('');
  const [phoneMatch, setPhoneMatch] = React.useState('');
  const [salesRecord, setSalesRecord] = React.useState('');
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLinks(settingsService.getInviteLinks());
  }, []);

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newLink = settingsService.createInviteLink({
      role,
      isOneTime,
      emailMatch: emailMatch || undefined,
      phoneMatch: phoneMatch || undefined,
      salesRecord: salesRecord || undefined,
      orgMatch: 'أكاديمية المستبصرين',
      expiresAt: expiresAt.toISOString().replace('T', ' ').substring(0, 19)
    });

    setLinks([newLink, ...links]);
    setSuccess('✅ تم إنشاء رابط الدعوة المشفر بنجاح!');
    setEmailMatch('');
    setPhoneMatch('');
    setSalesRecord('');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 text-right">
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Form */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <Mail className="w-4.5 h-4.5 text-indigo-400" />
              <span>توليد دعوة جديدة — Generate Invite</span>
            </CardTitle>
            <CardDescription className="text-[11px] text-slate-500">
              تحديد شروط التحقق الصارمة قبل تمكين المستخدم الجديد من إنشاء حسابه.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <form onSubmit={handleCreateLink} className="space-y-3">
              <div>
                <label className="block mb-1 text-slate-400">الدور الافتراضي للحساب</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="Employee">موظف (Employee)</option>
                  <option value="Trainer">مدرب (Trainer)</option>
                  <option value="Manager">مدير فرع (Manager)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-400">تطابق البريد الإلكتروني (اختياري)</label>
                <input
                  type="email"
                  value={emailMatch}
                  onChange={(e) => setEmailMatch(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-left placeholder:text-slate-700"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400">تطابق رقم الجوال (اختياري)</label>
                <input
                  type="text"
                  value={phoneMatch}
                  onChange={(e) => setPhoneMatch(e.target.value)}
                  placeholder="+9665..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-left placeholder:text-slate-700"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400">رقم سجل المبيعات المرتبط (Sales Record)</label>
                <input
                  type="text"
                  value={salesRecord}
                  onChange={(e) => setSalesRecord(e.target.value)}
                  placeholder="REC-XXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-left placeholder:text-slate-700"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">استخدام لمرة واحدة فقط (One-time)</span>
                <input
                  type="checkbox"
                  checked={isOneTime}
                  onChange={(e) => setIsOneTime(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded border-slate-800 bg-slate-950"
                />
              </div>

              <Button type="submit" className="w-full h-9 gap-1.5 mt-2">
                <Plus className="w-4 h-4" />
                <span>إنشاء رابط الدعوة</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Links list */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-400" />
              <span>روابط الدعوة المفعلة حالياً ({links.length})</span>
            </CardTitle>
            <CardDescription className="text-[11px] text-slate-500">
              الروابط النشطة التي يمكن استخدامها لتسجيل الدخول وإنشاء الحسابات المشفرة.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">كود الدعوة</th>
                  <th className="p-3">الدور الممنوح</th>
                  <th className="p-3">شروط البريد / الهاتف</th>
                  <th className="p-3">تاريخ انتهاء الصلاحية</th>
                  <th className="p-3 text-center">النوع</th>
                  <th className="p-3 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-200">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-800/10">
                    <td className="p-3 font-mono font-bold text-indigo-300 select-all">{link.code}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/5">
                        {link.role}
                      </Badge>
                    </td>
                    <td className="p-3 text-[10px] text-slate-400">
                      {link.emailMatch && <div>📧 {link.emailMatch}</div>}
                      {link.phoneMatch && <div>📱 {link.phoneMatch}</div>}
                      {!link.emailMatch && !link.phoneMatch && <span className="text-slate-600">بدون شروط</span>}
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-400">{link.expiresAt}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={link.isOneTime ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' : 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'}>
                        {link.isOneTime ? 'مرة واحدة' : 'متعدد الاستخدام'}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setLinks(links.filter((l) => l.id !== link.id))}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
