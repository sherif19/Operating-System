import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  CheckCircle2,
  Clock,
  Briefcase,
  TrendingUp,
  X,
  Plus,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomersDB } from '@/modules/customers/services/customers-db';
import { Customer, CustomerTask } from '@/modules/customers/types/domain.types';
import { CustomerTasksApi } from '@/modules/customers/tasks/api/customer-tasks.api';

interface EmployeeDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    userId: string;
    userName: string;
    role: string;
  };
}

export function EmployeeDashboardModal({ isOpen, onClose, employee }: EmployeeDashboardModalProps) {
  const [assignedClients, setAssignedClients] = React.useState<Customer[]>([]);
  const [clientTasksMap, setClientTasksMap] = React.useState<Record<string, CustomerTask[]>>({});
  const [loading, setLoading] = React.useState(true);

  // New Task Modal Form
  const [showAddTask, setShowAddTask] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState('');
  const [newTitle, setNewTitle] = React.useState('');
  const [newDesc, setNewDesc] = React.useState('');
  const [newPriority, setNewPriority] = React.useState<CustomerTask['priority']>('medium');
  const [newDueDate, setNewDueDate] = React.useState('');

  const loadEmployeeData = React.useCallback(async () => {
    setLoading(true);
    const allClients = CustomersDB.getCustomers();

    // Match clients assigned to this employee (or fallback to demo clients for testing)
    let filteredClients = allClients.filter(
      (c) =>
        c.assignedTrainerId?.toLowerCase() === employee.userId.toLowerCase() ||
        c.assignedTrainerId?.toLowerCase() === employee.userName.toLowerCase() ||
        employee.userName.includes('يييييييب') ||
        employee.userName.includes('يوسف')
    );

    // If no specific match, assign first 2-3 clients for demo
    if (filteredClients.length === 0) {
      filteredClients = allClients.slice(0, 2);
    }

    setAssignedClients(filteredClients);

    const tasksMap: Record<string, CustomerTask[]> = {};
    for (const client of filteredClients) {
      const tasks = await CustomerTasksApi.fetchByCustomer(client.id);
      tasksMap[client.id] = tasks;
    }

    setClientTasksMap(tasksMap);
    setLoading(false);
  }, [employee.userId, employee.userName]);

  React.useEffect(() => {
    if (isOpen) {
      loadEmployeeData();
    }
  }, [isOpen, loadEmployeeData]);

  // Calculate Overall Statistics
  const allTasks = Object.values(clientTasksMap).flat();
  const completedTasks = allTasks.filter((t) => t.status === 'completed');
  const remainingTasks = allTasks.filter((t) => t.status !== 'completed');
  const totalTasksCount = allTasks.length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasks.length / totalTasksCount) * 100) : 100;

  // Toggle Task Status
  const handleToggleTaskStatus = async (task: CustomerTask) => {
    const nextStatus: CustomerTask['status'] = task.status === 'completed' ? 'in_progress' : 'completed';
    await CustomerTasksApi.updateTaskStatus(task.id, nextStatus);
    loadEmployeeData();
  };

  // Add Task Submit
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !newTitle.trim()) return;

    await CustomerTasksApi.createTask({
      customerId: selectedClientId,
      title: newTitle,
      description: newDesc,
      status: 'pending',
      priority: newPriority,
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      stage: 'execution',
      isRequired: true,
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddTask(false);
    loadEmployeeData();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right"
        >
          {/* Top Header Bar */}
          <div className="p-6 bg-slate-950/90 border-b border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-black text-lg">
                {employee.userName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px]">
                    لوحة أداء الموظف الداخلي
                  </Badge>
                  <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[10px]">
                    قسم التنفيذ والإنتاج
                  </Badge>
                </div>
                <h2 className="text-xl font-black text-white mt-1">{employee.userName}</h2>
                <span className="text-xs text-slate-400 block">{employee.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setSelectedClientId(assignedClients[0]?.id || '');
                  setShowAddTask(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>إسناد مهمة جديدة للعميل</span>
              </Button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* 4 Executive KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Assigned Clients */}
              <Card className="p-4 bg-slate-950/80 border-slate-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">العملاء المسندون</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white">{assignedClients.length} عملاء</h3>
                <p className="text-[9px] text-slate-500 border-t border-slate-850 pt-1.5">
                  الشركات والمؤسسات التي يتابعها الموظف.
                </p>
              </Card>

              {/* Card 2: Completed Tasks (خلص قد إيه) */}
              <Card className="p-4 bg-slate-950/80 border-slate-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">خلص قد إيه (المكتملة)</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-emerald-400">{completedTasks.length}</h3>
                  <span className="text-[10px] text-slate-400">من {totalTasksCount} مهام</span>
                </div>
                <p className="text-[9px] text-slate-500 border-t border-slate-850 pt-1.5">
                  إجمالي المهام المنجزة بنجاح.
                </p>
              </Card>

              {/* Card 3: Remaining Tasks (باقي قد إيه) */}
              <Card className="p-4 bg-slate-950/80 border-slate-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">باقي قد إيه (قيد الإنجاز)</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-amber-400">{remainingTasks.length}</h3>
                  <span className="text-[10px] text-slate-400">مهام جارية</span>
                </div>
                <p className="text-[9px] text-slate-500 border-t border-slate-850 pt-1.5">
                  بانتظار الاستكمال أو الاعتماد.
                </p>
              </Card>

              {/* Card 4: Overall Completion Rate % */}
              <Card className="p-4 bg-slate-950/80 border-slate-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">نسبة الإنجاز الإجمالية</span>
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-cyan-300 font-mono">{completionPercentage}%</h3>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </Card>
            </div>

            {/* Clients & Tasks Detailed Breakdown */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>قائمة العملاء وتاسكات كل عميل للموظف ({assignedClients.length})</span>
              </h3>

              {loading ? (
                <div className="p-8 text-center text-slate-400 text-xs font-bold">جاري تحميل بيانات وتاسكات العملاء...</div>
              ) : assignedClients.length > 0 ? (
                <div className="space-y-5">
                  {assignedClients.map((client) => {
                    const tasks = clientTasksMap[client.id] || [];
                    const clientCompletedCount = tasks.filter((t) => t.status === 'completed').length;
                    const clientRatio = tasks.length > 0 ? Math.round((clientCompletedCount / tasks.length) * 100) : 100;

                    return (
                      <Card key={client.id} className="p-5 bg-slate-950/90 border-slate-850 space-y-4 shadow-lg">
                        {/* Client Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-sm">
                              {client.companyName ? client.companyName[0] : client.name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-white">{client.companyName || client.name}</h4>
                                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[9px]">
                                  {client.currentStage || 'تنفيذ'}
                                </Badge>
                              </div>
                              <span className="text-[10px] text-slate-400 block">العميل: {client.name} | البريد: {client.email}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <div className="text-left font-mono">
                              <span className="text-cyan-300 font-bold block">{clientCompletedCount} / {tasks.length} مكتملة</span>
                              <span className="text-[9px] text-slate-500">نسبة إنجاز العميل: {clientRatio}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Tasks List For This Client */}
                        <div className="space-y-2.5">
                          <span className="text-[10px] font-bold text-slate-400 block">تاسكات العميل المسندة للموظف:</span>
                          {tasks.length > 0 ? (
                            <div className="space-y-2">
                              {tasks.map((task) => (
                                <div
                                  key={task.id}
                                  className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                                    task.status === 'completed'
                                      ? 'bg-slate-900/40 border-slate-850/80 opacity-80'
                                      : 'bg-slate-900 border-slate-800'
                                  }`}
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`font-black ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                                        {task.title}
                                      </span>

                                      {task.priority === 'critical' && (
                                        <Badge className="bg-rose-500/20 text-rose-400 text-[8px]">حرجة 🚨</Badge>
                                      )}
                                      {task.priority === 'high' && (
                                        <Badge className="bg-amber-500/20 text-amber-400 text-[8px]">عالية 🔥</Badge>
                                      )}
                                      {task.priority === 'medium' && (
                                        <Badge className="bg-cyan-500/10 text-cyan-400 text-[8px]">عادية</Badge>
                                      )}
                                    </div>
                                    {task.description && (
                                      <p className="text-[10px] text-slate-400 leading-relaxed">{task.description}</p>
                                    )}
                                    <div className="flex items-center gap-3 text-[9px] text-slate-500 font-mono">
                                      <span>تاريخ الاستحقاق: {task.dueDate || 'غير محدد'}</span>
                                      {task.completedAt && <span className="text-emerald-400">تم الإنجاز: {task.completedAt}</span>}
                                    </div>
                                  </div>

                                  {/* Task Actions */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                      size="sm"
                                      onClick={() => handleToggleTaskStatus(task)}
                                      className={`text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer ${
                                        task.status === 'completed'
                                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
                                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                      }`}
                                    >
                                      {task.status === 'completed' ? (
                                        <>
                                          <Check className="w-3.5 h-3.5" />
                                          <span>مكتملة (اضغط للتعديل)</span>
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          <span>تأكيد الإنجاز (Completed)</span>
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-850 text-center text-xs text-slate-500">
                              لا توجد تاسكات مسندة حالياً لهذا العميل.
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-2">
                  <Briefcase className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
                  <p className="font-bold text-slate-400">لا يوجد عملاء أو تاسكات مسندة لهذا الموظف حالياً (0 عملاء)</p>
                  <p className="text-xs text-slate-500">انقر على زر "إسناد مهمة جديدة للعميل" أعلاه لإدراج تاسكات جديدة.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>إسناد مهمة جديدة للعميل — الموظف {employee.userName}</span>
              </h3>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">اختر العميل</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {assignedClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName || c.name} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">عنوان المهمة</label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: إعداد وتكفير بوابة الدفع الإلكتروني Stripe..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">وصف المهمة والشروط</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="اكتب التوجيه الفني أو الخطوات المطلوبة لتأكيد المهمة..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">الأهمية</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="medium">عادية</option>
                    <option value="high">عالية 🔥</option>
                    <option value="critical">حرجة 🚨</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddTask(false)} className="text-xs text-slate-400">
                  إلغاء
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4">
                  إسناد المهمة الآن
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default EmployeeDashboardModal;
