import { TimelineEvent } from '../types/timeline';

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 'evt-1',
    organizationId: 'org-1',
    category: 'FINANCE',
    eventType: 'PAYMENT_RECEIVED',
    title: 'تم استلام الدفعة الأولى للاشتراك',
    description: 'تم تأكيد تحويل مبلغ 1,200.00 ريال بنجاح لحساب الفاتورة رقم #INV-9284.',
    actor: {
      id: 'cust-102',
      name: 'عبدالرحمن العتيبي',
      type: 'CUSTOMER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120'
    },
    relatedEntity: {
      entityId: 'INV-9284',
      entityType: 'INVOICE',
      entityName: 'فاتورة الاشتراك #9284',
      navigationUrl: '/owner/billing'
    },
    departmentId: 'Finance',
    metadata: {
      beforeState: { status: 'UNPAID', amountDue: 1200 },
      afterState: { status: 'PAID', amountPaid: 1200, transactionRef: 'TXN-90281A' },
      executionTimeMs: 140
    },
    timestamp: '2026-08-20T02:45:00Z',
    severity: 'INFO'
  },
  {
    id: 'evt-2',
    organizationId: 'org-1',
    category: 'AUTOMATION_AI',
    eventType: 'AI_AGENT_ACTION',
    title: 'توليد خطة المحتوى التلقائية بواسطة AI',
    description: 'قام وكيل الذكاء الاصطناعي (Content AI) بتحليل ملف العميل وتوليد مسودة المهام المطلوبة.',
    actor: {
      id: 'agent-content',
      name: 'Content AI Agent',
      type: 'AI_AGENT',
      role: 'مساعد تخطيط المحتوى الذكي'
    },
    relatedEntity: {
      entityId: 'task-302',
      entityType: 'TASK',
      entityName: 'توليد مسودة المحتوى التسويقي',
      navigationUrl: '/employee/tasks'
    },
    departmentId: 'Development',
    metadata: {
      executionTimeMs: 1850,
      modelUsed: 'gpt-4o',
      tokensConsumed: 1420,
      confidenceScore: 0.96,
      afterState: { tasksGeneratedCount: 5, targetAudience: 'المؤسسات المتوسطة' }
    },
    timestamp: '2026-08-20T02:10:00Z',
    severity: 'INFO'
  },
  {
    id: 'evt-3',
    organizationId: 'org-1',
    category: 'CUSTOMER_JOURNEY',
    eventType: 'STAGE_TRANSITION',
    title: 'انتقال العميل إلى مرحلة التنفيذ (Execution)',
    description: 'تم تحويل العميل تلقائياً إلى مرحلة التنفيذ بعد اكتمال متطلبات التهيئة وجلسة التوجيه.',
    actor: {
      id: 'sys-auto',
      name: 'محرك أتمتة المراحل',
      type: 'SYSTEM_AUTOMATION'
    },
    relatedEntity: {
      entityId: 'cust-102',
      entityType: 'CUSTOMER',
      entityName: 'شركة النور المحدودة',
      navigationUrl: '/owner/settings'
    },
    departmentId: 'Execution',
    metadata: {
      beforeState: { stage: 'Setup', tasksCompleted: 4 },
      afterState: { stage: 'Execution', tasksActiveCount: 8 },
      automationRuleId: 'rule-journey-advance-3'
    },
    timestamp: '2026-08-20T01:30:00Z',
    severity: 'INFO'
  },
  {
    id: 'evt-4',
    organizationId: 'org-1',
    category: 'SECURITY_SYSTEM',
    eventType: 'SUSPICIOUS_LOGIN',
    title: 'تنبيه أمان: محاولة دخول من عنوان IP غير مصرح به',
    description: 'تم رصد محاولة تسجيل دخول لحساب موظف من عنوان IP خارج النطاق الجغرافي المعتمد.',
    actor: {
      id: 'emp-40',
      name: 'محمد الشمري',
      type: 'USER',
      role: 'مشرف عمليات',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120'
    },
    relatedEntity: {
      entityId: 'emp-40',
      entityType: 'USER',
      entityName: 'الملف الوظيفي - محمد الشمري',
      navigationUrl: '/owner/settings'
    },
    departmentId: 'IT_Security',
    metadata: {
      ipAttempted: '198.51.100.42',
      locationMatched: 'Frankfurt, DE',
      deviceDetected: 'Chrome / Linux OS',
      beforeState: { allowedRangeOnly: true },
      afterState: { accessBlocked: true, userAlertSent: true }
    },
    timestamp: '2026-08-20T00:15:00Z',
    severity: 'CRITICAL'
  },
  {
    id: 'evt-5',
    organizationId: 'org-1',
    category: 'TASK_DELIVERABLE',
    eventType: 'DELIVERABLE_PUBLISHED',
    title: 'تم نشر تسليم نهائي وقبول المخرج',
    description: 'قام موظف التصميم برفع المخطط البصري النهائي وتم اعتماده تلقائياً بواسطة مراجعة جودة QA.',
    actor: {
      id: 'emp-82',
      name: 'نورة السديري',
      type: 'USER',
      role: 'مصمم جرافيك',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120'
    },
    relatedEntity: {
      entityId: 'del-90',
      entityType: 'DELIVERABLE',
      entityName: 'شعار الهوية البصرية المعتمد',
      navigationUrl: '/client/dashboard'
    },
    departmentId: 'Execution',
    metadata: {
      beforeState: { status: 'IN_REVIEW' },
      afterState: { status: 'PUBLISHED', fileUrl: 'https://cdn.company.os/branding/logo_v2.pdf' }
    },
    timestamp: '2026-08-19T22:45:00Z',
    severity: 'INFO'
  },
  {
    id: 'evt-6',
    organizationId: 'org-1',
    category: 'APPOINTMENT',
    eventType: 'APPOINTMENT_SCHEDULED',
    title: 'جدولة جلسة استراتيجية وتحديد موعد الاستلام',
    description: 'تم تنسيق جلسة مراجعة المخرجات الفنية وتأكيد الموعد المشترك مع العميل.',
    actor: {
      id: 'emp-40',
      name: 'محمد الشمري',
      type: 'USER',
      role: 'مشرف عمليات'
    },
    relatedEntity: {
      entityId: 'app-92',
      entityType: 'APPOINTMENT',
      entityName: 'جلسة مراجعة المخرجات الفنية',
      navigationUrl: '/employee/dashboard'
    },
    departmentId: 'Sales',
    metadata: {
      beforeState: { status: 'TENTATIVE' },
      afterState: { status: 'CONFIRMED', timeSlot: '2026-08-22 10:00 AM' }
    },
    timestamp: '2026-08-19T18:00:00Z',
    severity: 'INFO'
  },
  {
    id: 'evt-7',
    organizationId: 'org-1',
    category: 'TASK_DELIVERABLE',
    eventType: 'SLA_BREACH',
    title: 'تنبيه: تأخر إنجاز المهمة وتجاوز الـ SLA المقررة',
    description: 'تجاوزت المهمة الموكلة للموظف الحد الأقصى لساعات العمل المقررة دون رفع تقرير التقدم.',
    actor: {
      id: 'sys-auto',
      name: 'محرك مراقبة الـ SLA',
      type: 'SYSTEM_AUTOMATION'
    },
    relatedEntity: {
      entityId: 'task-812',
      entityType: 'TASK',
      entityName: 'إعداد تهيئة الخوادم السحابية',
      navigationUrl: '/employee/tasks'
    },
    departmentId: 'Development',
    metadata: {
      delayHours: 6,
      slaLimitHours: 24,
      beforeState: { status: 'IN_PROGRESS', progressPct: 40 },
      afterState: { status: 'OVERDUE', escalationLevel: 1 }
    },
    timestamp: '2026-08-19T15:30:00Z',
    severity: 'WARNING'
  }
];
