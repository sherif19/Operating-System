import { KPIOverview, InteractiveReport, DepartmentHealth, CustomerHealthOverview } from '../types/domain.types';

const INITIAL_OVERVIEW: KPIOverview = {
  companyHealth: 88,
  revenue: 482300,
  expenses: 124000,
  netIncome: 358300,
  openTasks: 42,
  completedTasks: 185,
  delayedTasks: 3,
  avgExecutionMinutes: 142,
  slaComplianceRate: 94,
  activeCustomers: 32,
  atRiskCustomers: 2,
  aiSessionsCount: 540,
  aiAcceptanceRate: 86,
};

const INITIAL_REPORTS: InteractiveReport[] = [
  {
    id: 'rep-weekly-1',
    title: 'التقرير التنفيذي الأسبوعي — الأسبوع الثالث من أغسطس',
    createdAt: '2026-08-19',
    period: 'weekly',
    summary: 'أداء تشغيلي قوي مع زيادة بنسبة 12% في الإيرادات المحققة. يوجد تأخير بسيط في تسليمات قسم التصميم نتيجة ضغط المهام الجاري مراجعته.',
    planVsActual: [
      { indicator: 'المهام المنجزة', planned: 50, actual: 48, variance: '-4%', trend: 'stable' },
      { indicator: 'التسليمات المكتملة', planned: 20, actual: 22, variance: '+10%', trend: 'up' },
      { indicator: 'الإيرادات المحققة', planned: 450000, actual: 482300, variance: '+7.1%', trend: 'up' },
      { indicator: 'العملاء النشطون', planned: 30, actual: 32, variance: '+6.6%', trend: 'up' },
    ],
    risks: [
      { severity: 'warning', source: 'قسم التصميم', description: 'تأخر 3 مهام عن وقت التسليم المتوقع بسبب زيادة الحمل على المصممين.' },
      { severity: 'critical', source: 'المشروعات', description: 'عميلة متعثرة Mona Beauty متأخرة في مرحلة Kickoff call بنحو 4 أيام.' },
    ],
    recommendations: [
      'تعيين مدرب مساند لتسريع مكالمة Kickoff للعميلة Mona Beauty.',
      'تحويل مهام التصميم البسيطة لمصمم مساعد لتخفيف العبء عن رئيس قسم التصميم.',
    ],
  },
];

const INITIAL_DEPTS: DepartmentHealth[] = [
  { id: 'Marketing', name: 'قسم التسويق والنمو', healthScore: 92, openTasks: 12, delayedTasks: 0, avgDurationMinutes: 110, workloadRate: 75, status: 'healthy' },
  { id: 'Sales', name: 'قسم المبيعات والصفقات', healthScore: 95, openTasks: 8, delayedTasks: 0, avgDurationMinutes: 85, workloadRate: 60, status: 'healthy' },
  { id: 'Execution', name: 'قسم التنفيذ والمتابعة', healthScore: 84, openTasks: 18, delayedTasks: 1, avgDurationMinutes: 195, workloadRate: 85, status: 'attention' },
  { id: 'Support', name: 'الدعم الفني المباشر', healthScore: 72, openTasks: 4, delayedTasks: 2, avgDurationMinutes: 240, workloadRate: 90, status: 'at_risk' },
];

const INITIAL_CUSTOMERS: CustomerHealthOverview[] = [
  { id: 'cust-1', name: 'صالون سارة حسام', stage: 'execution', progress: 65, healthStatus: 'healthy', reason: 'جميع المهام تسير بانتظام تام ولا توجد تذاكر دعم معلقة.' },
  { id: 'cust-2', name: 'عيادات Mona Beauty', stage: 'kickoff_call', progress: 15, healthStatus: 'at_risk', reason: 'لم يتم تفعيل مكالمة الانطلاق وتخطي الـ SLA بـ 48 ساعة.' },
];

export class ReportsDB {
  static get<T>(key: string, initial: T): T {
    const data = localStorage.getItem(`cos_rep_${key}`);
    if (!data) {
      localStorage.setItem(`cos_rep_${key}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  static set<T>(key: string, value: T): void {
    localStorage.setItem(`cos_rep_${key}`, JSON.stringify(value));
  }

  static getOverview() { return this.get('overview', INITIAL_OVERVIEW); }
  static saveOverview(o: KPIOverview) { this.set('overview', o); }

  static getReports() { return this.get('list', INITIAL_REPORTS); }
  static saveReports(r: InteractiveReport[]) { this.set('list', r); }

  static getDepts() { return this.get('depts', INITIAL_DEPTS); }
  static saveDepts(d: DepartmentHealth[]) { this.set('depts', d); }

  static getCustomers() { return this.get('custs', INITIAL_CUSTOMERS); }
  static saveCustomers(c: CustomerHealthOverview[]) { this.set('custs', c); }
}
