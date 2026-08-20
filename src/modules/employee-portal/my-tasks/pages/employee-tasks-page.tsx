import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EmployeeTaskCard } from '@/features/tasks/components/employee-task-card';
import { Task } from '@/types/domain.types';
import { CheckSquare } from 'lucide-react';

export function EmployeeTasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: 'task-1',
      organizationId: 'org-1',
      title: 'تهيئة وحجز دومين العميل (إيمان)',
      description: 'التأكد من توفر الدومين المطلوبة وإتمام عملية ربطه بالسيرفر.',
      assigneeId: 'usr-employee-1',
      customerId: 'cust-1',
      status: 'pending',
      expectedDurationMinutes: 60,
      dueDate: '2026-08-22',
      createdAt: '2026-08-19',
    },
    {
      id: 'task-2',
      organizationId: 'org-1',
      title: 'إنشاء حسابات السوشيال ميديا وتجهيز الغلاف',
      description: 'إنشاء حسابات إنستغرام وتيك توك وربط البريد الرسمي المعتمد.',
      assigneeId: 'usr-employee-1',
      customerId: 'cust-2',
      status: 'in_progress',
      expectedDurationMinutes: 45,
      acceptedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // Accepted 25 mins ago
      dueDate: '2026-08-22',
      createdAt: '2026-08-19',
    },
  ]);

  const [activeFilter, setActiveFilter] = React.useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.status === activeFilter;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit">
            <CheckSquare className="w-3.5 h-3.5 me-1" />
            نظام إدارة المهام الموكلة آلياً
          </Badge>
          <h1 className="text-2xl font-bold text-white">واجباتي ومهامي اليومية</h1>
          <p className="text-xs text-slate-400">
            يتم احتساب السرعة والكفاءة بدءاً من وقت ضغط (استلام المهمة) حتى (إتمام المهمة) وفق قواعد SLA.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل ({tasks.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === 'pending' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            بانتظار الاستلام
          </button>
          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === 'in_progress' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            قيد التنفيذ
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((t) => (
          <EmployeeTaskCard
            key={t.id}
            initialTask={t}
            onStatusChange={(updatedTask) => {
              setTasks((prev) => prev.map((item) => (item.id === updatedTask.id ? updatedTask : item)));
            }}
          />
        ))}
      </div>
    </div>
  );
}
