import React from 'react';
import { Task } from '@/types/domain.types';
import { TaskTimerService, PerformanceMetric } from '../services/task-timer.service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, Clock, CheckCircle2 } from 'lucide-react';

interface EmployeeTaskCardProps {
  initialTask: Task;
  onStatusChange?: (updatedTask: Task, metric?: PerformanceMetric) => void;
}

export function EmployeeTaskCard({ initialTask, onStatusChange }: EmployeeTaskCardProps) {
  const [task, setTask] = React.useState<Task>(initialTask);
  const [metric, setMetric] = React.useState<PerformanceMetric | null>(null);

  const handleStartTask = () => {
    const updated = TaskTimerService.acceptTask(task);
    setTask(updated);
    if (onStatusChange) onStatusChange(updated);
  };

  const handleCompleteTask = () => {
    const { updatedTask, metric: perfMetric } = TaskTimerService.completeTask(task);
    setTask(updatedTask);
    setMetric(perfMetric);
    if (onStatusChange) onStatusChange(updatedTask, perfMetric);
  };

  return (
    <Card className="hover:border-indigo-500/40 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl mt-1 shrink-0 ${
            task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
            task.status === 'in_progress' ? 'bg-indigo-500/20 text-indigo-400 animate-pulse' :
            'bg-slate-800 text-slate-400'
          }`}>
            {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-white">{task.title}</h4>
              <Badge
                variant={
                  task.status === 'completed' ? 'success' :
                  task.status === 'in_progress' ? 'default' : 'outline'
                }
              >
                {task.status === 'completed' ? 'مكتملة' : task.status === 'in_progress' ? 'قيد التنفيذ' : 'بانتظار الاستلام'}
              </Badge>
            </div>
            {task.description && <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>}
            
            <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
              <span>المدة المعيارية: <b>{task.expectedDurationMinutes} دقيقة</b></span>
              {task.acceptedAt && (
                <span>وقت الاستلام: <b>{new Date(task.acceptedAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</b></span>
              )}
              {task.effectiveDurationMinutes !== undefined && (
                <span className="text-emerald-400 font-bold">
                  الزمن الفعلي للتنفيذ: {task.effectiveDurationMinutes} دقيقة
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {task.status === 'pending' && (
            <Button variant="primary" size="sm" onClick={handleStartTask} className="gap-1.5">
              <Play className="w-3.5 h-3.5" />
              <span>استلام المهمة والبدء</span>
            </Button>
          )}

          {task.status === 'in_progress' && (
            <Button variant="primary" size="sm" onClick={handleCompleteTask} className="bg-emerald-600 hover:bg-emerald-500 gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>إتمام المهمة الآن</span>
            </Button>
          )}

          {task.status === 'completed' && metric && (
            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-right">
              <span className="text-[10px] text-emerald-400 block font-semibold">مؤشر السرعة والكفاءة</span>
              <span className="text-xs font-extrabold text-white">{metric.scorePercentage}% {metric.varianceMinutes >= 0 ? `(+${metric.varianceMinutes}د وِفْر)` : `(${metric.varianceMinutes}د تفاوت)`}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
