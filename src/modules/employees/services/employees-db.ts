import { EmployeeProfile, TrainerAvailability, EmployeePerformance, EmployeeGoal, EmployeeTrainingCourse } from '../types/domain.types';

const INITIAL_EMPLOYEES: EmployeeProfile[] = [
  {
    id: 'emp-owner',
    name: 'م. أحمد العتيبي',
    email: 'ahmed.alotaibi@company.os',
    role: 'owner',
    departmentId: 'dept-management',
    status: 'active',
    joinedAt: '2025-09-01',
    workloadScore: 10,
    assignedCustomersCount: 0,
    activeTasksCount: 0,
    phoneNumber: '01009876500',
    skills: ['الإدارة التنفيذية', 'التخطيط الاستراتيجي', 'تأسيس الشركات'],
    personalGoals: ['توسيع الشركة إقليمياً وجذب المزيد من الاستثمارات'],
  },
  {
    id: 'emp-manager-coaching',
    name: 'خالد عبد الرحمن',
    email: 'khaled@company.os',
    role: 'manager',
    departmentId: 'dept-coaching',
    status: 'active',
    joinedAt: '2025-10-12',
    workloadScore: 50,
    assignedCustomersCount: 5,
    activeTasksCount: 2,
    phoneNumber: '01009876511',
    skills: ['إدارة الفِرَق', 'متابعة أداء الـ KPIs', 'استشارات المبيعات'],
    personalGoals: ['تأهيل كامل فريق المبيعات والكوتشينج للعمل بالذكاء الاصطناعي'],
  },
  {
    id: 'emp-1',
    name: 'عمر مصطفى',
    email: 'omar@company.os',
    role: 'trainer',
    departmentId: 'dept-coaching',
    status: 'active',
    joinedAt: '2026-01-15',
    workloadScore: 75,
    assignedCustomersCount: 3,
    activeTasksCount: 4,
    phoneNumber: '01009876543',
    skills: ['التسويق الرقمي', 'التخطيط الاستراتيجي', 'استشارات AI'],
    personalGoals: ['إتمام إطلاق ٥ مشاريع عملاء هذا الشهر', 'تقليص متوسط زمن التنفيذ لـ ٣٠ دقيقة'],
  },
  {
    id: 'emp-2',
    name: 'أحمد علي',
    email: 'ahmed@company.os',
    role: 'trainer',
    departmentId: 'dept-coaching',
    status: 'active',
    joinedAt: '2026-02-10',
    workloadScore: 40,
    assignedCustomersCount: 1,
    activeTasksCount: 2,
    phoneNumber: '01009876544',
    skills: ['التطوير البرمجي', 'إعداد السيرفرات', 'SEO'],
    personalGoals: ['رفع مستوى رضا عملاء مساحة العمل لـ 98%'],
  },
  {
    id: 'emp-3',
    name: 'منة الله كريم',
    email: 'mennah@company.os',
    role: 'employee',
    departmentId: 'dept-design',
    status: 'active',
    joinedAt: '2026-03-01',
    workloadScore: 20,
    assignedCustomersCount: 0,
    activeTasksCount: 1,
    phoneNumber: '01009876545',
    skills: ['تصميم الهوية', 'تصاميم السوشيال ميديا', 'UI/UX'],
    personalGoals: ['تحديث الهوية البصرية لـ Company OS لتصبح متوافقة مع Vision UI Pro'],
  },
  {
    id: 'emp-4',
    name: 'سهى محمد',
    email: 'soha@company.os',
    role: 'customer_service',
    departmentId: 'dept-support',
    status: 'away',
    joinedAt: '2026-04-05',
    workloadScore: 30,
    assignedCustomersCount: 4,
    activeTasksCount: 3,
    phoneNumber: '01009876546',
    skills: ['حل المشكلات الفنية', 'التواصل الفعال', 'إدارة التذاكر'],
    personalGoals: ['حل تذاكر الدعم الفني في أقل من ساعة واحدة'],
  },
];

const INITIAL_AVAILABILITY: TrainerAvailability[] = [
  {
    employeeId: 'emp-1',
    weeklyDays: [1, 2, 3, 4, 5],
    workingHours: { start: '09:00', end: '17:00' },
    exceptions: [],
    maxCallsPerDay: 5,
    maxCallsPerWeek: 20,
  },
  {
    employeeId: 'emp-2',
    weeklyDays: [1, 2, 3, 4],
    workingHours: { start: '10:00', end: '18:00' },
    exceptions: [],
    maxCallsPerDay: 4,
    maxCallsPerWeek: 15,
  },
];

