import { Customer, CustomerInvite, CustomerTask, CustomerAppointment, CustomerDeliverable, CustomerSupportTicket } from '../types/domain.types';

// Pre-populated mock data
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    organizationId: 'org-1',
    userId: 'usr-client-1',
    name: 'سارة حسام',
    email: 'sara@joe.co',
    whatsapp: '01234567890',
    companyName: 'Sara Hossam Marketing',
    currentStage: 'kickoff_call',
    progress: 45,
    health: 'at_risk',
    healthReason: ['٣ مهام متأخرة', 'لم تحضر آخر مكالمة استشارية'],
    joinedAt: '2026-08-01',
    expectedDeliveryDate: '2026-09-15',
    assignedTrainerId: 'Omar',
  },
  {
    id: 'cust-2',
    organizationId: 'org-1',
    userId: 'usr-client-2',
    name: 'نور ستور',
    email: 'nour@store.co',
    whatsapp: '01234567891',
    companyName: 'Nour Store',
    currentStage: 'setup',
    progress: 60,
    health: 'healthy',
    joinedAt: '2026-08-05',
    expectedDeliveryDate: '2026-09-20',
    assignedTrainerId: 'Ahmed',
  },
  {
    id: 'cust-3',
    organizationId: 'org-1',
    userId: 'usr-client-3',
    name: 'خالد فتنس',
    email: 'khaled@fitness.co',
    whatsapp: '01234567892',
    companyName: 'Khaled Fitness',
    currentStage: 'execution',
    progress: 80,
    health: 'healthy',
    joinedAt: '2026-08-10',
    expectedDeliveryDate: '2026-09-05',
    assignedTrainerId: 'Mennah',
  },
  {
    id: 'cust-4',
    organizationId: 'org-1',
    userId: 'usr-client-4',
    name: 'منى بيوتي',
    email: 'mona@beauty.co',
    whatsapp: '01234567893',
    companyName: 'Mona Beauty',
    currentStage: 'registration',
    progress: 10,
    health: 'attention',
    healthReason: ['لم تكمل استبيان البيانات الأساسية للشركة'],
    joinedAt: '2026-08-18',
    expectedDeliveryDate: '2026-10-01',
    assignedTrainerId: 'Omar',
  },
];

const INITIAL_INVITES: CustomerInvite[] = [
  {
    id: 'inv-1',
    organizationId: 'org-1',
    inviteCode: 'INV-SARA-482',
    customerEmail: 'sara@joe.co',
    expiresAt: '2026-09-30T00:00:00Z',
    status: 'used',
    usedAt: '2026-08-01T12:00:00Z',
  },
  {
    id: 'inv-2',
    organizationId: 'org-1',
    inviteCode: 'INV-DEMO-999',
    expiresAt: '2026-09-30T00:00:00Z',
    status: 'valid',
  },
];

const INITIAL_TASKS: CustomerTask[] = [
  {
    id: 'task-1',
    customerId: 'cust-1',
    title: '1. شراء وتسجيل النطاق (Domain)',
    description: 'شراء الدومين الخاص بالشركة وربطه بنظام الهوية السحابية.',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-08-10',
    createdAt: '2026-08-02',
    acceptedAt: '2026-08-03T10:00:00Z',
    completedAt: '2026-08-03T12:22:00Z',
    isRequired: true,
    stage: 'onboarding',
    comments: [
      { id: 'c1', authorName: 'يوسف الشريف', text: 'تم شراء الدومين وحجز السيرفر بنجاح وتوجيه DNS.', createdAt: '02:30 م' }
    ]
  },
  {
    id: 'task-2',
    customerId: 'cust-1',
    title: '2. رفع الشعار والهوية البصرية',
    description: 'رفع ملفات اللوجو بالصيغ المعتمدة ومقاييس الألوان والخطوط.',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-08-15',
    createdAt: '2026-08-02',
    completedAt: '2026-08-05T14:10:00Z',
    isRequired: true,
    stage: 'kickoff_call',
    comments: [
      { id: 'c2', authorName: 'سارة حسام', text: 'تم إرفاق ملفات الهوية بدقة عالية.', createdAt: '04:15 م' }
    ]
  },
  {
    id: 'task-3',
    customerId: 'cust-1',
    title: '3. ملء استبيان معلومات الشركة',
    description: 'تعبئة استمارة البيانات التسويقية وقنوات الاتصال المستهدفة.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-08-17',
    createdAt: '2026-08-02',
    isRequired: true,
    stage: 'setup',
  },
  {
    id: 'task-4',
    customerId: 'cust-1',
    title: '4. ربط وتأكيد حسابات السوشيال ميديا',
    description: 'توثيق حسابات انستغرام، فيسبوك وتيك توك مع كلمات المرور والـ API.',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-08-20',
    createdAt: '2026-08-02',
    isRequired: true,
    stage: 'execution',
  },
  {
    id: 'task-5',
    customerId: 'cust-1',
    title: '5. إطلاق الحملة التسويقية وتسليم المشروع',
    description: 'مراجعة كافة التسليمات وإطلاق الحملات واختبار التحويلات.',
    status: 'pending',
    priority: 'critical',
    dueDate: '2026-08-25',
    createdAt: '2026-08-02',
    isRequired: true,
    stage: 'delivery',
  },
];

