import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckSquare, Package, Bot } from 'lucide-react';

export function ClientDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner for Client */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900/60 via-slate-900 to-indigo-900/40 border border-violet-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" className="mb-2">
            <Sparkles className="w-3 h-3 me-1" />
            أهلاً بك في رحلتك الريادية
          </Badge>
          <h1 className="text-2xl font-bold text-white">مرحباً بك، سارة الأحمد! 👋</h1>
          <p className="text-xs text-slate-300 mt-1">
            المرشد الذكي (جو) في انتظارك لمساعدتك في خطوتك القادمة.
          </p>
        </div>
        <Button variant="primary" size="md" className="gap-2">
          <Bot className="w-4 h-4" />
          ابدأ جولة جو الإرشادية
        </Button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-slate-400 flex items-center justify-between">
              <span>المرحلة الحالية</span>
              <Sparkles className="w-4 h-4 text-violet-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-bold text-white">مكالمة البداية وإعداد الدومين</h3>
            <p className="text-xs text-slate-400 mt-1">تم تعيين المدرب: م. محمد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-slate-400 flex items-center justify-between">
              <span>مهامي القادمة</span>
              <CheckSquare className="w-4 h-4 text-indigo-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-bold text-white">3 مهام بانتظار تنفيذك</h3>
            <p className="text-xs text-slate-400 mt-1">تعبئة نموذج البيانات الأساسية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs text-slate-400 flex items-center justify-between">
              <span>ممتلكاتي ومخرجاتي</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-bold text-white">2 مخرجات معتمدة</h3>
            <p className="text-xs text-slate-400 mt-1">شعار الهوية + حسابات السوشيال</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
