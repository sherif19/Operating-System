import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CustomersApi } from '../api/customers.api';
import { CustomerTasksApi } from '../tasks/api/customer-tasks.api';
import { Customer, CustomerTask } from '../types/domain.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerHealthSection } from '../analytics/customer-health-section';
import { JourneyTimeline } from '../journey/components/journey-timeline';
import { DeliverablesManager } from '../deliverables/components/deliverables-manager';
import { SupportTicketsManager } from '../support/components/support-tickets-manager';
import { ChevronLeft, Bot, Sparkles, CheckSquare, ShieldCheck, ListTodo, Plus } from 'lucide-react';

export function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [tasks, setTasks] = React.useState<CustomerTask[]>([]);
  const [activeTab, setActiveTab] = React.useState<'journey' | 'tasks' | 'deliverables' | 'support'>('journey');

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [newTaskPriority, setNewTaskPriority] = React.useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  const loadData = React.useCallback(async () => {
    if (!id) return;
    const cust = await CustomersApi.fetchById(id);
    setCustomer(cust);
    if (cust) {
      const clientTasks = await CustomerTasksApi.fetchByCustomer(cust.id);
      setTasks(clientTasks);
    }
  }, [id]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleTask = async (taskId: string, currentStatus: CustomerTask['status']) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await CustomerTasksApi.updateTaskStatus(taskId, nextStatus);
    loadData();
  };

  const handleAddTask = async () => {
    if (!customer || !newTaskTitle.trim()) return;
    await CustomerTasksApi.createTask({
      customerId: customer.id,
      title: newTaskTitle,
      status: 'pending',
      priority: newTaskPriority,
      dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      isRequired: true,
      stage: customer.currentStage,
    });
    setNewTaskTitle('');
    loadData();
  };

  if (!customer) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        جاري تحميل بيانات العميل...
      </div>
    );
  }

  const healthColor =
    customer.health === 'healthy'
      ? 'b-success'
      : customer.health === 'at_risk'
      ? 'b-critical'
      : 'b-warning';

  return (
    <div className="flex flex-col gap-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 font-bold">
          <span className="cursor-pointer hover:text-white" onClick={() => navigate('/owner/customers')}>العملاء</span>
          <span>/</span>
          <span className="text-white font-extrabold">{customer.name}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/owner/customers')}
          className="gap-2 border-blue-500/20 bg-slate-950/40 text-[10px]"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>العودة لدليل العملاء</span>
        </Button>
      </div>

      {/* Customer Header summary banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-[24px] bg-gradient-to-br from-[#10193E] to-[#0A0F24]/85 border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_65%)] pointer-events-none" />

        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border-2 border-indigo-500/35 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-indigo-500/10 shrink-0">
            {customer.name[0]}
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{customer.name}</span>
              <span className={`badge-v18 ${healthColor} text-[10px]`}>
                {customer.health.toUpperCase()}
              </span>
            </h1>
            <span className="text-xs text-slate-400 mt-1">
              شركة: <span className="text-white font-semibold">{customer.companyName}</span> • عضو منذ: {customer.joinedAt}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 z-10 bg-slate-950/50 p-4 rounded-xl border border-slate-900">
          <div className="flex flex-col gap-1">
            <span>المدرب المسؤول</span>
            <span className="font-extrabold text-white text-sm">{customer.assignedTrainerId || 'غير مسند'}</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex flex-col gap-1">
            <span>المرحلة الحالية</span>
            <span className="font-extrabold text-indigo-400 text-sm">{customer.currentStage}</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex flex-col gap-1">
            <span>تاريخ التسليم المتوقع</span>
            <span className="font-extrabold text-white text-sm">{customer.expectedDeliveryDate || 'قيد الدراسة'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side: General status, Health logs & Tab switcher */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          <CustomerHealthSection customer={customer} />

          {/* Tab switches */}
          <Card className="p-3 space-y-1">
            {[
              { id: 'journey', label: 'مسار المراحل والرحلة', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'tasks', label: 'المهام والواجبات', icon: <CheckSquare className="w-4 h-4" /> },
              { id: 'deliverables', label: 'المخرجات وبيانات الدخول', icon: <ShieldCheck className="w-4 h-4" /> },
              { id: 'support', label: 'تذاكر الدعم والخلل', icon: <Bot className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-right cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </Card>
        </div>

        {/* Right Side: Tab content components */}
        <div className="flex-1 w-full min-w-0">
          {activeTab === 'journey' && (
            <JourneyTimeline customer={customer} onStageChange={loadData} />
          )}

          {activeTab === 'tasks' && (
            <Card className="p-5">
              <h3 className="text-xs font-black text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-indigo-400" />
                <span>المهام والواجبات المطلوبة للعميل</span>
              </h3>

              {/* Tasks checklist */}
              <div className="space-y-2">
                {tasks.length > 0 ? (
                  tasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={t.status === 'completed'}
                          onChange={() => handleToggleTask(t.id, t.status)}
                          className="w-4.5 h-4.5 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className={`font-extrabold ${t.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {t.title}
                          </span>
                          <span className="text-[9px] text-slate-500 mt-0.5">المرحلة: {t.stage} • الأولوية: {t.priority}</span>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">تاريخ الاستحقاق: {t.dueDate}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-850 rounded-xl">
                    لا توجد مهام نشطة حالياً للعميل.
                  </div>
                )}
              </div>

              {/* Add Task Form */}
              <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <span>إضافة مهمة جديدة يدوياً</span>
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="عنوان المهمة (مثال: حجز مكالمة الاستراتيجية)"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500"
                  />
                  <select
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="low">منخفض</option>
                    <option value="medium">متوسط</option>
                    <option value="high">مرتفع</option>
                    <option value="critical">حرج</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={handleAddTask} className="h-9">
                    إضافة
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'deliverables' && (
            <DeliverablesManager customer={customer} />
          )}

          {activeTab === 'support' && (
            <SupportTicketsManager customer={customer} />
          )}
        </div>
      </div>
    </div>
  );
}
export default CustomerDetailsPage;
