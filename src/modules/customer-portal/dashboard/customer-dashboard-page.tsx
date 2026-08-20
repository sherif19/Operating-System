import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { CustomerTasksApi } from '../../customers/tasks/api/customer-tasks.api';
import { CustomerAppointmentsApi } from '../../customers/appointments/api/appointments.api';
import { CustomerJourneyApi } from '../../customers/journey/api/journey.api';
import { CustomerSupportApi } from '../../customers/support/api/tickets.api';
import { CustomerTask, CustomerAppointment, CustomerDeliverable, CustomerSupportTicket } from '../../customers/types/domain.types';
import { Bot, Calendar, CheckSquare, ShieldCheck, Mail, HelpCircle } from 'lucide-react';

export function CustomerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [tasks, setTasks] = React.useState<CustomerTask[]>([]);
  const [appointments, setAppointments] = React.useState<CustomerAppointment[]>([]);
  const [deliverables, setDeliverables] = React.useState<CustomerDeliverable[]>([]);
  const [tickets, setTickets] = React.useState<CustomerSupportTicket[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Find client details mock database link
    const custId = 'cust-1'; // Default client session link for Demo
    Promise.all([
      CustomerTasksApi.fetchByCustomer(custId),
      CustomerAppointmentsApi.fetchByCustomer(custId),
      CustomerJourneyApi.fetchDeliverables(custId),
      CustomerSupportApi.fetchByCustomer(custId),
    ]).then(([clientTasks, clientApps, clientDels, clientTickets]) => {
      setTasks(clientTasks);
      setAppointments(clientApps);
      setDeliverables(clientDels);
      setTickets(clientTickets);
      setIsLoading(false);
    });
  }, []);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const upcomingAppointment = appointments.find((a) => a.status === 'scheduled');
  const latestDeliverable = deliverables[deliverables.length - 1];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-indigo-400 flex items-center justify-center gap-2">
        <Bot className="w-4 h-4 animate-spin" />
        <span>جاري تحميل مساحة العمل الخاصة بك...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Bot Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_65%)] pointer-events-none" />

        <div className="flex items-center gap-4 z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shrink-0">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <Badge variant="default" className="w-fit bg-cyan-500/20 text-cyan-300">
              مرحباً بك
            </Badge>
            <h1 className="text-xl font-black text-white tracking-tight mt-1">
              أهلاً بك يا {user?.displayName || 'العميل'} 👋
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              مرحلتك الحالية: <span className="text-indigo-400 font-extrabold">kickoff_call</span> • جو جاهز دائماً لمساعدتك.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/client/welcome')}
          className="gap-2 border-blue-500/20 bg-slate-950/40 text-[10px]"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>أعد جولة الإرشاد مع جو</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main interactive widgets */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Onboarding progress meter */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-white">تقدم رحلتك الكلي</h3>
                <p className="text-[10px] text-slate-400">ملء البيانات والمهام يزيد من تقدم رحلتك التشغيلية.</p>
              </div>
              <span className="text-base font-black text-indigo-400 font-number">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-350"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </Card>

          {/* Next action link / Upcoming Call appointment */}
          {upcomingAppointment ? (
            <Card className="p-5 border-indigo-500/20 bg-indigo-950/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-black text-white">مكالمتك القادمة مسجلة وجاهزة</h4>
                  <span className="text-[10px] text-slate-300">
                    النوع: {upcomingAppointment.type} • الوقت: {new Date(upcomingAppointment.startsAt).toLocaleString('ar-SA')}
                  </span>
                  {upcomingAppointment.meetingLink && (
                    <a
                      href={upcomingAppointment.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-cyan-400 hover:underline mt-1.5"
                    >
                      اضغط هنا للانضمام إلى مكالمة Zoom
                    </a>
                  )}
                </div>
              </div>
              <Button variant="primary" size="sm" onClick={() => navigate('/client/appointments')}>
                تعديل الموعد
              </Button>
            </Card>
          ) : (
            <Card className="p-5 border-dashed border-slate-800 bg-slate-950/20 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-400">لا توجد اجتماعات أو مكالمات استشارية مجدولة حالياً.</div>
              <Button variant="outline" size="sm" onClick={() => navigate('/client/appointments')}>
                احجز مكالمتك الأولى الآن
              </Button>
            </Card>
          )}

          {/* Checklist preview */}
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span>المهام المعلقة في مرحلتك الحالية</span>
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/client/tasks')} className="text-[10px] p-0 h-auto">
                عرض كل المهام
              </Button>
            </div>

            <div className="space-y-2">
              {pendingTasks.length > 0 ? (
                pendingTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between text-xs"
                  >
                    <span className="font-extrabold text-slate-200">{task.title}</span>
                    <Badge variant="outline" className="text-[9px] border-slate-800 text-slate-400">
                      مستحقة: {task.dueDate}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  🎉 ممتاز! لا توجد مهام معلقة في هذه المرحلة.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar widgets */}
        <div className="flex flex-col gap-6">
          {/* Latest deliverable files list */}
          <Card className="p-5">
            <h3 className="text-xs font-black text-white flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>آخر المخرجات والملفات المستلمة</span>
            </h3>
            {latestDeliverable ? (
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 space-y-2 text-xs">
                <div className="font-extrabold text-white">{latestDeliverable.title}</div>
                <div className="text-[9px] text-slate-400">النوع: {latestDeliverable.type}</div>
                <Button variant="outline" size="sm" onClick={() => navigate('/client/deliverables')} className="w-full text-[10px] mt-2">
                  فتح الملفات والتحقق
                </Button>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">لا توجد مخرجات جاهزة حتى الآن.</div>
            )}
          </Card>

          {/* Support Tickets overview */}
          <Card className="p-5">
            <h3 className="text-xs font-black text-white flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-rose-400" />
              <span>تذاكر الدعم والاستفسارات</span>
            </h3>
            <div className="space-y-2">
              {tickets.slice(0, 2).map((tkt) => (
                <div key={tkt.id} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-850 flex items-center justify-between text-[10px] text-slate-300">
                  <span className="truncate flex-1 pr-1">{tkt.subject}</span>
                  <Badge variant="outline" className="text-[8px] shrink-0 border-slate-800 text-slate-400">
                    {tkt.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/client/support')} className="w-full text-[10px] mt-3">
              فتح مركز الدعم والمراسلة
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default CustomerDashboardPage;
