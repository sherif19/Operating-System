import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Zap, Lock, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ManagerDashboardPage() {
  const navigate = useNavigate();
  const employeeCount = 0;

  return (
    <div className="flex flex-col gap-6 text-right">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px]">
              Department OS — لوحة قيادة القسم
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]">
              بانتظار إضافة الموظفين
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-white">لوحة قيادة قسم التنفيذ والإنتاج 🏢</h1>
          <p className="text-xs text-slate-400">متابعة أداء أعضاء القسم والمهام ومؤشرات السرعة</p>
        </div>

        <Button
          onClick={() => navigate('/manager/department/team')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة موظفين للقسم</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800 p-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-400 flex items-center justify-between">
              <span>أعضاء الفريق بالقسم</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-white">{employeeCount} موظفين</div>
            <p className="text-xs text-slate-400">قسم التنفيذ والإنتاج (لم يتم إضافة موظفين بعد)</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-400 flex items-center justify-between">
              <span>سرعة التنفيذ الفعلية</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-emerald-400">0%</div>
            <p className="text-xs text-slate-400">تُحسب فور قبول الموظف للمهمة لضمان التقييم الصافي</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-400 flex items-center justify-between">
              <span>التحليل الداخلي</span>
              <Lock className="w-4 h-4 text-purple-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="default" className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/30">
              خاص بالمدير فقط 🔒
            </Badge>
            <p className="text-[10px] text-slate-500">تقييمات سريّة وتوجيهات دون عقوبات آليّة</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State Banner */}
      <Card className="p-8 bg-slate-900/60 border-slate-800/80 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-black text-white">لم يتم إضافة موظفين في هذا القسم بعد (0 موظفين)</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          يمكنك إضافة أعضاء فريق جدد أو توزيع الموظفين الحاليين على قسم التنفيذ والإنتاج لبدء إسناد المهام وتتبع سرعة التنفيذ.
        </p>
        <Button
          onClick={() => navigate('/manager/department/team')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2 rounded-xl mt-2"
        >
          <UserPlus className="w-4 h-4 me-1.5" />
          الانتقال لإدارة أعضاء الفريق
        </Button>
      </Card>
    </div>
  );
}

export default ManagerDashboardPage;
