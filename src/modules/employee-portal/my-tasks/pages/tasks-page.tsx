import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomerTasksApi } from '../../../customers/tasks/api/customer-tasks.api';
import { EmployeePerformanceApi } from '../../../employees/api/performance.api';
import { AssignmentEngine } from '../../../employees/assignments/services/assignment-engine';
import { CustomerTask } from '../../../customers/types/domain.types';
import { ListTodo, Sparkles, AlertCircle, Play, Check } from 'lucide-react';

export function TasksPage() {
  const [tasks, setTasks] = React.useState<CustomerTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Keep track of timestamps per task locally to simulate backend tracking
  const [taskTimestamps, setTaskTimestamps] = React.useState<Record<string, {
    acceptedAt?: string;
    startedAt?: string;
    completedAt?: string;
  }>>({});

  const loadTasks = React.useCallback(async () => {
    // Omar (emp-1) is default session
    const list = await CustomerTasksApi.fetchByCustomer('cust-1');
    setTasks(list);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAccept = (taskId: string) => {
    setTaskTimestamps((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], acceptedAt: new Date().toLocaleTimeString() },
    }));
    // Auto increment workload
    AssignmentEngine.incrementWorkload('emp-1');
  };

  const handleStart = (taskId: string) => {
    setTaskTimestamps((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], startedAt: new Date().toLocaleTimeString() },
    }));
  };

  const handleComplete = async (taskId: string) => {
    const stamps = taskTimestamps[taskId];
    const started = stamps?.startedAt ? new Date() : new Date(Date.now() - 30 * 60000); // fallback 30 mins
    const completed = new Date();

    const actualMin = Math.round((completed.getTime() - started.getTime()) / 60000);
    const expectedMin = 45; // baseline task template minutes
    const variance = actualMin - expectedMin;

    // 1. Update task status in database
    await CustomerTasksApi.updateTaskStatus(taskId, 'completed');

    // 2. Decrement workload
    AssignmentEngine.decrementWorkload('emp-1');

    // 3. Log Performance Variance in performance history DB
    await EmployeePerformanceApi.logPerformanceTask({
      employeeId: 'emp-1',
      taskId,
      title: tasks.find((t) => t.id === taskId)?.title || 'مهمة تشغيلية',
      actualDurationMinutes: actualMin,
      expectedDurationMinutes: expectedMin,
      varianceMinutes: variance,
    });

    loadTasks();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 me-1.5 animate-pulse" />
            إدارة وتنفيذ مهامي التشغيلية
          </Badge>
          <h1 className="text-2xl font-black text-white">صندوق المهام وتتبع الإنتاجية</h1>
          <p className="text-xs text-slate-400">
            تتبع الوقت المستغرق لتنفيذ المهام من الاستلام الفعلي إلى الإتمام لدعم حسابات الفروق الزمنية الـ Variance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active tasks lists */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="text-xs font-black text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-indigo-400" />
              <span>المهام الجارية والجديدة ({tasks.filter((t) => t.status !== 'completed').length})</span>
            </h3>

            <div className="space-y-3">
              {isLoading ? (
                <div className="p-6 text-center text-xs text-slate-500">جاري تحميل المهام...</div>
              ) : tasks.filter((t) => t.status !== 'completed').length > 0 ? (
                tasks.filter((t) => t.status !== 'completed').map((task) => {
                  const stamps = taskTimestamps[task.id];
                  const isAccepted = !!stamps?.acceptedAt;
                  const isStarted = !!stamps?.startedAt;

                  return (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex flex-col gap-1.5 flex-1">
                        <span className="font-extrabold text-slate-200">{task.title}</span>
                        {task.description && <p className="text-[10px] text-slate-400 leading-relaxed">{task.description}</p>}
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {isAccepted && (
                            <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
                              استلمت: {stamps.acceptedAt}
                            </span>
                          )}
                          {isStarted && (
                            <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">
                              بدأت: {stamps.startedAt}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons triggers */}
                      <div className="flex items-center gap-2 shrink-0">
                        {!isAccepted && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAccept(task.id)}
                            className="h-8 text-[10px] font-extrabold"
                          >
                            قبول المهمة
                          </Button>
                        )}

                        {isAccepted && !isStarted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStart(task.id)}
                            className="h-8 text-[10px] border-blue-500/20 text-cyan-400 gap-1"
                          >
                            <Play className="w-3 h-3 fill-cyan-400" />
                            <span>بدء العمل</span>
                          </Button>
                        )}

                        {isStarted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleComplete(task.id)}
                            className="h-8 text-[10px] border-emerald-500/20 text-emerald-400 gap-1 hover:bg-emerald-950/20"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>إتمام الإنجاز</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">🎉 لا توجد مهام جارية حالياً.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Info panel explaining execution tracking */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 bg-gradient-to-br from-slate-950 to-slate-900 border-indigo-500/15">
            <h3 className="text-xs font-black text-indigo-300 border-b border-slate-850 pb-3 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-indigo-400" />
              <span>كيف يعمل قياس الأداء لدينا؟</span>
            </h3>
            <div className="space-y-3 text-[10px] leading-relaxed text-slate-400">
              <p>
                * لا نقيس كفاءتك بالتأخر عن الـ Deadline فقط.
              </p>
              <p>
                * المحرك يحتسب **الانحراف الزمني (Variance)** بطرح مدة التنفيذ الفعلية (منذ ضغطت "بدء العمل" وحتى "إتمام الإنجاز") من المدة القياسية المخصصة للمهمة (المعيار).
              </p>
              <p>
                * التحديث الفوري لحالتك يساعد الـ AI Mentor على رصد أية عقبات وتقديم نصائح SOP لتسريع إنتاجيتك.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default TasksPage;