const INITIAL_PERFORMANCE: EmployeePerformance[] = [
  {
    employeeId: 'emp-1',
    totalCompletedTasks: 18,
    averageVarianceMinutes: 12, // slightly delayed on average
    completionRate: 94,
    history: [
      { taskId: 'task-hist-1', title: 'مكالمة انطلاق سارة حسام', actualDurationMinutes: 50, expectedDurationMinutes: 45, varianceMinutes: 5, completedAt: '2026-08-03' },
      { taskId: 'task-hist-2', title: 'مراجعة أهداف خالد فتنس', actualDurationMinutes: 40, expectedDurationMinutes: 30, varianceMinutes: 10, completedAt: '2026-08-10' },
      { taskId: 'task-hist-3', title: 'شراء دومين نور ستور', actualDurationMinutes: 20, expectedDurationMinutes: 15, varianceMinutes: 5, completedAt: '2026-08-06' },
    ],
  },
  {
    employeeId: 'emp-3',
    totalCompletedTasks: 12,
    averageVarianceMinutes: -5, // faster than expected!
    completionRate: 100,
    history: [
      { taskId: 'task-hist-4', title: 'تصميم لوجو السماك', actualDurationMinutes: 90, expectedDurationMinutes: 120, varianceMinutes: -30, completedAt: '2026-08-11' },
    ],
  },
];

const INITIAL_GOALS: EmployeeGoal[] = [
  { id: 'goal-1', employeeId: 'emp-1', title: 'إتمام مكالمات الانطلاق', target: 5, actual: 3, unit: 'مكالمات', period: 'weekly', status: 'pending' },
  { id: 'goal-2', employeeId: 'emp-1', title: 'تحديث دليل SOP القسم', target: 1, actual: 1, unit: 'دليل', period: 'monthly', status: 'achieved' },
  { id: 'goal-3', employeeId: 'emp-3', title: 'إنتاج تصاميم سوشيال ميديا', target: 20, actual: 24, unit: 'تصميم', period: 'weekly', status: 'achieved' },
];

const INITIAL_COURSES: EmployeeTrainingCourse[] = [
  { id: 'course-1', title: 'دورة استشارات الذكاء الاصطناعي التوليدي', description: 'كيفية توظيف وتطبيق الـ Prompt Engineering لصالح الشركات التشغيلية.', durationHours: 12, progress: 75, status: 'enrolled' },
  { id: 'course-2', title: 'دورة إدارة مسارات العملاء الرقمية', description: 'المنهجية الفعالة لإدارة SLA وتتبع رحلة العميل.', durationHours: 8, progress: 100, status: 'completed', certificateUrl: 'https://credentials.os/cert-8492' },
];

export class EmployeesDB {
  static get<T>(key: string, initial: T): T {
    const data = localStorage.getItem(`cos_emp_${key}`);
    if (!data) {
      localStorage.setItem(`cos_emp_${key}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  static set<T>(key: string, value: T): void {
    localStorage.setItem(`cos_emp_${key}`, JSON.stringify(value));
  }

  static getEmployees() {
    let list = this.get('employees', INITIAL_EMPLOYEES);
    if (!list.some(e => e.role === 'owner')) {
      list = [...INITIAL_EMPLOYEES, ...list.filter(e => !INITIAL_EMPLOYEES.some(i => i.id === e.id))];
      this.saveEmployees(list);
    }
    return list;
  }
  static saveEmployees(e: EmployeeProfile[]) { this.set('employees', e); }

  static getAvailability() { return this.get('avail', INITIAL_AVAILABILITY); }
  static saveAvailability(a: TrainerAvailability[]) { this.set('avail', a); }

  static getPerformance() { return this.get('perf', INITIAL_PERFORMANCE); }
  static savePerformance(p: EmployeePerformance[]) { this.set('perf', p); }

  static getGoals() { return this.get('goals', INITIAL_GOALS); }
  static saveGoals(g: EmployeeGoal[]) { this.set('goals', g); }

  static getCourses() { return this.get('courses', INITIAL_COURSES); }
  static saveCourses(c: EmployeeTrainingCourse[]) { this.set('courses', c); }
}