const INITIAL_APPOINTMENTS: CustomerAppointment[] = [
  { id: 'app-1', customerId: 'cust-1', staffId: 'Omar', type: 'kickoff_call', startsAt: '2026-08-03T10:00:00Z', endsAt: '2026-08-03T10:45:00Z', status: 'completed', meetingLink: 'https://zoom.us/j/123456789' },
  { id: 'app-2', customerId: 'cust-1', staffId: 'Omar', type: 'consultation', startsAt: '2026-08-25T11:00:00Z', endsAt: '2026-08-25T11:45:00Z', status: 'scheduled', meetingLink: 'https://zoom.us/j/987654321' },
];

const INITIAL_DELIVERABLES: CustomerDeliverable[] = [
  { id: 'del-1', customerId: 'cust-1', stage: 'setup', title: 'دليل الهوية البصرية المتكامل', type: 'deliverable_package', status: 'delivered', storageRefOrUrl: 'https://drive.google.com/drive/folders/identity-sara', version: 1, createdAt: '2026-08-10T12:00:00Z', description: 'يحتوي الملف على الخطوط، الأكواد اللونية وشعارات السوشيال ميديا.' },
  { id: 'del-2', customerId: 'cust-1', stage: 'setup', title: 'بيانات حسابات الاستضافة', type: 'access_credential', status: 'delivered', storageRefOrUrl: 'https://hostinger.com', version: 1, createdAt: '2026-08-11T12:00:00Z', description: 'بيانات لوحة تحكم السيرفر والدومين.', credentialsUsername: 'sara@joe.co', credentialsCiphertext: '••••••••••••••••' },
];

const INITIAL_TICKETS: CustomerSupportTicket[] = [
  {
    id: 'tkt-1',
    customerId: 'cust-1',
    customerName: 'سارة حسام',
    subject: 'خلل في رابط الدومين المربوط بالسيرفر',
    description: 'الدومين يظهر خطأ 404 عند الفتح بعد ربطه بالسيرفر الرئيسي، يرجى التوجيه العاجل.',
    category: 'technical',
    priority: 'critical',
    status: 'in_progress',
    createdAt: '2026-08-18T14:30:00Z',
    updatedAt: '2026-08-18T15:00:00Z',
    assignedStaffName: 'يوسف الشريف (منفذ)',
    attachments: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
    ],
    replies: [
      { id: 'r1', authorName: 'سارة حسام', authorRole: 'client', text: 'رابط الدومين مش شغال معايا من إمبارح بيجيب صفحة بيضاء.', createdAt: '2026-08-18T14:30:00Z' },
      { id: 'r2', authorName: 'يوسف الشريف (منفذ)', authorRole: 'staff', text: 'أهلاً سارة، جاري فحص سجلات DNS وتوجيه الـ CNAME على سيرفر Cloudflare. سنبلغك فور الاعتماد.', createdAt: '2026-08-18T15:00:00Z' },
    ],
  },
  {
    id: 'tkt-2',
    customerId: 'cust-1',
    customerName: 'سارة حسام',
    subject: 'استفسار عن الفاتورة الشهرية للخدمات',
    description: 'نحتاج توضيح التفاصيل المالية المدرجة في فاتورة استضافة هذا الشهر.',
    category: 'financial',
    priority: 'medium',
    status: 'open',
    createdAt: '2026-08-19T09:15:00Z',
    updatedAt: '2026-08-19T09:15:00Z',
    assignedStaffName: 'سهى محمد (المحاسبة)',
    replies: [
      { id: 'r3', authorName: 'سارة حسام', authorRole: 'client', text: 'ممكن توضيح بند خدمات التحسين الإضافية بالفاتورة؟', createdAt: '2026-08-19T09:15:00Z' }
    ],
  }
];

export class CustomersDB {
  static get<T>(key: string, initial: T): T {
    const data = localStorage.getItem(`cos_${key}`);
    if (!data) {
      localStorage.setItem(`cos_${key}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  static set<T>(key: string, value: T): void {
    localStorage.setItem(`cos_${key}`, JSON.stringify(value));
  }

  static getCustomers() { return this.get('customers', INITIAL_CUSTOMERS); }
  static saveCustomers(c: Customer[]) { this.set('customers', c); }

  static getInvites() { return this.get('invites', INITIAL_INVITES); }
  static saveInvites(i: CustomerInvite[]) { this.set('invites', i); }

  static getTasks() { return this.get('tasks', INITIAL_TASKS); }
  static saveTasks(t: CustomerTask[]) { this.set('tasks', t); }

  static getAppointments() { return this.get('appointments', INITIAL_APPOINTMENTS); }
  static saveAppointments(a: CustomerAppointment[]) { this.set('appointments', a); }

  static getDeliverables() { return this.get('deliverables', INITIAL_DELIVERABLES); }
  static saveDeliverables(d: CustomerDeliverable[]) { this.set('deliverables', d); }

  static getTickets() { return this.get('tickets', INITIAL_TICKETS); }
  static saveTickets(t: CustomerSupportTicket[]) { this.set('tickets', t); }
}
