import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomerTasksApi } from '../../customers/tasks/api/customer-tasks.api';
import { JourneyEngine } from '../../customers/journey/services/journey-engine';
import { CustomerTask } from '../../customers/types/domain.types';
import { ListTodo, CheckSquare, Sparkles } from 'lucide-react';

export function ClientTasksPage() {
  const [tasks, setTasks] = React.useState<CustomerTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadTasks = React.useCallback(async () => {
    const custId = 'cust-1'; // Default client session link for Demo
    const clientTasks = await CustomerTasksApi.fetchByCustomer(custId);
    setTasks(clientTasks);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleToggleTask = async (taskId: string, currentStatus: CustomerTask['status']) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await CustomerTasksApi.updateTaskStatus(taskId, nextStatus);
    // Recalculate progress using the engine
    JourneyEngine.evaluateProgress('cust-1');
    loadTasks();
  };

  const pending = tasks.filter((t) => t.status !== 'completed');
  const completed = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 me-1.5 animate-pulse" />
            المهام والواجبات المطلوبة
          </Badge>
          <h1 className="text-2xl font-black text-white">قائمة مهام العمل المعلقة</h1>
          <p className="text-xs text-slate-400">
            يرجى إكمال المهام المطلوبة ورفع الملفات لضمان الانتقال السلس للمراحل التالية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card className="p-5">
          <h3 className="text-xs font-black text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-rose-400" />
            <span>مهام معلّقة وبانتظار الإنجاز ({pending.length})</span>
          </h3>

          <div className="space-y-3">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-slate-500">جاري تحميل المهام...</div>
            ) : pending.length > 0 ? (
              pending.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center gap-3 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => handleToggleTask(t.id, t.status)}
                    className="w-5 h-5 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="font-extrabold text-slate-200">{t.title}</span>
                    {t.description && <span className="text-[10px] text-slate-400 mt-1 leading-relaxed">{t.description}</span>}
                  </div>
                  <Badge variant="outline" className="text-[9px] border-slate-800 text-slate-400 shrink-0">
                    مستحقة: {t.dueDate}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">🎉 رائع! لا توجد مهام معلّقة حالياً.</div>
            )}
          </div>
        </Card>

        {/* Completed Tasks */}
        <Card className="p-5">
          <h3 className="text-xs font-black text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>مهام تم إنجازها بنجاح ({completed.length})</span>
          </h3>

          <div className="space-y-3">
            {completed.length > 0 ? (
              completed.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center gap-3 text-xs opacity-75"
                >
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => handleToggleTask(t.id, t.status)}
                    className="w-5 h-5 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="font-extrabold text-slate-400 line-through">{t.title}</span>
                    {t.description && <span className="text-[10px] text-slate-500 mt-1 leading-relaxed line-through">{t.description}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">لا توجد مهام مكتملة في هذه المرحلة بعد.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
export default ClientTasksPage;
