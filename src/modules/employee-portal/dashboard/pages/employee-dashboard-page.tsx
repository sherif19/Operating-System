import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Calendar } from 'lucide-react';
import { SubmitLeaveRequestModal } from '@/components/modals/SubmitLeaveRequestModal';

export function EmployeeDashboardPage() {
  const [showLeaveModal, setShowLeaveModal] = React.useState(false);

  return (
    <div className="flex flex-col gap-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-white">مساحة عمل الموظف المنفذ 🚀</h1>
          <p className="text-xs text-slate-400">المهام الموكلة إليك تلقائياً وتقديم الطلبات والإجازات الرسمية</p>
        </div>

        <Button
          onClick={() => setShowLeaveModal(true)}
          className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-600/20"
        >
          <Calendar className="w-4 h-4" />
          <span>تقديم طلب إجازة رسمي 🏖️</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/90 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs text-slate-400">المهام المفتوحة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">5 مهام</div>
            <p className="text-xs text-indigo-400 mt-1">تم الاستلام الآلي من السيستم</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs text-slate-400">زمن التنفيذ الفعلي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">92%</div>
            <p className="text-xs text-slate-400 mt-1">ضمن المدة المعيارية للمهام</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs text-slate-400">مساعد الذكاء الاصطناعي والطلبات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="glass" size="sm" className="w-full gap-2 text-xs">
              <Bot className="w-4 h-4 text-indigo-400" />
              تحدث مع الـ AI Mentor
            </Button>
          </CardContent>
        </Card>
      </div>

      <SubmitLeaveRequestModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
      />
    </div>
  );
}

export default EmployeeDashboardPage;
