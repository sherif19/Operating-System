import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { EmployeesApi } from '../../../employees/api/employees.api';
import { EmployeeProfile } from '../../../employees/types/domain.types';
import { Sparkles, Bot, Clock, Calendar, CheckSquare, ShieldAlert } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = React.useState<EmployeeProfile | null>(null);

  React.useEffect(() => {
    // Linked to emp-1 (Omar) as default staff session for Demo
    EmployeesApi.fetchById('emp-1').then(setProfile);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_65%)] pointer-events-none" />

        <div className="flex items-center gap-4 z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shrink-0">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <Badge variant="default" className="w-fit bg-indigo-500/20 text-indigo-300">
              مساحة العمل الشخصية
            </Badge>
            <h1 className="text-xl font-black text-white tracking-tight mt-1">
              مرحباً بعودتك، {user?.displayName || 'الزميل'} 👋
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              الدور: <span className="text-indigo-400 font-extrabold">{profile?.role || 'موظف'}</span> • كوتش المساعدة الذكي جاهز دائماً لتسريع إنتاجك.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/employee/ai-mentor')}
          className="gap-2 border-blue-500/20 bg-slate-950/40 text-[10px]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>استشر AI Mentor الخاص بك</span>
        </Button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 flex flex-col justify-between min-h-28">
          <div className="flex justify-between text-xs text-slate-400 font-bold">
            <span>القدرة الاستيعابية الحالية</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{profile?.workloadScore || 0}%</span>
            <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                style={{ width: `${profile?.workloadScore || 0}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-28">
          <div className="flex justify-between text-xs text-slate-400 font-bold">
            <span>العملاء المسندون لك</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{profile?.assignedCustomersCount || 0}</span>
            <span className="text-[10px] text-slate-500 block mt-1">عملاء نشطين بانتظار مكالمات المتابعة</span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between min-h-28">
          <div className="flex justify-between text-xs text-slate-400 font-bold">
            <span>المهام المعلقة اليوم</span>
            <CheckSquare className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{profile?.activeTasksCount || 0}</span>
            <span className="text-[10px] text-slate-500 block mt-1">مهام تشغيلية واجبة الإنهاء الليلة</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Work lists */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Overdue alert block */}
          <Card className="p-4 border-rose-500/20 bg-rose-950/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg shrink-0">
                <ShieldAlert className="w-5 h-5 animate-bounce" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-black text-white">تنبيه المهام المتأخرة!</h4>
                <span className="text-[10px] text-slate-400 leading-relaxed">
                  لديك مهام متأخرة عن تاريخ التسليم المعتمد بالـ SLA. يرجى البدء بها فوراً.
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/employee/tasks')} className="text-[10px]">
              عرض المهام المتأخرة
            </Button>
          </Card>

          {/* Today view preview */}
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
              <h3 className="text-xs font-black text-white">الجدول الزمني واليومي لليوم</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/employee/today')} className="text-[10px] p-0 h-auto">
                فتح وضع اليوم الكامل
              </Button>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-850 flex items-center justify-between text-xs">
                <span className="text-slate-300">مكالمة انطلاق مع سارة حسام</span>
                <span className="text-[10px] text-indigo-400 font-bold">10:00 - 10:45</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-850 flex items-center justify-between text-xs">
                <span className="text-slate-300">تحديث الهوية البصرية لـ Company OS</span>
                <span className="text-[10px] text-slate-500">11:00 - 12:30</span>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Mentor personal recommendations widget */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 bg-gradient-to-br from-[#10193E] to-slate-950 border-cyan-500/25">
            <h3 className="text-xs font-black text-cyan-400 border-b border-slate-850 pb-3 mb-4 flex items-center gap-1.5">
              <Bot className="w-4 h-4" />
              <span>ملاحظات وتوصيات AI Mentor اليومية</span>
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
                💡 "عمر، لقد لاحظت أن متوسط استغرقك في إنهاء مكالمات الانطلاق قد تحسن بمعدل 12% هذا الأسبوع. عمل رائع!"
              </p>
              <p className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
                ⚠️ "تنبيه: متبقي ساعتان فقط على موعد تسليم ملفات الهوية لشركة Nour Store."
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => navigate('/employee/ai-mentor')} className="w-full justify-center text-[10px] mt-4">
              محادثة الكوتش AI
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;
