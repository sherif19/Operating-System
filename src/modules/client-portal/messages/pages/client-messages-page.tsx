import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Plus, HelpCircle } from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  category: 'general' | 'complaint' | 'appointment' | 'revision' | 'technical' | 'deliverable_issue';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  lastUpdated: string;
  assignedTo: string;
}

export function ClientMessagesPage() {
  const [tickets, setTickets] = React.useState<SupportTicket[]>([
    {
      id: 't-101',
      subject: 'طلب تعديل بسيط على ألوان شعار السوشيال ميديا',
      category: 'revision',
      status: 'in_progress',
      priority: 'medium',
      lastUpdated: 'قبل ساعة',
      assignedTo: 'خدمة العملاء (مريم)',
    },
    {
      id: 't-102',
      subject: 'استفسار عن موعد ربط الدومين بالمنصة',
      category: 'general',
      status: 'resolved',
      priority: 'low',
      lastUpdated: 'أمس',
      assignedTo: 'فريق الدعم الفني',
    },
  ]);

  const [newSubject, setNewSubject] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<SupportTicket['category']>('general');
  const [newDetails, setNewDetails] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  const categoryLabels: Record<SupportTicket['category'], string> = {
    general: 'استفسار عام',
    complaint: 'شكوى',
    appointment: 'طلب موعد',
    revision: 'طلب تعديل/مراجعة',
    technical: 'مشكلة تقنية',
    deliverable_issue: 'مشكلة في مخرج مسلم',
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const created: SupportTicket = {
      id: `t-${Date.now()}`,
      subject: newSubject,
      category: newCategory,
      status: 'open',
      priority: 'high',
      lastUpdated: 'الآن',
      assignedTo: 'فريق الخدمة والدعم',
    };

    setTickets([created, ...tickets]);
    setNewSubject('');
    setNewDetails('');
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit">
            <MessageSquare className="w-3.5 h-3.5 me-1" />
            مركز المحادثات والدعم المباشر
          </Badge>
          <h1 className="text-2xl font-bold text-white">استفساراتك وتذاكر الخدمة</h1>
          <p className="text-xs text-slate-400">
            توجيه طلباتك وتصنيفها تلقائياً لفريق الخدمة المختص دون الحاجة للرجوع للمبيعات.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>فتح تذكرة / تواصل جديد</span>
        </Button>
      </div>

      {/* Create Ticket Modal Form */}
      {isCreating && (
        <Card className="border-indigo-500/50 bg-indigo-950/20">
          <CardHeader>
            <CardTitle className="text-base text-white">إرسال استفسار أو طلب تعديل جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="عنوان الطلب"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="مثال: طلب تعديل شعار، مشكلة في رابط..."
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300">تصنيف الطلب التلقائي</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-300">تفاصيل الطلب أو الشكوى</label>
                <textarea
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  rows={3}
                  placeholder="اكتب التفاصيل كاملة..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                  إلغاء
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  إرسال الطلب الآن
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tickets Stream */}
      <div className="space-y-3">
        {tickets.map((t) => (
          <Card key={t.id} className="hover:border-indigo-500/40 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-indigo-400 mt-1 shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{t.subject}</h4>
                    <Badge variant="default" className="text-[10px]">
                      {categoryLabels[t.category]}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    المسؤول: <b>{t.assignedTo}</b> • آخر تحديث: {t.lastUpdated}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={
                    t.status === 'resolved' ? 'success' : t.status === 'in_progress' ? 'warning' : 'outline'
                  }
                  className="text-[10px]"
                >
                  {t.status === 'resolved' ? 'تم الرد والإغلاق' : t.status === 'in_progress' ? 'قيد المتابعة' : 'جديد'}
                </Badge>
                <Button variant="outline" size="sm" className="text-xs">
                  عرض التفاصل
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
